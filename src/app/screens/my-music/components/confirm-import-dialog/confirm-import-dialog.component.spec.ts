import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmImportDialogComponent } from './confirm-import-dialog.component';

describe('ConfirmImportDialogComponent', () => {
  let component: ConfirmImportDialogComponent;
  let fixture: ComponentFixture<ConfirmImportDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmImportDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
