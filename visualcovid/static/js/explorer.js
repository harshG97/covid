var playState;
var currentChart;
var m_names = new Array("Jan", "Feb", "Mar",
  "Apr", "May", "Jun", "Jul", "Aug", "Sept",
  "Oct", "Nov", "Dec");
var time = document.getElementById("timeselect").value;
var yaxisType = document.getElementById("yaxis").value;
var xaxisType = document.getElementById("xaxis").value;
var dateList = [];
var n;
var maxXaxis = 0;
var maxYaxis = 0;
var keys = [];
var chartList = [];
var chartInstanceList = [];
var id = 1;

var timeselect = new Choices('#timeselect', {
  removeItemButton: false,
  itemSelectText: '',
  searchEnabled: false,
});

timeselect.passedElement.element.addEventListener(
  'addItem',
  function (event) {
    time = event.detail.value;
  },
  false,
);

var yaxis = new Choices('#yaxis', {
  removeItemButton: false,
  itemSelectText: '',
  searchEnabled: false,
});

yaxis.passedElement.element.addEventListener(
  'addItem',
  function (event) {
    yaxisType = event.detail.value;
  },
  false,
);

var xaxis = new Choices('#xaxis', {
  removeItemButton: false,
  itemSelectText: '',
  searchEnabled: false,
});

xaxis.passedElement.element.addEventListener(
  'addItem',
  function (event) {
    xaxisType = event.detail.value;
    console.log("xaxistype", xaxisType);
  },
  false,
);


var plotBtnClickNew = async function () {

  var chartcontainer = document.getElementById("chartcntnr");
  if (chartcontainer.hasChildNodes()) {
    console.log("yess!!!");

    for (var i = 0; i < chartcontainer.childNodes.length; ++i) {
      chartcontainer.removeChild(chartcontainer.childNodes[i]);
    }
  }

  if (!allCountries) {
    console.log("!!!");
    for (var i = 0; ; i++) {
      console.log("!");
      if (allCountries) {
        break;
      }
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  var countriesReq = [];
  if (countriesSelect.includes("all")) {
    countriesReq.push("All");
  }
  if (countriesSelect.includes("top10")) {
    countriesReq.push(...allCountries.slice(0, 10));
  }

  for (var i in countriesSelect) {
    if (countriesSelect[i] != "top10" && countriesSelect[i] != "all") {
      console.log("country", countriesSelect[i]);
      if (!countriesReq.includes(countriesSelect[i])) {
        countriesReq.push(countriesSelect[i]);
      }
    }
  }


  dateList = [];
  if (time == -1) {
    keys = Object.keys(allDataConfirmed);
  }
  else {
    keys = Object.keys(allDataConfirmed).slice(-1 * time);
  }

  var tableDataList = [];
  var yaxisData = [];
  var xaxisData = [];
  maxXaxis = 0;
  maxYaxis = 0;

  if (yaxisType == 'Confirmed cases') {
    if (allDataConfirmed == null) {
      for (var i = 0; ; i++) {
        if (allDataConfirmed != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }

    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20" + date[2], date[0] - 1, date[1]));
      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataConfirmed[keys[i]][countriesReq[j]]);
        maxYaxis = maxYaxis > allDataConfirmed[keys[i]][countriesReq[j]] ? maxYaxis : allDataConfirmed[keys[i]][countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Confirmed cases/1000 population') {
    if (allDataConfirmed == null) {
      for (var i = 0; ; i++) {
        if (allDataConfirmed != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {

      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20" + date[2], date[0] - 1, date[1]));
      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataConfirmed[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]]);
        maxYaxis = maxYaxis > allDataConfirmed[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]] ? maxYaxis : allDataConfirmed[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Deaths/1000 population') {
    if (allDataDeath == null) {
      for (var i = 0; ; i++) {
        if (allDataDeath != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20" + date[2], date[0] - 1, date[1]));
      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataDeath[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]]);
        maxYaxis = maxYaxis > allDataDeath[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]] ? maxYaxis : allDataDeath[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Median age') {
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20" + date[2], date[0] - 1, date[1]));
      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(medianAgeIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]]);
        maxYaxis = maxYaxis > medianAgeIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]] ? maxYaxis : medianAgeIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Population') {
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20" + date[2], date[0] - 1, date[1]));
      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]] * 1000);
        maxYaxis = maxYaxis > populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]] * 1000 ? maxYaxis : populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]] * 1000;
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'time') {
  }
  else if (yaxisType == 'Death percentage') {
    if (allDataDeath == null) {
      for (var i = 0; ; i++) {
        console.log("2");
        if (allDataDeath != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }

    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20" + date[2], date[0] - 1, date[1]));
      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(100 * allDataDeath[keys[i]][countriesReq[j]] / allDataConfirmed[keys[i]][countriesReq[j]]);
        maxYaxis = maxYaxis > 100 * allDataDeath[keys[i]][countriesReq[j]] / allDataConfirmed[keys[i]][countriesReq[j]] ? maxYaxis : 100 * allDataDeath[keys[i]][countriesReq[j]] / allDataConfirmed[keys[i]][countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Active cases') {
    if (allDataActive == null) {
      for (var i = 0; ; i++) {
        if (allDataActive != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20" + date[2], date[0] - 1, date[1]));
      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataActive[keys[i]][countriesReq[j]]);
        maxYaxis = maxYaxis > allDataActive[keys[i]][countriesReq[j]] ? maxYaxis : allDataActive[keys[i]][countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Deaths') {
    if (allDataDeath == null) {
      for (var i = 0; ; i++) {
        if (allDataDeath != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20" + date[2], date[0] - 1, date[1]));
      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataDeath[keys[i]][countriesReq[j]]);
        maxYaxis = maxYaxis > allDataDeath[keys[i]][countriesReq[j]] ? maxYaxis : allDataDeath[keys[i]][countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'New cases/day') {
    if (allDataNew == null) {
      for (var i = 0; ; i++) {
        if (allDataNew != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20" + date[2], date[0] - 1, date[1]));
      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataNew[keys[i]][countriesReq[j]]);
        maxYaxis = maxYaxis > allDataNew[keys[i]][countriesReq[j]] ? maxYaxis : allDataNew[keys[i]][countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'growthfactor') {

  }


  if (xaxisType == 'Confirmed cases') {
    if (allDataConfirmed == null) {
      for (var i = 0; ; i++) {
        if (allDataConfirmed != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];

      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataConfirmed[keys[i]][countriesReq[j]]);
        maxXaxis = maxXaxis > allDataConfirmed[keys[i]][countriesReq[j]] ? maxXaxis : allDataConfirmed[keys[i]][countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Confirmed cases/1000 population') {
    if (allDataConfirmed == null) {
      for (var i = 0; ; i++) {
        console.log("2");
        if (allDataConfirmed != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];

      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataConfirmed[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]]);
        maxXaxis = maxXaxis > allDataConfirmed[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]] ? maxXaxis : allDataConfirmed[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Deaths/1000 population') {
    if (allDataDeath == null) {
      for (var i = 0; ; i++) {
        if (allDataDeath != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];

      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataDeath[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]]);
        maxXaxis = maxXaxis > allDataDeath[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]] ? maxXaxis : allDataDeath[keys[i]][countriesReq[j]] / populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Median age') {
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];

      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(medianAgeIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]]);
        maxXaxis = maxXaxis > medianAgeIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]] ? maxXaxis : medianAgeIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Population') {
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];

      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(populationIndexed[iso3toCountryName[longOrTwoToThree[countriesReq[j]]]] * 1000);
        maxXaxis = maxXaxis > dateList[i] ? maxXaxis : dateList[i];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'time') {

  }
  else if (xaxisType == 'Death percentage') {
    if (allDataDeath == null) {
      for (var i = 0; ; i++) {
        console.log("2");
        if (allDataDeath != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];

      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(100 * allDataDeath[keys[i]][countriesReq[j]] / allDataConfirmed[keys[i]][countriesReq[j]]);
        maxXaxis = maxXaxis > 100 * allDataDeath[keys[i]][countriesReq[j]] / allDataConfirmed[keys[i]][countriesReq[j]] ? maxXaxis : 100 * allDataDeath[keys[i]][countriesReq[j]] / allDataConfirmed[keys[i]][countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Active cases') {
    if (allDataActive == null) {
      for (var i = 0; ; i++) {
        if (allDataActive != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];

      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataActive[keys[i]][countriesReq[j]]);
        maxXaxis = maxXaxis > allDataActive[keys[i]][countriesReq[j]] ? maxXaxis : allDataActive[keys[i]][countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Deaths') {
    if (allDataDeath == null) {
      for (var i = 0; ; i++) {
        if (allDataDeath != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstanceY = [];

      for (var j = 0; j < countriesReq.length; ++j) {
        datainstanceY.push(allDataDeath[keys[i]][countriesReq[j]]);
        maxXaxis = maxXaxis > allDataDeath[keys[i]][countriesReq[j]] ? maxXaxis : allDataDeath[keys[i]][countriesReq[j]];
      }
      xaxisData.push(datainstanceY);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'New cases/day') {
    if (allDataNew == null) {
      for (var i = 0; ; i++) {
        if (allDataNew != null) {
          break;
        }
        await new Promise(r => setTimeout(r, 500));
      }
    }
    for (var i = 0; i < keys.length; ++i) {
      var datainstance = [];

      for (var j = 0; j < countriesReq.length; ++j) {
        datainstance.push(allDataNew[keys[i]][countriesReq[j]]);
        maxXaxis = maxXaxis > allDataNew[keys[i]][countriesReq[j]] ? maxXaxis : allDataNew[keys[i]][countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for (var i = 0; i < keys.length; ++i) {
        tableDataObject[keys[i]] = xaxisData[i][j];
      }

      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'growthfactor') {

  }


  console.log("yaxisdata", yaxisData);
  console.log("xaxisdata", xaxisData);
  var chartDataList = [];
  for (var i = 0; i < keys.length; ++i) {
    var countryDataList = [];
    for (var j = 0; j < countriesReq.length; ++j) {
      var datainstance = [{
        "xaxis": xaxisData[i][j],
        "yaxis": yaxisData[i][j]
      }];

      countryDataList.push(datainstance);
    }
    chartDataList.push(countryDataList);
  }
  console.log("chartdata", chartDataList);




  chartInstanceList = [];
  chartList = [];

  var chartParent = document.createElement("div");
  chartParent.id = "charts";
  chartParent.style.height = "100%";
  chartParent.style.width = "100%";
  for (var i = 0; i < keys.length; ++i) {


    chartcontainer.appendChild(chartParent);
    var chartelement = document.createElement("div");
    chartelement.id = String(i);
    chartelement.style.height = "100%";
    chartelement.style.width = "100%";


    am4core.useTheme(am4themes_kelly);

    var chart = am4core.create(chartelement, am4charts.XYChart);


    var valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxisX.max = maxXaxis;
    valueAxisX.min = 0;
    valueAxisX.title.text = xaxisType;
    valueAxisX.renderer.minLabelPosition = 0.01;
    valueAxisX.renderer.maxLabelPosition = 0.99;
    valueAxisX.renderer.labels.template.rotation = 315;
    valueAxisX.renderer.labels.template.horizontalCenter = "middle";
    valueAxisX.renderer.labels.template.verticalCenter = "middle";

    var valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisY.min = 0;
    valueAxisY.max = maxYaxis;
    valueAxisY.title.text = yaxisType;

    var watermark = new am4core.Label();
    watermark.text = dateList[i].getDate() + " " + m_names[dateList[i].getMonth()] + ", " + dateList[i].getFullYear();
    chart.plotContainer.children.push(watermark);
    watermark.align = "center";
    watermark.valign = "middle";
    watermark.fontSize = 40;
    watermark.opacity = 0.2;
    watermark.marginRight = 10;
    watermark.marginBottom = 5;


    for (var j = 0; j < countriesReq.length; ++j) {
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "yaxis";
      series.dataFields.valueX = "xaxis";
      series.name = countriesReq[j];
      series.strokeWidth = 3;
      series.minBulletDistance = 25;
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      bullet.circle.radius = 10;
      bullet.tooltipText = "[bold]{name}[/]\n" + yaxisType + ": {valueY}\n" + xaxisType + ": {valueX}";
      series.data = chartDataList[i][j];
    }

    chart.cursor = new am4charts.XYCursor();
    chart.exporting.menu = new am4core.ExportMenu();

    if (i == keys.length - 1) {
      chartelement.style.display = "block";
    }
    else {
      chartelement.style.display = "none";
    }

    chartParent.appendChild(chartelement);
    chartInstanceList.push(chartelement);
    chartList.push(chart);

  }

  $('#myRange').attr("min", String(0));
  $('#myRange').attr("max", String(keys.length - 1));
  $('#myRange').attr("value", String(keys.length - 1));

  playState = "pause";
  currentChart = keys.length - 1;

  $('#chartoverlay').LoadingOverlay("hide", force = true);

  var tableHeaders = keys.slice();
  tableHeaders.unshift("Country");

  var tableElement1 = document.getElementById("tableyaxis");
  document.getElementById("table1title").innerText = yaxisType;
  var hotSettings1 = {
    data: tableDataList[0],
    licenseKey: 'non-commercial-and-evaluation',
    stretchH: 'all',
    width: '100%',
    autoWrapRow: true,
    height: '50vh',
    rowHeaders: true,
    colHeaders: tableHeaders,
    columnSorting: {
      indicator: true
    },
    autoColumnSize: {
      samplingRatio: 23
    },
    exportFile: true
  };
  var hot1 = new Handsontable(tableElement1, hotSettings1);
  var downloadBtn = document.getElementById('download');
  var exportPlugin1 = hot1.getPlugin('exportFile');


  var tableElement2 = document.getElementById("tablexaxis");
  document.getElementById("table2title").innerText = xaxisType;
  var hotSettings2 = {
    data: tableDataList[1],
    licenseKey: 'non-commercial-and-evaluation',
    stretchH: 'all',
    width: '100%',
    autoWrapRow: true,
    height: '50vh',
    rowHeaders: true,
    colHeaders: tableHeaders,
    columnSorting: {
      indicator: true
    },
    autoColumnSize: {
      samplingRatio: 23
    },
    exportFile: true
  };
  var hot2 = new Handsontable(tableElement2, hotSettings2);
  var exportPlugin2 = hot2.getPlugin('exportFile');

  downloadBtn.addEventListener('click', function () {
    exportPlugin1.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: true,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: 'csv',
      filename: "corona_" + yaxisType + "_" + time,
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
      rowHeaders: true
    });

    exportPlugin2.downloadFile('csv', {
      bom: false,
      columnDelimiter: ',',
      columnHeaders: true,
      exportHiddenColumns: true,
      exportHiddenRows: true,
      fileExtension: 'csv',
      filename: "corona_" + xaxisType + "_" + time,
      mimeType: 'text/csv',
      rowDelimiter: '\r\n',
      rowHeaders: true
    });


  });


  var slider = document.getElementById("myRange");
  slider.value = keys.length - 1;


}

var changeChart = function (value) {

  chartInstanceList[currentChart].style.display = "none";
  chartInstanceList[value].style.display = "block";
  currentChart = value;

}

var slider = document.getElementById("myRange");
slider.oninput = function () {
  console.log("input", this.value);
  changeChart(this.value);

}

var loading = async function () {
  console.log("loading!!!!!!");

  //loadingText.style.display = "block";
  $('#chartoverlay').LoadingOverlay("show", {
    size: 35,
    minSize: 0,
    maxSize: 35
  });
  await new Promise(r => setTimeout(r, 400));
  plotBtnClickNew();


}
$("#plotBtn").click(function () {
  loading();
});

var playChartSlideShow = async function () {
  console.log("slideshow");
  for (var i = (currentChart + 1) % keys.length; i < keys.length; ++i) {
    console.log("i", i);
    if (playState == "play") {
      slider.value = i;
      changeChart(i);
      await new Promise(r => setTimeout(r, 800));

      if (i == keys.length - 1) {
        playState = "pause";
      }
    }
    else {
      break;
    }
  }
}

$("#downloadPng").click(function exportPNG() {

  chartList[currentChart].exporting.filePrefix = "corona_" + yaxisType.replace(/\s+/g, '') + "_" + xaxisType.replace(/\s+/g, '') + "_" + keys[currentChart];
  chartList[currentChart].exporting.export("png");

});

$("#playpausebtn").click(function () {

  console.log("click");
  playState = playState == "play" ? "pause" : "play";
  console.log(playState);
  if (playState == "play") {
    playChartSlideShow();
  }

});

loading();
