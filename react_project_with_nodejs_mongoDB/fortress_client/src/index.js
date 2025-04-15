import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import reportWebVitals from './reportWebVitals';
import AppMain from './AppMain';
import EditPage from './Edit';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginRegister from './LoginRegister';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Router>
      <Routes>
        <Route path="/" element={<AppMain />} />
        <Route path="/:typeMode/:dataType/:dataId/" element={<EditPage />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
