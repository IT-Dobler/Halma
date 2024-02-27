import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedAngularComponent } from './shared-angular.component';

describe('SharedAngularComponent', () => {
  let component: SharedAngularComponent;
  let fixture: ComponentFixture<SharedAngularComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedAngularComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SharedAngularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
