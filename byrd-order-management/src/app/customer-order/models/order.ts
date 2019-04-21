import { OrderItem } from './order-item';
import { Customer } from './customer';
import { Delivery } from './Delivery';
import { ChargeCustomer } from './charge-customer';
import * as _ from 'lodash';
import { Price } from './price';

export class Order {
    id: string;
    recipient: Customer;
    created_at: string;
    items: OrderItem[];
    delivery: Delivery;
    charge_customer: ChargeCustomer;
    get totalPrice():Price {
        let orderItemWithAggregatedTotal: OrderItem = {
            id: '',
            name: '',
            quantity: 0,
            total_price: {
                amount: '0',
                currency: '',
            }
        };
        if (this.items && this.items.length > 0) {
            orderItemWithAggregatedTotal = this.items.reduce((acc: OrderItem, cur: OrderItem) => {
                if (cur.total_price && cur.total_price.amount && cur.total_price.currency) {
                    acc.total_price.amount = (parseFloat(acc.total_price.amount) + parseFloat(cur.total_price.amount)).toString();
                    acc.total_price.currency = cur.total_price.currency;
                }
                return acc;
            }, orderItemWithAggregatedTotal
            );
        }
        return orderItemWithAggregatedTotal.total_price;
    }
    constructor(input: any) {
        _.merge(this, input);
        return this;
    }
}