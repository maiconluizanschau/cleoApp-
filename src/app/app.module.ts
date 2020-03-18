/* PLUGIN IONIC */
import { NgModule, ErrorHandler, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';
import { NativeStorage } from '@ionic-native/native-storage';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { ImagePicker } from '@ionic-native/image-picker';
//add compartilhamento social
import { SocialSharing } from '@ionic-native/social-sharing';
//push 
import { Push, PushObject, PushOptions } from '@ionic-native/push';
//notification
import { LocalNotifications } from '@ionic-native/local-notifications';

/* ANGULAR FIRE API*/
import { AngularFireModule, FirebaseAppConfig } from 'angularfire2';
import { AngularFireAuthModule, AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, AngularFireDatabaseModule } from "angularfire2/database";


/* PAGINAS */
import { IntroPage } from '../pages/intro/intro';
import { FlertPage } from '../pages/flert/flert';
import { ChatSecretoPage } from './../pages/chat-secreto/chat-secreto';
import { PerfilPage } from '../pages/perfil/perfil';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ConfigPage } from '../pages/config/config';
import { ChatPage } from '../pages/chat/chat';
import { ChatListPage } from '../pages/chat_list/chat_list';
import { ModalPage } from './../pages/modal/modal';


/* PROVIDERS */
import { SecretMessageService } from './../providers/secretmessage/secretmessage';
import { ChatSecretService } from './../providers/chatsecret/chatsecret';
import { MatchService } from './../providers/match/match';
import { UserService } from '../providers/user/user';
import { AuthService } from '../providers/auth/auth';
import { ChatService } from "../providers/chat/chat";
import { MessageService } from "../providers/message/message";
import { ConfiguracaoService } from '../providers/configuracao/configuracao';
import { CameraProvider } from '../providers/camera/camera';

/* COMPONENTES */
import { FlashCardComponent } from './../components/flash-card/flash-card.component';
import { MyApp } from './app.component';
import { NewMatchComponent } from './../components/new-match/new-match.component';
//import { UserInfoComponent } from './../components/user-info/user-info.component';
//import { UserMenuComponent } from './../components/user-menu/user-menu.component';
import { CustomLoggedHeaderComponent } from "../components/custom-logged-header/custom-logged-header.component";
import { MessageBoxComponent } from "../components/message-box/message-box.component";
import { CustomSecretChatComponent } from '../components/custom-secret-chat/custom-secret-chat';

import { CapitalizePipe } from './../pipes/capitalize.pipe';
import { SwingModule, SwingStackComponent } from 'angular2-swing';
import { LottieAnimationViewModule } from 'ng-lottie';
import { Autosize } from '../components/autosize/autosize';
import { Network } from '@ionic-native/network';

/* CONFIGURAÇÕES BANCO */
const firebaseAppConfig: FirebaseAppConfig = {
    apiKey: "AIzaSyDIzgG3f4rRiEBzCOK5yyMp95GBNsLuk6A",
    authDomain: "startup-cleo-6ab96.firebaseapp.com",
    databaseURL: "https://startup-cleo-6ab96.firebaseio.com",
    projectId: "startup-cleo-6ab96",
    storageBucket: "startup-cleo-6ab96.appspot.com",
    messagingSenderId: "407449858691"
};

@NgModule({
    declarations: [
        CapitalizePipe,
        MyApp,
        //PAGES//
        ConfigPage,
        ChatListPage,
        ChatPage,
        HomePage,
        LoginPage,
        FlertPage,
        PerfilPage,
        TabsPage,
        ChatSecretoPage,
        IntroPage,
        ModalPage,
        //COMPONENTS//
        CustomLoggedHeaderComponent,
        CustomSecretChatComponent,
        MessageBoxComponent,
        NewMatchComponent,
        //UserMenuComponent,
        //UserInfoComponent,
        FlashCardComponent,
        Autosize
    ],

    imports: [
        AngularFireModule.initializeApp(firebaseAppConfig),
        AngularFireAuthModule,
        AngularFireDatabaseModule,
        BrowserModule,
        HttpModule,
        IonicModule.forRoot(MyApp),
        SwingModule,
        LottieAnimationViewModule,
    ],

    bootstrap: [IonicApp],

    entryComponents: [
        ConfigPage,
        ChatListPage,
        ChatPage,
        HomePage,
        LoginPage,
        MyApp,
        FlertPage,
        FlertPage,
        PerfilPage,
        TabsPage,
        ChatSecretoPage,
        IntroPage,
        ModalPage,
    ],

    providers: [
        AuthService,
        AngularFireAuth,
        AngularFireDatabase,
        ChatService,
        ChatSecretService,
        SecretMessageService,
        Facebook,
        MessageService,
        NativeStorage,
        StatusBar,
        SplashScreen,
        UserService,
        MatchService,
        SwingStackComponent,
        ConfiguracaoService,
        Camera,
        ImagePicker,
        { provide: ErrorHandler, useClass: IonicErrorHandler },
        CameraProvider,
        SocialSharing,
        Push,
        Network,
        LocalNotifications,

    ]
})
export class AppModule { }
