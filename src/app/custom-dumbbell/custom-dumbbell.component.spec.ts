import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDumbbellComponent } from './custom-dumbbell.component';

describe('CustomDumbbellComponent', () => {
  let component: CustomDumbbellComponent;
  let fixture: ComponentFixture<CustomDumbbellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDumbbellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDumbbellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
