import firebase_admin
from firebase_admin import firestore

app = firebase_admin.initialize_app()
db = firestore.client()

blacklistRef = db.collection("teams").document("1").collection("blacklist")


# reset leaderboard
blacklist = [user for user in blacklistRef.stream()]

for user in blacklist:
    userInfoRef = db.collection("users").document(user.id)

    blacklistEntryRef = blacklistRef.document(user.id)
    blacklistEntryRef.update({"email": userInfoRef.get().to_dict()["email"]})
    
    print(userInfoRef.get().to_dict()["email"])


# for attempt in attempts:
#     if attempt["uid"] not in userUniqueDrills:
#         userUniqueDrills[attempt["uid"]] = set()
#     userUniqueDrills[attempt["uid"]].add(attempt["did"])

# for user in users:
#     userRef = db.collection("teams").document("1").collection("users").document(user["uid"])
#     userRef.update({"uniqueDrills": list(userUniqueDrills.get(user["uid"], set()))})