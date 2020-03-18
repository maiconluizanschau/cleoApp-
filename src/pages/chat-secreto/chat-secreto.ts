import { SecretMessageService } from './../../providers/secretmessage/secretmessage';
import { ChatSecretService } from './../../providers/chatsecret/chatsecret';

import { Chatsecret } from './../../models/chatsecret.model';
import { UserService } from './../../providers/user/user';
import { AuthService } from './../../providers/auth/auth';
import { Message } from './../../models/message.model';
import { FirebaseListObservable } from 'angularfire2/database';
import { FirebaseObjectObservable } from 'angularfire2/database';
import { User } from './../../models/user.models';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Content } from 'ionic-angular';

import * as firebase from 'firebase/app';

export interface CountdownTimer {
    seconds: number;
    secondsRemaining: number;
    runTimer: boolean;
    hasStarted: boolean;
    hasFinished: boolean;
    displayTime: string;
}

@Component({
    selector: 'page-chat-secreto',
    templateUrl: 'chat-secreto.html',
})
export class ChatSecretoPage {

    timeInSeconds = 86400;
    timer: CountdownTimer;

    @ViewChild(Content) content: Content;
    secretmessages: FirebaseListObservable<Message[]>;//lista d msgs
    pageTitle: string;//titulo da pagina 
    sender: User;//remetente
    recipient: User;//destinatario
    private chatsecret1: FirebaseObjectObservable<Chatsecret>;
    private chatsecret2: FirebaseObjectObservable<Chatsecret>;



    constructor(
        public authService: AuthService,
        public ChatsecretService: ChatSecretService,
        public messagesecretService: SecretMessageService,
        public navCtrl: NavController,
        public navParams: NavParams,
        public userService: UserService
    ) {
    }


    //VERIFICA SE ESTA LOGADO
    ionViewCanEnter(): Promise<boolean> {
        return this.authService.authenticated;
    }

    ionViewDidLoad() {

        this.recipient = this.navParams.get('recipientUser');
        //pegar remetente
        this.userService.currentUser
            .first()//somente primeiro valor
            .subscribe((currentUser: User) => {
                this.sender = currentUser;
                this.pageTitle = this.recipient.name;
                this.chatsecret1 = this.ChatsecretService.getDeepChatsecret(this.sender.$key, this.recipient.$key);//pega soemnte um chat
                this.chatsecret2 = this.ChatsecretService.getDeepChatsecret(this.recipient.$key, this.sender.$key);
                if (this.recipient.photo) {//atualiza a foto
                    this.chatsecret1
                        .first()
                        .subscribe((Chatsecret: Chatsecret) => {
                            this.ChatsecretService.updatePhoto(this.chatsecret1, Chatsecret.photo, this.recipient.photo);
                        });
                }
                let doSubscription = () => {
                    this.secretmessages.subscribe((secretmessages: Message[]) => {
                        this.scrollToBottom();
                    });
                };
                this.secretmessages = this.messagesecretService
                    .getMessagesecret(this.sender.$key, this.recipient.$key);
                this.secretmessages
                    .first()
                    .subscribe((messages: Message[]) => {
                        if (messages.length === 0) {//se for igual a 0 nao existe msmg na lista
                            this.secretmessages = this.messagesecretService
                                .getMessagesecret(this.recipient.$key, this.sender.$key);//busca ao contrario
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
            this.messagesecretService.create(new Message(this.sender.$key, newMessage, currentTimestamp), this.secretmessages)
                .then(() => {
                    this.chatsecret1.update({ lastMessage: newMessage, timestamp: currentTimestamp });
                    this.chatsecret2.update({ lastMessage: newMessage, timestamp: currentTimestamp });
                });
        }
    }

    private scrollToBottom(duration?: number): void {
        setTimeout(() => {
            if (this.content._scroll) {
                this.content.scrollToBottom(duration || 300);
            }
        }, 50);
    }


    /*DAQUIE PRA BAIXA E A IMPLEMENTAÇÂ ODE UM CRONOMETRO
    {{timer.displayTime}} para mortar na view
    */
    ngOnInit() {
        this.initTimer();
    }

    hasFinished() {
        return this.timer.hasFinished;
    }

    initTimer() {
        if (!this.timeInSeconds) { this.timeInSeconds = 0; }

        this.timer = <CountdownTimer>{
            seconds: this.timeInSeconds,
            runTimer: false,
            hasStarted: false,
            hasFinished: false,
            secondsRemaining: this.timeInSeconds
        };

        this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
    }

    startTimer() {
        this.timer.hasStarted = true;
        this.timer.runTimer = true;
        this.timerTick();
    }

    pauseTimer() {
        this.timer.runTimer = false;
    }

    timerTick() {
        setTimeout(() => {
            if (!this.timer.runTimer) { return; }
            this.timer.secondsRemaining--;
            this.timer.displayTime = this.getSecondsAsDigitalClock(this.timer.secondsRemaining);
            if (this.timer.secondsRemaining > 0) {
                this.timerTick();
            } else {
                this.timer.hasFinished = true;
            }
        }, 1000);
    }

    getSecondsAsDigitalClock(inputSeconds: number) {
        const secNum = parseInt(inputSeconds.toString(), 10); // don't forget the second param
        const hours = Math.floor(secNum / 3600);
        const minutes = Math.floor((secNum - (hours * 3600)) / 60);
        const seconds = secNum - (hours * 3600) - (minutes * 60);
        let hoursString = '';
        let minutesString = '';
        let secondsString = '';
        hoursString = (hours < 10) ? '0' + hours : hours.toString();
        minutesString = (minutes < 10) ? '0' + minutes : minutes.toString();
        secondsString = (seconds < 10) ? '0' + seconds : seconds.toString();
        return hoursString + ':' + minutesString + ':' + secondsString;
    }

    //FIM DO CRONOMETRO



}
