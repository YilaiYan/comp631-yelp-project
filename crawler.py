from wsgiref.util import request_uri
import requests
import json

url = 'https://www.yelp.com/biz/levain-bakery-new-york'

api_key='kTdSnZ1K7NIqoSQED6eI-wrt0DEQzI1itmHjko-Rv4cf0bkCPhRIGsFC776JB2wk7xcIt0zDqQJiIUx_q7vn7-8F6V9hRCEYaqrgLpatzwNSnVpXF2IYwQjKAQ0UYnYx'
headers = {'Authorization': 'Bearer %s' % api_key}

business_list=[]
for i in range(0,1000,50):
    url='https://api.yelp.com/v3/businesses/search'
    params = {'term':'food','location':'Houston,Texas',"limit":50,'offset':i}

    req=requests.get(url, params=params, headers=headers)
    # if(req.status_code==400):
    #     break
    business_list=business_list+json.loads(req.text)["businesses"]
    # print('The status code is {}'.format(req.status_code))

# for bus in json.loads(req.text)["businesses"]:
#     print(bus[0])
count=0
for business in business_list:
    business_id=business["id"]
    review_url = "https://api.yelp.com/v3/businesses/"+business_id+"/reviews"
    review_req = requests.get(review_url, headers=headers)
    review=json.loads(review_req.text)["reviews"]
    count+=1
    print("Loading....",count)
    with open('dataset/review_data'+str(count)+'.json', 'w') as outfile:
        json.dump(review, outfile)