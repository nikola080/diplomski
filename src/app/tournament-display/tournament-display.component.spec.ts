import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentDisplayComponent } from './tournament-display.component';

describe('TournamentDisplayComponent', () => {
  let component: TournamentDisplayComponent;
  let fixture: ComponentFixture<TournamentDisplayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentDisplayComponent]
    });
    fixture = TestBed.createComponent(TournamentDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
