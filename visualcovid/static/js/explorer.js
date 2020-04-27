console.log(populationIndexed["India"]);
console.log(medianAgeIndexed["India"]);

var countriesReq =[];
var time = document.getElementById("timeselect").value;
var plotType = document.getElementById("yaxis").value;
var yaxisType = document.getElementById("yaxis").value;
var xaxisType = document.getElementById("xaxis").value;
var loadingText = document.getElementById("chartload");
var playState;
var currentChart;
var m_names = new Array("Jan", "Feb", "Mar", 
"Apr", "May", "Jun", "Jul", "Aug", "Sept", 
"Oct", "Nov", "Dec");

var timeselect = new Choices('#timeselect', {
  removeItemButton: false,
  itemSelectText: '',
  searchEnabled: false,
});

timeselect.passedElement.element.addEventListener(
  'addItem',
  function(event) {
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
  function(event) {
    yaxisType = event.detail.value;
    plotType = event.detail.value;
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
  function(event) {
    xaxisType = event.detail.value;
    console.log("xaxistype", xaxisType);
  },
  false,
);

/////////// PLOT BTN ON CLICK ///////////
var chartList =[];
var chartInstanceList = [];
var dateList = [];
var n;
var maxXaxis = 0;
var maxYaxis = 0;
var keys = [];

var id = 1;
var plotBtnClickNew = function(){

  var chartcontainer = document.getElementById("chartcntnr");
  if(chartcontainer.hasChildNodes()){
    console.log("yess!!!");
    
    for(var i=0;i<chartcontainer.childNodes.length;++i){
      chartcontainer.removeChild(chartcontainer.childNodes[i]);
    }
  }

  

  console.log("yaxistype", yaxisType);
  dateList = [];
  if(time == -1){
    keys = Object.keys(allDataConfirmed);
  }
  else{
    keys = Object.keys(allDataConfirmed).slice(-1*time);
  }
  console.log(keys);
  var tableDataList = [];
  var yaxisData = [];
  var xaxisData = [];
  maxXaxis=0;
  maxYaxis=0;
  if (yaxisType == 'Confirmed cases'){
    //console.log(Object.keys(allDataConfirmed))
    for(var i =0;i<keys.length;++i){        
      var datainstance = [];
        var date = keys[i].split("/");
        dateList.push(new Date("20"+date[2], date[0]-1, date[1]));
        for(var j =0 ;j<countriesReq.length;++j){
            datainstance.push(allDataConfirmed[keys[i]][countriesReq[j]]);
            maxYaxis = maxYaxis > allDataConfirmed[keys[i]][countriesReq[j]] ? maxYaxis : allDataConfirmed[keys[i]][countriesReq[j]];
        }
        yaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Confirmed cases/1000 population'){
    for(var i =0;i<keys.length;++i){
      
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20"+date[2], date[0]-1, date[1]));
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(allDataConfirmed[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]]);
          maxYaxis = maxYaxis > allDataConfirmed[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]] ? maxYaxis : allDataConfirmed[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Deaths/1000 population'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20"+date[2], date[0]-1, date[1]));
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(allDataDeath[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]]);
          maxYaxis = maxYaxis > allDataDeath[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]] ? maxYaxis : allDataDeath[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Median age'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20"+date[2], date[0]-1, date[1]));
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(medianAgeIndexed[countriesReq[j]]);
          maxYaxis = maxYaxis > medianAgeIndexed[countriesReq[j]] ? maxYaxis : medianAgeIndexed[countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Population'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20"+date[2], date[0]-1, date[1]));
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(populationIndexed[countriesReq[j]] * 1000);
          maxYaxis = maxYaxis > populationIndexed[countriesReq[j]]*1000 ? maxYaxis : populationIndexed[countriesReq[j]]*1000;
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'time'){
    // for(key in allDataDeath){
    //   var datainstance = [];
    //   var date = key.split("/");
    //   dateList.push(new Date("20"+date[2], date[0]-1, date[1]));
    //   for(var j =0 ;j<countriesReq.length;++j){
    //       datainstance.push(populationIndexed[countriesReq[j]] * 1000);
    //       maxYaxis = maxYaxis > populationIndexed[countriesReq[j]]*1000 ? maxYaxis : populationIndexed[countriesReq[j]]*1000;
    //   }
    //   yaxisData.push(datainstance);
    // }
  }
  else if (yaxisType == 'Death percentage'){
    console.log("deathPercent!!!!");
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20"+date[2], date[0]-1, date[1]));
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(100*allDataDeath[keys[i]][countriesReq[j]]/allDataConfirmed[keys[i]][countriesReq[j]]);
          // console.log("death", allDataDeath[key][countriesReq[j]]);
          // console.log("conf",allDataConfirmed[key][countriesReq[j]] );
          // console.log("perc",100*allDataDeath[key][countriesReq[j]]/allDataConfirmed[key][countriesReq[j]] );
          maxYaxis = maxYaxis > 100*allDataDeath[keys[i]][countriesReq[j]]/allDataConfirmed[keys[i]][countriesReq[j]] ? maxYaxis : 100*allDataDeath[keys[i]][countriesReq[j]]/allDataConfirmed[keys[i]][countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Active cases'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20"+date[2], date[0]-1, date[1]));
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(allDataActive[keys[i]][countriesReq[j]]);
          maxYaxis = maxYaxis > allDataActive[keys[i]][countriesReq[j]] ? maxYaxis : allDataActive[keys[i]][countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'Deaths'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20"+date[2], date[0]-1, date[1]));
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(allDataDeath[keys[i]][countriesReq[j]]);
          maxYaxis = maxYaxis > allDataDeath[keys[i]][countriesReq[j]] ? maxYaxis : allDataDeath[keys[i]][countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'New cases/day'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      var date = keys[i].split("/");
      dateList.push(new Date("20"+date[2], date[0]-1, date[1]));
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(allDataNew[keys[i]][countriesReq[j]]);
          maxYaxis = maxYaxis > allDataNew[keys[i]][countriesReq[j]] ? maxYaxis : allDataNew[keys[i]][countriesReq[j]];
      }
      yaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = yaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (yaxisType == 'growthfactor'){

  }
    

  if (xaxisType == 'Confirmed cases'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(allDataConfirmed[keys[i]][countriesReq[j]]);
          maxXaxis = maxXaxis > allDataConfirmed[keys[i]][countriesReq[j]] ? maxXaxis : allDataConfirmed[keys[i]][countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Confirmed cases/1000 population'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(allDataConfirmed[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]]);
          maxXaxis = maxXaxis > allDataConfirmed[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]] ? maxXaxis : allDataConfirmed[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Deaths/1000 population'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(allDataDeath[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]]);
          maxXaxis = maxXaxis > allDataDeath[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]] ? maxXaxis : allDataDeath[keys[i]][countriesReq[j]]/populationIndexed[countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Median age'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(medianAgeIndexed[countriesReq[j]]);
          maxXaxis = maxXaxis > medianAgeIndexed[countriesReq[j]] ? maxXaxis : medianAgeIndexed[countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Population'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(populationIndexed[countriesReq[j]] * 1000);
          maxXaxis = maxXaxis > dateList[i] ? maxXaxis : dateList[i];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'time'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(dateList[i]);
          maxXaxis = maxXaxis > populationIndexed[countriesReq[j]]*1000 ? maxXaxis : populationIndexed[countriesReq[j]]*1000;
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Death percentage'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(100*allDataDeath[keys[i]][countriesReq[j]]/allDataConfirmed[keys[i]][countriesReq[j]]);
          maxXaxis = maxXaxis > 100*allDataDeath[keys[i]][countriesReq[j]]/allDataConfirmed[keys[i]][countriesReq[j]] ? maxXaxis : 100*allDataDeath[keys[i]][countriesReq[j]]/allDataConfirmed[keys[i]][countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Active cases'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(allDataActive[keys[i]][countriesReq[j]]);
          maxXaxis = maxXaxis > allDataActive[keys[i]][countriesReq[j]] ? maxXaxis : allDataActive[keys[i]][countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'Deaths'){
    console.log("XXXXXX");
    for(var i =0;i<keys.length;++i){
      var datainstanceY = [];
      
      for(var j =0 ;j<countriesReq.length;++j){
          datainstanceY.push(allDataDeath[keys[i]][countriesReq[j]]);
          console.log("xaxisdataInst", allDataDeath[keys[i]][countriesReq[j]]);
          maxXaxis = maxXaxis > allDataDeath[keys[i]][countriesReq[j]] ? maxXaxis : allDataDeath[keys[i]][countriesReq[j]];
      }
      xaxisData.push(datainstanceY);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'New cases/day'){
    for(var i =0;i<keys.length;++i){
      var datainstance = [];
      
      for(var j =0 ;j<countriesReq.length;++j){
          datainstance.push(allDataNew[keys[i]][countriesReq[j]]);
          maxXaxis = maxXaxis > allDataNew[keys[i]][countriesReq[j]] ? maxXaxis : allDataNew[keys[i]][countriesReq[j]];
      }
      xaxisData.push(datainstance);
    }

    var tableDataRows= [];
    for(var j=0;j<countriesReq.length;++j){
      var tableDataObject = {};
      tableDataObject["Country"] = countriesReq[j];
      for(var i=0;i<keys.length;++i){
        tableDataObject[keys[i]] = xaxisData[i][j];
      }
      
      tableDataRows.push(tableDataObject);
    }

    tableDataList.push(tableDataRows);
  }
  else if (xaxisType == 'growthfactor'){

  }


  console.log("yaxisdata", yaxisData);
  console.log("xaxisdata", xaxisData);
  var chartDataList = [];
  for(var i = 0;i<keys.length;++i){
    //console.log("i", dateList.length);
    var countryDataList =[];
    for( var j = 0;j<countriesReq.length;++j){
     // console.log("x", xaxisData[i][j]);
      var datainstance =[{
        "xaxis" : xaxisData[i][j],
        "yaxis" : yaxisData[i][j]
      }];
      
      countryDataList.push(datainstance);
    }
    chartDataList.push(countryDataList);
  }
  console.log("chartdata", chartDataList);




  chartInstanceList = [];

  var chartParent = document.createElement("div");
  chartParent.id = "charts";
  chartParent.style.height="100%";
  chartParent.style.width = "100%";
  for(var i = 0; i<keys.length; ++i){
    
    
    chartcontainer.appendChild(chartParent);
    var chartelement = document.createElement("div");
    chartelement.id = String(i);
    chartelement.style.height="100%";
    chartelement.style.width = "100%";
    

    am4core.useTheme(am4themes_kelly);
    
    var chart = am4core.create(chartelement, am4charts.XYChart);
  
    
    var  valueAxisX = chart.xAxes.push(new am4charts.ValueAxis());
    valueAxisX.max = maxXaxis;
    valueAxisX.min = 0;
    valueAxisX.title.text = xaxisType;
    valueAxisX.renderer.minLabelPosition = 0.01;
    valueAxisX.renderer.maxLabelPosition = 0.99;
    valueAxisX.renderer.labels.template.rotation = 315;
    valueAxisX.renderer.labels.template.horizontalCenter = "middle";
    valueAxisX.renderer.labels.template.verticalCenter = "middle";
    
    var  valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisY.min =0;
    valueAxisY.max = maxYaxis;
    valueAxisY.title.text = yaxisType;
    // valueAxis.title.text = "Cases";

    var watermark = new am4core.Label();
    watermark.text = dateList[i].getDate() +" "+ m_names[dateList[i].getMonth()] + ", "  + dateList[i].getFullYear();
    chart.plotContainer.children.push(watermark);
    watermark.align = "center";
    watermark.valign = "middle";

    watermark.fontSize = 40;
    watermark.opacity = 0.2;
    watermark.marginRight = 10;
    watermark.marginBottom = 5;
    

    for(var j =0; j<countriesReq.length; ++j){
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "yaxis";   
      series.dataFields.valueX = "xaxis";
      series.name = countriesReq[j];
      //series.tooltipText = "{name}: [bold]{valueY}[/]";
      series.strokeWidth = 3;
      series.minBulletDistance = 25;
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      // bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 10;
      bullet.tooltipText = "{name}: [bold]{valueY}[/]";
      
      series.data = chartDataList[i][j];
    }

    chart.cursor = new am4charts.XYCursor();

    if(i==keys.length-1){
      chartelement.style.display = "block";
    }
    else{
      chartelement.style.display = "none";
    }
    
    chartParent.appendChild(chartelement);
    chartInstanceList.push(chartelement);
    

    
    
  }

  $('#myRange').attr("min",String(0));
  $('#myRange').attr("max",String(keys.length-1));
  $('#myRange').attr("value",String(keys.length-1));

  playState = "pause";
  currentChart = keys.length-1;


  $('#chartoverlay').LoadingOverlay("hide", force = true);

  
  
  //loadingText.style.display = "none";
  n = chartInstanceList.length-1;

  
  var tableHeaders = keys.slice();
  tableHeaders.unshift("Country");
  console.log("keysTable", keys);
  console.log("tabledata", tableDataList);

  //var dataObject = tableDataList[0];
  var tableElement1 = document.getElementById("tableyaxis");
  document.getElementById("table1title").innerText = yaxisType;
  //var tableElementContainer = tableElement.parentNode;
  var hotSettings1 = {
      data: tableDataList[0],
      licenseKey: 'non-commercial-and-evaluation',
      stretchH: 'all',
      width: '100%',
      autoWrapRow: true,
      height: '50vh',
      //maxRows: 20,
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
  //var downloadBtn = document.getElementById('download');
  var exportPlugin1 = hot1.getPlugin('exportFile');


  //var dataObject = tableDataList[1];
  var tableElement2 = document.getElementById("tablexaxis");
  document.getElementById("table2title").innerText = xaxisType;
  //var tableElementContainer = tableElement.parentNode;
  var hotSettings2 = {
      data: tableDataList[1],
      licenseKey: 'non-commercial-and-evaluation',
      stretchH: 'all',
      width: '100%',
      autoWrapRow: true,
      height: '50vh',
      //maxRows: 20,
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
  //var downloadBtn = document.getElementById('download');
  var exportPlugin2 = hot2.getPlugin('exportFile');
  
}

var changeChart = function (value){
  
  chartInstanceList[currentChart].style.display = "none";
  chartInstanceList[value].style.display = "block";
  currentChart = value;

}

var slider = document.getElementById("myRange");
slider.oninput = function() {
  changeChart(this.value);
}


/////////// For ploting default chart ///////////

var loading = async function(){
  console.log("loading!!!!!!");
  
  //loadingText.style.display = "block";
  $('#chartoverlay').LoadingOverlay("show", {
    size : 35,
    minSize : 0,
    maxSize : 35
  });
  await new Promise(r => setTimeout(r, 150));
  plotBtnClickNew();

  
}
$("#plotBtn").click(function(){
  loading();
  
});

var playChartSlideShow = async function(){
  console.log("slideshow");
  for(var i =(currentChart+1)%keys.length;i<keys.length;++i){
    console.log("i", i);
    if (playState == "play"){
      slider.value = i;
      changeChart(i);
      await new Promise(r => setTimeout(r, 600));
      
      if(i==keys.length-1){
        playState = "pause";
      }
    }
    else{
      break;
    }
  }
}

$("#playpausebtn").click(function(){
  
  console.log("click");
  playState = playState == "play" ? "pause" : "play";
  console.log(playState);
  if(playState == "play"){
    playChartSlideShow();
  }
  
});
