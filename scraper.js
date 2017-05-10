'use strict'

// var request = require('request')
var cheerio = require('cheerio')
var fs = require('fs')
var request = require('request')

/**
 * var scrapeRiverRows - Get data from the river row page and return an array
 * with obj for each row
 *
 * @param  {cheerio} $      cheerio object
 * @return {array}          array of riverRow objs
 */
var scrapeRiverRows = function($) {
  var data = []

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
      flow: $(tableColumns).eq(3).find('font').find('strong').text(),
      lastUpdate: $(tableColumns).eq(4).find('font').text(),
      detailPageURL: detailPageLink,
    }
    data.push(row)
  })
  return data
}

/**
 * var scrapeDetailPage - takes a cheerio object for detail
 * river pages and returns detail object
 *
 * @param  {cheerio} $ cheerio object
 * @return {detail}   json object with river detail. Values initialized to 0/nulls
 */
var scrapeDetailPage = function($) {
  // takes a cheerio object for detail river pages and returns detail object

  // initialize to default values
  var detail = {
    gauge: null,
    siteID: null,
    minFlow: 0,
    maxFlow: 0,
    units: null
  }

  var ledgers = $('.tableledger')

  ledgers = ledgers.filter(function(i, el) {
    return $(el).children().hasClass('tablebottomy')
  })

  // need some checks to see what kind of page we have
  // 1) complete usgs page (guage, min/max)
  // 2) complete non-usgs page
  // 3) no gauge / no flow info page (just a description)
  // we can deal with extracting what we can and returning default values
  // when data is not present

  // if there is no gauge ledger info, return a default detail obj
  // console.log('check if ledger exists for gauge' + ledgers.siblings().length)
  if (ledgers.siblings().length === 0) {
    return detail
  }
  // gauge row
  var riverInfoRow = ledgers.next()
  // max/min row
  var riverFlowRow = riverInfoRow.next()
  // console.log(riverInfoRow.children().eq(0).find('a').attr('href'))

  // --- river info elements ---
  detail.gauge = riverInfoRow.children().eq(0).find('a').text().trim()

  var siteURL = riverInfoRow.children().eq(0).find('a').attr('href')
  if (/(usgs)/.test(siteURL)) { // only pull id if gauge belongs to usgs
    detail.siteID = siteURL.trim().match(/\d+/) // gets the digits at the end of of the url (site id)
  }

  // --- river flow elements ---
  // console.log(riverFlowRow)
  var flowText = riverFlowRow.children().eq(0).text().trim().split(/\s{4}/)
  // console.log(flowText)
  if (flowText[0] !== '') {
    detail.minFlow = Number(flowText[0].match(/\d+/)[0])
    detail.maxFlow = Number(flowText[1].match(/\d+/)[0])
    detail.units = flowText[0].match(/\w+$/)[0]
  }
  return detail
}

module.exports = {
  scrapeRiverRows: scrapeRiverRows,
  scrapeDetailPage: scrapeDetailPage
}
