const express = require('express')
const app = express();
const mysql = require('mysql')
const cors = require('cors')
const bodyParser = require('body-parser')

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'recuperacionsena',
})
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())



app.post('/sign-in', (req, res) => {
  const sqlSearch = "SELECT * FROM users WHERE email = ? AND password = ?"

  db.query(sqlSearch, [req.body.email, req.body.pass], (err, response) => {
    // console.log('response:', response[0]);
    if (err) {
      console.log('err:', err);
      res.status(500, err)
      res.send(err)
    }

    if (typeof response[0] === 'object') {
      delete response[0].idusers
      res.send(response[0])
    } else {
      res.status(401)
      res.send('Correo y/o contraseña incorrecta')
    }
  })
})

app.post('/sign-up', (req, res) => {
  const sqlInsert = "INSERT INTO users (firstName,lastName,role,password,email,identification,phone,idClass) VALUES(?,?,?,?,?,?,?,?)"
  const { firstName, lastName, role, email, identification, phone, classs } = req.body
  db.query(sqlInsert, [firstName, lastName, role, 'SENAaprendiz2021', email, identification, phone, classs], (err, response) => {
    if (err) {
      console.log('err:', err);
      res.status(500, err)
      res.send(err)
    }
    res.send('Usuario creado con éxito')

  })
})


app.post('/getClassesGroups', (req, res) => {
  const sqlSearch = "SELECT * FROM classes WHERE idInstructor = ?"
  const { idUser } = req.body
  db.query(sqlSearch, [idUser], (err, response) => {
    if (err) {
      console.log('err:', err);
      res.status(500, err)
      res.send(err)
    }
    res.send(response)

  })
})
app.post('/getLearners', (req, res) => {
  const sqlSearch = "SELECT u.*, c.nameClass as nameClass, c.numberClass as numberClass, c.id as classId FROM recuperacionsena.users AS u INNER JOIN classes as c ON c.id = u.idClass WHERE role = 'Aprendiz';"
  db.query(sqlSearch, (err, response) => {
    if (err) {
      console.log('err:', err);
      res.status(500, err)
      res.send(err)
    }
    res.send(response)

  })
})

app.post('/createClass', (req, res) => {
  const sqlSearch = "INSERT INTO classes (nameClass,numberClass,idInstructor) VALUES(?,?,?)"
  const { nameClass, numberClass, idUser } = req.body
  db.query(sqlSearch, [nameClass, numberClass, idUser], (err, response) => {
    if (err) {
      console.log('err:', err);
      res.status(500, err)
      res.send(err)
    }
    console.log('🚀 ~ file: index.js ~ line 59 ~ db.query ~ response', response)
    res.send(response)

  })
})


app.post('/createGUIDE', (req, res) => {
  const { name, description, themes, duration, guideDoc, idUserAssigned, idClass, idInstructor } = req.body
  const moment = require('moment')
  var Fs = require('fs')
  let mimeType = guideDoc.evidence.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
  const nameFile = `${name.toUpperCase()}-${moment().format('YYYY_MM_DD_HH_mm')}.pdf`
  const directory = `${__dirname}/../public/${nameFile}`;

  Fs.writeFile(directory, guideDoc.evidence.replace(`data:${mimeType};base64`, ""), { encoding: "base64" }, function () {


    const sqlSearch = "INSERT INTO `recuperacionsena`.`guides` ( `name`, `description`, `themes`, `duration`, `guideDoc`, `idUserAssigned`, `idClass`,`author`) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?)"
    db.query(sqlSearch, [name, description, themes, duration, nameFile, idUserAssigned, idClass, idInstructor], (err, response) => {
      if (err) {
        console.log('err:', err);
        res.status(500, err)
        res.send(err)
      }
      // console.log('🚀 ~ file: index.js ~ line 59 ~ db.query ~ response', response)
      res.send(response)

    })
  })

})


app.post('/getGuidesPerInstructor', (req, res) => {
  const sqlSearch = `
  SELECT g.id AS idGuide, u.id,u.idClass, g.name, g.description, g.themes, g.duration,g.guideDoc,
  IF(u.id != g.author, CONCAT(u.firstName, ' ', u.lastName, ' - (',c.numberClass,')') ,CONCAT('Toda la ficha ',c.numberClass) ) AS selected
  FROM recuperacionsena.guides AS g
  INNER JOIN users AS u ON u.id =g.idUserassigned
  INNER JOIN classes AS c ON c.id = g.idClass
  WHERE author = ?;`
  const { idUser } = req.body
  db.query(sqlSearch, [idUser], (err, response) => {
    if (err) {
      console.log('err:', err);
      res.status(500, err)
      res.send(err)
    }
    res.send(response)

  })
})


app.post('/editGUIDE', (req, res) => {
  const { name, description, themes, duration, guideDoc, idUserAssigned, idClass, idInstructor, lastFile, idGuide } = req.body
  const moment = require('moment')
  var Fs = require('fs')
  let mimeType = guideDoc.evidence.match(/[^:]\w+\/[\w-+\d.]+(?=;|,)/)[0];
  const nameFile = `${name.toUpperCase()}-${moment().format('YYYY_MM_DD_HH_mm')}.pdf`
  const directory = `${__dirname}/../public/${nameFile}`;

  Fs.unlink(`${__dirname}/../public/${lastFile}`, (err) => {
    console.log("deleted an PDF");
  })
  Fs.writeFile(directory, guideDoc.evidence.replace(`data:${mimeType};base64`, ""), { encoding: "base64" }, function () {
    console.log("created new");
    const sqlSearch = `UPDATE recuperacionsena.guides SET name = ? , description = ?, themes = ?,guideDoc= ?, duration = ?, idUserAssigned = ?, idClass = ?, author = ? WHERE(id = ?);`


    db.query(sqlSearch, [name, description, themes, nameFile, duration, idUserAssigned, idClass, idInstructor, idGuide], (err, response) => {
      if (err) {
        console.log('err:', err);
        res.status(500, err)
        res.send(err)
      }
      // console.log('🚀 ~ file: index.js ~ line 59 ~ db.query ~ response', response)
      res.send(response)

    })
  })



})



app.post('/deleteGUIDE', (req, res) => {
  const { idGuide, nameFile } = req.body
  var Fs = require('fs')

  Fs.unlink(`${__dirname}/../public/${nameFile}`, (err) => {
    console.log("deleted an PDF");
  })


  const sqlSearch = `DELETE FROM recuperacionsena.guides WHERE(id = ? );`


  db.query(sqlSearch, [idGuide], (err, response) => {
    if (err) {
      console.log('err:', err);
      res.status(500, err)
      res.send(err)
    }
    // console.log('🚀 ~ file: index.js ~ line 59 ~ db.query ~ response', response)
    res.send(response)

  })

})

// 







app.listen(3001, () => {
  console.log("servidor iniciado en puerto 3001 😀");
})