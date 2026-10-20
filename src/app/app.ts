
import { Component,inject } from '@angular/core';
import { TeamCard } from './team-card/team-card';
import { TeamMember } from './team-member';
//import { inject } from '@angular/core';
import { ActivityLogService } from './services/activity-log';
import { OrderService } from './services/order';
import { Order } from './models/order';
import { FormsModule } from '@angular/forms';
import { NgForm } from '@angular/forms';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule
} from '@angular/forms';
import { OnInit } from '@angular/core';
import { APP_CONFIG } from './config/app-config';
import { AppConfig } from './config/app-config';
import { Flavour, Town, OrderStatus,  } from './models/order';
import { noPastDate } from './validators/no-past-date.validator';
import { priceNeededToDeliver } from './validators/price-needed-to-deliver.validator';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ FormsModule,TeamCard,ReactiveFormsModule ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  team: TeamMember[] = [
    {
      id: 1,
      name: 'Meera Joshi',
      job: 'Founder and Sales Head',
      covers: 'Everything'
    },
    {
      id: 2,
      name: 'Anil Verma',
      job: 'Sales Rep',
      covers: 'Northfield'
    },
    {
      id: 3,
      name: 'Sara Khan',
      job: 'Sales Rep',
      covers: 'Southbay'
    },
    {
      id: 4,
      name: 'Ravi Nair',
      job: 'Customer Support',
      covers: 'Complaints from both towns'
    }
  ];
activityLog = inject(ActivityLogService);
private orderService = inject(OrderService);

  selectedId: number | null = null;
  favoriteId: number | null = null;
 message = '';
  get selectedMember(): TeamMember | undefined {
    return this.team.find(member => member.id === this.selectedId);
  }

  get favoriteMember(): TeamMember | undefined {
    return this.team.find(member => member.id === this.favoriteId);
  }



  setFavorite(member: TeamMember): void {
    this.favoriteId = member.id;
  }

  selectMember(member: TeamMember): void {
  this.selectedId = member.id;
  this.message = '';

  this.activityLog.add(`Card selected: ${member.name}`);
}

get orders(): Order[] {
  return this.orderService.getAll();
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

  this.team = this.team.map(member => {
    if (member.id === this.selectedId) {
      return {
        ...member,
        name: newName.trim()
      };
    }

    return member;
  });
this.activityLog.add(`Name updated: ${this.selectedMember?.name}`);
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

  this.team = this.team.map(member => {
    if (member.id === this.selectedId) {
      return {
        ...member,
        job: newJob.trim()
      };
    }
    
    return member;
  });
this.activityLog.add(
  `Job updated: ${this.selectedMember?.name} — ${this.selectedMember?.job}`
);
  this.message = '';
}

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

private fb = inject(FormBuilder);
private config = inject(APP_CONFIG);

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
    price: value.price === null || value.price === ''
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
