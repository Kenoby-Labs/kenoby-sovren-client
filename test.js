'use strict';

var fs = require('fs');

var url = 'http://services.resumeparsing.com/ParsingService.asmx?wsdl';
var id = '23974333';
var key = 'z7pbRr+bTORRntc9AiFeoxquTiotTs3N2bMCvgkH';
var client = require('./index')(url, id, key);

var file = fs.readFileSync('./cv2.doc');

client(file, function(_null, json){
  console.log(JSON.stringify(json, null, '  '));
});
