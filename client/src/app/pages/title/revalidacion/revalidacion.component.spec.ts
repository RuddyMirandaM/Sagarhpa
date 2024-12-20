/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { RevalidacionComponent } from './revalidacion.component';

describe('RevalidacionComponent', () => {
  let component: RevalidacionComponent;
  let fixture: ComponentFixture<RevalidacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RevalidacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RevalidacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
