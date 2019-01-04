var express = require('express')
var app = module.exports = express.Router()
var con = require('../models/db')

app.post('/return/:id', (req, res) => {
    var sql = ''
    if (req.body.inv) {
        if (Array.isArray(req.body.inv)) {
            req.body.inv.forEach(element => {
                sql += `DELETE FROM borrowdetails WHERE borrowId = '${req.params.id}' AND invId = '${element}';`
            });

            con.query(sql, (err, data) => {
                if (err) {
                    res.status(400).send({ message: err.sqlMessage })
                }
                else {
                    sql = `SELECT COUNT(1) AS count FROM borrow JOIN borrowdetails USING (borrowId) WHERE borrowId = '${req.params.id}';`
                    con.query(sql, (err, data) => {
                        if(err) {
                            res.status(400).send({ message: err.sqlMessage })
                        }
                        else {
                            if (data[0].count == 0) {
                                sql = `UPDATE borrow SET status = 'returned' WHERE borrowId = '${req.params.id}';`
                            }
                            else {
                                sql = `UPDATE borrow SET status = 'some-returned' WHERE borrowId = '${req.params.id}';`
                            }
                            con.query(sql, (err, data) => {
                                if(err) {
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
                    })
                }
            })
        }
        else {
            sql += `DELETE FROM borrowdetails WHERE borrowId = '${req.params.id}' AND invId = '${req.body.inv}';`

            con.query(sql, (err, data) => {
                if (err) {
                    res.status(400).send({ message: err.sqlMessage })
                }
                else {
                    sql = `SELECT COUNT(1) AS count FROM borrow JOIN borrowdetails USING (borrowId) WHERE borrowId = '${req.params.id}';`
                    con.query(sql, (err, data) => {
                        if(err) {
                            res.status(400).send({ message: err.sqlMessage })
                        }
                        else {
                            if (data[0].count == 0) {
                                sql = `UPDATE borrow SET status = 'returned' WHERE borrowId = '${req.params.id}';`
                            }
                            else {
                                sql = `UPDATE borrow SET status = 'some-returned' WHERE borrowId = '${req.params.id}';`
                            }
                            con.query(sql, (err, data) => {
                                if(err) {
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
                    })
                }
            })
        }
    }
    else {
        sql = `UPDATE borrow SET status = 'returned' WHERE borrowId = '${req.params.id}';`
        sql += `DELETE FROM borrowdetails WHERE borrowId = '${req.params.id}';`

        con.query(sql, (err, data) => {
            if (err) {
                res.status(400).send({ message: err.sqlMessage })
            }
            if (data) {
                console.log(data[0].message)
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

async function paymentID(callback) {
    con.query(`SELECT * FROM payments ORDER BY paymentId DESC LIMIT 1`, (err, data) => {
        var date = new Date()
        if (err) {
            throw err;
        }
        if (data) {
            if (data.length === 0) {
                var finalData = 'PAY' + '-' + (date.getFullYear() % 100) + '' + ('00' + date.getMonth() + 1).slice(-2) + '-' + 1
            }
            else {
                var number = parseInt(data[0].borrowId.split('-')[2])
                number++
                var finalData = 'PAY' + '-' + (date.getFullYear() % 100) + '' + ('00' + date.getMonth() + 1).slice(-2) + '-' + number
            }
        }
        return callback(finalData)
    })
}