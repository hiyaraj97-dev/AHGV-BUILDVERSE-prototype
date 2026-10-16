// server.js
// High-performance, dependency-free Node.js HTTP server
// Implements REST APIs, Server-Sent Events (SSE) Streaming, and Static LMS Hosting
// Slides 1-4: API-First Temporal RAG with Temporal Horizon Masking

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const { lectureCourse } = require("./server/data/lectureData");
const {
  queryTemporalRAG,
  buildContextReferenceCard,
  applyTemporalHorizonMask,
  formatTimestamp,
  fastMemoryCache
} = require("./server/services/temporalRAG");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

// MIME types for static asset serving
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".mp4": "video/mp4"
};

// Helper to set CORS and security headers
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const server = http.createServer((req, res) => {
  setCorsHeaders(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // --- REST API ENDPOINTS ---

  // 1. Health & Guardrail Status Check
  if (pathname === "/api/health" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        status: "healthy",
        system: "API-first Temporal RAG with Temporal Horizon Masking",
        guardrail: "ACTIVE (0% future-timeline leakage)",
        cachedItemsCount: fastMemoryCache.size,
        timestamp: new Date().toISOString()
      })
    );
    return;
  }

  // 2. Complete Lecture & Courseware Metadata
  if (pathname === "/api/lecture" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        course: lectureCourse,
        stats: {
          totalDurationSeconds: lectureCourse.totalDurationSeconds,
          formattedDuration: formatTimestamp(lectureCourse.totalDurationSeconds),
          totalTranscriptChunks: lectureCourse.transcriptChunks.length,
          totalSlides: lectureCourse.slides.length,
          totalPdfChapters: lectureCourse.pdfReadingNotes.length
        }
      })
    );
    return;
  }

  // 3. Dynamic Context Card & Horizon Inspector at current pause time
  if (pathname === "/api/context" && req.method === "GET") {
    const pauseSeconds = parseFloat(parsedUrl.query.pauseSeconds) || 0;
    const contextCard = buildContextReferenceCard(pauseSeconds);
    const { accessibleChunks, maskedFutureChunks } = applyTemporalHorizonMask(
      lectureCourse.transcriptChunks,
      pauseSeconds
    );

    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
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
            endSeconds: c.endSeconds,
            slideId: c.slideId,
            text: c.text
          })),
          maskedFutureChunks: maskedFutureChunks.map((c) => ({
            id: c.id,
            label: c.timestampLabel,
            startSeconds: c.startSeconds,
            endSeconds: c.endSeconds,
            slideId: c.slideId,
            status: "LOCKED 🔒 (Mathematically Masked)"
          }))
        }
      })
    );
    return;
  }

  // 4. REST Ask Question API
  if (pathname === "/api/ask" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const query = payload.query;
        const pauseSeconds = parseFloat(payload.pauseSeconds) || 0;
        const mode = payload.mode || "temporal";

        if (!query) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "query field is required" }));
          return;
        }

        const result = queryTemporalRAG({ query, pauseSeconds, mode });
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }

  // 5. Server-Sent Events (SSE) Stream API (Slide 4: "streaming answers onto the screen word-by-word with zero waiting time")
  if (pathname === "/api/stream" && req.method === "GET") {
    const query = parsedUrl.query.query;
    const pauseSeconds = parseFloat(parsedUrl.query.pauseSeconds) || 0;
    const mode = parsedUrl.query.mode || "temporal";

    if (!query) {
      res.writeHead(400, { "Content-Type": "text/plain" });
      res.end("Query required");
      return;
    }

    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive"
    });

    const ragResult = queryTemporalRAG({ query, pauseSeconds, mode });
    const fullText = ragResult.answer;
    const words = fullText.split(" ");
    let wordIdx = 0;

    const interval = setInterval(() => {
      if (wordIdx < words.length) {
        const token = words[wordIdx] + (wordIdx < words.length - 1 ? " " : "");
        res.write(`data: ${JSON.stringify({ token })}\n\n`);
        wordIdx++;
      } else {
        clearInterval(interval);
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
    }, 30); // 30ms per word: smooth live streaming

    req.on("close", () => {
      clearInterval(interval);
    });
    return;
  }

  // 6. Fast Memory Cache Management Endpoint (Slide 4: $0.00 compute)
  if (pathname === "/api/cache" && req.method === "GET") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(
      JSON.stringify({
        size: fastMemoryCache.size,
        keys: Array.from(fastMemoryCache.keys()),
        savingsEstimate: `$${(fastMemoryCache.size * 0.003).toFixed(4)} USD`
      })
    );
    return;
  }

  // --- STATIC FILE SERVING FOR LMS FRONTEND ---
  let reqPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.join(PUBLIC_DIR, reqPath);

  // Security: prevent path traversal outside public dir
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing
      const indexPath = path.join(PUBLIC_DIR, "index.html");
      fs.readFile(indexPath, (indexErr, content) => {
        if (indexErr) {
          res.writeHead(404, { "Content-Type": "text/plain" });
          res.end("404 Not Found");
          return;
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end("Server error reading file");
        return;
      }
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content);
    });
  });
});

server.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🎓 Temporal RAG LMS Prototype Server Running!`);
  console.log(`📡 Access URL: http://localhost:${PORT}`);
  console.log(`🛡️  Temporal Horizon Masking: ACTIVE (0% Timeline Leakage)`);
  console.log(`⚡ Zero-dependency high-speed Node.js runtime`);
  console.log(`=======================================================`);
});
