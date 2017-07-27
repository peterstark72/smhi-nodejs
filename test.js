const
    assert = require('assert'),
    smhi = require("./lib").Forecasts;

smhi
    .GetPointForecast(55.5177586, 12.9883223)
    .on("loaded", (data) => {assert(data.approvedTime, "GetPointForecast")});

smhi
    .ValidTime()
    .on("loaded", (data) => {assert(data.validTime, "ValidTime")});

smhi
    .Polygon()
    .on("loaded", (data) => {assert(data, "Polygon")});

smhi
    .BasicInfo()
    .on("loaded", (data) => {assert(data.parameter, "BasicInfo")});
