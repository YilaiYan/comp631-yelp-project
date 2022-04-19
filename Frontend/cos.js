// resource:https://sumn2u.medium.com/string-similarity-comparision-in-js-with-examples-4bae35f13968
// using cosine similiarity to calculate the most similiar five words, return those five words


// restaurantListWithDuplicate =[]
// fetch("../Austin_business_list.json")
// .then(response => {
//    return response.json();
// })
// .then(jsondata => restaurantListWithDuplicate.add(jsondata));



// const {PriorityQueue} = require('./priority-queue-6.0.0/src/priorityQueue');
// const restaurantListWithDuplicate = require('../Austin_business_list.json');
// console.log(restaurantListWithDuplicate);
function getRestaurantList(){
    let fetchRes = fetch("http://localhost:8983/solr/COMP631_project/select?indent=true&q.op=OR&q=business_name_list%3A*",{
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
    });
    return fetchRes.then(res =>
        res.json()).then(d => {
            console.log(d.response)
            let data=d.response.docs[0].business_name_list;
            // console.log(data);
            return data
    })
}
