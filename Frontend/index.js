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
    // console.log(str);
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
    // console.log(facetpart+keypart);
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
        // console.log("Test search button")
        // console.log("Search box value: ",$( "#search" ).val());
        (async () => {
            var restaurantListWithDuplicate=await getRestaurantList();
            var set = new Set();
            restaurantListWithDuplicate.forEach(element => set.add(element));
            var restaurantList = Array.from(set);
            function termFreqMap(str) {
                var words = str.split(' ');
                var termFreq = {};
                words.forEach(function(w) {
                    termFreq[w] = (termFreq[w] || 0) + 1;
                });
                return termFreq;
            }
        
            function addKeysToDict(map, dict) {
                for (var key in map) {
                    dict[key] = true;
                }
            }
        
            function termFreqMapToVector(map, dict) {
                var termFreqVector = [];
                for (var term in dict) {
                    termFreqVector.push(map[term] || 0);
                }
                return termFreqVector;
            }
        
            function vecDotProduct(vecA, vecB) {
                var product = 0;
                for (var i = 0; i < vecA.length; i++) {
                    product += vecA[i] * vecB[i];
                }
                return product;
            }
        
            function vecMagnitude(vec) {
                var sum = 0;
                for (var i = 0; i < vec.length; i++) {
                    sum += vec[i] * vec[i];
                }
                return Math.sqrt(sum);
            }
        
            function cosineSimilarity(vecA, vecB) {
                return vecDotProduct(vecA, vecB) / (vecMagnitude(vecA) * vecMagnitude(vecB));
            }
        
            function textCosineSimilarity(strA, strB) {
                var termFreqA = termFreqMap(strA.split(' ').join('').split('').join(' '));
                var termFreqB = termFreqMap(strB.split(' ').join('').split('').join(' '));
        
                var dict = {};
                addKeysToDict(termFreqA, dict);
                addKeysToDict(termFreqB, dict);
        
                var termFreqVecA = termFreqMapToVector(termFreqA, dict);
                var termFreqVecB = termFreqMapToVector(termFreqB, dict);
        
                return cosineSimilarity(termFreqVecA, termFreqVecB);
            }
            // console.log(textCosineSimilarity("Julie loves me more than Linda loves me", "Jane likes me more than Julie loves me"));
        
        
            function editDistance(a, b){
                if(a.length == 0) return b.length; 
                if(b.length == 0) return a.length; 
        
                var matrix = [];
        
                for(var i = 0; i <= b.length; i++){
                    matrix[i] = [i];
                }
        
                for(var j = 0; j <= a.length; j++){
                    matrix[0][j] = j;
                }
        
                // Fill in the rest of the matrix
                for(i = 1; i <= b.length; i++){
                    for(j = 1; j <= a.length; j++){
                    if(b.charAt(i-1) == a.charAt(j-1)){
                        matrix[i][j] = matrix[i-1][j-1];
                    } else {
                        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, 
                                                Math.min(matrix[i][j-1] + 1, 
                                                        matrix[i-1][j] + 1)); 
                    }
                    }
                }
        
                return matrix[b.length][a.length];
            };
        
            function  mostSimiliarRestaurant(inputRestaurant) {
                restaurantList.sort((a,b) => (editDistance(a, inputRestaurant) - editDistance(b, inputRestaurant)));
                return restaurantList.slice(0, 100);
            }
        
            function  similiarRestaurantResult(inputRestaurant) {
                var similiarListStepOne = mostSimiliarRestaurant(inputRestaurant);
                similiarListStepOne.sort((a,b) => textCosineSimilarity(b, inputRestaurant) < textCosineSimilarity(a, inputRestaurant));
                return similiarListStepOne.slice(0, 5);
            }
            let num_found=0;
            for (let i = 0; i < words.length; i++) {
                // console.log(await getData("business_name","Pho Van"));
                let data=await getData("business_name",$( "#search" ).val(),true,words[i],true);
                num_found+=data.response.numFound;
                // console.log(data.facet_counts.facet_fields.text.length)

                var count = 0;
                for (let j = 1; j < data.facet_counts.facet_fields.text.length;j+=2) {
                    count += parseInt(data.facet_counts.facet_fields.text[j]);
                }
                // console.log(count);
                dict[words[i]] = count;
            }
            if(num_found==0){
                let suggestWord=similiarRestaurantResult($( "#search" ).val());
                // console.log(suggestWord);
                let person = prompt("Do you mean this word? ", suggestWord[0]);
                $( "#search" ).val(person);
            }

         })()
        // console.log(dict);
        // console.log("Location box value: ",$( "#location" ).val());
    });
}