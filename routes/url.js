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
  console.log(tURL);

  request(tURL, function (error, response, body) {
    var $ = cheerio.load(body);
    $('img').remove();
    $('head').remove();
    $('script').remove();
    $('link').remove();
    $('body').children().removeAttr('style');
    $('body').children().removeAttr('class');
    $('body').children().removeAttr('id');
    $('body').children().removeAttr('name');
    $('body').children().removeAttr('src');
    $('body').children().removeAttr('href');
    msg = $('body').html()+'';

    zlib.gzip(msg, function(err, result) {
      if(err) {
        console.log('ERROR\t'+err);
      } else {
        //console.log('Message\t'+msg); 
        //console.log('Result\t'+result);
        var temp = new Buffer(msg).toString('base64');
        console.log(temp);
        msg = temp;
        sendIt(msg, resp, res);
      }
    });
  });

});

function sendIt(temp, resp, res){
  var messages = new Array, slices = Math.ceil(temp.length/1594);
  console.log('\n'+slices);
  
  for(var i=0;i<slices;i++){
    console.log(temp.substring(i*1600,(i*1594+1594))+'\n');
    messages.push(i+' '+temp.substring(i*1594,(i*1594+1594)));
  }

  console.log(messages.length);

  for(var j=0;j<messages.length;j++){
    resp.message(messages[j]);
  }

  res.send(resp.toString());
}

module.exports = router;
