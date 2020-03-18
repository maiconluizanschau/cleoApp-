import { LottieAnimationViewModule } from 'ng-lottie';
import { Http } from '@angular/http';
import { Component, ViewChild, ViewChildren, QueryList } from '@angular/core';

import { User } from './../../models/user.models';
import { Config } from '../../models/config.model';
import { Flert } from '../../models/flert.model';
import { Chatsecret } from '../../models/chatsecret.model';

import { UserService } from './../../providers/user/user';
import { AuthService } from './../../providers/auth/auth';
import { ConfiguracaoService } from './../../providers/configuracao/configuracao';
import { MatchService } from '../../providers/match/match';
import { ChatService } from '../../providers/chat/chat';

import { IntroPage } from '../intro/intro';
import { ChatListPage } from '../chat_list/chat_list';
import { ChatSecretoPage } from '../chat-secreto/chat-secreto';

import { SwingStackComponent } from 'angular2-swing/dist/swing-stack-component';
import { FirebaseObjectObservable, FirebaseListObservable, AngularFireDatabase } from 'angularfire2/database';
import { SwingCardComponent } from 'angular2-swing/dist/swing-card-component';
import { StackConfig } from 'angular2-swing/dist/swing';

import { ToastController } from 'ionic-angular/components/toast/toast-controller';
import { NavController, AlertController, Loading, LoadingController, ModalController } from 'ionic-angular';
import 'rxjs/Rx';
import * as firebase from 'firebase/app';
import { Voto } from '../../models/voto.model';

import { Observable } from 'rxjs';
import { ChatSecretService } from '../../providers/chatsecret/chatsecret';


@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {

    like: FirebaseObjectObservable<any>;
    view: FirebaseObjectObservable<any>;
    flerts: boolean;
    card = [];
    votos: FirebaseListObservable<any[]>;
    user: User;
    users: FirebaseListObservable<User[]>;
    acabou: boolean = false;
    loading: Loading;
    new_match: boolean;
    userLogado: User;
    userMatch: User;
    lottieConfig:any;
    constructor(
        public authService: AuthService,
        public navCtrl: NavController,
        public userService: UserService,
        public alertCtrl: AlertController,
        public confService: ConfiguracaoService,
        public matchService: MatchService,
        public chatService: ChatService,
        private toastCtrl: ToastController,
        private configService: ConfiguracaoService,
        public af: AngularFireDatabase,
        public chatSecretService: ChatSecretService,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController

    ) {
        LottieAnimationViewModule.forRoot();

        this.lottieConfig = {
            path: 'assets/whys.json',
            autoplay: true,
            loop: true
        }
    }


    //VERIFICAR SE TA LOGADO
    ionViewCanEnter(): Promise<boolean> {
        return this.authService.authenticated;
    }

    ionViewWillEnter() {
        this.loading = this.showLoading();
        this.getHome();
    }

    //BUSCA CONFIG INICIAL
    public getHome() {
        this.confService
            .buscaConfig()
            .first()
            .subscribe((config: Config) => {
                if (config.intro === true) {
                    this.loading.dismiss(); //tira o carregando...
                    this.navCtrl.setRoot(IntroPage);
                }
                else if (config.intro === false) {
                    //DIRECIONAR A PAGINA CONFORME O GENERO
                    this.userService.currentUser
                        .first()
                        .subscribe((currentUser: User) => {
                            switch (currentUser.genero) {
                                case "Masculino":
                                    switch (config.ativo) {
                                        case true:
                                            this.getOneUser();
                                            this.flerts = false;
                                            this.new_match = false;
                                            this.loading.dismiss(); //tira o carregando...
                                            break;
                                        case false:
                                            this.flerts = true;
                                            this.new_match = false;
                                            this.getLikes();
                                            this.getViews();
                                            this.loading.dismiss(); //tira o carregando...
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                case "Feminino":
                                    switch (config.ativo) {
                                        case true:
                                            this.getOneUser();
                                            this.flerts = false;
                                            this.new_match = false;
                                            this.loading.dismiss(); //tira o carregando...
                                            break;
                                        case false:
                                            this.flerts = true;
                                            this.new_match = false;
                                            this.getLikes();
                                            this.getViews();
                                            this.loading.dismiss(); //tira o carregando...
                                            break;
                                        default:
                                            this.loading.dismiss(); //tira o carregando...
                                            break;
                                    }
                                    break;
                                case "Outros":
                                    switch (config.ativo) {
                                        case true:
                                            this.getOneUser();
                                            this.flerts = false;
                                            this.loading.dismiss(); //tira o carregando...
                                            break;
                                        case false:
                                            this.flerts = true;
                                            this.getLikes();
                                            this.getViews();
                                            this.loading.dismiss(); //tira o carregando...
                                            break;
                                        default:
                                            break;
                                    }
                                    break;
                                default:
                                    console.log("GENERO NAO DEFINIDO");
                                    break;
                            }
                        });
                }
            })
    }

    //CHAMA PAGE CHAT
    private Chat(): void {
        this.navCtrl.push(ChatListPage);
    }

    //BUSCA LIKES
    public getLikes() {
        this.matchService.getTotalVotos()
            .subscribe(action => {
                this.like = action.like;
            });
    }

    //BUSCA VIEWS
    public getViews() {
        this.matchService.getTotalViews()
            .subscribe(action => {
                this.view = action.view;
            });
    }


    //BUSCA USERS
    /* 
    Aqui foi feito uma matriz para percorer os votos e usuarios
    primeiro busca o usuario e verifica se tem o id dele no array de votos
    se tiver coloca verifica como false, para nao add no array que vai pra view
    */
    private getOneUser() {
        let verifica: boolean = true;
        let achokey: any;

        this.configService.buscaConfig()
            .subscribe((config: Config) => {
                this.userService.filtro(config)
                    .subscribe(users => {
                        this.matchService.getVotos(this.authService.getUid())
                            .subscribe(votos => {
                                users.forEach(user => {
                                    if (users.length == 0) {
                                        this.user = null;
                                    } else {
                                        votos.forEach(voto => {
                                            if (voto.key === user.key) {
                                                verifica = false;
                                            }
                                        });
                                        if (verifica) {
                                            achokey = user.key;
                                            //console.log("->" + user.key);
                                        }
                                        verifica = true;
                                    }
                                });
                                if (achokey) {
                                    this.acabou = false;
                                    this.userService.getUser(achokey)
                                        .first()
                                        .subscribe((user: User) => {
                                            this.user = user; //atribuir valores 
                                        });
                                } else {
                                    this.acabou = true;
                                }
                            });

                    });

            });


    }

    //CRIAÇAÕ DO CHAT ENTRE USUARIOS TEMPORÁRIO 24 HORAS
    public openChaSecret(recipientUser: User): void {

        //this.matchService.createFlertLikes(recipientUser.key, this.authService.getUid(), false, false);

        this.userService.currentUser//PEGA USUARIO LOGADO
            .first()
            .subscribe((currentUser: User) => {
                this.chatSecretService.getDeepChatsecret(currentUser.$key, recipientUser.$key)  // caminho /users/id1/id2
                    .first()
                    .subscribe((chat: Chatsecret) => {
                        //o objeto chat tem um propriedade(chat)valida?
                        if (chat.hasOwnProperty('$value')) {
                            let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase""
                            let chat1 = new Chatsecret(timestamp, '', timestamp, recipientUser.name, (recipientUser.photo || ''));
                            this.chatSecretService.create(chat1, currentUser.$key, recipientUser.$key);
                            let chat2 = new Chatsecret(timestamp, '', timestamp, recipientUser.name, (currentUser.photo || ''));
                            this.chatSecretService.create(chat2, recipientUser.$key, currentUser.$key);
                        }
                    });
            });
        this.navCtrl.push(ChatSecretoPage, {
            recipientUser: recipientUser
        });
    }   

    // VOTAÇÂO
    public voteUp(like: boolean, user: User) {
        console.log("VOTOU");
        this.card.pop();
        this.getOneUser()
        console.log(like);
        //this.matchService.removeUser(user.$key);
        this.userService.currentUser//PEGA USUARIO LOGADO
            .first()
            .subscribe((c: User) => {
                if (like) {
                    this.new_match = true;
                    this.userLogado = c;
                    this.userMatch = user;
                    this.presentToast(true);
                    let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                    let user1 = new Flert(user.key, timestamp, user.name, (user.photo || ''), user.idade);
                    this.matchService.createFlertLikes(user1.key, c.key, true, true);
                } else if (!like) {
                    this.presentToast(false);
                    let timestamp: Object = firebase.database.ServerValue.TIMESTAMP;//pega time temp do firebase
                    let user1 = new Flert(user.key, timestamp, user.name, (user.photo || ''), user.idade);
                    this.matchService.createFlertLikes(user1.key, c.key, false, false);

                }
            });
    }

    presentToast(tipo: boolean) {
        if (tipo) {
            let toast = this.toastCtrl.create({
                message: 'LIKE',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
        else {
            let toast = this.toastCtrl.create({
                message: 'DESLIKE',
                duration: 3000,
                position: 'top'
            });
            toast.present();    
        }
    }

    //MOSTRA MENSAGEM DE AGUARDE...
    private showLoading(): Loading {
        let loading: Loading = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        //mostra carregamento pagina
        loading.present();
        return loading;
    }


}