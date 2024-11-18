import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ClassesComponent } from './classes.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ClassesService } from './classes.service';

describe('ClassesComponent', () => {
  let component: ClassesComponent;
  let fixture: ComponentFixture<ClassesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClassesComponent],
      providers: [
        provideHttpClientTesting(),
        ClassesService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClassesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
