import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AquaticCreaturesFormComponent } from './aquatic-creatures-form.component';

describe('AquaticCreaturesFormComponent', () => {
  let component: AquaticCreaturesFormComponent;
  let fixture: ComponentFixture<AquaticCreaturesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AquaticCreaturesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AquaticCreaturesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
