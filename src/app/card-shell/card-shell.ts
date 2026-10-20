import { Component, Input } from '@angular/core';
import { Highlight } from '../highlight';

@Component({
  imports: [Highlight],
  selector: 'app-card-shell',
  styleUrl: './card-shell.scss',
  templateUrl: './card-shell.html',
  standalone: true,
  
})

export class CardShell {
    @Input() highlightColor = '#fff3cd';
}
