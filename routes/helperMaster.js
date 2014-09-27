/*jsling node: true */

var cheerio = require('cheerio');

var HelperMaster = function () {
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
          messages.push(i + '%' + messageToSend.substring(i * 150, (i * 150 + 150)) + '*'+slices+'*');
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

module.exports = new HelperMaster();
