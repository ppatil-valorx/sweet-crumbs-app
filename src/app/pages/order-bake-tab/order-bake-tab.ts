import { Component, Input } from '@angular/core';
import { Order } from '../../models/order';

@Component({
  selector: 'app-order-bake-tab',
  standalone: true,
  templateUrl: './order-bake-tab.html',
  styleUrl: '../order-tab.scss'
})
export class OrderBakeTab {
  @Input() order!: Order;
}
