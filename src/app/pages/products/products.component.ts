import { Component, ViewChild, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { ProductsService } from './products.service';
import { Product } from 'src/app/services/models/Product';
import { ProductsDialogComponent } from './products-dialog/products-dialog.component';
import { Attachments } from 'src/app/services/models/Attachments';

@Component({
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  searchText: any;

  products: Product[];
  productsSource: Product[];
  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private productsService: ProductsService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    const ps = this.productsService.products.getValue().map((p: Product) => ({
      ...p,
      images: JSON.parse(p.images as string) as Attachments[]
    }) as Product) as Product[];
    this.products = ps;
    this.productsSource = ps;
    this.productsService.products.subscribe(res => {
      console.log(res);
      const ps = res.map(p => ({
        ...p,
        images: JSON.parse(p.images as string) as Attachments[]
      }) as Product) as Product[];
      this.products = ps;
      this.productsSource = ps;
    });

  }

  applyFilter(filterValue: string): void {
    const ps = this.productsSource.filter(p => (p.name.toLowerCase().trim().includes(filterValue.toLowerCase().trim())));
    this.products = ps;
  }

  async openDialog(action: 'create' | 'update', product: Product | null) {
    const dialogRef = this.dialog.open(ProductsDialogComponent, {
      data: {
        product: product,
        mode: action,
        title: action === 'create' ? 'Nouveau Produit' : 'Modifier Produit'
      },
      maxWidth: '700px'
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  getPoster(images: any) {
    return images[0].url;
  }

}

