/*jsling node: true */

var cheerio = require('cheerio');

var helperMaster = function () {
  'use strict';
  this.cheerioHandler = function (body, callback) {
    try {
      var $ = cheerio.load(body),
        msg = '';
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

      msg = $('body').html();
      callback(null, msg);
    } catch (err) {
      callback(err);
    }
  };

  this.sendIt = function (messageToSend, twillioResponse, sendItRes, callback) {
    try {
      var messages = [],
        slices = Math.ceil(messageToSend.length / 160),
        j = 0,
        i = 0;

      console.log("Slices:\t" + slices);
      for (i = 0; i < slices; i++) {
        if (i === slices - 1) {
          //What exactly are these numbers? Related to the max length of an SMS?
          messages.push(i + '%' + messageToSend.substring(i * 158, (i * 158 + 158)) + '%');
        } else {
          messages.push(i + '%' + messageToSend.substring(i * 159, (i * 159 + 159)));
        }
      }

      for (j = 0; j < messages.length; j++) {
        twillioResponse.message(messages[j]);
      }

      callback(null, twillioResponse);
    } catch (err) {
      callback(err);
    }
  };
};