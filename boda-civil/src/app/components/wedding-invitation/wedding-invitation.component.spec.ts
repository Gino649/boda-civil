import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeddingInvitationComponent } from './wedding-invitation.component';

describe('WeddingInvitationComponent', () => {
  let component: WeddingInvitationComponent;
  let fixture: ComponentFixture<WeddingInvitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeddingInvitationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeddingInvitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
