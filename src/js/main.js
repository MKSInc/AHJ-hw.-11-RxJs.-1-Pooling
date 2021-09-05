/* eslint-disable no-unused-vars */
import Pooling from '../components/pooling/Pooling';
import LangSwitcher from '../components/utility/LangSwitcher';

export default function main() {
  const langSwitcher = new LangSwitcher();
  const pooling = new Pooling('.content');
  pooling.getMessages();
}
