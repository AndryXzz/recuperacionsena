import { Box, Grid, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Table, Paper, Button, Dialog, DialogActions, DialogTitle, DialogContent, TextField, FormControl, FormLabel, Radio, RadioGroup, FormControlLabel, MenuItem, Tooltip, IconButton } from '@mui/material'
import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { UploaderFile } from '../index'
import Axios from 'axios'
import Swal from 'sweetalert2'
import CreateRoundedIcon from '@mui/icons-material/CreateRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import PictureAsPdfRoundedIcon from '@mui/icons-material/PictureAsPdfRounded';

export const Dashboard = ({ user }) => {
  const [classesGroups, setClassesGroups] = useState([])
  const [usrs, setUsrs] = useState([])
  const [assignedTo, setAssignedTo] = useState('allClass')
  const [guides, setGuides] = useState([])
  const [file, setFile] = React.useState({ evidence: null })
  const [previewPDF, setPreviewPDF] = React.useState({ visible: false, route: '' })



  useEffect(() => {
    if (assignedTo === 'allClass') {
      setNewGuide(prev => ({ ...prev, usr: '' }))
      setUsrs([])
    } else {
      Axios.post('http://localhost:3001/getLearners').then(res => {
        setUsrs(res.data)
      })
      setNewGuide(prev => ({ ...prev, classNumber: '' }))
    }
  }, [assignedTo])
  useEffect(() => {
    const getData = async () => {
      const fichas = await Axios.post('http://localhost:3001/getClassesGroups', { idUser: user.id });
      setClassesGroups(fichas.data);
      let guias
      if (user.role === 'Instructor') {
        guias = await Axios.post('http://localhost:3001/getGuidesPerInstructor', { idUser: user.id });
      } else {
        guias = await Axios.post('http://localhost:3001/getGuidesPerLearner', { idUser: user.id });
      }
      setGuides(guias.data)
    };
    getData()
  }, [user])

  const [newGuide, setNewGuide] = useState({
    visible: false,
    name: '',
    description: '',
    themes: '',
    duration: '',
    usr: '',
    classNumber: '',
  })
  const handleOpenCloseNewGuide = () => {
    setNewGuide({ visible: !newGuide.visible })
  }

  const handleChangeValueGuide = (e) => {
    if (e.target.name === 'duration') {
      if (e.target.value.match(/^[0-9]*$/)) setNewGuide(prev => ({ ...prev, [e.target.name]: e.target.value }))

    } else {
      setNewGuide(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }
  }

  const saveGuide = async () => {
    Swal.fire({
      allowOutsideClick: false,
      title: 'Creando nueva guía',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        // Axios.post(`${process.env.DEFAULT_ROUTE}/sing-in`)
        const data = {
          name: newGuide.name,
          description: newGuide.description,
          themes: newGuide.themes,
          duration: newGuide.duration,
          guideDoc: file,
          idUserAssigned: newGuide.usr || user.id,
          idClass: newGuide.classNumber || usrs.find(item => item.id === newGuide.usr)?.idClass,
          idInstructor: user.id,
        }
        Axios.post('http://localhost:3001/createGUIDE', data).then((res) => {
          Swal.close()
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Guía creada con exito',
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

  const editGuide = async () => {
    Swal.fire({
      allowOutsideClick: false,
      title: 'Editando la guía',
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading()
        // Axios.post(`${process.env.DEFAULT_ROUTE}/sing-in`)
        const data = {
          name: newGuide.name,
          description: newGuide.description,
          themes: newGuide.themes,
          duration: newGuide.duration,
          guideDoc: file,
          idUserAssigned: newGuide.usr || user.id,
          idClass: newGuide.classNumber || usrs.find(item => item.id === newGuide.usr)?.idClass,
          idInstructor: user.id,
          lastFile: newGuide.lastFile,
          idGuide: newGuide.idGuide
        }
        Axios.post('http://localhost:3001/editGUIDE', data).then((res) => {
          Swal.close()
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: 'Guía editada con exito',
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


  const handlePreviewPDF = (nameFile) => {
    setPreviewPDF({ visible: true, route: nameFile })
  }

  const handleEditGuide = (data) => {
    console.log('🚀 ~ file: Dashboard.js ~ line 114 ~ handleEditGuide ~ data', data)
    setAssignedTo(data.selected.match('Toda la ficha') ? 'allClass' : 'usr')
    setFile({ evidence: true, nameFile: data.guideDoc })
    setNewGuide({
      visible: true,
      name: data.name,
      description: data.description,
      themes: data.themes,
      duration: data.duration,
      usr: data.selected.match('Toda la ficha') === null ? data.id : '',
      classNumber: data.selected.match('Toda la ficha') ? data.idClass : '',
      edit: true,
      idGuide: data.idGuide,
      lastFile: data.guideDoc
    })

  }

  const handleDeleteGuide = (idGuide, nameFile) => {


    Swal.fire({
      title: '¿Seguro desea eliminar la guía?',
      text: "¡Esta acción no se podrá deshacer!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: ' Sí, ¡eliminala!',
      cancelButtonText: 'Cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          allowOutsideClick: false,
          title: 'Eliminando la guía',
          timerProgressBar: true,
          didOpen: () => {
            Swal.showLoading()

            Axios.post('http://localhost:3001/deleteGUIDE', { idGuide, nameFile }).then((res) => {
              Swal.close()
              Swal.fire({
                position: 'top-end',
                icon: 'success',
                title: 'Guía eliminada con exito',
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
    })
  }


  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={user.role === 'Instructor' ? 7 : 12}>
        <Box className="cardContainerDash">
          <Typography variant="h5" sx={{ textAlign: 'center' }}>
            Guías de aprendizaje
          </Typography>
          <hr />
          <Box sx={{ textAlign: 'end', margin: '10px 0px' }}>
            {user.role === 'Instructor' &&
              <>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">
                    {guides?.length} registros encontrados
                  </Typography>
                  <Button variant="contained" color="secondary" size="small" onClick={handleOpenCloseNewGuide}>
                    Crear guía
                  </Button>
                </Box>
                <Dialog
                  open={newGuide.visible}
                  fullWidth="md"
                >
                  <DialogTitle>
                    <Typography variant="h5" color="primary">
                      {newGuide.edit ? 'Editar' : 'Crear nueva'} guía
                    </Typography>
                  </DialogTitle>
                  <DialogContent>
                    <TextField
                      label="Nombre de la guía"
                      name="name"
                      margin="dense"
                      size="small"
                      value={newGuide.name}
                      onChange={handleChangeValueGuide}
                      fullWidth
                    />
                    <TextField
                      label="Descripción"
                      name="description"
                      margin="dense"
                      size="small"
                      value={newGuide.description}
                      onChange={handleChangeValueGuide}
                      fullWidth
                    />
                    <TextField
                      label="temas"
                      name="themes"
                      margin="dense"
                      size="small"
                      value={newGuide.themes || ''}
                      onChange={handleChangeValueGuide}
                      fullWidth
                    />
                    <TextField
                      label="duración en horas"
                      name="duration"
                      margin="dense"
                      size="small"
                      value={newGuide.duration || ''}
                      inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                      onChange={handleChangeValueGuide}
                      fullWidth
                    />
                    <FormControl component="fieldset">
                      <FormLabel component="legend">Esta guía se asignará</FormLabel>

                      <RadioGroup
                        row aria-label="assignTo"
                        name="assignTo"
                        value={assignedTo}
                        onChange={(e) => { setAssignedTo(e.target.value) }}
                      >
                        <FormControlLabel value="allClass" label="A una ficha" control={<Radio />} />
                        <FormControlLabel value="usr" label="A un aprendiz" control={<Radio />} />
                      </RadioGroup>
                    </FormControl>
                    {assignedTo === 'allClass' &&
                      <TextField
                        label="Número de ficha"
                        name="classNumber"
                        margin="dense"
                        size="small"
                        value={newGuide.classNumber}
                        select
                        onChange={handleChangeValueGuide}
                        fullWidth
                      >
                        {classesGroups.map((item) => (
                          <MenuItem value={item.id}>{item.nameClass} - {item.numberClass}</MenuItem>
                        ))}
                      </TextField>
                    }
                    {assignedTo === 'usr' &&
                      <TextField
                        label="Aprendiz a asignar"
                        name="usr"
                        margin="dense"
                        size="small"
                        value={newGuide.usr}
                        select
                        onChange={handleChangeValueGuide}
                        fullWidth
                      >
                        {usrs.map((item) => (
                          <MenuItem value={item.id}>{item.firstName?.toUpperCase()} {item.lastName?.toUpperCase()} - {item.nameClass} ({item.numberClass})</MenuItem>
                        ))}
                      </TextField>
                    }
                    <Box sx={{ margin: '15px 0px' }}>
                      <UploaderFile
                        file={file}
                        setFile={setFile}
                        title="PDF"
                      />
                    </Box>


                  </DialogContent>
                  <DialogActions>
                    <Button onClick={handleOpenCloseNewGuide} color="error" variant="contained" size="small">
                      Cancelar
                    </Button>
                    <Button onClick={() => { newGuide.edit ? editGuide() : saveGuide() }} color="primary" variant="contained" size="small"
                      disabled={
                        !newGuide.name ||
                          !newGuide.description ||
                          !newGuide.themes ||
                          !newGuide.duration ||
                          (assignedTo === 'allClass' ? (newGuide.classNumber ? false : true) : (newGuide.usr ? false : true)) ||
                          !file.evidence
                          ? true : false
                      }
                    >
                      {newGuide.edit ? 'Editar' : 'Crear'} Guía
                    </Button>
                  </DialogActions>
                </Dialog>
              </>
            }

          </Box>
          <TableContainer component={Paper}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center">Nombre</TableCell>
                  <TableCell align="center">Descripción</TableCell>
                  <TableCell align="center">Temas</TableCell>
                  <TableCell align="center">Duración (en horas)</TableCell>
                  <TableCell align="center">Asignado a</TableCell>
                  <TableCell align="center">Opciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <Dialog
                  open={previewPDF.visible}
                  onClose={() => setPreviewPDF({ visible: false })}
                  fullWidth="md"
                >
                  <DialogContent sx={{ height: '100vh' }}>
                    <embed src={`${process.env.PUBLIC_URL}/pdfs/${previewPDF.route}`} type="application/pdf" style={{ width: '100%', height: '99%' }}></embed>
                  </DialogContent>
                </Dialog>
                {guides.map((item, key) => (
                  <TableRow key={`guia${key}`}>
                    <TableCell align="center">{item.name}</TableCell>
                    <TableCell align="center">{item.description}</TableCell>
                    <TableCell align="center">{item.themes}</TableCell>
                    <TableCell align="center">{item.duration}</TableCell>
                    <TableCell align="center">{item.selected}</TableCell>
                    <TableCell align="center">
                      <Box>
                        <Tooltip arrow placement="top" title="Previsualizar PDF">
                          <IconButton sx={{ color: '#355bae' }} size="small" onClick={() => handlePreviewPDF(item.guideDoc)}><PictureAsPdfRoundedIcon /></IconButton>
                        </Tooltip>
                        {user.role === 'Instructor' &&
                          <>
                            <Tooltip arrow placement="top" title="Editar">
                              <IconButton sx={{ color: '#349355' }} size="small" onClick={() => handleEditGuide(item)}><CreateRoundedIcon /></IconButton>
                            </Tooltip>
                            <Tooltip arrow placement="top" title="Eliminar">
                              <IconButton sx={{ color: '#b31a1a' }} size="small" onClick={() => handleDeleteGuide(item.idGuide, item.guideDoc)}><DeleteForeverRoundedIcon /></IconButton>
                            </Tooltip>
                          </>
                        }
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Grid>
      {user.role === 'Instructor' &&
        <Grid item xs={12} md={5}>
          <Box className="cardContainerDash">
            <Typography variant="h5" sx={{ textAlign: 'center' }}>
              Fichas
            </Typography>
            <hr />
            <Box sx={{ textAlign: 'end', margin: '15px 0px' }}>
              <Typography variant="body2">
                {classesGroups?.length} registros encontrados
              </Typography>
            </Box>
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell align="center">Id</TableCell>
                    <TableCell align="center">Nombre</TableCell>
                    <TableCell align="center">Número de la ficha</TableCell>
                    <TableCell align="center">Instructor</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {classesGroups?.map((item, key) => (
                    <TableRow key={`class${key}`}>
                      <TableCell align="center">{item.id}</TableCell>
                      <TableCell align="center">{item.nameClass}</TableCell>
                      <TableCell align="center">{item.numberClass}</TableCell>
                      <TableCell align="center">{user.firstName?.toUpperCase()} {user.lastName?.toUpperCase()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      }
    </Grid >
  )
}
