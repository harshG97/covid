var time = document.getElementById("timeselect").value;
var plotType = document.getElementById("typeselect").value;

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
var plotBtnClick = function(){
$('#myChart').LoadingOverlay("show", {
size : 25,
minSize : 0,
maxSize : 25
});
var countriesReq = [];

if(countriesSelect.includes("all")){
    countriesReq.push("All");
}
if(countriesSelect.includes("top10")){
    countriesReq.push(...allCountries.slice(0, 10));
}

for(var i in countriesSelect){
    if(countriesSelect[i] != "top10" && countriesSelect[i] != "all"){
        console.log("country", countriesSelect[i]);
        if(!countriesReq.includes(countriesSelect[i])){
            countriesReq.push(countriesSelect[i]);
        }
    }
}
console.log("countriesReq", countriesReq);

var dataToProcess; 

if(plotType == "Confirmed cases"){
    dataToProcess = allDataConfirmed;
}
else if(plotType == " Deaths"){
    dataToProcess = allDataDeath;
}
else if(plotType == "Active cases"){
    dataToProcess = allDataActive;
}
else if(plotType == "New cases/day"){
    dataToProcess = allDataNew;
}

console.log("tp process", dataToProcess);
var keys = Object.keys(dataToProcess);
if(time != -1){
    keys = keys.slice(-1*time);
}
console.log("keys", keys);

var processesData = [];
var tableHeaderList = ["Country"];
var tableDataList = [];
for(var i =0;i<countriesReq.length;++i){
    var countryDataList = [];
    var tableDataObject = {};
    tableDataObject["Country"] = countriesReq[i];
    if(countriesReq[i] == "All" && !Object.keys(dataToProcess[keys[0]]).includes("All")){
        console.log("inhere!!!");
        
            for(var j = 0;j<keys.length;++j){
                var sum = 0;
                for(var k =0; k<allCountries.length;++k){

                    sum = sum + dataToProcess[keys[j]][allCountries[k]]
                }

                dataToProcess[keys[j]]["All"] = sum;
                //console.log(sum);

            }
        
    }
    
    for(var j =0;j<keys.length;++j){
        if(i==0){
            tableHeaderList.push(keys[j]);
        }
        tableDataObject[keys[j]] = dataToProcess[keys[j]][countriesReq[i]];
        var countryDataObject ={};
        var date = keys[j].split("/");
        countryDataObject["date"] = new Date("20"+date[2], date[0]-1, date[1]);
        countryDataObject["value"] = dataToProcess[keys[j]][countriesReq[i]];
        countryDataList.push(countryDataObject);
    }
    

    tableDataList.push(tableDataObject);

    processesData.push(countryDataList);
}
console.log("processes", processesData);
console.log("processes", tableDataList);
console.log("cnf", allDataConfirmed);

$('#myChart').LoadingOverlay("hide", force = true);
/////////// CHART ///////////
//am4core.useTheme(am4themes_animated);
am4core.useTheme(am4themes_kelly);
var chart = am4core.create("myChart", am4charts.XYChart);

var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
dateAxis.renderer.grid.template.location = 0;
dateAxis.renderer.minGridDistance = 45;
dateAxis.renderer.minLabelPosition = 0.01;
dateAxis.renderer.maxLabelPosition = 0.99;
dateAxis.renderer.labels.template.rotation = 315;
dateAxis.renderer.labels.template.horizontalCenter = "middle";
dateAxis.renderer.labels.template.verticalCenter = "middle";

var  valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
// valueAxis.title.text = "Cases";

for(var i =0; i<countriesReq.length; ++i){
    var series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.valueY = "value";
    series.dataFields.dateX = "date";
    series.name = countriesReq[i];
    series.tooltipText = "{name}: [bold]{valueY}[/]";
    series.strokeWidth = 3;
    series.minBulletDistance = 25;
    var bullet = series.bullets.push(new am4charts.CircleBullet());
    // bullet.circle.strokeWidth = 2;
    bullet.circle.radius = 4;
    
    series.data = processesData[i];
}

chart.cursor = new am4charts.XYCursor();
if (countriesReq.length < 20){
    chart.legend = new am4charts.Legend();
}
chart.exporting.menu = new am4core.ExportMenu();
$("#downloadPng").click(function exportPNG() {
    chart.exporting.filePrefix = "corona_"+plotType+"_"+time;
    chart.exporting.export("png");
});
/////////////////////////////


// /////////// TABLE ///////////
var tableElement = document.getElementById("rawData");
var tableElementContainer = tableElement.parentNode;
var hotSettings = {
    data: tableDataList,
    licenseKey: 'non-commercial-and-evaluation',
    stretchH: 'all',
    width: '100%',
    autoWrapRow: true,
    height: '50vh',
    //maxRows: 20,
    rowHeaders: true,
    colHeaders: tableHeaderList,
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

// });

}
/////////////////////////////

/////////// For ploting default chart ///////////
//plotBtnClick();

$("#plotBtn").click(plotBtnClick);