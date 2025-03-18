import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ViajesPrevistosPage } from './viajes-previstos.page';

describe('ViajesPrevistosPage', () => {
  let component: ViajesPrevistosPage;
  let fixture: ComponentFixture<ViajesPrevistosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajesPrevistosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
