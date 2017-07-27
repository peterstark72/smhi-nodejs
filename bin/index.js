#!/usr/bin/env node
/*Forecast.js
 *
 * Command line utiity for getting SMHI forecasts
 * 
 * 
 */
const 
    assert = require('assert'),
    smhi = require('../lib').Forecasts;

//Make sure we have proper arguments
if (process.argv.length != 4) {
    console.error("<lat> <lon>");
    return
}

//Convert lat, lon to numbers
var lat = Number(process.argv[2]);
var lon = Number(process.argv[3]);

smhi.GetPointForecast(lat, lon).on("loaded", PrintForecast);

function PrintForecast(data) {

    for (var i = 0, imax = data.timeSeries.length; i < imax; i++) {
        
        var d = new Date(data.timeSeries[i].validTime);

        var parameters = data.timeSeries[i].parameters.reduce((obj, p) => {
            obj[p['name']] = p['values'][0] + " " + p['unit'];
            return obj;
        }, {});
        console.log(`${d.toDateString()} : ${d.toTimeString()} : ${parameters['t']},${parameters['ws']},${parameters['pmean']}`);
    } 
}