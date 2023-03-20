import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { CustomerTestComponent } from './customer-test/customer-test.component';
import { CustomerHomeComponent } from './customer-home/customer-home.component';
import { CustomerHeaderComponent } from './customer-header/customer-header.component';

// const routes: Routes = [
//   {
//     path: ''
//   }
// ];

const routes: Routes = [
  {
    path: '',
    component: CustomerHomeComponent,
    children: [
      {
        path: 'test',
        component: CustomerTestComponent
      }
    ]
  }
]


@NgModule({
  declarations: [
    CustomerTestComponent,
    CustomerHomeComponent,
    CustomerHeaderComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ]
})
export class CustomerComponentModule { }
