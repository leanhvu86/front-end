import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {Observable} from 'rxjs';
import * as io from 'socket.io-client';
import {AppSetting} from 'src/app/appsetting';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  url = AppSetting.BASE_SERVER_URL + '/api/upload';

  constructor(private socket: Socket) {
  }

  public sendMessage(message) {
    console.log('gưi thong báo socket' + message);
    this.socket.emit('new-message', message);
  }

  public getMessages = () => {
    return Observable.create((observer) => {
      this.socket.on('message', (message) => {
        observer.next(message);
      });
    });
  };


  setBackground(){
    let body = document.getElementsByTagName('body')[0];
    body.style.backgroundImage = 'url(../../../assets/images/wallpaperflare.com_wallpaper.png)';
    body.style.height = '100%';
    body.style.backgroundPosition = 'center';
    body.style.backgroundRepeat = 'no-repeat';
    body.style.backgroundSize = 'cover';
  }
  identifyUser() {
    this.socket = io(AppSetting.BASE_SERVER_URL);
    console.log('connect');
  }

  scrollToTop() {
    (function smoothscroll() {

      let currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }

    })();
  }
}
