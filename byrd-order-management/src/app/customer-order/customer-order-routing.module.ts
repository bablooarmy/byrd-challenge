import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerOrderListComponent } from './customer-order-list/customer-order-list.component';

const routes: Routes = [{
  path:'',
  component:CustomerOrderListComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerOrderRoutingModule { }
