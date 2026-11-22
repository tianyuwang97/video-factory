# 稍微一等 · 视频工厂

用于查看视频制作进度的交互式工厂工作台：从选题、口播、分镜、配音、关键帧、动画、剪辑到质检交付。

[在线工厂](https://xiaodeng-video-factory.xiaoboss.chatgpt.site)

## 功能
- 等距工厂地图：悬浮查看流程，点击固定详情；另有步骤清单。
- 项目切换、八阶段进度、最近更新和离线状态。
- 关键帧、声音、动画片段以及横竖版成片预览。
- 统一的小工厂 Logo、网站图标和分享图。
- 云端 R2 存储状态与媒体；公开读取，写入需要服务端同步密钥。

## 运行
需要 Node.js 24.22+、npm。推荐使用较新的 Node 24 LTS，避免旧版 Windows 文件复制问题。

```sh
npm ci
npm run dev
npm run build
npm start
```

Sites 发布与模板细节见 [docs/SITES_STARTER.md](docs/SITES_STARTER.md)。托管清单保留现有站点 ID，仓库用于备份和维护；GitHub 提交不会自动更新 Sites。

## 目录
- `public/factory/`：工厂界面、建筑和交互。
- `public/brand/`：Logo 的网站尺寸及图标。
- `lib/factory-api.ts`：状态、素材和受保护的同步接口。
- `lib/factory-seed.json`：尚未同步时显示的初始项目记录。
- `worker/`：Cloudflare Worker 入口。
- `desktop-sync/`：从本地项目采集状态并推送云端的桥接脚本。

## 同步配置
在 Sites 服务端设置秘密变量 `FACTORY_SYNC_TOKEN`。电脑同步端通过 `X-Factory-Sync-Key` 请求头发送同一密钥；不要把值写入 Git 仓库或浏览器脚本。

将 `desktop-sync/projects.example.json` 复制为已忽略的 `projects.json`，填写自己的工作和成片目录。在工作目录的 `workflow-state.json` 中记录阶段状态。安装 `desktop-sync/requirements.txt` 后运行 `sync_bridge.py`，通过标准输入传入一行 JSON：

```json
{"url":"https://your-site.example","sync_token":"YOUR_RUNTIME_SECRET"}
```

私有 Sites 还需要可选的 `token` 字段（平台服务访问令牌）。实际凭据应由秘密管理器或安全输入交给进程，不要写进 shell 历史。脚本每 15 秒同步一次，网站每 5 秒刷新；本机进程停止后显示最后同步记录。脚本不会启动视频生成。

## 数据与素材
仓库包含网页源码、品牌素材与同步程序。实际成片、声音克隆源、模型权重、缓存、用户密钥及云端数据不存入 Git。
