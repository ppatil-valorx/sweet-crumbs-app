
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { Router } from '@angular/router';

import { APP_CONFIG } from '../../config/app-config';

import { OrderService } from '../../services/order';
import { ActivityLogService } from '../../services/activity-log';

import { Order, Flavour, Town, OrderStatus } from '../../models/order';
import { HasUnsavedChanges } from '../../models/has-unsaved-changes';

import { noPastDate } from '../../validators/no-past-date.validator';
import { priceNeededToDeliver } from '../../validators/price-needed-to-deliver.validator';

@Component({
  selector: 'app-new-order-page',
  standalone: true,
  imports: [
    ReactiveFormsModule
  ],
  templateUrl: './new-order-page.html',
  styleUrl: './new-order-page.scss'
})
export class NewOrderPage implements HasUnsavedChanges {

  private fb = inject(FormBuilder);
  private orderService = inject(OrderService);
  private router = inject(Router);

  activityLog = inject(ActivityLogService);

  readonly config = inject(APP_CONFIG);

  flavours: Flavour[] = [
    'Chocolate',
    'Vanilla',
    'Red Velvet',
    'Butterscotch'
  ];

  towns: Town[] = [
    'Northfield',
    'Southbay'
  ];

  statuses: OrderStatus[] = [
    'New',
    'Baking',
    'Out for Delivery',
    'Delivered',
    'Cancelled'
  ];

  orderForm: FormGroup = this.fb.group(
    {
      accountName: ['', Validators.required],

      flavour: ['Chocolate', Validators.required],

      sizeKg: [
        null,
        [
          Validators.required,
          Validators.min(this.config.minSizeKg),
          Validators.max(this.config.maxSizeKg)
        ]
      ],

      deliveryDate: [
        '',
        [
          Validators.required,
          noPastDate
        ]
      ],

      deliveryTown: ['Northfield', Validators.required],

      status: ['New', Validators.required],

      price: [null, Validators.min(0)]
    },
    {
      validators: [priceNeededToDeliver]
    }
  );

  hasUnsavedChanges(): boolean {
    return this.orderForm.dirty;
  }

  isBigOrder = false;
  orderThankYou = '';

  constructor() {

    // Detect big orders whenever the size changes.
    this.orderForm.get('sizeKg')!.valueChanges.subscribe(value => {

      this.isBigOrder =
        value !== null &&
        value !== '' &&
        Number(value) >= this.config.bigOrderKg;

    });

  }

  submitOrder(): void {

    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const value = this.orderForm.getRawValue();

    const newOrder: Omit<
      Order,
      'id' | 'orderNumber' | 'bigOrder' | 'webReference'
    > = {

      accountName: value.accountName.trim(),
      flavour: value.flavour,
      sizeKg: Number(value.sizeKg),
      deliveryDate: value.deliveryDate,
      deliveryTown: value.deliveryTown,
      status: value.status,

      price:
        value.price === null || value.price === ''
          ? undefined
          : Number(value.price)

    };

    this.orderService.add(newOrder).subscribe({

      next: (createdOrder) => {

        this.activityLog.add(
          `Order ${createdOrder.orderNumber} added`
        );

        this.orderThankYou =
          `Order ${createdOrder.orderNumber} added successfully.`;

        this.orderForm.reset({
          accountName: '',
          flavour: 'Chocolate',
          sizeKg: null,
          deliveryDate: '',
          deliveryTown: 'Northfield',
          status: 'New',
          price: null
        });

        this.isBigOrder = false;

        void this.router.navigate(['/orders', createdOrder.orderNumber]);

      },

      error: (error) => {

        console.error('Error creating order:', error);

        const validationError = error.error?.errors?.[0];

        if (validationError) {
          this.orderThankYou = validationError.message;
        } else {
          this.orderThankYou =
            error.error?.message ||
            'Unable to create order. Please try again.';
        }

      }

    });

  }

  getOrderFieldError(fieldName: string): string {

    const control = this.orderForm.get(fieldName);

    if (!control || !control.touched || !control.errors) {
      return '';
    }

    if (control.errors['required']) {
      return 'This field is required.';
    }

    if (control.errors['min']) {
      return `Minimum value is ${control.errors['min'].min}.`;
    }

    if (control.errors['max']) {
      return `Maximum value is ${control.errors['max'].max}.`;
    }

    return '';
  }

  getSizeError(): string {

    const control = this.orderForm.get('sizeKg');

    if (!control || !control.touched || !control.invalid) {
      return '';
    }

    return `Size must be between ${this.config.minSizeKg} and ${this.config.maxSizeKg} kg.`;
  }

}
