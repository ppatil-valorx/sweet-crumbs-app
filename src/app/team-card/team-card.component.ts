
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
  ViewEncapsulation,
  inject
} from '@angular/core';

import { CurrencyPipe, DatePipe, PercentPipe } from '@angular/common';
import { CardClicksService } from '../services/card-clicks';
import { ActivityLogService } from '../services/activity-log';
import { TeamMember } from '../team-member';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, PercentPipe],
  templateUrl: './team-card.html',
  styleUrl: './team-card.scss',
  providers: [CardClicksService],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamCardComponent implements OnInit, OnChanges {
  @Input() person!: TeamMember;
  @Input() isSelected = false;
  @Input() isFavorite = false;

  @Output() favorite = new EventEmitter<TeamMember>();
  @Output() selected = new EventEmitter<TeamMember>();

  clicks = inject(CardClicksService);
  activityLog = inject(ActivityLogService);

  ngOnInit(): void {
    console.log('Team card initialized:', this.person.name);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(
      'Team card input changes:',
      this.person?.name,
      changes
    );
  }

  selectCard(): void {
    this.clicks.increment();
    this.selected.emit(this.person);
  }

  markFavorite(event: MouseEvent): void {
    event.stopPropagation();
    this.activityLog.add(`Favorite chosen: ${this.person.name}`);
    this.favorite.emit(this.person);
  }
}
