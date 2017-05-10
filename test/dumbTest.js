'use strict'

const scraper = require('../scraper')
const cheerio = require('cheerio')
const fs = require('fs')
const assert = require('assert')

// static pages for testing
const riverRows = cheerio.load(fs.readFileSync(__dirname + '/../data/ppdata.html'))
const riverDetail = cheerio.load(fs.readFileSync(__dirname + '/../data/river-detail-page.html'))


console.log('result in dumb test ' + JSON.stringify(scraper.scrapeRiverRows(riverRows)))
