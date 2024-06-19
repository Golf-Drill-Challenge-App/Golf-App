import random
import time
import math
import firebase_admin
from firebase_admin import firestore

app = firebase_admin.initialize_app()
db = firestore.client()

# Define the assigned_data array
assigned_data = [
]

# Get a reference to the user collection
users_collection_ref = db.collection("teams").document("1").collection("users")
users_collection = users_collection_ref.get()
# query = users_collection.where('uid', '==', 'c0nEyjaOMhItMQTLMY0X').get()


# print(users_collection.stream())


# Loop through each document in the collection and update the assigned_data field
for doc in users_collection:
#     print(doc)
    doc_ref = users_collection_ref.document(doc.id)
    doc_ref.update({'assigned_data': assigned_data})
    print(f"Document {doc.id} updated successfully.")