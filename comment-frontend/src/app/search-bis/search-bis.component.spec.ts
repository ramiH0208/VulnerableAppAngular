import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBisComponent } from './search-bis.component';

describe('SearchBisComponent', () => {
  let component: SearchBisComponent;
  let fixture: ComponentFixture<SearchBisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchBisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
