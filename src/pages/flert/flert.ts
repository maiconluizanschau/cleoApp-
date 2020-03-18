import { LottieAnimationViewModule } from 'ng-lottie';
import { ConfigPage } from './../config/config';
import { AngularFireDatabase } from 'angularfire2/database';
import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { Chat } from './../../models/chat.model';
import { User } from './../../models/user.models';

import { UserService } from './../../providers/user/user';
import { MatchService } from './../../providers/match/match';
import { ChatService } from './../../providers/chat/chat';
import { AuthService } from "../../providers/auth/auth";
import { ChatListPage } from "../chat_list/chat_list";
import { ChatPage } from './../chat/chat';
import * as firebase from 'firebase/app';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@Component({
    selector: 'page-flert',
    templateUrl: 'flert.html'
})
export class FlertPage {

    userList = [];
    lottieConfig:any;
    constructor(
        public navCtrl: NavController,
        public authService: AuthService,
        public matchservice: MatchService,
        public alertCtrl: AlertController,
        public userService: UserService,
        public chatService: ChatService,
        public db: AngularFireDatabase,
        private toastCtrl: ToastController 
    ) { 
        this.userList = this.matchservice.meusFlerts(this.authService.getUid());
        LottieAnimationViewModule.forRoot();

        this.lottieConfig = {
            path: 'assets/not_found.json',
            autoplay: true,
            loop: true
        }
    }

    ionViewDidEnter() {
        //this.userList = this.matchservice.buscaMeusFlert();//antigo
        this.userList = this.matchservice.meusFlerts(this.authService.getUid());
    }

    //VERIFICAR SE TA LOGADO
    ionViewCanEnter(): Promise<boolean> {
        return this.authService.authenticated;
    }

    //DEFAZER FLEART DEL OBSERBLE
    private desfazerFleat(index, user: any) {
        const alert = this.alertCtrl.create({
            title: 'Confirmação',
            message: 'Você deseja desfazer o flert?',
            buttons: [
                {
                    text: 'NÃO',
                },
                {
                    text: 'SIM',
                    handler: () => {
                        this.matchservice.remover(user.key, this.authService.getUid());
                        this.userList.splice(index, 1);
                        this.userList = this.matchservice.meusFlerts(this.authService.getUid());
                        this.toastCtrl.create({ message: 'Flert desfeito </3', duration: 1000, position: 'top' }).present();
                    }
                }
            ]
        });
        alert.present();

    }

    //CRIAÇAÕ DO CHAT ENTRE USUARIOS 
    private openChat(recipientUser: User): void {
        this.userService.currentUser//PEGA USUARIO LOGADO
            .first()
            .subscribe((currentUser: User) => {
                this.chatService.getDeepChat(currentUser.$key, recipientUser.$key)  // caminho /users/id1/id2
                    .first()
                    .subscribe((chat: Chat) => {
                        //o objeto chat tem um propriedade(chat)valida?
                        if (chat.hasOwnProperty('$value')) {
                            let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                            let chat1 = new Chat('', timestamp, recipientUser.name, (recipientUser.photo || ''));
                            this.chatService.create(chat1, currentUser.$key, recipientUser.$key);
                            let chat2 = new Chat('', timestamp, currentUser.name, (currentUser.photo || ''));
                            this.chatService.create(chat2, recipientUser.$key, currentUser.$key);
                        }
                    });
            });
        this.navCtrl.push(ChatPage, {
            recipientUser: recipientUser
        });
    }

//IR PAGINA CONFIGURAÇÕES
    onConfig(): void {
        this.navCtrl.push(ConfigPage);
    }

    //IR PAGINA DO CHAT
    private chat(): void {
        this.navCtrl.push(ChatListPage);
    }

    //PERMITIR A VISUALIZAÇÃO DO PERFIL
    private abrirPerfil(user: any) {
        this.alertCtrl.create({
            title: 'Confirmação',
            message: 'Você deseja abrir seu perfil para ' + user.name,
            buttons: [

                {
                    text: 'NÃO',
                    handler: () => {
                        this.matchservice.viewPerfil(user, this.authService.getUid(), false);
                    }
                },
                {
                    text: 'SIM',
                    handler: () => {
                        this.matchservice.viewPerfil(user, this.authService.getUid(), true);
                    }
                },
                {
                    text: 'CANCELAR',
                }
            ]
        }).present();
        this.userList = [];
        this.userList = this.matchservice.meusFlerts(this.authService.getUid());

    }

}
