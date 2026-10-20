
import {
  Directive,
  Input,
  HostListener,
  HostBinding
} from '@angular/core';

@Directive({
  selector: '[appHighlight]',
  standalone: true
})
export class Highlight {
  @Input() appHighlight = '#fff3cd';

  @HostBinding('class.app-highlighted')
  isHighlighted = false;

  @HostBinding('style.--highlight-color')
  get highlightColor(): string {
    return this.appHighlight;
  }

  // HostBinding toggles a class without overwriting other card styles.
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.isHighlighted = true;
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.isHighlighted = false;
  }
}
