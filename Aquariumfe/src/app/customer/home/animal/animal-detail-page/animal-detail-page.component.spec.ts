import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimalDetailPageComponent } from './animal-detail-page.component';

describe('AnimalDetailPageComponent', () => {
  let component: AnimalDetailPageComponent;
  let fixture: ComponentFixture<AnimalDetailPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AnimalDetailPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnimalDetailPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
