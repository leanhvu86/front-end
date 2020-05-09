import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { RealMessage } from '../model/real-message';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ChatService {
    constructor(private socket: Socket) { }
    public sendMessage(message) {
        console.log('gưi thong báo socket' + message)
        this.socket.emit('new-message', message);
    }
    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) => {
                observer.next(message);
            });
        });
    }
}