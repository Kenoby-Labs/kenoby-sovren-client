'use strict';

var soap, async, parser;
soap = require('soap');
async = require('async');
parser = require('xml2json');

module.exports = function sovrenClient(url, id, key) {
  return function (file, next) {
    async.waterfall([function (next) {
      soap.createClient(url, next);
    }, function (client, next) {
      client.ParsingService.ParsingServiceSoap12.ParseResume({'request' : {
        'AccountId'     : id,
        'ServiceKey'    : key,
        'FileBytes'     : file,//(new Buffer(file)).toString('base64'),
        'Configuration' : '_100000_0_00000001_1101010110001101_1_0001111111111111111102011001101110000110000000000010000000100'
      }}, next);
    }, function (data, _, a, next) {
      next(null, parser.toJson(data.ParseResumeResult.Xml, {'object': true}));
    }], next);
  };
};
