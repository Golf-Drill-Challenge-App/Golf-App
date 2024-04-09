import random
import time
import math
import firebase_admin
from firebase_admin import firestore

app = firebase_admin.initialize_app()
db = firestore.client()

# Define the assigned_data array
assigned_data = [
    {"drillId": "YtCsaxzscFScnpZYmnKI", "assignedTime": "1712600157", "completed": False},
    {"drillId": "YtCsaxzscFScnpZYmnKI", "assignedTime": "1712531560", "completed": False},
    {"drillId": "SpvYyY94HaulVH2zmVyM", "assignedTime": "1712531460", "completed": False},
    {"drillId": "SpvYyY94HaulVH2zmVyM", "assignedTime": "1712531360", "completed": True},
    {"drillId": "SpvYyY94HaulVH2zmVyM", "assignedTime": "1712531260", "completed": False},
    {"drillId": "SpvYyY94HaulVH2zmVyM", "assignedTime": "1712470455", "completed": False},
    {"drillId": "SpvYyY94HaulVH2zmVyM", "assignedTime": "1712470355", "completed": True},
    {"drillId": "SpvYyY94HaulVH2zmVyM", "assignedTime": "1712470255", "completed": False},
    {"drillId": "SpvYyY94HaulVH2zmVyM", "assignedTime": "1712384055", "completed": False},
    {"drillId": "SpvYyY94HaulVH2zmVyM", "assignedTime": "1709709255", "completed": False},
    {"drillId": "SpvYyY94HaulVH2zmVyM", "assignedTime": "1709622855", "completed": False},
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