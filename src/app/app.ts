
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  NgForm,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';

import { TeamCard } from './team-card/team-card';
import { TeamMember } from './team-member';
import { TeamService } from './services/team';
import { ActivityLogService } from './services/activity-log';
import { OrderService } from './services/order';
import { Order, Flavour, Town, OrderStatus } from './models/order';
import { APP_CONFIG } from './config/app-config';
import { noPastDate } from './validators/no-past-date.validator';
import { priceNeededToDeliver } from './validators/price-needed-to-deliver.validator';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TeamCard
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private teamService = inject(TeamService);
  private orderService = inject(OrderService);
  private fb = inject(FormBuilder);

  readonly config = inject(APP_CONFIG);
  activityLog = inject(ActivityLogService);

  team: TeamMember[] = this.teamService.getAll();

  selectedId: number | null = null;
  favoriteId: number | null = null;
  message = '';
  searchTerm = '';

  get selectedMember(): TeamMember | undefined {
    return this.team.find(member => member.id === this.selectedId);
  }

  get favoriteMember(): TeamMember | undefined {
    return this.team.find(member => member.id === this.favoriteId);
  }

  get orders(): Order[] {
    return this.orderService.getAll();
  }

  setFavorite(member: TeamMember): void {
    this.favoriteId = member.id;
  }

  selectMember(member: TeamMember): void {
    this.selectedId = member.id;
    this.message = '';
    this.activityLog.add(`Card selected: ${member.name}`);
  }

  changeName(): void {
    if (this.selectedId === null) {
      this.message = 'Select a card first.';
      return;
    }

    const newName = prompt('Enter the new name:');

    if (newName === null || newName.trim() === '') {
      return;
    }

    const updatedMember: TeamMember = {
      ...this.selectedMember!,
      name: newName.trim()
    };

    this.teamService.update(updatedMember);
    this.team = this.teamService.getAll();

    this.activityLog.add(`Name updated: ${updatedMember.name}`);
    this.message = '';
  }

  changeJob(): void {
    if (this.selectedId === null) {
      this.message = 'Select a card first.';
      return;
    }

    const newJob = prompt('Enter the new job:');

    if (newJob === null || newJob.trim() === '') {
      return;
    }

    const updatedMember: TeamMember = {
      ...this.selectedMember!,
      job: newJob.trim()
    };

    this.teamService.update(updatedMember);
    this.team = this.teamService.getAll();

    this.activityLog.add(
      `Job updated: ${updatedMember.name} — ${updatedMember.job}`
    );
    this.message = '';
  }

  trackByMemberId(index: number, member: TeamMember): number {
    return member.id;
  }

  get filteredTeam(): TeamMember[] {
    const query = this.searchTerm.trim().toLowerCase();

    return this.team.filter(member =>
      member.name.toLowerCase().includes(query)
    );
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
  }

  // Chapter 6: Template-driven customer enquiry form
  enquiry = {
    name: '',
    email: '',
    message: ''
  };

  enquiryThankYou = false;

  submitEnquiry(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    this.activityLog.add(
      `Enquiry received from ${this.enquiry.name}`
    );

    this.enquiryThankYou = true;

    form.resetForm({
      name: '',
      email: '',
      message: ''
    });
  }

  // Chapters 7-9: Reactive order form
  flavours: Flavour[] = [
    'Chocolate',
    'Vanilla',
    'Red Velvet',
    'Butterscotch'
  ];

  towns: Town[] = ['Northfield', 'Southbay'];

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
      deliveryDate: ['', [Validators.required, noPastDate]],
      deliveryTown: ['Northfield', Validators.required],
      status: ['New', Validators.required],
      price: [null, Validators.min(0)]
    },
    {
      validators: [priceNeededToDeliver]
    }
  );

  isBigOrder = false;
  orderThankYou = '';

  constructor() {
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

    const newOrder: Omit<Order, 'orderNumber' | 'bigOrder'> = {
      accountName: value.accountName.trim(),
      flavour: value.flavour,
      sizeKg: Number(value.sizeKg),
      deliveryDate: value.deliveryDate,
      deliveryTown: value.deliveryTown,
      status: value.status,
      price:
        value.price === null || value.price === ''
          ? undefined
          : Number(value.price),
      webReference: ''
    };

    const createdOrder = this.orderService.add(newOrder);

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
