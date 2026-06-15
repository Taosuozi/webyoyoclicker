// ==UserScript==
// @name         YoyoClicker Bilibili Overlay
// @namespace    local.yoyoclicker
// @version      1.1.0
// @description  在 Bilibili 官网视频页上悬浮显示镜像计分窗
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/list/*
// @run-at       document-idle
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const positionStorageKey = 'yoyoclicker-bilibili-overlay-position';
    const scoringKeys = ['0', '1', '2', '3', '4', '5', 'r', 'R'];
    const defaultPanelPosition = { x: 24, y: 24 };
    const scoreColors = {
        '+1': '#4CAF50',
        '+2': '#2196F3',
        '+3': '#FF9800',
        '+4': '#9C27B0',
        '+5': '#9C27B0',
        '-1': '#F44336',
        reset: '#555555'
    };

    let addScore = 0;
    let subtractScore = 0;
    let panelPosition = loadPanelPosition();
    let activeDrag = null;
    let borderFlashTimeout = null;

    const host = document.createElement('div');
    host.id = 'yoyoclicker-overlay-host';
    document.documentElement.appendChild(host);

    const borderFlash = document.createElement('div');
    borderFlash.id = 'yoyoclicker-border-flash';
    document.documentElement.appendChild(borderFlash);

    const pageStyle = document.createElement('style');
    pageStyle.textContent = `
        #yoyoclicker-border-flash {
            position: fixed;
            z-index: 2147483646;
            pointer-events: none;
            box-sizing: border-box;
            border: 14px solid transparent;
            border-radius: 10px;
            box-shadow: none;
            opacity: 0;
            transition: opacity 0.12s ease, border-color 0.12s ease, box-shadow 0.12s ease;
        }

        #yoyoclicker-border-flash.show {
            opacity: 1;
        }
    `;
    document.head.appendChild(pageStyle);

    const shadow = host.attachShadow({ mode: 'open' });
    shadow.innerHTML = `
        <style>
            :host {
                position: fixed;
                inset: 0;
                z-index: 2147483647;
                pointer-events: none;
                font-family: "Microsoft YaHei", Arial, sans-serif;
            }

            .score-item {
                position: fixed;
                width: 120px;
                height: 180px;
                padding: 24px 18px;
                border-radius: 15px;
                background: rgba(255, 255, 255, 0.92);
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
                backdrop-filter: blur(6px);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 16px;
                cursor: grab;
                pointer-events: auto;
                touch-action: none;
                user-select: none;
                transition: transform 0.3s ease, box-shadow 0.2s ease;
            }

            .score-item:hover {
                box-shadow: 0 10px 28px rgba(0, 0, 0, 0.3);
            }

            .score-item.is-dragging {
                cursor: grabbing;
                transition: none;
            }

            .score-prefix {
                font-size: 64px;
                font-weight: 800;
                line-height: 1;
            }

            .score-display {
                color: #333;
                font-size: 40px;
                font-weight: 800;
                line-height: 1;
                text-align: center;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            }

            .add-score .score-prefix {
                color: #4CAF50;
            }

            .subtract-score .score-prefix {
                color: #F44336;
            }

            .score-pop {
                position: fixed;
                z-index: 1;
                min-width: 90px;
                color: #fff;
                font-size: 54px;
                font-weight: 900;
                line-height: 1;
                text-align: center;
                text-shadow: 0 4px 12px rgba(0, 0, 0, 0.65);
                opacity: 0;
                transform: translateY(10px);
                transition: opacity 0.16s ease, transform 0.16s ease;
                pointer-events: none;
            }

            .score-pop.show {
                opacity: 1;
                transform: translateY(0);
            }

            @media (max-width: 768px) {
                .score-item {
                    width: 88px;
                    height: 112px;
                    padding: 12px 10px;
                    gap: 10px;
                }

                .score-prefix {
                    font-size: 48px;
                }

                .score-display {
                    font-size: 32px;
                }

                .score-pop {
                    font-size: 40px;
                }
            }
        </style>

        <div class="score-item add-score" data-score-panel="add">
            <span class="score-prefix">+</span>
            <div class="score-display" id="add-score">0</div>
        </div>

        <div class="score-item subtract-score" data-score-panel="subtract">
            <span class="score-prefix">-</span>
            <div class="score-display" id="subtract-score">0</div>
        </div>

        <div class="score-pop" id="score-pop"></div>
    `;

    const addScorePanel = shadow.querySelector('.add-score');
    const subtractScorePanel = shadow.querySelector('.subtract-score');
    const addScoreDisplay = shadow.getElementById('add-score');
    const subtractScoreDisplay = shadow.getElementById('subtract-score');
    const scorePop = shadow.getElementById('score-pop');

    updateScoreDisplays();
    applyMirroredScorePanelPositions();
    setInterval(applyMirroredScorePanelPositions, 500);
    window.addEventListener('resize', applyMirroredScorePanelPositions);
    window.addEventListener('scroll', applyMirroredScorePanelPositions, true);

    [addScorePanel, subtractScorePanel].forEach(panel => {
        panel.addEventListener('pointerdown', startScorePanelDrag);
        panel.addEventListener('pointermove', moveScorePanelDrag);
        panel.addEventListener('pointerup', endScorePanelDrag);
        panel.addEventListener('pointercancel', endScorePanelDrag);
    });

    document.addEventListener('keydown', handleGlobalKeyDown, true);

    function handleGlobalKeyDown(event) {
        if (event.repeat || !scoringKeys.includes(event.key) || isEditableTarget(event.target)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        switch (event.key) {
            case '1':
                addPoints(1);
                break;
            case '2':
                addPoints(2);
                break;
            case '3':
                addPoints(3);
                break;
            case '4':
                addPoints(4);
                break;
            case '5':
                addPoints(5);
                break;
            case '0':
                subtractPoints(1);
                break;
            case 'r':
            case 'R':
                resetScoresOnly();
                break;
        }
    }

    function addPoints(points) {
        addScore += points;
        updateScoreDisplays();
        pulsePanel(addScorePanel);
        showScoreFeedback(`+${points}`);
    }

    function subtractPoints(points) {
        subtractScore += points;
        updateScoreDisplays();
        pulsePanel(subtractScorePanel);
        showScoreFeedback(`-${points}`);
    }

    function resetScoresOnly() {
        addScore = 0;
        subtractScore = 0;
        updateScoreDisplays();
        pulsePanel(addScorePanel);
        pulsePanel(subtractScorePanel);
        flashPlayerBorder(scoreColors.reset);
    }

    function updateScoreDisplays() {
        addScoreDisplay.textContent = addScore;
        subtractScoreDisplay.textContent = subtractScore;
    }

    function pulsePanel(panel) {
        panel.style.transform = 'scale(1.1)';
        setTimeout(() => {
            panel.style.transform = 'scale(1)';
        }, 150);
    }

    function showScoreFeedback(text) {
        const color = scoreColors[text] || scoreColors.reset;
        const playerRect = getPlayerRect();
        const top = playerRect ? playerRect.top + 92 : 120;
        const left = playerRect ? playerRect.left + 150 : 150;

        scorePop.textContent = text;
        scorePop.style.color = color;
        scorePop.style.left = `${left}px`;
        scorePop.style.top = `${top}px`;
        scorePop.classList.add('show');
        flashPlayerBorder(color);

        setTimeout(() => {
            scorePop.classList.remove('show');
        }, 300);
    }

    function flashPlayerBorder(color) {
        const rect = getPlayerRect();
        if (!rect) return;

        clearTimeout(borderFlashTimeout);
        borderFlash.style.left = `${rect.left + 6}px`;
        borderFlash.style.top = `${rect.top + 6}px`;
        borderFlash.style.width = `${Math.max(rect.width - 12, 0)}px`;
        borderFlash.style.height = `${Math.max(rect.height - 12, 0)}px`;
        borderFlash.style.borderColor = color;
        borderFlash.style.boxShadow = `inset 0 0 0 4px ${hexToRgba(color, 0.55)}, 0 0 34px ${hexToRgba(color, 0.9)}`;
        borderFlash.classList.add('show');

        borderFlashTimeout = setTimeout(() => {
            borderFlash.classList.remove('show');
        }, 300);
    }

    function startScorePanelDrag(event) {
        const playerRect = getPlayerRect();
        if (!playerRect) return;

        const panel = event.currentTarget;
        const panelRect = panel.getBoundingClientRect();

        activeDrag = {
            panel,
            side: panel.dataset.scorePanel,
            offsetX: event.clientX - panelRect.left,
            offsetY: event.clientY - panelRect.top
        };

        panel.classList.add('is-dragging');
        panel.setPointerCapture(event.pointerId);
        event.preventDefault();
        updateScorePanelPosition(event.clientX, event.clientY);
    }

    function moveScorePanelDrag(event) {
        if (!activeDrag) return;

        updateScorePanelPosition(event.clientX, event.clientY);
    }

    function endScorePanelDrag(event) {
        if (!activeDrag) return;

        activeDrag.panel.classList.remove('is-dragging');
        if (activeDrag.panel.hasPointerCapture(event.pointerId)) {
            activeDrag.panel.releasePointerCapture(event.pointerId);
        }
        activeDrag = null;
        savePanelPosition();
    }

    function updateScorePanelPosition(clientX, clientY) {
        const playerRect = getPlayerRect();
        if (!playerRect || !activeDrag) return;

        const addWidth = addScorePanel.offsetWidth;
        const subtractWidth = subtractScorePanel.offsetWidth;
        const maxPanelHeight = Math.max(addScorePanel.offsetHeight, subtractScorePanel.offsetHeight);
        const draggedX = clientX - playerRect.left - activeDrag.offsetX;
        const draggedY = clientY - playerRect.top - activeDrag.offsetY;

        panelPosition.y = clamp(draggedY, 0, playerRect.height - maxPanelHeight);

        if (activeDrag.side === 'subtract') {
            const subtractX = clamp(draggedX, 0, playerRect.width - subtractWidth);
            const subtractCenterX = subtractX + subtractWidth / 2;
            panelPosition.x = playerRect.width - subtractCenterX - addWidth / 2;
        } else {
            panelPosition.x = clamp(draggedX, 0, playerRect.width - addWidth);
        }

        applyMirroredScorePanelPositions();
    }

    function applyMirroredScorePanelPositions() {
        const playerRect = getPlayerRect();
        if (!playerRect) return;

        const addWidth = addScorePanel.offsetWidth;
        const addHeight = addScorePanel.offsetHeight;
        const subtractWidth = subtractScorePanel.offsetWidth;
        const subtractHeight = subtractScorePanel.offsetHeight;

        panelPosition.x = clamp(panelPosition.x, 0, playerRect.width - addWidth);
        panelPosition.y = clamp(panelPosition.y, 0, playerRect.height - Math.max(addHeight, subtractHeight));

        const addCenterX = panelPosition.x + addWidth / 2;
        const subtractX = clamp(playerRect.width - addCenterX - subtractWidth / 2, 0, playerRect.width - subtractWidth);

        addScorePanel.style.left = `${playerRect.left + panelPosition.x}px`;
        addScorePanel.style.top = `${playerRect.top + panelPosition.y}px`;
        subtractScorePanel.style.left = `${playerRect.left + subtractX}px`;
        subtractScorePanel.style.top = `${playerRect.top + panelPosition.y}px`;
    }

    function getPlayerRect() {
        const selectors = [
            '#bilibili-player',
            '.bpx-player-container',
            '.bpx-player-video-area',
            '.bilibili-player',
            '.player-wrap'
        ];

        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (!element) continue;

            const rect = element.getBoundingClientRect();
            if (rect.width > 320 && rect.height > 180) {
                return rect;
            }
        }

        const video = document.querySelector('video');
        return video ? video.getBoundingClientRect() : null;
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

    function loadPanelPosition() {
        try {
            const savedPosition = JSON.parse(localStorage.getItem(positionStorageKey));
            if (
                savedPosition &&
                Number.isFinite(savedPosition.x) &&
                Number.isFinite(savedPosition.y)
            ) {
                return savedPosition;
            }
        } catch (error) {
            localStorage.removeItem(positionStorageKey);
        }

        return { ...defaultPanelPosition };
    }

    function savePanelPosition() {
        localStorage.setItem(positionStorageKey, JSON.stringify(panelPosition));
    }

    function hexToRgba(hex, alpha) {
        const value = hex.replace('#', '');
        const red = parseInt(value.slice(0, 2), 16);
        const green = parseInt(value.slice(2, 4), 16);
        const blue = parseInt(value.slice(4, 6), 16);

        return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
    }

    function clamp(value, min, max) {
        if (max < min) return min;
        return Math.min(Math.max(value, min), max);
    }
})();
