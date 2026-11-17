import { Component, Input } from '@angular/core';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-delivery-tab',
  standalone: true,
  templateUrl: './order-delivery-tab.html',
  styleUrl: '../order-tab.scss'
})
export class OrderDeliveryTab {
  @Input() order!: Order;
}
