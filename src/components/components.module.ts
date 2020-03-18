import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CustomSecretChatComponent } from './custom-secret-chat/custom-secret-chat';
import { FlashCardComponent } from './flash-card/flash-card.component';
import { Autosize } from './autosize/autosize';
import { MessageBoxComponent } from './message-box/message-box.component';
import { IonicModule } from 'ionic-angular';
import { CustomLoggedHeaderComponent } from './custom-logged-header/custom-logged-header.component';


export const components = [
    CustomSecretChatComponent,
    FlashCardComponent,
    Autosize,
    MessageBoxComponent,
    CustomLoggedHeaderComponent
];

@NgModule({
    declarations: [components],
    imports: [IonicModule],
    exports: [components,],
    schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class ComponentsModule { }
