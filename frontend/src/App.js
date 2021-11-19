import React from 'react';
import './App.css';
import { Login, Page, Register, Dashboard } from './components'
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from 'js-cookie'
function App() {
  const user = Cookies.get('user') ? JSON.parse(Cookies.get('user')) : false

  const RequireLogin = ({ children }) => {
    console.log('🚀 ~ file: App.js ~ line 11 ~ RequireLogin ~ children', children)
    console.log('Cookies.get(identification):', Cookies.get('identification'));
    if (!Cookies.get('user')) {
      return <Navigate to="/login" />
    }

    return <Page>{children}</Page>

  }
  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="dashboard" element={
          <RequireLogin>
            <Dashboard user={user} />
          </RequireLogin>
        } />
      </Routes>
      {/* <Topbar />
       <div className="container">
        <h2>
          Bienvenido {usuario.name}
        </h2>


      </div> */}
    </div>
  );
}

export default App;
