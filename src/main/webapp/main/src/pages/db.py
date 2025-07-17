from pymongo import MongoClient
from dotenv import load_dotenv
import os

load_dotenv()
mongo_client = MongoClient(f"mongodb://{os.environ['MONGO_USER']}:{os.environ['MONGO_PW']}@121.78.128.139:27017/admin")

<<<<<<< HEAD
mongo_client = MongoClient("mongodb://121.78.128.139:27017/")
=======
>>>>>>> 6a77bb3f46c90df7e3f11ef67a5a5576a894d339
db = mongo_client["mentalcare"]
