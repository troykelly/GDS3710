'use strict';


var GDS3710 = require('@troykelly/gds3710');

var options = {
  username: "admin",
  password: "admin",
  server: "https://192.168.86.3",
  insecure: true
}

var gds3710 = new GDS3710(options);

gds3710.getSnapshot(null, function(error, imageData){
  if(error) throw error;
  console.log(imageData.length);
});
