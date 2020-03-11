import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FileViewPage } from './file-view.page';

describe('FileViewPage', () => {
  let component: FileViewPage;
  let fixture: ComponentFixture<FileViewPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FileViewPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FileViewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
