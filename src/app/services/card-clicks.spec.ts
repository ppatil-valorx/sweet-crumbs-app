import { TestBed } from '@angular/core/testing';
import { CardClicks } from './card-clicks';

describe('CardClicks', () => {
  let service: CardClicks;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardClicks);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
