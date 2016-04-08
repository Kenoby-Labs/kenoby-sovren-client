'use strict';

let q = require('q');
let soap = require('soap');
let async = require('async');
let parser = require('xml2js').parseString;

let sovrenClient = (url, id, key) => {
  return (file, next) => {
    let deferred = q.defer();

    async.waterfall([
      (next) => {
        soap.createClient(url, next);
      },
      (client, next) => {
        client.ParsingService.ParsingServiceSoap12.ParseResume({'request' : {
          'AccountId'     : id,
          'ServiceKey'    : key,
          'FileBytes'     : (new Buffer(file)).toString('base64'),
          'Configuration' : '_100000_0_00000001_1101010110001101_1_0001111111111111111102011001101110000110000000000010000000100'
        }}, next);
      },
      (data, _, a, next) => {
        parser(data.ParseResumeResult.Xml, next);
      }
    ], (error, parsed) => {
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

module.exports = sovrenClient;