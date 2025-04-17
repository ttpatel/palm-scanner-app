import cv2
import os
import sys
import csv
import datetime

# ✅ Validate arguments
if len(sys.argv) != 6:
    print("Usage: capture.py <name> <email> <age> <gender> <hand>")
    sys.exit(1)

# ✅ Read from arguments
name, email, age, gender, hand = sys.argv[1:]

# ✅ Prepare folders
os.makedirs("palmprint_dataset", exist_ok=True)
csv_file = "palmprint_data.csv"
if not os.path.exists(csv_file):
    with open(csv_file, mode='w', newline='') as file:
        writer = csv.writer(file)
        writer.writerow(["Name", "Email", "Age", "Gender", "Hand", "ImagePath", "Timestamp"])

# ✅ Open camera (use CAP_DSHOW for Windows)
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
if not cap.isOpened():
    print("Could not access webcam")
    sys.exit(1)

# ✅ Prepare file paths
timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
person_dir = f"palmprint_dataset/{email.replace('@', '_').replace('.', '_')}_{name.replace(' ', '_')}"
os.makedirs(person_dir, exist_ok=True)
filename = f"{hand}_img_{timestamp}.jpg"
image_path = os.path.join(person_dir, filename)

# ✅ Start OpenCV capture loop
while True:
    ret, frame = cap.read()
    if not ret:
        print("Failed to read from camera")
        sys.exit(1)

    h, w = frame.shape[:2]
    # Draw box
    cv2.rectangle(frame, (w//2 - 150, h//2 - 150), (w//2 + 150, h//2 + 150), (0, 255, 0), 2)
    cv2.putText(frame, f"{hand.upper()} HAND - Press SPACE to capture", (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
    cv2.imshow("Capture Palmprint", frame)

    key = cv2.waitKey(1)
    if key == 27:  # ESC to cancel
        print("User cancelled.")
        break
    elif key == 32:  # SPACE to capture
        cropped = frame[h//2 - 150:h//2 + 150, w//2 - 150:w//2 + 150]
        cv2.imwrite(image_path, cropped)

        with open(csv_file, mode='a', newline='') as file:
            writer = csv.writer(file)
            writer.writerow([name, email, age, gender, hand, image_path, timestamp])

        print(image_path)  # Return to Electron
        break

# ✅ Cleanup
cap.release()
cv2.destroyAllWindows()
sys.exit(0)
