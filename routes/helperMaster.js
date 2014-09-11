var cheerio = require('cheerio');

var helperMaster = function() {

    'use strict';
    this.UTF_BITS = 8;

    this.cheerioHandler = function ( body ) {
        var $ = cheerio.load(body),
            bodyToReturn;
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

        bodyToReturn = $('body').html() + '';
        return bodyToReturn;
    }

    this.padLeftTo = function ( string, padChar, numChars ) {
        var padded = (new Array(numChars-string.length+1)).join(padChar) + string;
        return padded
    };

    this.unicodeToBinary = function ( char ) {

        var binary = char.split('').map(function ( codepoint ) {
                    return padLeftTo(codepoint.charCodeAt(0).toString(2), 0, this.UTF_BITS);
                }).join('');
        return binary;
        //         ^^^^( ignore this part if you just want a string )^^^^
    };

    this.binaryToUnicode = function( binaryList ) {

        var codepointsAsNumbers = [],
            codepointBits,
            unicode;
        while( binaryList.length > 0 ) {
            codepointBits = binaryList.slice(0,this.UTF_BITS);
            binaryList = binaryList.slice(this.UTF_BITS);
            codepointsAsNumbers.push( parseInt(codepointBits.join(''),2) );
        }

        unicode = String.fromCharCode.apply(this,codepointsAsNumbers);

        return unicode;
    };

    this.sendIt = function ( temp, resp, sendItRes ) {

        var messages = [], slices = Math.ceil(temp.length/1594);

        for( var i = 0; i < slices; i++ ) {
            messages.push(i + ' ' + temp.substring( i *1594, (i * 1594+1594)) );
        }

        for( var j = 0; j < messages.length; j++ ) {
            resp.message(messages[j]);
        }

        res.sendItRes(resp.toString());
    };
}


module.exports =  new helperMaster();
