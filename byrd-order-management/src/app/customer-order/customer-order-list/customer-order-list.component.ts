import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Customer } from '../models/customer';
import { Order } from '../models/order';
import { Subscription } from 'rxjs';
import { CustomerOrderService } from '../services/customer-order.service';
import { FormGroup } from '@angular/forms';
import { OrderSearchByDateRange } from '../models/order-search-by-date-range';
import { Tile } from '../interfaces/tile';
import { Price } from '../models/price';
import { ChargeCustomer } from '../models/charge-customer';
import { IPersistenceComponent } from 'src/app/interfaces/persistence-component';
import { PersistenceService, StorageType } from 'angular-persistence';
import { CustomerOrderViewPersistenceKey } from 'src/app/constants/app.constant';

@Component({
  selector: 'app-customer-order-list',
  templateUrl: './customer-order-list.component.html',
  styleUrls: ['./customer-order-list.component.scss']
})
export class CustomerOrderListComponent implements OnInit, OnDestroy, IPersistenceComponent {
  public customers: Customer[];
  public orders: Order[];
  public totalInvoice: Order;
  private customerSubscription: Subscription;
  private orderSubscription: Subscription;
  public customerOrderForm: FormGroup;
  public selectedFromDate: string;
  public selectedToDate: string;
  public totalNumberOfDays: number;
  public totalOrders: number;
  public showOrderInfo:boolean;

  public tiles: Tile[] = [
    { cols: 1, rows: 1, color: '#adaee6' },
    { cols: 1, rows: 1, color: '#adaee6' },
    { cols: 1, rows: 1, color: '#adaee6' },
    { cols: 3, rows: 1, color: '#c5cae9' },
  ];

  constructor(private customerOrderService: CustomerOrderService, private persistenceService:PersistenceService) {
    this.customerOrderForm = this.customerOrderService.customerOrderForm;
  }

  /**
   * purpose: when component intiaized fetch all customers and popuplate in drop down
   * params: void
   * return: array of customer objects
  */
  ngOnInit() {
    this.setInitialTotalInvoice();
    this.populateCustomers();
  }

  /**
   * purpose: retrive all customers through service and bind to customers property
   * params: void
   * return: void
  */
  populateCustomers() {
    this.customerSubscription = this.customerOrderService.getCustomers().subscribe((res: Customer[]) => {
      this.customers = res;
    });
  }

  /**
   * purpose: retrive form data from session storage after refresh, get all orders of prefilled form data through service and clear session storage
   * params: void
   * return: void
  */
  persistDataAfterRefresh() {
    const orderFormData:OrderSearchByDateRange = this.persistenceService.get(CustomerOrderViewPersistenceKey.CUSTOMER_FORM_DATA, StorageType.SESSION);
    if(orderFormData){
      this.customerOrderForm.patchValue(orderFormData);
      this.onCustomerOrderFormSubmit();
    }
    //clear session data
    this.persistenceService.remove(CustomerOrderViewPersistenceKey.CUSTOMER_FORM_DATA, StorageType.SESSION);
  }

  /**
   * purpose: save form data in session storage before refresh
   * params: void
   * return: void
  */
  persistDataBeforeRefresh() {
    this.persistenceService.set(CustomerOrderViewPersistenceKey.CUSTOMER_FORM_DATA, this.customerOrderForm.value as OrderSearchByDateRange, {type: StorageType.SESSION});
  }

  /**
   * purpose: set initial value of order model and use it to aggregate 
   * total invoice of all orders fetched from rest API
   * params: void
   * return: void
  */
  setInitialTotalInvoice() {
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

  /**
   * purpose: on form submit call this handler and fetch orders from REST API and show top header 
   * with info like total orders, number of days etc.,
   * params: void
   * return: void
  */
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

  /**
   * purpose: get total invoice of orders fetched after form submit
   * params: void
   * return: void
  */
  calculateTotalInvoice(orders: Order[]) {
    this.setInitialTotalInvoice();
    this.totalInvoice = orders.reduce((acc: Order, cur: Order) => {
      if (cur.charge_customer && cur.charge_customer.total_price && cur.charge_customer.currency) {
        acc.charge_customer.total_price = (parseFloat(acc.charge_customer.total_price) + parseFloat(cur.charge_customer.total_price)).toString();
        acc.charge_customer.currency = cur.charge_customer.currency;
      }
      return acc;
    }, this.totalInvoice)
  }

  /**
   * purpose: show top banner information after getting orders on form submit
   * params: void
   * return: void
  */
  manipulateTopBannerInfo(formdata: OrderSearchByDateRange) {
    this.selectedFromDate = formdata.fromDate;
    this.selectedToDate = formdata.toDate;
    const fromDateObj = new Date(formdata.fromDate);
    const toDateObj = new Date(formdata.toDate);
    this.totalNumberOfDays = (toDateObj.getTime() - fromDateObj.getTime()) / 1000 / 60 / 60 / 24;
    this.showOrderInfo = true;
  }

  /**
   * purpose: clear all subscription when component instance gets destroyed
   * params: void
   * return: void
  */
  ngOnDestroy() {
    if (this.customerSubscription) {
      this.customerSubscription.unsubscribe();
    }
    if (this.orderSubscription) {
      this.orderSubscription.unsubscribe();
    }
  }

}
