import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PlanogramPagePage } from './planogram-page.page';

describe('PlanogramPagePage', () => {
  let component: PlanogramPagePage;
  let fixture: ComponentFixture<PlanogramPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlanogramPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PlanogramPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
