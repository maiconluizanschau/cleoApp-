import { LoginPage } from './../login/login';
import { Config } from './../../models/config.model';
import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams, AlertController } from 'ionic-angular';
import { FirebaseObjectObservable, AngularFireDatabase } from "angularfire2/database";


import { AuthService } from "../../providers/auth/auth";
import { ConfiguracaoService } from './../../providers/configuracao/configuracao';
//compartilhamento 
import { SocialSharing } from '@ionic-native/social-sharing';
import { UserService } from '../../providers/user/user';
import { User } from '../../models/user.models';
import { ModalPage } from '../modal/modal';

@Component({
    selector: 'page-config',
    templateUrl: 'config.html'
})
export class ConfigPage {

    private listConfig: FirebaseObjectObservable<Config>;
    public rangeObject: any = { lower: 18, upper: 60 };


    toggleStatusH: boolean;
    toggleStatusM: boolean;
    toggleStatusHBuscado: boolean;
    toggleStatusMBuscado: boolean;
    toggleStatusAtivo: boolean;
    genero: string;
    btnMulher: boolean;
    loading: Loading;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public db: AngularFireDatabase,
        public authService: AuthService,
        public loadingCtrl: LoadingController,
        public ConfigService: ConfiguracaoService,
        public alertCtrl: AlertController,
        public userService: UserService,
        public configService: ConfiguracaoService,
        //convite
        private sharingVar: SocialSharing,


    ) {
        this.loading = this.showLoading();
        this.buscaPreConfiguracoes();
    }

    //PAGINA DE DESCRIÇAO DAS CONFIGURAÇÔES
    public info(tipo: number) {
        this.navCtrl.push(ModalPage)
    }

    //VERIFICAÇÂO SE SER ESTA LOGADO
    ionViewCanEnter(): Promise<boolean> {

        return this.authService.authenticated;
    }

    private faixa(range: any) {
        console.log("ENTRO: " + range.lower);
        this.ConfigService.gravaFaixa(range);
    }

    otherShare() {
        this.sharingVar.share("Parabéns, =D você acabou de ser convidado(a) para baixar ao aplicativo da CLEO", null/*Subject*/, null/*File*/, "cleoapp.com.br")
            .then(() => {
                //   alert("Success");
            },
                () => {
                    alert("Um Erro Ocorreu! Tente Mais tarde, se o problema persistir entre em contato com o suporte!")
                })

    }
    //fim convite

    //FAZER BUSCA DAS CONFIGURAÇÕES JÁ SALVAS NO BD
    private buscaPreConfiguracoes() {
        this.listConfig = this.ConfigService.buscaConfig();
        this.listConfig.first()
            .subscribe((config: Config) => {
                this.toggleStatusH = config.masculino;//envia para view
                this.toggleStatusM = config.feminino;
                this.toggleStatusAtivo = config.ativo
                this.rangeObject.lower = config.faixaInicio;
                this.rangeObject.upper = config.faixaFim;
                this.toggleStatusHBuscado = config.masculinoSerBuscado;
                this.toggleStatusMBuscado = config.femininoSerBuscado;
            });
        //BUSCA DO GENERO    
        this.userService.currentUser
            .first()
            .subscribe((currentUser: User) => {
                this.genero = currentUser.genero;
                if (this.genero == "Masculino" || this.genero == "Outros" && this.toggleStatusAtivo == true) {
                    this.btnMulher = true;
                    this.toggleStatusM = false;

                }
            });

        this.loading.dismiss(); //tira o carregando...
    }

    //ENVIANDO A ESCOLHA TIPO HOMEM
    private Change_Toggle_Homens(bval: boolean) {
        let genero = "Mas";
        this.ConfigService.gravaInteresse(bval, genero);
    }

    //ENVIANDO A ESCOLHA TIPO MULHER
    private Change_Toggle_Mulheres(bval: boolean) {
        let genero = "Fem";
        this.ConfigService.gravaInteresse(bval, genero);
    }

    //ENVIANDO A ESCOLHA TIPO MULHER
    private Change_Toggle_Mulheres_Buscado(bval: boolean) {
        let genero = "Fem";
        this.ConfigService.gravaInteresseSerBuscado(bval, genero);
    }

    //ENVIANDO A ESCOLHA TIPO HOMEM
    private Change_Toggle_Homens_Buscado(bval: boolean) {
        let genero = "Mas";
        this.ConfigService.gravaInteresseSerBuscado(bval, genero);
    }

    //ENVIANDO A ESCOLHA TIPO ATIVO/PASSSIVO
    private Change_Toggle_AtivoPasssivo(atv: boolean) {
        console.log("->" + atv);
        if (this.genero == "Masculino" || this.genero == "Outros") {
            if (atv == true) {
                this.btnMulher = true;//desabilita botao mulher
                this.toggleStatusM = false;//desabilita toggle mulher
                this.configService.gravaAtivo(atv);
                let genero = "Fem";
                this.configService.gravaInteresse(false, genero);
            }
            else if (atv == false) {
                this.btnMulher = false;//abilita botao mulher
                this.configService.gravaAtivo(atv);
            }
        } else if ("Feminino") {
            if (atv == true) {
                this.btnMulher = false;
                this.configService.gravaAtivo(atv);
            }
            else if (atv == false) {
                this.btnMulher = false;
                this.configService.gravaAtivo(atv);
            }
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

    //SAIR DO APP APAGANDO
    private logout() {
        const alert = this.alertCtrl.create({
            title: 'Logout',
            message: 'Você deseja sair do Aplicativo?',
            buttons: [
                {
                    text: 'NÂO',
                },
                {
                    text: 'SIM',
                    handler: () => {
                        this.authService.logout();
                        this.navCtrl.setRoot(LoginPage);
                    }
                }
            ]
        });
        alert.present();
    }

    //DELETAR CONTA
    private deleteConta() {
        const alert = this.alertCtrl.create({
            title: 'Confirmação',
            message: 'Você deseja deletar essa conta?',
            buttons: [
                {
                    text: 'NÃO',
                },
                {
                    text: 'SIM',
                    handler: () => {
                        this.authService.deletarConta(this.authService.getUid())
                        this.navCtrl.setRoot(LoginPage);
                    }
                }
            ]
        });
        alert.present();
    }

    private problema() {
        let prompt = this.alertCtrl.create({
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
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: 'Enviar',
                    handler: data => {
                        console.log('Saved clicked');
                    }
                }
            ]
        });
        prompt.present();

    }



}
