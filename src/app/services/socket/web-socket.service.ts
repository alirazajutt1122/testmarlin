import {Injectable} from '@angular/core';
import { AppConstants } from 'app/app.utility';
import { environment } from 'environments/environment';
import {Socket} from "ngx-socket-io";
import { Observable, Subscriber } from 'rxjs';
import {map} from "rxjs/operators";
import * as io from 'socket.io-client';

@Injectable({
    providedIn: 'root'
})
export class WebSocketService {

    public  socketToken = "a||-5Jh>R(I&`4Xf42vz=Z]Dtze{@#4}5?}YJ*VC>,bc?,JNVg;#UlJ+Fk.n>~+";
    socketIO : any

    constructor(private socket: Socket) {
       this.socketIO = io(environment.socketUrl);

       this.createConnection();


    }



   createConnection=()=>{
     
    this.socketIO.emit('authenticate', { token: this.socketToken }) .on('authenticated', (data) => {
        console.log("Socket Data From WebSocket Service==================", data);
        this.fetchFromChannel('order_confirmation' , {'user' : AppConstants.username});
       })
      .on('unauthorized', (error) => {
        console.log('unauthorized on push server From WebSocket Service: ' + JSON.stringify(error.data));
      });

   }




    onFetchDataFromChannel(_channelName : string) {
        return new Observable((subscriber) => {
            this.socketIO.on(_channelName , (data)=>{
                 subscriber.next(data);
            })
        })
    }



    fetchFromChannel(_channelName: string , obj) {
            this.socketIO.emit(_channelName, obj);
    }


    
    






}
