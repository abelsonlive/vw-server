var path = require('path')
  , spawn = require('child_process').spawn
  , fs = require('fs')
  , _ = require('lodash')
  , colors = require('colors')
  , VW_PATH = path.join(__dirname, "../vowpal_wabbit", "vowpalwabbit", "vw")
  , DEFAULT_PARAMS = [
      "--adaptive",
      "--normalized",
      "-p", "/dev/stdout"
    ];


module.exports = function(handleStdout, handleStderr, params, delim, log) {
  params = params || DEFAULT_PARAMS;

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

  train = function(_id, features, label) {
    // define the training label and the feature namespace
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


