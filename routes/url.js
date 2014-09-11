<<<<<<< HEAD
//I just spotted some minor things that could be cleaned up code-wise
//I don't have the time to write tests for this today, so code may be non-functional

var express = require('express'),
    twilio  = require('twilio'),
    router  = express.Router(),
    request = require('request'),
    cheerio = require('cheerio'),
    zlib    = require('zlib');

function padLeftTo(string, padChar, numChars) {
    'use strict';
    var padded = (new Array(numChars-string.length+1)).join(padChar) + string;
    return padded
}

function unicodeToBinary(char) {
    'use strict';
    var UTF_BITS = 8,
        binary = char.split('').map(function(codepoint) {
                return padLeftTo(codepoint.charCodeAt(0).toString(2), 0, UTF_BITS);
            }).join('');
    return binary;
    //         ^^^^( ignore this part if you just want a string )^^^^
}

function binaryToUnicode(binaryList) {
    'use strict';
    var codepointsAsNumbers = [],
        codepointBits,
        UTF_BITS = 8,
        unicode;
    while( binaryList.length>0 ){
        codepointBits = binaryList.slice(0,UTF_BITS);
        binaryList = binaryList.slice(UTF_BITS);
        codepointsAsNumbers.push( parseInt(codepointBits.join(''),2) );
    }

    unicode = String.fromCharCode.apply(this,codepointsAsNumbers);

    return unicode;
}

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
      //msg was previously defined as a global. Not a good idea to have functions depend on
      //globals, so I put it in here. As far as I can see, this is the only function that needs
      //access to it. Strict mode also enforces that a function may never access a global
      //so if it gets put as a global, this script will throw an error because of security.

    function sendIt(temp, resp, sendItRes){
      var messages = new Array, slices = Math.ceil(temp.length/1594);

      for(var i=0;i<slices;i++){
        messages.push(i+' '+temp.substring(i*1594,(i*1594+1594)));
      }

      for(var j=0;j<messages.length;j++){
        resp.message(messages[j]);
      }

      res.sendItRes(resp.toString());
    }
=======
/*jslint node : true */

//I just spotted some minor things that could be cleaned up code-wise
//I don't have the time to write tests for this today, so code may be non-functional

var express = require('express'),
    twilio  = require('twilio'),
    router  = express.Router(),
    request = require('request'),
    cheerio = require('cheerio'),
    zlib    = require('zlib'),
    helpers = require('./helperMaster');

/* GET users listing. */
router.get('/', function ( req, res ) {
    'use strict';
    res.send('lolzard');
});

router.post('/sms', function ( req, res ) {
    'use strict';
    var resp = new twilio.TwimlResponse(),
        tURL = req.body.Body;

    request(tURL, function ( requestError, requestResponse, requestBody ) {
        var msg = helpers.cheerioHandler(requestBody);

        if (requestError) {
            throw requstError;
        }
        zlib.gzip(msg, function ( zlibError, zlibResult ) {
            var messageToSend = new Buffer(msg).toString('base64');

            if (zlibError) {
                throw zlibError;
            }

            //Not sure what is going on here?
            //Why isn't the result variable being used?

            helpers.sendIt(messageToSend, resp, res);
        });
    });
});

module.exports = router;
