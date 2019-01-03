var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var con = require('./models/db')
var inventory = require('./controllers/inventory')
var users = require('./controllers/user')
var borrow = require('./controllers/borrow')
var ret = require('./controllers/return')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

con.connect(function (err) {
    if (err) throw err;
    console.log("Database connected!");
    con.query('USE pinjam_oti', (err, data) => {
        if (data) {
            console.log(`Database selected!`)
        }
        if (err) {
            console.log(err);
        }
    })
});

app.set('port', (process.env.PORT || 5000))

app.use([inventory, users, borrow, ret])

app.listen(app.get('port'), function () {
    console.log("listening on port " + app.get('port') + "...")
})