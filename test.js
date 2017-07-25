const smhi = require("./smhi.js");

smhi.GetPointForecast(55.519, 12.995)
    .on("loaded", (data) => {

        var forecasts = data.timeSeries.map(function (ts) {
            var res = {};
            res["time"] = ts.validTime;
            ts.parameters.forEach(function(p) {
                res[p['name']] = p['values'][0];
            });
            return res;
        });

        console.log(forecasts[0]);
    })
    .on("error", (err) => {
        console.log(err);
    });