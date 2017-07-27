/**
 * @module smhi
 * @author Peter Stark <peterstark72@gmail.com>
 *
 * @license
 * The MIT License (MIT)
 * Copyright (c) 2017 Peter Stark
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER 
 * DEALINGS IN THE SOFTWARE.
*/

const
    url             = require('url'),
    https           = require('https'),
    zlib            = require('zlib'),
    events          = require('events');

const
    API_HOST = "opendata-download-metfcst.smhi.se",
    API_CATEGORY = "pmp3g", //Latest as of July, 2017
    API_VERSION = "2"; //Latest as of July, 2017

/** 
 * Loads JSON data
 * @param {options} - The URL options, same as standard http.request()
 * @return {EventEmitter} 
 * @emits 'loaded' when data is loaded 
 * @emits 'error' when there is an error
*/
function loadJSON (options) {

    var emitter = new events.EventEmitter();

    let body = '',
        obj,
        req;

    //console.log(options.path);

    req = https.get(options);
    req.on('response', function (res) {

        let response;

        if (res.statusCode != 200) {
            emitter.emit("error", new Error("HTTP error"));
            return;
        }
        
        //If gzip, we decompress the response stream
        if (res.headers['content-encoding'] == "gzip") {
            response = zlib.createGunzip();
            res.pipe(response);
        } else {
            //Otherwise, use the stream as is
            response = res;
        }

        //Just add to body when new data arrives
        response.on('data', function (data) {
            body += data;
        });

        //Last, parse as JSON
        response.on('end', function () {
            try {
                obj = JSON.parse(body);
                emitter.emit('loaded', obj);
            } catch (err) {
                emitter.emit('error', err);
            }
        });
    });

    req.on('error', function (e) {
        emitter.emit('error', e);
    });

    return emitter;
}

var Forecasts = {};

/*
 * GetPointForecasts loads forecast for a given point
 * @param {float} latitude
 * @param {float} longitude
 * @returns {EventEmiter} that emits "loaded" when data is 
 * 
 */
Forecasts.GetPointForecast = function(latitude, longitude) {

    //Coordinates must have maximum 6 decimals
    latitude = parseFloat(latitude).toFixed(6);
    longitude = parseFloat(longitude).toFixed(6);
    
    const opt = {
        hostname: API_HOST,
        path: `/api/category/${API_CATEGORY}/version/${API_VERSION}/geotype/point/lon/${longitude}/lat/${latitude}/data.json`
    };
    return loadJSON(opt);
}

/*
 * Validtime returns valid times for the current Forecasts Use this with GetMultiPointForecast
 * http://opendata.smhi.se/apidocs/metfcst/valid_time.html
 * 
 */
Forecasts.ValidTime = function() {
    const opt = {
        hostname: API_HOST,
        path: `/api/category/${API_CATEGORY}/version/${API_VERSION}/validtime.json`
    };    
    return loadJSON(opt);
}

/*
 * Polygon returns the forecast polygon coordinates
 * http://opendata.smhi.se/apidocs/metfcst/geographic_area.html
 * 
 */
Forecasts.Polygon = function() {
    const opt = {
        hostname: API_HOST,
        path: `/api/category/${API_CATEGORY}/version/${API_VERSION}/geotype/polygon.json`
    };    
    return loadJSON(opt);
}

/*
 * BasicInfo returns parameter definitions
 * http://opendata.smhi.se/apidocs/metfcst/parameters.html
 */
Forecasts.BasicInfo = function() {
    const opt = {
        hostname: API_HOST,
        path: `/api/category/${API_CATEGORY}/version/${API_VERSION}/parameter.json`
    }
    return loadJSON(opt);
}

/*
 * MultiPoint returns all the point
 * 
 * BEWARE!!! Very large response!
 */
Forecasts.MultiPoint = function() {
    const opt = {
        hostname: API_HOST,
        path: `/api/category/${API_CATEGORY}/version/${API_VERSION}/geotype/multipoint.json?downsample=2`,
        headers: {
            "Accept-Encoding": "gzip"
        }
    };
    return loadJSON(opt);
}

/*
 * GetMultiPointForecast returns all the point
 * 
 * BEWARE!!! Very large response!
 */
Forecasts.GetMultiPointForecast = function(validTime, parameter, levelType, level) {
    const d = new Date(validTime).toISOString().replace(/-|:|\./g,"").slice(0, 15) + 'Z',
          opt = {
              hostname: API_HOST,
              path: `/api/category/${API_CATEGORY}/version/${API_VERSION}/geotype/multipoint/validtime/${d}/parameter/${parameter}/leveltype/${levelType}/level/${level}/data.json?with-geo=false&downsample=2`,
              headers: {
                "Accept-Encoding": "gzip"
            }
          };
    return loadJSON(opt);
}

module.exports = Forecasts;