/*
 *
 * To enable this backend, include './backends/riemann' in the backends
 * configuration array:
 *
 *  Require Reimann-Node plugin for connecting to Riemann Master Server
 *
 *   backends: ['./backends/riemann']
 *
 */

var net = require('net'),
   util = require('util'),
   http = require('http');
   client = require('riemann').createClient({
            host: riemannHost,
  	    port: riemannPort });
var debug;
var flushInterval;
var APIKey;
var service;
var service_name;
var time_stamp;
var riemannStats = {};
var riemannHost;
var riemannPort;
var post_stats = function riemann_post_metrics(statString, service_name, time_stamp) {
util.log(statString);
riemannStats.last_exception = Math.round(new Date().getTime() / 1000);

client.send(client.Event({
  service: service_name,
  metric:  statsString,
  time: time_stamp
}));

};

var flush_stats = function riemann_flush(ts, metrics) {
  var statString = '';
  var numStats = 0;
  var key;

  var counters = metrics.counters;
  var gauges = metrics.gauges;
  var timers = metrics.timers;
  var pctThreshold = metrics.pctThreshold;

  for (key in counters) {
    var value = counters[key];
    var valuePerSecond = value / (flushInterval / 1000); // calculate "per second" rate

    statsString = value;
    service_name = key;
    time_stamp = ts;
    util.log(statsString)
    util.log(service_name)
    util.log(time_stamp)
    post_stats(statString, service_name, time_stamp);
  }

};

var backend_status = function riemann_status(writeCb) {
  for (stat in riemannStats) {
    writeCb(null, riemann, stat, riemannStats[stat]);
  }
};

exports.init = function riemann_init(startup_time, config, events) {
  debug = config.debug;
  riemannHost = config.riemannHost;
  riemannPort = config.riemannPort;
  riemannStats.last_flush = startup_time;
  riemannStats.last_exception = startup_time;

//  flushInterval = config.flushInterval;
  flushInterval = 1000;
  events.on('flush', flush_stats);
  events.on('status', backend_status);

  return true;
};
