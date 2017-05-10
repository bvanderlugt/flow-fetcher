'use strict'

// var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')
var request = require('request')


var scrapeRiverRows = function($) {
  var data = []
  // var detail = {} // used for detail page elements
  // $ is a cheerio object, callback takes the returned data as a JSON object
  // top level row in river table
  var div = $('.tableledger')
  // all the other rows in table
  var rows = $(div).siblings()
  // removing any rows that don't have data I want
  var rowsValid = rows.filter(function(i, el) {
    var elem1 = $(el).attr('class') // find class of row
    // console.log('in filter of scraper: ' + $(el).children().eq(0).find('font').text())
    var elem2 = $(el).children().eq(0).find('font').text() // find text of first row cell
    return elem1 === 'tablerow' && elem2 !== ''
  })

  $(rowsValid).each(function(i, el) {
    var tableColumns = $(el).children()
    // console.log('trying to get to detial page link: ' + 'professorpaddle.com/rivers/' + $(tableColumns).eq(1).find('a').attr('href'))
    var detailPageLink = 'http://professorpaddle.com/rivers/' + $(tableColumns).eq(1).find('a').attr('href')

    var row = {
      riverName: $(tableColumns).eq(0).find('font').text(),
      runName: $(tableColumns).eq(1).find('a').text(),
      classType: $(tableColumns).eq(2).find('font').text(),
      flow: {
        level: $(tableColumns).eq(3).find('font').find('strong').text()
      },
      lastUpdate: $(tableColumns).eq(4).find('font').text(),
      detailPageURL: detailPageLink,
    }
    data.push(row)
  })


  data = data.slice(0, 3)
  let riverRowPromiseArr = data.map(function(riverRow) {
      return new Promise(function(resolve, reject) {
        // console.log('inside new Promise map, ', riverRow['detailPageURL'])
        request(riverRow['detailPageURL'], function(err, res, html) {
          console.log('inside request for detail')
          if (err) {
            console.log('error detail page link request: ', err)
            return reject(err)
          }
          // if resolves then send res to body to detail scraper
          console.log('making promises I guess?? ')
          // resolve(scrapeDetailPage(cheerio.load(html)))
          console.log('hi')
          resolve(html)
        })
      })
  })

  Promise.all(riverRowPromiseArr).then(function(detailResArray) {
    detailResArray.forEach(function(detailHTML, i) {
      const result = scrapeDetailPage(cheerio.load(detailHTML))
      data[i].detail = result
      console.log(data)
    })
  return data
  }).catch(function(err) {
    console.log(err)
  })
}

var scrapeDetailPage = function($) {
  // if you feed me the river detail page I'll callback with
  // a detail object
  // var data = []

  var ledgers = $('.tableledger')

  ledgers = ledgers.filter(function(i, el) {
    return $(el).children().hasClass('tablebottomy')
  })

  // gauge row
  var riverInfoRow = ledgers.next()
  // max/min row
  var riverFlowRow = riverInfoRow.next()
  // console.log(riverInfoRow.children().eq(0).find('a').attr('href'))

  // --- river detail elements ---
  var siteURL = riverInfoRow.children().eq(0).find('a').attr('href')
  var siteID = 0 // initialize to zero which means no siteid/non-usgs gauge
  if (/(usgs)/.test(siteURL)) { // only pull id if gauge belongs to usgs
    siteID = siteURL.trim().match(/\d+/) // gets the digits at the end of of the url (site id)
  }

  // --- river flow elements ---
  var flowText = riverFlowRow.children().eq(0).text().trim().split(/\s{4}/)
  var minVal = Number(flowText[0].match(/\d+/)[0])
  var maxVal = Number(flowText[1].match(/\d+/)[0])

  // console.log(flowText[0].match(/\w+$/)[0])

  // --- detail object ---
  var detail = {
    gauge: riverInfoRow.children().eq(0).find('a').text().trim(),
    siteID: siteID,
    minFlow: minVal,
    maxFlow: maxVal,
    units: flowText[0].match(/\w+$/)[0]
  }
  return detail
}

module.exports = {
  scrapeRiverRows: scrapeRiverRows,
  scrapeDetailPage: scrapeDetailPage
}
