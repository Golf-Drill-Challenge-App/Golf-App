import random
import time
import math
import firebase_admin
from firebase_admin import firestore
import os

# Application Default credentials are automatically created.
# os.environ["FIRESTORE_EMULATOR_HOST"] = "localhost:8080"

app = firebase_admin.initialize_app()
db = firestore.client()

def lookup_round_down(value, lookup_keys, lookup_values):
    if not lookup_keys or value < lookup_keys[0]:
        return None  # or handle it as you see fit

    for i in range(len(lookup_keys)):
        if value < lookup_keys[i]:
            return lookup_values[i-1] if i > 0 else None
    return lookup_values[-1]

# Example data
sg_keys = [0,5,10,15,20,25,30,35,40,45,50,55,60,65,70,75,80,85,90,95,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200,210,220,230,240,250]
sg_values = [2.25,2.25,2.3,2.35,2.4,2.45,2.5,2.55,2.6,2.625,2.65,2.68,2.7,2.713,2.73,2.74,2.75,2.765,2.78,2.79,2.8,2.813,2.825,2.84,2.85,2.865,2.88,2.895,2.91,2.93,2.95,2.965,2.98,3.005,3.03,3.055,3.08,3.11,3.14,3.165,3.19,3.255,3.32,3.385,3.45,3.515]

putt_keys = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75]
putt_values = [0,1.001,1.009,1.053,1.147,1.256,1.357,1.443,1.515,1.575,1.626,1.669,1.705,1.737,1.765,1.79,1.811,1.83,1.848,1.863,1.878,1.891,1.903,1.914,1.924,1.934,1.944,1.953,1.961,1.97,1.978,1.993,1.993,2.001,2.009,2.016,2.024,2.032,2.039,2.047,2.055,2.062,2.07,2.078,2.086,2.094,2.102,2.11,2.118,2.127,2.135,2.143,2.152,2.16,2.168,2.177,2.185,2.193,2.202,2.21,2.218,2.226,2.234,2.242,2.25,2.257,2.265,2.272,2.279,2.286,2.293,2.299,2.306,2.312,2.318,2.324]

line_test = ["8", "9", "PW", "9", "8", "7", "8", "9", "PW", "9", "8", "7", "8", "9", "PW", "9", "8", "7", "8", "9"]

users = ["p4UhvrHAwYZgfU8oi3OCKRbnRNh2"]

collection_ref = db.collection("teams").document("1").collection("attempts")

# Function to generate random data for one submission
def generate_submission(user_id):
    # Unix timestamp for the submission
    time_stamp = int((time.time() + random.randint(1000, 10000000)) * 1000)

    # Strokes gained - random number between 1 and 10
    strokes_gained_total = 0
    carry_diff_total = 0
    side_landing_total = 0
    prox_hole_total = 0

    # Generating 5 shots with random data
    shots = []
    num_shots = random.randint(2, 20)
    for shot_id in range(1, num_shots):
        target = random.randint(100, 150)
        carry_diff = random.uniform(-10, 10) #difference
        side_landing = random.uniform(-35, 35) #negative is left, for shot tendency chart
        prox_hole = math.sqrt((carry_diff * 3)**2 + side_landing**2) #proximity to hole, x3 for yard to feet conversion
        expected_putts = lookup_round_down(prox_hole, putt_keys, putt_values)
        baseline = lookup_round_down(target, sg_keys, sg_values)
        strokes_gained = baseline - expected_putts - 1

        carry_diff_total += carry_diff
        side_landing_total += side_landing
        prox_hole_total += prox_hole

        shot = {
            "sid": shot_id,
            "target": target,
            "carry": target + carry_diff,
            "sideLanding": side_landing,
            "carryDiff": carry_diff,
            "proxHole": prox_hole,
            "baseline": baseline,
            "expectedPutts": expected_putts,
            "strokesGained": strokes_gained
        }
        strokes_gained_total += strokes_gained
        shots.append(shot)


    # Generate a new document reference with an auto-generated ID
    doc_ref = collection_ref.document()

    # Get the auto-generated ID
    doc_id = doc_ref.id

    # One submission
    submission = {
        "time": time_stamp,
        "uid": user_id,
        "did": "SpvYyY94HaulVH2zmVyM",
        "id": doc_id,
        "strokesGained": strokes_gained_total,
        "strokesGainedAverage": strokes_gained_total / num_shots,
        "carryDiffAverage": carry_diff_total / num_shots,
        "sideLandingAverage": side_landing_total / num_shots,
        "proxHoleAverage": prox_hole_total / num_shots,
        "shots": shots
    }

    doc_ref.set(submission)
    return submission

def generate_submission_line(user_id):
    # Unix timestamp for the submission
    time_stamp = int((time.time() + random.randint(1000, 10000000)) * 1000)

    # Strokes gained - random number between 1 and 10
    side_landing_total = 0

    # Generating 5 shots with random data
    shots = []
    for shot_id in range(1, len(line_test) + 1):
        club = line_test[shot_id - 1]
        side_landing = random.randint(-135, 135)
        shot = {
            "sid": shot_id,
            "target": club,
            "sideLanding": side_landing
        }
        side_landing_total += side_landing
        shots.append(shot)


    # Generate a new document reference with an auto-generated ID
    doc_ref = collection_ref.document()

    # Get the auto-generated ID
    doc_id = doc_ref.id

    # One submission
    submission = {
        "time": time_stamp,
        "uid": user_id,
        "did": "YtCsaxzscFScnpZYmnKI",
        "id": doc_id,
        "sideLandingTotal": side_landing_total,
        "sideLandingAverage": side_landing_total / len(shots),
        "shots": shots
    }

    doc_ref.set(submission)

    return submission

# Generate 100 submissions
for user_id in users:
    for i in range(500):
        submission = generate_submission(user_id)
#     for i in range(random.randint(50, 150)):
#         submission = generate_submission_line(user_id)

# query = collection_ref.where('uid', '==', 'p4UhvrHAwYZgfU8oi3OCKRbnRNh2')
#
# results = query.stream()
#
# for doc in results:
#     collection_ref.document(doc.id).delete()