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
for drill in drills:
    drill_id = drill["did"]
    leaderboardEntry = {}
    for user in users:
        user_id = user["uid"]
        leaderboardEntry[user_id] = None
    newBestAttempts[drill_id] = leaderboardEntry

# set data from attempts into newBestAttempts
attempts = [attempt.to_dict() for attempt in attemptsRef.stream()]
for attempt in attempts:
    attempt_id = attempt["id"]
    drill_id = attempt["did"]
    user_id = attempt["uid"]

    mainOutputAttempt = ""
    lowerIsBetter = False

    for drill in drills:
        if drill["did"] == drill_id:
            mainOutputAttempt = drill["mainOutputAttempt"]
            lowerIsBetter = drill["aggOutputs"][mainOutputAttempt]["lowerIsBetter"]
            break

    if mainOutputAttempt == "":
        continue

    attempt_score = attempt[mainOutputAttempt]
    if newBestAttempts[drill_id][user_id] is None:
        newBestAttempts[drill_id][user_id] = {mainOutputAttempt: {
            "id": attempt_id,
            "value": attempt_score
        }}
    else:
        isScoreBetter = attempt_score < newBestAttempts[drill_id][user_id][mainOutputAttempt]["value"] if lowerIsBetter else attempt_score > newBestAttempts[drill_id][user_id][mainOutputAttempt]["value"]
        if isScoreBetter:
            newBestAttempts[drill_id][user_id] = {mainOutputAttempt: {
                                                             "id": attempt_id,
                                                             "value": attempt_score
                                                         }}

for drillId in newBestAttempts:
    bestAttemptDrillRef = db.collection("teams").document("1").collection("best_attempts").document(drillId)
    print(newBestAttempts[drillId])
    bestAttemptDrillRef.set(newBestAttempts[drillId])