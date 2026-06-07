# YoyoClicker

悠悠球比赛视频评分工具。

## 运行

Windows：

```bat
start.bat
```

双击 `start.bat` 后会自动启动本地服务并打开浏览器。

手动运行：

```bash
python -m http.server 8080
```

然后打开：

```text
http://localhost:8080
```

## 使用

1. 输入 YouTube 视频链接。
2. 点击“加载视频”。
3. 用键盘打分。

## 快捷键

```text
1-5  加 1 到 5 分
0    减 1 分
R    重置分数，保留当前视频
```

## 打包给别人

把以下文件放进同一个文件夹后压缩即可：

```text
index.html
style.css
script.js
server.js
start.bat
README.md
```

对方解压后双击 `start.bat` 即可使用。
