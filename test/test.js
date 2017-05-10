'use strict'

const scraper = require('../scraper')
const cheerio = require('cheerio')
const fs = require('fs')
const assert = require('assert')

// static pages for testing
const riverRows = cheerio.load(fs.readFileSync(__dirname + '/../data/ppdata.html'))
const riverDetail = cheerio.load(fs.readFileSync(__dirname + '/../data/river-detail-page.html'))
const riverDetailNoGauge = cheerio.load(fs.readFileSync(__dirname + '/../data/river-detail-no-guage.html'))

describe('ScrapeRiverRows', () => {
  const data = scraper.scrapeRiverRows(riverRows)

    it('should return river name of first entry', () => {
      assert.equal(data[0].riverName, 'American')
    })
})

// not exactly a unit test but it tests the data model returned by detail scraper
describe('scrapeDetailPage', () => {
  const detail = scraper.scrapeDetailPage(riverDetail)

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

describe('test some pages lacking complete detail', () => {
  const detailNoGauge = scraper.scrapeDetailPage(riverDetailNoGauge)

  it('if no gauge is present return default detail obj', () => {
    assert(!detailNoGauge.gauge)
  })

})
