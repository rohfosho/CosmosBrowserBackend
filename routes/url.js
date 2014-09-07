var express = require('express');
var twilio  = require('twilio');
var router  = express.Router();
var request = require('request');
var cheerio = require('cheerio');
var zlib    = require('zlib');
var msg     = "";

var UTF_BITS = 8;

function padLeftTo(string, padChar, numChars) {
    return (new Array(numChars-string.length+1)).join(padChar) + string;
}

function unicodeToBinary(char) {
    return char.split('').map(function(codepoint) {
        return padLeftTo(codepoint.charCodeAt(0).toString(2), 0, UTF_BITS);
    }).join('');
    //         ^^^^( ignore this part if you just want a string )^^^^
}

function binaryToUnicode(binaryList) {
    var codepointsAsNumbers = [];
    while( binaryList.length>0 ){
        var codepointBits = binaryList.slice(0,UTF_BITS);
        binaryList = binaryList.slice(UTF_BITS);
        codepointsAsNumbers.push( parseInt(codepointBits.join(''),2) );
    }
    return String.fromCharCode.apply(this,codepointsAsNumbers);
}

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('lolzard');
});

router.post('/sms', function(req, res) {
  var resp = new twilio.TwimlResponse();
  var tURL = req.body.Body;

  request('http://facebook.com', function (error, response, body) {
    var $ = cheerio.load(body);
    $('img').remove();
    $('head').remove();
    $('script').remove();
    $('link').remove();
    msg = $('body').html()+'';

    zlib.gzip(msg, function(err, result) {
      if(err) {
        console.log('ERROR\t'+err);
      } else {
        console.log('Message\t'+msg); 
        console.log('Result\t'+result);
        msg = result;
      }
    });
  });

  resp.message(msg);
  res.send(resp.toString());
});

module.exports = router;
