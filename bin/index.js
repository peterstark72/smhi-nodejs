#!/usr/bin/env node
/*Forecast.js
 *
 * Command line utiity for getting SMHI forecasts
 * 
 * 
 */
const 
    assert = require('assert'),
    smhi = require('smhi');

//Make sure we have proper arguments
assert(process.argv.length == 4);

//Convert lat, lon to numbers
var lat = Number(process.argv[2]);
var lon = Number(process.argv[3]);

smhi.GetPointForecast(lat, lon).on("loaded", PrintForecast);

function PrintForecast(data) {

    var latest = data.timeSeries[0];

    console.log(latest.validTime);
    for (param in latest.parameters) {
        console.log(latest.parameters[param]['name'], "=", latest.parameters[param]['values'][0]);
    }

}