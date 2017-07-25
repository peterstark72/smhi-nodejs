# NodeJS-wrapper for SMHI Open Data API

Simple wrapper for SMHI Open Data API - Meteorological Forecasts - as defined at
http://opendata.smhi.se/apidocs/metfcst/index.html.

All functions return an `EventEmitter()`. After calling a function, you wait for `loaded` and `error` events. 

Example usage:
```
const smhi = require('smhi');

//Get forecast for geographical point
smhi.GetPointForecast(55.5177586, 12.9883223)
    .on("loaded", (data) => {

        //Success, we have the data
        console.log(data);
    })
    .on("error", (err) => {
        //Oops, something went wrong
    })
```

All function names are the same as in the original documentation. For example, "GetPointForecast" is `smhi.GetPointForecast`. Response data is parsed with `JSON.parse()´, with no other modifications. The API is pretty well documented at [smhi.se](http://opendata.smhi.se/apidocs/metfcst/index.html).

### Command line utility
There is also a simple command line utility.
```
forecast <lat> <lon>

forecast 55.5197809 12.9957763
```


