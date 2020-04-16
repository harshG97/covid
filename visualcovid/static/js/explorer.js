console.log(populationIndexed["India"]);
console.log(medianAgeIndexed["India"]);
var multipleCancelButton;
multipleCancelButton = new Choices('#countrySelect', {
  removeItemButton: true,
  itemSelectText: '',
});
var countriesReq =['top10'];
var time = document.getElementById("timeselect").value;
var plotType = document.getElementById("typeselect").value;

/////////// GET UPDATED LIST OF ALL COUNTRIES ///////////
$.getJSON(Urls.countries(), function(result){
  multipleCancelButton.destroy();
  console.log("resp", result);
  var allCountries = result["countries"];
  console.log(allCountries);

  var countrySelectList = document.getElementById("countrySelect");
  for(var i =0; i<allCountries.length;++i){
    var option = document.createElement("option");
    option.value = allCountries[i];
    option.text = allCountries[i];
    countrySelectList.appendChild(option);
  }
  var option = document.createElement("option");
  option.value = "top10";
  option.text = "Top 10";
  option.selected = true;
  countrySelectList.appendChild(option);
  
  var option = document.createElement("option");
  option.value = "all";
  option.text = "All";
  countrySelectList.appendChild(option);

  multipleCancelButton = new Choices('#countrySelect', {
  removeItemButton: true,
  itemSelectText: '',
  });
  multipleCancelButton.passedElement.element.addEventListener(
    'addItem',
    function(event) {
      countriesReq.push(event.detail.value);
    },
    false,
  );

  multipleCancelButton.passedElement.element.addEventListener(
    'removeItem',
    function(event) {
      countriesReq.splice(countriesReq.indexOf(event.detail.value), 1);
    },
    false,
  );

});
/////////////////////////////


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

var typeselect = new Choices('#typeselect', {
  removeItemButton: false,
  itemSelectText: '',
  searchEnabled: false,
});

typeselect.passedElement.element.addEventListener(
  'addItem',
  function(event) {
    plotType = event.detail.value;
  },
  false,
);

/////////// PLOT BTN ON CLICK ///////////
var chartList =[];
var id = 1;
var plotBtnClick = function(){
  $('#chartcntnr').LoadingOverlay("show", {
    size : 25,
    minSize : 0,
    maxSize : 25
  });
  $.getJSON(Urls.data(),{'country' : JSON.stringify(countriesReq), 'time' : time, 'plotType' : plotType}, function(result){

    var resultJson = JSON.parse(result);
    var datasetsList2 = [];
    var chartCategories = [];
    var tableHeaders =[];
    var countriesResp = [];
    console.log(resultJson["data"]);
    for(var i = 0; i<resultJson["data"].length; ++i){
      var country;
      var countryDataset = [];
      var object = resultJson["data"][i];

      for(key in object){
        if(object.hasOwnProperty(key)){
            if(key == "Country/Region"){
              country = object[key];
              countriesResp.push(country);
              if(i==0){
                tableHeaders.push(key);
              }
            }
            else{
              var dataObj = {};
              var date = key.split("/");
              dataObj["date"] = new Date("20"+date[2], date[0]-1, date[1]);
              dataObj["value"] = object[key];
              countryDataset.push(dataObj);

              if(i==0){
                tableHeaders.push(key);
              }
            }
        }
      }
        datasetsList2.push(countryDataset);
    }
    
    // $('#chartcntnr').LoadingOverlay("hide", force = true);
    /////////// CHART ///////////
    //am4core.useTheme(am4themes_animated);
    var chartcontainer = document.getElementById("chartcntnr");
    var chartelement = document.createElement("div");
    chartelement.id = String(1);
    chartelement.style.height="100%";
    chartelement.style.width = "100%";
    id++;
    
    
    //am4core.useTheme(am4themes_kelly);
    
    var chart = am4core.create(chartelement, am4charts.XYChart);
  
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 45;
    // dateAxis.startLocation = 0.5;
    //   dateAxis.endLocation = 0.5;
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;
    dateAxis.renderer.labels.template.rotation = 315;
    dateAxis.renderer.labels.template.horizontalCenter = "middle";
    dateAxis.renderer.labels.template.verticalCenter = "middle";
    
    var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min =0;
    valueAxis.max = 700000;
    // valueAxis.title.text = "Cases";
    
    for(var i =0; i<countriesResp.length; ++i){
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "value";
      series.dataFields.dateX = "date";
      series.name = countriesResp[i];
      series.tooltipText = "{name}: [bold]{valueY}[/]";
      series.strokeWidth = 3;
      series.minBulletDistance = 25;
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      // bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
      
      series.data = datasetsList2[i];
    }

    chart.cursor = new am4charts.XYCursor();
    // if (countriesResp.length < 20){
    //     chart.legend = new am4charts.Legend();
    // }
    chart.exporting.menu = new am4core.ExportMenu();
    $("#downloadPng").click(function exportPNG() {
        chart.exporting.filePrefix = "corona_"+plotType+"_"+time;
        chart.exporting.export("png");
    });
    // chart.disabled = true;
    //chart.hide(0);
    //chart.setVisibility(false);
    ///chartelement.style.display = "none";
    chartcontainer.appendChild(chartelement);
    chartList.push(chartelement);
    chartelement.style.display = "none";
    

    chartelement = document.createElement("div");
    chartelement.id = String(2);
    chartelement.style.height="100%";
    chartelement.style.width = "100%";
    // chartelement.style.display = "none";
    id++;
    
    
    am4core.useTheme(am4themes_kelly);
    
    var chart1 = am4core.create(chartelement, am4charts.XYChart);
  
    var dateAxis = chart1.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;
    dateAxis.renderer.minGridDistance = 45;
    // dateAxis.startLocation = 0.5;
    //   dateAxis.endLocation = 0.5;
    dateAxis.renderer.minLabelPosition = 0.01;
    dateAxis.renderer.maxLabelPosition = 0.99;
    dateAxis.renderer.labels.template.rotation = 315;
    dateAxis.renderer.labels.template.horizontalCenter = "middle";
    dateAxis.renderer.labels.template.verticalCenter = "middle";
    
    var  valueAxis = chart1.yAxes.push(new am4charts.ValueAxis());
    valueAxis.min =0;
    valueAxis.max = 700000;
    // valueAxis.title.text = "Cases";
    
    for(var i =0; i<countriesResp.length-2; ++i){
      var series = chart1.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = "value";
      series.dataFields.dateX = "date";
      series.name = countriesResp[i];
      series.tooltipText = "{name}: [bold]{valueY}[/]";
      series.strokeWidth = 3;
      series.minBulletDistance = 25;
      var bullet = series.bullets.push(new am4charts.CircleBullet());
      // bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
      
      series.data = datasetsList2[i];
    }

    chart1.cursor = new am4charts.XYCursor();
    // if (countriesResp.length < 20){
    //     chart1.legend = new am4charts.Legend();
    // }
    chart1.exporting.menu = new am4core.ExportMenu();
    $("#downloadPng").click(function exportPNG() {
        chart1.exporting.filePrefix = "corona_"+plotType+"_"+time;
        chart1.exporting.export("png");
    });
    //chart1.disabled = true;
    //chart1.setVisibility(false);
    //chart1.hide();
    
    chartcontainer.appendChild(chartelement);
    chartList.push(chartelement);
    $('#chartcntnr').LoadingOverlay("hide", force = true);
    // for(var i=0;i<chartList.length;++i){
    //     // if(i==n%2){
    //     //     chartList[i].style.display = "block";
    //     // }
    //     // else{
    //         chartList[i].style.display = "none";
    //     }
    

    //chart1.appear();

    /////////////////////////////


    /////////// TABLE ///////////
    var dataObject = resultJson["data"];
    var tableElement = document.getElementById("rawData");
    var tableElementContainer = tableElement.parentNode;
    var hotSettings = {
      data: dataObject,
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
    var hot = new Handsontable(tableElement, hotSettings);
    var downloadBtn = document.getElementById('download');
    var exportPlugin1 = hot.getPlugin('exportFile');

    
    downloadBtn.addEventListener('click', function() {
      exportPlugin1.downloadFile('csv', {
        bom: false,
        columnDelimiter: ',',
        columnHeaders: true,
        exportHiddenColumns: true,
        exportHiddenRows: true,
        fileExtension: 'csv',
        filename: "corona_"+plotType+"_"+time,
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true
      });
    });

    /////////////////////////////
  
  });

}
/////////////////////////////

/////////// For ploting default chart ///////////
plotBtnClick();

$("#plotBtn").click(plotBtnClick);
var n = 1;
// $("#showbtn").click(function(){
//     console.log("hi", chartList);
    
//     for(var i=0;i<chartList.length;++i){
//         if(i==n%2){
//             chartList[i].style.display = "block";
//         }
//         else{
//             chartList[i].style.display = "none";
//         }
//     }
    
//     n=n+1;
    
//     //chart.setVisibility(true);
//     //chart.appear();
// });