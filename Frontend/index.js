function isalpha(val){
    if(val>='a' && val<='z') return true;
    if(val>='A' && val<='Z') return true;
    return false;
}

function ascii_to_hex(str){
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++) 
     {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	 }
	return arr1.join('');
}
async function dataRetriever(url){
    let fetchRes = fetch(url,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    await fetchRes.then(res =>
        res.json()).then(d => {
            let data=d.response;
            // console.log(data);
            return data;
    })
    return fetchRes;
}
function getData(key,value,facet,facetcontain,ignore){
    let str="";
    for (let i = 0; i < value.length; i++) {
        if(!isalpha(value[i])){
            str+="%"+ascii_to_hex(value[i]).toString()
        }else{
            str+=value[i];
        }
    }
    console.log(str);
    let keypart="q.op=OR&q="+key+"%3A%22"+str+"%22";
    let facetpart="http://localhost:8983/solr/COMP631_project/select?";
    if(facet){
        facetpart+="facet.field=text&facet=true&";
    }
    if(typeof facetcontain !== 'undefined'){
        facetpart+="facet.contains="+facetcontain+"&";
    }
    if(ignore){
        facetpart+="facet.contains.ignoreCase=true&";
    }
    console.log(facetpart+keypart);
    let fetchRes = fetch(facetpart+keypart,{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return fetchRes.then(res =>
        res.json()).then(d => {
            return d;
    })
}
window.onload=function(){
    console.log("Load index.js")
    let dict = {};
    let words = ["disappoint","good","bad"];
    $( "button" ).click(function() {
        console.log("Test search button")
        console.log("Search box value: ",$( "#search" ).val());
        (async () => {
            for (let i = 0; i < words.length; i++) {
                // console.log(await getData("business_name","Pho Van"));
                let data=await getData("business_name",$( "#search" ).val(),true,words[i],true);
                console.log(data);
                console.log(data.facet_counts.facet_fields.text.length)
                var count = 0;
                for (let j = 1; j < data.facet_counts.facet_fields.text.length;j+=2) {
                    count += parseInt(data.facet_counts.facet_fields.text[j]);
                }
                console.log(count);
                dict[words[i]] = count;
            }
            

         })()
        console.log(dict);
        console.log("Location box value: ",$( "#location" ).val());
    });
}