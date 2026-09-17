import cv2
import mediapipe as mp
import numpy as np
from tensorflow.keras.models import load_model

class ISLPredictor:
    def __init__(self, model_path):
        # 1. Load the trained H5 model
        self.model = load_model(model_path)

        # 2. Initialize MediaPipe Hands
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.5
        )

        # 3. Define Labels (Aapke dataset ke order mein hone chahiye)
        self.labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
                       'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

    def predict(self, frame):
        # Image pre-processing
        img_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(img_rgb)

        data_aux = []
        x_ = []
        y_ = []

        if results.multi_hand_landmarks:
            for hand_landmarks in results.multi_hand_landmarks:
                # Coordinate normalization (Relative to hand bounding box)
                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    x_.append(x)
                    y_.append(y)

                for i in range(len(hand_landmarks.landmark)):
                    x = hand_landmarks.landmark[i].x
                    y = hand_landmarks.landmark[i].y
                    data_aux.append(x - min(x_))  # Relative X
                    data_aux.append(y - min(y_))  # Relative Y

            # Prepare for Model Input
            # Agar aapka model 42 landmarks (x,y for 21 points) leta hai
            prediction_data = np.asarray(data_aux).reshape(1, -1)

            prediction = self.model.predict(prediction_data)

            # Get result and confidence
            res_index = np.argmax(prediction)
            confidence = float(np.max(prediction))

            return self.labels[res_index], confidence

        # Agar koi hath detect nahi hua
        return "None", 0.0

# Usage for testing:
# predictor = ISLPredictor('sign_model.h5')
# label, conf = predictor.predict(frame)