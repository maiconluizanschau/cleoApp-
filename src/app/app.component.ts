import { Component } from '@angular/core';
import { Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';

import { NativeStorage } from '@ionic-native/native-storage';
import { Network } from '@ionic-native/network';


import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';

import { AuthService } from './../providers/auth/auth';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { ChatService } from '../providers/chat/chat';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //rootPage:any = LoginPage;

  rootPage: any;

  constructor(
    private platform: Platform,
    private afAuth: AngularFireAuth,
    private statusBar: StatusBar,
    private splashscreen: SplashScreen,
    public nativeStorage: NativeStorage,
    public splashScreen: SplashScreen,
    public authService: AuthService,
    private toastCtrl: ToastController,
    private network: Network,
    public chatService: ChatService,
    private localNotifications: LocalNotifications


  ) {
    this.escutaChat();
    this.auth()
    this.lookForNetwork();
  }

  //VERIFICAR A AUTENTICAÇÃO 
  auth() {
    this.platform.ready().then(() => {
      this.afAuth.authState.subscribe(
        auth => {
          if (!auth)//NÂO AUTENTICADO
          {
            this.rootPage = LoginPage;
          }
          else//AUTENTICADO
          {
            this.authService.setUid(auth.uid); // Set uid
            this.rootPage = TabsPage;
          }
        });
      this.statusBar.styleDefault();
      this.splashscreen.hide();
    });
  }

  //VERIFICAÇÂO DE CONEXAO
  lookForNetwork() {
    //While app open
    if (this.network.type == 'none') {
      let toast = this.toastCtrl.create({
        message: 'Internet Não Disponivel../!',
        duration: 3000,
        position: 'bottom'
      }).present();
    }

    this.network.onDisconnect()
      .subscribe(() => {
        let toast = this.toastCtrl.create({
          message: 'Sem conexão',
          duration: 3000,
          position: 'bottom'
        }).present();
      });

    this.network.onConnect()
      .subscribe(() => {
        let toast = this.toastCtrl.create({
          message: 'Internet conectada../!',
          duration: 3000,
          position: 'bottom'
        }).present();
      });
  }

  escutaChat() {
    this.chatService.getObjetoChat(this.authService.getUid())
      .first().subscribe(obj => {
        if (obj != 0 || obj != null) {
          this.localNotifications.schedule({
            id: 1,
            text: 'Você tem uma nova Mensagem',
          });
        }
      })
  }
}

