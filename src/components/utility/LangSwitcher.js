import getLang from './getLang';

/**
 * Отвечает за выбор языка.
 * При выборе языка отличного от текущего, перенаправляет на страницу на выбранном языке.
 */
export default class LangSwitcher {
  constructor() {
    this.lang = getLang();
    this.langList = ['ru', 'en'];

    document
      .querySelector('.header__lang')
      .addEventListener('click', this.onHeaderLangClick.bind(this));
  }

  onHeaderLangClick(event) {
    const langBtn = event.target.closest('.lang-btn');
    if (!langBtn) return;

    const { lang } = langBtn.dataset;
    if (!lang) return;

    // Если язык нажатой кнопки соответствует текущему языку, то выходим.
    if (this.lang === lang) return;

    // Если полученный язык из атрибута кнопки не соответствует возможному языку из списка - выходим
    if (!this.langList.includes(lang)) return;

    this.lang = lang;
    localStorage.lang = this.lang;

    const url = new URL(window.location.href);
    url.pathname = this.lang;
    window.location.replace(url.href);
  }
}
