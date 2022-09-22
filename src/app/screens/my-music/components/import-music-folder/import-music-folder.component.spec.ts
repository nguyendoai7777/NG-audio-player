import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMusicFolderComponent } from './import-music-folder.component';

describe('ImportMusicFolderComponent', () => {
  let component: ImportMusicFolderComponent;
  let fixture: ComponentFixture<ImportMusicFolderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportMusicFolderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportMusicFolderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
