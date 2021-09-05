export default function getLang() {
  const { lang } = localStorage;
  return lang || 'ru';
}
