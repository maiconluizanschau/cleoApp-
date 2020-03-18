import { ChatPage } from './../../pages/chat/chat';
import { ChatService } from './../../providers/chat/chat';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { UserService } from './../../providers/user/user';
import { HomePage } from './../../pages/home/home';
import { ChatListPage } from './../../pages/chat_list/chat_list';
import { NavController } from 'ionic-angular';
import { Component, Input } from '@angular/core';
import { User } from '../../models/user.models';
import { Chat } from './../../models/chat.model';
import { AngularFireDatabase } from "angularfire2/database";

import { AuthService } from "../../providers/auth/auth";

import { ImagePicker } from '@ionic-native/image-picker';
@Component({
  selector: 'new-match',
  templateUrl: 'new-match.component.html'
})
export class NewMatchComponent {

  @Input() userLogado: User; //User que está logado 
  @Input() userMatch: User;  //User que foi dado o match
  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public db: AngularFireDatabase,
    public authService: AuthService,
    private imagePicker: ImagePicker,
    public viewCtrl: ViewController,
    public chatService: ChatService,
  ) {
    console.log('Novo Match');
  }


  chat(recipientUser: User): void {  //Envia para o chat com o novo  match
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
  //Volta da tela de novo match para a home
  private home(): void {
    this.navCtrl.push(HomePage);
  }

}