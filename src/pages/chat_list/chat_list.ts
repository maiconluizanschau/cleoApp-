import { HomePage } from './../home/home';
import { Chatsecret } from './../../models/chatsecret.model';
import { Component } from '@angular/core';

import { MenuController, NavController } from 'ionic-angular';

import { FirebaseListObservable, FirebaseObjectObservable, AngularFireDatabase } from 'angularfire2/database';

import { Chat } from './../../models/chat.model';
import { User } from './../../models/user.models';

import { ChatPage } from './../chat/chat';

import { ChatService } from './../../providers/chat/chat';
import { AuthService } from './../../providers/auth/auth';
import { UserService } from './../../providers/user/user';

import * as firebase from 'firebase/app';
import { ChatSecretoPage } from '../chat-secreto/chat-secreto';
import { MatchService } from '../../providers/match/match';
import { AlertController } from 'ionic-angular/components/alert/alert-controller';
import { ChatSecretService } from '../../providers/chatsecret/chatsecret';
import { ConfiguracaoService } from '../../providers/configuracao/configuracao';
import { Config } from '../../models/config.model';
import { Flert } from '../../models/flert.model';

@Component({
    selector: 'page-chat_list',
    templateUrl: 'chat_list.html'
})
export class ChatListPage {

    usersSecrets: FirebaseListObservable<User[]>;
    view: string = 'flerts';
    Chatsecret: boolean = false;
    mostrar: boolean;

    user: FirebaseObjectObservable<User>;
    users: FirebaseListObservable<User[]>;

    meusFlerts = [];
    meusChatsSecrets = [];

    constructor(
        public authService: AuthService,
        public chatService: ChatService,
        public menuCtrl: MenuController,
        public navCtrl: NavController,
        public userService: UserService,
        public flertService: MatchService,
        public db: AngularFireDatabase,
        public alertCtrl: AlertController,
        public chatSecretService: ChatSecretService,
        public configService: ConfiguracaoService,
        public matchService: MatchService

    ) {


    }

    //ANTES DAS PAGINAS CARREGAR VERIFICAR SE TA LOGADO
    ionViewCanEnter(): Promise<boolean> {
        return this.authService.authenticated;

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
                        this.flertService.viewPerfil(user, this.authService.getUid(), false);
                    }
                },
                {
                    text: 'SIM',
                    handler: () => {
                        this.flertService.viewPerfil(user, this.authService.getUid(), true);
                    }
                },
                {
                    text: 'CANCELAR',
                }
            ]
        }).present();

    }

    //PAGIANA ESTA CARREGADA
    ionViewDidLoad() {
        //this.chats = this.chatService.chats; //conversas
        //this.users = this.userService.users; // usuarios
        let id = this.authService.getUid();
        this.meusChatsSecrets = [];
        this.meusChatsSecrets = this.flertService.secrets();
        this.meusFlerts = [];
        this.meusFlerts = this.flertService.meusFlerts(id);
        this.menuCtrl.enable(true, 'user-menu');
    }

    //FAZER PESQUISA DO USER
    filterItems(event: any): void {
        let searchTerm: string = event.target.value;
        if (searchTerm) {
            switch (this.view) {
                case 'secrets':
                    this.meusChatsSecrets = this.meusChatsSecrets
                        .filter(
                            (user: User) => (
                                user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                            ));
                    break;
                case 'flerts':
                    this.meusFlerts = this.meusFlerts.find(
                        (user: User) => (
                            user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1
                        ));
                    break;
            }
        } else {
            this.meusChatsSecrets = [];
            this.meusChatsSecrets = this.flertService.secrets();
            this.meusFlerts = [];
            this.meusFlerts = this.flertService.meusFlerts(this.authService.getUid());
        }
    }

    //CRIAÇAÕ DO CHAT ENTRE USUARIOS 
    onChatCreate(recipientUser: User): void {
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

    //CRIAÇAÕ DO CHAT ENTRE USUARIOS TEMPORÁRIO 24 HORAS
    private openChaSecret(index: number, recipientUser: User): void {
        let timeAtual = new Date();
        let minhaKey = this.authService.getUid();

        this.matchService.getDeepChatsecret(minhaKey, recipientUser.key)  // caminho /users/id1/id2
            .subscribe((chat: Chatsecret) => {
                let timeBanco = new Date(chat.inicioChat);
                timeBanco.setTime(timeBanco.getTime() + 172800000);
                //console.log("BANCO MAIS 1: "+timeBanco.getTime()); 
                //console.log("BANCO MAIS 1: "+timeBanco);
                /*
                é pego a data do banco que vem em milsegundos add 2 dia a mais (172800000) 
                calculado a diferença se a diferença for maior e positiva  user deve ser removido caso for menos
                e negativa mostrar
                */
                let diferenca = timeBanco.getTime() - timeAtual.getTime();
                console.log("DIFERENCA: "+diferenca*-1);

                if (diferenca* -1 >= 172800000) {
                    console.log("PASSOO DAS 24h a remover_> " + recipientUser.key);
                    this.doConfirm(index,minhaKey, recipientUser)
                }
                else if(diferenca* -1 < 172800000) {
                    console.log("DENTRO DAS 24h " );
                    this.navCtrl.push(ChatSecretoPage, {
                        recipientUser: recipientUser
                    });
                }
            });
    }

    //MENSAGEM QUE TEMPO JA SE ESGOTOU 24h
    private doConfirm(index:number, minhaKey, user: User) {
        const alert = this.alertCtrl.create({
            title: 'Vocẽ deseja Flertar Sim ou Não?',
            message: 'O Chat Secreto com '+ user.name+' já esgotou. ',
            buttons: [
                {
                    text: 'DESLIKE',
                    handler: () => {
                        console.log('Não');
                        //firebase.database().ref("chatsecret/" + minhaKey + "/" + user.key).remove();
                        //firebase.database().ref("chatsecret/" + user.key + "/" + minhaKey).remove();
                        let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                        let user1 = new Flert(user.key, timestamp, user.name, (user.photo || ''), user.idade);
                        this.matchService.createFlertLikes(user1.key, minhaKey, false, false);
                        firebase.database().ref("chatsecret/" + minhaKey + "/" + user.key).remove();
                        firebase.database().ref("chatsecret/" + user.key + "/" + minhaKey).remove();
                        firebase.database().ref("messagesecret/" + minhaKey + "-" + user.key).remove();
                        firebase.database().ref("messagesecret/" + user.key + "-" + minhaKey).remove();
                    }
                },
                {
                    text: 'LIKE',
                    handler: () => {
                        console.log('SIM');
                        let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                        let user1 = new Flert(user.key, timestamp, user.name, (user.photo || ''), user.idade);
                        this.matchService.createFlertLikes(user1.key, minhaKey, true, true);
                        firebase.database().ref("chatsecret/" + minhaKey + "/" + user.key).remove();
                        firebase.database().ref("chatsecret/" + user.key + "/" + minhaKey).remove();
                        firebase.database().ref("messagesecret/" + minhaKey + "-" + user.key).remove();
                        firebase.database().ref("messagesecret/" + user.key + "-" + minhaKey).remove();
                    }
                }
            ]
        });

        alert.present();        
        this.meusChatsSecrets.splice(index, 1);
        this.meusFlerts = [];
        this.navCtrl.setRoot(HomePage);
    }

}
