# YoyoClicker

悠悠球比赛视频评分工具。支持两种使用方式：

1. 在本地页面中加载 YouTube 或 Bilibili 视频链接并计分。
2. 在 Bilibili 官网视频页上叠加悬浮计分面板，保留官网原生画质。

## 本地模式

Windows 用户可以直接双击：

```bat
start.bat
```

手动启动：

```bash
python -m http.server 8080
```

然后打开：

```text
http://localhost:8080
```

### 本地模式使用

1. 输入 YouTube 链接、Bilibili 视频链接，或粘贴 Bilibili iframe 嵌入代码。
2. 点击“加载视频”。
3. 使用键盘或页面按钮计分。

说明：Bilibili 外站 iframe 的高清能力由 Bilibili 官方限制。如果外站播放器提示“去官方网站才能高清观看”，请使用下面的 Bilibili 官网模式。

## Bilibili 官网模式

如果需要使用 Bilibili 官网原生高清画质，安装用户脚本：

```text
bilibili-score-overlay.user.js
```

推荐安装方式：

1. 安装 Tampermonkey 浏览器扩展。
2. 启动本地服务。
3. 打开安装页：

```text
http://localhost:8080/install-userscript.html
```

如果服务使用了其他端口，例如 `8090`，请把地址里的端口改成实际端口：

```text
http://localhost:8090/install-userscript.html
```

4. 点击“安装用户脚本”，在 Tampermonkey 弹出的页面中安装脚本。
5. 打开 Bilibili 视频页，左上角会出现 YoyoClicker 悬浮计分面板。

也可以在 Tampermonkey 中新建用户脚本，把 `bilibili-score-overlay.user.js` 的内容复制进去并保存。如果点击 `.user.js` 地址后只是下载文件或显示代码，说明 Tampermonkey 没有接管该链接，请使用手动安装方式。

### 官网模式功能

- 两个计分窗悬浮在 Bilibili 播放器上方，分别显示加分和扣分。
- 拖动任意一个计分窗，另一个会按播放器中心线镜像对称移动。
- 计分窗位置会自动保存。
- 打分时，Bilibili 播放器外围边框会闪烁对应颜色。
- 不需要填写 Cookie，不读取账号登录凭证。

## 快捷键

```text
1-5  加 1 到 5 分
0    减 1 分
R    重置分数
```

颜色对应：

```text
+1   绿色
+2   蓝色
+3   橙色
+4   紫色
+5   紫色
-1   红色
```

## 打包给别人

把以下文件放进同一个文件夹后压缩即可：

```text
index.html
style.css
script.js
server.js
start.bat
install-userscript.html
bilibili-score-overlay.user.js
README.md
```

对方解压后双击 `start.bat` 即可使用本地模式；如需 Bilibili 官网模式，再安装 `bilibili-score-overlay.user.js`。
