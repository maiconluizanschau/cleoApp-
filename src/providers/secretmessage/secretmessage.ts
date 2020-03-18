import { Messagesecret } from './../../models/messagesecret.models';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import { BaseService } from "./../base/base";

import * as firebase from 'firebase/app';

@Injectable()
export class SecretMessageService extends BaseService {

  constructor(
    public db: AngularFireDatabase,
    public http: Http
  ) {
    super();
  }

  
  create(secretmessage: Messagesecret, listsecretMessages: FirebaseListObservable<Messagesecret[]>): firebase.Promise<void> {
    return listsecretMessages.push(secretmessage)//add nova msm na lista
      .catch(this.handlePromiseError);
  }

  //BUSCA DAS MENSAGENS ENTRE USERS
  getMessagesecret(userId1: string, userId2: string): FirebaseListObservable<Messagesecret[]> {
    return <FirebaseListObservable<Messagesecret[]>>this.db.list(`/messagesecret/${userId1}-${userId2}`, {
      query: {
        orderByChild: 'timestamp',  //ordena pelo tempo ultimo enviado
        limitToLast: 30
      }
    }).catch(this.handleObservableError);
  }

}
