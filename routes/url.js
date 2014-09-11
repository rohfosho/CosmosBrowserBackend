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
