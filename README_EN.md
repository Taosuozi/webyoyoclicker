# 🪀 YoYo Competition Scoring System

A real-time online scoring system specifically designed for yo-yo competitions, integrating YouTube video playback with fast keyboard scoring functionality.

## ✨ System Features

### 🎬 Video Playback
- **YouTube Integration**: Supports any YouTube video link playback
- **Full-Screen Display**: Large 1400×788 pixel video frame
- **Responsive Layout**: Supports desktop, tablet, mobile and other devices

### ⌨️ Keyboard Scoring
- **Number Keys 1-5**: Correspond to +1 to +5 point additions respectively
- **Number Key 0**: -1 point deduction operation
- **R Key**: Quick score reset (maintains video state)
- **Real-time Response**: Key presses take effect instantly with no delay

### 🎨 Visual Feedback
- **Background Flash**: Page background briefly changes color when keys are pressed (300ms)
- **Video Score Display**: Shows scoring numbers and colors in the top-left corner of video
- **Score Statistics**: Real-time display of total additions and deductions on left and right sides
- **Page Title Update**: Browser title bar shows current total score in real-time

## 🚀 Quick Start

### 1. Start Server
```bash
python -m http.server 8080
```

### 2. Open Browser
Visit: `http://localhost:8080`

### 3. Load Video
- Paste YouTube video link in the input box
- Click "Load Video" button
- Input box will automatically hide after successful video loading

### 4. Start Scoring
Use number keys 0-5 for real-time scoring operations

---

**Version**: v1.0  
**Last Updated**: July 2025  
**Developer**: Yang Enyuan  
**Repository**: Local deployment system

🎉 Enjoy your yo-yo competition scoring experience! 