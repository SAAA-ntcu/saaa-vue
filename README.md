# 縣市學生學習能力檢測系統 · 前端現代化專案 (SAAA-Vue)

<div align="center">

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Element Plus](https://img.shields.io/badge/Element_Plus-2.14-409EFF?style=flat-square&logo=element-plus&logoColor=white)
![Deploy Status](https://img.shields.io/badge/Deploy-GitHub_Pages-2ea44f?style=flat-square&logo=github-pages&logoColor=white)

**專為縣市級學力檢測打造的高效、直觀、數據驅動之教育診斷儀表板**

[🌐 線上展示站點 (Demo)](https://saaa-ntcu.github.io/saaa-vue/) · [📋 核心功能模組](#-核心功能模組-key-features) · [🔐 角色權限體系](#-角色與權限架構-rbac)

</div>

---

## 📖 專案簡介 (Overview)

**SAAA-Vue (Students' Academic Attainment Assessment)** 係國立臺中教育大學（NTCU）測驗統計與適性學習研究中心受委託開發之「縣市學生學習能力檢測」前端單頁應用程式（SPA）。

本專案全面重構升級為 **Vue 3 + Vite + Tailwind CSS v4 + Element Plus**，採用活頁夾筆記本質感視覺（Notebook Binder Frame）與莫蘭迪綠雅緻色系，致力於提供校長、行政主管、學年主任、班級導師與科任教師更直觀、零負擔的教學數據診斷與成效追蹤支援。

---

## 🌟 核心功能模組 (Key Features)

### 1. 📊 成績專區 (Scores Analytics & Drill-Down)
- **總體表現診斷儀表盤 (Diagnostic Gauge Meter)**：
  - 180° 四級彩色弧形量表（Grade D / C / B / A），清楚呈現受測班級在整體評量中之表現區間定位與雷達指針。
- **三層式學生成績鑽取 (3-Level Drill-Down)**：
  - **Level 1（校級全覽）**：全校各班 lollipop 答對率對比圖與快速進入。
  - **Level 2（班級成績統計）**：**方案 A 水平基準長條對齊圖 (Horizon Benchmark Bar)**，一覽各向度實測值，並與校、縣、全三元基準線直觀比對。
  - **Level 3（個人診斷抽屜）**：右側無縫抽屜，支援寬版展開、答對率橫向對比條與錯題清單，支援觸控手勢滑動切換學生。
- **試題分析結果**：
  - **傳統三基準折線圖**：班級/學校實測、縣市平均、整體平均乾淨對比，支援十字準心懸浮卡與題號切換。
  - **試題四象限散佈圖**：直觀劃分「高鑑別度」、「優良題型」等指標。
- **報表矩陣下載 (Reports Download Matrix)**：
  - 支援學校、年級、班級與學生 5 大分析報表矩陣下載（Excel、Word、PDF、ODT、ZIP 批次打包）。

### 2. 👥 綜合專區 (Integrated Administration)
- **教師帳號管理 (Teacher Account Management)**：
  - **學年度全流程支援**：新增、篩選、編輯皆納入學年度欄位（115、114、113、112 學年度）。
  - **雙開關教學身分設定**：導師帶班設定與任課班級矩陣獨立配置，支援一鍵複製配課。
  - **批次指派與狀態管理**：支援兩階段智慧配班精靈、行內快速編輯與帳號啟用/停用切換。
- **缺考名單下載 (Absentee Management)**：
  - 支援多學年度、施測年級（3~6年級）、班級與考科多條件篩選。
  - 全體教職員（校長、校管理者、學年主任、導師、科任教師）均可查閱並匯出 Excel 清冊。

### 3. 🔐 登入系統與吉祥物互動指引 (Login & Mascots)
- **登入頁雙吉祥物專職分工 (Dual Mascot Pods)**：
  - 👦 **左側小男孩（read_boy）**：配屬「📖 操作說明手冊」專員，提供校長、校管理者、學年主任、導師、科任教師 5 本 PDF 手冊下載。
  - 👧 **右側小女孩（read_girl）**：配屬「💡 疑難排解與支援」顧問，提供「❓ 登入 Q&A」彈窗與最佳瀏覽器環境建議（Chrome、Edge、Firefox）。
- **密碼管理**：支援忘記密碼身分驗證申請與登入後密碼修改。

### 4. 📢 試題公告與評量架構 (Exams & Frameworks)
- **試題公告**：依學年度、學制、年級與科目分類篩選，支援線上預覽與歷屆考題一鍵批次下載。
- **評量架構**：清晰呈現核心素養、評量向度與表現標準之層級結構。

---

## 🔐 角色與權限架構 (RBAC)

系統內建 5 種教育現場角色，依權限動態控制數據可見範圍與導覽選單：

| 角色名稱 | 預設視角 | 班級切換權限 | 學生個別診斷權限 | 教師帳號管理 | 缺考名單下載 |
| :--- | :--- | :---: | :---: | :---: | :---: |
| 🏫 **校長** | 全校宏觀總覽 | ✅ 全校各班任意切換 | ✅ 全校學生 | 唯讀檢視 | ✅ 全校查閱 |
| ⚙️ **校管理者** | 全校總覽 + 管理模式 | ✅ 全校各班任意切換 | ✅ 全校學生 | ✅ 完整新增/編輯/配班 | ✅ 全校查閱 |
| 📚 **學年主任** | 該年級總覽 | ✅ 該年級各班切換 | ✅ 該年級學生 | 該年級檢視 | ✅ 全校查閱 |
| 👩‍🏫 **班級導師** | 所屬任教班級 | 🔒 鎖定本班 | ✅ 本班學生完整報告 | 僅限本人資料 | ✅ 本校查閱 |
| 🧑‍🏫 **科任教師** | 所授任課班級 | ✅ 限選任教班級 | ✅ 任課班級學生 | 僅限本人資料 | ✅ 本校查閱 |

---

## 🛠️ 技術棧 (Tech Stack)

| 領域 | 技術 / 套件 | 說明 |
| :--- | :--- | :--- |
| **Core Framework** | [Vue 3.5](https://vuejs.org/) | Composition API、`<script setup>`、單向響應式數據流 |
| **Build Tool** | [Vite 8.3](https://vite.dev/) | 極速 HMR 熱更新、Rollup Code Splitting |
| **Routing** | [Vue Router 4](https://router.vuejs.org/) | HTML5 History 模式、路由權限守衛 (`beforeEach`) |
| **CSS & Design** | [Tailwind CSS v4](https://tailwindcss.com/) | 新世代 CSS 引擎，零配置極速樣式工具鏈 |
| **Component UI** | [Element Plus 2.14](https://element-plus.org/) | 抽屜、對話框、選單、訊息提示、分頁控制 |
| **CI/CD** | [GitHub Actions](https://github.com/features/actions) | 自動打包並部署至 GitHub Pages，含 SPA 404 回退 |

---

## 📂 專案結構 (Directory Structure)

```text
saaa-vue/
├── .github/workflows/     # GitHub Actions 自動部署工作流 (deploy-pages.yml)
├── public/                # 靜態資源（Logo、read_boy、read_girl 插圖）
├── src/
│   ├── assets/            # 全域樣式表 (CSS) 與向量圖標
│   ├── components/        # 共用與專用 UI 組件
│   │   ├── common/        # 登入 Q&A 等共用彈窗
│   │   ├── integrated/    # 綜合專區組件 (TeacherManagement, AbsenteeList)
│   │   ├── layout/        # 版面佈局 (AppHeader, AppFooter, NotebookFrame)
│   │   ├── news/          # 消息卡片與下載彈窗
│   │   └── scores/        # 成績鑽取核心 (InquiryDrillDown.vue)
│   ├── composables/       # 業務邏輯封裝 (useAuth, usePagination, useAssessmentYear)
│   ├── data/              # Mock 數據與常模種子資料 (teacherData, scoreData 等)
│   ├── router/            # 路由定義與權限守衛
│   ├── services/          # API 抽象層與資料請求服務 (apiClient, teacherService 等)
│   ├── utils/             # 工具函式 (batchDownloader 等)
│   ├── views/             # 頁面級視圖 (ScoresView, LoginView, IntegratedView 等)
│   ├── App.vue            # 根組件
│   └── main.js            # 應用程式入口
├── index.html             # HTML 模版
├── package.json           # 專案依賴與腳本
└── vite.config.js         # Vite 與 Tailwind 構建配置
```

---

## 🚀 快速上手 (Getting Started)

### 環境需求
- **Node.js**：`^18.0.0` 或 `>= 20.0.0`
- **npm**：`>= 9.0.0`

### 1. 安裝相依
```bash
npm install
```

### 2. 本地開發伺服器
啟動開發環境（預設運行於 `http://localhost:5173/`）：
```bash
npm run dev
```

### 3. 生產環境構建
編譯並壓縮至 `dist/` 目錄：
```bash
npm run build
```

### 4. 本地預覽生產版本
```bash
npm run preview
```

---

## 🚢 部署與發佈 (Deployment)

本專案配置了自動化 CI/CD 流程：
- 每當程式碼推送到 `main` 分支時，[GitHub Actions 工作流](.github/workflows/deploy-pages.yml) 會自動執行 `npm ci` 與 `npm run build`。
- 自動生成 `dist/404.html` 作為 SPA 路由回退，確保 GitHub Pages 重新整理不遺失路由。
- 線上站點自動同步更新至：[https://saaa-ntcu.github.io/saaa-vue/](https://saaa-ntcu.github.io/saaa-vue/)

---

## 📄 授權條款 (License)

國立臺中教育大學 (NTCU) 版權所有 © 2026. All rights reserved.
