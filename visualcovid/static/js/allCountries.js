var allCountries = JSON.parse(window.sessionStorage.getItem("countries"));
console.log( "store",JSON.parse(window.sessionStorage.getItem("countries")));

var multipleCancelButton;
multipleCancelButton = new Choices('#countrySelect', {
  removeItemButton: true,
  itemSelectText: '',
});

var intialiseCountryList = function(){
    multipleCancelButton.destroy();
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
    //option.selected = true;
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
}

if(allCountries== null){
    console.log("if");
    $.getJSON(Urls.countries(), function(result){
        console.log("resp", result);
        allCountries = result["countries"];
        console.log(allCountries);
    
        intialiseCountryList();  
        window.sessionStorage.setItem("countries", JSON.stringify(allCountries));
    });
    

}
else{
    intialiseCountryList();
}