import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAquaticCreaturesComponent } from './list-aquatic-creatures.component';

describe('ListAquaticCreaturesComponent', () => {
  let component: ListAquaticCreaturesComponent;
  let fixture: ComponentFixture<ListAquaticCreaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListAquaticCreaturesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAquaticCreaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
