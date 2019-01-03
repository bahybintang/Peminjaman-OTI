var express = require('express')
var app = module.exports = express.Router()
var con = require('../models/db')

app.post('/pay', (req, res) => {

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