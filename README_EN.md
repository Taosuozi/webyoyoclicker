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

## 📋 Detailed Usage Instructions

### 🎥 Video Operations

#### Supported YouTube Link Formats
- Standard link: `https://www.youtube.com/watch?v=VIDEO_ID`
- Short link: `https://youtu.be/VIDEO_ID`
- Embed link: `https://www.youtube.com/embed/VIDEO_ID`
- Mobile link: `https://m.youtube.com/watch?v=VIDEO_ID`

#### Video Controls
- **Play/Pause**: Spacebar or click play button
- **Volume Control**: Up/Down arrow keys or mouse wheel
- **Progress Control**: Left/Right arrow keys or drag progress bar
- **Fullscreen Toggle**: F key or double-click video
- **Mute Toggle**: M key

### ⌨️ Scoring Operations

#### Addition Operations (Number Keys 1-5)
| Key | Score | Background Color | Video Text Color | Font Size |
|-----|-------|------------------|------------------|-----------|
| 1 | +1 point | Green | Green | 3.0em |
| 2 | +2 points | Blue | Blue | 3.3em |
| 3 | +3 points | Orange | Orange | 3.6em |
| 4 | +4 points | Purple | Purple | 3.9em |
| 5 | +5 points | Purple | Purple | 4.2em |

#### Deduction Operations (Number Key 0)
| Key | Score | Background Color | Video Text Color | Font Size |
|-----|-------|------------------|------------------|-----------|
| 0 | -1 point | Red | Red | 3.0em |

#### Reset Operations
- **R Key**: Quick score reset to 0, maintains video playback state
- **Reset Button**: Complete system reset, clears video requiring new link input

### 📊 Score Display

#### Position Layout
- **Left Side**: Total additions display (green + sign)
- **Center**: YouTube video playback area
- **Right Side**: Total deductions display (red - sign)

#### Number Display Rules
- **Total Additions**: Sum of all positive scoring operations
- **Total Deductions**: Absolute value of all deduction operations
- **Net Score**: Total additions - Total deductions (displayed in page title)

## 🎯 Suggested Scoring Strategy

### 🏆 Competition Scoring Standards
- **+1 point**: Basic trick completion
- **+2 points**: Good trick proficiency
- **+3 points**: Excellent trick execution
- **+4 points**: Perfect trick execution
- **+5 points**: Ultra-high difficulty tricks or innovative moves
- **-1 point**: Mistakes, drops, or trick failures

### ⏱️ Real-time Scoring Tips
1. **Anticipate Key Presses**: Prepare key presses based on player movements
2. **Rapid Combos**: Supports fast consecutive key operations
3. **Instant Corrections**: Immediate corrections possible with corresponding operations
4. **Rhythm Control**: Score following music beat

## 🔧 Technical Features

### 🌐 Compatibility
- **Browser Support**: Chrome, Firefox, Safari, Edge
- **Device Adaptation**: Windows, macOS, Linux, iOS, Android
- **Screen Resolution**: Adaptive from 1080p to 4K displays

### ⚡ Performance Optimization
- **Key Response**: < 50ms latency
- **Visual Effects**: Hardware-accelerated animations
- **Memory Management**: Automatic cleanup of temporary data
- **Network Optimization**: Efficient YouTube API calls

### 🔒 Keyboard Control
- **Dedicated Number Keys**: Keys 0-5 exclusively for scoring, won't interfere with YouTube controls
- **Other Key Pass-through**: Spacebar, arrow keys etc. normally control YouTube playback
- **Anti-conflict Design**: Multi-level event listening ensures accurate key response

## 📱 Responsive Design

### 💻 Desktop Devices (>1200px)
- Video size: 1400×788px
- Score buttons: 120×200px
- Layout: Left/right buttons on sides, video centered

### 📟 Tablet Devices (769-1200px)
- Video size: 1100×619px
- Score buttons: 100×180px
- Layout: Maintains horizontal arrangement

### 📱 Mobile Devices (≤768px)
- Video size: 640×480px or smaller
- Score buttons: Vertically arranged above/below video
- Layout: Automatically switches to portrait layout

## ⚠️ Important Notes

### 🔴 Usage Limitations
1. **Network Requirements**: Stable internet connection needed for YouTube video playback
2. **Browser Settings**: Some browsers may require allowing autoplay
3. **Keyboard Focus**: Page must have keyboard focus to respond to key presses
4. **Video Restrictions**: Some YouTube videos may restrict embedded playback

### 💡 Best Practices
1. **Fullscreen Use**: Recommended for use on large screens in fullscreen for best experience
2. **Keyboard Operations**: Using numeric keypad number keys works better
3. **Network Optimization**: Ensure stable network to avoid video stuttering affecting scoring
4. **Data Backup**: Important competitions should record score change processes

### 🐛 Troubleshooting
- **Keys Not Responding**: Click anywhere on page to gain focus
- **Video Won't Play**: Check network connection or try different video link
- **Background Not Flashing**: Refresh page to reload style files
- **Score Display Error**: Use R key or reset button to restart

## 📞 Technical Support

If you encounter usage issues, please check:
1. Browser console for error messages
2. Network connection status
3. Whether YouTube video supports embedded playback
4. Whether keyboard is working properly

---

**Version**: v1.0  
**Last Updated**: July 2025  
**Developer**: YoyoClicker Team  
**Repository**: https://github.com/Taosuozi/WebYoyoClicker

🎉 Enjoy your yo-yo competition scoring experience! 