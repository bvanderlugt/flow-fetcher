'use strict'

const scraper = require('../scraper')
const cheerio = require('cheerio')
const fs = require('fs')
const assert = require('assert')

// static pages for testing
const riverRows = cheerio.load(fs.readFileSync(__dirname + '/../data/ppdata.html'))
const riverDetail = cheerio.load(fs.readFileSync(__dirname + '/../data/river-detail-page.html'))

describe('ScrapeRiverRows', () => {
  // let data = scraper.scrapeRiverRows(riverRows)
  let data = scraper.scrapeRiverRows(riverRows)

    it('should return river name of first entry', () => {
      assert.equal('American', data[0]['riverName'])
    })

})

describe('scrapeDetailPage', () => {
  let detail = scraper.scrapeDetailPage(riverDetail)

  it('should return gauge name', () => {
    assert.equal('AMERICAN RIVER NEAR NILE, WA', detail['gauge'])
  })

  it('should return site id', () => {
    assert.equal(12488500, detail['siteID'])
  })

  it('should return max flow', () => {
    assert.equal(600, detail['maxFlow'])
  })

  it('should return min flow', () => {
    assert.equal(300, detail['minFlow'])
  })

  it('max flow must be strictly greater than min flow', () => {
    assert(detail['maxFlow'] > detail['minFlow'])
  })

})
