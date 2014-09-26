var express = require('express'),
  twilio  = require('twilio'),
  router  = express.Router(),
  request = require('request'),
  cheerio = require('cheerio'),
  zlib    = require('zlib'),
  snappy  = require('snappy'),
  minify  = require('html-minifier').minify,
  md      = require('html-md'),
  helpers = require('./helperMaster');


/* GET users listing. */
router.get('/', function (req, res) {
  'use strict';
  res.send('lolzard');
});

router.get('/sms', function (req, res){
    'use strict';
    res.send('nope');
});

router.post('/sms', function (expressSMSReq, expressSMSRes) {
  'use strict';
  var twillioResponse = new twilio.TwimlResponse(),
    twillioURL = expressSMSReq.body.Body;

  request(twillioURL, function (requestError, requestResponse, requestBody) {
    if (requestError) {
      throw requestError;
    }
    console.log('request');

    helpers.cheerioHandler(requestBody, function (cheerioErr, message) {
      var markedDown = '';
      console.log('cheerio')

      if (cheerioErr) {
        throw cheerioErr;
      }
      //Note that we are reassigning the parameter message sent to cheerioHandler
      message = '<html><body>' + message + '</body></html>';
      message = minify(message, {collapseWhitespace: true, removeComments: true});
      markedDown = md(message);

      zlib.gzip(markedDown, function (zlibErr, zlibResult) {
        var messageToSend = '';
        console.log('zlib');
        if (zlibErr) {
          throw zlibErr;
        }

        messageToSend = new Buffer(zlibResult).toString('base64');

        console.log("\n-------------MARKDOWN---------\n" + messageToSend);
        //console.log("\n-------------HTML---------\n"+messageToSend);

        helpers.sendIt(messageToSend, twillioResponse, expressSMSRes, function (sendItError, processedMessages) {
          if (sendItError) {
            throw sendItError;
          }
          console.log('send');
          expressSMSRes.send(processedMessages);
        });
      });
    });
  });
});
module.exports = router;
