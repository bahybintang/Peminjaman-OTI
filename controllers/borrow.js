var express = require('express')
var app = module.exports = express.Router()
var con = require('../models/db')

app.post('/borrow', (req, res) => {
    brwID(id => {
        if (req.body.NIU && req.body.dueDate && id && req.body.status) {
            con.query(`INSERT INTO borrow (NIU, borrowDate, dueDate, borrowId, status) values ('${req.body.NIU}', NOW(), NOW() + INTERVAL ${req.body.dueDate} DAY, '${id}', '${req.body.status}')`, (err, data) => {
                if (err) {
                    res.status(400).send({ message: err.sqlMessage })
                }
                if (data) {
                    if(req.body.inv){
                        var sql = "INSERT INTO borrowdetails (borrowId, invId) VALUES "

                        req.body.inv.forEach(element => {
                            sql += `('${id}', '${element}'),`
                        });
    
                        sql = sql.slice(0, -1)
    
                        con.query(sql, (err, data) => {
                            if (err) {
                                res.status(400).send({ message: err.sqlMessage })
                            }
                            if (data) {
                                res.send({ message: "Success" })
                            }
                        })
                    }
                    else{
                        res.send({ message: "Success" })
                    }
                }
            })
        }
        else {
            res.status(400).send({ messsage: "Please input correct NIU, dueDate, and status" })
        }
    })
})

app.delete('/borrow/:id', (req, res) => {
    if(req.body.invId){
        con.query(`DELETE FROM borrowdetails WHERE borrowId = '${req.params.id}' AND invId = '${req.body.invId}'`, (err, data) => {
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
        con.query(`
            DELETE FROM borrow WHERE borrowId = '${req.params.id}';
            DELETE FROM borrowdetails WHERE borrowId = '${req.params.id}';
        `, (err, data) => {
            if (err) {
                res.status(400).send({ message: err.sqlMessage })
            }
            if (data[0]) {
                if (data[0].affectedRows > 0) {
                    res.status(200).send({ message: "Success" })
                }
                else {
                    res.status(400).send({ message: "Data Not Found!" })
                }
            }
        })
    }
})

async function brwID(callback) {
    con.query(`SELECT * FROM borrow ORDER BY borrowId DESC LIMIT 1`, (err, data) => {
        var date = new Date()
        if (err) {
            throw err;
        }
        if (data) {
            if (data.length === 0) {
                var finalData = 'BRW' + '-' + (date.getFullYear() % 100) + '' + ('00' + date.getMonth() + 1).slice(-2) + '-' + 1
            }
            else {
                var number = parseInt(data[0].borrowId.split('-')[2])
                number++
                var finalData = 'BRW' + '-' + (date.getFullYear() % 100) + '' + ('00' + date.getMonth() + 1).slice(-2) + '-' + number
            }
        }
        return callback(finalData)
    })
}