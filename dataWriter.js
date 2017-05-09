var scraper = require('./scraper')
var fs = require('fs')
var cheerio = require('cheerio')

const $ = cheerio.load(fs.readFileSync('./ppdata.html'))

var obj = {
  rivers: []
}

scraper.scrapeRiverRows($, function(d){
  d.forEach(function(elem) {
    obj.rivers.push(elem)
  })
  var json = JSON.stringify(obj)
  fs.writeFile('rivers.json', json, 'utf8')
  // const file = fs.createWriteStream('rivers.json')
  // file.on('error', function(err) {console.log(err)})
    //d.map((elem) => {
    //file.write(JSON.stringify(elem) + '\n')
  //})
  // file.write(JSON.stringify(d))
  // file.end()
})
