
import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { TeamMember } from '../team-member';
import { DatePipe, CurrencyPipe, PercentPipe } from '@angular/common';
import { TruncatePipe } from '../truncate-pipe';
@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, PercentPipe, TruncatePipe],
  templateUrl: './team-card.html',
  styleUrl: './team-card.scss'
})
export class TeamCard implements OnInit, OnChanges {

  @Input() person!: TeamMember;
  @Input() isSelected = false;
  @Input() isFavorite = false;

  @Output() favorite = new EventEmitter<TeamMember>();
  @Output() selected = new EventEmitter<TeamMember>();
  @Input() dateFormat = 'dd MMM yyyy';
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
    this.selected.emit(this.person);
  }

  markFavorite(event: MouseEvent): void {
    event.stopPropagation();
    this.favorite.emit(this.person);
  }
}

