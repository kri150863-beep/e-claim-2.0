import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusStatsComponent } from './status-stats.component';

describe('StatusStatsComponent', () => {
  let component: StatusStatsComponent;
  let fixture: ComponentFixture<StatusStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusStatsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
