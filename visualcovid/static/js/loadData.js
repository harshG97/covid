var allDataConfirmed = JSON.parse(window.sessionStorage.getItem("confirmed"));
var allDataDeath = JSON.parse(window.sessionStorage.getItem("deaths"));
var allDataNew = JSON.parse(window.sessionStorage.getItem("new"));
var allDataActive = JSON.parse(window.sessionStorage.getItem("active"));

if(allDataConfirmed== null){

    $.getJSON(Urls.data(),{'country' : JSON.stringify(['all']), 'time' : -1, 'plotType' : 'confirmed'}, function(result){
        allDataConfirmed = JSON.parse(result);
        console.log("conf",allDataConfirmed);
        window.sessionStorage.setItem("confirmed", JSON.stringify(allDataConfirmed));
    });

}

if(allDataDeath== null){

    $.getJSON(Urls.data(),{'country' : JSON.stringify(['all']), 'time' : -1, 'plotType' : 'deaths'}, function(result){
        allDataDeath = JSON.parse(result);
        console.log("death",allDataDeath);
        window.sessionStorage.setItem("deaths", JSON.stringify(allDataDeath));
    });

}

if(allDataNew== null){

    $.getJSON(Urls.data(),{'country' : JSON.stringify(['all']), 'time' : -1, 'plotType' : 'newconfirmed'}, function(result){
        allDataNew = JSON.parse(result);
        console.log("new",allDataNew);
        window.sessionStorage.setItem("new", JSON.stringify(allDataNew));
    });

}

if(allDataConfirmed== null){

    $.getJSON(Urls.data(),{'country' : JSON.stringify(['all']), 'time' : -1, 'plotType' : 'active'}, function(result){
        allDataActive = JSON.parse(result);
        console.log("active",allDataActive);
        window.sessionStorage.setItem("confirmed", JSON.stringify(allDataActive));
    });

}

