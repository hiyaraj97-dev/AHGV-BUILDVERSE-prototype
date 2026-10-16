// public/app.js
// Client Application for Temporal RAG LMS Prototype
// Fulfills Slides 1-6: Interactive Video Player, Horizon Masking Visualizer, Synced Middleware, and Streaming AI Tutor
// Supports both full Node.js API streaming backend AND standalone static GitHub Pages/Netlify deployment!

const FALLBACK_COURSE_DATA = {
  id: "cs229-dl-01",
  title: "CS229: Foundations of Deep Learning",
  module: "Module 2: Perceptrons, Loss Surfaces & Backpropagation",
  instructor: "Prof. Andrew Reynolds (Stanford AI Lab)",
  totalDurationSeconds: 900,
  chapters: [
    { id: "c1", title: "1. The Artificial Perceptron Model", startSeconds: 0, endSeconds: 105 },
    { id: "c2", title: "2. Non-Linear Activation Functions (Sigmoid & ReLU)", startSeconds: 105, endSeconds: 255 },
    { id: "c3", title: "3. Loss Functions & Mean Squared Error", startSeconds: 255, endSeconds: 420 },
    { id: "c4", title: "4. Gradient Descent & Learning Rate Dynamics", startSeconds: 420, endSeconds: 630 },
    { id: "c5", title: "5. Limitations of Single Layers & The XOR Problem", startSeconds: 630, endSeconds: 750 },
    { id: "c6", title: "6. Backpropagation & The Chain Rule", startSeconds: 750, endSeconds: 900 }
  ],
  transcriptChunks: [
    {
      id: "chunk-01",
      startSeconds: 0,
      endSeconds: 30,
      timestampLabel: "00:00 - 00:30",
      speaker: "Prof. Reynolds",
      slideId: "slide-1",
      text: "Welcome back everyone. Today we are diving into the core foundations of modern deep learning. We will begin with the simplest computational unit: the artificial neuron, originally formalized by Frank Rosenblatt as the perceptron.",
      keywords: ["artificial neuron", "perceptron", "computational unit", "deep learning", "introduction"]
    },
    {
      id: "chunk-02",
      startSeconds: 30,
      endSeconds: 60,
      timestampLabel: "00:30 - 01:00",
      speaker: "Prof. Reynolds",
      slideId: "slide-1",
      text: "Look at Slide 1. A perceptron takes an input vector X: x1, x2, through xn. Each input is multiplied by a learnable synaptic weight w1, w2, up to wn. Then, we add a bias term b.",
      keywords: ["input vector", "weights", "bias term", "synaptic weight", "slide 1"]
    },
    {
      id: "chunk-03",
      startSeconds: 60,
      endSeconds: 105,
      timestampLabel: "01:00 - 01:45",
      speaker: "Prof. Reynolds",
      slideId: "slide-1",
      text: "Mathematically, the pre-activation sum is z equals sum of wi times xi plus b. In vector notation, that's w transpose x plus b. The bias shifts the decision boundary away from the origin, giving the neuron representational flexibility.",
      keywords: ["pre-activation", "w transpose x", "decision boundary", "vector notation", "bias shift"]
    },
    {
      id: "chunk-04",
      startSeconds: 105,
      endSeconds: 150,
      timestampLabel: "01:45 - 02:30",
      speaker: "Prof. Reynolds",
      slideId: "slide-2",
      text: "Now moving to Slide 2: Activation Functions. If we just leave z as a linear sum, any cascade of layers would collapse into a single linear matrix multiplication. Therefore, we pass z into a non-linear activation function sigma.",
      keywords: ["activation function", "non-linearity", "collapse", "linear matrix multiplication", "slide 2"]
    },
    {
      id: "chunk-05",
      startSeconds: 150,
      endSeconds: 200,
      timestampLabel: "02:30 - 03:20",
      speaker: "Prof. Reynolds",
      slideId: "slide-2",
      text: "Historically, the classic choice was the Sigmoid function: sigma of z equals 1 over 1 plus e to the negative z. It squashes real numbers into the range 0 to 1, making it interpretable as a probability.",
      keywords: ["sigmoid function", "squashing function", "probability", "range 0 to 1", "e to negative z"]
    },
    {
      id: "chunk-06",
      startSeconds: 200,
      endSeconds: 255,
      timestampLabel: "03:20 - 04:15",
      speaker: "Prof. Reynolds",
      slideId: "slide-2",
      text: "However, Sigmoid has a big drawback: vanishing gradients when inputs are strongly positive or negative. Later architectures frequently substitute ReLU, Rectified Linear Unit: max(0, z), which mitigates saturation during training.",
      keywords: ["vanishing gradient", "ReLU", "rectified linear unit", "saturation", "derivatives"]
    },
    {
      id: "chunk-07",
      startSeconds: 255,
      endSeconds: 330,
      timestampLabel: "04:15 - 05:30",
      speaker: "Prof. Reynolds",
      slideId: "slide-3",
      text: "Let's turn to Slide 3: Loss Functions and Empirical Risk. How do we measure if our network's predictions y-hat match the ground-truth targets y? We define an objective or loss function L.",
      keywords: ["loss function", "empirical risk", "ground truth", "y-hat", "objective function", "slide 3"]
    },
    {
      id: "chunk-08",
      startSeconds: 330,
      endSeconds: 420,
      timestampLabel: "05:30 - 07:00",
      speaker: "Prof. Reynolds",
      slideId: "slide-3",
      text: "For regression problems, the standard choice is Mean Squared Error, or MSE: one over N times sum of squared differences between predicted y-hat and target y. It produces a smooth, differentiable quadratic bowl shaped loss surface.",
      keywords: ["mean squared error", "MSE", "regression", "differentiable", "quadratic bowl", "loss surface"]
    },
    {
      id: "chunk-09",
      startSeconds: 420,
      endSeconds: 510,
      timestampLabel: "07:00 - 08:30",
      speaker: "Prof. Reynolds",
      slideId: "slide-4",
      text: "Slide 4 brings us to optimization: Gradient Descent. Imagine placing a marble on that high-dimensional bowl. The gradient, nabla L, points in the direction of steepest ascent. So we update weights in the opposite direction: w new equals w old minus alpha times gradient.",
      keywords: ["gradient descent", "optimization", "steepest ascent", "learning rate alpha", "weight update", "slide 4"]
    },
    {
      id: "chunk-10",
      startSeconds: 510,
      endSeconds: 630,
      timestampLabel: "08:30 - 10:30",
      speaker: "Prof. Reynolds",
      slideId: "slide-4",
      text: "Alpha is the learning rate hyperparameter. If alpha is too small, convergence takes forever. If alpha is too large, the updates will overshoot the valley and oscillate or diverge completely.",
      keywords: ["learning rate", "overshooting", "divergence", "convergence", "hyperparameter tuning"]
    },
    {
      id: "chunk-11",
      startSeconds: 630,
      endSeconds: 690,
      timestampLabel: "10:30 - 11:30",
      speaker: "Prof. Reynolds",
      slideId: "slide-5",
      text: "Now examine Slide 5: The fatal limitation of single layer perceptrons, discovered by Minsky and Papert in 1969. A single perceptron can only compute linearly separable functions like AND or OR. It strictly fails on XOR.",
      keywords: ["Minsky and Papert", "linearly separable", "XOR problem", "single layer limitation", "slide 5"]
    },
    {
      id: "chunk-12",
      startSeconds: 690,
      endSeconds: 750,
      timestampLabel: "11:30 - 12:30",
      speaker: "Prof. Reynolds",
      slideId: "slide-5",
      text: "To solve XOR, we must stack multiple layers of neurons with non-linear activations to form a Multi-Layer Perceptron (MLP). The hidden layer warps the feature space into a linearly separable representation.",
      keywords: ["hidden layer", "multi-layer perceptron", "MLP", "feature space warping", "representation"]
    },
    {
      id: "chunk-13",
      startSeconds: 750,
      endSeconds: 820,
      timestampLabel: "12:30 - 13:40",
      speaker: "Prof. Reynolds",
      slideId: "slide-6",
      text: "This brings us to the breakthrough of modern AI on Slide 6: The Backpropagation Algorithm! How do we compute the gradient of the loss with respect to weights inside deep hidden layers? We utilize the multivariate Chain Rule of differential calculus.",
      keywords: ["backpropagation", "chain rule", "gradient calculation", "hidden weights", "calculus", "slide 6"]
    },
    {
      id: "chunk-14",
      startSeconds: 820,
      endSeconds: 900,
      timestampLabel: "13:40 - 15:00",
      speaker: "Prof. Reynolds",
      slideId: "slide-6",
      text: "In the backward pass, error deltas are computed at output neurons and propagated backwards layer by layer. Partial derivatives dL/dw_ij are accumulated, allowing all layers to update synchronously. That concludes our lecture on foundational neural network mechanics!",
      keywords: ["backward pass", "error deltas", "partial derivatives", "chain rule", "synchronous update", "conclusion"]
    }
  ],
  slides: [
    {
      id: "slide-1",
      slideNumber: 1,
      title: "Anatomy of the Artificial Perceptron",
      activeFromSeconds: 0,
      activeToSeconds: 105,
      bulletPoints: [
        "Inputs: Feature vector X = [x1, x2, ..., xn]",
        "Weights: Synaptic weights W = [w1, w2, ..., wn]",
        "Bias: b (shifts hyperplane away from coordinate origin)",
        "Net Linear Pre-activation: z = Σ(wi * xi) + b = W^T * X + b",
        "Thresholding: Binary classification decision boundary"
      ],
      diagram: "Neuron node with inputs x1..xn entering weighted sum Σ, + bias b, feeding to activation σ",
      pdfPage: 1
    },
    {
      id: "slide-2",
      slideNumber: 2,
      title: "Non-Linear Activation Functions",
      activeFromSeconds: 105,
      activeToSeconds: 255,
      bulletPoints: [
        "Necessity: Without non-linearity, multi-layer networks collapse to f(x) = W_all * x (linear)",
        "Sigmoid: σ(z) = 1 / (1 + e^(-z)) ∈ (0, 1) [Probabilistic interpretation]",
        "Sigmoid Flaw: Vanishing gradients (dσ/dz → 0 for |z| >> 0)",
        "ReLU Alternative: f(z) = max(0, z) [Sparsity & constant gradient 1 for z > 0]"
      ],
      diagram: "Comparison curves: Sigmoid S-curve alongside piecewise linear ReLU ramp",
      pdfPage: 2
    },
    {
      id: "slide-3",
      slideNumber: 3,
      title: "Loss Functions & Empirical Risk Minimization",
      activeFromSeconds: 255,
      activeToSeconds: 420,
      bulletPoints: [
        "Objective: Measure prediction error between y_hat and ground truth y",
        "Mean Squared Error (MSE): L(w) = (1/N) * Σ(y_i - y_hat_i)^2",
        "Properties: Differentiable everywhere, convex quadratic bowl for linear models",
        "Optimization Goal: argmin_w L(w)"
      ],
      diagram: "3D parabolic bowl surface representing loss topography with minimum at center",
      pdfPage: 3
    },
    {
      id: "slide-4",
      slideNumber: 4,
      title: "Gradient Descent Optimization Dynamics",
      activeFromSeconds: 420,
      activeToSeconds: 630,
      bulletPoints: [
        "Gradient: ∇L(w) vector points in direction of steepest ascent",
        "Update Rule: w_(t+1) = w_t - α * ∇L(w_t)",
        "Learning Rate (α): Controls step size across error terrain",
        "Small α: Slow convergence, high computation time",
        "Large α: Overshoots minima, risks numerical divergence"
      ],
      diagram: "Contour map of loss showing step-by-step vector trajectory descending into valley",
      pdfPage: 4
    },
    {
      id: "slide-5",
      slideNumber: 5,
      title: "The XOR Dilemma & Multi-Layer Architectures",
      activeFromSeconds: 630,
      activeToSeconds: 750,
      bulletPoints: [
        "Minsky & Papert (1969): Single perceptron limited to linearly separable patterns",
        "XOR truth table cannot be partitioned by a single straight line hyperplane",
        "Solution: Hidden layers warp input space so non-linear boundaries become linear",
        "Multi-Layer Perceptrons (MLPs): Universal Function Approximators"
      ],
      diagram: "2D plot showing XOR points (0,1) and (1,0) impossible to separate from (0,0) and (1,1) with 1 line",
      pdfPage: 5
    },
    {
      id: "slide-6",
      slideNumber: 6,
      title: "Backpropagation & Multivariate Chain Rule",
      activeFromSeconds: 750,
      activeToSeconds: 900,
      bulletPoints: [
        "Forward Pass: Compute activations layer by layer up to output loss L",
        "Backward Pass: Apply chain rule ∂L/∂w_ij = (∂L/∂a) * (∂a/∂z) * (∂z/∂w_ij)",
        "Error Delta (δ): Propagated backwards through transpose weight matrices",
        "Complexity: Enables training deep neural nets in O(parameters) per step"
      ],
      diagram: "Neural network computational graph with red arrows indicating reverse error flow",
      pdfPage: 6
    }
  ],
  pdfReadingNotes: [
    {
      chapterNumber: 1,
      title: "Chapter 1: The Perceptron & Mathematical Notations",
      relevantSecondsStart: 0,
      relevantSecondsEnd: 105,
      contentSnippet: "A single artificial neuron calculates an affine transformation of its inputs followed by a step or identity mapping. The bias term b acts as a threshold: when W^T * X >= -b, the neuron activates. Without bias, the separating hyperplane must pass through the origin (0,0), severing representational capacity."
    },
    {
      chapterNumber: 2,
      title: "Chapter 2: The Non-Linearity Requirement",
      relevantSecondsStart: 105,
      relevantSecondsEnd: 255,
      contentSnippet: "Theorem: The composition of any number of linear functions is itself a linear function: W2 * (W1 * X) = (W2 * W1) * X = W_combined * X. Hence, non-linear activation functions sigma(z) are strictly mandatory to enable neural networks to approximate non-linear decision manifolds."
    },
    {
      chapterNumber: 3,
      title: "Chapter 3: Loss Surfaces & Convexity",
      relevantSecondsStart: 255,
      relevantSecondsEnd: 420,
      contentSnippet: "Mean Squared Error (MSE) measures the variance of residuals. For linear regression and single-layer models without non-linearities, the MSE loss function is strictly convex, guaranteeing a unique global minimum. With multi-layer non-linear models, the loss surface turns non-convex with saddle points."
    },
    {
      chapterNumber: 4,
      title: "Chapter 4: First-Order Optimization Mechanics",
      relevantSecondsStart: 420,
      relevantSecondsEnd: 630,
      contentSnippet: "Gradient descent computes the Jacobian or gradient vector nabla L. The update parameter alpha is critical: an optimal step size yields superlinear convergence, whereas ill-conditioned hessians with high condition numbers cause severe zig-zagging in ravine landscapes."
    },
    {
      chapterNumber: 5,
      title: "Chapter 5: Historical Foundations & The XOR Barrier",
      relevantSecondsStart: 630,
      relevantSecondsEnd: 750,
      contentSnippet: "The publication of Perceptrons by Marvin Minsky and Seymour Papert in 1969 halted neural network research for a decade (the first 'AI Winter'). They mathematically proved that a single-layer perceptron cannot solve the Exclusive-OR (XOR) logic problem because the four coordinate outputs are not linearly separable."
    },
    {
      chapterNumber: 6,
      title: "Chapter 6: Backpropagation by Reverse-Mode Automatic Differentiation",
      relevantSecondsStart: 750,
      relevantSecondsEnd: 900,
      contentSnippet: "Popularized by Rumelhart, Hinton, and Williams in 1986, backpropagation represents reverse-mode automatic differentiation applied to a computational graph. By caching forward intermediate activations, backprop computes all partial derivatives dL/dw in a single backward sweep with computational complexity proportional to the forward pass."
    }
  ]
};

let courseData = FALLBACK_COURSE_DATA;
let currentSeconds = 150; // Starts at 02:30 (Module 2: Activation Functions)
let isPlaying = false;
let playbackSpeed = 1.0;
let playInterval = null;
let currentRagMode = "temporal"; // "temporal" or "naive"
let isStreaming = false;
let clientMemoryCache = new Map();

// DOM Elements
const canvas = document.getElementById("lecture-canvas");
const ctx = canvas.getContext("2d");
const btnPlayPause = document.getElementById("btn-play-pause");
const iconPlay = document.getElementById("icon-play");
const iconPause = document.getElementById("icon-pause");
const btnRewind = document.getElementById("btn-rewind");
const btnForward = document.getElementById("btn-forward");
const currentTimeDisplay = document.getElementById("current-time-display");
const totalTimeDisplay = document.getElementById("total-time-display");
const scrubberProgress = document.getElementById("scrubber-progress");
const scrubberHandle = document.getElementById("scrubber-handle");
const scrubberBar = document.getElementById("scrubber-bar");
const chapterSelect = document.getElementById("chapter-select");
const pauseAskPrompt = document.getElementById("pause-ask-prompt");
const overlayPauseTime = document.getElementById("overlay-pause-time");
const btnFocusDoubt = document.getElementById("btn-focus-doubt");

// Horizon Visualizer Elements
const horizonBarChunks = document.getElementById("horizon-bar-chunks");
const horizonCursorLine = document.getElementById("horizon-cursor-line");
const horizonMarkerLabel = document.getElementById("horizon-marker-label");
const statAccessibleCount = document.getElementById("stat-accessible-count");
const statBlockedCount = document.getElementById("stat-blocked-count");
const statLeakageRate = document.getElementById("stat-leakage-rate");
const guardrailStatusPill = document.getElementById("guardrail-status-pill");
const statusText = document.getElementById("status-text");

// Middleware Elements
const slideNumberChip = document.getElementById("slide-number-chip");
const slideTitle = document.getElementById("slide-title");
const slideBullets = document.getElementById("slide-bullets");
const slideDiagramDesc = document.getElementById("slide-diagram-desc");
const pdfChapterChip = document.getElementById("pdf-chapter-chip");
const pdfTitle = document.getElementById("pdf-title");
const pdfBodyText = document.getElementById("pdf-body-text");
const transcriptList = document.getElementById("transcript-list");
const contextCardContent = document.getElementById("context-card-content");

// Chat Elements
const chatMessagesContainer = document.getElementById("chat-messages-container");
const chatForm = document.getElementById("chat-form");
const chatQueryInput = document.getElementById("chat-query-input");
const tagTimeLabel = document.getElementById("tag-time-label");
const bannerPauseTime = document.getElementById("banner-pause-time");
const chatGuardrailBanner = document.getElementById("chat-guardrail-banner");
const cacheLabel = document.getElementById("cache-label");
const costLabel = document.getElementById("cost-label");
const btnClearChat = document.getElementById("btn-clear-chat");
const promptChips = document.getElementById("prompt-chips");

// Mode Switch Elements
const btnModeTemporal = document.getElementById("btn-mode-temporal");
const btnModeNaive = document.getElementById("btn-mode-naive");

// Modal Elements
const archModal = document.getElementById("arch-modal");
const btnOpenArch = document.getElementById("btn-open-architecture");
const btnCloseModal = document.getElementById("btn-close-modal");

// Helper: Format seconds to MM:SS
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// 1. INITIAL LOAD & DATA FETCHING
async function initApp() {
  try {
    const res = await fetch("/api/lecture");
    if (res.ok) {
      const data = await res.json();
      courseData = data.course;
    }
  } catch (err) {
    console.log("Using embedded static courseware for standalone hosting:", err);
  }

  document.getElementById("course-title").textContent = courseData.title;
  document.getElementById("course-module").textContent = courseData.module;
  totalTimeDisplay.textContent = formatTime(courseData.totalDurationSeconds);

  // Populate chapter select
  chapterSelect.innerHTML = courseData.chapters
    .map(
      (ch) =>
        `<option value="${ch.startSeconds}">${ch.title} (${formatTime(ch.startSeconds)})</option>`
    )
    .join("");

  chapterSelect.addEventListener("change", (e) => {
    seekToSeconds(parseFloat(e.target.value));
  });

  renderTranscriptList();
  updateUIForTimestamp(currentSeconds);
  drawLectureFrame();
  setupEventListeners();
}

// 2. VIDEO TIMELINE & CANVAS ANIMATION CONTROLLER
function drawLectureFrame() {
  if (!courseData) return;
  const width = canvas.width;
  const height = canvas.height;

  // Background
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "#080e1e");
  gradient.addColorStop(1, "#111c38");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Active slide info
  const activeSlide =
    courseData.slides.find(
      (s) =>
        currentSeconds >= s.activeFromSeconds &&
        currentSeconds <= s.activeToSeconds
    ) || courseData.slides[0];

  // Draw simulated classroom whiteboard / presentation screen
  ctx.fillStyle = "#1e293b";
  ctx.strokeStyle = "#38bdf8";
  ctx.lineWidth = 2;
  ctx.roundRect(40, 30, width - 260, height - 70, 12);
  ctx.fill();
  ctx.stroke();

  // Whiteboard header
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 16px 'Inter', sans-serif";
  ctx.fillText(
    `SLIDE ${activeSlide.slideNumber}: ${activeSlide.title.toUpperCase()}`,
    60,
    65
  );

  // Whiteboard bullet points
  ctx.fillStyle = "#e2e8f0";
  ctx.font = "13px 'Inter', sans-serif";
  activeSlide.bulletPoints.forEach((point, i) => {
    ctx.fillText(`• ${point}`, 60, 105 + i * 28);
  });

  // Animated Mathematical / Neural Diagram on slide
  const t = Date.now() / 800;
  ctx.strokeStyle = "#06b6d4";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let x = 60; x < width - 280; x += 5) {
    const y = 310 + Math.sin((x + currentSeconds * 20) * 0.05) * 20;
    if (x === 60) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.stroke();

  // Draw simulated Instructor Video PIP
  const pipX = width - 200;
  const pipY = 30;
  const pipW = 160;
  const pipH = 130;

  ctx.fillStyle = "#0f172a";
  ctx.strokeStyle = "#6366f1";
  ctx.lineWidth = 2;
  ctx.roundRect(pipX, pipY, pipW, pipH, 8);
  ctx.fill();
  ctx.stroke();

  // Instructor avatar
  ctx.fillStyle = "#3b82f6";
  ctx.beginPath();
  ctx.arc(pipX + pipW / 2, pipY + 50, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#e2e8f0";
  ctx.font = "bold 11px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("Prof. Reynolds", pipX + pipW / 2, pipY + 95);
  ctx.font = "9px 'Inter', sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("Stanford AI Lab", pipX + pipW / 2, pipY + 110);
  ctx.textAlign = "left";

  // Audio waveform indicator when playing
  if (isPlaying) {
    ctx.fillStyle = "#10b981";
    for (let i = 0; i < 6; i++) {
      const barH = 5 + Math.sin(t * 3 + i) * 10;
      ctx.fillRect(pipX + 20 + i * 20, pipY + 120 - barH, 8, barH);
    }
  }

  // Draw lecture progress overlay
  ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
  ctx.roundRect(40, height - 35, 140, 24, 4);
  ctx.fill();
  ctx.fillStyle = "#38bdf8";
  ctx.font = "bold 11px 'JetBrains Mono', monospace";
  ctx.fillText(`REC • ${formatTime(currentSeconds)} / 15:00`, 50, height - 19);

  if (isPlaying) {
    requestAnimationFrame(drawLectureFrame);
  }
}

// 3. PLAYBACK ENGINE
function togglePlayPause() {
  if (isPlaying) {
    pausePlayback();
  } else {
    startPlayback();
  }
}

function startPlayback() {
  isPlaying = true;
  iconPlay.classList.add("hidden");
  iconPause.classList.remove("hidden");
  pauseAskPrompt.classList.add("hidden");

  playInterval = setInterval(() => {
    if (currentSeconds >= (courseData ? courseData.totalDurationSeconds : 900)) {
      pausePlayback();
      return;
    }
    currentSeconds += 0.5 * playbackSpeed;
    updateUIForTimestamp(currentSeconds);
  }, 500);

  requestAnimationFrame(drawLectureFrame);
}

function pausePlayback() {
  isPlaying = false;
  if (playInterval) clearInterval(playInterval);
  iconPlay.classList.remove("hidden");
  iconPause.classList.add("hidden");

  overlayPauseTime.textContent = formatTime(currentSeconds);
  document.getElementById("btn-time-label").textContent = formatTime(currentSeconds);
  pauseAskPrompt.classList.remove("hidden");

  drawLectureFrame();
}

function seekToSeconds(seconds) {
  currentSeconds = Math.max(0, Math.min(courseData ? courseData.totalDurationSeconds : 900, seconds));
  updateUIForTimestamp(currentSeconds);
  drawLectureFrame();
}

// 4. SYNCHRONIZED MULTI-MODAL CONTENT & HORIZON BAR UPDATE
function updateUIForTimestamp(seconds) {
  if (!courseData) return;
  const formatted = formatTime(seconds);

  currentTimeDisplay.textContent = formatted;
  tagTimeLabel.textContent = formatted;
  bannerPauseTime.textContent = formatted;

  const total = courseData.totalDurationSeconds || 900;
  const pct = (seconds / total) * 100;
  scrubberProgress.style.width = `${pct}%`;
  scrubberHandle.style.left = `${pct}%`;

  horizonCursorLine.style.left = `${pct}%`;
  horizonMarkerLabel.textContent = formatted;

  const activeSlide =
    courseData.slides.find(
      (s) => seconds >= s.activeFromSeconds && seconds <= s.activeToSeconds
    ) || courseData.slides[0];

  slideNumberChip.textContent = `Slide ${activeSlide.slideNumber} / ${courseData.slides.length}`;
  slideTitle.textContent = activeSlide.title;
  slideBullets.innerHTML = activeSlide.bulletPoints
    .map((b) => `<li>${b}</li>`)
    .join("");
  slideDiagramDesc.textContent = activeSlide.diagram;

  const activePdf =
    courseData.pdfReadingNotes.find(
      (p) =>
        seconds >= p.relevantSecondsStart && seconds <= p.relevantSecondsEnd
    ) || courseData.pdfReadingNotes[0];

  pdfChapterChip.textContent = `Chapter ${activePdf.chapterNumber}`;
  pdfTitle.textContent = activePdf.title;
  pdfBodyText.textContent = activePdf.contentSnippet;

  highlightActiveTranscript(seconds);
  renderHorizonBar(seconds);
  renderContextCardTab(seconds, activeSlide, activePdf);
}

function highlightActiveTranscript(seconds) {
  const rows = transcriptList.querySelectorAll(".transcript-row");
  rows.forEach((row) => {
    const start = parseFloat(row.getAttribute("data-start"));
    const end = parseFloat(row.getAttribute("data-end"));
    if (seconds >= start && seconds <= end) {
      row.classList.add("active-speaking");
      row.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      row.classList.remove("active-speaking");
    }
  });
}

function renderHorizonBar(seconds) {
  if (!courseData) return;
  const chunks = courseData.transcriptChunks;
  let accessible = 0;
  let blocked = 0;

  horizonBarChunks.innerHTML = chunks
    .map((c, i) => {
      const isPastOrCurrent = c.startSeconds <= seconds;
      if (isPastOrCurrent) accessible++;
      else blocked++;

      if (currentRagMode === "temporal") {
        if (isPastOrCurrent) {
          return `<div class="horizon-chunk chunk-accessible" onclick="seekToSeconds(${c.startSeconds})" title="${c.timestampLabel}: ${c.text.slice(0, 60)}...">
            <span>${c.timestampLabel.split(" - ")[0]}</span>
          </div>`;
        } else {
          return `<div class="horizon-chunk chunk-masked" title="LOCKED 🔒 (Mathematically Masked before search)">
            <span class="chunk-lock">🔒</span>
            <span>${c.timestampLabel.split(" - ")[0]}</span>
          </div>`;
        }
      } else {
        return `<div class="horizon-chunk chunk-accessible" onclick="seekToSeconds(${c.startSeconds})" title="${c.timestampLabel} (UNPROTECTED)">
          <span>${c.timestampLabel.split(" - ")[0]}</span>
        </div>`;
      }
    })
    .join("");

  statAccessibleCount.textContent = currentRagMode === "temporal" ? accessible : chunks.length;
  statBlockedCount.textContent = currentRagMode === "temporal" ? blocked : 0;
  statLeakageRate.textContent = currentRagMode === "temporal" ? "0.0%" : "HIGH (Leakage Risk)";
}

function renderTranscriptList() {
  if (!courseData) return;
  transcriptList.innerHTML = courseData.transcriptChunks
    .map(
      (c) => `
    <div class="transcript-row" data-start="${c.startSeconds}" data-end="${c.endSeconds}" onclick="seekToSeconds(${c.startSeconds})">
      <span class="transcript-time-btn">[${c.timestampLabel}]</span>
      <span class="transcript-text"><strong>${c.speaker}:</strong> ${c.text}</span>
    </div>
  `
    )
    .join("");
}

function renderContextCardTab(seconds, activeSlide, activePdf) {
  if (!courseData) return;
  const twoMinAgo = Math.max(0, seconds - 120);
  const recentChunks = courseData.transcriptChunks.filter(
    (c) => c.startSeconds >= twoMinAgo && c.startSeconds <= seconds
  );

  contextCardContent.innerHTML = `
    <div style="margin-bottom: 10px;">
      <strong style="color: var(--accent-cyan);">⏱️ 2-Minute Window Context (${formatTime(twoMinAgo)} - ${formatTime(seconds)}):</strong>
      <p style="margin-top: 4px; color: var(--text-muted);">${recentChunks.map((c) => c.text).join(" ") || "Introduction segment"}</p>
    </div>
    <div style="margin-bottom: 10px;">
      <strong style="color: var(--accent-blue);">📊 Active Slide ${activeSlide.slideNumber}: ${activeSlide.title}</strong>
      <p style="margin-top: 4px; color: var(--text-muted);">${activeSlide.bulletPoints[0]}</p>
    </div>
    <div>
      <strong style="color: var(--accent-indigo);">📄 Synced Notes: ${activePdf.title}</strong>
      <p style="margin-top: 4px; color: var(--text-muted);">${activePdf.contentSnippet.slice(0, 150)}...</p>
    </div>
  `;
}

// 5. IN-BROWSER RAG LOGIC (Fallback for static hosting like GitHub Pages & Netlify)
function clientSideTemporalRAG(query, pauseSeconds, mode) {
  const qLower = query.toLowerCase();
  const currentFormatted = formatTime(pauseSeconds);
  const activeSlide =
    courseData.slides.find(
      (s) => pauseSeconds >= s.activeFromSeconds && pauseSeconds <= s.activeToSeconds
    ) || courseData.slides[0];
  const activePdf =
    courseData.pdfReadingNotes.find(
      (p) => pauseSeconds >= p.relevantSecondsStart && pauseSeconds <= p.relevantSecondsEnd
    ) || courseData.pdfReadingNotes[0];

  const isBackpropQuery = qLower.includes("backprop") || qLower.includes("chain rule");
  const isXorQuery = qLower.includes("xor") || qLower.includes("minsky");
  const isLossQuery = qLower.includes("loss") || qLower.includes("mse") || qLower.includes("error");
  const isGradientQuery = qLower.includes("gradient") || qLower.includes("alpha") || qLower.includes("rate");

  if (mode === "temporal") {
    // Check if user asks about backprop before it is taught (minute 12:30)
    if (isBackpropQuery && pauseSeconds < 750) {
      return {
        answer: `You're thinking ahead! At your current lecture timestamp **[${currentFormatted}]**, the class hasn't covered this concept yet.\n\n` +
          `Right now on **Slide ${activeSlide.slideNumber}: ${activeSlide.title}**, the professor is focusing on foundational topics (${activeSlide.bulletPoints[0]}).\n\n` +
          `💡 **Teacher's Roadmap Alert**: The teacher explains this completely at **[12:30]**! Keep watching to understand how today's foundation leads straight into it.`,
        citations: [{ type: "future-cue", label: "Upcoming at [12:30]", time: "12:30", slideId: "slide-6" }],
        latencyMs: 3
      };
    }
    // Check if user asks about XOR before minute 10:30
    if (isXorQuery && pauseSeconds < 630) {
      return {
        answer: `You're anticipating the upcoming lesson! At **[${currentFormatted}]**, we are still analyzing single neuron behavior.\n\n` +
          `💡 **Teacher's Roadmap Alert**: The teacher introduces the famous Minsky & Papert XOR limitation at **[10:30]** on Slide 5!`,
        citations: [{ type: "future-cue", label: "Upcoming at [10:30]", time: "10:30", slideId: "slide-5" }],
        latencyMs: 3
      };
    }
  } else {
    // NAIVE RAG: Leaks future content
    if (isBackpropQuery && pauseSeconds < 750) {
      return {
        answer: `⚠️ **[NAIVE RAG WARNING: Future Topic Leaked!]**\n\n` +
          `Even though you are only at **[${currentFormatted}]**, naive RAG searched the entire 15-minute course and found: ` +
          `*"In the backward pass, error deltas are computed at output neurons and propagated backwards layer by layer using the multivariate Chain Rule"* at **[12:30]**.\n\n` +
          `This spoils upcoming concepts before prerequisites are finished! Switch back to **Temporal RAG** to maintain strict pedagogical progression.`,
        citations: [{ type: "spoiled-video", label: "Spoiled from [12:30]", time: "12:30", slideId: "slide-6" }],
        latencyMs: 4
      };
    }
  }

  // Normal grounded answer from past context
  const pastChunks = courseData.transcriptChunks.filter((c) => c.startSeconds <= pauseSeconds);
  const primaryChunk = pastChunks[pastChunks.length - 1] || courseData.transcriptChunks[0];
  const primaryTime = formatTime(primaryChunk.startSeconds);

  return {
    answer: `Based on what Professor Reynolds has explained up to **[${currentFormatted}]**:\n\n` +
      `• **Key Insight**: ${primaryChunk.text}\n\n` +
      `• **Slide ${activeSlide.slideNumber} Context**: As displayed on your screen, ${activeSlide.bulletPoints[0]}. In particular: ${activeSlide.bulletPoints[1] || activeSlide.bulletPoints[0]}.\n\n` +
      `• **Course Notes Excerpt**: ${activePdf.contentSnippet.slice(0, 180)}...\n\n` +
      `Click the timestamp **[${primaryTime}]** below to jump directly to this moment in the lecture.`,
    citations: [
      { type: "video", label: `Lecture [${primaryTime}]`, seconds: primaryChunk.startSeconds },
      { type: "slide", label: `Slide ${activeSlide.slideNumber}: ${activeSlide.title}` },
      { type: "notes", label: `Reading Notes: ${activePdf.title}` }
    ],
    latencyMs: 4
  };
}

// 6. LIVE AI TUTOR CHAT & STREAM CONSUMER
async function sendStudentQuestion(queryText) {
  if (!queryText || isStreaming) return;
  pausePlayback();

  const pauseSec = currentSeconds;
  const formattedTime = formatTime(pauseSec);

  appendUserMessage(queryText, formattedTime);
  chatQueryInput.value = "";

  const botBubble = createBotMessagePlaceholder(formattedTime);
  const textContainer = botBubble.querySelector(".msg-text");
  const citationsContainer = botBubble.querySelector(".msg-citations");

  isStreaming = true;
  cacheLabel.textContent = "⚡ Streaming live response from Temporal RAG...";

  // Cache check
  const cacheKey = `${currentRagMode}:${Math.floor(pauseSec / 15)}:${queryText.toLowerCase().trim()}`;
  if (clientMemoryCache.has(cacheKey)) {
    const cached = clientMemoryCache.get(cacheKey);
    setTimeout(() => {
      textContainer.innerHTML = formatMarkdownAnswer(cached.answer);
      renderCitations(citationsContainer, cached.citations);
      cacheLabel.innerHTML = `⚡ <span style="color:#10b981;">Instant Cache Hit</span> (0.1ms latency)`;
      costLabel.textContent = "Cost: $0.00";
      isStreaming = false;
    }, 150);
    return;
  }

  // Attempt backend SSE streaming first; fallback to client simulation if offline/static
  try {
    const sseUrl = `/api/stream?query=${encodeURIComponent(queryText)}&pauseSeconds=${pauseSec}&mode=${currentRagMode}`;
    const response = await fetch(sseUrl);

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = "";
      let finalData = null;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkStr = decoder.decode(value, { stream: true });
        const lines = chunkStr.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const payload = JSON.parse(line.slice(6));
              if (payload.token) {
                accumulatedText += payload.token;
                textContainer.innerHTML = formatMarkdownAnswer(accumulatedText);
                chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
              }
              if (payload.done) {
                finalData = payload;
              }
            } catch (e) {}
          }
        }
      }

      if (finalData) {
        renderCitations(citationsContainer, finalData.citations);
        cacheLabel.textContent = `⚡ Search Latency: ${finalData.latencyMs}ms`;
        costLabel.textContent = `Cost: $${finalData.costDollars}`;
        clientMemoryCache.set(cacheKey, { answer: accumulatedText, citations: finalData.citations });
      }
      isStreaming = false;
      return;
    }
  } catch (err) {
    // Backend offline or running on static GitHub Pages / Netlify: seamlessly fall back!
  }

  // In-Browser Streaming Simulation (Client-side Fallback)
  const localResult = clientSideTemporalRAG(queryText, pauseSec, currentRagMode);
  const words = localResult.answer.split(" ");
  let wIdx = 0;
  let runningText = "";

  const streamInterval = setInterval(() => {
    if (wIdx < words.length) {
      runningText += words[wIdx] + (wIdx < words.length - 1 ? " " : "");
      textContainer.innerHTML = formatMarkdownAnswer(runningText);
      chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
      wIdx++;
    } else {
      clearInterval(streamInterval);
      renderCitations(citationsContainer, localResult.citations);
      cacheLabel.textContent = `⚡ Search Latency: ${localResult.latencyMs}ms (In-Memory Engine)`;
      costLabel.textContent = "Cost: $0.00";
      clientMemoryCache.set(cacheKey, { answer: localResult.answer, citations: localResult.citations });
      isStreaming = false;
    }
  }, 28);
}

function appendUserMessage(text, time) {
  const row = document.createElement("div");
  row.className = "msg-row user-row";
  row.innerHTML = `
    <div class="msg-bubble user-bubble">
      <div class="user-timestamp-tag">📍 Question at [${time}]</div>
      <div>${escapeHTML(text)}</div>
    </div>
  `;
  chatMessagesContainer.appendChild(row);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function createBotMessagePlaceholder(time) {
  const row = document.createElement("div");
  row.className = "msg-row bot-row";
  row.innerHTML = `
    <div class="msg-bubble bot-bubble">
      <div class="msg-header-tag">
        <span class="bot-badge">AI TUTOR • [${time}]</span>
        <span class="msg-time">Generating...</span>
      </div>
      <div class="msg-text"><span class="typing-cursor">▋</span></div>
      <div class="msg-citations"></div>
    </div>
  `;
  chatMessagesContainer.appendChild(row);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
  return row.querySelector(".bot-bubble");
}

function renderCitations(container, citations) {
  if (!citations || citations.length === 0) return;
  container.innerHTML = citations
    .map((c) => {
      if (c.type === "video") {
        return `<span class="citation-chip video-chip" onclick="seekToSeconds(${c.seconds})">▶ ${c.label}</span>`;
      } else if (c.type === "future-cue") {
        return `<span class="citation-chip future-cue-chip" title="Preview Upcoming Topic">💡 ${c.label}</span>`;
      } else if (c.type === "spoiled-video") {
        return `<span class="citation-chip" style="border-color:#f43f5e; color:#fb7185;">⚠️ ${c.label}</span>`;
      } else {
        return `<span class="citation-chip" onclick="switchTab('tab-slide')">📑 ${c.label}</span>`;
      }
    })
    .join("");
}

function formatMarkdownAnswer(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/\n\n/g, "<br><br>")
    .replace(/\n/g, "<br>");
}

function escapeHTML(str) {
  return str.replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
}

// 7. TAB SWITCHING
function switchTab(tabId) {
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.getAttribute("data-tab") === tabId);
  });
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.toggle("active", pane.id === tabId);
  });
}

// 8. EVENT LISTENERS SETUP
function setupEventListeners() {
  btnPlayPause.addEventListener("click", togglePlayPause);
  btnRewind.addEventListener("click", () => seekToSeconds(currentSeconds - 10));
  btnForward.addEventListener("click", () => seekToSeconds(currentSeconds + 10));

  scrubberBar.addEventListener("click", (e) => {
    const rect = scrubberBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    const total = courseData ? courseData.totalDurationSeconds : 900;
    seekToSeconds(pct * total);
  });

  document.querySelectorAll(".btn-speed").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      document.querySelectorAll(".btn-speed").forEach((b) => b.classList.remove("active"));
      e.target.classList.add("active");
      playbackSpeed = parseFloat(e.target.getAttribute("data-speed"));
    });
  });

  btnFocusDoubt.addEventListener("click", () => {
    chatQueryInput.focus();
    chatQueryInput.placeholder = `Ask your doubt paused at ${formatTime(currentSeconds)}...`;
  });

  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchTab(btn.getAttribute("data-tab"));
    });
  });

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const q = chatQueryInput.value.trim();
    if (q) sendStudentQuestion(q);
  });

  promptChips.addEventListener("click", (e) => {
    const chip = e.target.closest(".prompt-chip");
    if (chip) {
      const q = chip.getAttribute("data-q");
      sendStudentQuestion(q);
    }
  });

  btnClearChat.addEventListener("click", () => {
    chatMessagesContainer.innerHTML = `
      <div class="msg-row bot-row">
        <div class="msg-bubble bot-bubble">
          <div class="msg-header-tag">
            <span class="bot-badge">AI TUTOR</span>
            <span class="msg-time">Reset</span>
          </div>
          <div class="msg-text">Chat cleared! Pause at any lecture moment and ask your questions.</div>
        </div>
      </div>
    `;
  });

  btnModeTemporal.addEventListener("click", () => {
    currentRagMode = "temporal";
    btnModeTemporal.classList.add("active");
    btnModeNaive.classList.remove("active");
    guardrailStatusPill.style.background = "rgba(16, 185, 129, 0.1)";
    guardrailStatusPill.style.borderColor = "rgba(16, 185, 129, 0.25)";
    guardrailStatusPill.style.color = "#10b981";
    statusText.textContent = "Horizon Masking: ACTIVE";
    chatGuardrailBanner.className = "guardrail-alert-banner";
    chatGuardrailBanner.innerHTML = `
      <div class="alert-icon">🛡️</div>
      <div class="alert-text">
        <strong>No-Spoiler Guardrail Active:</strong> The AI only knows concepts taught up to <span id="banner-pause-time">${formatTime(currentSeconds)}</span>. Future topics will prompt helpful roadmap hints!
      </div>
    `;
    updateUIForTimestamp(currentSeconds);
  });

  btnModeNaive.addEventListener("click", () => {
    currentRagMode = "naive";
    btnModeNaive.classList.add("active");
    btnModeTemporal.classList.remove("active");
    guardrailStatusPill.style.background = "rgba(244, 63, 94, 0.15)";
    guardrailStatusPill.style.borderColor = "rgba(244, 63, 94, 0.35)";
    guardrailStatusPill.style.color = "#fb7185";
    statusText.textContent = "Horizon Masking: DISABLED (Naive RAG)";
    chatGuardrailBanner.className = "guardrail-alert-banner banner-naive";
    chatGuardrailBanner.innerHTML = `
      <div class="alert-icon">⚠️</div>
      <div class="alert-text">
        <strong>Standard Naive RAG Active:</strong> Future lecture chunks are NOT filtered! Asking advanced doubts will leak future topics and equations.
      </div>
    `;
    updateUIForTimestamp(currentSeconds);
  });

  btnOpenArch.addEventListener("click", () => archModal.classList.remove("hidden"));
  btnCloseModal.addEventListener("click", () => archModal.classList.add("hidden"));
  archModal.addEventListener("click", (e) => {
    if (e.target === archModal) archModal.classList.add("hidden");
  });
}

window.seekToSeconds = seekToSeconds;
window.switchTab = switchTab;

document.addEventListener("DOMContentLoaded", initApp);
