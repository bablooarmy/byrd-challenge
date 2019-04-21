import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersistenceModule } from 'angular-persistence';

import { CustomerOrderRoutingModule } from './customer-order-routing.module';
import { CustomerOrderListComponent } from './customer-order-list/customer-order-list.component';
import { CustomerOrderService } from './services/customer-order.service';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
  declarations: [CustomerOrderListComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    CustomerOrderRoutingModule,
    MatSelectModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    PersistenceModule
  ],
  providers: [
    CustomerOrderService
  ]
})
export class CustomerOrderModule { }
