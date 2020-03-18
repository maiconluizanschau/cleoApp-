import { OnInit } from "@angular/core";

import { App, AlertController, MenuController, NavController } from 'ionic-angular';

import { AuthService } from './../providers/auth/auth';
import { LoginPage } from './../pages/login/login';

export abstract class BaseComponent implements OnInit {

    protected navCtrl: NavController;

    constructor(
        public alertCtrl: AlertController,
        public authService: AuthService,
        public app: App,
        public menuCtrl: MenuController
    ) {}
   //usar dentro de um menu para manipular ver se esta logado e se tem permisao de acesso
    ngOnInit(): void {
        this.navCtrl = this.app.getActiveNavs()[0];
    }
   //CASO USAURIO DESEJA SAIR MOSTRAR POP DE CONFRIMAÇÃO E JOGAR PARA PAGINA DE LOGIN
    onLogout(): void {
        this.alertCtrl.create({
            message: 'Deseja realmente sair?',
            buttons: [
                {
                    text: 'Sim',
                    handler: () => {
                        this.authService.logout()
                            .then(() => {
                                //retornar para a pagina de login
                                this.navCtrl.setRoot(LoginPage);
                                this.menuCtrl.enable(false, 'user-menu');
                            });
                    }
                },
                {
                    text: 'Não'
                }
            ]
            //mostrar o alert
        }).present();
    }

}