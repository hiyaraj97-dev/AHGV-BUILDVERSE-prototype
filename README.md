# Temporal RAG — LMS AI Assistant (Prototype)
> **API-First Temporal RAG with Temporal Horizon Masking & Zero Timeline Leakage**

Based on the 6-slide presentation specifications, this prototype demonstrates a live, working LMS AI assistant engineered to solve the fatal flaw of traditional AI chatbots in video learning: **Future Timeline Leakage**.

---

## 🌐 Live Access & API Documentation Links

- **Interactive API Documentation (Web Tester)**: [https://hiyaraj97-dev.github.io/AHGV-BUILDVERSE-prototype/api-docs.html](https://hiyaraj97-dev.github.io/AHGV-BUILDVERSE-prototype/api-docs.html)
- **API Specification (Markdown)**: [`API_DOCUMENTATION.md`](API_DOCUMENTATION.md)
- **Live LMS Web Application**: [https://hiyaraj97-dev.github.io/AHGV-BUILDVERSE-prototype/](https://hiyaraj97-dev.github.io/AHGV-BUILDVERSE-prototype/)
- **Local API Explorer**: `http://localhost:3000/api-docs.html` (or `http://localhost:3000/docs`)

---

## 🎯 Architecture & PPT Slide Mapping

| Slide | Concept / Feature | Prototype Implementation |
|---|---|---|
| **Slide 1: Problem & Solution** | The Fatal AI Gap & Timeline Masking | `server/services/temporalRAG.js` implements `applyTemporalHorizonMask()`, physically hiding all video/course chunks past `pauseTime`. |
| **Slide 2: System Architecture** | React/Web Frontend, Node.js Backend, Knowledge Layer | Interactive LMS interface (`public/index.html`, `styles.css`, `app.js`), dependency-free Node.js backend (`server.js`), unified dataset (`server/data/lectureData.js`). |
| **Slide 3: Workflow & APIs** | Pause $\to$ Ask $\to$ Grounded Answer with Timestamps | REST `/api/ask` and live SSE `/api/stream`, video auto-focus on pause, clickable timestamp chips that scrub the video. |
| **Slide 4: Innovation & Guardrails** | "The teacher explains this at [14:20]!" & Fast Memory Cache | `detectFutureTopicCue()` gives preview roadmaps without spoiling; fast-memory LRU cache serves repeated doubts at **$0.00 compute**. |
| **Slide 5: Feasibility & Scalability** | Sub-100ms searches, Canvas/Moodle LMS add-on | Ultra-fast in-memory index (<5ms latency), Canvas LMS header & styling. |
| **Slide 6: Development Roadmap** | Multi-modal context pipeline, accuracy & UX | Synchronized viewer unifying **30s Transcripts**, **PPT Slides**, and **PDF Reading Notes**. |

---

## 🚀 How to Run the Prototype

The server is currently running locally at:
👉 **`http://localhost:3000`**

To restart or run manually in the future:
```bash
cd C:\Users\Admin\.gemini\antigravity\scratch\temporal-rag-lms
node server.js
```
Or simply double-click `start.bat`.

---

## 🧪 Interactive Walkthrough & Testing Scenarios

Open **`http://localhost:3000`** in your browser and test the following:

### 1. The Core Innovation: "No-Spoiler" Guardrail
- The lecture is initially paused at **[02:30]** on **Slide 2: Non-Linear Activation Functions**.
- Notice the **Temporal Horizon Masking Bar**:
  - Chunks 1 to 5 (00:00 - 02:30) are **Green / Unlocked**.
  - Chunks 6 to 14 (02:30 - 15:00) are **Grayed out with 🔒 Padlocks**.
- Click the quick prompt: **`🔒 Future Test: Backpropagation`**.
  - **Result**: The AI will NOT leak future equations! Instead, the Future Horizon Scanner detects that Backpropagation is taught later and responds:
    > *"We haven't covered backpropagation yet at this point in the lecture! ... 💡 **Teacher's Roadmap Alert**: The teacher explains this completely at **[12:30]**! Keep watching to understand how today's foundation leads straight into it."*

### 2. Compare Naive RAG vs. Temporal RAG Live
- Toggle the top switcher from **`🛡️ Temporal RAG`** to **`⚠️ Naive RAG`**.
- Notice the horizon bar unprotects all future chunks.
- Ask the same backpropagation question.
  - **Result**: Naive RAG immediately retrieves the future chunk from 12:30, dumping advanced equations and confusing the student before prerequisites are covered.

### 3. Clickable Timestamps
- Ask: *"What is an activation function?"*
- Click the generated **`▶ [01:45]`** citation button in the chat.
- **Result**: The video scrubber instantly jumps to 01:45, Slide 2 is highlighted, and the transcript scrolls directly to the spoken line!

### 4. Synchronized Multi-Source Middleware
- Click the tabs below the video:
  - **📊 Synced PPT Slide**: Shows slide diagram and bullet points matching the current video time.
  - **📄 Reading Notes (PDF)**: Shows textbook excerpts for Chapter 2.
  - **🎙️ Spoken Transcript**: 30-second segmented captions with click-to-seek functionality.
  - **⚡ 2-Minute Context Card**: Shows the quick reference card bundled for the LLM.

### 5. Fast-Memory Caching ($0.00 Compute)
- Send the same question again.
- **Result**: The footer displays **`⚡ Instant Cache Hit (0.1ms latency, Cost: $0.00)`**.

---

## 📁 Project Structure

```
temporal-rag-lms/
├── server.js                      # High-performance Node.js HTTP server (REST + SSE streaming)
├── server/
│   ├── data/
│   │   └── lectureData.js         # Unified Knowledge: 30s Transcripts, PPT Slides, PDF Notes
│   └── services/
│       └── temporalRAG.js         # Temporal Horizon Masking, Future Scanner, Context Bundler, Cache
├── public/
│   ├── index.html                 # Canvas-style LMS UI with Video Player & Live Side-Chat
│   ├── styles.css                 # Dark-mode EdTech styling, glassmorphism & visualizer bar
│   └── app.js                     # HTML5 canvas simulation, timeline scrubber, SSE consumer
├── start.bat                      # One-click Windows launcher
└── README.md                      # Documentation
```
