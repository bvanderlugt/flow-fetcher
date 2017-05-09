var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')

request('http://professorpaddle.com/rivers/riverlist.asp', (err, res, body) => {
  if (err) {
    console.log('Error: ' + err)
  }
  console.log('Status code:' + res.statusCode)

  var $ = cheerio.load(body)

  console.log($('tbody').hasClass('tableledger'))

  // $('tbody:has(td.tableledger)').each((i, tr) => {
    // var children = $(this).children()
    // var childrenLen = $(this).children().length
    // var row = {
    //     riverName: children.eq(0).text()
    // }
    // console.log(this)
    // var runName
    // var class
    // var flowUnits // temp var for mocking UI
  // })
})
