# 📡 API Documentation — Temporal RAG LMS Engine
> **API-First Temporal RAG with Temporal Horizon Masking & Zero Timeline Leakage**  
> *Developed for AHGV BuildVerse 2026 Prototype (`hiyaraj97-dev/AHGV-BUILDVERSE-prototype`)*

---

## 🌐 Quick Links & Access Points

| Resource | URL |
|---|---|
| **Interactive API Documentation (Web UI)** | [https://hiyaraj97-dev.github.io/AHGV-BUILDVERSE-prototype/api-docs.html](https://hiyaraj97-dev.github.io/AHGV-BUILDVERSE-prototype/api-docs.html) |
| **Live LMS Web Application** | [https://hiyaraj97-dev.github.io/AHGV-BUILDVERSE-prototype/](https://hiyaraj97-dev.github.io/AHGV-BUILDVERSE-prototype/) |
| **GitHub Repository** | [https://github.com/hiyaraj97-dev/AHGV-BUILDVERSE-prototype](https://github.com/hiyaraj97-dev/AHGV-BUILDVERSE-prototype) |
| **Local Server Endpoint** | `http://localhost:3000` |

---

## 🏛️ Architectural Overview (Slides 1–4)

Traditional LMS AI chatbots suffer from **The Fatal AI Gap**: when a learner pauses at minute `02:30` and asks a question, standard RAG searches the entire video transcript and leaks future concepts, formulas, and answers from minute `12:30`.

The **Temporal RAG Engine** solves this mathematically at the database layer:

$$\mathcal{C}_{\text{search}} = \{ c_i \in \mathcal{C} \mid t_{\text{start}}(c_i) \le T_{\text{pause}} \}$$
$$\mathcal{C}_{\text{masked}} = \{ c_j \in \mathcal{C} \mid t_{\text{start}}(c_j) > T_{\text{pause}} \} \quad (\text{Physically Filtered Before Search})$$

- **Runtime Advantage**: 0% future-timeline leakage with zero extra compute cost.
- **Teaser Guardrail**: Scans $\mathcal{C}_{\text{masked}}$ only to detect future mentions and returns roadmap hints (*"The teacher explains this completely at [12:30]!"*) without leaking formulas.
- **Fast-Memory LRU Cache**: Repeated questions at identical timestamps are answered in $<0.1\text{ ms}$ for **\$0.00 compute**.

---

## 📑 Endpoints Summary

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ask` | Submit a student doubt with video pause timestamp |
| `GET` | `/api/stream` | Server-Sent Events (SSE) word-by-word streaming response |
| `GET` | `/api/context` | Retrieve 2-minute context card & horizon boundary at $T_{\text{pause}}$ |
| `GET` | `/api/lecture` | Retrieve full multi-resource middleware (transcripts, slides, notes) |
| `GET` | `/api/health` | Health check & guardrail status |
| `GET` | `/api/cache` | View fast-memory cache statistics and saved compute |

---

## 1. Ask Question API (`POST /api/ask`)

Submits a question asked by a student paused at a specific video timestamp.

### Request

- **URL**: `/api/ask`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`

#### Request Body
```json
{
  "query": "Why do we need an activation function?",
  "pauseSeconds": 150,
  "mode": "temporal"
}
```

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `query` | string | **Yes** | — | The student's question or doubt text |
| `pauseSeconds` | number | No | `0` | Exact video pause time in elapsed seconds (e.g. `150` for `02:30`) |
| `mode` | string | No | `"temporal"` | `"temporal"` (enables Horizon Masking) or `"naive"` (unrestricted RAG demonstration) |

---

### Response (`200 OK`)

```json
{
  "answer": "Based on what Professor Reynolds has explained up to **[02:30]**:\n\n• **Key Insight**: Now moving to Slide 2: Activation Functions. If we just leave z as a linear sum, any cascade of layers would collapse into a single linear matrix multiplication. Therefore, we pass z into a non-linear activation function sigma.\n\n• **Slide 2 Context**: As displayed on your screen, Necessity: Without non-linearity, multi-layer networks collapse to f(x) = W_all * x (linear).\n\n• **Course Notes Excerpt**: Theorem: The composition of any number of linear functions is itself a linear function...\n\nClick the timestamp **[01:45]** below to jump directly to this moment in the lecture.",
  "citations": [
    {
      "type": "video",
      "label": "Lecture [01:45]",
      "time": "01:45",
      "seconds": 105,
      "slideId": "slide-2"
    },
    {
      "type": "slide",
      "label": "Slide 2: Non-Linear Activation Functions",
      "slideId": "slide-2",
      "page": 2
    },
    {
      "type": "notes",
      "label": "Reading Notes: Chapter 2: The Non-Linearity Requirement",
      "chapter": 2
    }
  ],
  "futureHint": null,
  "temporalStats": {
    "mode": "temporal",
    "guardrailActive": true,
    "totalChunksInCourse": 14,
    "accessibleChunksCount": 5,
    "blockedFutureChunksCount": 9,
    "leakageRisk": "0% (Mathematically Masked)",
    "pauseTimestamp": "02:30"
  },
  "retrievedChunks": [
    {
      "id": "chunk-04",
      "timestamp": "01:45",
      "label": "01:45 - 02:30",
      "slideId": "slide-2",
      "text": "Now moving to Slide 2: Activation Functions. If we just leave z as a linear sum..."
    }
  ],
  "fromCache": false,
  "latencyMs": 4,
  "costDollars": "0.00"
}
```

---

### Future Topic Detection Example (The No-Spoiler Teaser)

When a student paused at `02:30` asks about an upcoming concept like **Backpropagation** (taught at `12:30`):

#### Request:
```json
{
  "query": "How does backpropagation work?",
  "pauseSeconds": 150,
  "mode": "temporal"
}
```

#### Response:
```json
{
  "answer": "You're thinking ahead! At your current lecture timestamp **[02:30]**, the class hasn't covered this concept yet.\n\nRight now on **Slide 2: Non-Linear Activation Functions**, the professor is focusing on foundational topics (Necessity: Without non-linearity, multi-layer networks collapse to f(x) = W_all * x (linear)).\n\n💡 **Teacher's Roadmap Alert**: The teacher explains this completely at **[12:30]**! Keep watching to understand how today's foundation leads straight into it.",
  "citations": [
    {
      "type": "future-cue",
      "label": "Upcoming at [12:30]",
      "time": "12:30",
      "slideId": "slide-6"
    }
  ],
  "futureHint": "The teacher explains this completely at [12:30]!",
  "temporalStats": {
    "mode": "temporal",
    "guardrailActive": true,
    "accessibleChunksCount": 5,
    "blockedFutureChunksCount": 9,
    "leakageRisk": "0% (Mathematically Masked)"
  }
}
```

---

## 2. Server-Sent Events (SSE) Streaming API (`GET /api/stream`)

Streams the pedagogical explanation word-by-word with zero waiting time directly into the video player chat side-pane (Slide 4).

### Request

- **URL**: `/api/stream`
- **Method**: `GET`
- **Query Parameters**:
  - `query` *(string, required)*: The student's question.
  - `pauseSeconds` *(number, optional)*: Elapsed pause time in seconds.
  - `mode` *(string, optional)*: `"temporal"` or `"naive"`.

### Response Stream (`text/event-stream`)

Tokens stream sequentially:
```text
data: {"token":"Based "}

data: {"token":"on "}

data: {"token":"what "}

data: {"token":"Professor "}

data: {"token":"Reynolds "}

...

data: {"done":true,"citations":[{"type":"video","label":"Lecture [01:45]","seconds":105}],"temporalStats":{"leakageRisk":"0% (Mathematically Masked)"},"latencyMs":3,"costDollars":"0.00"}
```

---

## 3. Dynamic Context & Horizon Inspector (`GET /api/context`)

Retrieves the 2-minute rolling context window, active slide, active PDF chapter, and the exact count of accessible vs. blocked chunks at the given pause time.

### Request
- **URL**: `/api/context?pauseSeconds=150`
- **Method**: `GET`

### Response
```json
{
  "pauseSeconds": 150,
  "formattedPauseTime": "02:30",
  "contextCard": {
    "windowStartSeconds": 30,
    "windowEndSeconds": 150,
    "activeSlide": {
      "id": "slide-2",
      "slideNumber": 2,
      "title": "Non-Linear Activation Functions"
    },
    "activePdfNote": {
      "chapterNumber": 2,
      "title": "Chapter 2: The Non-Linearity Requirement"
    }
  },
  "horizon": {
    "accessibleCount": 5,
    "maskedFutureCount": 9,
    "accessibleChunks": [
      { "id": "chunk-01", "label": "00:00 - 00:30", "startSeconds": 0 }
    ],
    "maskedFutureChunks": [
      { "id": "chunk-06", "label": "03:20 - 04:15", "status": "LOCKED 🔒 (Mathematically Masked)" }
    ]
  }
}
```

---

## 4. Courseware & Knowledge Layer (`GET /api/lecture`)

Returns the unified multi-resource dataset (AWS Transcribe 30s chunks, synchronized PPT slides, and PDF notes).

### Response
```json
{
  "course": {
    "id": "cs229-dl-01",
    "title": "CS229: Foundations of Deep Learning",
    "module": "Module 2: Perceptrons, Loss Surfaces & Backpropagation",
    "instructor": "Prof. Andrew Reynolds (Stanford AI Lab)",
    "totalDurationSeconds": 900,
    "chapters": [...],
    "transcriptChunks": [...],
    "slides": [...],
    "pdfReadingNotes": [...]
  },
  "stats": {
    "totalDurationSeconds": 900,
    "formattedDuration": "15:00",
    "totalTranscriptChunks": 14,
    "totalSlides": 6,
    "totalPdfChapters": 6
  }
}
```

---

## 5. Health Check & Guardrail Verification (`GET /api/health`)

Verifies server health, engine version, and active status of the Temporal Horizon Masking Guardrail.

### Response
```json
{
  "status": "healthy",
  "system": "API-first Temporal RAG with Temporal Horizon Masking",
  "guardrail": "ACTIVE (0% future-timeline leakage)",
  "cachedItemsCount": 4,
  "timestamp": "2026-10-22T13:45:00.000Z"
}
```

---

## 6. Fast Memory Cache Stats (`GET /api/cache`)

Inspects in-memory LRU cache entries to verify the **\$0.00 compute cost** metric from Slide 4.

### Response
```json
{
  "size": 4,
  "keys": [
    "temporal:10:why do we need an activation function?",
    "temporal:10:how does backpropagation work?"
  ],
  "savingsEstimate": "$0.0120 USD"
}
```

---

## 💻 Code Examples

### cURL
```bash
# Ask a doubt at 02:30 (150 seconds)
curl -X POST "http://localhost:3000/api/ask" \
  -H "Content-Type: application/json" \
  -d '{"query": "Why do we need activation functions?", "pauseSeconds": 150, "mode": "temporal"}'
```

### JavaScript (Fetch API)
```javascript
const response = await fetch("http://localhost:3000/api/ask", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "Why do we need an activation function?",
    pauseSeconds: 150,
    mode: "temporal"
  })
});
const data = await response.json();
console.log(data.answer, data.citations);
```

### Python
```python
import requests

url = "http://localhost:3000/api/ask"
payload = {
    "query": "How does backpropagation work?",
    "pauseSeconds": 150,
    "mode": "temporal"
}
res = requests.post(url, json=payload)
data = res.json()
print("Answer:", data["answer"])
print("Future Roadmap Hint:", data.get("futureHint"))
```

---

## 🛡️ Error Handling & Status Codes

| Code | Meaning | Reason |
|---|---|---|
| `200` | OK | Query successfully processed and grounded |
| `400` | Bad Request | Missing `query` in request body |
| `403` | Forbidden | Directory traversal or unauthorized file path access |
| `404` | Not Found | Route or asset does not exist |
| `500` | Server Error | Internal processing error |
