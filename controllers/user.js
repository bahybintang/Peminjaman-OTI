var express = require('express')
var app = module.exports = express.Router()
var con = require('../models/db')

app.post('/users', (req, res) => {
    if(req.body.userName && req.body.NIU){
        con.query(`INSERT INTO users (userName, NIU) values ('${req.body.userName}', '${req.body.NIU}')`, (err, data) => {
            if (err) {
                res.status(400).send({ message: err.sqlMessage })
            }
            if (data) {
                res.send({ message: "Success" })
            }
        })
    }
    else {
        res.status(400).send({ messsage: "Please input correct Name and NIU" })
    }
})

app.get('/users', (req, res) => {
    var userName = req.query.userName ? ("LIKE '%" + req.query.userName + "%'") : "REGEXP '^.*'"
    var NIU = req.query.NIU ? ("LIKE '%" + req.query.NIU + "%'") : "REGEXP '^.*'"

    con.query(`SELECT * FROM users WHERE userName ${userName} AND NIU ${NIU}`, (err, data) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage })
        }
        if (data) {
            res.send(data)
        }
    })
})

app.put('/users/:id', (req, res) => {
    if (req.body.userName) {
        console.log(req.params.id)
        con.query(`UPDATE users SET userName = '${req.body.userName}' WHERE NIU = '${req.params.id}'`, (err, data) => {
            if (err) {
                res.status(400).send({ message: err.sqlMessage })
            }
            if (data) {
                if (data.affectedRows > 0) {
                    res.status(200).send({ message: "Success" })
                }
                else {
                    res.status(400).send({ message: "Data Not Found!" })
                }
            }
        })
    }
    else {
        res.status(400).send({ messsage: "Please input correct userName" })
    }
})

app.delete('/users/:id', (req, res) => {
    con.query(`DELETE FROM users WHERE NIU = '${req.params.id}'`, (err, data) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage })
        }
        if (data) {
            if (data.affectedRows > 0) {
                res.status(200).send({ message: "Success" })
            }
            else {
                res.status(400).send({ message: "Data Not Found!" })
            }
        }
    })
})