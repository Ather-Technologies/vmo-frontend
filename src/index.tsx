import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// const metadata = {
//   title: 'DEV SCSO',
//   description: 'By William Largent',
//   viewport: {
//     width: 'device-width',
//     height: 'device-height',
//     initialScale: 1,
//     maximumScale: 1,
//     userScalable: 'no'
//   }
// }

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
