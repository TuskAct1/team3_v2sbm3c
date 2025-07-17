from pymongo import MongoClient
from dotenv import load_dotenv
import os


load_dotenv()
mongo_client = MongoClient(f"mongodb://{os.environ['MONGO_USER']}:{os.environ['MONGO_PW']}@121.78.128.139:27017/admin")
db = mongo_client["mentalcare"]
