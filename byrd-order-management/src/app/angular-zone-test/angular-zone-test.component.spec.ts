import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularZoneTestComponent } from './angular-zone-test.component';

describe('AngularZoneTestComponent', () => {
  let component: AngularZoneTestComponent;
  let fixture: ComponentFixture<AngularZoneTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularZoneTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularZoneTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
