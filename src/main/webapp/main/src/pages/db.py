from pymongo import MongoClient

mongo_client = MongoClient("mongodb://121.78.128.139:27017/")
db = mongo_client["mentalcare"]
