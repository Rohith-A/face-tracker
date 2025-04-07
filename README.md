# FaceMesh + Expression Detection (React + ml5.js + p5.js)

This project is a web-based face tracking and expression detection application built with **React**, **ml5.js**, and **p5.js**.

## 🔍 Features
- Real-time webcam-based face tracking
- Face mesh rendering (468 landmarks)
- Expression detection (Smiling, Surprised, Sad, Neutral)
- Captured face rendering with solid face shape
- Responsive canvas layout

## ⚙️ Tech Stack
- **React**: Frontend UI
- **p5.js**: Canvas rendering and interactivity
- **ml5.js**: FaceMesh model (MediaPipe-based)

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/face-mesh-emotion.git
cd face-mesh-emotion
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm start
```

### 4. Open in Browser
Go to: `http://localhost:3000`

## 🧠 How It Works
- Captures video from the webcam.
- Detects facial landmarks using `ml5.facemesh()`.
- Draws landmarks on the video feed.
- Press `c` to capture the current face mesh.
- Captured face mesh is rendered on the right side.
- Expression is detected based on geometry of facial points.

## 📸 Key Controls
| Key | Action |
|-----|--------|
| `c` | Capture the current face mesh |

## 📦 External Libraries
- [ml5.js](https://ml5js.org/)
- [p5.js](https://p5js.org/)

## 📄 License
MIT License

---

Made with 💚 using ml5.js + p5.js + React
