# 🚀 SignBridge AI  
### Neural Sign Language Translation Ecosystem  

> Bridging communication gaps using AI-powered real-time Indian Sign Language translation.

---

## 🌍 Overview  

SignBridge AI is a full-stack assistive technology platform that translates Indian Sign Language (ISL) into text and speech in real-time using deep learning and computer vision.  

The system focuses on:
- Real-time performance  
- Context-aware sentence formation  
- Privacy-first architecture  

---

## ✨ Key Features  

- ⚡ Real-Time Neural Hub  
  Low-latency (<100ms) gesture recognition using WebSockets  

- 🧠 Smart Mode (Semantic Bridge)  
  Converts gesture sequences into meaningful English sentences  

- ⚙️ Adaptive Throttling  
  Dynamically adjusts frame rate based on model confidence  

- 🔒 Privacy Shield (Skeleton Mode)  
  Uses hand landmarks instead of raw video data  

- 🔄 Multi-Modal Translation  
  - Sign → Text  
  - Sign → Speech  
  - Text → Sign (Future Scope)  
  - File-based translation  

---

## 🛠️ Tech Stack  

### Frontend  
- React.js  
- Tailwind CSS  
- Socket.io-client  

### Backend  
- Python (Flask)  
- TensorFlow / Keras  
- OpenCV  
- MediaPipe  
- PyAudio & SpeechRecognition  

---

## 🧠 Model Architecture  

### Convolutional Neural Network (CNN)  
- Input: 64×64 grayscale images  
- Automatically extracts spatial features  
- Detects gesture patterns with high accuracy  


### Optimization  
- Optimizer: Adam  
- Loss Function: Categorical Cross-Entropy  
- Accuracy: ~95%+  

---

## 🔄 Data Pipeline  

1. Normalization  
   Pixel values scaled from [0–255] → [0–1]  

2. Temporal Buffering  
   Aggregates predictions for sentence formation  

3. Prediction Output  
   Label + confidence score  

---

## 📡 Real-Time Workflow  

Webcam (React)  
↓  
WebSocket (Socket.io)  
↓  
Flask Server  
↓  
CNN Model  
↓  
Prediction + Confidence  
↓  
UI Display (Text/Speech)  

---

## 📂 Project Structure  

SignBridge-AI/  
│  
├── backend/  
│   ├── model/  
│   ├── app.py  
│   ├── requirements.txt  
│  
├── frontend/  
│   ├── src/  
│   ├── public/  
│   ├── package.json  
│  
├── dataset/  
├── README.md  
└── LICENSE  

---

## ⚙️ Installation & Setup  

### 1. Clone Repository  

git clone https://github.com/sakshitomarr/SignBridge-AI.git  
cd SignBridge-AI  

---

### 2. Setup Backend  

cd backend  
pip install -r requirements.txt  
python app.py  

---

### 3. Setup Frontend  

cd frontend  
npm install  
npm start  

---

## 💡 Innovation Highlights  

- Context-Aware Semantic Reconstructor  
- Dynamic Frame-Modulation Algorithm  
- Privacy-first landmark processing  
- WebSocket-based real-time inference  

---

## ⚠️ Limitations  

- CNN handles mostly static gestures  
- Limited ISL dataset availability  
- Sentence formation is semi-rule-based  

---

## 🔮 Future Scope  

- LSTM / Transformer for dynamic gestures  
- 3D avatar for Text → Sign  
- Multi-language support  
- Mobile app deployment  

---

## 🤝 Contributing  

Contributions are welcome!  

1. Fork the repo  
2. Create a new branch  
   git checkout -b feature-name  

3. Commit changes  
   git commit -m "Added new feature"  

4. Push  
   git push origin feature-name  

5. Create Pull Request  

---

## 📜 License  

This project is licensed under the MIT License.  

---

## 📬 Contact  

Sakshi Tomar  
Email: your-email@example.com  
GitHub: https://github.com/sakshitomarr  