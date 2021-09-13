import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageuploadComponent } from './animation/imageupload/imageupload.component';
import {FileUploadModule} from 'ng2-file-upload';



@NgModule({
  declarations: [ImageuploadComponent],
  imports: [
    CommonModule,
    FileUploadModule
  ],
  exports: [
    ImageuploadComponent
  ]
})
export class SharedModule { }
