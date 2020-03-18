import { Component, ViewChild } from '@angular/core';
import { Content, NavController, NavParams } from 'ionic-angular';

import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';

import { AuthService } from './../../providers/auth/auth';
import { Chat } from './../../models/chat.model';
import { ChatService } from './../../providers/chat/chat';
import { Message } from './../../models/message.model';
import { MessageService } from './../../providers/message/message';
import { User } from './../../models/user.models';
import { UserService } from './../../providers/user/user';

import * as firebase from 'firebase/app';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
    selector: 'page-chat',
    templateUrl: 'chat.html',
})
export class ChatPage {


    @ViewChild(Content) content: Content;
    messages: FirebaseListObservable<Message[]>;//lista d msgs
    pageTitle: string;//titulo da pagina 
    sender: User;//remetente
    recipient: User;//destinatario
    private chat1: FirebaseObjectObservable<Chat>;
    private chat2: FirebaseObjectObservable<Chat>;

    constructor(
        public authService: AuthService,
        public chatService: ChatService,
        public messageService: MessageService,
        public navCtrl: NavController,
        public navParams: NavParams,
        public userService: UserService,

    ) {
    }


    //VERIFICA SE ESTA LOGADO
    ionViewCanEnter(): Promise<boolean> {
        return this.authService.authenticated;
    }

    ionViewDidLoad() {

        //recebe parametros
        this.recipient = this.navParams.get('recipientUser');
        this.pageTitle = this.recipient.name;
        //pegar remetente
        this.userService.currentUser
            .first()//somente primeiro valor
            .subscribe((currentUser: User) => {
                this.sender = currentUser;
                this.chat1 = this.chatService.getDeepChat(this.sender.$key, this.recipient.$key);//pega soemnte um chat
                this.chat2 = this.chatService.getDeepChat(this.recipient.$key, this.sender.$key);
                if (this.recipient.photo) {
                    this.chat1
                        .first()
                        .subscribe((chat: Chat) => {
                            this.chatService.updatePhoto(this.chat1, chat.photo, this.recipient.photo);
                        });
                }
                let doSubscription = () => {
                    this.messages.subscribe((messages: Message[]) => {
                            this.scrollToBottom();
                        });
                };
                this.messages = this.messageService.getMessages(this.sender.$key, this.recipient.$key);
                this.messages.first().subscribe((messages: Message[]) => {
                        if (messages.length === 0) {//se for igual a 0 nao existe msmg na lista
                            this.messages = this.messageService.getMessages(this.recipient.$key, this.sender.$key);//busca ao contrario
                            doSubscription();
                        } else {
                            
                            doSubscription();
                        }
                    });
            });
    }

    //RECEBE MENSAGEM DA VIEW 
    sendMessage(newMessage: string): void {
        if (newMessage) {//se existir msm 
            let currentTimestamp: Object = firebase.database.ServerValue.TIMESTAMP;
            this.messageService.create(
                new Message(
                    this.sender.$key,
                    newMessage,
                    currentTimestamp
                ),
                this.messages
            ).then(() => {
                this.chat1
                    .update({
                        lastMessage: newMessage,
                        timestamp: currentTimestamp
                    });
                this.chat2
                    .update({
                        lastMessage: newMessage,
                        timestamp: currentTimestamp
                    });
            });
        }
    }

    //
    private scrollToBottom(duration?: number): void {
        setTimeout(() => {
            if (this.content._scroll) {
                this.content.scrollToBottom(duration || 300);
            }
        }, 50);
    }

  
}
