import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { AppService } from 'src/app/services/app.service';
import { Attachments } from 'src/app/services/models/Attachments';
import { Service } from 'src/app/services/models/Product';
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

      });
    } else {
      this.pickedImage = this.service?.image;
      this.serviceForm = new UntypedFormGroup({
        name: new FormControl(this.service?.name, [Validators.required]),

      });
    }
  }

  submit() {
    if (this.serviceForm.invalid) {
      this.appService.showError('merci de bien remplir le formulaire');
      return;
    }
    const product = {
      ...this.serviceForm.value,
    } as Service;

    console.log(product);
    if (this.mode === 'create') {
      this.ServiceService.createService(product).then(res => {
        if (res) {
          this.appService.showSuccess('Produit créé avec succès');
        } else {
          this.appService.showError('Une erreur est survenue');
        }
        this.doAction();
      });
    } else {
      this.ServiceService.updateService({ ...product, id: this.service?.id as any }).then(res => {
        if (res) {
          this.appService.showSuccess('Produit modifié avec succès');
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
    const file = event.target.file;
    const attachements = await this.ServiceService.uploadFiles([file]);
    if (attachements) {
      this.pickedImage = attachements[0].url;
    }
    this.loading = false;
  }

  removeImg() {
    this.pickedImage = undefined;
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
