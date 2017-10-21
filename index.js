'use strict';

var request = require('request');
//require('request-debug')(request);
var xml2js = require('xml2js');
var crypto = require('crypto');

module.exports = function(options) {

  options = options || {};
  this.options = options;
  let _self = this;

  var cookieJar = request.jar();

  var endpoints = {
    login: {
      path: "/goform/login",
      typeID: 1
    },
    snapshot: {
      path: "/snapshot/view0.jpg",
      typeID: 1
    },
    config: {
      path: "/goform/config",
      typeID: 0
    },
    signature: "GDS3710lZpRsFzCbM"
  }

  var mergeOverride = function(override) {
    var options = _self.options;
    for (var key in override) {
      // skip loop if the property is from prototype
      if (!override.hasOwnProperty(key)) continue;
      options[key] = override[key];
    }
    return options;
  }

  this.post = function(override, endpoint, data, cb) {
    options = mergeOverride(override);
    var url = options.server + endpoint;

    var requestOptions = {
      url: url,
      jar: cookieJar,
      form: data
    }

    if (options.insecure && options.insecure == true){
      requestOptions.rejectUnauthorized = false;
    }

    request.post(requestOptions, cb);
  }

  this.get = function(override, endpoint, data, cb) {
    options = mergeOverride(override);
    var url = options.server + endpoint;

    var requestOptions = {
      url: url,
      jar: cookieJar,
      form: data
    }

    if (options.insecure && options.insecure == true){
      requestOptions.rejectUnauthorized = false;
    }

    request.get(requestOptions, cb);

  }


  this.login = function(override, typeID, cb) {
    options = mergeOverride(override);
    typeID = typeID || endpoints.login.typeID;

    var loginData = {
      cmd: "login",
      user: options.username,
      type: typeID
    }

    _self.post(override, endpoints.login.path, loginData, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        var parser = new xml2js.Parser();
        parser.parseString(body, function(err, result) {
          if (err) throw err;
          if (result.Configuration && result.Configuration.ChallengeCode) {
            var challengeCode = result.Configuration.ChallengeCode[0];
            var authString = challengeCode + ":" + endpoints.signature + ":" + options.password;
            var key1 = crypto.createHash('md5').update(authString).digest('hex');
            var authStringMD5 = key1.toString();
            loginData = {
              cmd: "login",
              user: options.username,
              authcode: authStringMD5,
              type: typeID
            }
            _self.post(override, endpoints.login.path, loginData, function(error, response, body) {
              if (error) throw error;
              var cookies = cookieJar.getCookies(options.server);
              parser.parseString(body, function(err, result) {
                if (err) throw err;
                var sessionData = {};
                for (var i = 0; i < cookies.length; i++) {
                  sessionData[cookies[i].key] = cookies[i].value;
                }
                if(cb !== undefined) return cb(undefined, sessionData);
                return(sessionData);
              })
            });

          } else {
            //Throw error
          }
        });

      } else {
        console.log(JSON.stringify(error));
      }
    });

  }

  this.getSnapshot = function(override, cb){
    _self.login(override, endpoints.snapshot.typeID, function(error, sessionData){
      if(error) throw error;
      _self.get(override, endpoints.snapshot.path, null, function(error, response, body){
        if(cb !== undefined) return cb(undefined, body);
        return(body);
      });
    });
  }

};
