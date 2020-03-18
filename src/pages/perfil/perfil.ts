import { Component } from '@angular/core';
import { Loading, LoadingController, NavController, NavParams, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';

import { AngularFireDatabase } from "angularfire2/database";

import { User } from './../../models/user.models';
import { ChatListPage } from './../chat_list/chat_list';
import { ConfigPage } from '../config/config';

import { AuthService } from "../../providers/auth/auth";
import { UserService } from './../../providers/user/user';
import { CameraProvider } from './../../providers/camera/camera';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { Platform } from 'ionic-angular/platform/platform';


import { ImagePicker } from '@ionic-native/image-picker';


@Component({
    selector: 'page-perfil',
    templateUrl: 'perfil.html'
})
export class PerfilPage {
    currentUser: User;
    canEditSobre: boolean = false;
    loading: Loading;

    captureDataUrl: string;

    constructor(
        public alertCtrl: AlertController,
        public navCtrl: NavController,
        public navParams: NavParams,
        public db: AngularFireDatabase,
        public authService: AuthService,
        public loadingCtrl: LoadingController,
        public userService: UserService,
        public cameraProvider: CameraProvider,
        public actionsheetCtrl: ActionSheetController,
        public platform: Platform,
        private camera: Camera,
        private imagePicker: ImagePicker

    ) {

    }

    //VERIFICAÇÂO SE SER ESTA LOGADO
    ionViewCanEnter(): Promise<boolean> {
        this.loading = this.showLoading();
        this.userService.currentUser
            .subscribe((user: User) => {
                this.currentUser = user; //atribuir valores 
                this.loading.dismiss(); //tira o carregando...
            });
        return this.authService.authenticated;
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

    //EDITAR DADOS FORM SOBRE E APELIDO
    onSubmit(sobre: User): void {
        this.userService.edit({//chama edit do provider.user
            sobre: this.currentUser.sobre,
        }).then(() => {
            this.canEditSobre = false;
        });
    }

    //IR PAGINA CONFIGURAÇÕES
    onConfig(): void {
        this.navCtrl.push(ConfigPage);
    }

    //IR PAGINA DO CHAT
    chat(): void {
        this.navCtrl.push(ChatListPage);
    }

    //ESCOLHA DO TIPO DE BUSCA PARA FTO CAMERA OU GALERIA
    changePicture() {
        const actionsheet = this.actionsheetCtrl.create({
            title: 'Enviar uma foto',
            buttons: [
                {
                    text: 'Câmera',
                    icon: !this.platform.is('ios') ? 'camera' : null,
                    handler: () => {
                        this.capture();
                    }
                },
                {
                    text: !this.platform.is('ios') ? 'Galeria' : 'camera roll',
                    icon: !this.platform.is('ios') ? 'image' : null,
                    handler: () => {
                        this.imagePicker.hasReadPermission()
                            .then(hasPermission => {
                                if (hasPermission) {
                                    console.log("PEGAR IMAGEM!!");
                                    this.pegarImagem();
                                } else {
                                    this.solicitarPermissao();
                                }
                            }).catch(error => {
                                console.error('Erro ao verificar permissão', error);
                            });
                    }
                },
                {
                    text: 'Cancelar',
                    icon: !this.platform.is('ios') ? 'close' : null,
                    role: 'destructive',
                    handler: () => {
                        console.log('the user has cancelled the interaction.');
                    }
                }
            ]
        });
        return actionsheet.present();
    }

    //SOLICITA PERMISSAO DE ACESSO (NECESSARIO PARA ANDORID +6 E iOs +9)
    solicitarPermissao() {
        this.imagePicker.requestReadPermission()
            .then(hasPermission => {
                if (hasPermission) {
                    this.pegarImagem();
                } else {
                    console.error('Permissão negada');
                }
            }).catch(error => {
                console.error('Erro ao solicitar permissão', error);
            });
    }

    pegarImagem() { 
        console.log("ENTROU EM PEGAR IMAGEM FUNÇÃO!");
        this.imagePicker.getPictures({
            maximumImagesCount: 1, //Apenas uma imagem
            outputType: 1, //BASE 64
            width: 200, // LARGURA
            height: 200,// ALTURA
            quality: 100, //% QUALIDADE
        })
            .then(foto => { 
                console.log("PEGOU DADOS DA FOTO! " +foto.length);
                if (foto.length > 0) {
                    console.log("PEGAR IMAGEM 22");
                    this.currentUser.photo = 'data:image/png;base64,' + foto[0];
                    //this.fileToUpload = results[0];
                    this.cameraProvider
                        .uploadAndSave(
                        {
                            key: this.currentUser.$key,
                            fileToUpload: foto[0]
                        });

                }
            }) 
            .catch(error => {
                console.error('Erro ao recuperar a imagem', error);
            });
    }

    //ativa a camera
    capture() {
        const cameraOptions: CameraOptions = {
            quality: 50,
            destinationType: this.camera.DestinationType.DATA_URL,
            encodingType: this.camera.EncodingType.JPEG,
            mediaType: this.camera.MediaType.PICTURE,
            targetWidth: 600,
            targetHeight: 600
        };

        this.camera.getPicture(cameraOptions).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            console.log("PEGOU FOTO DA CÂMERA!");
            this.captureDataUrl = 'data:image/jpeg;base64,' + imageData;
            this.currentUser.photo = 'data:image/jpeg;base64,' + imageData;
                this.cameraProvider
                    .uploadAndSave(
                    {
                        key: this.currentUser.$key,
                        fileToUpload: imageData
                    });
        }, (err) => {
            // Handle error
        });
    }

}
