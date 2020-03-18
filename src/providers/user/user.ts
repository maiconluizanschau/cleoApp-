import { MatchService } from './../match/match';
import { AuthService } from './../auth/auth';
import { FirebaseApp } from 'angularfire2';
import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import { Facebook } from '@ionic-native/facebook';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';
import 'firebase/storage';

import { AngularFireAuth } from "angularfire2/auth";

import { User } from '../../models/user.models';
import { BaseService } from "../base/base";
import { Config } from '../../models/config.model';
import { Voto } from '../../models/voto.model';

@Injectable()
export class UserService extends BaseService {

    //array user
    users: FirebaseListObservable<User[]>;
    usersSecrets: FirebaseListObservable<User[]>;

    todos: User[];
    currentUser: FirebaseObjectObservable<User>;
    uid: string;
    usV = [];


    constructor(
        public http: Http,
        private facebook: Facebook,
        public db: AngularFireDatabase,
        public afAuth: AngularFireAuth,
        public firebaseApp: FirebaseApp,
        public authService: AuthService,
    ) {
        super();//EXTENDS BaseService -> Trata erros
        //lista de usuarios 
        this.listenAuthState();
    }

    //BUSCAR UM UNICO USER
    public getUser(key: string): FirebaseObjectObservable<User> {
        return <FirebaseObjectObservable<User>>this.db.object(`/users/` + key);
    }

    //BUSCAR TODOS OS USERS excuindo meu id
    public getUsersAll(uidToExclude: string): FirebaseListObservable<any> {
        return <FirebaseListObservable<User[]>>this.db.list(`/users`)
            .map((users: User[]) => {
                return users.filter((user: User) => user.$key !== uidToExclude);
            });
    }

    //FILTRO POR GENERO IDADE e REMOVENDO MEu ID
    public filtro(config: Config): FirebaseListObservable<User[]> {
        this.users = <FirebaseListObservable<User[]>>this.db.list(`/users`, {
            query: {
                orderByChild: 'idade',
                startAt: config.faixaInicio,
                endAt: config.faixaFim
            }
        }).map((users: User[]) => {
            return users.filter((user: User) => user.$key !== this.uid);
        }).catch(this.handleObservableError);

        if (config.masculino === true && config.feminino === true) {
            console.log("Masculino = true && FEminino true");
            return <FirebaseListObservable<User[]>>this.users
                .catch(this.handleObservableError);
        }
        else if (config.masculino) {
            console.log("Masculino = true");
            
            return <FirebaseListObservable<User[]>>this.users
                .map((users: User[]) => {
                    return users.filter((user: User) => user.genero !== "Feminino");
                })
                .catch(this.handleObservableError);
        } else if (config.feminino) {
            console.log("feminino TRUE");
            return <FirebaseListObservable<User[]>>this.users
                .map((users: User[]) => {
                    return users.filter((user: User) => user.genero !== "Masculino");
                })
                .catch(this.handleObservableError);
        } else {
            console.log("ELSE");
            return <FirebaseListObservable<User[]>>this.users
                .map((users: User[]) => {
                    return users.filter((user: User) => user.genero !== "Feminino" && user.genero !== "Masculino");
                })
                .catch(this.handleObservableError);
        }
    }

    //LISTAR USUARIO LOGADO
    private listenAuthState(): void {
        this.afAuth
            .authState
            .subscribe((authUser: firebase.User) => {
                if (authUser) {//se houver usuario logado buscar ele no BD
                    this.uid = authUser.uid;
                    this.currentUser = this.db.object(`/users/${authUser.uid}`);//busa um user
                    //this.setUsers(authUser.uid);//exlcuir user que esta logado passadno id
                }
            });
    }

    //CRIA NOVO USUARIO GRAVANDO NO BANCO
    public create(): firebase.Promise<void> { 
        return this.facebook.getLoginStatus()//verifica status do user
            .then(response => { 
                if (response.status == 'connected') { 
                    //FAZ A BUSCA DOS DADOS QUE APP PRECISA
                    this.facebook.api('/' + response.authResponse.userID +
                        '?fields=first_name,last_name,email,gender,location,birthday,picture.width(999).height(999), likes',
                        [
                            'public_profile'
                        ]) 
                        .then((response) => {
                            ///////////////////// PEGAR DADOS ////////////////////////
                            //DADOS ->ID; NOME; EMAIL; GENERO; SOBRE; CIDADE; DATA NASCIMENTO; FOTO;
                            let lerJson = JSON.parse(JSON.stringify(response));
                            const _email = lerJson.email;
                            this.userExists(_email)
                                .first()
                                .subscribe((userExists: boolean) => {
                                    if (!userExists) {//USUARIO NAO EXISTE
                                        console.log("USUARIO NAO EXISTE");

                                        //DADOS
                                        //const _idUser = lerJson.id;
                                        const _nome = lerJson.first_name;
                                        const _last_nome = lerJson.last_name;
                                        const _dataNasc = lerJson.birthday;
                                        const _sobre = lerJson.about;
                                        const _local = lerJson.location.name;
                                        const _foto = lerJson.picture.data.url;
                                        const _genero = this.traduzSexo(lerJson.gender);
                                        const _idade = this.calculoIdade(_dataNasc);

                                        this.afAuth
                                            .authState
                                            .subscribe((authUser: firebase.User) => {
                                                if (authUser) {//se houver usuario logado buscar ele no BD
                                                    var database = firebase.database();
                                                    //GRAVA DADOS FIREBASE COM ID DA AUTENTICAÇÂO
                                                    database.ref('users/' + authUser.uid)
                                                        .set({
                                                            key: authUser.uid,
                                                            name: _nome,
                                                            sobrenome: _last_nome,
                                                            email: _email,
                                                            genero: _genero,
                                                            sobre: (_sobre || ""),//senao possuir descrição deixa em branco
                                                            idade: _idade,
                                                            local: _local,
                                                            dataNasc: _dataNasc,
                                                            photo: _foto
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
                                    } else {
                                        console.log("USUARIO JA EXISTE");
                                    }
                                });
                        })
                        .catch((error) => {
                            console.log("ERRO SEM CONEXAO" + error);
                        });
                }
                else {
                    console.log('ERRO: USER NAO ESTA CONECTADO');
                }
            })
            .catch((error) => {
                console.log("ERRO STATUS USER:");
            });
    }

    //VERIFICAÇÃO SE O USUARIO JÁ EXISTE
    public userExists(email): Observable<boolean> {
        //console.log("email" + email);
        return this.db.list(`/users`, {
            //filtros query list angular2
            query: {
                orderByChild: 'email',//compara o campo no firebase
                equalTo: email //recebe var para comparar
            }
            //array de usuarios se for maior que 0 ai ja existe senao esta ok para cadastrar
        }).map((users: User[]) => {
            return users.length > 0;
        }).catch(this.handleObservableError);
    }

    //FAZ TRADUÇÃO DO SEXO PARA ARMAZENAR NO BANCO
    public traduzSexo(sex: string): string {
        if (sex == "male") {
            sex = "Masculino";
        } else if (sex == "female") {
            sex = "Feminino";
        } else {
            sex = "Outros";
        }
        return sex;
    }

    //FAZ CALCULO DA IDADE PARA ARMAZENAR NO BANCO ---> PROBLEMA REVISAR CALCULO <----
    public calculoIdade(data_nasc: string): number {
        var birthday = +new Date(data_nasc);
        return ~~((Date.now() - birthday) / (31557600000));

    }

    //BUSCA DE UM UNICO USUARIO COM ID NO BANCO
    public get(userId: string): FirebaseObjectObservable<User> {
        return <FirebaseObjectObservable<User>>this.db.object(`/users/${userId}`)
            .catch(this.handleObservableError);
    }

    //EDITAR PERFIL "SOBRE"
    public edit(user: { sobre: string }): firebase.Promise<void> {
        return this.currentUser
            .update(user)
            .catch(this.handlePromiseError);
    }

    //EDITAR FOTO PERFIL
    public editPhoto(user: { photo: string }): firebase.Promise<void> {
        return this.currentUser
            .update(user)
            .catch(this.handlePromiseError);
    }

    //UPLOAD DE FOTOS
    public uploadPhoto(file: File, userId: string): firebase.storage.UploadTask {
        console.log("Entrou em UPLOAD DE FOTOS");
        return this.firebaseApp
            .storage()
            .ref()
            .child(`/users/${userId}`)
            .put(file);
    }
}
