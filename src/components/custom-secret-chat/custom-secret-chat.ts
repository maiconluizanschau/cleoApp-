import { Component, Input } from '@angular/core';

import { AlertController, App, MenuController } from 'ionic-angular';

import { AuthService } from "../../providers/auth/auth";
import { BaseComponent } from "../base.component";
import { User } from './../../models/user.models';

@Component({
  selector: 'custom-secret-chat',
  templateUrl: 'custom-secret-chat.html'
})
export class CustomSecretChatComponent extends BaseComponent {

  @Input() title: string;
  @Input() user: User;

  constructor(
    public alertCtrl: AlertController,
    public authService: AuthService,
    public app: App,
    public menuCtrl: MenuController
  ) {
    super(alertCtrl, authService, app, menuCtrl);
  }


}
