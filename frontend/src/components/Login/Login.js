import React, { useState, useEffect } from 'react'
import './login.css'
import { Button, TextField, Typography } from '@mui/material';
import Axios from 'axios';
import Swal from 'sweetalert2'

import Cookies from 'js-cookie';
export const Login = () => {
  const [showPass, setShowPas] = useState(false)
  const [email, setEmail] = useState(false)
  const [pass, setPass] = useState(false)

  useEffect(() => {
    if (Cookies.get('user')) {
      window.location.href = '/dashboard'
    }

  }, [])
  const handleLogin = () => {
    Swal.fire({
      allowOutsideClick: false,
      title: 'Verificando usuario',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        console.log('process.env:', process.env);
        // Axios.post(`${process.env.DEFAULT_ROUTE}/sing-in`)
        Axios.post('http://localhost:3001/sign-in', { email, pass }).then((res) => {
          Cookies.set('user', JSON.stringify({
            ...res.data
          }))
          console.log("a");
          window.location.href = '/dashboard'
        }).catch(err => {
          Swal.close()
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Correo y/o contraseña incorrecta',
            showConfirmButton: false,
            timer: 1500
          })
        })
      },
    })
  }
  return (
    <div className="rootlogin">

      <div className="formLogin">
        <div className="formTitle">
          <Typography variant="h4">CRUD GUÍAS</Typography>
        </div>
        <TextField
          fullWidth
          placeholder="Correo"
          label="Correo"
          size="small"
          margin="none"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <TextField
          fullWidth
          placeholder="Contraseña"
          label="Contraseña"
          size="small"
          margin="none"
          type={showPass ? 'text' : 'password'}
          onChange={(e) => setPass(e.target.value)}
        />
        <div style={{ display: 'flex', justifyContent: 'end', width: '100%' }}>
          <Button
            sx={{ marginTop: 1, padding: '2px 5px' }}
            color="inherit"
            size="small"
            onClick={() => setShowPas(!showPass)}
          >
            {showPass ? 'Ocultar' : 'Mostrar'} Contraseña
          </Button>
        </div>
        <br />
        <Button
          variant="contained"
          color="secondary"
          size="small"
          className="btnLogin"
          onClick={handleLogin}
        >
          Iniciar sesión
        </Button>
      </div>
    </div>
  )
}
