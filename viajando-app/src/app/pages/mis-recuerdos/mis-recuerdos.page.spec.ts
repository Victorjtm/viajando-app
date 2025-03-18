import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MisRecuerdosPage } from './mis-recuerdos.page';

describe('MisRecuerdosPage', () => {
  let component: MisRecuerdosPage;
  let fixture: ComponentFixture<MisRecuerdosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MisRecuerdosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
