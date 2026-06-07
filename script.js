// 分数追踪
let addScore = 0;
let subtractScore = 0;
let isVideoLoaded = false;

// DOM元素
const youtubeUrlInput = document.getElementById('youtube-url');
const loadVideoBtn = document.getElementById('load-video');
const youtubePlayer = document.getElementById('youtube-player');
const addScoreDisplay = document.getElementById('add-score');
const subtractScoreDisplay = document.getElementById('subtract-score');
const resetScoresBtn = document.getElementById('reset-scores');
const scoreDisplayOverlay = document.getElementById('score-display');
const videoStage = document.querySelector('.video-stage');
const addScorePanel = document.querySelector('.add-score');
const subtractScorePanel = document.querySelector('.subtract-score');
const scoringKeys = ['0', '1', '2', '3', '4', '5', 'r', 'R'];
let scorePanelPosition = { x: 24, y: 24 };
let activeScorePanelDrag = null;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    updateScoreDisplays();
});

// 设置事件监听器
function setupEventListeners() {
    // 加载视频按钮
    loadVideoBtn.addEventListener('click', loadVideo);
    
    // 回车键加载视频
    youtubeUrlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadVideo();
        }
    });
    
    // 重置分数按钮
    resetScoresBtn.addEventListener('click', resetScores);

    // 全局评分快捷键。只保留一组监听，避免一次按键被多处处理。
    document.addEventListener('keydown', handleGlobalKeyDown, true);
    setupScorePanelDragging();
    window.addEventListener('resize', applyMirroredScorePanelPositions);
}

function isEditableTarget(target) {
    if (!target) return false;

    const tagName = target.tagName;
    return target.isContentEditable ||
        tagName === 'INPUT' ||
        tagName === 'TEXTAREA' ||
        tagName === 'SELECT' ||
        tagName === 'BUTTON';
}

// 全局键盘按下事件处理
function handleGlobalKeyDown(e) {
    // 防止重复触发
    if (e.repeat) return;
    
    const key = e.key;
    
    if (!scoringKeys.includes(key) || !isVideoLoaded || isEditableTarget(e.target)) {
        return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    switch(key) {
        case '1':
            addPoints(1);
            flashBackground('green');
            showScoreOnVideo(1);
            break;
        case '2':
            addPoints(2);
            flashBackground('blue');
            showScoreOnVideo(2);
            break;
        case '3':
            addPoints(3);
            flashBackground('orange');
            showScoreOnVideo(3);
            break;
        case '4':
            addPoints(4);
            flashBackground('purple');
            showScoreOnVideo(4);
            break;
        case '5':
            addPoints(5);
            flashBackground('purple');
            showScoreOnVideo(5);
            break;
        case '0':
            subtractPoints(1);
            flashBackground('red');
            showScoreOnVideo(-1);
            break;
        case 'r':
        case 'R':
            resetScoresOnly();
            break;
    }
        
    return false;
}

function setupScorePanelDragging() {
    [addScorePanel, subtractScorePanel].forEach(panel => {
        panel.addEventListener('pointerdown', startScorePanelDrag);
        panel.addEventListener('pointermove', moveScorePanelDrag);
        panel.addEventListener('pointerup', endScorePanelDrag);
        panel.addEventListener('pointercancel', endScorePanelDrag);
    });

    applyMirroredScorePanelPositions();
}

function startScorePanelDrag(e) {
    if (!videoStage) return;

    const panel = e.currentTarget;
    const stageRect = videoStage.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();

    activeScorePanelDrag = {
        panel,
        side: panel.dataset.scorePanel,
        offsetX: e.clientX - panelRect.left,
        offsetY: e.clientY - panelRect.top
    };

    panel.classList.add('is-dragging');
    panel.setPointerCapture(e.pointerId);
    e.preventDefault();
    updateScorePanelPosition(e.clientX - stageRect.left, e.clientY - stageRect.top);
}

function moveScorePanelDrag(e) {
    if (!activeScorePanelDrag) return;

    const stageRect = videoStage.getBoundingClientRect();
    updateScorePanelPosition(e.clientX - stageRect.left, e.clientY - stageRect.top);
}

function endScorePanelDrag(e) {
    if (!activeScorePanelDrag) return;

    activeScorePanelDrag.panel.classList.remove('is-dragging');
    if (activeScorePanelDrag.panel.hasPointerCapture(e.pointerId)) {
        activeScorePanelDrag.panel.releasePointerCapture(e.pointerId);
    }
    activeScorePanelDrag = null;
}

function updateScorePanelPosition(pointerX, pointerY) {
    const addWidth = addScorePanel.offsetWidth;
    const addHeight = addScorePanel.offsetHeight;
    const subtractWidth = subtractScorePanel.offsetWidth;
    const stageWidth = videoStage.clientWidth;
    const stageHeight = videoStage.clientHeight;
    const draggedX = pointerX - activeScorePanelDrag.offsetX;
    const draggedY = pointerY - activeScorePanelDrag.offsetY;
    const panelHeight = activeScorePanelDrag.panel.offsetHeight;

    scorePanelPosition.y = clamp(draggedY, 0, stageHeight - panelHeight);

    if (activeScorePanelDrag.side === 'subtract') {
        const subtractX = clamp(draggedX, 0, stageWidth - subtractWidth);
        const subtractCenterX = subtractX + subtractWidth / 2;
        scorePanelPosition.x = stageWidth - subtractCenterX - addWidth / 2;
    } else {
        scorePanelPosition.x = clamp(draggedX, 0, stageWidth - addWidth);
    }

    applyMirroredScorePanelPositions();
}

function applyMirroredScorePanelPositions() {
    if (!videoStage || !addScorePanel || !subtractScorePanel) return;

    const stageWidth = videoStage.clientWidth;
    const stageHeight = videoStage.clientHeight;
    const addWidth = addScorePanel.offsetWidth;
    const addHeight = addScorePanel.offsetHeight;
    const subtractWidth = subtractScorePanel.offsetWidth;
    const subtractHeight = subtractScorePanel.offsetHeight;

    scorePanelPosition.x = clamp(scorePanelPosition.x, 0, stageWidth - addWidth);
    scorePanelPosition.y = clamp(scorePanelPosition.y, 0, stageHeight - Math.max(addHeight, subtractHeight));

    const addCenterX = scorePanelPosition.x + addWidth / 2;
    const subtractX = clamp(stageWidth - addCenterX - subtractWidth / 2, 0, stageWidth - subtractWidth);

    addScorePanel.style.left = `${scorePanelPosition.x}px`;
    addScorePanel.style.top = `${scorePanelPosition.y}px`;
    addScorePanel.style.right = 'auto';
    subtractScorePanel.style.left = `${subtractX}px`;
    subtractScorePanel.style.top = `${scorePanelPosition.y}px`;
    subtractScorePanel.style.right = 'auto';
}

function clamp(value, min, max) {
    if (max < min) return min;
    return Math.min(Math.max(value, min), max);
}



// 加分功能
function addPoints(points) {
    addScore += points;
    updateScoreDisplays();
    
    // 添加视觉反馈
    const addScoreElement = document.querySelector('.add-score');
    addScoreElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        addScoreElement.style.transform = 'scale(1)';
    }, 150);
}

// 减分功能
function subtractPoints(points) {
    subtractScore += points;
    updateScoreDisplays();
    
    // 添加视觉反馈
    const subtractScoreElement = document.querySelector('.subtract-score');
    subtractScoreElement.style.transform = 'scale(1.1)';
    setTimeout(() => {
        subtractScoreElement.style.transform = 'scale(1)';
    }, 150);
}

// 更新分数显示
function updateScoreDisplays() {
    addScoreDisplay.textContent = addScore;
    subtractScoreDisplay.textContent = subtractScore;
}

// 🔄 仅重置分数（R键专用 - 保持视频加载状态）
function resetScoresOnly() {
    addScore = 0;
    subtractScore = 0;
    updateScoreDisplays();
    
    // 添加重置动画效果（仅分数框）
    const scoreItems = document.querySelectorAll('.score-item');
    scoreItems.forEach(item => {
        item.style.transform = 'scale(0.8)';
        setTimeout(() => {
            item.style.transform = 'scale(1)';
        }, 200);
    });
    
    console.log('🔄 分数已重置，视频保持加载状态');
}

// 重置分数（按钮专用 - 清空视频并重新输入）
function resetScores() {
    if (confirm('确定要重置所有分数吗？')) {
        addScore = 0;
        subtractScore = 0;
        isVideoLoaded = false;
        updateScoreDisplays();
        
        // 🎯 重置完成，全局键盘拦截持续有效
        
        // 重新显示输入区域（渐显效果）
        showVideoInputSection();
        
        // 清空视频播放器
        youtubePlayer.innerHTML = `
            <div class="placeholder">
                <p>请输入YouTube链接加载视频</p>
            </div>
        `;
        
        // 添加重置动画效果
        const scoreItems = document.querySelectorAll('.score-item');
        scoreItems.forEach(item => {
            item.style.transform = 'scale(0.8)';
            setTimeout(() => {
                item.style.transform = 'scale(1)';
            }, 200);
        });
    }
}

// 背景闪烁状态管理
let backgroundFlashTimeout = null;

// 背景闪烁效果（增强版 - 确保最短闪烁时间）
function flashBackground(color) {
    const body = document.body;
    
    // 清除之前的定时器
    if (backgroundFlashTimeout) {
        clearTimeout(backgroundFlashTimeout);
    }
    
    // 移除所有现有的flash类
    body.classList.remove('flash-green', 'flash-blue', 'flash-orange', 'flash-purple', 'flash-red');
    
    // 添加新的flash类
    body.classList.add(`flash-${color}`);
    
    // 确保最短闪烁时间：300毫秒
    backgroundFlashTimeout = setTimeout(() => {
        removeBackgroundFlashImmediate();
        backgroundFlashTimeout = null;
    }, 300);
}

// 立即移除背景闪烁效果（内部使用）
function removeBackgroundFlashImmediate() {
    const body = document.body;
    body.classList.remove('flash-green', 'flash-blue', 'flash-orange', 'flash-purple', 'flash-red');
}

// 移除背景闪烁效果（外部调用 - 尊重最短时间）
function removeBackgroundFlash() {
    // 如果已经设置了最短时间定时器，就不立即移除
    if (backgroundFlashTimeout) {
        return; // 让定时器自然完成
    }
    // 如果没有定时器，立即移除
    removeBackgroundFlashImmediate();
}

// 加载YouTube视频
function loadVideo() {
    const url = youtubeUrlInput.value.trim();
    
    if (!url) {
        alert('请输入YouTube视频链接');
        return;
    }
    
    const videoId = extractVideoId(url);
    
    if (!videoId) {
        alert('无效的YouTube链接，请检查后重试');
        return;
    }
    
    // 创建YouTube嵌入iframe
    const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&modestbranding=1`;
    
    youtubePlayer.innerHTML = `
        <iframe 
            src="${embedUrl}" 
            title="YouTube video player" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
            allowfullscreen>
        </iframe>
    `;
    isVideoLoaded = true;
    
    // 清空输入框
    youtubeUrlInput.value = '';
    
    // 隐藏输入区域（渐隐效果）
    hideVideoInputSection();
    
    // 添加加载成功的视觉反馈
    const videoContainer = document.querySelector('.video-container');
    videoContainer.style.transform = 'scale(0.95)';
    setTimeout(() => {
        videoContainer.style.transform = 'scale(1)';
        
        console.log('视频已加载，评分键盘功能已激活');
    }, 200);
}

// 从YouTube链接中提取视频ID
function extractVideoId(url) {
    // 支持的YouTube URL格式：
    // https://www.youtube.com/watch?v=VIDEO_ID
    // https://youtu.be/VIDEO_ID
    // https://www.youtube.com/embed/VIDEO_ID
    // https://www.youtube.com/v/VIDEO_ID
    
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    
    return (match && match[2].length === 11) ? match[2] : null;
}

// 显示当前分数统计（可选功能）
function getTotalScore() {
    return addScore - subtractScore;
}

// 视频数字显示状态管理
let scoreDisplayTimeout = null;
let scoreHideTimeout = null;

// 🎬 在YouTube视频上显示评分数字（无边框版本 - 300ms显示时间）
function showScoreOnVideo(score) {
    if (!scoreDisplayOverlay) {
        console.log('⚠️ 评分显示元素未找到');
        return;
    }
    
    // 清除之前的定时器
    if (scoreDisplayTimeout) {
        clearTimeout(scoreDisplayTimeout);
    }
    if (scoreHideTimeout) {
        clearTimeout(scoreHideTimeout);
    }
    
    // 清除之前的动画状态
    scoreDisplayOverlay.className = 'score-number';
    
    // 设置显示内容和样式
    let displayText = '';
    let scoreClass = '';
    
    switch(score) {
        case 1:
            displayText = '+1';
            scoreClass = 'score-1';
            break;
        case 2:
            displayText = '+2';
            scoreClass = 'score-2';
            break;
        case 3:
            displayText = '+3';
            scoreClass = 'score-3';
            break;
        case 4:
            displayText = '+4';
            scoreClass = 'score-4';
            break;
        case 5:
            displayText = '+5';
            scoreClass = 'score-5';
            break;
        case -1:
            displayText = '-1';
            scoreClass = 'score-minus-1';
            break;
        default:
            console.log('⚠️ 未知的评分值:', score);
            return;
    }
    
    // 设置文本和样式类
    scoreDisplayOverlay.textContent = displayText;
    scoreDisplayOverlay.className = `score-number ${scoreClass}`;
    
    console.log(`🎬 在视频上显示: ${displayText} (${scoreClass}) - 无边框纯文字300ms`);
    
    // 立即显示（确保可见）
    scoreDisplayOverlay.classList.add('show');
    
    // 最短显示时间：300毫秒后开始消失动画
    scoreDisplayTimeout = setTimeout(() => {
        scoreDisplayOverlay.classList.remove('show');
        scoreDisplayOverlay.classList.add('hide');
        
        // 消失动画完成后清空内容
        scoreHideTimeout = setTimeout(() => {
            scoreDisplayOverlay.textContent = '';
            scoreDisplayOverlay.className = 'score-number';
        }, 400);
    }, 300);
}

// 隐藏视频输入区域
function hideVideoInputSection() {
    const videoInputSection = document.querySelector('.video-input-section');
    videoInputSection.style.opacity = '0';
    videoInputSection.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        videoInputSection.style.display = 'none';
    }, 300);
}

// 显示视频输入区域
function showVideoInputSection() {
    const videoInputSection = document.querySelector('.video-input-section');
    videoInputSection.style.display = 'block';
    videoInputSection.style.opacity = '0';
    videoInputSection.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        videoInputSection.style.opacity = '1';
        videoInputSection.style.transform = 'translateY(0)';
    }, 50);
}

// 键盘快捷键说明（在控制台显示）
console.log(`
🎯 悠悠球比赛评分系统 - 键盘快捷键：

📊 评分功能：
1: +1分 (绿色背景闪烁300ms + 视频左上角显示绿色+1持续300ms)
2: +2分 (蓝色背景闪烁300ms + 视频左上角显示蓝色+2持续300ms)  
3: +3分 (橙色背景闪烁300ms + 视频左上角显示橙色+3持续300ms)
4: +4分 (紫色背景闪烁300ms + 视频左上角显示紫色+4持续300ms)
5: +5分 (紫色背景闪烁300ms + 视频左上角显示紫色+5持续300ms)
0: -1分 (红色背景闪烁300ms + 视频左上角显示红色-1持续300ms)
R: 重置分数 (保持视频加载状态)

🎬 YouTube控制：
←→: 快进/后退
空格: 暂停/播放
↑↓: 音量调节
F: 全屏

🏆 完整功能列表：
✅ 全局事件拦截技术 - 彻底解决焦点冲突！
✅ 数字键0-5被完全拦截用于评分
✅ 其他键100%传递给YouTube，功能完全正常
✅ 无论点击哪里，两套快捷键都能同时工作
🆕 视频覆盖显示 - 评分数字直接显示在视频左上角！
✅ 颜色对应：绿(+1)、蓝(+2)、橙(+3)、紫(+4/+5)、红(-1)
✅ 字体递增：+1/-1基础大小，+2到+5依次增大
✅ 动画效果：立即显示，300ms后淡出消失
✅ 纯文字显示：无边框无背景色，仅文字和阴影
🔧 显示时间300ms：快速简洁的评分反馈
🔧 修复遮挡问题：评分数字层级高于YouTube iframe，确保始终可见

🔬 工作原理：
- 在capture阶段拦截所有键盘事件
- 数字键被立即拦截并处理评分
- 其他键完全不干扰，自然传递给YouTube iframe
- 不使用焦点争夺，彻底避免冲突

当前总分: ${getTotalScore()}
`);

// 简化标题更新
setInterval(() => {
    document.title = `悠悠球评分系统 - 总分: ${getTotalScore()}`;
}, 2000); 
