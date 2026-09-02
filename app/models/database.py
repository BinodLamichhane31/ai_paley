from pymongo import MongoClient
import gridfs
from config.settings import MONGO_URI, DATABASE_NAME

client = MongoClient(MONGO_URI)
db = client[DATABASE_NAME]
fs = gridfs.GridFS(db)

users_collection = db['users']
vehicles_collection = db['vehicles']
visitor_tokens_collection = db['visitor_tokens']
access_logs_collection = db['access_logs']
visitor_access_logs_collection = db['visitor_access_logs']
registration_logs_collection = db['registration_logs']