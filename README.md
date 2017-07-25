# NodeJS-wrapper for SMHI Open Data API

Simple wrapper for SMHI Open Data API - Meteorological Forecasts - as defined at
http://opendata.smhi.se/apidocs/metfcst/index.html


Example usage:
```
const smhi = require('smhi');

//Get forecast for geographical point
smhi.GetPointForecast(55.5177586, 12.9883223)
    .on("loaded", (data) => {
        console.log(data);
    });
```

All function names are the same as in the original documentation. For example, "GetPointForecast" is `smhi.GetPointForecast`. Response data is parsed with `JSON.parse()´, with no other modifications. The API is pretty well documented at [smhi.se](http://opendata.smhi.se/apidocs/metfcst/index.html).




