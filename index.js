'use strict'

const request = require('request')
const cheerio = require('cheerio')
const fs = require('fs')
const scraper = require('./scraper')

/**
 * var collectDetailPages - takes array of riverRow object with 'detailPageURL' attribute
 *  makes call to all detail pages and returns an array of objects with detail attribute
 *  included for each row
 *
 * @param  {array} data array of riverRow objects with detailPageURL attribute
 * @param  {function} callback returns data from promises chain
 * @return {array} returns input with details attribute added to each obj
 */

const data = []

request('http://professorpaddle.com/rivers/riverlist.asp', function(err, res, html) {
  const $ = cheerio.load(html)
  scraper.scrapeRiverRows($)
})

function collectRiverInfo(data, callback) {
    let riverRowPromiseArr = data.map(function(riverRow) {
        return new Promise(function(resolve, reject) {
          request(riverRow['detailPageURL'], function(err, res, html) {
            if (err) {
              console.log('error detail page link request: ', err)
              return reject(err)
            }
            resolve(html)
          })
        })
    })

    Promise.all(riverRowPromiseArr).then(function(detailResArray) {
      detailResArray.forEach(function(detailHTML, i) {
        let result = scrapeDetailPage(cheerio.load(detailHTML))
        data[i].detail = result
      })
      callback(data)
    }).catch(function(err) {
      console.log('error in promise all: ' + err)
    })
}

collectRiverInfo(data, function(d){
  let obj = {
    rivers: data
  }
  fs.writeFile('rivers.json', data, 'utf8')
})
