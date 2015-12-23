'use strict';

var q, soap, async, parser;
q = require('q');
soap = require('soap');
async = require('async');
parser = require('xml2js').parseString;

module.exports = function sovrenClient(url, id, key) {
  return function (file, next) {
    var deferred = q.defer();

    async.waterfall([
      function (next) {
        soap.createClient(url, next);
      },
      function (client, next) {
        client.ParsingService.ParsingServiceSoap12.ParseResume({'request' : {
          'AccountId'     : id,
          'ServiceKey'    : key,
          'FileBytes'     : (new Buffer(file)).toString('base64'),
          'Configuration' : '_100000_0_00000001_1101010110001101_1_0001111111111111111102011001101110000110000000000010000000100'
        }}, next);
      },
      function (data, _, a, next) {
        parser(data.ParseResumeResult.Xml, next);
      }
    ], function (error, parsed) {
      if (error) {
        deferred.reject(new Error(error));
      } else {
        deferred.resolve(parsed);
      }

      if (next) next(error, parsed);
    });

    return deferred.promise;
  };
};
