import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { AppService } from 'src/app/services/app.service';
import { Attachments } from 'src/app/services/models/Attachments';
import { Product } from 'src/app/services/models/Product';
import { User } from 'src/app/services/models/User';
import { ProductsService } from '../products.service';

@Component({
  selector: 'app-products-dialog',
  templateUrl: './products-dialog.component.html',
  styleUrls: ['./products-dialog.component.scss']
})
export class ProductsDialogComponent implements OnInit {
  title: string;
  mode: 'create' | 'update';
  product?: Product;
  productForm: UntypedFormGroup;
  loading = false;

  pickedImages: Attachments[] = [];

  constructor(
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<ProductsDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: { product?: Product, mode: 'create' | 'update', title: string },
    private appService: AppService,
    private productsService: ProductsService
  ) {
    this.mode = data.mode;
    this.product = data.product;
    this.title = data.title
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    if (this.mode === 'create') {
      this.productForm = new UntypedFormGroup({
        name: new FormControl(null, [Validators.required]),
        description: new FormControl(null, [Validators.required]),
        ref: new FormControl(null, [Validators.required]),
        category: new FormControl(null, [Validators.required]),
        allowedLevel: new FormControl(null, [Validators.required]),
        place: new FormControl(null, [Validators.required]),
        price: new FormControl(null, [Validators.required]),
        isExternal: new FormControl(false, [Validators.required]),
        quantity: new FormControl(null, [Validators.required]),
        boughtOn: new FormControl(null, [Validators.required]),
      });
    } else {
      this.pickedImages = [...this.product?.images as any[]] as Attachments[];
      this.productForm = new UntypedFormGroup({
        name: new FormControl(this.product?.name, [Validators.required]),
        description: new FormControl(this.product?.description, [Validators.required]),
        ref: new FormControl(this.product?.ref, [Validators.required]),
        category: new FormControl(this.product?.category, [Validators.required]),
        allowedLevel: new FormControl(this.product?.allowedLevel, [Validators.required]),
        place: new FormControl(this.product?.place, [Validators.required]),
        price: new FormControl(this.product?.price, [Validators.required]),
        isExternal: new FormControl(this.product?.isExternal, [Validators.required]),
        quantity: new FormControl(this.product?.quantity, [Validators.required]),
        boughtOn: new FormControl(this.product?.boughtOn ? new Date(this.product?.boughtOn * 1000) : null, [Validators.required]),
      });
    }
  }

  submit() {
    if (this.productForm.invalid) {
      this.appService.showError('merci de bien remplir le formulaire');
      return;
    }
    const product = {
      ...this.productForm.value,
      quantityPurchased: this.productForm.value.quantity,
      images: JSON.stringify(this.pickedImages),
      boughtOn: moment(this.productForm.value.boughtOn).unix()
    } as Product;

    console.log(product);
    if (this.mode === 'create') {
      this.productsService.createProduct(product).then(res => {
        if (res) {
          this.appService.showSuccess('Produit créé avec succès');
        } else {
          this.appService.showError('Une erreur est survenue');
        }
        this.doAction();
      });
    } else {
      this.productsService.updateProduct({ ...product, id: this.product?.id as any }).then(res => {
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

  async filesPicked(event: any) {
    this.loading = true;
    const files = event.target.files;
    const attachements = await this.productsService.uploadFiles(files);
    if (attachements) {
      for (let att of attachements) {
        this.pickedImages.push(att);
      }
    }
    this.loading = false;
  }

  removeAtt(index: number) {
    this.pickedImages.splice(index, 1);
  }

  async deleteProduct(){
    const yes = await this.appService.openConfirmationDialog('voulez-vous supprimer ce produit ?',this.product?.name);
    if(yes){
      const res = await this.productsService.deleteProduct(this.product as Product);
      if (res) {
        this.appService.showSuccess('Produit supprimé avec succès');
        this.doAction();
      } else {
        this.appService.showError('produit non supprimé, une erreur s\'est produite');
      }
    }
  }

}
