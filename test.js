const
    assert = require('assert'),
    smhi = require("./smhi.js");

smhi
    .GetPointForecast(55.5177586, 12.9883223)
    .on("loaded", (data) => {assert(data.approvedTime, "FAIL: GetPointForecast")});

smhi
    .ValidTime()
    .on("loaded", (data) => {assert(data.validTime, "FAIL: ValidTime")});

smhi
    .Polygon()
    .on("loaded", (data) => {assert(data, "FAIL: Polygon")});

smhi
    .BasicInfo()
    .on("loaded", (data) => {assert(data.parameter, "FAIL: BasicInfo")});
