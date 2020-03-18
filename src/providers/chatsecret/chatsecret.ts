import { Chatsecret } from './../../models/chatsecret.model';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { BaseService } from "../base/base";


import * as firebase from 'firebase/app';

@Injectable()
export class ChatSecretService extends BaseService {

  chatsecret: FirebaseListObservable<Chatsecret[]>;

  constructor(
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public http: Http
  ) {
    super();
    this.setChatsecret();
  }

  //CRIAR LISTA DE CHATS DO USER LOGADO
  private setChatsecret(): void {
    this.afAuth.authState
      .subscribe((authUser: firebase.User) => {//OUVINDO AUTERAÇão DO AUTSTATE
        if (authUser) {//se user estiver logado 
          this.chatsecret = <FirebaseListObservable<Chatsecret[]>>this.db.list(`/chatsecret/${authUser.uid}`, {
            query: {
              orderByChild: 'timestamp'
            }
          }).map((chats: Chatsecret[]) => {
            return chats.reverse();//rotorno ordem descrescente lista contatos
          }).catch(this.handleObservableError);
        }
      });
  }

  //CRIA NOVOS CHATS ENTRE USUARIOS
  create(chatsecret: Chatsecret, userId1: string, userId2: string): firebase.Promise<void> {
    return this.db.object(`/chatsecret/${userId1}/${userId2}`)
      .set(chatsecret)//salva chat
      .catch(this.handlePromiseError);
  }

  //BUSCA UM CHATSECRET ESPECIFICO
  getDeepChatsecret(userId1: string, userId2: string): FirebaseObjectObservable<Chatsecret> {
    return <FirebaseObjectObservable<Chatsecret>>this.db.object(`/chatsecret/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }


  updatePhoto(chatsecret: FirebaseObjectObservable<Chatsecret>, chatsecretPhoto: string, recipientUserPhoto: string): firebase.Promise<boolean> {
    if (chatsecretPhoto != recipientUserPhoto) {
      return chatsecret.update({
        photo: recipientUserPhoto
      }).then(() => {
        return true;
      }).catch(this.handlePromiseError);
    }
    return Promise.resolve(false);
  }

}
