const Nightmare = require('nightmare')
const cheerio = require('cheerio')
const fs = require('fs')
const request = require('request')

const nightmare = Nightmare({ show: false })
const URL = 'https://ru.aliexpress.com/item/4000229636828.html'

let download = function(uri, filename, callback) {
  request.head(uri, function(err, res, body){
    // console.log('content-type:', res.headers['content-type'])
    // console.log('content-length:', res.headers['content-length'])

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback)
  })
}

nightmare
  .goto(URL)
  .wait('body')
  .evaluate(() => document.querySelector('body').innerHTML)
  .end()
  .then(res => {
    const $ = cheerio.load(res)
    console.log($('.product-title').text())
    console.log($('.product-price-current .product-price-value').text())
    $('.sku-property-text').each((i, elem) => {
      console.log($(elem).find('span').text())
    })

    $('.sku-property-image').each((i, elem) => {
      let photoUrl = $(elem).find('img').attr('src').replace('_50x50.jpg', '')
      console.log(photoUrl)
      download(photoUrl, `types/${i}.jpg`, () => {
        // console.log('done')
      })
    })

    $('.images-view-item').each((i, elem) => {
      let photoUrl = $(elem).find('img').attr('src').replace('_50x50.jpg', '')
      console.log(photoUrl)
      download(photoUrl, `imgs/${i}.jpg`, () => {
        // console.log('done')
      })
    })
  }).catch(err => console.log(err))