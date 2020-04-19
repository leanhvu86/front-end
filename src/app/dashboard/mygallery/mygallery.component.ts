import {Component, OnInit} from '@angular/core';
import {User} from 'src/app/shared/model/user';
import {LoginServiceService} from 'src/app/shared/service/login-service.service';
import {CookieService} from 'ngx-cookie-service';
import {Options} from 'ng5-slider';
import {GalleryService} from 'src/app/shared/service/gallery.service';
import {Gallery} from 'src/app/shared/model/gallery';

@Component({
  selector: 'app-mygallery',
  templateUrl: './mygallery.component.html',
  styleUrls: ['./mygallery.component.css']
})
export class MygalleryComponent implements OnInit {
  id: String = '1';
  value: number = 0;
  options: Options = {
    floor: 0,
    ceil: 1000,
    showTicksValues: false,
    disabled: true,
    hideLimitLabels: true,
  };
  deleteCheck = false;
  userObject = {
    email: '',
    password: ''
  };
  deleteId = '';
  galleryObject = {
    id: ''
  };
  message = '';
  myGallery: Gallery[] = [];
  user: User;
  loadPage: boolean = false;
  p: number;

  constructor(
    private _loginService: LoginServiceService,
    private cookie: CookieService,
    private gallerrService: GalleryService
  ) {
  }

  ngOnInit() {
    this.getUserInfo();
  }

  getUserInfo() {
    let email = this.cookie.get('email');
    if (email !== '') {
      this._loginService.testEmail(email).subscribe(data => {


        let user = data.body['user'];
        if (user !== undefined) {
          this.userObject.email = user.email;
          this.gallerrService.findGallery(this.userObject).subscribe(data => {
            this.myGallery = data.body['gallerys'];
            for (let gallery of this.myGallery) {
              if (gallery.recipe.length > 0) {
                gallery.image = gallery.recipe[0].imageUrl;
              } else {
                console.log(gallery.recipe.length);
                gallery.image = 'fvt7rkr59r9d7wk8ndbd';
              }
            }
            this.user = user;
            this.id = user._id;
            this.loadPage = true;
            if (user.totalPoint > 600) {
              this.value = user.totalPoint;
              user.level = 'Mastee';
            } else if (user.totalPoint > 400) {
              this.value = user.totalPoint;
              user.level = 'Cheffe';
            } else if (user.totalPoint > 250) {
              this.value = user.totalPoint;
              user.level = 'Cookee';
            } else if (user.totalPoint > 100) {
              this.value = user.totalPoint;
              user.level = 'Tastee';
            } else {
              this.value = user.totalPoint;
              user.level = 'Newbee';
            }
          });
        }
      });
    }
  }

  openModal(id: any) {
    this.deleteId=id;
    this.deleteCheck = true;
    this.message = 'Bạn muốn xóa bộ sưu tập này ?';
    const radio: HTMLElement = document.getElementById('modal-button28');
    radio.click();
  }

  deleteGallery(id: any) {
    if (id === '') {
      this.message = 'Bạn chưa chọn bộ sưu tập. Vui lòng thao tác lại';
      return;
    }
    this.galleryObject.id = id;
    this.gallerrService.deleteGallery(this.galleryObject).subscribe(data => {
      console.log(data);
      this.message = data.body['message'];
      if (data.body['status'] === 200) {
        this.myGallery = this.myGallery.filter(gallery => gallery._id !== id);
      }
      this.deleteId = '';
      this.deleteCheck=false;
    });
  }
}
