webpackJsonp([0],{

/***/ 125:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MatchService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase_app__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_base__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_ionic_angular__ = __webpack_require__(21);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};









var MatchService = (function (_super) {
    __extends(MatchService, _super);
    function MatchService(http, afAuth, db, authService, userService, alertCtrl) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.afAuth = afAuth;
        _this.db = db;
        _this.authService = authService;
        _this.userService = userService;
        _this.alertCtrl = alertCtrl;
        return _this;
    }
    //BUSCA DE TOTAL DE VIEWS
    MatchService.prototype.getTotalViews = function () {
        return this.db.object("/view/" + this.authService.getUid());
    };
    //BUSCA DE TOTAL DE VOTOS
    MatchService.prototype.getTotalVotos = function () {
        return this.db.object("/like/" + this.authService.getUid());
    };
    //BUSCA DE TOTAL DE VOTOS
    MatchService.prototype.getVoto = function (id) {
        return __WEBPACK_IMPORTED_MODULE_5_firebase_app__["database"]().ref('like/' + id + '/').child('like').once('value');
    };
    //BUSCA DE TOTAL DE VIEW
    MatchService.prototype.getView = function (id) {
        return __WEBPACK_IMPORTED_MODULE_5_firebase_app__["database"]().ref('view/' + id + '/').child('view').once('value');
    };
    //CONTADOR DE NOVOS VOTOS
    MatchService.prototype.setNewVotos = function (id, num) {
        return this.db.object('like/' + id + '/').set({ like: num + 1 });
        //return firebase.database().ref('like/' + id + '/').child('like').set(num + 1);
    };
    //CONTADOR DE NOVOS VIEWS
    MatchService.prototype.setNewView = function (id, num) {
        return this.db.object('view/' + id + '/').set({ view: num + 1 });
        //return firebase.database().ref('like/' + id + '/').child('like').set(num + 1);
    };
    //CRIA LIKES
    MatchService.prototype.createFlertLikes = function (flert, userId1, tipo, view) {
        var _this = this;
        if (tipo) {
            this.getVoto(flert) //busca votos totais
                .then(function (total) {
                _this.setNewVotos(flert, total.val()); //incrmeneta voto
            });
        }
        //BUSCA VIEWS TOTAIS
        this.getView(flert)
            .then(function (total) {
            _this.setNewView(flert, total.val()); //incrmeneta view
        });
        return this.db.object("/voto/" + userId1 + "/" + flert)
            .set({
            key: flert,
            voto: tipo,
        })
            .catch(this.handlePromiseError);
    };
    //BUSCA VOTOS DO ID ESPECIFICO
    MatchService.prototype.getVotos = function (id) {
        return this.db.list("/voto/" + id, {
            query: {
                orderByChild: 'view',
            }
        })
            .catch(this.handleObservableError);
    };
    //BUSCA ID DOS CHATS SECRETS INICIADOS
    MatchService.prototype.getSecretsIds = function (id) {
        return this.db.list("/chatsecret/" + id)
            .catch(this.handleObservableError);
    };
    // //BUSCAS CHATS SECRETS
    MatchService.prototype.secrets = function () {
        var _this = this;
        var timeAtual = new Date();
        var us = [];
        var minhaKey = this.authService.getUid();
        var rootRef = __WEBPACK_IMPORTED_MODULE_5_firebase_app__["database"]().ref();
        var votos = rootRef.child('chatsecret');
        votos.child(minhaKey).on('child_added', function (voto) {
            _this.userService.getUser(voto.key)
                .subscribe(function (user) {
                us.push(user);
            });
        });
        return us;
    };
    //BUSCA UM CHATSECRET ESPECIFICO
    MatchService.prototype.getDeepChatsecret = function (userId1, userId2) {
        return this.db.object("/chatsecret/" + userId1 + "/" + userId2)
            .catch(this.handleObservableError);
    };
    //BUSCA PESSOAS QUE FOI DADO FLERTS
    MatchService.prototype.meusFlerts = function (minhaKey) {
        var _this = this;
        var users = [];
        this.getVotos(minhaKey)
            .subscribe(function (votos) {
            votos.forEach(function (voto) {
                _this.userService.getUser(voto.key)
                    .subscribe(function (user) {
                    users.push(user);
                });
            });
        });
        return users;
    };
    //BUSCA SEUS LIKES com ANGULAR FIREBASE
    MatchService.prototype.buscaMeusFlert = function () {
        var us = [];
        var minhaKey = this.authService.getUid();
        var rootRef = __WEBPACK_IMPORTED_MODULE_5_firebase_app__["database"]().ref();
        var votos = rootRef.child('voto');
        var users = rootRef.child('users');
        votos.child(minhaKey).on('value', function (voto) {
            users.child(voto.key).once('value')
                .then(function (user) {
                us.push(user.val());
            });
        });
        return us;
    };
    //REMOVENDO VOTO AMBOS USERS QUEM DA O VOTO E QUEM RECEBE
    MatchService.prototype.remover = function (key, minhakey) {
        __WEBPACK_IMPORTED_MODULE_5_firebase_app__["database"]().ref("voto/" + minhakey + "/" + key).remove();
        __WEBPACK_IMPORTED_MODULE_5_firebase_app__["database"]().ref("voto/" + key + "/" + minhakey).remove();
    };
    //ALTERAR TIPO E VIEW DO USER
    MatchService.prototype.viewPerfil = function (user, id, tipo) {
        return this.db.object('voto/' + user.key + '/' + id)
            .update({
            view: tipo
        });
    };
    return MatchService;
}(__WEBPACK_IMPORTED_MODULE_6__base_base__["a" /* BaseService */]));
MatchService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */],
        __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_0__auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_7__user_user__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_8_ionic_angular__["a" /* AlertController */]])
], MatchService);

//# sourceMappingURL=match.js.map

/***/ }),

/***/ 126:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatListPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_home__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_chat_model__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__chat_chat__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_chat_chat__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_firebase_app__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__chat_secreto_chat_secreto__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__providers_match_match__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_ionic_angular_components_alert_alert_controller__ = __webpack_require__(141);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__providers_chatsecret_chatsecret__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__providers_configuracao_configuracao__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__models_flert_model__ = __webpack_require__(348);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
















var ChatListPage = (function () {
    function ChatListPage(authService, chatService, menuCtrl, navCtrl, userService, flertService, db, alertCtrl, chatSecretService, configService, matchService) {
        this.authService = authService;
        this.chatService = chatService;
        this.menuCtrl = menuCtrl;
        this.navCtrl = navCtrl;
        this.userService = userService;
        this.flertService = flertService;
        this.db = db;
        this.alertCtrl = alertCtrl;
        this.chatSecretService = chatSecretService;
        this.configService = configService;
        this.matchService = matchService;
        this.view = 'flerts';
        this.Chatsecret = false;
        this.meusFlerts = [];
        this.meusChatsSecrets = [];
    }
    //ANTES DAS PAGINAS CARREGAR VERIFICAR SE TA LOGADO
    ChatListPage.prototype.ionViewCanEnter = function () {
        return this.authService.authenticated;
    };
    //PERMITIR A VISUALIZAÇÃO DO PERFIL
    ChatListPage.prototype.abrirPerfil = function (user) {
        var _this = this;
        this.alertCtrl.create({
            title: 'Confirmação',
            message: 'Você deseja abrir seu perfil para ' + user.name,
            buttons: [
                {
                    text: 'NÃO',
                    handler: function () {
                        _this.flertService.viewPerfil(user, _this.authService.getUid(), false);
                    }
                },
                {
                    text: 'SIM',
                    handler: function () {
                        _this.flertService.viewPerfil(user, _this.authService.getUid(), true);
                    }
                },
                {
                    text: 'CANCELAR',
                }
            ]
        }).present();
    };
    //PAGIANA ESTA CARREGADA
    ChatListPage.prototype.ionViewDidLoad = function () {
        //this.chats = this.chatService.chats; //conversas
        //this.users = this.userService.users; // usuarios
        var id = this.authService.getUid();
        this.meusChatsSecrets = [];
        this.meusChatsSecrets = this.flertService.secrets();
        this.meusFlerts = [];
        this.meusFlerts = this.flertService.meusFlerts(id);
        this.menuCtrl.enable(true, 'user-menu');
    };
    //FAZER PESQUISA DO USER
    ChatListPage.prototype.filterItems = function (event) {
        var searchTerm = event.target.value;
        if (searchTerm) {
            switch (this.view) {
                case 'secrets':
                    this.meusChatsSecrets = this.meusChatsSecrets
                        .filter(function (user) { return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1); });
                    break;
                case 'flerts':
                    this.meusFlerts = this.meusFlerts.find(function (user) { return (user.name.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1); });
                    break;
            }
        }
        else {
            this.meusChatsSecrets = [];
            this.meusChatsSecrets = this.flertService.secrets();
            this.meusFlerts = [];
            this.meusFlerts = this.flertService.meusFlerts(this.authService.getUid());
        }
    };
    //CRIAÇAÕ DO CHAT ENTRE USUARIOS 
    ChatListPage.prototype.onChatCreate = function (recipientUser) {
        var _this = this;
        this.userService.currentUser //PEGA USUARIO LOGADO
            .first()
            .subscribe(function (currentUser) {
            _this.chatService.getDeepChat(currentUser.$key, recipientUser.$key) // caminho /users/id1/id2
                .first()
                .subscribe(function (chat) {
                //o objeto chat tem um propriedade(chat)valida?
                if (chat.hasOwnProperty('$value')) {
                    var timestamp = __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"].ServerValue.TIMESTAMP; //pega time temp do firebase
                    var chat1 = new __WEBPACK_IMPORTED_MODULE_4__models_chat_model__["a" /* Chat */]('', timestamp, recipientUser.name, (recipientUser.photo || ''));
                    _this.chatService.create(chat1, currentUser.$key, recipientUser.$key);
                    var chat2 = new __WEBPACK_IMPORTED_MODULE_4__models_chat_model__["a" /* Chat */]('', timestamp, currentUser.name, (currentUser.photo || ''));
                    _this.chatService.create(chat2, recipientUser.$key, currentUser.$key);
                }
            });
        });
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__chat_chat__["a" /* ChatPage */], {
            recipientUser: recipientUser
        });
    };
    //CRIAÇAÕ DO CHAT ENTRE USUARIOS TEMPORÁRIO 24 HORAS
    ChatListPage.prototype.openChaSecret = function (index, recipientUser) {
        var _this = this;
        var timeAtual = new Date();
        var minhaKey = this.authService.getUid();
        this.matchService.getDeepChatsecret(minhaKey, recipientUser.key) // caminho /users/id1/id2
            .subscribe(function (chat) {
            var timeBanco = new Date(chat.inicioChat);
            timeBanco.setTime(timeBanco.getTime() + 172800000);
            //console.log("BANCO MAIS 1: "+timeBanco.getTime()); 
            //console.log("BANCO MAIS 1: "+timeBanco);
            /*
            é pego a data do banco que vem em milsegundos add 2 dia a mais (172800000)
            calculado a diferença se a diferença for maior e positiva  user deve ser removido caso for menos
            e negativa mostrar
            */
            var diferenca = timeBanco.getTime() - timeAtual.getTime();
            console.log("DIFERENCA: " + diferenca * -1);
            if (diferenca * -1 >= 172800000) {
                console.log("PASSOO DAS 24h a remover_> " + recipientUser.key);
                _this.doConfirm(index, minhaKey, recipientUser);
            }
            else if (diferenca * -1 < 172800000) {
                console.log("DENTRO DAS 24h ");
                _this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__chat_secreto_chat_secreto__["a" /* ChatSecretoPage */], {
                    recipientUser: recipientUser
                });
            }
        });
    };
    //MENSAGEM QUE TEMPO JA SE ESGOTOU 24h
    ChatListPage.prototype.doConfirm = function (index, minhaKey, user) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Vocẽ deseja Flertar Sim ou Não?',
            message: 'O Chat Secreto com ' + user.name + ' já esgotou. ',
            buttons: [
                {
                    text: 'DESLIKE',
                    handler: function () {
                        console.log('Não');
                        //firebase.database().ref("chatsecret/" + minhaKey + "/" + user.key).remove();
                        //firebase.database().ref("chatsecret/" + user.key + "/" + minhaKey).remove();
                        var timestamp = __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"].ServerValue.TIMESTAMP; //pega time temp do firebase
                        var user1 = new __WEBPACK_IMPORTED_MODULE_15__models_flert_model__["a" /* Flert */](user.key, timestamp, user.name, (user.photo || ''), user.idade);
                        _this.matchService.createFlertLikes(user1.key, minhaKey, false, false);
                        __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"]().ref("chatsecret/" + minhaKey + "/" + user.key).remove();
                        __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"]().ref("chatsecret/" + user.key + "/" + minhaKey).remove();
                        __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"]().ref("messagesecret/" + minhaKey + "-" + user.key).remove();
                        __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"]().ref("messagesecret/" + user.key + "-" + minhaKey).remove();
                    }
                },
                {
                    text: 'LIKE',
                    handler: function () {
                        console.log('SIM');
                        var timestamp = __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"].ServerValue.TIMESTAMP; //pega time temp do firebase
                        var user1 = new __WEBPACK_IMPORTED_MODULE_15__models_flert_model__["a" /* Flert */](user.key, timestamp, user.name, (user.photo || ''), user.idade);
                        _this.matchService.createFlertLikes(user1.key, minhaKey, true, true);
                        __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"]().ref("chatsecret/" + minhaKey + "/" + user.key).remove();
                        __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"]().ref("chatsecret/" + user.key + "/" + minhaKey).remove();
                        __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"]().ref("messagesecret/" + minhaKey + "-" + user.key).remove();
                        __WEBPACK_IMPORTED_MODULE_9_firebase_app__["database"]().ref("messagesecret/" + user.key + "-" + minhaKey).remove();
                    }
                }
            ]
        });
        alert.present();
        this.meusChatsSecrets.splice(index, 1);
        this.meusFlerts = [];
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__home_home__["a" /* HomePage */]);
    };
    return ChatListPage;
}());
ChatListPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'page-chat_list',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\chat_list\chat_list.html"*/'<ion-header>\n\n  <custom-logged-header [title]="view | capitalize:true"></custom-logged-header>\n\n  <ion-toolbar>\n\n    <ion-segment large color="light" [(ngModel)]="view">\n\n      <ion-segment-button value="secrets">\n\n        Conversas Secretas\n\n      </ion-segment-button>\n\n      <ion-segment-button value="flerts">\n\n        Meus Flerts\n\n      </ion-segment-button>\n\n    </ion-segment>\n\n  </ion-toolbar>\n\n  <ion-toolbar>\n\n    <ion-searchbar (ionInput)="filterItems($event)"></ion-searchbar>\n\n  </ion-toolbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n  <ion-grid no-padding>\n\n    <ion-row [ngSwitch]="view">\n\n      <ion-col col-12>\n\n        <ion-list no-margin *ngSwitchCase="\'secrets\'">\n\n          <ion-item item-bcg *ngFor=\'let chat of meusChatsSecrets; let i = index;\' (click)="openChaSecret(i,chat)">\n\n            <ion-avatar item-left  *ngIf="mostrar">\n\n              <img [src]="chat.photo || \'assets/images/no-photo.png\'">\n\n            </ion-avatar>\n\n            <ion-avatar item-left *ngIf="!mostrar">\n\n              <img style="filter: blur(2px);" [src]="chat.photo || \'assets/images/no-photo.png\'">\n\n            </ion-avatar>\n\n            <h2 item-title>{{ chat.name}}</h2>\n\n            <ion-icon icon-small item-right>\n\n              <i class="icon"></i>\n\n            </ion-icon>\n\n            <p *ngIf="chat.lastMessage; else customMessage">{{ chat.timestamp | date:\'dd/MM/y H:mm\' }} - {{ chat.lastMessage }}</p>\n\n               <!-- contorno vermelho que da para usar para mostrar quantidade de msg\n\n                    <div class="rating">\n\n                            <ion-icon icon="md-star"></ion-icon>\n\n                            \n\n                          </div>\n\n                          <button ion-button clear item-end>\n\n                            <span class="number-circle">5</span>\n\n                          </button>\n\n                        -->\n\n                        \n\n            <ng-template #customMessage>\n\n              <p>Sem Mensagens</p>\n\n              \n\n            </ng-template>\n\n          </ion-item>\n\n          <div *ngIf="meusChatsSecrets.length < 1">\n\n              <div class="row"> \n\n                  <ion-col col-2></ion-col>\n\n                  <ion-col col-8>\n\n                      <ion-item >\n\n                          <img width="220"  src="assets/cleofundo.png" >   \n\n                      </ion-item>\n\n                      <ion-card-title  id="novoMatchAviso">\n\n                          Nenhum Match! \n\n                      </ion-card-title>\n\n                  </ion-col>\n\n              </div>\n\n          </div>\n\n        </ion-list>\n\n        <ion-list no-margin *ngSwitchCase="\'flerts\'">\n\n          <ion-item item-bcg *ngFor="let chat of meusFlerts " (click)="onChatCreate(chat)">\n\n            <ion-avatar item-left>\n\n              <img [src]="chat.photo || \'assets/images/no-photo.jpg\'">\n\n            </ion-avatar>\n\n            <h2 item-title>{{ chat.name }}&thinsp;{{ chat.sobrenome }}</h2>\n\n            <ion-icon icon-small item-right>\n\n              <i class="icon"></i>\n\n            </ion-icon>\n\n            <p *ngIf="chat.lastMessage; else customMessage">{{ chat.timestamp | date:\'dd/MM/y H:mm\' }} - {{ chat.lastMessage }}</p>\n\n            <ng-template #customMessage>\n\n              <p>Sem Mensagens</p>\n\n            </ng-template>\n\n          </ion-item>\n\n          <div *ngIf="meusFlerts.length < 1">\n\n              <div class="row"> \n\n                  <ion-col col-2></ion-col>\n\n                  <ion-col col-8>\n\n                      <ion-item >\n\n                          <img width="220"  src="assets/cleofundo.png" >   \n\n                      </ion-item>\n\n                      <ion-card-title  id="novoMatchAviso">\n\n                          Nenhum Match! \n\n                      </ion-card-title>\n\n                  </ion-col>\n\n              </div>\n\n          </div>\n\n        </ion-list>\n\n        <!--\n\n        <ion-list no-margin *ngSwitchCase="\'flerts\'">\n\n          <ion-item item-bcg *ngFor="let user of meusFlerts  " (click)="onChatCreate(user)">\n\n            <ion-avatar item-left>\n\n              <img [src]="user.photo || \'assets/images/no-photo.jpg\'">\n\n            </ion-avatar>\n\n            <h2 item-title>\n\n              {{ user.name }}\n\n            </h2>\n\n          </ion-item>\n\n        </ion-list>-->\n\n      </ion-col>\n\n    </ion-row>\n\n  </ion-grid>\n\n\n\n</ion-content>\n\n\n\n'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\chat_list\chat_list.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_7__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_6__providers_chat_chat__["a" /* ChatService */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["h" /* MenuController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_8__providers_user_user__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_11__providers_match_match__["a" /* MatchService */],
        __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_12_ionic_angular_components_alert_alert_controller__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_13__providers_chatsecret_chatsecret__["a" /* ChatSecretService */],
        __WEBPACK_IMPORTED_MODULE_14__providers_configuracao_configuracao__["a" /* ConfiguracaoService */],
        __WEBPACK_IMPORTED_MODULE_11__providers_match_match__["a" /* MatchService */]])
], ChatListPage);

//# sourceMappingURL=chat_list.js.map

/***/ }),

/***/ 127:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_chat_chat__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_message_model__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_message_message__ = __webpack_require__(377);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_firebase_app__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_firebase_app__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ChatPage = (function () {
    function ChatPage(authService, chatService, messageService, navCtrl, navParams, userService) {
        this.authService = authService;
        this.chatService = chatService;
        this.messageService = messageService;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
    }
    //VERIFICA SE ESTA LOGADO
    ChatPage.prototype.ionViewCanEnter = function () {
        return this.authService.authenticated;
    };
    ChatPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        //recebe parametros
        this.recipient = this.navParams.get('recipientUser');
        this.pageTitle = this.recipient.name;
        //pegar remetente
        this.userService.currentUser
            .first() //somente primeiro valor
            .subscribe(function (currentUser) {
            _this.sender = currentUser;
            _this.chat1 = _this.chatService.getDeepChat(_this.sender.$key, _this.recipient.$key); //pega soemnte um chat
            _this.chat2 = _this.chatService.getDeepChat(_this.recipient.$key, _this.sender.$key);
            if (_this.recipient.photo) {
                _this.chat1
                    .first()
                    .subscribe(function (chat) {
                    _this.chatService.updatePhoto(_this.chat1, chat.photo, _this.recipient.photo);
                });
            }
            var doSubscription = function () {
                _this.messages.subscribe(function (messages) {
                    _this.scrollToBottom();
                });
            };
            _this.messages = _this.messageService.getMessages(_this.sender.$key, _this.recipient.$key);
            _this.messages.first().subscribe(function (messages) {
                if (messages.length === 0) {
                    _this.messages = _this.messageService.getMessages(_this.recipient.$key, _this.sender.$key); //busca ao contrario
                    doSubscription();
                }
                else {
                    doSubscription();
                }
            });
        });
    };
    //RECEBE MENSAGEM DA VIEW 
    ChatPage.prototype.sendMessage = function (newMessage) {
        var _this = this;
        if (newMessage) {
            var currentTimestamp_1 = __WEBPACK_IMPORTED_MODULE_7_firebase_app__["database"].ServerValue.TIMESTAMP;
            this.messageService.create(new __WEBPACK_IMPORTED_MODULE_4__models_message_model__["a" /* Message */](this.sender.$key, newMessage, currentTimestamp_1), this.messages).then(function () {
                _this.chat1
                    .update({
                    lastMessage: newMessage,
                    timestamp: currentTimestamp_1
                });
                _this.chat2
                    .update({
                    lastMessage: newMessage,
                    timestamp: currentTimestamp_1
                });
            });
        }
    };
    //
    ChatPage.prototype.scrollToBottom = function (duration) {
        var _this = this;
        setTimeout(function () {
            if (_this.content._scroll) {
                _this.content.scrollToBottom(duration || 300);
            }
        }, 50);
    };
    return ChatPage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Content */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Content */])
], ChatPage.prototype, "content", void 0);
ChatPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-chat',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\chat\chat.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <custom-logged-header [title]="pageTitle" [user]="recipient"></custom-logged-header>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n\n  <message-box *ngFor="let m of messages | async" [message]="m" [isFromSender]="(m.userId === sender.$key)"></message-box>\n\n</ion-content>\n\n\n\n<ion-footer>\n\n  <ion-toolbar>\n\n    <ion-item no-lines>\n\n      <ion-input type="text" (keyup.enter)="sendMessage(newMessage); newMessage=\'\'" placeholder="Mensagem..." [(ngModel)]="newMessage"></ion-input>\n\n      <button ion-button item-end (click)="sendMessage(newMessage); newMessage=\'\'">\n\n        <ion-icon name="send"></ion-icon>\n\n      </button>\n\n    </ion-item>\n\n  </ion-toolbar>\n\n</ion-footer>\n\n'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\chat\chat.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_3__providers_chat_chat__["a" /* ChatService */],
        __WEBPACK_IMPORTED_MODULE_5__providers_message_message__["a" /* MessageService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_6__providers_user_user__["a" /* UserService */]])
], ChatPage);

//# sourceMappingURL=chat.js.map

/***/ }),

/***/ 128:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatSecretService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_base__ = __webpack_require__(58);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ChatSecretService = (function (_super) {
    __extends(ChatSecretService, _super);
    function ChatSecretService(afAuth, db, http) {
        var _this = _super.call(this) || this;
        _this.afAuth = afAuth;
        _this.db = db;
        _this.http = http;
        _this.setChatsecret();
        return _this;
    }
    //CRIAR LISTA DE CHATS DO USER LOGADO
    ChatSecretService.prototype.setChatsecret = function () {
        var _this = this;
        this.afAuth.authState
            .subscribe(function (authUser) {
            if (authUser) {
                _this.chatsecret = _this.db.list("/chatsecret/" + authUser.uid, {
                    query: {
                        orderByChild: 'timestamp'
                    }
                }).map(function (chats) {
                    return chats.reverse(); //rotorno ordem descrescente lista contatos
                }).catch(_this.handleObservableError);
            }
        });
    };
    //CRIA NOVOS CHATS ENTRE USUARIOS
    ChatSecretService.prototype.create = function (chatsecret, userId1, userId2) {
        return this.db.object("/chatsecret/" + userId1 + "/" + userId2)
            .set(chatsecret) //salva chat
            .catch(this.handlePromiseError);
    };
    //BUSCA UM CHATSECRET ESPECIFICO
    ChatSecretService.prototype.getDeepChatsecret = function (userId1, userId2) {
        return this.db.object("/chatsecret/" + userId1 + "/" + userId2)
            .catch(this.handleObservableError);
    };
    ChatSecretService.prototype.updatePhoto = function (chatsecret, chatsecretPhoto, recipientUserPhoto) {
        if (chatsecretPhoto != recipientUserPhoto) {
            return chatsecret.update({
                photo: recipientUserPhoto
            }).then(function () {
                return true;
            }).catch(this.handlePromiseError);
        }
        return Promise.resolve(false);
    };
    return ChatSecretService;
}(__WEBPACK_IMPORTED_MODULE_5__base_base__["a" /* BaseService */]));
ChatSecretService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__["a" /* AngularFireAuth */],
        __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
], ChatSecretService);

//# sourceMappingURL=chatsecret.js.map

/***/ }),

/***/ 129:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__ = __webpack_require__(22);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LoginPage = (function () {
    function LoginPage(navCtrl, userService, authService, af, loadingCtrl) {
        this.navCtrl = navCtrl;
        this.userService = userService;
        this.authService = authService;
        this.af = af;
        this.loadingCtrl = loadingCtrl;
        //imagens de fundo slide
        this.backgrounds = [
            'assets/images/background/slide01.jpg',
            'assets/images/background/slide02.jpg',
            'assets/images/background/slide03.jpg',
            'assets/images/background/slide04.jpg'
        ];
    }
    //LOGIN VIA FACEBOOK NAVEGADOR
    LoginPage.prototype.loginNav = function () {
        this.af.auth
            .signInWithPopup(new __WEBPACK_IMPORTED_MODULE_3_firebase_app__["auth"].FacebookAuthProvider())
            .then();
    };
    //LOGIN VIA FACEBOOK MOBILE
    LoginPage.prototype.loginFacebook = function () {
        var _this = this;
        this.authService.createAuthUser() //CRIA AUTENTICAÇÃO USER
            .then(function (authUser) {
            //console.log("AUTENTICADO: " + authState.uid);
            _this.userService.create() //GRAVA DADOS 
                .then(function (r) {
                console.log("DADOS GRAVADOS");
            })
                .catch(function (e) {
                console.log("PROBLEMA GRAVAR DADOS");
            });
        })
            .catch(function (error) {
            console.log("ERROO GRAVAR NO LOGIN.TS" + error);
        });
    };
    //MOSTRA MENSAGEM DE AGUARDE...
    LoginPage.prototype.showLoading = function () {
        var loading = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        //mostra carregamento pagina quando fizer o cadastro
        loading.present();
        //let loading: Loading = this.showLoading();//inicia
        // loading.dismiss();///fecha
        return loading;
    };
    return LoginPage;
}());
LoginPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-login',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\login\login.html"*/'<ion-header>\n\n  <ion-navbar>\n\n      <ion-title>\n\n          <img alt="Cleo aplicativo de relacionamento" height="40" src="assets/images/logo.png">\n\n      </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content class="login-content" padding>\n\n\n\n  <ion-row class="top-row">\n\n    <ion-col>\n\n      <h6 class="label-logo">Antes de entrar saiba que:</h6>\n\n      <p class="label-description">ao prosseguir, você concorda com todos os<a href="#"> termos de uso </a>e <a href="#">nossa politica de privacidade</a>.</p>\n\n  \n\n    </ion-col>\n\n  </ion-row>\n\n  <ion-row class="bottom-row">\n\n    <ion-col class="login-button">\n\n      <!--\n\n      <button ion-button block (click)="loginNav()"><ion-icon name="logo-facebook"></ion-icon> Login com Facebook</button>\n\n      -->\n\n      <button ion-button block (click)="loginFacebook()"><ion-icon name="logo-facebook"></ion-icon> Login com Facebook</button>\n\n      <button ion-button block (click)="loginNav()"><ion-icon name="logo-facebook"></ion-icon> Login Navegador</button>\n\n      \n\n    </ion-col>\n\n  </ion-row>\n\n  <p class="label-info">*CLEO nunca irá publicar nada em suas mídias sociais*</p>\n\n</ion-content>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\login\login.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_4__providers_user_user__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_2_angularfire2_auth__["a" /* AngularFireAuth */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */]])
], LoginPage);

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 131:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return User; });
var User = (function () {
    function User(name, sobrenome, email, photo, key) {
        this.name = name;
        this.sobrenome = sobrenome;
        this.email = email;
        this.photo = photo;
        this.key = key;
    }
    //FAZ CALCULO DA IDADE PARA ARMAZENAR NO BANCO ---> PROBLEMA REVISAR CALCULO <----
    User.prototype.calculoIdade = function (data_nasc) {
        var birthday = +new Date(data_nasc);
        return ~~((Date.now() - birthday) / (31557600000));
    };
    return User;
}());

//# sourceMappingURL=user.models.js.map

/***/ }),

/***/ 205:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Chat; });
var Chat = (function () {
    function Chat(lastMessage, timestamp, title, photo) {
        this.lastMessage = lastMessage;
        this.timestamp = timestamp;
        this.title = title;
        this.photo = photo;
    }
    return Chat;
}());

//# sourceMappingURL=chat.model.js.map

/***/ }),

/***/ 206:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Message; });
var Message = (function () {
    function Message(userId, text, timestamp) {
        this.userId = userId;
        this.text = text;
        this.timestamp = timestamp;
    }
    return Message;
}());

//# sourceMappingURL=message.model.js.map

/***/ }),

/***/ 207:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatSecretoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__providers_secretmessage_secretmessage__ = __webpack_require__(378);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_chatsecret_chatsecret__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_message_model__ = __webpack_require__(206);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_firebase_app__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_firebase_app__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var ChatSecretoPage = (function () {
    function ChatSecretoPage(authService, ChatsecretService, messagesecretService, navCtrl, navParams, userService) {
        this.authService = authService;
        this.ChatsecretService = ChatsecretService;
        this.messagesecretService = messagesecretService;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.userService = userService;
        this.timeInSeconds = 86400;
    }
    //VERIFICA SE ESTA LOGADO
    ChatSecretoPage.prototype.ionViewCanEnter = function () {
        return this.authService.authenticated;
    };
    ChatSecretoPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        this.recipient = this.navParams.get('recipientUser');
        //pegar remetente
        this.userService.currentUser
            .first() //somente primeiro valor
            .subscribe(function (currentUser) {
            _this.sender = currentUser;
            _this.pageTitle = _this.recipient.name;
            _this.chatsecret1 = _this.ChatsecretService.getDeepChatsecret(_this.sender.$key, _this.recipient.$key); //pega soemnte um chat
            _this.chatsecret2 = _this.ChatsecretService.getDeepChatsecret(_this.recipient.$key, _this.sender.$key);
            if (_this.recipient.photo) {
                _this.chatsecret1
                    .first()
                    .subscribe(function (Chatsecret) {
                    _this.ChatsecretService.updatePhoto(_this.chatsecret1, Chatsecret.photo, _this.recipient.photo);
                });
            }
            var doSubscription = function () {
                _this.secretmessages.subscribe(function (secretmessages) {
                    _this.scrollToBottom();
                });
            };
            _this.secretmessages = _this.messagesecretService
                .getMessagesecret(_this.sender.$key, _this.recipient.$key);
            _this.secretmessages
                .first()
                .subscribe(function (messages) {
                if (messages.length === 0) {
                    _this.secretmessages = _this.messagesecretService
                        .getMessagesecret(_this.recipient.$key, _this.sender.$key); //busca ao contrario
                    doSubscription();
                }
                else {
                    doSubscription();
                }
            });
        });
    };
    //RECEBE MENSAGEM DA VIEW 
    ChatSecretoPage.prototype.sendMessage = function (newMessage) {
        var _this = this;
        if (newMessage) {
            var currentTimestamp_1 = __WEBPACK_IMPORTED_MODULE_7_firebase_app__["database"].ServerValue.TIMESTAMP;
            this.messagesecretService.create(new __WEBPACK_IMPORTED_MODULE_4__models_message_model__["a" /* Message */](this.sender.$key, newMessage, currentTimestamp_1), this.secretmessages)
                .then(function () {
                _this.chatsecret1.update({ lastMessage: newMessage, timestamp: currentTimestamp_1 });
                _this.chatsecret2.update({ lastMessage: newMessage, timestamp: currentTimestamp_1 });
            });
        }
    };
    ChatSecretoPage.prototype.scrollToBottom = function (duration) {
        var _this = this;
        setTimeout(function () {
            if (_this.content._scroll) {
                _this.content.scrollToBottom(duration || 300);
            }
        }, 50);
    };
    /*DAQUIE PRA BAIXA E A IMPLEMENTAÇÂ ODE UM CRONOMETRO
    {{timer.displayTime}} para mortar na view
    */
    ChatSecretoPage.prototype.ngOnInit = function () {
        this.initTimer();
    };
    ChatSecretoPage.prototype.hasFinished = function () {
        return this.timer.hasFinished;
    };
    ChatSecretoPage.prototype.initTimer = function () {
        if (!this.timeInSeconds) {
            this.timeInSeconds = 0;
        }
        this.timer = {
            seconds: this.timeInSeconds,
            runTimer: false,
            hasStarted: false,
            hasFinished: false,
            secondsRemaining: this.timeInSeconds
        };
        this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    };
    ChatSecretoPage.prototype.startTimer = function () {
        this.timer.hasStarted = true;
        this.timer.runTimer = true;
        this.timerTick();
    };
    ChatSecretoPage.prototype.pauseTimer = function () {
        this.timer.runTimer = false;
    };
    ChatSecretoPage.prototype.timerTick = function () {
        var _this = this;
        setTimeout(function () {
            if (!_this.timer.runTimer) {
                return;
            }
            _this.timer.secondsRemaining--;
            _this.timer.displayTime = _this.getSecondsAsDigitalClock(_this.timer.secondsRemaining);
            if (_this.timer.secondsRemaining > 0) {
                _this.timerTick();
            }
            else {
                _this.timer.hasFinished = true;
            }
        }, 1000);
    };
    ChatSecretoPage.prototype.getSecondsAsDigitalClock = function (inputSeconds) {
        var secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
        var hours = Math.floor(secNum / 3600);
        var minutes = Math.floor((secNum - (hours * 3600)) / 60);
        var seconds = secNum - (hours * 3600) - (minutes * 60);
        var hoursString = '';
        var minutesString = '';
        var secondsString = '';
        hoursString = (hours < 10) ? '0' + hours : hours.toString();
        minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
        secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
        return hoursString + ':' + minutesString + ':' + secondsString;
    };
    return ChatSecretoPage;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["ViewChild"])(__WEBPACK_IMPORTED_MODULE_6_ionic_angular__["c" /* Content */]),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["c" /* Content */])
], ChatSecretoPage.prototype, "content", void 0);
ChatSecretoPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_5__angular_core__["Component"])({
        selector: 'page-chat-secreto',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\chat-secreto\chat-secreto.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <custom-secret-chat [title]="pageTitle" [user]="recipient"></custom-secret-chat>\n\n  </ion-navbar>\n\n\n\n</ion-header>\n\n<ion-content padding>\n\n  <message-box *ngFor="let m of secretmessages | async" [message]="m" [isFromSender]="(m.userId === sender.$key)"></message-box>\n\n</ion-content>\n\n\n\n<ion-footer>\n\n  <ion-toolbar>\n\n    <ion-item no-lines>\n\n      <ion-input type="text" (keyup.enter)="sendMessage(newMessage); newMessage=\'\'" placeholder="Mensagem..." [(ngModel)]="newMessage"></ion-input>\n\n      <button ion-button item-end (click)="sendMessage(newMessage); newMessage=\'\'">\n\n        <ion-icon name="send"></ion-icon>\n\n      </button>\n\n    </ion-item>\n\n  </ion-toolbar>\n\n</ion-footer>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\chat-secreto\chat-secreto.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_1__providers_chatsecret_chatsecret__["a" /* ChatSecretService */],
        __WEBPACK_IMPORTED_MODULE_0__providers_secretmessage_secretmessage__["a" /* SecretMessageService */],
        __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_6_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_2__providers_user_user__["a" /* UserService */]])
], ChatSecretoPage);

//# sourceMappingURL=chat-secreto.js.map

/***/ }),

/***/ 208:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModalPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular_navigation_view_controller__ = __webpack_require__(11);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var ModalPage = (function () {
    function ModalPage(viewCtrl, params) {
        this.viewCtrl = viewCtrl;
        this.myParam = params.get('myParam');
    }
    ModalPage.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    return ModalPage;
}());
ModalPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-modal',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\modal\modal.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>Informação</ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content padding>\n\n  <h1>Ativos ou Passivos</h1>\n\n  <br>\n\n  <p> Ser\n\n    <b> Homem Ativo</b> quer dizer que você pode escolher o seu par, ou seja:</p>\n\n  <ul>\n\n    <li>Homens Passivos</li>\n\n  </ul>\n\n  <p>Ser\n\n    <b>Homem Passivo</b> quer dizer que você será escolhido pelo seu interesse</p>\n\n  <ul>\n\n    <li>Homens Ativos</li>\n\n    <li>Mulheres Ativas </li>\n\n  </ul>\n\n  <br>\n\n  <p>Ser\n\n    <b>Mulher Ativa</b> quer dizer que você pode escolher o seu par, que são:</p>\n\n  <ul>\n\n    <li>Homens Passivos</li>\n\n    <li>Mulheres Passivas</li>\n\n  </ul>\n\n  <p>Ser\n\n    <b> Mulher Passiva</b> quer dizer que você será escolhida pelo seu interesse, que é:</p>\n\n  <ul>\n\n    <li>Mulheres Ativas</li>\n\n  </ul>\n\n  <p class="obs">\n\n    * Para os Homens Ativos, não existirá a opção de escolher mulheres, pois esse não é o objetivo do App.  \n\n  </p>\n\n\n\n</ion-content>\n\n<ion-footer>\n\n  <button ion-button full color="danger" (click)="dismiss()">Okay\n\n  </button>\n\n</ion-footer>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\modal\modal.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular_navigation_view_controller__["a" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */]])
], ModalPage);

//# sourceMappingURL=modal.js.map

/***/ }),

/***/ 209:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfigPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__login_login__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_configuracao_configuracao__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_social_sharing__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modal_modal__ = __webpack_require__(208);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






//compartilhamento 



var ConfigPage = (function () {
    function ConfigPage(navCtrl, navParams, db, authService, loadingCtrl, ConfigService, alertCtrl, userService, configService, 
        //convite
        sharingVar) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.db = db;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.ConfigService = ConfigService;
        this.alertCtrl = alertCtrl;
        this.userService = userService;
        this.configService = configService;
        this.sharingVar = sharingVar;
        this.rangeObject = { lower: 18, upper: 60 };
        this.loading = this.showLoading();
        this.buscaPreConfiguracoes();
    }
    //PAGINA DE DESCRIÇAO DAS CONFIGURAÇÔES
    ConfigPage.prototype.info = function (tipo) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_8__modal_modal__["a" /* ModalPage */]);
    };
    //VERIFICAÇÂO SE SER ESTA LOGADO
    ConfigPage.prototype.ionViewCanEnter = function () {
        return this.authService.authenticated;
    };
    ConfigPage.prototype.faixa = function (range) {
        console.log("ENTRO: " + range.lower);
        this.ConfigService.gravaFaixa(range);
    };
    ConfigPage.prototype.otherShare = function () {
        this.sharingVar.share("Parabéns, =D você acabou de ser convidado(a) para baixar ao aplicativo da CLEO", null /*Subject*/, null /*File*/, "cleoapp.com.br")
            .then(function () {
            //   alert("Success");
        }, function () {
            alert("Um Erro Ocorreu! Tente Mais tarde, se o problema persistir entre em contato com o suporte!");
        });
    };
    //fim convite
    //FAZER BUSCA DAS CONFIGURAÇÕES JÁ SALVAS NO BD
    ConfigPage.prototype.buscaPreConfiguracoes = function () {
        var _this = this;
        this.listConfig = this.ConfigService.buscaConfig();
        this.listConfig.first()
            .subscribe(function (config) {
            _this.toggleStatusH = config.masculino; //envia para view
            _this.toggleStatusM = config.feminino;
            _this.toggleStatusAtivo = config.ativo;
            _this.rangeObject.lower = config.faixaInicio;
            _this.rangeObject.upper = config.faixaFim;
            _this.toggleStatusHBuscado = config.masculinoSerBuscado;
            _this.toggleStatusMBuscado = config.femininoSerBuscado;
        });
        //BUSCA DO GENERO    
        this.userService.currentUser
            .first()
            .subscribe(function (currentUser) {
            _this.genero = currentUser.genero;
            if (_this.genero == "Masculino" || _this.genero == "Outros" && _this.toggleStatusAtivo == true) {
                _this.btnMulher = true;
                _this.toggleStatusM = false;
            }
        });
        this.loading.dismiss(); //tira o carregando...
    };
    //ENVIANDO A ESCOLHA TIPO HOMEM
    ConfigPage.prototype.Change_Toggle_Homens = function (bval) {
        var genero = "Mas";
        this.ConfigService.gravaInteresse(bval, genero);
    };
    //ENVIANDO A ESCOLHA TIPO MULHER
    ConfigPage.prototype.Change_Toggle_Mulheres = function (bval) {
        var genero = "Fem";
        this.ConfigService.gravaInteresse(bval, genero);
    };
    //ENVIANDO A ESCOLHA TIPO MULHER
    ConfigPage.prototype.Change_Toggle_Mulheres_Buscado = function (bval) {
        var genero = "Fem";
        this.ConfigService.gravaInteresseSerBuscado(bval, genero);
    };
    //ENVIANDO A ESCOLHA TIPO HOMEM
    ConfigPage.prototype.Change_Toggle_Homens_Buscado = function (bval) {
        var genero = "Mas";
        this.ConfigService.gravaInteresseSerBuscado(bval, genero);
    };
    //ENVIANDO A ESCOLHA TIPO ATIVO/PASSSIVO
    ConfigPage.prototype.Change_Toggle_AtivoPasssivo = function (atv) {
        console.log("->" + atv);
        if (this.genero == "Masculino" || this.genero == "Outros") {
            if (atv == true) {
                this.btnMulher = true; //desabilita botao mulher
                this.toggleStatusM = false; //desabilita toggle mulher
                this.configService.gravaAtivo(atv);
                var genero = "Fem";
                this.configService.gravaInteresse(false, genero);
            }
            else if (atv == false) {
                this.btnMulher = false; //abilita botao mulher
                this.configService.gravaAtivo(atv);
            }
        }
        else if ("Feminino") {
            if (atv == true) {
                this.btnMulher = false;
                this.configService.gravaAtivo(atv);
            }
            else if (atv == false) {
                this.btnMulher = false;
                this.configService.gravaAtivo(atv);
            }
        }
    };
    //MOSTRA MENSAGEM DE AGUARDE...
    ConfigPage.prototype.showLoading = function () {
        var loading = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        //mostra carregamento pagina
        loading.present();
        return loading;
    };
    //SAIR DO APP APAGANDO
    ConfigPage.prototype.logout = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Logout',
            message: 'Você deseja sair do Aplicativo?',
            buttons: [
                {
                    text: 'NÂO',
                },
                {
                    text: 'SIM',
                    handler: function () {
                        _this.authService.logout();
                        _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__login_login__["a" /* LoginPage */]);
                    }
                }
            ]
        });
        alert.present();
    };
    //DELETAR CONTA
    ConfigPage.prototype.deleteConta = function () {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Confirmação',
            message: 'Você deseja deletar essa conta?',
            buttons: [
                {
                    text: 'NÃO',
                },
                {
                    text: 'SIM',
                    handler: function () {
                        _this.authService.deletarConta(_this.authService.getUid());
                        _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__login_login__["a" /* LoginPage */]);
                    }
                }
            ]
        });
        alert.present();
    };
    ConfigPage.prototype.problema = function () {
        var prompt = this.alertCtrl.create({
            title: 'Enviar problema',
            message: "Informe o problema que você encontrou.",
            inputs: [
                {
                    name: 'descricao',
                    placeholder: 'Descrição'
                },
            ],
            buttons: [
                {
                    text: 'Cancel',
                    handler: function (data) {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Enviar',
                    handler: function (data) {
                        console.log('Saved clicked');
                    }
                }
            ]
        });
        prompt.present();
    };
    return ConfigPage;
}());
ConfigPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'page-config',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\config\config.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>Configurações</ion-title>\n\n        <ion-buttons end>\n\n            <button ion-button clear icon-end icon-only (click)="otherShare()">\n\n                <ion-icon name="md-person-add" full color="light"></ion-icon>\n\n            </button>\n\n        </ion-buttons>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content no-padding>\n\n\n\n    <ion-card full color="fundo">\n\n        <ion-card-header> Você deseja FLERTAR ou SER FLERTADO(A)?</ion-card-header>\n\n        <ion-card-content>\n\n            <ion-item ion-item no-lines item-title item-bcg submenu text-left color="fundo">\n\n                <ion-toggle [(ngModel)]="toggleStatusAtivo" (ionChange)="Change_Toggle_AtivoPasssivo(toggleStatusAtivo);" checked="false"></ion-toggle>\n\n                <ion-label>\n\n                    Ser Buscado/Buscar\n\n                    <a (click)="info(1)">\n\n                        <ion-icon name="md-information-circle"></ion-icon>\n\n                    </a>\n\n                </ion-label>\n\n            </ion-item>\n\n        </ion-card-content>\n\n    </ion-card>\n\n\n\n    <ion-card *ngIf="toggleStatusAtivo" color="fundo">\n\n        <ion-card-header>\n\n            <ion-label>\n\n                Quem você deseja buscar?\n\n                <a (click)="info(2)">\n\n                    <ion-icon name="md-information-circle"></ion-icon>\n\n                </a>\n\n            </ion-label>\n\n        </ion-card-header>\n\n        <ion-card-content>\n\n            <ion-item ion-item no-lines item-title item-bcg submenu text-left color="fundo">\n\n                <ion-toggle [(ngModel)]="toggleStatusH" (ionChange)="Change_Toggle_Homens(toggleStatusH);"></ion-toggle>\n\n                <ion-label>\n\n                    Homens\n\n                </ion-label>\n\n            </ion-item>\n\n            <ion-item *ngIf="!btnMulher" ion-item no-lines item-title item-bcg submenu text-left  color="fundo">\n\n                <ion-toggle [disabled]="btnMulher" [(ngModel)]="toggleStatusM" (ionChange)="Change_Toggle_Mulheres(toggleStatusM);"></ion-toggle>\n\n                <ion-label>\n\n                    Mulheres\n\n                </ion-label>\n\n            </ion-item>\n\n        </ion-card-content>\n\n    </ion-card>\n\n    <ion-card *ngIf="!toggleStatusAtivo" color="fundo">\n\n        <ion-card-header>\n\n            <ion-label>\n\n                Por quem você deseja ser buscado?\n\n                <a (click)="info(2)">\n\n                    <ion-icon name="md-information-circle"></ion-icon>\n\n                </a>\n\n            </ion-label>\n\n        </ion-card-header>\n\n        <ion-card-content>\n\n            <ion-item ion-item no-lines item-title item-bcg submenu text-left color="fundo">\n\n                <ion-toggle [(ngModel)]="toggleStatusHBuscado" (ionChange)="Change_Toggle_Homens_Buscado(toggleStatusHBuscado);"></ion-toggle>\n\n                <ion-label>\n\n                    Homens\n\n                </ion-label>\n\n            </ion-item>\n\n            <ion-item ion-item no-lines item-title item-bcg submenu text-left color="fundo">\n\n                <ion-toggle [(ngModel)]="toggleStatusMBuscado" (ionChange)="Change_Toggle_Mulheres_Buscado(toggleStatusMBuscado);"></ion-toggle>\n\n                <ion-label>\n\n                    Mulheres\n\n                </ion-label>\n\n            </ion-item>\n\n        </ion-card-content>\n\n    </ion-card>\n\n    <ion-card color="fundo">\n\n        <ion-card-header > Faixa Etária?\n\n        </ion-card-header>\n\n        <ion-card-content>\n\n            <ion-range dualKnobs="true" (ionChange)="faixa(rangeObject)" [(ngModel)]="rangeObject" color="#f9f5e3" min="18" max="60"\n\n                debounce="40" >\n\n                <ion-label range-left>18</ion-label>\n\n                <ion-label range-right>60</ion-label>\n\n            </ion-range>\n\n            <ion-label>\n\n                <ion-item ion-item no-padding item-title item-bcg submenu color="fundo" text-center>\n\n                    <ion-badge color="secondary">{{rangeObject.lower}}</ion-badge>\n\n                    <ion-badge color="secondary">{{rangeObject.upper}}</ion-badge>\n\n                </ion-item>\n\n            </ion-label>\n\n        </ion-card-content>\n\n    </ion-card>\n\n    <ion-list>\n\n\n\n        <ion-item ion-item no-padding item-title item-bcg submenu text-center color="fundo">\n\n            <a item-title href="https://cleoapp.com.br/suporte.html">Ajuda e Suporte</a>\n\n        </ion-item>\n\n        <ion-item ion-item no-padding item-title item-bcg submenu text-center color="fundo">\n\n            <a item-title href="https://cleoapp.com.br/politicas-de-privacidade.html#">Políticas de Privacidade</a>\n\n        </ion-item>\n\n        <ion-item ion-item no-padding item-bcg submenu text-center color="fundo">\n\n            <a item-title href="https://cleoapp.com.br/termos-de-uso.html">Termos de Uso</a>\n\n        </ion-item>\n\n\n\n        <br>\n\n        <ion-item ion-item no-lines item-title item-bcg text-center color="fundo">\n\n            <button ion-button clear color="light" ion-button (click)="logout()">Sair\n\n                <ion-icon name="exit"></ion-icon>\n\n            </button>\n\n        </ion-item>\n\n        <ion-item ion-item no-lines item-title item-bcg text-center color="fundo">\n\n            <button ion-button color="danger" clear style="opacity: 0.50;" (click)="deleteConta()">Deletar Conta\n\n                <ion-icon name="trash"></ion-icon>\n\n            </button>\n\n        </ion-item>\n\n        <ion-item-divider color="fundo"></ion-item-divider>\n\n        <ion-item ion-item no-lines item-title item-bcg text-center color="fundo">\n\n            <button ion-button clear (click)="problema()">Informar problema\n\n                <ion-icon name="alert"></ion-icon>\n\n            </button>\n\n        </ion-item>\n\n\n\n    </ion-list>\n\n</ion-content>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\config\config.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_4__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["g" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_5__providers_configuracao_configuracao__["a" /* ConfiguracaoService */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_7__providers_user_user__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_5__providers_configuracao_configuracao__["a" /* ConfiguracaoService */],
        __WEBPACK_IMPORTED_MODULE_6__ionic_native_social_sharing__["a" /* SocialSharing */]])
], ConfigPage);

//# sourceMappingURL=config.js.map

/***/ }),

/***/ 22:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase_app__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_facebook__ = __webpack_require__(180);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__base_base__ = __webpack_require__(58);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var AuthService = (function (_super) {
    __extends(AuthService, _super);
    function AuthService(afAuth, http, facebook) {
        var _this = _super.call(this) || this;
        _this.afAuth = afAuth;
        _this.http = http;
        _this.facebook = facebook;
        return _this;
    }
    AuthService.prototype.setUid = function (uid) {
        this.uid = uid;
    };
    AuthService.prototype.getUid = function () {
        return this.uid;
    };
    //CRIA AUTENTICAÇÃO USUARIO
    AuthService.prototype.createAuthUser = function () {
        return this.facebook.login([
            'public_profile', 'email', 'user_birthday',
            'user_hometown', 'user_likes', 'user_location', 'user_photos', 'user_status'
        ]) //solicita permisão
            .then(function (sucesso) {
            var facebookCredential = __WEBPACK_IMPORTED_MODULE_4_firebase_app__["auth"].FacebookAuthProvider.credential(sucesso.authResponse.accessToken);
            __WEBPACK_IMPORTED_MODULE_4_firebase_app__["auth"]().signInWithCredential(facebookCredential); //grava autenticação
        })
            .catch(this.handlePromiseError);
    };
    Object.defineProperty(AuthService.prototype, "authenticated", {
        //VERIFICAÇÃO SE USUARIO ESTÁ AUTENTENTICADO
        get: function () {
            var _this = this;
            return new Promise(function (resolve, reject) {
                _this.afAuth
                    .authState
                    .first()
                    .subscribe(function (authUser) {
                    (authUser) ? resolve(true) : reject(false);
                });
            });
        },
        enumerable: true,
        configurable: true
    });
    //SAIR DO APP
    AuthService.prototype.logout = function () {
        return this.afAuth.auth.signOut();
    };
    AuthService.prototype.deletarConta = function (id) {
        var db = __WEBPACK_IMPORTED_MODULE_4_firebase_app__["database"]();
        this.logout();
        db.ref("users/" + id).remove();
        db.ref("config/" + id).remove();
        db.ref("voto/" + id).remove();
        db.ref("view/" + id).remove();
        db.ref("like/" + id).remove();
        db.ref("chats/" + id).remove();
        db.ref("chatsecret/" + id).remove();
        //nao ta removendo pq é ID_MEU-ID_OUTRO
        db.ref("messages/" + id + "-").remove();
        db.ref("messagesecret/" + id + "-").remove();
    };
    return AuthService;
}(__WEBPACK_IMPORTED_MODULE_6__base_base__["a" /* BaseService */]));
AuthService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__["a" /* AngularFireAuth */],
        __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_5__ionic_native_facebook__["a" /* Facebook */]])
], AuthService);

//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 221:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 221;

/***/ }),

/***/ 26:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UserService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_facebook__ = __webpack_require__(180);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_firebase_app__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_firebase_storage__ = __webpack_require__(370);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_firebase_storage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_firebase_storage__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_angularfire2_auth__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__base_base__ = __webpack_require__(58);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var UserService = (function (_super) {
    __extends(UserService, _super);
    function UserService(http, facebook, db, afAuth, firebaseApp, authService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.facebook = facebook;
        _this.db = db;
        _this.afAuth = afAuth;
        _this.firebaseApp = firebaseApp;
        _this.authService = authService;
        _this.usV = [];
        //lista de usuarios 
        _this.listenAuthState();
        return _this;
    }
    //BUSCAR UM UNICO USER
    UserService.prototype.getUser = function (key) {
        return this.db.object("/users/" + key);
    };
    //BUSCAR TODOS OS USERS excuindo meu id
    UserService.prototype.getUsersAll = function (uidToExclude) {
        return this.db.list("/users")
            .map(function (users) {
            return users.filter(function (user) { return user.$key !== uidToExclude; });
        });
    };
    //FILTRO POR GENERO IDADE e REMOVENDO MEu ID
    UserService.prototype.filtro = function (config) {
        var _this = this;
        this.users = this.db.list("/users", {
            query: {
                orderByChild: 'idade',
                startAt: config.faixaInicio,
                endAt: config.faixaFim
            }
        }).map(function (users) {
            return users.filter(function (user) { return user.$key !== _this.uid; });
        }).catch(this.handleObservableError);
        if (config.masculino === true && config.feminino === true) {
            console.log("Masculino = true && FEminino true");
            return this.users
                .catch(this.handleObservableError);
        }
        else if (config.masculino) {
            console.log("Masculino = true");
            return this.users
                .map(function (users) {
                return users.filter(function (user) { return user.genero !== "Feminino"; });
            })
                .catch(this.handleObservableError);
        }
        else if (config.feminino) {
            console.log("feminino TRUE");
            return this.users
                .map(function (users) {
                return users.filter(function (user) { return user.genero !== "Masculino"; });
            })
                .catch(this.handleObservableError);
        }
        else {
            console.log("ELSE");
            return this.users
                .map(function (users) {
                return users.filter(function (user) { return user.genero !== "Feminino" && user.genero !== "Masculino"; });
            })
                .catch(this.handleObservableError);
        }
    };
    //LISTAR USUARIO LOGADO
    UserService.prototype.listenAuthState = function () {
        var _this = this;
        this.afAuth
            .authState
            .subscribe(function (authUser) {
            if (authUser) {
                _this.uid = authUser.uid;
                _this.currentUser = _this.db.object("/users/" + authUser.uid); //busa um user
                //this.setUsers(authUser.uid);//exlcuir user que esta logado passadno id
            }
        });
    };
    //CRIA NOVO USUARIO GRAVANDO NO BANCO
    UserService.prototype.create = function () {
        var _this = this;
        return this.facebook.getLoginStatus() //verifica status do user
            .then(function (response) {
            if (response.status == 'connected') {
                //FAZ A BUSCA DOS DADOS QUE APP PRECISA
                _this.facebook.api('/' + response.authResponse.userID +
                    '?fields=first_name,last_name,email,gender,location,birthday,picture.width(999).height(999), likes', [
                    'public_profile'
                ])
                    .then(function (response) {
                    ///////////////////// PEGAR DADOS ////////////////////////
                    //DADOS ->ID; NOME; EMAIL; GENERO; SOBRE; CIDADE; DATA NASCIMENTO; FOTO;
                    var lerJson = JSON.parse(JSON.stringify(response));
                    var _email = lerJson.email;
                    _this.userExists(_email)
                        .first()
                        .subscribe(function (userExists) {
                        if (!userExists) {
                            console.log("USUARIO NAO EXISTE");
                            //DADOS
                            //const _idUser = lerJson.id;
                            var _nome_1 = lerJson.first_name;
                            var _last_nome_1 = lerJson.last_name;
                            var _dataNasc_1 = lerJson.birthday;
                            var _sobre_1 = lerJson.about;
                            var _local_1 = lerJson.location.name;
                            var _foto_1 = lerJson.picture.data.url;
                            var _genero_1 = _this.traduzSexo(lerJson.gender);
                            var _idade_1 = _this.calculoIdade(_dataNasc_1);
                            _this.afAuth
                                .authState
                                .subscribe(function (authUser) {
                                if (authUser) {
                                    var database = __WEBPACK_IMPORTED_MODULE_7_firebase_app__["database"]();
                                    //GRAVA DADOS FIREBASE COM ID DA AUTENTICAÇÂO
                                    database.ref('users/' + authUser.uid)
                                        .set({
                                        key: authUser.uid,
                                        name: _nome_1,
                                        sobrenome: _last_nome_1,
                                        email: _email,
                                        genero: _genero_1,
                                        sobre: (_sobre_1 || ""),
                                        idade: _idade_1,
                                        local: _local_1,
                                        dataNasc: _dataNasc_1,
                                        photo: _foto_1
                                    });
                                    //GRAVA DADOS FIREBASE COM ID DA AUTENTICAÇÂO
                                    database.ref('config/' + authUser.uid)
                                        .set({
                                        faixaInicio: 18,
                                        faixaFim: 60,
                                        masculino: false,
                                        feminino: false,
                                        intro: true,
                                        ativo: false,
                                        masculinoSerBuscado: false,
                                        femininoSerBuscado: false,
                                    });
                                }
                            });
                        }
                        else {
                            console.log("USUARIO JA EXISTE");
                        }
                    });
                })
                    .catch(function (error) {
                    console.log("ERRO SEM CONEXAO" + error);
                });
            }
            else {
                console.log('ERRO: USER NAO ESTA CONECTADO');
            }
        })
            .catch(function (error) {
            console.log("ERRO STATUS USER:");
        });
    };
    //VERIFICAÇÃO SE O USUARIO JÁ EXISTE
    UserService.prototype.userExists = function (email) {
        //console.log("email" + email);
        return this.db.list("/users", {
            //filtros query list angular2
            query: {
                orderByChild: 'email',
                equalTo: email //recebe var para comparar
            }
            //array de usuarios se for maior que 0 ai ja existe senao esta ok para cadastrar
        }).map(function (users) {
            return users.length > 0;
        }).catch(this.handleObservableError);
    };
    //FAZ TRADUÇÃO DO SEXO PARA ARMAZENAR NO BANCO
    UserService.prototype.traduzSexo = function (sex) {
        if (sex == "male") {
            sex = "Masculino";
        }
        else if (sex == "female") {
            sex = "Feminino";
        }
        else {
            sex = "Outros";
        }
        return sex;
    };
    //FAZ CALCULO DA IDADE PARA ARMAZENAR NO BANCO ---> PROBLEMA REVISAR CALCULO <----
    UserService.prototype.calculoIdade = function (data_nasc) {
        var birthday = +new Date(data_nasc);
        return ~~((Date.now() - birthday) / (31557600000));
    };
    //BUSCA DE UM UNICO USUARIO COM ID NO BANCO
    UserService.prototype.get = function (userId) {
        return this.db.object("/users/" + userId)
            .catch(this.handleObservableError);
    };
    //EDITAR PERFIL "SOBRE"
    UserService.prototype.edit = function (user) {
        return this.currentUser
            .update(user)
            .catch(this.handlePromiseError);
    };
    //EDITAR FOTO PERFIL
    UserService.prototype.editPhoto = function (user) {
        return this.currentUser
            .update(user)
            .catch(this.handlePromiseError);
    };
    //UPLOAD DE FOTOS
    UserService.prototype.uploadPhoto = function (file, userId) {
        console.log("Entrou em UPLOAD DE FOTOS");
        return this.firebaseApp
            .storage()
            .ref()
            .child("/users/" + userId)
            .put(file);
    };
    return UserService;
}(__WEBPACK_IMPORTED_MODULE_10__base_base__["a" /* BaseService */]));
UserService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_4__ionic_native_facebook__["a" /* Facebook */],
        __WEBPACK_IMPORTED_MODULE_6_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_9_angularfire2_auth__["a" /* AngularFireAuth */],
        __WEBPACK_IMPORTED_MODULE_1_angularfire2__["b" /* FirebaseApp */],
        __WEBPACK_IMPORTED_MODULE_0__auth_auth__["a" /* AuthService */]])
], UserService);

//# sourceMappingURL=user.js.map

/***/ }),

/***/ 262:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 262;

/***/ }),

/***/ 347:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return IntroPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__home_home__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_configuracao_configuracao__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modal_modal__ = __webpack_require__(208);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var IntroPage = (function () {
    function IntroPage(navCtrl, userService, configService, modalCtrl) {
        this.navCtrl = navCtrl;
        this.userService = userService;
        this.configService = configService;
        this.modalCtrl = modalCtrl;
        this.btnMulher = false;
        this.getGenero();
    }
    IntroPage.prototype.getGenero = function () {
        var _this = this;
        this.userService.currentUser
            .first()
            .subscribe(function (currentUser) {
            _this.genero = currentUser.genero;
        });
    };
    IntroPage.prototype.info = function (tipo) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__modal_modal__["a" /* ModalPage */]);
        //this.modalCtrl.create('ModalPage').present();
    };
    //DESABILITAR PAGINA DE INTRO
    IntroPage.prototype.irHome = function () {
        console.log("IR HOMEE");
        this.configService.alterarIntroConfig();
        this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__home_home__["a" /* HomePage */]);
    };
    //ENVIANDO A ESCOLHA TIPO HOMEM
    IntroPage.prototype.Change_Toggle_Homens = function (bval) {
        var genero = "Mas";
        this.configService.gravaInteresse(bval, genero);
    };
    //ENVIANDO A ESCOLHA TIPO MULHER
    IntroPage.prototype.Change_Toggle_Mulheres = function (bval) {
        var genero = "Fem";
        this.configService.gravaInteresse(bval, genero);
    };
    //ENVIANDO A ESCOLHA TIPO MULHER
    IntroPage.prototype.Change_Toggle_Mulheres_Buscado = function (bval) {
        var genero = "Fem";
        this.configService.gravaInteresseSerBuscado(bval, genero);
    };
    //ENVIANDO A ESCOLHA TIPO HOMEM
    IntroPage.prototype.Change_Toggle_Homens_Buscado = function (bval) {
        var genero = "Mas";
        this.configService.gravaInteresseSerBuscado(bval, genero);
    };
    //ENVIANDO A ESCOLHA TIPO ATIVO/PASSSIVO
    IntroPage.prototype.Change_Toggle_AtivoPasssivo = function (atv) {
        if (this.genero == "Masculino" || this.genero == "Outros") {
            if (atv == true) {
                this.btnMulher = true; //desabilita botao mulher
                this.toggleStatusM = false; //desabilita toggle mulher
                this.configService.gravaAtivo(atv);
                var genero = "Fem";
                this.configService.gravaInteresse(false, genero);
            }
            else if (atv == false) {
                this.btnMulher = false;
                this.configService.gravaAtivo(atv);
            }
        }
        else if ("Feminino") {
            if (atv == true) {
                this.btnMulher = false;
                this.configService.gravaAtivo(atv);
            }
            else if (atv == false) {
                this.btnMulher = false;
                this.configService.gravaAtivo(atv);
            }
        }
    };
    return IntroPage;
}());
IntroPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Component"])({
        selector: 'page-intro',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\intro\intro.html"*/'<ion-content class="tutorial-page">\n\n  <ion-slides pager>\n\n    <ion-slide>\n\n      <ion-toolbar>\n\n        <ion-title text-center>\n\n          <img src="../assets/images/logo/login.png">\n\n        </ion-title>\n\n      </ion-toolbar>\n\n      <img [src]="" class="slide-image" />\n\n      <h2 class="slide-title">Prazer, CLEO</h2>\n\n      <br>\n\n      <p class="slide-text">\n\n        Pensando nas alarmantes desigualdades de gênero encontramos em nossa sociedade, esta rede se preocupa exclusivamente em oferecer\n\n        uma experiencia segura e confortável para as mulheres.\n\n      </p>\n\n    </ion-slide>\n\n\n\n    <ion-slide>\n\n      <ion-toolbar>\n\n        <ion-title text-center>\n\n          <img src="../assets/images/logo/login.png">\n\n        </ion-title>\n\n      </ion-toolbar>\n\n      <img [src]="" class="slide-image" />\n\n      <h2 class="slide-title">Prazer, CLEO</h2>\n\n      <br>\n\n      <p class="slide-text">\n\n        As mulheres decidem\n\n        <b>quando</b> e\n\n        <b>para quem</b> se revelar. A iniciativa no app pode ser ativa ou passiva. Dessa forma, você escolhe\n\n        <b>conhecer</b> pessoas ou\n\n        <b>ser conhecida</b>. As interações aqui\n\n        <b>não permitem</b>\n\n        que homens visualizem fotos ou outras informações, a não ser que a\n\n        <b>mulher libere</b> estas opções.\n\n      </p>\n\n    </ion-slide>\n\n\n\n    <ion-slide>\n\n      <ion-toolbar>\n\n        <ion-title text-center>\n\n          <img src="../assets/images/logo/login.png">\n\n        </ion-title>\n\n      </ion-toolbar>\n\n      <img [src]="" class="slide-image" />\n\n      <h2 class="slide-title">Prazer, CLEO</h2>\n\n      <br>\n\n      <p class="slide-text">Nosso objetivo é garantir uma experiência única às mulheres que têm atitude e poder sobre suas decisões.\n\n        <b> Aos homens:</b> que tal experimentar a sensação de destaque a partir do desejo feminino?</p>\n\n    </ion-slide>\n\n\n\n    <ion-slide>\n\n      <ion-card>\n\n        <ion-card-header>FLERTAR ou SER FLERTADO(A)?</ion-card-header>\n\n        <ion-card-content>\n\n          <ion-item ion-item no-lines item-title item-bcg submenu text-left>\n\n            <ion-toggle [(ngModel)]="toggleStatusAtivo" (ionChange)="Change_Toggle_AtivoPasssivo(toggleStatusAtivo);" checked="false"></ion-toggle>\n\n            <ion-label>\n\n              Ser Buscado/Buscar\n\n              <a (click)="info(1)">\n\n                <ion-icon name="md-information-circle"></ion-icon>\n\n              </a>\n\n            </ion-label>\n\n          </ion-item>\n\n        </ion-card-content>\n\n      </ion-card>\n\n\n\n      <ion-card *ngIf="toggleStatusAtivo">\n\n        <ion-card-header>\n\n          <ion-label>\n\n            Quem você deseja buscar?\n\n            <a (click)="info(2)">\n\n              <ion-icon name="md-information-circle"></ion-icon>\n\n            </a>\n\n          </ion-label>\n\n        </ion-card-header>\n\n        <ion-card-content>\n\n          <ion-item ion-item no-lines item-title item-bcg submenu text-left>\n\n            <ion-toggle [(ngModel)]="toggleStatusH" (ionChange)="Change_Toggle_Homens(toggleStatusH);"></ion-toggle>\n\n            <ion-label>\n\n              Homens\n\n            </ion-label>\n\n          </ion-item>\n\n          <ion-item *ngIf="!btnMulher" ion-item no-lines item-title item-bcg submenu text-left>\n\n            <ion-toggle [disabled]="btnMulher" [(ngModel)]="toggleStatusM" (ionChange)="Change_Toggle_Mulheres(toggleStatusM);"></ion-toggle>\n\n            <ion-label>\n\n              Mulheres\n\n            </ion-label>\n\n          </ion-item>\n\n        </ion-card-content>\n\n      </ion-card>\n\n      <ion-card *ngIf="!toggleStatusAtivo">\n\n        <ion-card-header>\n\n          <ion-label>\n\n            Por quem você deseja ser buscado?\n\n            <a (click)="info(2)">\n\n              <ion-icon name="md-information-circle"></ion-icon>\n\n            </a>\n\n          </ion-label>\n\n        </ion-card-header>\n\n        <ion-card-content>\n\n          <ion-item ion-item no-lines item-title item-bcg submenu text-left>\n\n            <ion-toggle [(ngModel)]="toggleStatusHBuscado" (ionChange)="Change_Toggle_Homens_Buscado(toggleStatusHBuscado);"></ion-toggle>\n\n            <ion-label>\n\n              Homens\n\n            </ion-label>\n\n          </ion-item>\n\n          <ion-item ion-item no-lines item-title item-bcg submenu text-left>\n\n            <ion-toggle [(ngModel)]="toggleStatusMBuscado" (ionChange)="Change_Toggle_Mulheres_Buscado(toggleStatusMBuscado);"></ion-toggle>\n\n            <ion-label>\n\n              Mulheres\n\n            </ion-label>\n\n          </ion-item>\n\n        </ion-card-content>\n\n      </ion-card>\n\n\n\n      <button ion-button large outline icon-end color="primary" (click)="irHome()">\n\n        Começar\n\n        <ion-icon name="arrow-forward"></ion-icon>\n\n      </button>\n\n    </ion-slide>\n\n  </ion-slides>\n\n</ion-content>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\intro\intro.html"*/,
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1__providers_user_user__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_3__providers_configuracao_configuracao__["a" /* ConfiguracaoService */],
        __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["i" /* ModalController */]])
], IntroPage);

//# sourceMappingURL=intro.js.map

/***/ }),

/***/ 348:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Flert; });
var Flert = (function () {
    //public $key: string;
    function Flert(key, timestamp, name, photo, idade) {
        this.key = key;
        this.timestamp = timestamp;
        this.name = name;
        this.photo = photo;
        this.idade = idade;
    }
    return Flert;
}());

//# sourceMappingURL=flert.model.js.map

/***/ }),

/***/ 377:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MessageService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_base__ = __webpack_require__(58);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MessageService = (function (_super) {
    __extends(MessageService, _super);
    function MessageService(db, http) {
        var _this = _super.call(this) || this;
        _this.db = db;
        _this.http = http;
        return _this;
    }
    MessageService.prototype.create = function (message, listMessages) {
        return listMessages.push(message) //add nova msm na lista
            .catch(this.handlePromiseError);
    };
    //BUSCA DAS MENSAGENS ENTRE USERS
    MessageService.prototype.getMessages = function (userId1, userId2) {
        return this.db.list("/messages/" + userId1 + "-" + userId2, {
            query: {
                orderByChild: 'timestamp',
                limitToLast: 30
            }
        }).catch(this.handleObservableError);
    };
    return MessageService;
}(__WEBPACK_IMPORTED_MODULE_4__base_base__["a" /* BaseService */]));
MessageService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
], MessageService);

//# sourceMappingURL=message.js.map

/***/ }),

/***/ 378:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SecretMessageService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__base_base__ = __webpack_require__(58);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var SecretMessageService = (function (_super) {
    __extends(SecretMessageService, _super);
    function SecretMessageService(db, http) {
        var _this = _super.call(this) || this;
        _this.db = db;
        _this.http = http;
        return _this;
    }
    SecretMessageService.prototype.create = function (secretmessage, listsecretMessages) {
        return listsecretMessages.push(secretmessage) //add nova msm na lista
            .catch(this.handlePromiseError);
    };
    //BUSCA DAS MENSAGENS ENTRE USERS
    SecretMessageService.prototype.getMessagesecret = function (userId1, userId2) {
        return this.db.list("/messagesecret/" + userId1 + "-" + userId2, {
            query: {
                orderByChild: 'timestamp',
                limitToLast: 30
            }
        }).catch(this.handleObservableError);
    };
    return SecretMessageService;
}(__WEBPACK_IMPORTED_MODULE_4__base_base__["a" /* BaseService */]));
SecretMessageService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
], SecretMessageService);

//# sourceMappingURL=secretmessage.js.map

/***/ }),

/***/ 379:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlertPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ng_lottie__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__config_config__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__models_chat_model__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_match_match__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_chat_chat__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__chat_list_chat_list__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__chat_chat__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_firebase_app__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_ionic_angular_components_toast_toast_controller__ = __webpack_require__(106);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};














var FlertPage = (function () {
    function FlertPage(navCtrl, authService, matchservice, alertCtrl, userService, chatService, db, toastCtrl) {
        this.navCtrl = navCtrl;
        this.authService = authService;
        this.matchservice = matchservice;
        this.alertCtrl = alertCtrl;
        this.userService = userService;
        this.chatService = chatService;
        this.db = db;
        this.toastCtrl = toastCtrl;
        this.userList = [];
        this.userList = this.matchservice.meusFlerts(this.authService.getUid());
        __WEBPACK_IMPORTED_MODULE_0_ng_lottie__["a" /* LottieAnimationViewModule */].forRoot();
        this.lottieConfig = {
            path: 'assets/not_found.json',
            autoplay: true,
            loop: true
        };
    }
    FlertPage.prototype.ionViewDidEnter = function () {
        //this.userList = this.matchservice.buscaMeusFlert();//antigo
        this.userList = this.matchservice.meusFlerts(this.authService.getUid());
    };
    //VERIFICAR SE TA LOGADO
    FlertPage.prototype.ionViewCanEnter = function () {
        return this.authService.authenticated;
    };
    //DEFAZER FLEART DEL OBSERBLE
    FlertPage.prototype.desfazerFleat = function (index, user) {
        var _this = this;
        var alert = this.alertCtrl.create({
            title: 'Confirmação',
            message: 'Você deseja desfazer o flert?',
            buttons: [
                {
                    text: 'NÃO',
                },
                {
                    text: 'SIM',
                    handler: function () {
                        _this.matchservice.remover(user.key, _this.authService.getUid());
                        _this.userList.splice(index, 1);
                        _this.userList = _this.matchservice.meusFlerts(_this.authService.getUid());
                        _this.toastCtrl.create({ message: 'Flert desfeito </3', duration: 1000, position: 'top' }).present();
                    }
                }
            ]
        });
        alert.present();
    };
    //CRIAÇAÕ DO CHAT ENTRE USUARIOS 
    FlertPage.prototype.openChat = function (recipientUser) {
        var _this = this;
        this.userService.currentUser //PEGA USUARIO LOGADO
            .first()
            .subscribe(function (currentUser) {
            _this.chatService.getDeepChat(currentUser.$key, recipientUser.$key) // caminho /users/id1/id2
                .first()
                .subscribe(function (chat) {
                //o objeto chat tem um propriedade(chat)valida?
                if (chat.hasOwnProperty('$value')) {
                    var timestamp = __WEBPACK_IMPORTED_MODULE_12_firebase_app__["database"].ServerValue.TIMESTAMP; //pega time temp do firebase
                    var chat1 = new __WEBPACK_IMPORTED_MODULE_5__models_chat_model__["a" /* Chat */]('', timestamp, recipientUser.name, (recipientUser.photo || ''));
                    _this.chatService.create(chat1, currentUser.$key, recipientUser.$key);
                    var chat2 = new __WEBPACK_IMPORTED_MODULE_5__models_chat_model__["a" /* Chat */]('', timestamp, currentUser.name, (currentUser.photo || ''));
                    _this.chatService.create(chat2, recipientUser.$key, currentUser.$key);
                }
            });
        });
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__chat_chat__["a" /* ChatPage */], {
            recipientUser: recipientUser
        });
    };
    //IR PAGINA CONFIGURAÇÕES
    FlertPage.prototype.onConfig = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_1__config_config__["a" /* ConfigPage */]);
    };
    //IR PAGINA DO CHAT
    FlertPage.prototype.chat = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__chat_list_chat_list__["a" /* ChatListPage */]);
    };
    //PERMITIR A VISUALIZAÇÃO DO PERFIL
    FlertPage.prototype.abrirPerfil = function (user) {
        var _this = this;
        this.alertCtrl.create({
            title: 'Confirmação',
            message: 'Você deseja abrir seu perfil para ' + user.name,
            buttons: [
                {
                    text: 'NÃO',
                    handler: function () {
                        _this.matchservice.viewPerfil(user, _this.authService.getUid(), false);
                    }
                },
                {
                    text: 'SIM',
                    handler: function () {
                        _this.matchservice.viewPerfil(user, _this.authService.getUid(), true);
                    }
                },
                {
                    text: 'CANCELAR',
                }
            ]
        }).present();
        this.userList = [];
        this.userList = this.matchservice.meusFlerts(this.authService.getUid());
    };
    return FlertPage;
}());
FlertPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_3__angular_core__["Component"])({
        selector: 'page-flert',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\flert\flert.html"*/'<!--Fist Screen-->\n\n<!--\n\n<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>\n\n            <img alt="Cleo aplicativo de relacionamento" height="40" src="assets/images/logo.png">\n\n        </ion-title>\n\n    </ion-navbar>\n\n  </ion-header>\n\n<ion-content>\n\n\n\n    <div background-size class="default-background">\n\n        <ion-list *ngFor="let card of userList ; let i = index; " no-lines>\n\n            <ion-item-sliding #item>\n\n                <ion-item>\n\n                    <ion-avatar item-left>\n\n                        <img *ngIf="card.photo" [src]="card.photo">\n\n                    </ion-avatar>\n\n                    <h2>{{ card.name }} {{ card.sobrenome }} &middot; {{ card.idade }}</h2>\n\n                </ion-item>\n\n                <ion-item-options>\n\n                    <button color="danger" large clear ion-button (click)="desfazerFleat(i, card)">\n\n                        <ion-icon name="trash"></ion-icon>\n\n                    </button>\n\n                    <button color="favorite" large clear ion-button (click)="abrirPerfil(card)">\n\n                        <ion-icon name="eye"></ion-icon>\n\n                    </button>\n\n                    <button color="roxo"  large clear item-end ion-button (click)="openChat(card)">\n\n                        <ion-icon name="ios-chatbubbles"></ion-icon>\n\n                    </button>\n\n                </ion-item-options>\n\n            </ion-item-sliding>\n\n        </ion-list>\n\n    </div>\n\n\n\n\n\n\n\n</ion-content>\n\n-->\n\n<ion-header>\n\n    <ion-navbar>\n\n        <ion-buttons left>\n\n                <button ion-button icon-only  (click)="onConfig()" large color="light">\n\n                    <ion-icon name="settings"></ion-icon>\n\n                </button>\n\n        </ion-buttons>\n\n        <ion-title>\n\n            <img alt="Cleo aplicativo de relacionamento" height="40" src="assets/images/logo.png">\n\n        </ion-title>\n\n   \n\n        <ion-buttons right>\n\n            <button ion-button icon-only (click)="chat()" large color="light"><ion-icon name="ios-chatbubbles" ></ion-icon></button>\n\n        </ion-buttons>\n\n    </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content padding>\n\n    <ion-list *ngFor="let card of userList ; let i = index; " no-lines>\n\n        <ion-item-sliding #item>\n\n            <ion-item>\n\n                <ion-avatar item-start>\n\n                    <img *ngIf="card.photo" [src]="card.photo">\n\n                </ion-avatar>                      \n\n                <h2>{{ card.name }} {{ card.sobrenome }} &middot; {{ card.idade }}</h2>\n\n            </ion-item>      \n\n            <ion-item-options>\n\n                <button color="danger" large clear ion-button (click)="desfazerFleat(i, card)">\n\n                    <ion-icon name="trash"></ion-icon>\n\n                </button>\n\n                <button color="favorite" large clear ion-button (click)="abrirPerfil(card)">\n\n                    <ion-icon name="eye"></ion-icon>\n\n                </button>\n\n                <button color="roxo"  large clear item-end ion-button (click)="openChat(card)">\n\n                    <ion-icon name="ios-chatbubbles"></ion-icon>\n\n                </button>\n\n            </ion-item-options>    \n\n        </ion-item-sliding>\n\n    </ion-list>\n\n    <div *ngIf="userList.length < 1">\n\n        <div class="row"> \n\n            <ion-col col-1></ion-col>\n\n            <ion-col col-10>\n\n                <ion-item >\n\n                    <img width="300"  src="assets/cleofundo.png" >   \n\n                </ion-item>\n\n                <ion-card-title  id="novoMatchAviso">\n\n                    Nenhum Match! \n\n                </ion-card-title>\n\n            </ion-col>\n\n        </div>\n\n        <!-- Animação -->\n\n        <!--<lottie-animation-view [options]="lottieConfig" [width]="500" [height]="500"> \n\n\n\n        </lottie-animation-view> -->\n\n    </div>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\flert\flert.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_4_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_7__providers_match_match__["a" /* MatchService */],
        __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_6__providers_user_user__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_8__providers_chat_chat__["a" /* ChatService */],
        __WEBPACK_IMPORTED_MODULE_2_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_13_ionic_angular_components_toast_toast_controller__["a" /* ToastController */]])
], FlertPage);

//# sourceMappingURL=flert.js.map

/***/ }),

/***/ 380:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PerfilPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__ = __webpack_require__(182);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__chat_list_chat_list__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__config_config__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_camera_camera__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_ionic_angular_components_action_sheet_action_sheet_controller__ = __webpack_require__(138);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_ionic_angular_platform_platform__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_image_picker__ = __webpack_require__(183);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var PerfilPage = (function () {
    function PerfilPage(alertCtrl, navCtrl, navParams, db, authService, loadingCtrl, userService, cameraProvider, actionsheetCtrl, platform, camera, imagePicker) {
        this.alertCtrl = alertCtrl;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.db = db;
        this.authService = authService;
        this.loadingCtrl = loadingCtrl;
        this.userService = userService;
        this.cameraProvider = cameraProvider;
        this.actionsheetCtrl = actionsheetCtrl;
        this.platform = platform;
        this.camera = camera;
        this.imagePicker = imagePicker;
        this.canEditSobre = false;
    }
    //VERIFICAÇÂO SE SER ESTA LOGADO
    PerfilPage.prototype.ionViewCanEnter = function () {
        var _this = this;
        this.loading = this.showLoading();
        this.userService.currentUser
            .subscribe(function (user) {
            _this.currentUser = user; //atribuir valores 
            _this.loading.dismiss(); //tira o carregando...
        });
        return this.authService.authenticated;
    };
    //MOSTRA MENSAGEM DE AGUARDE...
    PerfilPage.prototype.showLoading = function () {
        var loading = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        //mostra carregamento pagina
        loading.present();
        return loading;
    };
    //EDITAR DADOS FORM SOBRE E APELIDO
    PerfilPage.prototype.onSubmit = function (sobre) {
        var _this = this;
        this.userService.edit({
            sobre: this.currentUser.sobre,
        }).then(function () {
            _this.canEditSobre = false;
        });
    };
    //IR PAGINA CONFIGURAÇÕES
    PerfilPage.prototype.onConfig = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__config_config__["a" /* ConfigPage */]);
    };
    //IR PAGINA DO CHAT
    PerfilPage.prototype.chat = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__chat_list_chat_list__["a" /* ChatListPage */]);
    };
    //ESCOLHA DO TIPO DE BUSCA PARA FTO CAMERA OU GALERIA
    PerfilPage.prototype.changePicture = function () {
        var _this = this;
        var actionsheet = this.actionsheetCtrl.create({
            title: 'Enviar uma foto',
            buttons: [
                {
                    text: 'Câmera',
                    icon: !this.platform.is('ios') ? 'camera' : null,
                    handler: function () {
                        _this.capture();
                    }
                },
                {
                    text: !this.platform.is('ios') ? 'Galeria' : 'camera roll',
                    icon: !this.platform.is('ios') ? 'image' : null,
                    handler: function () {
                        _this.imagePicker.hasReadPermission()
                            .then(function (hasPermission) {
                            if (hasPermission) {
                                console.log("PEGAR IMAGEM!!");
                                _this.pegarImagem();
                            }
                            else {
                                _this.solicitarPermissao();
                            }
                        }).catch(function (error) {
                            console.error('Erro ao verificar permissão', error);
                        });
                    }
                },
                {
                    text: 'Cancelar',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    role: 'destructive',
                    handler: function () {
                        console.log('the user has cancelled the interaction.');
                    }
                }
            ]
        });
        return actionsheet.present();
    };
    //SOLICITA PERMISSAO DE ACESSO (NECESSARIO PARA ANDORID +6 E iOs +9)
    PerfilPage.prototype.solicitarPermissao = function () {
        var _this = this;
        this.imagePicker.requestReadPermission()
            .then(function (hasPermission) {
            if (hasPermission) {
                _this.pegarImagem();
            }
            else {
                console.error('Permissão negada');
            }
        }).catch(function (error) {
            console.error('Erro ao solicitar permissão', error);
        });
    };
    PerfilPage.prototype.pegarImagem = function () {
        var _this = this;
        console.log("ENTROU EM PEGAR IMAGEM FUNÇÃO!");
        this.imagePicker.getPictures({
            maximumImagesCount: 1,
            outputType: 1,
            width: 200,
            height: 200,
            quality: 100,
        })
            .then(function (foto) {
            console.log("PEGOU DADOS DA FOTO! " + foto.length);
            if (foto.length > 0) {
                console.log("PEGAR IMAGEM 22");
                _this.currentUser.photo = 'data:image/png;base64,' + foto[0];
                //this.fileToUpload = results[0];
                _this.cameraProvider
                    .uploadAndSave({
                    key: _this.currentUser.$key,
                    fileToUpload: foto[0]
                });
            }
        })
            .catch(function (error) {
            console.error('Erro ao recuperar a imagem', error);
        });
    };
    //ativa a camera
    PerfilPage.prototype.capture = function () {
        var _this = this;
        var cameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 600,
            targetHeight: 600
        };
        this.camera.getPicture(cameraOptions).then(function (imageData) {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            console.log("PEGOU FOTO DA CÂMERA!");
            _this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
            _this.currentUser.photo = 'data:image/jpeg;base64,' + imageData;
            _this.cameraProvider
                .uploadAndSave({
                key: _this.currentUser.$key,
                fileToUpload: imageData
            });
        }, function (err) {
            // Handle error
        });
    };
    return PerfilPage;
}());
PerfilPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'page-perfil',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\perfil\perfil.html"*/'<ion-header> \n\n  <ion-navbar>\n\n      <ion-buttons left>\n\n          <button ion-button icon-only (click)="changePicture()"  large color="light">\n\n            <ion-icon name="camera"></ion-icon>\n\n          </button>\n\n      </ion-buttons>   \n\n  <ion-title>\n\n      <img alt="Cleo aplicativo de relacionamento" height="40" src="assets/images/logo.png">\n\n  </ion-title>\n\n      <ion-buttons right>\n\n        <button ion-button icon-only (click)="onConfig()" large color="light"><ion-icon name="settings" ></ion-icon></button>\n\n      </ion-buttons>\n\n</ion-navbar>\n\n</ion-header>\n\n<!--perfil-->\n\n<ion-content *ngIf="currentUser">\n\n<div id="content">\n\n<div id="profile-info" padding>\n\n  <!--link perfil imagem-->\n\n  <img id="profile-image" [src]="currentUser.photo || \'assets/images/no-photo.png\'">\n\n  <h3 id="profile-name">{{currentUser.name}}&nbsp;{{currentUser.sobrenome}},&nbsp;{{currentUser.idade}}</h3>\n\n  \n\n  <ion-item color="fundo">\n\n    <p class="profile-description" *ngIf="!canEditSobre" name=\'md-create\' (click)="canEditSobre = !canEditSobre" item-start>{{currentUser.sobre}}</p>\n\n    <ion-icon *ngIf="!canEditSobre" name=\'md-create\' (click)="canEditSobre = !canEditSobre" item-start></ion-icon>\n\n    <!--<p class="descricao" *ngIf="!canEditSobre">{{currentUser.sobre}}</p>-->\n\n    <form (ngSubmit)="onSubmit(currentUser.sobre)" *ngIf="canEditSobre" #profileForm="ngForm">\n\n      <ion-item color="fundo">\n\n        <ion-textarea rows="4" name="sobre" [(ngModel)]="currentUser.sobre" required minlenght="1" autosize ></ion-textarea>\n\n      </ion-item>\n\n      <button full ion-button default-button type="submit" [disabled]="profileForm.form.invalid">\n\n        <ion-icon name="md-checkmark"></ion-icon>\n\n      </button>\n\n    </form>\n\n  </ion-item>\n\n  <p>{{currentUser.genero}}</p>\n\n  <p>{{currentUser.local}}</p>\n\n  \n\n</div>\n\n</div>\n\n\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\perfil\perfil.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_3_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_6__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_7__providers_user_user__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_8__providers_camera_camera__["a" /* CameraProvider */],
        __WEBPACK_IMPORTED_MODULE_9_ionic_angular_components_action_sheet_action_sheet_controller__["a" /* ActionSheetController */],
        __WEBPACK_IMPORTED_MODULE_10_ionic_angular_platform_platform__["a" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_11__ionic_native_image_picker__["a" /* ImagePicker */]])
], PerfilPage);

//# sourceMappingURL=perfil.js.map

/***/ }),

/***/ 381:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CameraProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__ = __webpack_require__(182);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_firebase_app_module__ = __webpack_require__(184);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase__ = __webpack_require__(771);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_firebase___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_firebase__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






//
var CameraProvider = (function () {
    function CameraProvider(camera, fb, userService
        //
    ) {
        //let path = '/users/' + this.angularFireAuth.auth.currentUser.uid;
        //this.items = db.list(path);
        this.camera = camera;
        this.fb = fb;
        this.userService = userService;
        this.user = this.userService.currentUser;
    }
    CameraProvider.prototype.getPictureFromCamera = function () {
        return this.getImage(this.camera.PictureSourceType.CAMERA, true);
    };
    // This method takes optional parameters to make it more customizable
    CameraProvider.prototype.getImage = function (pictureSourceType, crop, quality, allowEdit, saveToAlbum) {
        if (crop === void 0) { crop = false; }
        if (quality === void 0) { quality = 50; }
        if (allowEdit === void 0) { allowEdit = true; }
        if (saveToAlbum === void 0) { saveToAlbum = true; }
        var options = {
            quality: quality,
            allowEdit: allowEdit,
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: pictureSourceType,
            encodingType: this.camera.EncodingType.PNG,
            saveToPhotoAlbum: saveToAlbum
        };
        // If set to crop, restricts the image to a square of 600 by 600
        if (crop) {
            options['targetWidth'] = 200;
            options['targetHeight'] = 200;
        }
        return this.camera.getPicture(options).then(function (imageData) {
            var base64Image = 'data:image/png;base64,' + imageData;
            return base64Image;
        }, function (error) {
            console.log('CAMERA ERROR -> ' + JSON.stringify(error));
        });
    };
    //FAZ O UPLOADO DA FOTO
    CameraProvider.prototype.uploadAndSave = function (item) {
        var _this = this;
        var storageRef = this.fb.storage().ref(); //referencia a storage
        //let basePath = '/usersPhotos/' + this.angularFireAuth.auth.currentUser.uid;
        var fullPath = '/usersPhotos/' + item.key + '/' + item.key + '.png';
        var uploadTask = storageRef.child(fullPath).putString(item.fileToUpload, 'base64');
        uploadTask.on(__WEBPACK_IMPORTED_MODULE_5_firebase__["storage"].TaskEvent.STATE_CHANGED, function (snapshot) {
            //var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            //console.log(progress + "% done");
        }, function (error) {
            console.error(error);
        }, function () {
            var url = uploadTask.snapshot.downloadURL; //url da foto
            _this.user.update({
                photo: url
            });
        });
    };
    return CameraProvider;
}());
CameraProvider = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__ionic_native_camera__["a" /* Camera */],
        __WEBPACK_IMPORTED_MODULE_4_angularfire2_firebase_app_module__["a" /* FirebaseApp */],
        __WEBPACK_IMPORTED_MODULE_0__user_user__["a" /* UserService */]
        //
    ])
], CameraProvider);

//# sourceMappingURL=camera.js.map

/***/ }),

/***/ 386:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__flert_flert__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__perfil_perfil__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__home_home__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_configuracao_configuracao__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_user_user__ = __webpack_require__(26);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/* PAGINAS */



/* PROVIDER */



var TabsPage = (function () {
    function TabsPage(authService, navCtrl, navParams, confService, userService) {
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.confService = confService;
        this.userService = userService;
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_4__home_home__["a" /* HomePage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_2__flert_flert__["a" /* FlertPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_3__perfil_perfil__["a" /* PerfilPage */];
    }
    TabsPage.prototype.ionViewCanEnter = function () {
        return this.authService.authenticated;
    };
    return TabsPage;
}());
TabsPage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\tabs\tabs.html"*/'<ion-tabs>\n\n  <ion-tab [root]="tab1Root" tabTitle="Ínicio" tabIcon="home"></ion-tab>\n\n  <ion-tab [root]="tab2Root" tabTitle="Flerts" tabIcon="ios-heart">  </ion-tab>\n\n  <ion-tab [root]="tab3Root"  tabTitle="Perfil" tabIcon="ios-contact"></ion-tab>\n\n  <!--<ion-tab [root]="tab3Root" [rootParams]="chatParams" tabTitle="Perfil" tabIcon="ios-contact"></ion-tab>-->  \n\n</ion-tabs>\n\n\n\n\n\n\n\n'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\tabs\tabs.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* NavParams */],
        __WEBPACK_IMPORTED_MODULE_6__providers_configuracao_configuracao__["a" /* ConfiguracaoService */],
        __WEBPACK_IMPORTED_MODULE_7__providers_user_user__["a" /* UserService */]])
], TabsPage);

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 388:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pages_login_login__ = __webpack_require__(129);

var BaseComponent = (function () {
    function BaseComponent(alertCtrl, authService, app, menuCtrl) {
        this.alertCtrl = alertCtrl;
        this.authService = authService;
        this.app = app;
        this.menuCtrl = menuCtrl;
    }
    //usar dentro de um menu para manipular ver se esta logado e se tem permisao de acesso
    BaseComponent.prototype.ngOnInit = function () {
        this.navCtrl = this.app.getActiveNavs()[0];
    };
    //CASO USAURIO DESEJA SAIR MOSTRAR POP DE CONFRIMAÇÃO E JOGAR PARA PAGINA DE LOGIN
    BaseComponent.prototype.onLogout = function () {
        var _this = this;
        this.alertCtrl.create({
            message: 'Deseja realmente sair?',
            buttons: [
                {
                    text: 'Sim',
                    handler: function () {
                        _this.authService.logout()
                            .then(function () {
                            //retornar para a pagina de login
                            _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_0__pages_login_login__["a" /* LoginPage */]);
                            _this.menuCtrl.enable(false, 'user-menu');
                        });
                    }
                },
                {
                    text: 'Não'
                }
            ]
            //mostrar o alert
        }).present();
    };
    return BaseComponent;
}());

//# sourceMappingURL=base.component.js.map

/***/ }),

/***/ 395:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(396);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(400);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 400:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(60);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_facebook__ = __webpack_require__(180);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_native_storage__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__ = __webpack_require__(182);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__ionic_native_image_picker__ = __webpack_require__(183);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__ionic_native_social_sharing__ = __webpack_require__(307);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_push__ = __webpack_require__(443);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__ionic_native_local_notifications__ = __webpack_require__(308);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_angularfire2__ = __webpack_require__(57);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_angularfire2_auth__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_intro_intro__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_flert_flert__ = __webpack_require__(379);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_chat_secreto_chat_secreto__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_perfil_perfil__ = __webpack_require__(380);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_home_home__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_tabs_tabs__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_login_login__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_config_config__ = __webpack_require__(209);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_chat_chat__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_chat_list_chat_list__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_modal_modal__ = __webpack_require__(208);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__providers_secretmessage_secretmessage__ = __webpack_require__(378);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__providers_chatsecret_chatsecret__ = __webpack_require__(128);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__providers_match_match__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__providers_chat_chat__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__providers_message_message__ = __webpack_require__(377);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__providers_configuracao_configuracao__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__providers_camera_camera__ = __webpack_require__(381);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__components_flash_card_flash_card_component__ = __webpack_require__(778);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__app_component__ = __webpack_require__(779);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__components_new_match_new_match_component__ = __webpack_require__(780);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__components_custom_logged_header_custom_logged_header_component__ = __webpack_require__(781);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__components_message_box_message_box_component__ = __webpack_require__(782);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__components_custom_secret_chat_custom_secret_chat__ = __webpack_require__(783);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_42__pipes_capitalize_pipe__ = __webpack_require__(784);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43_angular2_swing__ = __webpack_require__(785);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_43_angular2_swing___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_43_angular2_swing__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_44_ng_lottie__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_45__components_autosize_autosize__ = __webpack_require__(795);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_46__ionic_native_network__ = __webpack_require__(387);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
/* PLUGIN IONIC */










//add compartilhamento social

//push 

//notification

/* ANGULAR FIRE API*/



/* PAGINAS */











/* PROVIDERS */









/* COMPONENTES */



//import { UserInfoComponent } from './../components/user-info/user-info.component';
//import { UserMenuComponent } from './../components/user-menu/user-menu.component';








/* CONFIGURAÇÕES BANCO */
var firebaseAppConfig = {
    apiKey: "AIzaSyDIzgG3f4rRiEBzCOK5yyMp95GBNsLuk6A",
    authDomain: "startup-cleo-6ab96.firebaseapp.com",
    databaseURL: "https://startup-cleo-6ab96.firebaseio.com",
    projectId: "startup-cleo-6ab96",
    storageBucket: "startup-cleo-6ab96.appspot.com",
    messagingSenderId: "407449858691"
};
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["NgModule"])({
        declarations: [
            __WEBPACK_IMPORTED_MODULE_42__pipes_capitalize_pipe__["a" /* CapitalizePipe */],
            __WEBPACK_IMPORTED_MODULE_37__app_component__["a" /* MyApp */],
            //PAGES//
            __WEBPACK_IMPORTED_MODULE_23__pages_config_config__["a" /* ConfigPage */],
            __WEBPACK_IMPORTED_MODULE_25__pages_chat_list_chat_list__["a" /* ChatListPage */],
            __WEBPACK_IMPORTED_MODULE_24__pages_chat_chat__["a" /* ChatPage */],
            __WEBPACK_IMPORTED_MODULE_20__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_22__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_17__pages_flert_flert__["a" /* FlertPage */],
            __WEBPACK_IMPORTED_MODULE_19__pages_perfil_perfil__["a" /* PerfilPage */],
            __WEBPACK_IMPORTED_MODULE_21__pages_tabs_tabs__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_18__pages_chat_secreto_chat_secreto__["a" /* ChatSecretoPage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_intro_intro__["a" /* IntroPage */],
            __WEBPACK_IMPORTED_MODULE_26__pages_modal_modal__["a" /* ModalPage */],
            //COMPONENTS//
            __WEBPACK_IMPORTED_MODULE_39__components_custom_logged_header_custom_logged_header_component__["a" /* CustomLoggedHeaderComponent */],
            __WEBPACK_IMPORTED_MODULE_41__components_custom_secret_chat_custom_secret_chat__["a" /* CustomSecretChatComponent */],
            __WEBPACK_IMPORTED_MODULE_40__components_message_box_message_box_component__["a" /* MessageBoxComponent */],
            __WEBPACK_IMPORTED_MODULE_38__components_new_match_new_match_component__["a" /* NewMatchComponent */],
            //UserMenuComponent,
            //UserInfoComponent,
            __WEBPACK_IMPORTED_MODULE_36__components_flash_card_flash_card_component__["a" /* FlashCardComponent */],
            __WEBPACK_IMPORTED_MODULE_45__components_autosize_autosize__["a" /* Autosize */]
        ],
        imports: [
            __WEBPACK_IMPORTED_MODULE_13_angularfire2__["a" /* AngularFireModule */].initializeApp(firebaseAppConfig),
            __WEBPACK_IMPORTED_MODULE_14_angularfire2_auth__["b" /* AngularFireAuthModule */],
            __WEBPACK_IMPORTED_MODULE_15_angularfire2_database__["b" /* AngularFireDatabaseModule */],
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_http__["b" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_37__app_component__["a" /* MyApp */]),
            __WEBPACK_IMPORTED_MODULE_43_angular2_swing__["SwingModule"],
            __WEBPACK_IMPORTED_MODULE_44_ng_lottie__["a" /* LottieAnimationViewModule */],
        ],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["d" /* IonicApp */]],
        entryComponents: [
            __WEBPACK_IMPORTED_MODULE_23__pages_config_config__["a" /* ConfigPage */],
            __WEBPACK_IMPORTED_MODULE_25__pages_chat_list_chat_list__["a" /* ChatListPage */],
            __WEBPACK_IMPORTED_MODULE_24__pages_chat_chat__["a" /* ChatPage */],
            __WEBPACK_IMPORTED_MODULE_20__pages_home_home__["a" /* HomePage */],
            __WEBPACK_IMPORTED_MODULE_22__pages_login_login__["a" /* LoginPage */],
            __WEBPACK_IMPORTED_MODULE_37__app_component__["a" /* MyApp */],
            __WEBPACK_IMPORTED_MODULE_17__pages_flert_flert__["a" /* FlertPage */],
            __WEBPACK_IMPORTED_MODULE_17__pages_flert_flert__["a" /* FlertPage */],
            __WEBPACK_IMPORTED_MODULE_19__pages_perfil_perfil__["a" /* PerfilPage */],
            __WEBPACK_IMPORTED_MODULE_21__pages_tabs_tabs__["a" /* TabsPage */],
            __WEBPACK_IMPORTED_MODULE_18__pages_chat_secreto_chat_secreto__["a" /* ChatSecretoPage */],
            __WEBPACK_IMPORTED_MODULE_16__pages_intro_intro__["a" /* IntroPage */],
            __WEBPACK_IMPORTED_MODULE_26__pages_modal_modal__["a" /* ModalPage */],
        ],
        providers: [
            __WEBPACK_IMPORTED_MODULE_31__providers_auth_auth__["a" /* AuthService */],
            __WEBPACK_IMPORTED_MODULE_14_angularfire2_auth__["a" /* AngularFireAuth */],
            __WEBPACK_IMPORTED_MODULE_15_angularfire2_database__["a" /* AngularFireDatabase */],
            __WEBPACK_IMPORTED_MODULE_32__providers_chat_chat__["a" /* ChatService */],
            __WEBPACK_IMPORTED_MODULE_28__providers_chatsecret_chatsecret__["a" /* ChatSecretService */],
            __WEBPACK_IMPORTED_MODULE_27__providers_secretmessage_secretmessage__["a" /* SecretMessageService */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_facebook__["a" /* Facebook */],
            __WEBPACK_IMPORTED_MODULE_33__providers_message_message__["a" /* MessageService */],
            __WEBPACK_IMPORTED_MODULE_5__ionic_native_native_storage__["a" /* NativeStorage */],
            __WEBPACK_IMPORTED_MODULE_6__ionic_native_status_bar__["a" /* StatusBar */],
            __WEBPACK_IMPORTED_MODULE_7__ionic_native_splash_screen__["a" /* SplashScreen */],
            __WEBPACK_IMPORTED_MODULE_30__providers_user_user__["a" /* UserService */],
            __WEBPACK_IMPORTED_MODULE_29__providers_match_match__["a" /* MatchService */],
            __WEBPACK_IMPORTED_MODULE_43_angular2_swing__["SwingStackComponent"],
            __WEBPACK_IMPORTED_MODULE_34__providers_configuracao_configuracao__["a" /* ConfiguracaoService */],
            __WEBPACK_IMPORTED_MODULE_8__ionic_native_camera__["a" /* Camera */],
            __WEBPACK_IMPORTED_MODULE_9__ionic_native_image_picker__["a" /* ImagePicker */],
            { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["ErrorHandler"], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["e" /* IonicErrorHandler */] },
            __WEBPACK_IMPORTED_MODULE_35__providers_camera_camera__["a" /* CameraProvider */],
            __WEBPACK_IMPORTED_MODULE_10__ionic_native_social_sharing__["a" /* SocialSharing */],
            __WEBPACK_IMPORTED_MODULE_11__ionic_native_push__["a" /* Push */],
            __WEBPACK_IMPORTED_MODULE_46__ionic_native_network__["a" /* Network */],
            __WEBPACK_IMPORTED_MODULE_12__ionic_native_local_notifications__["a" /* LocalNotifications */],
        ]
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 501:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Chatsecret; });
var Chatsecret = (function () {
    function Chatsecret(inicioChat, lastMessage, timestamp, title, photo) {
        this.inicioChat = inicioChat;
        this.lastMessage = lastMessage;
        this.timestamp = timestamp;
        this.title = title;
        this.photo = photo;
    }
    return Chatsecret;
}());

//# sourceMappingURL=chatsecret.model.js.map

/***/ }),

/***/ 58:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return BaseService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/*
    --> Pagina responsavel por tratar erros <--
*/


var extractError = function (error) {
    // In a real world app, we might use a remote logging infrastructure
    var errMsg;
    if (error instanceof __WEBPACK_IMPORTED_MODULE_0__angular_http__["c" /* Response */]) {
        var body = error.json() || '';
        var err = body.error || JSON.stringify(body);
        errMsg = error.status + " - " + (error.statusText || '') + " " + err;
    }
    else {
        errMsg = error.message ? error.message : error.toString();
    }
    console.error(errMsg);
    return errMsg;
};
var BaseService = (function () {
    function BaseService() {
    }
    BaseService.prototype.handlePromiseError = function (error) {
        return Promise.reject(extractError(error));
    };
    BaseService.prototype.handleObservableError = function (error) {
        return __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].throw(extractError(error));
    };
    return BaseService;
}());

//# sourceMappingURL=base.js.map

/***/ }),

/***/ 69:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChatService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_base__ = __webpack_require__(58);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ChatService = (function (_super) {
    __extends(ChatService, _super);
    function ChatService(afAuth, db, http) {
        var _this = _super.call(this) || this;
        _this.afAuth = afAuth;
        _this.db = db;
        _this.http = http;
        _this.setChats();
        return _this;
    }
    //CRIAR LISTA DE CHATS DO USER LOGADO
    ChatService.prototype.setChats = function () {
        var _this = this;
        this.afAuth.authState
            .subscribe(function (authUser) {
            if (authUser) {
                _this.chats = _this.db.list("/chats/" + authUser.uid, {
                    query: {
                        orderByChild: 'timestamp'
                    }
                }).map(function (chats) {
                    return chats.reverse(); //rotorno ordem descrescente lista contatos
                }).catch(_this.handleObservableError);
            }
        });
    };
    //CRIA NOVOS CHATS ENTRE USUARIOS
    ChatService.prototype.create = function (chat, userId1, userId2) {
        return this.db.object("/chats/" + userId1 + "/" + userId2)
            .set(chat) //salva chat
            .catch(this.handlePromiseError);
    };
    /*/CRIA NOVOS CHATS ENTRE USUARIOS SECRETS
    createSecrets(chat: Chat, userId1: string, userId2: string): firebase.Promise<void> {
      return this.db.object(`/chatsecret/${userId1}/${userId2}`)
        .set(chat)//salva chat
        .catch(this.handlePromiseError);
    } */
    //BUSCA UM OBJETO DO CHAT
    ChatService.prototype.getObjetoChat = function (userId1) {
        return this.db.object("/chats/" + userId1)
            .catch(this.handleObservableError);
    };
    //BUSCA UM CHAT ESPECIFICO
    ChatService.prototype.getDeepChat = function (userId1, userId2) {
        return this.db.object("/chats/" + userId1 + "/" + userId2)
            .catch(this.handleObservableError);
    };
    ChatService.prototype.updatePhoto = function (chat, chatPhoto, recipientUserPhoto) {
        if (chatPhoto != recipientUserPhoto) {
            return chat.update({
                photo: recipientUserPhoto
            }).then(function () {
                return true;
            }).catch(this.handlePromiseError);
        }
        return Promise.resolve(false);
    };
    return ChatService;
}(__WEBPACK_IMPORTED_MODULE_5__base_base__["a" /* BaseService */]));
ChatService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3_angularfire2_auth__["a" /* AngularFireAuth */],
        __WEBPACK_IMPORTED_MODULE_4_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_1__angular_http__["a" /* Http */]])
], ChatService);

//# sourceMappingURL=chat.js.map

/***/ }),

/***/ 76:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_ng_lottie__ = __webpack_require__(195);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_flert_model__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__models_chatsecret_model__ = __webpack_require__(501);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_configuracao_configuracao__ = __webpack_require__(78);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__providers_match_match__ = __webpack_require__(125);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__providers_chat_chat__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__intro_intro__ = __webpack_require__(347);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__chat_list_chat_list__ = __webpack_require__(126);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__chat_secreto_chat_secreto__ = __webpack_require__(207);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_ionic_angular_components_toast_toast_controller__ = __webpack_require__(106);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_rxjs_Rx__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_firebase_app__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_firebase_app___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16_firebase_app__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__providers_chatsecret_chatsecret__ = __webpack_require__(128);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


















var HomePage = (function () {
    function HomePage(authService, navCtrl, userService, alertCtrl, confService, matchService, chatService, toastCtrl, configService, af, chatSecretService, loadingCtrl, modalCtrl) {
        this.authService = authService;
        this.navCtrl = navCtrl;
        this.userService = userService;
        this.alertCtrl = alertCtrl;
        this.confService = confService;
        this.matchService = matchService;
        this.chatService = chatService;
        this.toastCtrl = toastCtrl;
        this.configService = configService;
        this.af = af;
        this.chatSecretService = chatSecretService;
        this.loadingCtrl = loadingCtrl;
        this.modalCtrl = modalCtrl;
        this.card = [];
        this.acabou = false;
        __WEBPACK_IMPORTED_MODULE_0_ng_lottie__["a" /* LottieAnimationViewModule */].forRoot();
        this.lottieConfig = {
            path: 'assets/whys.json',
            autoplay: true,
            loop: true
        };
    }
    //VERIFICAR SE TA LOGADO
    HomePage.prototype.ionViewCanEnter = function () {
        return this.authService.authenticated;
    };
    HomePage.prototype.ionViewWillEnter = function () {
        this.loading = this.showLoading();
        this.getHome();
    };
    //BUSCA CONFIG INICIAL
    HomePage.prototype.getHome = function () {
        var _this = this;
        this.confService
            .buscaConfig()
            .first()
            .subscribe(function (config) {
            if (config.intro === true) {
                _this.loading.dismiss(); //tira o carregando...
                _this.navCtrl.setRoot(__WEBPACK_IMPORTED_MODULE_9__intro_intro__["a" /* IntroPage */]);
            }
            else if (config.intro === false) {
                //DIRECIONAR A PAGINA CONFORME O GENERO
                _this.userService.currentUser
                    .first()
                    .subscribe(function (currentUser) {
                    switch (currentUser.genero) {
                        case "Masculino":
                            switch (config.ativo) {
                                case true:
                                    _this.getOneUser();
                                    _this.flerts = false;
                                    _this.new_match = false;
                                    _this.loading.dismiss(); //tira o carregando...
                                    break;
                                case false:
                                    _this.flerts = true;
                                    _this.new_match = false;
                                    _this.getLikes();
                                    _this.getViews();
                                    _this.loading.dismiss(); //tira o carregando...
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "Feminino":
                            switch (config.ativo) {
                                case true:
                                    _this.getOneUser();
                                    _this.flerts = false;
                                    _this.new_match = false;
                                    _this.loading.dismiss(); //tira o carregando...
                                    break;
                                case false:
                                    _this.flerts = true;
                                    _this.new_match = false;
                                    _this.getLikes();
                                    _this.getViews();
                                    _this.loading.dismiss(); //tira o carregando...
                                    break;
                                default:
                                    _this.loading.dismiss(); //tira o carregando...
                                    break;
                            }
                            break;
                        case "Outros":
                            switch (config.ativo) {
                                case true:
                                    _this.getOneUser();
                                    _this.flerts = false;
                                    _this.loading.dismiss(); //tira o carregando...
                                    break;
                                case false:
                                    _this.flerts = true;
                                    _this.getLikes();
                                    _this.getViews();
                                    _this.loading.dismiss(); //tira o carregando...
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
        });
    };
    //CHAMA PAGE CHAT
    HomePage.prototype.Chat = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_10__chat_list_chat_list__["a" /* ChatListPage */]);
    };
    //BUSCA LIKES
    HomePage.prototype.getLikes = function () {
        var _this = this;
        this.matchService.getTotalVotos()
            .subscribe(function (action) {
            _this.like = action.like;
        });
    };
    //BUSCA VIEWS
    HomePage.prototype.getViews = function () {
        var _this = this;
        this.matchService.getTotalViews()
            .subscribe(function (action) {
            _this.view = action.view;
        });
    };
    //BUSCA USERS
    /*
    Aqui foi feito uma matriz para percorer os votos e usuarios
    primeiro busca o usuario e verifica se tem o id dele no array de votos
    se tiver coloca verifica como false, para nao add no array que vai pra view
    */
    HomePage.prototype.getOneUser = function () {
        var _this = this;
        var verifica = true;
        var achokey;
        this.configService.buscaConfig()
            .subscribe(function (config) {
            _this.userService.filtro(config)
                .subscribe(function (users) {
                _this.matchService.getVotos(_this.authService.getUid())
                    .subscribe(function (votos) {
                    users.forEach(function (user) {
                        if (users.length == 0) {
                            _this.user = null;
                        }
                        else {
                            votos.forEach(function (voto) {
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
                        _this.acabou = false;
                        _this.userService.getUser(achokey)
                            .first()
                            .subscribe(function (user) {
                            _this.user = user; //atribuir valores 
                        });
                    }
                    else {
                        _this.acabou = true;
                    }
                });
            });
        });
    };
    //CRIAÇAÕ DO CHAT ENTRE USUARIOS TEMPORÁRIO 24 HORAS
    HomePage.prototype.openChaSecret = function (recipientUser) {
        //this.matchService.createFlertLikes(recipientUser.key, this.authService.getUid(), false, false);
        var _this = this;
        this.userService.currentUser //PEGA USUARIO LOGADO
            .first()
            .subscribe(function (currentUser) {
            _this.chatSecretService.getDeepChatsecret(currentUser.$key, recipientUser.$key) // caminho /users/id1/id2
                .first()
                .subscribe(function (chat) {
                //o objeto chat tem um propriedade(chat)valida?
                if (chat.hasOwnProperty('$value')) {
                    var timestamp = __WEBPACK_IMPORTED_MODULE_16_firebase_app__["database"].ServerValue.TIMESTAMP; //pega time temp do firebase""
                    var chat1 = new __WEBPACK_IMPORTED_MODULE_3__models_chatsecret_model__["a" /* Chatsecret */](timestamp, '', timestamp, recipientUser.name, (recipientUser.photo || ''));
                    _this.chatSecretService.create(chat1, currentUser.$key, recipientUser.$key);
                    var chat2 = new __WEBPACK_IMPORTED_MODULE_3__models_chatsecret_model__["a" /* Chatsecret */](timestamp, '', timestamp, recipientUser.name, (currentUser.photo || ''));
                    _this.chatSecretService.create(chat2, recipientUser.$key, currentUser.$key);
                }
            });
        });
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_11__chat_secreto_chat_secreto__["a" /* ChatSecretoPage */], {
            recipientUser: recipientUser
        });
    };
    // VOTAÇÂO
    HomePage.prototype.voteUp = function (like, user) {
        var _this = this;
        console.log("VOTOU");
        this.card.pop();
        this.getOneUser();
        console.log(like);
        //this.matchService.removeUser(user.$key);
        this.userService.currentUser //PEGA USUARIO LOGADO
            .first()
            .subscribe(function (c) {
            if (like) {
                _this.new_match = true;
                _this.userLogado = c;
                _this.userMatch = user;
                _this.presentToast(true);
                var timestamp = __WEBPACK_IMPORTED_MODULE_16_firebase_app__["database"].ServerValue.TIMESTAMP; //pega time temp do firebase
                var user1 = new __WEBPACK_IMPORTED_MODULE_2__models_flert_model__["a" /* Flert */](user.key, timestamp, user.name, (user.photo || ''), user.idade);
                _this.matchService.createFlertLikes(user1.key, c.key, true, true);
            }
            else if (!like) {
                _this.presentToast(false);
                var timestamp = __WEBPACK_IMPORTED_MODULE_16_firebase_app__["database"].ServerValue.TIMESTAMP; //pega time temp do firebase
                var user1 = new __WEBPACK_IMPORTED_MODULE_2__models_flert_model__["a" /* Flert */](user.key, timestamp, user.name, (user.photo || ''), user.idade);
                _this.matchService.createFlertLikes(user1.key, c.key, false, false);
            }
        });
    };
    HomePage.prototype.presentToast = function (tipo) {
        if (tipo) {
            var toast = this.toastCtrl.create({
                message: 'LIKE',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
        else {
            var toast = this.toastCtrl.create({
                message: 'DESLIKE',
                duration: 3000,
                position: 'top'
            });
            toast.present();
        }
    };
    //MOSTRA MENSAGEM DE AGUARDE...
    HomePage.prototype.showLoading = function () {
        var loading = this.loadingCtrl.create({
            content: 'Aguarde...'
        });
        //mostra carregamento pagina
        loading.present();
        return loading;
    };
    return HomePage;
}());
HomePage = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["Component"])({
        selector: 'page-home',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\pages\home\home.html"*/'<ion-header>\n\n    <ion-navbar>\n\n        <ion-title>\n\n            <img alt="Cleo aplicativo de relacionamento" height="40" src="assets/images/logo.png">\n\n        </ion-title>\n\n    </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n\n\n    <div *ngIf="flerts && !new_match">\n\n        <ion-card class="td-card" color="fundo">\n\n            <ion-row>\n\n                <div class="heart">\n\n                    <img class="imgcoracao" src="assets/images/coracao.png">\n\n                </div>\n\n                <div class="textFlert">\n\n                    <p>{{ like }} Gostei</p>\n\n                </div>\n\n                <div class="vizualizacao">\n\n                    <p>{{ view }} Views</p>\n\n                </div>\n\n            </ion-row>\n\n        </ion-card>\n\n    </div>\n\n    <div *ngIf="!flerts && !new_match">\n\n        <flash-card *ngIf="!acabou" [user]="user"></flash-card>\n\n        <ion-item id="fundo"  *ngIf="acabou" >\n\n            <div class="row"> \n\n                <ion-col col-1></ion-col>\n\n                <ion-col col-10>\n\n                    <!--<ion-item >\n\n                        <img width="300"  src="assets/cleofundo.png" >   \n\n                    </ion-item> -->\n\n                            <!-- Animação -->\n\n                    <lottie-animation-view [options]="lottieConfig" [width]="300" [height]="300"> \n\n                    </lottie-animation-view>\n\n                    <ion-card-title  id="novoMatchAviso">\n\n                        Procurando! \n\n                    </ion-card-title>\n\n                </ion-col>\n\n            </div>\n\n        </ion-item>\n\n    </div>\n\n    <!-- Abaixo component com tela de novo Match-->\n\n    <new-match *ngIf="new_match" [userLogado]="userLogado" [userMatch]="userMatch" ></new-match>\n\n</ion-content>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\pages\home\home.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_14_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_4__providers_user_user__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_14_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_6__providers_configuracao_configuracao__["a" /* ConfiguracaoService */],
        __WEBPACK_IMPORTED_MODULE_7__providers_match_match__["a" /* MatchService */],
        __WEBPACK_IMPORTED_MODULE_8__providers_chat_chat__["a" /* ChatService */],
        __WEBPACK_IMPORTED_MODULE_13_ionic_angular_components_toast_toast_controller__["a" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_6__providers_configuracao_configuracao__["a" /* ConfiguracaoService */],
        __WEBPACK_IMPORTED_MODULE_12_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_17__providers_chatsecret_chatsecret__["a" /* ChatSecretService */],
        __WEBPACK_IMPORTED_MODULE_14_ionic_angular__["g" /* LoadingController */],
        __WEBPACK_IMPORTED_MODULE_14_ionic_angular__["i" /* ModalController */]])
], HomePage);

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 778:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return FlashCardComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pages_home_home__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__models_user_models__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__ = __webpack_require__(196);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_Rx___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_Rx__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var FlashCardComponent = (function () {
    function FlashCardComponent(homePage, userService) {
        this.homePage = homePage;
        this.userService = userService;
    }
    FlashCardComponent.prototype.voteUp = function (like, user) {
        this.homePage.voteUp(like, user);
    };
    FlashCardComponent.prototype.openChaSecret = function (user) {
        this.homePage.openChaSecret(user);
    };
    return FlashCardComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_4__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_2__models_user_models__["a" /* User */])
], FlashCardComponent.prototype, "user", void 0);
FlashCardComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_4__angular_core__["Component"])({
        selector: 'flash-card',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\components\flash-card\flash-card.component.html"*/'<ion-card class="card-stack" no-lines>\n\n    <div class="foto">\n\n        <img [src]="(user)?.photo">\n\n       \n\n        <h1 class="name">{{ (user)?.name }} {{ (user)?.sobrenome}},{{(user)?.idade}}</h1>\n\n   \n\n    </div>\n\n    <div class="sobre">\n\n        Sobre: {{ (user)?.sobre }}\n\n    </div>\n\n</ion-card>\n\n<ion-footer >\n\n    <div class="tinder-footer" no-lines>\n\n        <div id="swipe_dislike" class="rate" (click)="voteUp(false,user)"></div>\n\n        <div class="info" (click)="openChaSecret(user)"></div>\n\n        <div id="swipe_like" class="rate" (click)="voteUp(true,user)"></div>\n\n    </div>\n\n</ion-footer>\n\n'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\components\flash-card\flash-card.component.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__pages_home_home__["a" /* HomePage */],
        __WEBPACK_IMPORTED_MODULE_1__providers_user_user__["a" /* UserService */]])
], FlashCardComponent);

//# sourceMappingURL=flash-card.component.js.map

/***/ }),

/***/ 779:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(305);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(306);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__ionic_native_native_storage__ = __webpack_require__(304);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_native_network__ = __webpack_require__(387);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__ = __webpack_require__(386);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_login_login__ = __webpack_require__(129);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_chat_chat__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_local_notifications__ = __webpack_require__(308);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var MyApp = (function () {
    function MyApp(platform, afAuth, statusBar, splashscreen, nativeStorage, splashScreen, authService, toastCtrl, network, chatService, localNotifications) {
        this.platform = platform;
        this.afAuth = afAuth;
        this.statusBar = statusBar;
        this.splashscreen = splashscreen;
        this.nativeStorage = nativeStorage;
        this.splashScreen = splashScreen;
        this.authService = authService;
        this.toastCtrl = toastCtrl;
        this.network = network;
        this.chatService = chatService;
        this.localNotifications = localNotifications;
        this.escutaChat();
        this.auth();
        this.lookForNetwork();
    }
    //VERIFICAR A AUTENTICAÇÃO 
    MyApp.prototype.auth = function () {
        var _this = this;
        this.platform.ready().then(function () {
            _this.afAuth.authState.subscribe(function (auth) {
                if (!auth) {
                    _this.rootPage = __WEBPACK_IMPORTED_MODULE_8__pages_login_login__["a" /* LoginPage */];
                }
                else {
                    _this.authService.setUid(auth.uid); // Set uid
                    _this.rootPage = __WEBPACK_IMPORTED_MODULE_7__pages_tabs_tabs__["a" /* TabsPage */];
                }
            });
            _this.statusBar.styleDefault();
            _this.splashscreen.hide();
        });
    };
    //VERIFICAÇÂO DE CONEXAO
    MyApp.prototype.lookForNetwork = function () {
        var _this = this;
        //While app open
        if (this.network.type == 'none') {
            var toast = this.toastCtrl.create({
                message: 'Internet Não Disponivel../!',
                duration: 3000,
                position: 'bottom'
            }).present();
        }
        this.network.onDisconnect()
            .subscribe(function () {
            var toast = _this.toastCtrl.create({
                message: 'Sem conexão',
                duration: 3000,
                position: 'bottom'
            }).present();
        });
        this.network.onConnect()
            .subscribe(function () {
            var toast = _this.toastCtrl.create({
                message: 'Internet conectada../!',
                duration: 3000,
                position: 'bottom'
            }).present();
        });
    };
    MyApp.prototype.escutaChat = function () {
        var _this = this;
        this.chatService.getObjetoChat(this.authService.getUid())
            .first().subscribe(function (obj) {
            if (obj != 0 || obj != null) {
                _this.localNotifications.schedule({
                    id: 1,
                    text: 'Você tem uma nova Mensagem',
                });
            }
        });
    };
    return MyApp;
}());
MyApp = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n\n'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\app\app.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* Platform */],
        __WEBPACK_IMPORTED_MODULE_4_angularfire2_auth__["a" /* AngularFireAuth */],
        __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
        __WEBPACK_IMPORTED_MODULE_5__ionic_native_native_storage__["a" /* NativeStorage */],
        __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */],
        __WEBPACK_IMPORTED_MODULE_9__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["m" /* ToastController */],
        __WEBPACK_IMPORTED_MODULE_6__ionic_native_network__["a" /* Network */],
        __WEBPACK_IMPORTED_MODULE_10__providers_chat_chat__["a" /* ChatService */],
        __WEBPACK_IMPORTED_MODULE_11__ionic_native_local_notifications__["a" /* LocalNotifications */]])
], MyApp);

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 78:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConfiguracaoService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_angularfire2_auth__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_http__ = __webpack_require__(37);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_map__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__base_base__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__auth_auth__ = __webpack_require__(22);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var ConfiguracaoService = (function (_super) {
    __extends(ConfiguracaoService, _super);
    function ConfiguracaoService(http, db, afAuth, authService) {
        var _this = _super.call(this) || this;
        _this.http = http;
        _this.db = db;
        _this.afAuth = afAuth;
        _this.authService = authService;
        _this.idUser = _this.authService.getUid();
        return _this;
    }
    //ALTERAR PARA REMOVER A PAGE INTRO
    ConfiguracaoService.prototype.alterarIntroConfig = function () {
        this.db.database.ref("/config/" + this.idUser)
            .update({
            intro: false,
        });
    };
    //BUSCA DOS INTERRESSES DO USER
    ConfiguracaoService.prototype.buscaConfig = function () {
        return this.db.object("/config/" + this.idUser)
            .catch(this.handleObservableError);
    };
    //FAZ GRAVAÇÃO DS INTERRESES DO USER
    ConfiguracaoService.prototype.gravaInteresse = function (val, genero) {
        var refeConfig = this.db.database.ref("/config/" + this.idUser);
        if (genero == "Mas") {
            if (val === true) {
                console.log("H true");
                refeConfig.update({
                    masculino: true,
                });
            }
            else {
                console.log("H false");
                refeConfig.update({
                    masculino: false,
                });
            }
        }
        else if (genero == "Fem") {
            if (val === true) {
                console.log("F true");
                refeConfig.update({
                    feminino: true,
                });
            }
            else {
                console.log("F false");
                refeConfig.update({
                    feminino: false,
                });
            }
        }
    };
    //FAZ GRAVAÇÃO DS INTERRESES DO USER
    ConfiguracaoService.prototype.gravaInteresseSerBuscado = function (val, genero) {
        var refeConfig = this.db.database.ref("/config/" + this.idUser);
        if (genero == "Mas") {
            if (val === true) {
                refeConfig.update({
                    masculinoSerBuscado: true,
                });
            }
            else {
                refeConfig.update({
                    masculinoSerBuscado: false,
                });
            }
        }
        else if (genero == "Fem") {
            if (val === true) {
                refeConfig.update({
                    femininoSerBuscado: true,
                });
            }
            else {
                refeConfig.update({
                    femininoSerBuscado: false,
                });
            }
        }
    };
    //FAZ GRAVAÇÃO DA FAIXA INTERRESSE DO USER
    ConfiguracaoService.prototype.gravaFaixa = function (range) {
        console.log(range);
        var refeConfig = this.db.database.ref("/config/" + this.idUser);
        refeConfig.update({
            faixaInicio: range.lower,
            faixaFim: range.upper,
        });
    };
    //FAZ GRAVAÇÃO DO ATIVO E PASSIVO
    ConfiguracaoService.prototype.gravaAtivo = function (atv) {
        this.db.database.ref("/config/" + this.idUser)
            .update({
            ativo: atv
        });
    };
    return ConfiguracaoService;
}(__WEBPACK_IMPORTED_MODULE_5__base_base__["a" /* BaseService */]));
ConfiguracaoService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_2__angular_core__["Injectable"])(),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__angular_http__["a" /* Http */],
        __WEBPACK_IMPORTED_MODULE_1_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_0_angularfire2_auth__["a" /* AngularFireAuth */],
        __WEBPACK_IMPORTED_MODULE_6__auth_auth__["a" /* AuthService */]])
], ConfiguracaoService);

//# sourceMappingURL=configuracao.js.map

/***/ }),

/***/ 780:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NewMatchComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__pages_chat_chat__ = __webpack_require__(127);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__providers_chat_chat__ = __webpack_require__(69);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_ionic_angular_navigation_view_controller__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_user_user__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_home_home__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__models_user_models__ = __webpack_require__(131);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__models_chat_model__ = __webpack_require__(205);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_angularfire2_database__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__ionic_native_image_picker__ = __webpack_require__(183);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};












var NewMatchComponent = (function () {
    function NewMatchComponent(navCtrl, userService, db, authService, imagePicker, viewCtrl, chatService) {
        this.navCtrl = navCtrl;
        this.userService = userService;
        this.db = db;
        this.authService = authService;
        this.imagePicker = imagePicker;
        this.viewCtrl = viewCtrl;
        this.chatService = chatService;
        console.log('Novo Match');
    }
    NewMatchComponent.prototype.chat = function (recipientUser) {
        var _this = this;
        this.userService.currentUser //PEGA USUARIO LOGADO
            .first()
            .subscribe(function (currentUser) {
            _this.chatService.getDeepChat(currentUser.$key, recipientUser.$key) // caminho /users/id1/id2
                .first()
                .subscribe(function (chat) {
                //o objeto chat tem um propriedade(chat)valida?
                if (chat.hasOwnProperty('$value')) {
                    var timestamp = firebase.database.ServerValue.TIMESTAMP; //pega time temp do firebase
                    var chat1 = new __WEBPACK_IMPORTED_MODULE_8__models_chat_model__["a" /* Chat */]('', timestamp, recipientUser.name, (recipientUser.photo || ''));
                    _this.chatService.create(chat1, currentUser.$key, recipientUser.$key);
                    var chat2 = new __WEBPACK_IMPORTED_MODULE_8__models_chat_model__["a" /* Chat */]('', timestamp, currentUser.name, (currentUser.photo || ''));
                    _this.chatService.create(chat2, recipientUser.$key, currentUser.$key);
                }
            });
        });
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_0__pages_chat_chat__["a" /* ChatPage */], {
            recipientUser: recipientUser
        });
    };
    //Volta da tela de novo match para a home
    NewMatchComponent.prototype.home = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__pages_home_home__["a" /* HomePage */]);
    };
    return NewMatchComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_6__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_7__models_user_models__["a" /* User */])
], NewMatchComponent.prototype, "userLogado", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_6__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_7__models_user_models__["a" /* User */])
], NewMatchComponent.prototype, "userMatch", void 0);
NewMatchComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_6__angular_core__["Component"])({
        selector: 'new-match',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\components\new-match\new-match.component.html"*/'<ion-content class="cards-bg">\n\n  <ion-card no-padding>\n\n      <br><br>\n\n      <ion-row >\n\n          <ion-col>\n\n            <img id="profile-image" [src]="(userLogado)?.photo">\n\n          </ion-col>\n\n          <ion-col text-right>\n\n            <img id="profile-image" [src]="(userMatch)?.photo">   \n\n          </ion-col>\n\n      </ion-row>\n\n      \n\n      \n\n    <ion-card-content>\n\n      <ion-card-title  id="novoMatchAviso">\n\n        Um novo Match! \n\n      </ion-card-title>\n\n      <p id="novoMatchMensagem">\n\n        Parabéns! Você e {{userMatch.name}} podem conversar agora.\n\n      </p>\n\n    </ion-card-content>\n\n\n\n    <ion-row no-padding>\n\n      <ion-col>\n\n        <button ion-button clear small color="danger" icon-start (click)="home()">\n\n          <ion-icon name=\'md-albums\'></ion-icon>\n\n          Ver outros\n\n        </button>\n\n      </ion-col>\n\n\n\n      <ion-col text-right>\n\n        <button ion-button clear small color="danger" icon-start (click)="chat(userMatch)">\n\n          <ion-icon name=\'ios-chatbubbles\'></ion-icon>\n\n          Conversar\n\n        </button>\n\n      </ion-col>\n\n    </ion-row>\n\n\n\n  </ion-card>\n\n\n\n</ion-content>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\components\new-match\new-match.component.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_5_ionic_angular__["j" /* NavController */],
        __WEBPACK_IMPORTED_MODULE_3__providers_user_user__["a" /* UserService */],
        __WEBPACK_IMPORTED_MODULE_9_angularfire2_database__["a" /* AngularFireDatabase */],
        __WEBPACK_IMPORTED_MODULE_10__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_11__ionic_native_image_picker__["a" /* ImagePicker */],
        __WEBPACK_IMPORTED_MODULE_2_ionic_angular_navigation_view_controller__["a" /* ViewController */],
        __WEBPACK_IMPORTED_MODULE_1__providers_chat_chat__["a" /* ChatService */]])
], NewMatchComponent);

//# sourceMappingURL=new-match.component.js.map

/***/ }),

/***/ 781:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomLoggedHeaderComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_component__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_user_models__ = __webpack_require__(131);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CustomLoggedHeaderComponent = (function (_super) {
    __extends(CustomLoggedHeaderComponent, _super);
    function CustomLoggedHeaderComponent(alertCtrl, authService, app, menuCtrl) {
        var _this = _super.call(this, alertCtrl, authService, app, menuCtrl) || this;
        _this.alertCtrl = alertCtrl;
        _this.authService = authService;
        _this.app = app;
        _this.menuCtrl = menuCtrl;
        return _this;
    }
    return CustomLoggedHeaderComponent;
}(__WEBPACK_IMPORTED_MODULE_3__base_component__["a" /* BaseComponent */]));
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], CustomLoggedHeaderComponent.prototype, "title", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__models_user_models__["a" /* User */])
], CustomLoggedHeaderComponent.prototype, "user", void 0);
CustomLoggedHeaderComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'custom-logged-header',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\components\custom-logged-header\custom-logged-header.component.html"*/'<ion-navbar>\n\n    <!--<button ion-button menuToggle="user-menu">\n\n        <ion-icon name="menu"></ion-icon>\n\n    </button> -->\n\n    <ion-title>\n\n        <ion-item detail-none no-lines color="secondary" *ngIf="user; else titleTemplate">\n\n            <ion-avatar item-start>\n\n                <img [src]="user.photo || \'assets/images/no-photo.png\'">\n\n            </ion-avatar>\n\n            {{ title }}\n\n        </ion-item>\n\n        <ng-template #titleTemplate>\n\n            {{ title }}\n\n        </ng-template>\n\n    </ion-title>\n\n</ion-navbar>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\components\custom-logged-header\custom-logged-header.component.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* MenuController */]])
], CustomLoggedHeaderComponent);

//# sourceMappingURL=custom-logged-header.component.js.map

/***/ }),

/***/ 782:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MessageBoxComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__models_message_model__ = __webpack_require__(206);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var MessageBoxComponent = (function () {
    function MessageBoxComponent() {
    }
    return MessageBoxComponent;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1__models_message_model__["a" /* Message */])
], MessageBoxComponent.prototype, "message", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", Boolean)
], MessageBoxComponent.prototype, "isFromSender", void 0);
MessageBoxComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'message-box',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\components\message-box\message-box.component.html"*/'<div class="text" [ngClass]="{\'sender-background\': isFromSender}">\n\n  <p>{{ message.text }}</p>\n\n  <p class="timestamp">{{ message.timestamp | date:\'dd/MM/y H:mm\' }}</p>\n\n</div>\n\n'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\components\message-box\message-box.component.html"*/,
        host: {
            '[style.justify-content]': '((!isFromSender) ? "flex-start" : "flex-end")',
            '[style.text-align]': '((!isFromSender) ? "right" : "right")' //alinha texto
        }
    }),
    __metadata("design:paramtypes", [])
], MessageBoxComponent);

//# sourceMappingURL=message-box.component.js.map

/***/ }),

/***/ 783:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomSecretChatComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__ = __webpack_require__(22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__base_component__ = __webpack_require__(388);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__models_user_models__ = __webpack_require__(131);
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var CustomSecretChatComponent = (function (_super) {
    __extends(CustomSecretChatComponent, _super);
    function CustomSecretChatComponent(alertCtrl, authService, app, menuCtrl) {
        var _this = _super.call(this, alertCtrl, authService, app, menuCtrl) || this;
        _this.alertCtrl = alertCtrl;
        _this.authService = authService;
        _this.app = app;
        _this.menuCtrl = menuCtrl;
        return _this;
    }
    return CustomSecretChatComponent;
}(__WEBPACK_IMPORTED_MODULE_3__base_component__["a" /* BaseComponent */]));
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", String)
], CustomSecretChatComponent.prototype, "title", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Input"])(),
    __metadata("design:type", __WEBPACK_IMPORTED_MODULE_4__models_user_models__["a" /* User */])
], CustomSecretChatComponent.prototype, "user", void 0);
CustomSecretChatComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Component"])({
        selector: 'custom-secret-chat',template:/*ion-inline-start:"C:\Projetos\7.3\app_cleo\src\components\custom-secret-chat\custom-secret-chat.html"*/'<ion-navbar>\n\n    <button ion-button menuToggle="user-menu">\n\n        <ion-icon name="menu"></ion-icon>\n\n    </button>\n\n    <ion-title>\n\n        <ion-item detail-none no-lines color="secondary" *ngIf="user; else titleTemplate">\n\n            <ion-avatar item-start>\n\n                <img class="avatar" [src]="user.photo || \'assets/images/no-photo.png\'">\n\n            </ion-avatar>\n\n            {{ title }}\n\n        </ion-item>\n\n        <ng-template #titleTemplate>\n\n            {{ title }}\n\n        </ng-template>\n\n    </ion-title>\n\n</ion-navbar>'/*ion-inline-end:"C:\Projetos\7.3\app_cleo\src\components\custom-secret-chat\custom-secret-chat.html"*/
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* AlertController */],
        __WEBPACK_IMPORTED_MODULE_2__providers_auth_auth__["a" /* AuthService */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* App */],
        __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* MenuController */]])
], CustomSecretChatComponent);

//# sourceMappingURL=custom-secret-chat.js.map

/***/ }),

/***/ 784:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CapitalizePipe; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var CapitalizePipe = (function () {
    function CapitalizePipe() {
    }
    //ele trata os titulos da pagina true para deixar primeria letra maiuscula
    CapitalizePipe.prototype.transform = function (value, onlyFirst) {
        if (onlyFirst)
            return value.charAt(0).toUpperCase() + value.substr(1);
        var words = value.split(' ');
        var output = '';
        words.forEach(function (value, index, words) {
            output += value.charAt(0).toUpperCase() + value.substr(1).toLowerCase() + ' ';
        });
        return output;
    };
    return CapitalizePipe;
}());
CapitalizePipe = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Pipe"])({
        name: 'capitalize'
    }),
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Injectable"])()
], CapitalizePipe);

//# sourceMappingURL=capitalize.pipe.js.map

/***/ }),

/***/ 795:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Autosize; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var Autosize = (function () {
    function Autosize(element) {
        this.element = element;
    }
    Autosize.prototype.onInput = function (textArea) {
        this.adjust();
    };
    Autosize.prototype.ngOnInit = function () {
        var _this = this;
        setTimeout(function () { return _this.adjust(); }, 0);
    };
    Autosize.prototype.adjust = function () {
        var textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
        textArea.style.overflow = 'hidden';
        textArea.style.height = 'auto';
        textArea.style.height = textArea.scrollHeight + 'px';
    };
    return Autosize;
}());
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["HostListener"])('input', ['$event.target']),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [HTMLTextAreaElement]),
    __metadata("design:returntype", void 0)
], Autosize.prototype, "onInput", null);
Autosize = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["Directive"])({
        selector: 'ion-textarea[autosize]'
    }),
    __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_core__["ElementRef"]])
], Autosize);

//# sourceMappingURL=autosize.js.map

/***/ })

},[395]);
//# sourceMappingURL=main.js.map