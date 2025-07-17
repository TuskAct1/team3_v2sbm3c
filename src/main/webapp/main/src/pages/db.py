from pymongo import MongoClient

mongo_client = MongoClient("mongodb://team3:0514@121.78.128.139:27017/admin")
db = mongo_client["mentalcare"]
