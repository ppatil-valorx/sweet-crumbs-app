
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject
} from '@angular/core';
import { ActivityLogService } from '../services/activity-log';
import { TeamMember } from '../team-member';
import { CardClicksService } from '../services/card-clicks';

@Component({
  selector: 'app-team-card',
  standalone: true,
  templateUrl: './team-card.html',
  styleUrl: './team-card.scss',
  providers: [CardClicksService],
})
export class TeamCard implements OnInit, OnChanges {

  @Input() person!: TeamMember;
  @Input() isSelected = false;
  @Input() isFavorite = false;

  @Output() favorite = new EventEmitter<TeamMember>();
  @Output() selected = new EventEmitter<TeamMember>();

  clicks = inject(CardClicksService);
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
activityLog = inject(ActivityLogService);
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
