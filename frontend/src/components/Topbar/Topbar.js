import React, { useState } from 'react'
import './topBar.css'
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import ClassRoundedIcon from '@mui/icons-material/ClassRounded';
import { IconButton, Tooltip, Button, Dialog, DialogTitle, DialogContent, DialogActions, Typography, TextField, MenuItem } from '@mui/material';
import Cookies from 'js-cookie';
import Axios from 'axios'
import Swal from 'sweetalert2'



export const Topbar = () => {
  const user = JSON.parse(Cookies.get('user'))
  const [newClass, setNewClass] = useState({
    visible: false,
    nameClass: '',
    numberClass: '',
  })
  const [errors, setErrors] = useState(false)
  const [newUsr, setNewUsr] = useState({
    visible: false,
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    identification: '',
    phone: '',
    classNumber: '',
  })
  const [classesGroups, setClassesGroups] = useState([])



  React.useEffect(() => {
    if (!Cookies.get('user')) {
      window.location.href = '/login'
    }

  }, [])
  const closeSesion = () => {
    Cookies.remove('user');
    window.location.href = '/login'
  }


  const handleOpenCloseModal = async () => {
    if (!newUsr.visible) {
      const fichas = await Axios.post('http://localhost:3001/getClassesGroups', { idUser: user.id });
      setClassesGroups(fichas.data)
    }
    setNewUsr({ visible: !newUsr.visible })
  }


  const handleOpenCloseClassModal = async () => {
    setNewClass({ visible: !newClass.visible })
  }


  const handleChangeValue = (e) => {
    if (e.target.name === 'identification' || e.target.name === 'phone') {
      if (e.target.value.match(/^[0-9]*$/)) setNewUsr(prev => ({ ...prev, [e.target.name]: e.target.value }))
    } else {
      console.log('🚀 ~ file: Topbar.js ~ line 66 ~ handleChangeValue ~ e.target.value', e.target.value)
      setNewUsr(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

  }

  const handleChangeValueClass = (e) => {
    if (e.target.name === 'numberClass') {
      if (e.target.value.match(/^[0-9]*$/)) setNewClass(prev => ({ ...prev, [e.target.name]: e.target.value }))

    } else {
      setNewClass(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }



  const saveUsr = async () => {
    Swal.fire({
      allowOutsideClick: false,
      title: 'Creando nuevo usuario',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        // Axios.post(`${process.env.DEFAULT_ROUTE}/sing-in`)
        const data = {
          firstName: newUsr.firstName,
          lastName: newUsr.lastName,
          role: 'Aprendiz',
          email: newUsr.email,
          identification: newUsr.identification,
          phone: newUsr.phone,
          classs: newUsr.classNumber,
        }
        Axios.post('http://localhost:3001/sign-up', data).then((res) => {
          Swal.close()
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Usuario creado con exito',
            showConfirmButton: false,
            timer: 1500,
            didClose: () => {
              window.location.reload()
            }
          })
        }).catch(err => {
          Swal.close()
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Algo inesperado sucedió',
            showConfirmButton: false,
            timer: 1500
          })
        })
      },
    })
  }


  const saveClass = async () => {
    Swal.fire({
      allowOutsideClick: false,
      title: 'Creando nueva ficha',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        // Axios.post(`${process.env.DEFAULT_ROUTE}/sing-in`)
        const data = {
          nameClass: newClass.nameClass,
          numberClass: newClass.numberClass,
          idUser: user.id
        }
        Axios.post('http://localhost:3001/createClass', data).then((res) => {
          Swal.close()
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Ficha creada con exito',
            showConfirmButton: false,
            timer: 1500,
            didClose: () => {
              window.location.reload()
            }
          })
        }).catch(err => {
          Swal.close()
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Algo inesperado sucedió',
            showConfirmButton: false,
            timer: 1500
          })
        })
      },
    })
  }


  return (
    <header className="topBar">
      <span className="topBarLogo">
        SENA
      </span>
      <span className="welcomeTopbar">
        <p>Bienvenido {user?.role} </p>
        <b>{user?.firstName?.toUpperCase()} {user?.lastName?.toUpperCase()}</b>
      </span>
      <div className="topBarOptions">
        {user.role === 'Instructor' &&
          <>
            <IconButton onClick={handleOpenCloseModal}>
              <Tooltip title="Crear aprendiz" arrow>
                <PersonAddRoundedIcon sx={{ color: '#fff' }} />
              </Tooltip>
            </IconButton>
            <IconButton onClick={handleOpenCloseClassModal}>
              <Tooltip title="Crear ficha" arrow>
                <ClassRoundedIcon sx={{ color: '#fff' }} />
              </Tooltip>
            </IconButton>

          </>
        }
        <IconButton onClick={closeSesion}>
          <Tooltip title="Cerrar Sesión" arrow>
            <PowerSettingsNewIcon sx={{ color: '#fff' }} />
          </Tooltip>
        </IconButton>
      </div>
      {user.role === 'Instructor' &&
        <>
          <Dialog
            open={newUsr.visible}
            fullWidth="md"
          >
            <DialogTitle>
              <Typography variant="h5" color="primary">
                Crear nuevo aprendiz
              </Typography>
            </DialogTitle>
            <DialogContent>
              <TextField
                error={errors?.firstName}
                label="Nombres"
                name="firstName"
                margin="dense"
                size="small"
                value={newUsr.firstName}
                onChange={handleChangeValue}
                fullWidth
              />
              <TextField
                error={errors?.lastName}
                label="Apellidos"
                name="lastName"
                margin="dense"
                size="small"
                value={newUsr.lastName}
                onChange={handleChangeValue}
                fullWidth
              />
              <TextField
                error={errors?.identification}
                label="# de Identificación"
                name="identification"
                margin="dense"
                size="small"
                value={newUsr.identification || ''}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onChange={handleChangeValue}
                fullWidth
              />
              <TextField
                error={errors?.email}
                label="Correo"
                name="email"
                margin="dense"
                size="small"
                value={newUsr.email}
                onChange={handleChangeValue}
                fullWidth
              />
              <TextField
                error={errors?.phone}
                label="Teléfono"
                name="phone"
                margin="dense"
                size="small"
                value={newUsr.phone || ''}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onChange={handleChangeValue}
                fullWidth
              />
              <TextField
                error={errors?.classNumber}
                label="Número de ficha"
                name="classNumber"
                margin="dense"
                size="small"
                value={newUsr.classNumber}
                select
                onChange={handleChangeValue}
                fullWidth
              >
                {classesGroups.map((item) => (
                  <MenuItem value={item.id}>{item.nameClass} - {item.numberClass}</MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOpenCloseModal} color="error" variant="contained" size="small">
                Cancelar
              </Button>
              <Button onClick={saveUsr} color="primary" variant="contained" size="small"
                disabled={
                  !newUsr.firstName ||
                    !newUsr.lastName ||
                    !newUsr.phone ||
                    !newUsr.identification ||
                    !newUsr.email ||
                    !newUsr.classNumber
                    ? true : false
                }
              >
                Crear Usuario
              </Button>
            </DialogActions>
          </Dialog>

          {/* MODAL PARA CREAR FICHAS */}
          <Dialog
            open={newClass.visible}
            fullWidth="md"
          >
            <DialogTitle>
              <Typography variant="h5" color="primary">
                Crear nueva ficha
              </Typography>
            </DialogTitle>
            <DialogContent>
              <TextField
                error={errors?.nameClass}
                label="Nombre de la ficha"
                name="nameClass"
                margin="dense"
                size="small"
                value={newClass.nameClass}
                onChange={handleChangeValueClass}
                fullWidth
              />
              <TextField
                error={errors?.numberClass}
                label="Número de la ficha"
                name="numberClass"
                margin="dense"
                size="small"
                value={newClass.numberClass || ''}
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                onChange={handleChangeValueClass}
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleOpenCloseClassModal} color="error" variant="contained" size="small">
                Cancelar
              </Button>
              <Button onClick={saveClass} color="primary" variant="contained" size="small"
                disabled={
                  !newClass.nameClass ||
                    !newClass.numberClass
                    ? true : false
                }
              >
                Crear ficha
              </Button>
            </DialogActions>
          </Dialog>
        </>
      }
    </header>
  )
}
