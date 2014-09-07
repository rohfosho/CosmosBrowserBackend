var express = require('express');
var twilio  = require('twilio');
var router  = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var zlib    = require('zlib');
var msg     = '';

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('lolzard');
});

router.post('/sms', function(req, res) {
  var resp = new twilio.TwimlResponse();
  var tURL = req.param("url");

  request('http://facebook.com', function (error, response, body) {
    var $ = cheerio.load(body);
    $('img').remove();
    $('head').remove();
    $('script').remove();
    $('link').remove();
    //console.log($('body').html());
    msg = $('body').html()+'';
    });

  resp.message(msg);
  res.send(resp.toString());
});

zlib.gzip(msg, function(err, result){
  if(err) 
    console.log('ERROR\t'+err);
  else{
    console.log'Message\t'+(msg); 
    console.log('Result\t'+result);
  }
});

module.exports = router;
