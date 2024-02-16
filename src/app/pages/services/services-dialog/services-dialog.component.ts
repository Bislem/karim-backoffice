import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormControl, FormGroup, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { AppService } from 'src/app/services/app.service';
import { Attachments } from 'src/app/services/models/Attachments';
import { Service } from 'src/app/services/models/Service';
import { User } from 'src/app/services/models/User';
import { ServicesService } from '../services.service';

@Component({
  selector: 'app-services-dialog',
  templateUrl: './services-dialog.component.html',
  styleUrls: ['./services-dialog.component.scss']
})
export class ServicessDialogComponent implements OnInit {
  title: string;
  mode: 'create' | 'update';
  service?: Service;
  serviceForm: UntypedFormGroup;
  loading = false;

  pickedImage: string | undefined;
  pickedIcon: string | undefined;
  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ServicessDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { service?: Service, mode: 'create' | 'update', title: string },
    private appService: AppService,
    private ServiceService: ServicesService
  ) {
    this.mode = data.mode;
    this.service = data.service;
    this.title = data.title
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    if (this.mode === 'create') {
      this.serviceForm = new UntypedFormGroup({
        name: new FormControl(null, [Validators.required]),
        publish: new FormControl(false, [Validators.required]),
        data: new FormArray([
          new FormGroup({
            label: new FormControl(null, [Validators.required]),
            value: new FormControl(null, [Validators.required]),
          })
        ], [Validators.maxLength(4)]),
        pricing: new FormArray([
          new FormGroup({
            price: new FormControl(null, [Validators.required]),
            name: new FormControl(null, [Validators.required]),
            cta: new FormControl(null,),
            data: new FormArray([
              new FormGroup({
                label: new FormControl(null, [Validators.required]),
                value: new FormControl(null, [Validators.required]),
              })
            ],),
          })
        ],),

      });
    } else {
      this.pickedImage = this.service?.cover;
      this.pickedIcon = this.service?.icon;
      if (this.data.service) {
        this.serviceForm = new UntypedFormGroup({
          name: new FormControl(this.data.service.name, [Validators.required]),
          publish: new FormControl(this.data.service.publish, [Validators.required]),
          data: new FormArray([
            ...this.data.service.data.map(item => (
              new FormGroup({
                label: new FormControl(item.label, [Validators.required]),
                value: new FormControl(item.value, [Validators.required]),
              })
            ))
          ], [Validators.maxLength(4)]),
          pricing: new FormArray([
            ...this.data.service.pricing.map(item => (
              new FormGroup({
                price: new FormControl(item.price, [Validators.required]),
                name: new FormControl(item.name, [Validators.required]),
                cta: new FormControl(item.cta,),
                data: new FormArray([
                  ...item.data.map(d => (
                    new FormGroup({
                      label: new FormControl(d.label, [Validators.required]),
                      value: new FormControl(d.value, [Validators.required]),
                    })
                  ))
                ],),
              })
            ))
          ],),
        });
      }
    }
  }

  get dataValue() {
    return this.serviceForm.get('data') as FormArray<any>;
  }


  get pricingValue() {
    return this.serviceForm.get('pricing') as FormArray;
  }

  getDataValueForPricing(index: number) {
    const formArray = this.serviceForm.get('pricing') as FormArray;
    const item = formArray.at(index) as FormGroup;
    return item.get('data') as FormArray;
  }

  addData() {
    this.dataValue.push(new FormGroup({
      label: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required]),
    }))
  }

  removeData(index: number) {
    this.dataValue.removeAt(index);
  }

  addPricing() {
    this.pricingValue.push(new FormGroup({
      price: new FormControl(null, [Validators.required]),
      name: new FormControl(null, [Validators.required]),
      cta: new FormControl(null,),
      data: new FormArray([
        new FormGroup({
          label: new FormControl(null, [Validators.required]),
          value: new FormControl(null, [Validators.required]),
        })
      ],),
    }))
  }

  removePricing(index: number) {
    this.pricingValue.removeAt(index);
  }

  addPricingData(index: number) {
    const item = this.pricingValue.at(index);
    const formArray = item.get('data') as FormArray;
    formArray.push(new FormGroup({
      label: new FormControl(null, [Validators.required]),
      value: new FormControl(null, [Validators.required]),
    }));
  }

  removePricingData(parentIndex: number, index: number) {
    const item = this.pricingValue.at(parentIndex);
    const formArray = item.get('data') as FormArray;
    formArray.removeAt(index);
  }


  submit() {
    if (this.serviceForm.invalid) {
      this.appService.showError('Please fill the form');
      return;
    }

    if (!this.pickedIcon) {
      this.appService.showError('Please upload an image for the service icon');
      return;
    }
    if (!this.pickedImage) {
      this.appService.showError('Please upload an image for the cover');
      return;
    }
    const product = {
      ...this.serviceForm.value,
      cover: this.pickedImage,
      icon: this.pickedIcon,
    } as Service;

    console.log(product);
    if (this.mode === 'create') {
      this.ServiceService.createService(product).then(res => {
        if (res) {
          this.appService.showSuccess('service créé avec succès');
        } else {
          this.appService.showError('Une erreur est survenue');
        }
        this.doAction();
      });
    } else {
      this.ServiceService.updateService({ ...product, id: this.service?.id as any }).then(res => {
        if (res) {
          this.appService.showSuccess('service modifié avec succès');
        } else {
          this.appService.showError('Une erreur est survenue');
        }
        this.doAction();
      });
    }
  }

  doAction(): void {
    this.dialogRef.close({ event: 'submit' });
  }

  closeDialog(): void {
    this.dialogRef.close({ event: 'Cancel' });
  }

  async filePicked(event: any) {
    this.loading = true;
    const files = event.target.files;
    const attachements = await this.ServiceService.uploadFiles(files);
    if (attachements) {
      this.pickedImage = attachements[0].url;
    }
    this.loading = false;
  }

  async filePicked2(event: any) {
    this.loading = true;
    const files = event.target.files;
    const attachements = await this.ServiceService.uploadFiles(files);
    if (attachements) {
      this.pickedIcon = attachements[0].url;
    }
    this.loading = false;
  }

  removeImg() {
    this.pickedImage = undefined;
  }

  removeImg2() {
    this.pickedIcon = undefined;
  }

  async deleteProduct() {
    const yes = await this.appService.openConfirmationDialog('voulez-vous supprimer ce produit ?', this.service?.name);
    if (yes) {
      const res = await this.ServiceService.deleteService(this.service as Service);
      if (res) {
        this.appService.showSuccess('Service supprimé avec succès');
        this.doAction();
      } else {
        this.appService.showError('Service non supprimé, une erreur s\'est produite');
      }
    }
  }

}
