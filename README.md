# GDS3710
Interact with the Grandstream GDS3710 with Node JS

### Work in Progress
At the moment, there is very little (no!) error handling.
You can only call .getSnapshot() - it returns a snapshot.

More to come as time permits.

```
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
```
