import { inject, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResolveFn, RouterModule, Routes } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import * as TablerIcons from 'angular-tabler-icons/icons';
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ProductsService } from './products.service';
import { Product } from 'src/app/services/models/Product';
import { ProductsComponent } from './products.component';
import { ProductsDialogComponent } from './products-dialog/products-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const productResolver: ResolveFn<Product[]> = (route, state) => {
  return inject(ProductsService).getAllProducts();
}

const routes: Routes = [
  {
    path: '',
    component: ProductsComponent,
    resolve: { main: productResolver },
    data: {
      title: 'Gestion des produits'
    }
  }
]


@NgModule({
  declarations: [
    ProductsComponent,
    ProductsDialogComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MatFormFieldModule,
    FormsModule, 
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    TablerIconsModule.pick(TablerIcons),
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatDialogModule,
    MatSelectModule,
    MatDatepickerModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule


  ],
  exports:[
    RouterModule
  ]
})
export class ProductsModule { }
