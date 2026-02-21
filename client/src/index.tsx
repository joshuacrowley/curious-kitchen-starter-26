import './index.css';
import {getUniqueId} from 'tinybase';
import ReactDOM from 'react-dom/client';
import {App} from './App';

if (location.pathname === '/') {
  location.assign('/' + getUniqueId());
}

addEventListener('load', () => {
  ReactDOM.createRoot(document.getElementById('app')!).render(<App />);
});
