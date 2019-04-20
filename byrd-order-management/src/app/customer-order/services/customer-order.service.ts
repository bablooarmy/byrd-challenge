import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { Order } from '../models/order';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { OrderSearchByDateRange } from '../models/order-search-by-date-range';

@Injectable({
  providedIn: 'root'
})
export class CustomerOrderService {

  constructor(private httpClient: HttpClient) { }

  public customerOrderForm:FormGroup = new FormGroup({
    customerId: new FormControl('', Validators.required),
    fromDate: new FormControl('', Validators.required),
    toDate:   new FormControl('', Validators.required)
  })

  /**
   * purpose: retrive all customers through REST API XHR call
   * params: void
   * return: array of customer objects
  */
  getCustomers(): Observable<Customer[]> {
    return this.httpClient.get(environment.customerAPI.list).pipe(map((response: Customer[]) => {
      return response.map((customer: Customer) => new Customer(customer));
    }));

  }

  /**
   * purpose: retrive all orders by date range through REST API XHR call 
   * params: 
   *    customerId  - selected from drop down
   *    fromDate    - choosen from datepicker
   *    toDate      - choosen from datepicker
   * return: array of order objects
  */
  getOrdersByDateRange(searchFormValue:OrderSearchByDateRange): Observable<Order[]> {
    let url = environment.orderAPI.ordersByDateRange;
    if (url.indexOf('.json') === -1) {
      url = url.replace('{0}', searchFormValue.customerId).replace('{1}', searchFormValue.fromDate).replace('{2}', searchFormValue.toDate);
    }
    return this.httpClient.get(url).pipe(map((response: Order[]) => {
      return response.map((order: Order) => new Order(order));
    }));

  }
}
