// resource:https://sumn2u.medium.com/string-similarity-comparision-in-js-with-examples-4bae35f13968
// using cosine similiarity to calculate the most similiar five words, return those five words

// npm install --save @datastructures-js/priority-queue
const {PriorityQueue} = require('@datastructures-js/priority-queue');
const restaurantListWithDuplicate = require('../Austin_business_list.json');
const set = new Set();
restaurantListWithDuplicate.forEach(element => set.add(element));
const restaurantList = Array.from(set);
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
    // var queue = new PriorityQueue({ comparator: function(a, b) { return textCosineSimilarity(a, inputRestaurant) - textCosineSimilarity(b, inputRestaurant); }});
    var queue = new PriorityQueue((a,b) => (editDistance(b, inputRestaurant) - editDistance(a, inputRestaurant)));
    // var queue = new PriorityQueue(); 
    queue.enqueue(restaurantList[0]);
    for (var i = 1; i < restaurantList.length; i++) {
        // console.log(queue.toArray());
        if (queue.size() < 100) {
            queue.enqueue(restaurantList[i]);
        }
        else {
            if (editDistance(queue.front(), inputRestaurant) > editDistance(restaurantList[i], inputRestaurant)) {
                queue.dequeue();
                queue.enqueue(restaurantList[i]);
            }
        }
    }
    
    return queue.toArray().reverse();
}
// var similiarListStepOne = mostSimiliarRestaurant("Caro");
// function splitStr(str) {
//     return str.split(' ').join('').split('').join(' ');
// }

function  similiarRestaurantResult(inputRestaurant) {
    
    var queue = new PriorityQueue((a,b) => (textCosineSimilarity(a, inputRestaurant) - textCosineSimilarity(b, inputRestaurant)));
    // var queue = new PriorityQueue(); 
    var similiarListStepOne = mostSimiliarRestaurant(inputRestaurant);
    queue.enqueue(similiarListStepOne[0]);
    for (var i = 1; i < similiarListStepOne.length; i++) {
        // console.log(queue.toArray());
        if (queue.size() < 10) {
            queue.enqueue(similiarListStepOne[i]);
        }
        else {
            if (textCosineSimilarity(queue.front(), inputRestaurant) < textCosineSimilarity(similiarListStepOne[i], inputRestaurant)) {
                queue.dequeue();
                queue.enqueue(similiarListStepOne[i]);
            }
        }
    }
    
    return queue.toArray().reverse();
}

console.log(similiarRestaurantResult("Austin"));





