import { HomePage } from './../home/home';
import { UserService } from './../../providers/user/user';
import { Component } from '@angular/core';
import { User } from '../../models/user.models';
import { ConfiguracaoService } from './../../providers/configuracao/configuracao';
import { NavController, ModalController, IonicPage, AlertController } from 'ionic-angular';
import { Platform } from 'ionic-angular/platform/platform';
import { ViewController } from 'ionic-angular/navigation/view-controller';
import { ModalPage } from '../modal/modal';
import { NavParams } from 'ionic-angular/navigation/nav-params';

@Component({
  selector: 'page-intro',
  templateUrl: 'intro.html',
})
export class IntroPage {

  toggleStatusH: boolean;
  toggleStatusM: boolean;
  toggleStatusHBuscado: boolean;
  toggleStatusMBuscado: boolean;
  toggleStatusAtivo: boolean;
  btnMulher: boolean = false;
  genero: string;



  constructor(
    public navCtrl: NavController,
    public userService: UserService,
    public configService: ConfiguracaoService,
    public modalCtrl: ModalController,
  ) {
    this.getGenero();
  }

  private getGenero() {
    this.userService.currentUser
      .first()
      .subscribe((currentUser: User) => {
        this.genero = currentUser.genero;
      });
  }

  public info(tipo: number) {
    this.navCtrl.push(ModalPage)
    //this.modalCtrl.create('ModalPage').present();
  }

  //DESABILITAR PAGINA DE INTRO
  private irHome() {
    console.log("IR HOMEE");
    this.configService.alterarIntroConfig();
    this.navCtrl.setRoot(HomePage);
  }

  //ENVIANDO A ESCOLHA TIPO HOMEM
  private Change_Toggle_Homens(bval: boolean) {
    let genero = "Mas";
    this.configService.gravaInteresse(bval, genero);
  }

  //ENVIANDO A ESCOLHA TIPO MULHER
  private Change_Toggle_Mulheres(bval: boolean) {
    let genero = "Fem";
    this.configService.gravaInteresse(bval, genero);
  }

  //ENVIANDO A ESCOLHA TIPO MULHER
  private Change_Toggle_Mulheres_Buscado(bval: boolean) {
    let genero = "Fem";
    this.configService.gravaInteresseSerBuscado(bval, genero);
  }

  //ENVIANDO A ESCOLHA TIPO HOMEM
  private Change_Toggle_Homens_Buscado(bval: boolean) {
    let genero = "Mas";
    this.configService.gravaInteresseSerBuscado(bval, genero);
  }


  //ENVIANDO A ESCOLHA TIPO ATIVO/PASSSIVO
  private Change_Toggle_AtivoPasssivo(atv: boolean) {
    if (this.genero == "Masculino" || this.genero == "Outros") {
      if (atv == true) {
        this.btnMulher = true;//desabilita botao mulher
        this.toggleStatusM = false;//desabilita toggle mulher
        this.configService.gravaAtivo(atv);
        let genero = "Fem";
        this.configService.gravaInteresse(false, genero);
      }
      else if (atv == false) {
        this.btnMulher = false;
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

}