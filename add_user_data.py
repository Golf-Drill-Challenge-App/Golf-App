import random
import time
import math
import firebase_admin
from firebase_admin import firestore

app = firebase_admin.initialize_app()
db = firestore.client()

# Define the assigned_data array
assigned_data = [
    {"drill": "YtCsaxzscFScnpZYmnKI", "assigned_time": "1710522958", "completed": False},
    {"drill": "YtCsaxzscFScnpZYmnKI", "assigned_time": "1710464940", "completed": False},
    {"drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710464941", "completed": False},
    {"drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710292142", "completed": True},
    {"drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710292143", "completed": False},
    {"drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710292144", "completed": False},
    {"drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710205745", "completed": True},
    {"drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710205746", "completed": False},
    {"drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710032940", "completed": False},
    {"drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710032941", "completed": False},
    {"drill": "SpvYyY94HaulVH2zmVyM", "assigned_time": "1710012940", "completed": False},
]

# Get a reference to the user collection
users_collection = db.collection("teams").document("1").collection("users")


print(users_collection.stream())


# Loop through each document in the collection and update the assigned_data field
for doc in users_collection.stream():
    print(doc)
    doc_ref = users_collection.document(doc.id)
    doc_ref.update({'assigned_data': assigned_data})
    print(f"Document {doc.id} updated successfully.")