import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GenerarRecuerdoPage } from './generar-recuerdo.page';

describe('GenerarRecuerdoPage', () => {
  let component: GenerarRecuerdoPage;
  let fixture: ComponentFixture<GenerarRecuerdoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerarRecuerdoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
