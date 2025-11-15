import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaleryComponent } from './salery.component';

describe('SaleryComponent', () => {
  let component: SaleryComponent;
  let fixture: ComponentFixture<SaleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaleryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
