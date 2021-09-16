import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Gallery} from 'src/app/shared/model/gallery';
import {CookieService} from 'ngx-cookie-service';
import {GalleryService} from 'src/app/shared/service/gallery.service';
import {UserService} from 'src/app/shared/service/user.service.';
import {ChatService} from 'src/app/shared/service/chat.service';
import {AlertService} from '../../../shared/animation/_alert';

@Component({
  selector: 'app-add-gallery',
  templateUrl: './add-gallery.component.html',
  styleUrls: ['./add-gallery.component.css']
})
export class AddGalleryComponent implements OnInit {
  submitted = false;
  registerForm: FormGroup;
  isAuthenticate: boolean;
  galleryObject = {
    content: '',
    image: '',
    name: '',
    user: ''
  };
  messageCheck = false;
  saving = false;
  errorMessage = '';
  message = '';
  gallerys: Gallery[] = [];

  @Output() galleryOutput = new EventEmitter();

  constructor(
    private cookie: CookieService,
    private formBuilder: FormBuilder,
    private galleryService: GalleryService,
    private userService: UserService,
    private chatService: ChatService,
    private alertService: AlertService
  ) {
    this.isAuthenticate = localStorage.getItem('email') !== '';
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(200)]],
      content: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(500)]]
      // , image: ['']
    });
  }

  get f() {
    return this.registerForm.controls;
  }

  registerGallery() {
    const radio: HTMLElement = document.getElementById('modal-button555');
    radio.click();
  }

  addGallery() {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }
    if (this.saving === true) {
      return;
    }
    this.saving = true;
    this.galleryObject = this.registerForm.value;
    this.galleryObject.user = localStorage.getItem('email');
    this.galleryObject.image = 'default-gallery.png';
    this.galleryService.createGallery(this.galleryObject).subscribe(gallery => {
      console.log(gallery);
      if (gallery !== undefined) {
        this.messageCheck = true;
        this.registerGallery();
        this.alertService.success('Chúc mừng bạn thêm bộ sưu tập thành công');
        let tem: Gallery;
        tem = gallery.body['gallery'];
        this.registerForm.reset();
        this.saving = false;
        this.gallerys.push(tem);
        this.galleryOutput.emit(tem);
        setTimeout(() => {
          this.messageCheck = false;
          this.message = '';
          window.location.reload();
          this.chatService.identifyUser();
        }, 3000);
      }
    });
  }

  reset() {
    this.registerForm.reset();
  }
}
