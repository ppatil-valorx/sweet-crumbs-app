
import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { OrderService } from '../../services/order';
import { ActivityLogService } from '../../services/activity-log';
import { Order, OrderStatus, Town } from '../../models/order';

@Component({
  selector: 'app-orders-page',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './orders-page.html',
  styleUrl: './orders-page.scss'
})
export class OrdersPage implements OnInit {

  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private loadRequestId = 0;

  activityLog = inject(ActivityLogService);

  orders: Order[] = [];

  loadingOrders = false;
  ordersError = '';

  searchTerm = '';
  statusFilter: OrderStatus | '' = '';
  townFilter: Town | '' = '';

  statuses: OrderStatus[] = [
    'New',
    'Baking',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  towns: Town[] = ['Northfield', 'Southbay'];

  ngOnInit(): void {
    this.route.queryParamMap
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(params => {
        const status = params.get('status');
        this.statusFilter = this.statuses.includes(status as OrderStatus)
          ? status as OrderStatus
          : '';

        const town = params.get('town');
        this.townFilter = this.towns.includes(town as Town)
          ? town as Town
          : '';

        this.loadOrders();
      });
  }

  // Fetch orders from the backend
  loadOrders(): void {
    const requestId = ++this.loadRequestId;
    this.loadingOrders = true;
    this.ordersError = '';

    this.orderService
      .getAll(this.searchTerm, this.townFilter)
      .pipe(
        finalize(() => {
          if (requestId === this.loadRequestId) {
            this.loadingOrders = false;
            this.cdr.detectChanges();
          }
        })
      )
      .subscribe({
        next: (orders) => {
          if (requestId === this.loadRequestId) {
            this.orders = [...orders];
            this.cdr.detectChanges();
          }
        },

        error: (error) => {
          if (requestId !== this.loadRequestId) {
            return;
          }

          console.error('GET request failed:', error);

          this.ordersError =
            'Unable to load orders. Please try again.';
        }
      });
  }

  // Update order status
  onStatusChange(
    order: Order,
    newStatus: OrderStatus
  ): void {

    if (newStatus === order.status) {
      return;
    }

    this.orderService
      .updateStatus(order.id, newStatus)
      .subscribe({
        next: (updatedOrder) => {

          this.orders = this.orders.map(item =>
            item.id === order.id ? updatedOrder : item
          );

          this.activityLog.add(
            `Order ${updatedOrder.orderNumber} status changed to ${updatedOrder.status}`
          );
        },

        error: (error) => {
          console.error('Error updating order:', error);
          this.ordersError =
            'Unable to update order status. Please try again.';
        }
      });
  }

  // Delete an order
  deleteOrder(order: Order): void {

    const confirmed = confirm(
      `Are you sure you want to delete order ${order.orderNumber}?`
    );

    if (!confirmed) {
      return;
    }

    this.orderService.delete(order.id).subscribe({
      next: () => {

        this.orders = this.orders.filter(
          item => item.id !== order.id
        );

        this.activityLog.add(
          `Order ${order.orderNumber} deleted`
        );
      },

      error: (error) => {
        console.error('Error deleting order:', error);
        this.ordersError =
          'Unable to delete order. Please try again.';
      }
    });
  }

  // Search by customer name
  onOrderSearch(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.searchTerm = input.value;
    this.loadOrders();
  }

  get filteredOrders(): Order[] {
    return this.orders.filter(order =>
      (!this.statusFilter || order.status === this.statusFilter) &&
      (!this.townFilter || order.deliveryTown === this.townFilter)
    );
  }

  onStatusFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.updateQueryParams({ status: select.value || null });
  }

  onTownFilterChange(event: Event): void {
    const select = event.target as HTMLSelectElement;

    this.updateQueryParams({ town: select.value || null });
  }

  clearFilters(): void {
    this.updateQueryParams({ status: null, town: null });
  }

  private updateQueryParams(queryParams: {
    status?: string | null;
    town?: string | null;
  }): void {
    void this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    }).catch(error => {
      console.error('Unable to update order filters:', error);
      this.ordersError = 'Unable to update filters. Please try again.';
    });
  }
}
