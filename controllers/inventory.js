var express = require('express')
var app = module.exports = express.Router()
var con = require('../models/db')

app.post('/inventory', async (req, res) => {
    invID(id => {
        console.log(id)
        if (req.body.invName && req.body.brand && id && req.body.type) {
            con.query(`INSERT INTO inventory (invName, brand, dateIn, invId, type) values ('${req.body.invName}', '${req.body.brand}', NOW(), '${id}', '${req.body.type}')`, (err, data) => {
                if (err) {
                    res.status(400).send({ message: err.sqlMessage })
                }
                if (data) {
                    res.send({ message: "Success" })
                }
            })
        }
        else {
            res.status(400).send({ messsage: "Please input correct invName, brand and type" })
        }
    })
})

app.get('/inventory/:id', (req, res) => {
    con.query(`SELECT * FROM inventory WHERE invId = '${req.params.id}'`, (err, data) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage })
        }
        if (data) {
            if (data.length > 0) {
                res.send(data[0])
            }
            else {
                res.status(400).send({ message: "Not Found!" })
            }
        }
    })
})

app.get('/inventory', (req, res) => {
    var invName = req.query.invName ? ("LIKE '%" + req.query.invName + "%'") : "REGEXP '^.*'"
    var brand = req.query.brand ? ("LIKE '%" + req.query.brand + "%'") : "REGEXP '^.*'"
    var type = req.query.type ? ("LIKE '%" + req.query.type + "%'") : "REGEXP '^.*'"

    con.query(`SELECT * FROM inventory WHERE invName ${invName} AND brand ${brand} AND type ${type}`, (err, data) => {
        if (err) {
            res.status(400).send({ message: err.sqlMessage })
        }
        if (data) {
            res.send(data)
        }
    })
})

app.get('/inventory/generateid', (req, res) => {
    invID(ids => {
        res.send({ id: ids })
    })
})

app.delete('/inventory/:id', (req, res) => {
    con.query(`DELETE FROM inventory WHERE invId = '${req.params.id}'`, (err, data) => {
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

app.put('/inventory/:id', (req, res) => {
    if (req.body.type && req.body.invName && req.body.brand) {
        con.query(`UPDATE inventory SET invName = '${req.body.invName}', brand = '${req.body.brand}', type = '${req.body.type}' WHERE invId = '${req.params.id}'`, (err, data) => {
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
        res.status(400).send({ messsage: "Please input correct invName, brand and type" })
    }
})

async function invID(callback) {
    con.query(`SELECT * FROM inventory ORDER BY invId DESC LIMIT 1`, (err, data) => {
        var date = new Date()
        if (err) {
            throw err;
        }
        if (data) {
            if (data.length === 0) {
                var finalData = 'INV' + '-' + (date.getFullYear() % 100) + '' + ('00' + date.getMonth() + 1).slice(-2) + '-' + 1
            }
            else {
                var number = parseInt(data[0].invId.split('-')[2])
                number++
                var finalData = 'INV' + '-' + (date.getFullYear() % 100) + '' + ('00' + date.getMonth() + 1).slice(-2) + '-' + number
            }
        }
        return callback(finalData)
    })
}