import { Price } from './price';

export class OrderItem {
    id: string;
    name: string;
    quantity: number;
    total_price: Price;
}