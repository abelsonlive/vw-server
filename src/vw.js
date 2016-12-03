var path = require('path')
  , spawn = require('child_process').spawn
  , fs = require('fs')
  , _ = require('lodash')
  , colors = require('colors')
  , VW_PATH = process.env['VW_SERVER_PATH'] || "/usr/local/bin/vw"
  , DEFAULT_PARAMS = [
      "--adaptive",
      "--normalized"
    ];


module.exports = function(handleStdout, handleStderr, params, delim, log) {
  params = params || DEFAULT_PARAMS;
  var pidx = params.indexOf("-p");
  if (pidx > -1) {
    params.splice(pidx);
    if (pidx < params.length) {
      params.splice(pidx);
    }
  }
  params.push("-p");
  params.push("/dev/stdout");

  if (log==undefined) {
    log = true;
  }
  var vw = spawn(VW_PATH, params);

  console.log("starting vw:");
  console.log("\tvw ".red + params.join(" "));

  vw.on("error", function(err) {
    console.log(err);
  });

  vw.on("close", function(err) {
    console.log(err);
  });

  vw.stdout.on("data", function(data) {
    handleStdout(data);
  });

  vw.stderr.on("data", function(data) {
    handleStderr(data);
  });

  train = function(_id, features, label, n) {
    n = n || 1;
    // define the training label and the feature namespace
    var formatted = label + " "  + n + " " + _id + "| ";
    var formatted = label + " " + _id + "| ";
    _.pairs(features).forEach(function(pair) {
      formatted += pair.join(":") + " ";
    });
    formatted += "const: 1.0"
    if (log==true) {
      console.log(formatted.yellow)
    }
    vw.stdin.write(formatted + "\n");
  };

  predict = function(_id, features) {
    var formatted = _id + "| ";
    _.pairs(features).forEach(function(pair) {
      formatted += pair.join(":") + " ";
    });
    if (log==true) {
      console.log(formatted.yellow)
    }
    vw.stdin.write(formatted + "\n");
  };

  return {
      train: train,
      predict: predict
  }
};


