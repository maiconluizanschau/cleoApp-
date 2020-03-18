import { FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database';
import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { BaseService } from "../base/base";
import { AuthService } from './../auth/auth';
import { Config } from './../../models/config.model';


@Injectable()
export class ConfiguracaoService extends BaseService {

  //configUser: FirebaseObjectObservable<Config>;
  idUser: string;

  constructor(
    public http: Http,
    public db: AngularFireDatabase,
    public afAuth: AngularFireAuth,
    public authService: AuthService,

  ) {
    super();//EXTENDS BaseService -> Trata erros   
    this.idUser = this.authService.getUid();
  }

  //ALTERAR PARA REMOVER A PAGE INTRO
  public alterarIntroConfig() {
    this.db.database.ref(`/config/${this.idUser}`)
      .update(
      {
        intro: false,
      }
      )

  }

  //BUSCA DOS INTERRESSES DO USER
  public buscaConfig(): FirebaseObjectObservable<Config> {
    return <FirebaseObjectObservable<Config>>this.db.object(`/config/${this.idUser}`)
      .catch(this.handleObservableError);

  }

  //FAZ GRAVAÇÃO DS INTERRESES DO USER
  public gravaInteresse(val: boolean, genero: string) {
    let refeConfig = this.db.database.ref(`/config/${this.idUser}`);
    if (genero == "Mas") {
      if (val === true) {
        console.log("H true");
        refeConfig.update(
          {
            masculino: true,
          }
        )
      }
      else {
        console.log("H false");
        refeConfig.update(
          {
            masculino: false,
          }
        )
      }
    }
    else if (genero == "Fem") {
      if (val === true) {
        console.log("F true");
        refeConfig.update(
          {
            feminino: true,
          }
        )
      }
      else {
        console.log("F false");
        refeConfig.update(
          {
            feminino: false,
          }
        )
      }
    }
  }

    //FAZ GRAVAÇÃO DS INTERRESES DO USER
    public gravaInteresseSerBuscado(val: boolean, genero: string) {
      let refeConfig = this.db.database.ref(`/config/${this.idUser}`);
      if (genero == "Mas") {
        if (val === true) {
          refeConfig.update(
            {
              masculinoSerBuscado: true,
            }
          )
        }
        else {
          refeConfig.update(
            {
              masculinoSerBuscado: false,
            }
          )
        }
      }
      else if (genero == "Fem") {
        if (val === true) {
          refeConfig.update(
            {
              femininoSerBuscado: true,
            }
          )
        }
        else {
          refeConfig.update(
            {
              femininoSerBuscado: false,
            }
          )
        }
      }
    }

  //FAZ GRAVAÇÃO DA FAIXA INTERRESSE DO USER
  public gravaFaixa(range: any) {
    console.log(range);
    let refeConfig = this.db.database.ref(`/config/${this.idUser}`);
    refeConfig.update(
      {
        faixaInicio: range.lower,
        faixaFim: range.upper,
      }
    )
  }

  //FAZ GRAVAÇÃO DO ATIVO E PASSIVO
  public gravaAtivo(atv: Boolean) {
  this.db.database.ref(`/config/${this.idUser}`)
    .update(
      {
        ativo: atv
      }
    )
  }

}
