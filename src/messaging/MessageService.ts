import EventEmitter from 'eventemitter3';

import type { Message, MessageType } from './Message';

export class MessageService extends EventEmitter {
  static readonly instance = new MessageService();

  constructor() {
    super();
    if (supportRuntimeMessage()) {
      chrome.runtime.onMessage.addListener(this._handleMessage);
    } else {
      window.addEventListener('message', (e: MessageEvent) => {
        if (e.data) {
          this._handleMessage(e.data);
        }
      });
    }
  }

  subscribe(messageType: MessageType, callback: (message: Message) => void) {
    this.on(messageType, callback);
  }

  publish(message: Message | MessageType) {
    const msg: Message =
      typeof message == 'string' ? { type: message } : message;
    if (supportRuntimeMessage()) {
      chrome.runtime.sendMessage(msg).catch();
    } else {
      window.postMessage(msg, '*');
    }
  }

  private _handleMessage = (message: Message) => {
    if (message && typeof message === 'object' && message.type) {
      if (message.type.startsWith('photomaniac.')) {
        this.emit(message.type, message);
      }
    }
  };
}

function supportRuntimeMessage() {
  return chrome.runtime?.sendMessage;
}
