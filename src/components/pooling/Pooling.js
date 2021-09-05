import { interval, of } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { map, switchMap, catchError } from 'rxjs/operators';
import poolingHTML from './pooling.html';
import './pooling.css';
import getLang from '../utility/getLang';
import Message from './Message/Message';
import links from '../utility/links';

export default class Pooling {
  constructor(parent) {
    this.element = null;
    this.parentEl = null;
    this.els = {
      header: null,
      msgList: null,
    };

    this.messages = [];

    this.init(parent);
  }

  init(parent) {
    let tempWrapEl = document.createElement('div');
    tempWrapEl.insertAdjacentHTML('afterbegin', poolingHTML);

    this.element = tempWrapEl.querySelector('.pooling');
    tempWrapEl = null;

    this.els.header = this.element.querySelector('.pooling__header');
    this.els.msgList = this.element.querySelector('.list-pooling');

    this.setContent();

    if (parent) this.bindToDOM(parent);
  }

  // Отображение текста компонента на соответствующем языке.
  setContent() {
    const lang = getLang();

    if (lang === 'ru') return;
    if (lang === 'en') {
      this.els.header.textContent = 'Incoming';
    }
  }

  bindToDOM(parent) {
    this.parentEl = typeof parent === 'string' ? document.querySelector(parent) : parent;
    if (this.parentEl) this.parentEl.append(this.element);
  }

  getMessages() {
    const messages$ = interval(1000)
      .pipe(
        // Вычисляем id последнего полученного сообщения, если оно есть.
        map(() => (this.messages.length === 0 ? '' : this.messages[this.messages.length - 1].id)),
        switchMap((id) => ajax.getJSON(`${links.root}messages/unread/${id}`)
          .pipe(
            // В случае ошибки во время запроса, возвращаем в поток 'ответ' без сообщений.
            catchError(() => of({
              status: 'ok',
              timestamp: Date.now(),
              messages: [],
            })),
          )),
      )
      .subscribe({
        next: (response) => {
          // Если сервер перестал генерировать сообщения и все сообщения переданы.
          if (response.status === 'finish') messages$.unsubscribe();

          this.messages.push(...response.messages);
          this.showMessages(response.messages);
        },
        // eslint-disable-next-line no-console
        error: (error) => console.log('consumer error', error),
      });
  }

  showMessages(messages) {
    const messagesEls = messages
      .map((msgData) => new Message(msgData).element)
      .reverse();

    this.els.msgList.prepend(...messagesEls);
  }
}
