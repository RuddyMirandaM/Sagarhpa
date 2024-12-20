/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { CensoganaderoComponent } from './censoganadero.component';

describe('CensoganaderoComponent', () => {
  let component: CensoganaderoComponent;
  let fixture: ComponentFixture<CensoganaderoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CensoganaderoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CensoganaderoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
