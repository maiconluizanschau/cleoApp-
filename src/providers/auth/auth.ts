import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import 'rxjs/add/operator/map';
import { AngularFireAuth } from "angularfire2/auth";
import * as firebase from 'firebase/app';

import { Facebook } from '@ionic-native/facebook';
import { BaseService } from "../base/base";

@Injectable()
export class AuthService extends BaseService {

    private uid: string;

    constructor(
        public afAuth: AngularFireAuth,
        public http: Http,
        private facebook: Facebook,
        
    ) {
        super();//EXTENDS BaseService -> Trata erros
    }

    

    setUid(uid: string): void {
        this.uid = uid;
    }

    getUid(): string {
        return this.uid;
    }

    //CRIA AUTENTICAÇÃO USUARIO
    createAuthUser(): firebase.Promise<void> {
        return this.facebook.login(
            [
                'public_profile', 'email', 'user_birthday',
                'user_hometown', 'user_likes', 'user_location', 'user_photos', 'user_status'
            ])//solicita permisão
            .then((sucesso) => {
                const facebookCredential = firebase.auth.FacebookAuthProvider.credential(sucesso.authResponse.accessToken);

                firebase.auth().signInWithCredential(facebookCredential);//grava autenticação
            })
            .catch(this.handlePromiseError);
    }

    //VERIFICAÇÃO SE USUARIO ESTÁ AUTENTENTICADO
    get authenticated(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            this.afAuth
                .authState
                .first()
                .subscribe((authUser: firebase.User) => {
                    (authUser) ? resolve(true) : reject(false);
                });
        });
    }

    //SAIR DO APP
    logout(): firebase.Promise<any> {
        return this.afAuth.auth.signOut();
    }

    deletarConta(id: any){
        var db = firebase.database();
        this.logout();
        db.ref("users/"+id).remove();
        db.ref("config/"+id).remove();
        db.ref("voto/"+id).remove();
        db.ref("view/"+id).remove();
        db.ref("like/"+id).remove();
        db.ref("chats/"+id).remove();
        db.ref("chatsecret/"+id).remove();
        //nao ta removendo pq é ID_MEU-ID_OUTRO
        db.ref("messages/"+id+"-").remove();
        db.ref("messagesecret/"+id+"-").remove();
        
    }
}
