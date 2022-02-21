from wsgiref.util import request_uri
import requests
import json

url = 'https://www.yelp.com/biz/levain-bakery-new-york'

api_key='kTdSnZ1K7NIqoSQED6eI-wrt0DEQzI1itmHjko-Rv4cf0bkCPhRIGsFC776JB2wk7xcIt0zDqQJiIUx_q7vn7-8F6V9hRCEYaqrgLpatzwNSnVpXF2IYwQjKAQ0UYnYx'
headers = {'Authorization': 'Bearer %s' % api_key}


url='https://api.yelp.com/v3/businesses/search'
params = {'term':'restaurant','location':'Houston,Texas'}

req=requests.get(url, params=params, headers=headers)

print('The status code is {}'.format(req.status_code))

# for bus in json.loads(req.text)["businesses"]:
#     print(bus[0])
list=[]
for business in json.loads(req.text)["businesses"]:
    business_id=business["id"]
    review_url = "https://api.yelp.com/v3/businesses/"+business_id+"/reviews"
    review_req = requests.get(review_url, headers=headers)
    review=json.loads(review_req.text)["reviews"]
    list.append(review)
with open('review_data.json', 'w') as outfile:
    json.dump(list, outfile)