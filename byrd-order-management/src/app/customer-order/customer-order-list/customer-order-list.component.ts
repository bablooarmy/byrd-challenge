import { Component, OnInit, OnDestroy } from '@angular/core';
import { Customer } from '../models/customer';
import { Order } from '../models/order';
import { Subscription } from 'rxjs';
import { CustomerOrderService } from '../services/customer-order.service';
import { FormGroup } from '@angular/forms';
import { OrderSearchByDateRange } from '../models/order-search-by-date-range';
import { Tile } from '../interfaces/tile';
import { Price } from '../models/price';
import { ChargeCustomer } from '../models/charge-customer';

@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html',
  styleUrls: ['./customer-order-list.component.scss']
})
export class CustomerOrderListComponent implements OnInit, OnDestroy {
  public customers: Customer[];
  public orders: Order[];
  public totalInvoice: Order;
  private customerSubscription: Subscription;
  private orderSubscription: Subscription;
  public customerOrderForm: FormGroup;
  public selectedFromDate:string;
  public selectedToDate:string;
  public totalNumberOfDays:number;
  public totalOrders:number;

  public tiles: Tile[] = [
    { cols: 1, rows: 1, color: 'lightblue' },
    { cols: 1, rows: 1, color: 'lightgreen' },
    { cols: 2, rows: 1, color: 'lightpink' },
    { cols: 4, rows: 1, color: '#DDBDF1' },
  ];

  constructor(private customerOrderService: CustomerOrderService) {
    this.customerOrderForm = this.customerOrderService.customerOrderForm;
  }

  ngOnInit() {
    this.setInitialTotalInvoice();
    this.populateCustomers();
  }

  populateCustomers() {
    this.customerSubscription = this.customerOrderService.getCustomers().subscribe((res: Customer[]) => {
      this.customers = res;
    });
  }

  setInitialTotalInvoice(){
    this.totalInvoice = {
      charge_customer: {
        currency: '',
        total_price: '0'
      },
      created_at: '',
      delivery: {
        courier: '',
        method: ''
      },
      id: '',
      items: [],
      recipient: {
        email: '',
        id: '',
        name: ''
      },
      totalPrice: {
        amount: '',
        currency: ''
      }
    };
  }

  onCustomerOrderFormSubmit() {
    if (this.customerOrderForm.valid) {
      this.orderSubscription = this.customerOrderService.getOrdersByDateRange(this.customerOrderForm.value as OrderSearchByDateRange).subscribe((res: Order[]) => {
        this.orders = res;
        this.totalOrders = res.length;
        this.calculateTotalInvoice(this.orders);
        this.manipulateTopBannerInfo(this.customerOrderForm.value as OrderSearchByDateRange);
      });
    }
  }

  calculateTotalInvoice(orders:Order[]){
    this.setInitialTotalInvoice();
    this.totalInvoice = orders.reduce((acc: Order, cur: Order) => {
      if (cur.charge_customer && cur.charge_customer.total_price && cur.charge_customer.currency) {
        acc.charge_customer.total_price = (parseInt(acc.charge_customer.total_price) + parseInt(cur.charge_customer.total_price)).toString();
        acc.charge_customer.currency = cur.charge_customer.currency;
      }
      return acc;
    }, this.totalInvoice)
  }

  manipulateTopBannerInfo(formdata:OrderSearchByDateRange){
    this.selectedFromDate = formdata.fromDate;
    this.selectedToDate = formdata.toDate;
    const fromDateObj = new Date(formdata.fromDate);
    const toDateObj = new Date(formdata.toDate);
    this.totalNumberOfDays = (toDateObj.getTime() - fromDateObj.getTime())/1000/60/60/24;
  }

  ngOnDestroy() {
    if (this.customerSubscription) {
      this.customerSubscription.unsubscribe();
    }
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

}
