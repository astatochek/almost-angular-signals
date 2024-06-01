import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularSignalsComponent } from './angular-signals.component';

describe('AngularSignalsComponent', () => {
  let component: AngularSignalsComponent;
  let fixture: ComponentFixture<AngularSignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AngularSignalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AngularSignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
