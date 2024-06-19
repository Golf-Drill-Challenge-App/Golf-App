import firebase_admin
from firebase_admin import firestore

app = firebase_admin.initialize_app()
db = firestore.client()

drillInfoRef = db.collection("teams").document("1").collection("drills")
userInfoRef = db.collection("teams").document("1").collection("users")
attemptsRef = db.collection("teams").document("1").collection("attempts")

newBestAttempts = {}

# reset leaderboard
drills = [drill.to_dict() for drill in drillInfoRef.stream()]
users = [user.to_dict() for user in userInfoRef.stream()]
attempts = [attempt.to_dict() for attempt in attemptsRef.stream()]

userUniqueDrills = {}

for attempt in attempts:
    if attempt["uid"] not in userUniqueDrills:
        userUniqueDrills[attempt["uid"]] = set()
    userUniqueDrills[attempt["uid"]].add(attempt["did"])

for user in users:
    userRef = db.collection("teams").document("1").collection("users").document(user["uid"])
    userRef.update({"uniqueDrills": list(userUniqueDrills.get(user["uid"], set()))})