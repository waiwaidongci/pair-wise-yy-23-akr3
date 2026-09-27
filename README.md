# 盲文点字学习训练器

纯前端盲文点字学习与练习工具，支持点阵字符卡片、听写练习、错题本和学习进度统计，数据存 IndexedDB。

## 错题本按错因重练

- 错题本（`/#/mistakes`）按**错误原因**归类，每个原因下再分「待巩固」「已掌握」两组，可任选一组进入练习。
- 练习页只出所选原因、所选组内的字符，作答后即时显示对错与正确答案。
- **连续两次答对**才把该「字符 × 错误原因」移入已掌握；答错立即把连续次数清零，该题回到队尾重练。
- 同一字符出现在多个错误原因下时，两边进度以 `symbol_id::mistake_reason` 为键**分别保存，互不覆盖**。
- 进度持久化在 IndexedDB（库 `braille-trainer` / store `mistake_progress`），IndexedDB 不可用时回退 localStorage；关掉页面再打开仍能读到上次结果。
- 进度页（`/#/progress`）展示各错误原因的**剩余数量、掌握数量**及逐字符巩固状态。

## 快速启动

```bash
cp .env.example .env && docker compose up -d
```

## 访问地址或 CLI 示例

前端：<http://localhost:20111>



## 本地开发方式

- 前端：`cd frontend && npm install && npm run dev`



## 技术栈

| 层 | 技术 |
|---|---|
| 前端 | React 18 + TypeScript + Vite + Material UI + Zustand + IndexedDB |
| 后端 | - |
| 数据库 | 本地模拟数据 |
| 部署 | Docker Compose |

## 项目目录结构

```text
frontend/src/api, stores, types, constants, constructors, components/common, hooks, pages, router, utils, mocks
```

## 环境变量说明

- `COMPOSE_PROJECT_NAME`: Compose 项目名，默认 `braille-trainer`
- `FRONTEND_PORT`: 前端端口，默认 `20111`


## Docker 部署说明

- 根 Compose 文件不写 `version`，顶层 `name: braille-trainer`。
- 容器名均使用 `${COMPOSE_PROJECT_NAME:-braille-trainer}` 前缀。
- 数据库使用命名卷，避免绑定中文路径。
- 常见问题：端口占用时修改 `.env` 中端口后重启；需要重置数据时执行 `docker compose down -v`。

## 枚举/常量出现位置清单

- PracticeMode: constants/PracticeMode、types/PracticeMode、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- SymbolCategory: constants/SymbolCategory、types/SymbolCategory、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- MasteryLevel: constants/MasteryLevel、types/MasteryLevel、constructors、logTemplates、errorMessages、筛选器、展示组件/控制器均有引用。
- MistakeReason: constants/MistakeReason、types/Mistake、statusText、utils/mistakes、错题本/练习/进度页、错题分组展示均有引用。
- MistakeGroupStatus: constants/MistakeGroupStatus、components/common/MistakeGroupBadge、utils/mistakes、hooks/useMistakePractice、错题本与练习页均有引用。

## 为什么会牵一发动全身

实体字段、枚举、日志模板、错误消息、构造器、筛选器和展示组件被刻意拆散到多个目录；修改一个状态值通常需要同步类型、构造器、服务、控制器、store、页面、README 与数据库种子。

## License

MIT
