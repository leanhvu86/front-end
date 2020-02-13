import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoAccessComponent } from './no-access/no-access.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NoProductFoundComponent } from './no-product-found/no-product-found.component';


@NgModule({
  declarations: [NoAccessComponent, PageNotFoundComponent, NoProductFoundComponent],
  imports: [
    CommonModule
  ]
})
export class ErrorModule { }

