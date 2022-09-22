import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediaControllerComponent } from './media-controller.component';

describe('MediaControllerComponent', () => {
  let component: MediaControllerComponent;
  let fixture: ComponentFixture<MediaControllerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MediaControllerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MediaControllerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
