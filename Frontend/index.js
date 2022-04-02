window.onload=function(){
    console.log("Load index.js")
    $( "button" ).click(function() {
        console.log("Test search button")
        console.log("Search box value: ",$( "#search" ).val());
        console.log("Location box value: ",$( "#location" ).val());
    });
}
