import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/* PAGINAS */
import { FlertPage } from '../flert/flert';
import { PerfilPage } from '../perfil/perfil';
import { HomePage } from '../home/home';

/* PROVIDER */
import {AuthService} from "../../providers/auth/auth";
import { ChatService } from '../../providers/chat/chat';
import { Chatsecret } from '../../models/chatsecret.model';
import { User } from '../../models/user.models';
import { IntroPage } from '../intro/intro';
import { ConfiguracaoService } from '../../providers/configuracao/configuracao';
import { Config } from '../../models/config.model';
import { UserService } from '../../providers/user/user';

@Component({
    templateUrl: 'tabs.html'
})
export class TabsPage {

    tab1Root = HomePage;
    tab2Root = FlertPage;
    tab3Root = PerfilPage;


    constructor(
        public authService: AuthService,
        public navCtrl: NavController,
        public navParams: NavParams,
        public confService: ConfiguracaoService,
        public userService: UserService,

    ) {
        
    }

    ionViewCanEnter(): Promise<boolean> {
        return this.authService.authenticated;
    }

  

}
