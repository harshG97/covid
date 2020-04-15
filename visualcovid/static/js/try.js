$("#showbtn").click(function(){
    console.log("hi", chartList);
    
    for(var i=0;i<chartList.length;++i){
        if(i==n%2){
            chartList[i].style.display = "block";
        }
        else{
            chartList[i].style.display = "none";
        }
    }
    
    n=n+1;
    
    //chart.setVisibility(true);
    //chart.appear();
});