// server/index.js
// Express API Server implementing API-first Temporal RAG for LMS
// Slides 2 & 3: Node.js + Express.js backend with REST & Streaming APIs

const express = require("express");
const cors = require("cors");
const { lectureCourse } = require("./data/lectureData");
const {
  queryTemporalRAG,
  buildContextReferenceCard,
  applyTemporalHorizonMask,
  formatTimestamp
} = require("./services/temporalRAG");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// 1. Health check & system metadata
app.get("/api/health", (req, res) => {
  res.json({
    status: "healthy",
    engine: "Temporal RAG with Temporal Horizon Masking",
    version: "1.0.0-prototype",
    guardrail: "Active (0% future-timeline leakage)",
    cachedEntries: 0
  });
});

// 2. Course & Lecture Data (Unifying Video, Slides, Transcripts, PDF Notes)
app.get("/api/lecture", (req, res) => {
  res.json({
    course: lectureCourse,
    stats: {
      totalDurationSeconds: lectureCourse.totalDurationSeconds,
      formattedDuration: formatTimestamp(lectureCourse.totalDurationSeconds),
      totalTranscriptChunks: lectureCourse.transcriptChunks.length,
      totalSlides: lectureCourse.slides.length,
      totalPdfChapters: lectureCourse.pdfReadingNotes.length
    }
  });
});

// 3. Dynamic Context & Horizon Inspector (at exact pause time)
app.get("/api/context", (req, res) => {
  const pauseSeconds = parseFloat(req.query.pauseSeconds) || 0;
  const contextCard = buildContextReferenceCard(pauseSeconds);
  const { accessibleChunks, maskedFutureChunks } = applyTemporalHorizonMask(
    lectureCourse.transcriptChunks,
    pauseSeconds
  );

  res.json({
    pauseSeconds,
    formattedPauseTime: formatTimestamp(pauseSeconds),
    contextCard,
    horizon: {
      accessibleCount: accessibleChunks.length,
      maskedFutureCount: maskedFutureChunks.length,
      accessibleChunks: accessibleChunks.map((c) => ({
        id: c.id,
        label: c.timestampLabel,
        startSeconds: c.startSeconds,
        text: c.text
      })),
      maskedFutureChunks: maskedFutureChunks.map((c) => ({
        id: c.id,
        label: c.timestampLabel,
        startSeconds: c.startSeconds,
        status: "LOCKED 🔒 (Mathematically Masked)"
      }))
    }
  });
});

// 4. REST Ask Question API (Slide 3: "Ask Question API (sends question + time)")
app.post("/api/ask", (req, res) => {
  const { query, pauseSeconds = 0, mode = "temporal" } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  const result = queryTemporalRAG({
    query,
    pauseSeconds: parseFloat(pauseSeconds),
    mode
  });

  res.json(result);
});

// 5. Server-Sent Events (SSE) Stream API (Slide 3 & 4: "Stream API shows answer live, word-by-word")
app.get("/api/stream", (req, res) => {
  const query = req.query.query;
  const pauseSeconds = parseFloat(req.query.pauseSeconds) || 0;
  const mode = req.query.mode || "temporal";

  if (!query) {
    return res.status(400).send("Query required");
  }

  // Set headers for SSE streaming
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });

  const ragResult = queryTemporalRAG({ query, pauseSeconds, mode });
  const fullText = ragResult.answer;
  const words = fullText.split(" ");
  let wordIndex = 0;

  // Stream words with high responsiveness
  const interval = setInterval(() => {
    if (wordIndex < words.length) {
      const nextWord = words[wordIndex] + (wordIndex < words.length - 1 ? " " : "");
      res.write(`data: ${JSON.stringify({ token: nextWord })}\n\n`);
      wordIndex++;
    } else {
      clearInterval(interval);
      // Send complete payload with citations and temporal guardrail stats
      res.write(
        `data: ${JSON.stringify({
          done: true,
          citations: ragResult.citations,
          futureHint: ragResult.futureHint,
          temporalStats: ragResult.temporalStats,
          fromCache: ragResult.fromCache,
          latencyMs: ragResult.latencyMs,
          costDollars: ragResult.costDollars
        })}\n\n`
      );
      res.end();
    }
  }, 35); // 35ms per word for natural, rapid streaming

  req.on("close", () => {
    clearInterval(interval);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Temporal RAG LMS Backend running on port ${PORT}`);
  console.log(`🛡️ Temporal Horizon Masking Guardrail: ACTIVE (0% future leakage)`);
});
