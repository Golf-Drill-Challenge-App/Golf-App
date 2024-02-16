import random
import time
import math

def lookup_round_down(value, lookup_keys, lookup_values):
    if not lookup_keys or value < lookup_keys[0]:
        return None  # or handle it as you see fit

    for i in range(len(lookup_keys)):
        if value < lookup_keys[i]:
            return lookup_values[i-1] if i > 0 else None
    return lookup_values[-1]

line_test = ["8", "9", "PW", "9", "8", "7", "8", "9", "PW", "9", "8", "7", "8", "9", "PW", "9", "8", "7", "8", "9"]

# Function to generate random data for one submission
def generate_submission(submission_id):
    # Unix timestamp for the submission
    time_stamp = random.randint(1600000000, 1800000000)

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

    # One submission
    submission = {
        "time": time_stamp,
        "sideLandingTotal": side_landing_total,
        "sideLandingAverage": side_landing_total / len(shots),
        "shots": shots
    }

    return submission

# Generate 100 submissions
submissions = [generate_submission(i) for i in range(100)]

# Print the submissions without indentation or new lines
print(submissions)
