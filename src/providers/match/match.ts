import { AuthService } from './../auth/auth';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as firebase from 'firebase/app';


import { Flert } from './../../models/flert.model';
import { User } from './../../models/user.models';
import { BaseService } from "../base/base";
import { UserService } from '../user/user';
import { Voto } from '../../models/voto.model';
import { ChatSecretService } from '../chatsecret/chatsecret';
import { Chatsecret } from '../../models/chatsecret.model';
import { AlertController } from 'ionic-angular';



@Injectable()
export class MatchService extends BaseService {

  //array de usuario
  users: FirebaseListObservable<User[]>;
  user: FirebaseObjectObservable<User>;
  currentUser: FirebaseObjectObservable<User>;
  likes: FirebaseObjectObservable<any>;

  votos: FirebaseListObservable<any[]>;
  constructor(
    public http: Http,
    public afAuth: AngularFireAuth,
    public db: AngularFireDatabase,
    public authService: AuthService,
    public userService: UserService,
    public alertCtrl: AlertController
  ) {
    super();//EXTENDS BaseService -> Trata erros   
  }

  //BUSCA DE TOTAL DE VIEWS
  getTotalViews() {
    return this.db.object(`/view/` + this.authService.getUid())
  }

  //BUSCA DE TOTAL DE VOTOS
  getTotalVotos() {
    return this.db.object(`/like/` + this.authService.getUid())
  }

  //BUSCA DE TOTAL DE VOTOS
  getVoto(id) {
    return firebase.database().ref('like/' + id + '/').child('like').once('value');
  }

  //BUSCA DE TOTAL DE VIEW
  getView(id) {
    return firebase.database().ref('view/' + id + '/').child('view').once('value');
  }

  //CONTADOR DE NOVOS VOTOS
  setNewVotos(id: string, num: number) {
    return this.db.object('like/' + id + '/').set({ like: num + 1 });
    //return firebase.database().ref('like/' + id + '/').child('like').set(num + 1);
  }

  //CONTADOR DE NOVOS VIEWS
  setNewView(id: string, num: number) {
    return this.db.object('view/' + id + '/').set({ view: num + 1 });
    //return firebase.database().ref('like/' + id + '/').child('like').set(num + 1);
  }

  //CRIA LIKES
  public createFlertLikes(flert: string, userId1: string, tipo: boolean, view: boolean): firebase.Promise<void> {
    if (tipo) {
      this.getVoto(flert)//busca votos totais
        .then(total => {
          this.setNewVotos(flert, total.val()); //incrmeneta voto
        });
    }

    //BUSCA VIEWS TOTAIS
    this.getView(flert)
      .then(total => {
        this.setNewView(flert, total.val()); //incrmeneta view
      });

    return this.db.object(`/voto/${userId1}/${flert}`)
      .set({
        key: flert,
        voto: tipo,
      })
      .catch(this.handlePromiseError);
  }

  //BUSCA VOTOS DO ID ESPECIFICO
  public getVotos(id: string): FirebaseListObservable<Voto[]> {
    return <FirebaseListObservable<Voto[]>>this.db.list(`/voto/${id}`, {
      query: {
        orderByChild: 'view', // filtrando pelo campo "voto"
        //equalTo: true, // e que tnha o valor true
      }
    })
      /*.map((vt: Voto[]) => {
        return vt.filter((vt: Voto) => vt.voto === true);
      })*/
      .catch(this.handleObservableError);
  }

  //BUSCA ID DOS CHATS SECRETS INICIADOS
  public getSecretsIds(id: string): FirebaseListObservable<any[]> {
    return <FirebaseListObservable<any[]>>this.db.list(`/chatsecret/${id}`)
      .catch(this.handleObservableError);
  }

  // //BUSCAS CHATS SECRETS
   public secrets(): Array<any[]> {
     let timeAtual = new Date();
     let us = [];
     const minhaKey = this.authService.getUid();
     const rootRef = firebase.database().ref();
     const votos = rootRef.child('chatsecret');
     votos.child(minhaKey).on('child_added', voto => {
       this.userService.getUser(voto.key)
         .subscribe((user: User) => {
           us.push(user);
         });
     })
     return us;
   }
  

  //BUSCA UM CHATSECRET ESPECIFICO
  getDeepChatsecret(userId1: string, userId2: string): FirebaseObjectObservable<Chatsecret> {
    return <FirebaseObjectObservable<Chatsecret>>this.db.object(`/chatsecret/${userId1}/${userId2}`)
      .catch(this.handleObservableError);
  }


  //BUSCA PESSOAS QUE FOI DADO FLERTS
  public meusFlerts(minhaKey: string): Array<any[]> {
    let users = [];
    this.getVotos(minhaKey)
      .subscribe(votos => {
        votos.forEach(voto => {
          this.userService.getUser(voto.key)
            .subscribe((user: User) => {
              users.push(user);
            })
        });
      })
    return users;
  }

  //BUSCA SEUS LIKES com ANGULAR FIREBASE
  public buscaMeusFlert(): Array<any[]> {

    let us = [];
    const minhaKey = this.authService.getUid();
    const rootRef = firebase.database().ref();
    const votos = rootRef.child('voto');
    const users = rootRef.child('users');

    votos.child(minhaKey).on('value', voto => {
      users.child(voto.key).once('value')
        .then(user => {
          us.push(user.val());
        });
    })
    return us;
  }

  //REMOVENDO VOTO AMBOS USERS QUEM DA O VOTO E QUEM RECEBE
  public remover(key, minhakey) {
    firebase.database().ref("voto/" + minhakey + "/" + key).remove();
    firebase.database().ref("voto/" + key + "/" + minhakey).remove();
  }

  //ALTERAR TIPO E VIEW DO USER
  public viewPerfil(user: any, id: string, tipo: boolean) {
    return this.db.object('voto/' + user.key + '/' + id)
      .update({
        view: tipo
      });
  }

}
