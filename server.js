const express = require('express');
const mysql = require('mysql2');
const path = require('path')

const app = express();
const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'expiry',
    password: '1234',
    database: 'expiry',
});
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/login')));
app.use(express.static(path.join(__dirname, '/home_contact')));
app.use(express.static(path.join(__dirname, '/setting')));
app.use(express.static(path.join(__dirname, '/main')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req,res) => {
    res.sendFile(__dirname + '/home_contact/home.html');
}) 

app.listen(port, () =>[
    console.log(`server is running on http://localhost:${port}`)
])