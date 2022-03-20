"""Convert the Yelp Dataset Challenge dataset from json format to csv.
For more information on the Yelp Dataset Challenge please visit http://yelp.com/dataset_challenge
"""
import argparse
import collections
import json


# json_file = "yelp_dataset/yelp_academic_dataset_business.json"
# business_data=[]
# with open(json_file) as fin:
#     for line in fin:
#         line_contents = json.loads(line)
#         city=line_contents['city']
#         state=line_contents['state']
#         if(state=="TX"):
#             business_data.append(line_contents)
# texas_business=json.dumps(business_data)
# with open('texas_business.json', 'w') as outfile:
#     outfile.write(texas_business)

fileObject = open("Austin_business.json", "r")   
jsonContent = fileObject.read()
aList = json.loads(jsonContent) 
business_idlist=dict()
for element in aList:
    business_idlist[element['business_id']]=element['name']
json_file = "yelp_dataset/yelp_academic_dataset_review.json"
review_data=[]
with open(json_file) as fin:
    count=0
    for line in fin:
        line_contents = json.loads(line)
        count+=1
        if line_contents['business_id'] in business_idlist:
            # print(business_idlist[line_contents['business_id']])
            line_contents['business_name']=business_idlist[line_contents['business_id']]
            line_contents.pop('business_id')
            line_contents.pop('review_id')
            line_contents.pop('funny')
            line_contents.pop('useful')
            line_contents.pop('user_id')
            line_contents.pop('cool')
            print(count)
            review_data.append(line_contents)
            if count>100000:
                break
texas_review=json.dumps(review_data)
with open('Austin_review.json', 'w') as outfile:
    outfile.write(texas_review)