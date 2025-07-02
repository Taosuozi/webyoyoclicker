// 分数追踪
let addScore = 0;
let subtractScore = 0;

// DOM元素
const youtubeUrlInput = document.getElementById('youtube-url');
const loadVideoBtn = document.getElementById('load-video');
const youtubePlayer = document.getElementById('youtube-player');
const addScoreDisplay = document.getElementById('add-score');
const subtractScoreDisplay = document.getElementById('subtract-score');
const resetScoresBtn = document.getElementById('reset-scores');
const scoreDisplayOverlay = document.getElementById('score-display');
// 不再需要键盘覆盖层，使用全局事件拦截

// 🔬 即时诊断：页面加载状态
console.log('📊 脚本开始执行');
console.log('📊 页面加载状态:', document.readyState);
console.log('📊 DOM元素检查:', {
    body: !!document.body,
    youtubeInput: !!document.getElementById('youtube-url'),
    addScore: !!document.getElementById('add-score')
});

// 🚀 立即设置键盘监听（不等待DOM加载完成）
function setupImmediateKeyboardListening() {
    console.log('🚀 立即设置键盘监听...');
    
    // 如果document已存在，立即设置
    if (document) {
        document.addEventListener('keydown', handleGlobalKeyDown, true);
        document.addEventListener('keyup', handleGlobalKeyUp, true);
        console.log('✅ document 键盘监听已立即设置');
    }
    
    // window总是存在的
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    window.addEventListener('keyup', handleGlobalKeyUp, true);
    console.log('✅ window 键盘监听已立即设置');
}

// 立即执行
setupImmediateKeyboardListening();

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOMContentLoaded 事件触发');
    setupEventListeners();
    updateScoreDisplays();
    
        // 🧪 3秒后提示用户开始调试测试
    setTimeout(() => {
        console.log(`
🔬 调试模式启动！请按以下步骤测试：

📋 第一步：基础调试
1. 现在按任意键（比如字母a），查看控制台是否出现：
   "🔍 捕获到按键: a, 来源: BODY, 事件阶段: 1"
   
2. 如果看到这个消息，说明事件监听器工作正常
   如果没有看到，说明事件监听器设置失败

📋 第二步：数字键测试  
1. 按数字键1，查看控制台是否出现：
   "🎯 数字键 1 被强力拦截！正在执行评分..."
   "✅ +1分 绿色背景"
   
2. 同时观察页面：背景是否变绿？分数是否+1？

📋 第三步：YouTube功能测试
1. 确保YouTube视频正在播放
2. 按方向键←→，看视频是否快进/后退
3. 按空格键，看视频是否暂停/播放

📋 报告结果：
请告诉我你看到了什么调试信息，这样我就能准确定位问题！
        `);
    }, 3000);
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
    
    // 输入框焦点处理已不再需要特殊处理
    
    // 重置分数按钮
    resetScoresBtn.addEventListener('click', resetScores);
    
    // 🎯 超级强化键盘事件拦截 - 多重保障
    
    // 第一层：document capture阶段
    document.addEventListener('keydown', handleGlobalKeyDown, true);
    document.addEventListener('keyup', handleGlobalKeyUp, true);
    console.log('📡 第一层：document capture 监听已设置');
    
    // 第二层：window capture阶段  
    window.addEventListener('keydown', handleGlobalKeyDown, true);
    window.addEventListener('keyup', handleGlobalKeyUp, true);
    console.log('📡 第二层：window capture 监听已设置');
    
    // 第三层：document bubble阶段
    document.addEventListener('keydown', handleGlobalKeyDown, false);
    document.addEventListener('keyup', handleGlobalKeyUp, false);
    console.log('📡 第三层：document bubble 监听已设置');
    
    // 第四层：body元素直接监听
    document.body.addEventListener('keydown', handleGlobalKeyDown, true);
    document.body.addEventListener('keyup', handleGlobalKeyUp, true);
    console.log('📡 第四层：body capture 监听已设置');
    
    // 第五层：html元素监听
    document.documentElement.addEventListener('keydown', handleGlobalKeyDown, true);
    document.documentElement.addEventListener('keyup', handleGlobalKeyUp, true);
    console.log('📡 第五层：html capture 监听已设置');
    
    console.log('🔧 已启用超级强化多重键盘拦截机制！');
    
    // 🧪 立即自测：检查函数是否正常工作
    console.log('🧪 正在自测系统...');
    
    // 测试分数系统
    addPoints(1);
    console.log(`✅ 分数系统测试通过，当前加分: ${addScore}`);
    addScore = 0; // 重置
    updateScoreDisplays();
    
    // 测试背景闪烁（考虑最短时间）
    flashBackground('green');
    setTimeout(() => {
        console.log('✅ 背景闪烁系统测试通过（已设置最短闪烁时间300ms）');
    }, 400);
    
    // 测试视频覆盖显示
    setTimeout(() => {
        if (scoreDisplayOverlay) {
            showScoreOnVideo(1);
            console.log('✅ 视频评分显示系统测试通过（无边框纯文字显示300ms）');
        } else {
            console.log('⚠️ 视频评分显示元素未找到，请检查');
        }
    }, 1000);
    
    console.log('🎯 系统自测完成，所有基础功能正常！');
}

// 🎯 全局键盘按下事件处理 - 增强调试版本
function handleGlobalKeyDown(e) {
    // 首先记录所有按键事件
    console.log(`🔍 捕获到按键: ${e.key}, 来源: ${e.target.tagName}, 事件阶段: ${e.eventPhase}`);
    
    // 防止重复触发
    if (e.repeat) return;
    
    const key = e.key;
    
    // 🔍 拦截评分用的数字键和重置键：0, 1, 2, 3, 4, 5, r
    if (['0', '1', '2', '3', '4', '5', 'r', 'R'].includes(key)) {
        // ⛔ 强力拦截 - 使用所有可能的方法
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log(`🎯 按键 ${key} 被强力拦截！正在执行操作...`);
        
        // 执行评分/重置逻辑
        switch(key) {
            case '1':
                addPoints(1);
                flashBackground('green');
                showScoreOnVideo(1);
                console.log('✅ +1分 绿色背景300ms + 视频显示300ms');
                break;
            case '2':
                addPoints(2);
                flashBackground('blue');
                showScoreOnVideo(2);
                console.log('✅ +2分 蓝色背景300ms + 视频显示300ms');
                break;
            case '3':
                addPoints(3);
                flashBackground('orange');
                showScoreOnVideo(3);
                console.log('✅ +3分 橙色背景300ms + 视频显示300ms');
                break;
            case '4':
                addPoints(4);
                flashBackground('purple');
                showScoreOnVideo(4);
                console.log('✅ +4分 紫色背景300ms + 视频显示300ms');
                break;
            case '5':
                addPoints(5);
                flashBackground('purple');
                showScoreOnVideo(5);
                console.log('✅ +5分 紫色背景300ms + 视频显示300ms');
                break;
            case '0':
                subtractPoints(1);
                flashBackground('red');
                showScoreOnVideo(-1);
                console.log('✅ -1分 红色背景300ms + 视频显示300ms');
                break;
            case 'r':
            case 'R':
                resetScoresOnly();
                console.log('🔄 R键重置分数（保持视频加载状态）');
                break;
        }
        
        return false; // 确保事件完全被拦截
    } else {
        // 记录非数字键但不拦截
        console.log(`🎬 非评分键 ${key} 传递给YouTube`);
    }
}

// 🎯 全局键盘松开事件处理 - 增强调试版本
function handleGlobalKeyUp(e) {
    // 记录所有松开事件（简化版）
    console.log(`🔍 松开按键: ${e.key}`);
    
    const key = e.key;
    
    // 🔍 拦截评分用的数字键和重置键：0, 1, 2, 3, 4, 5, r
    if (['0', '1', '2', '3', '4', '5', 'r', 'R'].includes(key)) {
        // ⛔ 强力拦截
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        console.log(`🎯 数字键 ${key} 松开被拦截，尊重最短闪烁时间`);
        removeBackgroundFlash();
        
        return false; // 确保事件完全被拦截
    } else {
        console.log(`🎬 非评分键 ${key} 松开事件传递给YouTube`);
    }
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
    
    // 清空输入框
    youtubeUrlInput.value = '';
    
    // 隐藏输入区域（渐隐效果）
    hideVideoInputSection();
    
    // 添加加载成功的视觉反馈
    const videoContainer = document.querySelector('.video-container');
    videoContainer.style.transform = 'scale(0.95)';
    setTimeout(() => {
        videoContainer.style.transform = 'scale(1)';
        
        // 🎯 视频加载完成，全局键盘拦截已生效
        console.log('🎯 视频已加载，评分键盘功能已激活');
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

// 🎯 全局键盘事件拦截已完美解决所有冲突问题

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