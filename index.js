const express = require('express')
const cors = require('cors')
const path = require('path')
var logger = require('morgan');
require('dotenv').config() /// โหลด config จาก file .env ให้เรียกใช้ใน process.env ได้
const PORT = process.env.PORT || 3000 //ใช้ port จาก .env ถ้าไม่มีใน .env ให้ใช้ PORT = 3000
const app = express()



//upload
var admin = require('firebase-admin');

var serviceAccount = require("./cert/upload-5137e-firebase-adminsdk-20897-c001f124e6.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://upload-5137e.firebaseio.com",
    storageBucket: "gs://upload-5137e.appspot.com/"
  });



app.use(logger('dev')); // log call api
app.use(express.json()) // set ให้ Request body ให้รู้จัก data แบบ json (parsing application/json) https://expressjs.com/en/4x/api.html#req.body
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cors()) // อนุญาต ให้ทุก domain ใช้ api ได้ 
app.use('/public', express.static(path.join(__dirname,'public'))) // set static path ถ้าเรียก /public จะสามารถอ่าน static file ใน folder public ได้ เช่น http://localhost:3000/public/test.html


// Import Routes
const apiRoutes = require('./src/routes');
app.use('/api', apiRoutes) // ถ้าเรียก /api ให้เรียกใช้ routes ใน  src/routes.js

//middleware https://expressjs.com/en/guide/writing-middleware.html

// Start App Express 
app.listen(PORT, ()=>{
    console.log(`APIs is running. PORT ${PORT}`)
})