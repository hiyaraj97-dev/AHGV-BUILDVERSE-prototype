// server/services/temporalRAG.js
// Implements API-first Temporal RAG with Temporal Horizon Masking
// and the "No-Spoiler" Guardrail as specified in Slide 1, 2, 3, and 4.

const { lectureCourse } = require("../data/lectureData");

// In-Memory Fast Cache for common student questions (Slide 4: $0.00 cost, 0ms latency)
const fastMemoryCache = new Map();

// Helper: Format seconds to MM:SS string
function formatTimestamp(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// Tokenize & normalize text for TF-IDF / keyword scoring
function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2);
}

// Compute BM25-like relevance score
function scoreChunkRelevance(queryTerms, chunk) {
  const chunkTextTerms = tokenize(
    `${chunk.text} ${chunk.keywords.join(" ")} ${chunk.timestampLabel}`
  );
  let score = 0;

  for (const term of queryTerms) {
    const count = chunkTextTerms.filter((w) => w === term).length;
    if (count > 0) {
      score += 1 + Math.log(count + 1);
    }
    // Partial/prefix match
    const partialMatch = chunkTextTerms.some(
      (w) => w.includes(term) || term.includes(w)
    );
    if (partialMatch) {
      score += 0.5;
    }
  }

  return score;
}

/**
 * 1. TEMPORAL HORIZON MASKING (Slide 1 & 4)
 * Physically blocks all chunks past current video pause time.
 * "0% future-timeline leakage with zero extra compute"
 */
function applyTemporalHorizonMask(chunks, pauseSeconds) {
  const accessibleChunks = [];
  const maskedFutureChunks = [];

  for (const chunk of chunks) {
    if (chunk.startSeconds <= pauseSeconds) {
      accessibleChunks.push(chunk);
    } else {
      maskedFutureChunks.push(chunk);
    }
  }

  return { accessibleChunks, maskedFutureChunks };
}

/**
 * 2. CONTEXT BUNDLER (Slide 4)
 * Bundles the past 2 minutes of the lecture and current slide into a quick reference card
 */
function buildContextReferenceCard(pauseSeconds) {
  const twoMinutesAgo = Math.max(0, pauseSeconds - 120);

  // Past 2 minutes of transcripts
  const recentTranscriptChunks = lectureCourse.transcriptChunks.filter(
    (c) => c.startSeconds >= twoMinutesAgo && c.startSeconds <= pauseSeconds
  );

  // Active slide
  const activeSlide =
    lectureCourse.slides.find(
      (s) =>
        pauseSeconds >= s.activeFromSeconds && pauseSeconds <= s.activeToSeconds
    ) ||
    lectureCourse.slides
      .slice()
      .reverse()
      .find((s) => s.activeFromSeconds <= pauseSeconds) ||
    lectureCourse.slides[0];

  // Active PDF reading note
  const activePdfNote =
    lectureCourse.pdfReadingNotes.find(
      (p) =>
        pauseSeconds >= p.relevantSecondsStart &&
        pauseSeconds <= p.relevantSecondsEnd
    ) ||
    lectureCourse.pdfReadingNotes
      .slice()
      .reverse()
      .find((p) => p.relevantSecondsStart <= pauseSeconds) ||
    lectureCourse.pdfReadingNotes[0];

  return {
    recentTranscriptChunks,
    activeSlide,
    activePdfNote,
    windowStartSeconds: twoMinutesAgo,
    windowEndSeconds: pauseSeconds,
  };
}

/**
 * 3. FUTURE HORIZON SPOILER DETECTOR (Slide 4)
 * Checks if question is addressed in future segments of the lecture.
 * If so, generates: "The teacher explains this completely at [MM:SS]!"
 */
function detectFutureTopicCue(query, maskedFutureChunks, pastTopScore) {
  const queryTerms = tokenize(query);
  let bestFutureChunk = null;
  let highestFutureScore = 0;

  for (const chunk of maskedFutureChunks) {
    const score = scoreChunkRelevance(queryTerms, chunk);
    if (score > highestFutureScore) {
      highestFutureScore = score;
      bestFutureChunk = chunk;
    }
  }

  // If the concept is significantly more relevant in future lesson (> past lesson)
  if (bestFutureChunk && highestFutureScore >= 1.5 && pastTopScore < 1.8) {
    return {
      hasFutureSpoiler: true,
      futureTimestamp: formatTimestamp(bestFutureChunk.startSeconds),
      futureChunk: bestFutureChunk,
      futureSlideId: bestFutureChunk.slideId,
    };
  }

  return { hasFutureSpoiler: false };
}

/**
 * 4. TEMPORAL RAG QUERY EXECUTION
 */
function queryTemporalRAG({ query, pauseSeconds = 0, mode = "temporal" }) {
  const cacheKey = `${mode}:${Math.floor(pauseSeconds / 15)}:${query.toLowerCase().trim()}`;
  if (fastMemoryCache.has(cacheKey)) {
    const cached = fastMemoryCache.get(cacheKey);
    return {
      ...cached,
      fromCache: true,
      cacheLatencyMs: 0.1,
      costDollars: "0.00",
    };
  }

  const startTime = Date.now();
  const queryTerms = tokenize(query);

  let searchChunks = [];
  let futureCues = { hasFutureSpoiler: false };
  let temporalStats = {};

  if (mode === "temporal") {
    // TEMPORAL HORIZON MASKING ACTIVE
    const { accessibleChunks, maskedFutureChunks } = applyTemporalHorizonMask(
      lectureCourse.transcriptChunks,
      pauseSeconds
    );

    searchChunks = accessibleChunks;

    // Check past chunks relevance
    const scoredPastChunks = accessibleChunks
      .map((chunk) => ({ chunk, score: scoreChunkRelevance(queryTerms, chunk) }))
      .sort((a, b) => b.score - a.score);

    const topPastScore = scoredPastChunks.length > 0 ? scoredPastChunks[0].score : 0;

    // Check future chunks for helpful future hints without leaking content
    futureCues = detectFutureTopicCue(query, maskedFutureChunks, topPastScore);

    temporalStats = {
      mode: "temporal",
      guardrailActive: true,
      totalChunksInCourse: lectureCourse.transcriptChunks.length,
      accessibleChunksCount: accessibleChunks.length,
      blockedFutureChunksCount: maskedFutureChunks.length,
      leakageRisk: "0% (Mathematically Masked)",
      pauseTimestamp: formatTimestamp(pauseSeconds),
    };
  } else {
    // NAIVE / UNRESTRICTED RAG (Leaking Future Content)
    searchChunks = lectureCourse.transcriptChunks;
    temporalStats = {
      mode: "naive",
      guardrailActive: false,
      totalChunksInCourse: lectureCourse.transcriptChunks.length,
      accessibleChunksCount: lectureCourse.transcriptChunks.length,
      blockedFutureChunksCount: 0,
      leakageRisk: "HIGH (May leak future lessons!)",
      pauseTimestamp: formatTimestamp(pauseSeconds),
    };
  }

  // Retrieve top 3 relevant chunks from permitted search pool
  const rankedChunks = searchChunks
    .map((chunk) => ({
      chunk,
      score: scoreChunkRelevance(queryTerms, chunk),
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.chunk);

  // Bundle context card
  const contextCard = buildContextReferenceCard(pauseSeconds);

  // Synthesize answer based on strict slide instructions
  const synthesized = generatePedagogicalResponse({
    query,
    pauseSeconds,
    mode,
    topChunks: rankedChunks,
    futureCues,
    contextCard,
  });

  const durationMs = Date.now() - startTime;

  const result = {
    answer: synthesized.answer,
    citations: synthesized.citations,
    futureHint: synthesized.futureHint,
    contextCard,
    temporalStats,
    retrievedChunks: rankedChunks.map((c) => ({
      id: c.id,
      timestamp: formatTimestamp(c.startSeconds),
      label: c.timestampLabel,
      slideId: c.slideId,
      text: c.text,
    })),
    fromCache: false,
    latencyMs: durationMs,
    costDollars: "0.00",
  };

  // Cache for future duplicate queries
  fastMemoryCache.set(cacheKey, result);

  return result;
}

/**
 * 5. RESPONSE SYNTHESIS (Grounded & Strict No-Spoiler Pedagogy)
 */
function generatePedagogicalResponse({
  query,
  pauseSeconds,
  mode,
  topChunks,
  futureCues,
  contextCard,
}) {
  const currentFormattedTime = formatTimestamp(pauseSeconds);
  const activeSlide = contextCard.activeSlide;
  const activePdf = contextCard.activePdfNote;

  // CASE 1: Temporal mode + query is about a future topic not yet taught
  if (mode === "temporal" && futureCues.hasFutureSpoiler) {
    const hintTime = futureCues.futureTimestamp;
    return {
      answer: `You're thinking ahead! At your current lecture timestamp **[${currentFormattedTime}]**, the class hasn't covered this concept yet.\n\n` +
        `Right now on **Slide ${activeSlide.slideNumber}: ${activeSlide.title}**, the professor is focusing on foundational topics (${activeSlide.bulletPoints[0]}).\n\n` +
        `💡 **Teacher's Roadmap Alert**: The teacher explains this completely at **[${hintTime}]**! Keep watching to understand how today's foundation leads straight into it.`,
      citations: [
        { type: "future-cue", label: `Upcoming at [${hintTime}]`, time: hintTime, slideId: futureCues.futureSlideId }
      ],
      futureHint: `The teacher explains this completely at [${hintTime}]!`
    };
  }

  // CASE 2: Naive mode asking about future topic (demonstrates the spoiler flaw!)
  if (mode === "naive" && topChunks.some((c) => c.startSeconds > pauseSeconds)) {
    const futureChunk = topChunks.find((c) => c.startSeconds > pauseSeconds);
    const spoilerTime = formatTimestamp(futureChunk.startSeconds);
    return {
      answer: `⚠️ **[NAIVE RAG WARNING: Future Topic Leaked!]**\n\n` +
        `Even though you are only at **[${currentFormattedTime}]**, naive RAG searched the entire 15-minute course and found: ` +
        `*"${futureChunk.text}"* at **[${spoilerTime}]**.\n\n` +
        `This spoils upcoming concepts before you have covered the prerequisites on Slide ${activeSlide.slideNumber}! Switch back to **Temporal RAG** to maintain strict pedagogical progression.`,
      citations: [
        { type: "spoiled-video", label: `Spoiled from [${spoilerTime}]`, time: spoilerTime, slideId: futureChunk.slideId }
      ],
      futureHint: null
    };
  }

  // CASE 3: Normal grounded pedagogical answer from past lecture context
  let citations = [];
  let answerBody = "";

  if (topChunks.length > 0) {
    const primary = topChunks[0];
    const primaryTime = formatTimestamp(primary.startSeconds);

    citations.push({
      type: "video",
      label: `Lecture [${primaryTime}]`,
      time: primaryTime,
      seconds: primary.startSeconds,
      slideId: primary.slideId
    });

    citations.push({
      type: "slide",
      label: `Slide ${activeSlide.slideNumber}: ${activeSlide.title}`,
      slideId: activeSlide.id,
      page: activeSlide.pdfPage
    });

    citations.push({
      type: "notes",
      label: `Reading Notes: ${activePdf.title}`,
      chapter: activePdf.chapterNumber
    });

    // Clean, plain-English pedagogical explanation
    answerBody = `Based on what Professor Reynolds has explained up to **[${currentFormattedTime}]**:\n\n` +
      `• **Key Insight**: ${primary.text}\n\n` +
      `• **Slide ${activeSlide.slideNumber} Context**: As displayed on your screen, ${activeSlide.bulletPoints[0]}. In particular: ${activeSlide.bulletPoints[1] || activeSlide.bulletPoints[0]}.\n\n` +
      `• **Course Notes Excerpt**: ${activePdf.contentSnippet.slice(0, 180)}...\n\n` +
      `Click the timestamp **[${primaryTime}]** below to jump directly to this moment in the lecture.`;
  } else {
    // Fallback using the 2-minute context card
    const recentSummary = contextCard.recentTranscriptChunks
      .map((c) => c.text)
      .join(" ")
      .slice(0, 220);

    citations.push({
      type: "slide",
      label: `Slide ${activeSlide.slideNumber}`,
      slideId: activeSlide.id
    });

    answerBody = `At **[${currentFormattedTime}]**, Professor Reynolds is currently presenting **Slide ${activeSlide.slideNumber} (${activeSlide.title})**.\n\n` +
      `In the last two minutes of lecture, the discussion centered on: "${recentSummary || activeSlide.bulletPoints[0]}"\n\n` +
      `Feel free to ask specific questions about the perceptron weights, activation functions, or loss metrics covered so far!`;
  }

  return {
    answer: answerBody,
    citations,
    futureHint: null
  };
}

module.exports = {
  queryTemporalRAG,
  applyTemporalHorizonMask,
  buildContextReferenceCard,
  formatTimestamp,
  fastMemoryCache
};
