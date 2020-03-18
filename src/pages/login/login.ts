import { Component } from '@angular/core';
import { NavController, LoadingController, Loading } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { UserService } from "../../providers/user/user";
import { AuthService } from "../../providers/auth/auth";

@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {

    //imagens de fundo slide
    backgrounds = [
        'assets/images/background/slide01.jpg',
        'assets/images/background/slide02.jpg',
        'assets/images/background/slide03.jpg',
        'assets/images/background/slide04.jpg'
    ];

    constructor(
        public navCtrl: NavController,
        public userService: UserService,
        public authService: AuthService,
        public af: AngularFireAuth,
        public loadingCtrl: LoadingController,
    ) {

    }

    //LOGIN VIA FACEBOOK NAVEGADOR
    loginNav() {
        this.af.auth
            .signInWithPopup(new firebase.auth.FacebookAuthProvider())
            .then();
    }

    //LOGIN VIA FACEBOOK MOBILE
    loginFacebook(): void {
        this.authService.createAuthUser()//CRIA AUTENTICAÇÃO USER
            .then(authUser => {
                //console.log("AUTENTICADO: " + authState.uid);
                this.userService.create()//GRAVA DADOS 
                    .then((r) => {
                        console.log("DADOS GRAVADOS");
                    })
                    .catch((e) => {
                        console.log("PROBLEMA GRAVAR DADOS");
                    })
            })
            .catch((error: any) => {
                console.log("ERROO GRAVAR NO LOGIN.TS" + error);
            });
    }

    //MOSTRA MENSAGEM DE AGUARDE...
    private showLoading(): Loading {
        let loading: Loading = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        //mostra carregamento pagina quando fizer o cadastro
        loading.present();

        //let loading: Loading = this.showLoading();//inicia
        // loading.dismiss();///fecha

        return loading;
    }
}
