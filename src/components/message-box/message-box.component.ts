import { Component, Input } from '@angular/core';

import { Message } from './../../models/message.model';

@Component({
  selector: 'message-box',
  templateUrl: 'message-box.component.html',
  host: {//trazer box de quem envia na direita e recebido na direita
    '[style.justify-content]': '((!isFromSender) ? "flex-start" : "flex-end")',//alinha box text
    '[style.text-align]': '((!isFromSender) ? "right" : "right")'//alinha texto
  }
})
export class MessageBoxComponent {

  // input é pra deixar disponivel para passar valror do template
  @Input() message: Message;//mensagem em si
  @Input() isFromSender: boolean;//se é do remetente true

  constructor() {}

}
