'use strict';


var GDS3710 = require('../');

var options = {
  username: "admin",
  password: "p00ntang",
  server: "https://10.7.3.121",
  insecure: true
}

var gds3710 = new GDS3710(options);

gds3710.getSnapshot(null, function(error, imageData){
  if(error) throw error;
  console.log(imageData.length);
});
