import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitySelector } from './city-selector';

describe('CitySelector', () => {
  let component: CitySelector;
  let fixture: ComponentFixture<CitySelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CitySelector]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CitySelector);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
