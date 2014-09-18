//I just spotted some minor things that could be cleaned up code-wise
//I don't have the time to write tests for this today, so code may be non-functional

var express = require('express'),
    twilio  = require('twilio'),
    router  = express.Router(),
    request = require('request'),
    cheerio = require('cheerio'),
    zlib    = require('zlib');


/* GET users listing. */
router.get('/', function(req, res) {
    'use strict';
  res.send('lolzard');
});

router.post('/sms', function(req, res) {
  'use strict';
  var resp = new twilio.TwimlResponse(),
      tURL = req.body.Body,
      msg = '';
    
    function sendIt(temp, resp, sendItRes){
      var messages = new Array, slices = Math.ceil(temp.length/1594);
      
      for(var i=0;i<slices;i++){
        messages.push(i+' '+temp.substring(i*1594,(i*1594+1594)));
      }
    
      for(var j=0;j<messages.length;j++){
        resp.message(messages[j]);
      }
    
      res.send(resp.toString());
    }

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
//    $('*').each(function() {      // iterate over all elements
//        this[0].attribs = {};     // remove all attributes
//    });
    msg = $('body').html()+'';

    zlib.gzip(msg, function(err, result) {
      var messageToSend = new Buffer(result).toString('base64');
      
      if(err) {
        throw err;
      }
      sendIt(messageToSend, resp, res);
     });
  });
});


module.exports = router;
