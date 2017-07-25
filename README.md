# NodeJS-wrapper for SMHI Open Data API

Simple wrapper for SMHI Open Data API - Meteorological Forecasts.
http://opendata.smhi.se/apidocs/metfcst/index.html. 


Example usage:
```
const
    smhi = require('smhi');

smhi.GetPointForecast(55.5177586, 12.9883223)
    .on("loaded", (data) => {
        console.log(data);
    });
```

All function names are the same as in the original documentation. Responses are kept intact, after parsing width `JSON.parse()´. 


