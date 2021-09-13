import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {FileUploader} from 'ng2-file-upload';
import {AppSetting} from 'src/app/appsetting';
import {SafeUrl, DomSanitizer} from '@angular/platform-browser';
import {RecipeService} from '../../service/recipe-service.service';

@Component({
  selector: 'app-imageupload',
  templateUrl: './imageupload.component.html',
  styleUrls: ['./imageupload.component.css']
})
export class ImageuploadComponent implements OnInit {
  // tslint:disable-next-line:no-input-rename
  @Input('imageProp') imageProp: string;
  // tslint:disable-next-line:no-input-rename
  @Input('block') block: string;
  // tslint:disable-next-line:no-input-rename
  @Input('imageRoomProp') imageRoomProp: string;
  // tslint:disable-next-line:no-input-rename
  @Input('url') private url: any;
  // tslint:disable-next-line:no-input-rename
  @Input('listImgCurrent') listImgCurrent: any;
  // tslint:disable-next-line:no-input-rename
  @Input('listRoomImgCurrent') listRoomImgCurrent: any;
  // tslint:disable-next-line:no-input-rename
  @Input('indexRoom') index: number;
  @Input('resetAll') resetAll: any;
  ngOnChanges() {
    if(this.resetAll===true){
      this.isShown = true;
      this.legalUploadCheck = false;
      this.listImgPreview = [];
      this.listRoomImgCurrent= [];
      this.uploader.clearQueue();
    }
  }
  @Output() imageSrcUrl = new EventEmitter();
  // @Output() indexRoomDelete = new EventEmitter();
  @Output() indexDelete = new EventEmitter<string>();
  @Output() message = new EventEmitter<string>();

  // tslint:disable-next-line:no-input-rename
  @Input('multiple') multiple = true;

  isShown: boolean = true; // hidden by default
  legalUploadCheck: boolean = false;

  public uploader: FileUploader = new FileUploader({
    url: AppSetting.BASE_SERVER_URL + '/api/upload',
    itemAlias: 'image'
  });
  public imageUrl = '';
  listImgPreview: SafeUrl[] = [];

  // previewImg: SafeUrl;

  constructor(private sanitizer: DomSanitizer,
              private recipeService: RecipeService) {
  }

  ngOnInit() {
    console.log('IMAGE :');
    console.log(this.listRoomImgCurrent);
    console.log(this.index);
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
      console.log('Uploaded File Details:', this.uploader);
      // this.previewImg = this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file)));
      this.listImgPreview.push(this.sanitizer.bypassSecurityTrustUrl((window.URL.createObjectURL(file._file))));
      console.log(this.listImgPreview);
      if (this.listImgPreview.length === 5 || this.listImgPreview.length > 5) {
        this.isShown = false;
      }
      // console.log(this.previewImg)
    };
    this.uploader.onCompleteItem = (data) => {
      console.log('Uploaded File Details:', data._xhr.response);
      this.imageUrl += data._xhr.response;
      this.imageSrcUrl.emit(this.imageUrl);
    };
    this.uploader.onCompleteAll = () => {

      this.message.emit('Upload tất cả thành công');
      this.isShown = false;
      this.legalUploadCheck = false;
      console.log('upload all success!');
    };
  }

  removeSelectedFile(i) {

    this.listImgPreview.splice(i, 1);
    this.uploader.queue[i].remove();
    if (this.listImgPreview.length === 0) {
      this.legalUploadCheck = false;
      console.log('this.listImgPreview.length === 0');
    }
  }

  removeImageCurrent(i) {
    console.log('removeImageCurrent');
    this.listImgCurrent.splice(i, 1);
  }

  onSelectFile(event) {
    console.log('onSelectFile');

    if (this.imageProp !== 'roomDetail') {

      if (event.target.files && event.target.files[0]) {

        const reader = new FileReader();

        reader.readAsDataURL(event.target.files[0]); // read file as data url
        // tslint:disable-next-line:no-shadowed-variable
        reader.onload = (event) => { // called once readAsDataURL is completed

          this.url = reader.result;
        };
      }
    }
    this.startUploadFile();
  }

  startUploadFile() {
    console.log('startUploadFile');

    this.uploader.uploadAll();
  }

  resetUploadFile() {
    console.log('resetUploadFile');

    this.indexDelete.emit(this.index.toString());
    let pshArrayImage = '';

    const str = '[' + this.imageUrl.toString().replace(/}\n?{/g, '},{') + ']';
    JSON.parse(str).forEach((obj) => {

      pshArrayImage += obj.filePath + ',';
    });
    this.recipeService.deleteImage(pshArrayImage).subscribe((data) => {

      this.listImgPreview.length = 0;
      this.isShown = true;
      this.legalUploadCheck = false;
      this.imageUrl = '';
    });
  }
}


