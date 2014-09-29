/*jslint node: true */

var cheerio = require('cheerio');

var HelperMaster = function () {
        'use strict';
        this.cheerioHandler = function (body, callback) {
            try {
                var $ = cheerio.load(body),
                    strippedMessage = '';
                $('img').remove();
                $('head').remove();
                $('script').remove();
                $('link').remove();
                $('body').children().removeAttr('style');
                $('body').children().removeAttr('id');
                $('body').children().removeAttr('name');
                $('body').children().removeAttr('src');
                $('body').children().removeAttr('href');
                $('body').children().removeAttr('*');

                strippedMessage = $('body').html();
                callback(null, strippedMessage);
            } catch (err) {
                callback(err);
            }
        };

        this.sendIt = function (messagesToSend, twillioResponse, sendItRes, callback) {
            try {
                var subMessage,
                    subMessageStartIndex,
                    subMessageEndIndex,
                    textMessageLength = 150,
                    prefix,
                    streamLength = Math.ceil(messagesToSend.length / 160),
                    streamLengthIndicator = '*' + streamLength + '*',
                    i = 0;

                console.log("streamLength:\t" + streamLength);
                for (i = 0; i < streamLength; i += 1) {               //Changed because JSLint has some beef with i++...
                    subMessageStartIndex = i * textMessageLength;
                    subMessageEndIndex = i * textMessageLength + textMessageLength;
                    prefix = i + '%';

                    subMessage = prefix + messagesToSend.substring(subMessageStartIndex, subMessageEndIndex) + streamLengthIndicator;
                    twillioResponse.message(subMessage);
                }

                callback(null, twillioResponse);
                
            } catch (err) {
                callback(err);
            }
        };
    };

module.exports = new HelperMaster();
