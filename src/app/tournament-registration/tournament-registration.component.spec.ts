import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TournamentRegistrationComponent } from './tournament-registration.component';

describe('TournamentRegistrationComponent', () => {
  let component: TournamentRegistrationComponent;
  let fixture: ComponentFixture<TournamentRegistrationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TournamentRegistrationComponent]
    });
    fixture = TestBed.createComponent(TournamentRegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
