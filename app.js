// app.js
// Client Application for Lumivra Auth, Student Dashboard & Temporal RAG LMS Prototype
// Fulfills 3-tier SaaS journey: Auth -> Lumivra Dashboard -> Canvas Temporal RAG Learning Companion

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
      endSeconds: 825,
      timestampLabel: "12:30 - 13:45",
      speaker: "Prof. Reynolds",
      slideId: "slide-6",
      text: "Finally, Slide 6: How do we train multi-layer architectures efficiently? The breakthrough algorithm is Backpropagation, formalized by Rumelhart, Hinton, and Williams in 1986, using the multivariate Chain Rule of calculus.",
      keywords: ["backpropagation", "chain rule", "Rumelhart", "Hinton", "gradient computation", "slide 6"]
    },
    {
      id: "chunk-14",
      startSeconds: 825,
      endSeconds: 900,
      timestampLabel: "13:45 - 15:00",
      speaker: "Prof. Reynolds",
      slideId: "slide-6",
      text: "In the backward pass, error deltas are computed at output neurons and propagated backwards layer by layer. This computes exact partial derivatives of loss with respect to all internal synaptic weights in O(W) time.",
      keywords: ["backward pass", "error deltas", "partial derivatives", "chain rule application", "summary"]
    }
  ],
  slides: [
    {
      slideNumber: 1,
      id: "slide-1",
      title: "The Artificial Perceptron Model",
      subtitle: "The simplest computational building block of neural networks.",
      activeFromSeconds: 0,
      activeToSeconds: 105,
      bulletPoints: [
        "Inputs x1..xn with synaptic weights w1..wn",
        "Pre-activation summation: z = Σ wi xi + b = w^T x + b",
        "Linear decision boundaries in Euclidean space"
      ],
      diagram: "Single artificial neuron summing weighted inputs"
    },
    {
      slideNumber: 2,
      id: "slide-2",
      title: "Non-Linear Activation Functions",
      subtitle: "Non-linearity allows a network to learn beyond linear boundaries.",
      activeFromSeconds: 105,
      activeToSeconds: 255,
      bulletPoints: [
        "Why non-linearity is strictly required (prevents layer collapse)",
        "Sigmoid σ(z) = 1 / (1 + e^-z): squashes to (0, 1)",
        "ReLU max(0, z): piecewise linear, eliminates saturation"
      ],
      diagram: "Sigmoid S-curve alongside piecewise linear ReLU ramp"
    },
    {
      slideNumber: 3,
      id: "slide-3",
      title: "Loss Surfaces & Empirical Risk",
      subtitle: "Quantifying prediction error across dataset instances.",
      activeFromSeconds: 255,
      activeToSeconds: 420,
      bulletPoints: [
        "Mean Squared Error (MSE): L = (1/N) Σ (y_hat - y)^2",
        "Convex quadratic bowl surface for linear regression",
        "Differentiability enables gradient-based optimization"
      ],
      diagram: "3D parabolic convex loss surface with minimum point"
    },
    {
      slideNumber: 4,
      id: "slide-4",
      title: "Gradient Descent Dynamics",
      subtitle: "Iterative weight updates moving opposite to the loss gradient.",
      activeFromSeconds: 420,
      activeToSeconds: 630,
      bulletPoints: [
        "Weight update rule: w_new = w_old - α ∇L",
        "Learning rate hyperparameter α governs step magnitude",
        "Small α yields slow convergence; large α causes divergence"
      ],
      diagram: "Contour map illustrating gradient vector trajectory"
    },
    {
      slideNumber: 5,
      id: "slide-5",
      title: "The XOR Classification Problem",
      subtitle: "The historical bottleneck that stalled AI research for 15 years.",
      activeFromSeconds: 630,
      activeToSeconds: 750,
      bulletPoints: [
        "Single perceptron cannot separate (0,1) and (1,0) from (0,0) and (1,1)",
        "Minsky & Papert (1969) proved geometric linear separability limits",
        "Multi-layer networks with hidden layers warp coordinate space"
      ],
      diagram: "2D coordinate space demonstrating XOR non-linear separability"
    },
    {
      slideNumber: 6,
      id: "slide-6",
      title: "Backpropagation & Chain Rule",
      subtitle: "Efficient reverse-mode gradient propagation through stacked layers.",
      activeFromSeconds: 750,
      activeToSeconds: 900,
      bulletPoints: [
        "Multivariate Chain Rule: ∂L/∂w_ij = (∂L/∂z_j) · (∂z_j/∂w_ij)",
        "Forward pass computes activations; backward pass propagates deltas",
        "Exact computational efficiency O(Total Parameters)"
      ],
      diagram: "Forward signal flow and reverse error delta propagation arrows"
    }
  ],
  pdfReadingNotes: [
    {
      chapterNumber: 1,
      title: "The McCulloch-Pitts & Rosenblatt Perceptron",
      relevantSecondsStart: 0,
      relevantSecondsEnd: 105,
      contentSnippet: "Deep Learning Book (Goodfellow et al.) Chapter 1: The earliest computational models of biological nervous systems were proposed by Warren McCulloch and Walter Pitts in 1943. Frank Rosenblatt expanded this into the Perceptron learning algorithm in 1958 at Cornell Aeronautical Laboratory."
    },
    {
      chapterNumber: 2,
      title: "The Non-Linearity Requirement",
      relevantSecondsStart: 105,
      relevantSecondsEnd: 255,
      contentSnippet: "Why stacked linear layers still behave like a single linear transformation without non-linear activations. Inserting σ(z) breaks linearity and unlocks representational capacity."
    },
    {
      chapterNumber: 3,
      title: "Convex Optimization & Loss Surfaces",
      relevantSecondsStart: 255,
      relevantSecondsEnd: 420,
      contentSnippet: "Deep Learning Book Chapter 4: Numerical Optimization. An objective function defines our performance metric. For linear models with squared error, the Hessian matrix is positive semi-definite, guaranteeing a global minimum."
    },
    {
      chapterNumber: 4,
      title: "First-Order Optimization Methods",
      relevantSecondsStart: 420,
      relevantSecondsEnd: 630,
      contentSnippet: "Deep Learning Book Chapter 8: Optimization for Training Deep Models. Gradient descent iteratively shifts parameter vectors in the direction of negative gradient. The choice of learning rate alpha determines the conditioning of the trajectory."
    },
    {
      chapterNumber: 5,
      title: "Multi-Layer Architectures & Feature Space Warping",
      relevantSecondsStart: 630,
      relevantSecondsEnd: 750,
      contentSnippet: "Deep Learning Book Section 6.1: Example: Learning XOR. Single-layer perceptrons are geometrically constrained to affine hyperplanes. By inserting a hidden layer with rectified linear activation, the representation transforms such that XOR becomes linearly separable."
    },
    {
      chapterNumber: 6,
      title: "Reverse-Mode Automatic Differentiation",
      relevantSecondsStart: 750,
      relevantSecondsEnd: 900,
      contentSnippet: "Deep Learning Book Section 6.5: Back-Propagation and Other Differentiation Algorithms. The algorithm allows the information from the cost to flow backward through the network in order to compute the gradient with respect to each parameter."
    }
  ]
};

// Application State
let courseData = FALLBACK_COURSE_DATA;
let currentSeconds = 150; // Starts at 02:30 (Module 2: Activation Functions)
let isPlaying = false;
let playbackSpeed = 1.0;
let playInterval = null;
let currentRagMode = "temporal"; // "temporal" or "naive"
let activeSlideIndex = 1; // 0-indexed (slide 2)

// =========================================================
// DOM ELEMENTS FOR ALL THREE VIEWS
// =========================================================

// View Containers
const lumivraAuthView = document.getElementById("lumivra-auth-view");
const lumivraDashboardView = document.getElementById("lumivra-dashboard-view");
const prototypeWorkspaceView = document.getElementById("prototype-workspace-view");

// Auth View Elements
const authSigninForm = document.getElementById("auth-signin-form");
const btnGoogleAuth = document.getElementById("btn-google-auth");
const authEmailInput = document.getElementById("auth-email");
const authMobileInput = document.getElementById("auth-mobile");
const authPasswordInput = document.getElementById("auth-password");
const btnTogglePwd = document.getElementById("btn-toggle-pwd");
const authTeaserCardTrigger = document.getElementById("auth-teaser-card-trigger");
const btnAuthHelp = document.getElementById("btn-auth-help");

// Dashboard Elements
const cardFindCourses = document.getElementById("card-find-courses");
const heroBtnStartLearning = document.getElementById("hero-btn-start-learning");
const taskContinueModule2 = document.getElementById("task-continue-module2");
const linkViewAllTasks = document.getElementById("link-view-all-tasks");
const btnDashToPrototype = document.getElementById("btn-dash-to-prototype");
const btnDashSignout = document.getElementById("btn-dash-signout");
const navBrandHome = document.getElementById("nav-brand-home");

// Prototype Navigation
const btnBackToDashboard = document.getElementById("btn-back-to-dashboard");
const breadcrumbLumivraHome = document.getElementById("breadcrumb-lumivra-home");
const userAvatarSignout = document.getElementById("user-avatar-signout");

// Prototype Video & Canvas Elements
const canvas = document.getElementById("lecture-canvas");
const ctx = canvas ? canvas.getContext("2d") : null;
const btnPlayPause = document.getElementById("btn-play-pause");
const iconPlay = document.getElementById("icon-play");
const iconPause = document.getElementById("icon-pause");
const btnRewind = document.getElementById("btn-rewind");
const btnForward = document.getElementById("btn-forward");
const currentTimeDisplay = document.getElementById("current-time-display");
const totalTimeDisplay = document.getElementById("total-time-display");
const scrubberProgress = document.getElementById("scrubber-progress");
const scrubberBar = document.getElementById("scrubber-bar");
const pauseAskPrompt = document.getElementById("pause-ask-prompt");
const overlayPauseTime = document.getElementById("overlay-pause-time");
const btnFocusDoubt = document.getElementById("btn-focus-doubt");

// Horizon Elements
const horizonBarChunks = document.getElementById("horizon-bar-chunks");
const horizonHereLabel = document.getElementById("horizon-here-label");
const horizonDemoTag = document.getElementById("horizon-demo-tag");
const statAccessibleCount = document.getElementById("stat-accessible-count");
const statBlockedCount = document.getElementById("stat-blocked-count");
const guardrailStatusPill = document.getElementById("guardrail-status-pill");
const statusText = document.getElementById("status-text");

// Middleware Slide Elements
const slideNumLabel = document.getElementById("slide-num-label");
const slideSyncPill = document.getElementById("slide-sync-pill");
const slideMainTitle = document.getElementById("slide-main-title");
const slideSubDesc = document.getElementById("slide-sub-desc");
const slidePaginationText = document.getElementById("slide-pagination-text");
const btnPrevSlide = document.getElementById("btn-prev-slide");
const btnNextSlide = document.getElementById("btn-next-slide");

// Connected Reading Elements
const readingChapLabel = document.getElementById("reading-chap-label");
const readingSecTitle = document.getElementById("reading-sec-title");
const readingSynopsis = document.getElementById("reading-synopsis");
const readingHorizonPill = document.getElementById("reading-horizon-pill");
const transcriptList = document.getElementById("transcript-list");

// Chat Elements
const chatMessagesContainer = document.getElementById("chat-messages-container");
const chatForm = document.getElementById("chat-form");
const chatQueryInput = document.getElementById("chat-query-input");
const tagTimeLabel = document.getElementById("tag-time-label");
const dividerTimeLabel = document.getElementById("divider-time-label");
const bannerPauseTime = document.getElementById("banner-pause-time");
const btnClearChat = document.getElementById("btn-clear-chat");
const promptChips = document.getElementById("prompt-chips");

// Mode Switch Elements
const btnModeTemporal = document.getElementById("btn-mode-temporal");
const btnModeNaive = document.getElementById("btn-mode-naive");
const ragLabelTemporal = document.getElementById("rag-label-temporal");
const ragLabelNaive = document.getElementById("rag-label-naive");

// Modal Elements
const archModal = document.getElementById("arch-modal");
const btnOpenArch = document.getElementById("btn-open-architecture");
const btnCloseModal = document.getElementById("btn-close-modal");
const btnHelpModal = document.getElementById("btn-help-modal");

// Format seconds into MM:SS
function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

// =========================================================
// VIEW NAVIGATION CONTROLLERS (AUTH <-> DASHBOARD <-> PROTOTYPE)
// =========================================================

function showAuth() {
  if (isPlaying) pausePlayback();
  if (lumivraAuthView) lumivraAuthView.classList.remove("hidden");
  if (lumivraDashboardView) lumivraDashboardView.classList.add("hidden");
  if (prototypeWorkspaceView) prototypeWorkspaceView.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
  window.location.hash = "signin";
}

function showPrototype(seekSeconds) {
  if (lumivraAuthView) lumivraAuthView.classList.add("hidden");
  if (lumivraDashboardView) lumivraDashboardView.classList.add("hidden");
  if (prototypeWorkspaceView) {
    prototypeWorkspaceView.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (typeof seekSeconds === "number") {
      seekToSeconds(seekSeconds);
    } else {
      updateUIForTimestamp(currentSeconds);
      drawLectureFrame();
    }
    window.location.hash = "course-cs229";
  }
}

function showLumivraDashboard() {
  if (isPlaying) pausePlayback();
  if (lumivraAuthView) lumivraAuthView.classList.add("hidden");
  if (prototypeWorkspaceView) prototypeWorkspaceView.classList.add("hidden");
  if (lumivraDashboardView) {
    lumivraDashboardView.classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.location.hash = "dashboard";
  }
}

function handleHashChange() {
  const hash = window.location.hash;
  if (hash === "#course-cs229" || hash === "#prototype" || hash === "#courses") {
    showPrototype();
  } else if (hash === "#dashboard") {
    showLumivraDashboard();
  } else {
    showAuth();
  }
}

// 1. INITIALIZATION
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

  const courseTitleEl = document.getElementById("course-title");
  const courseModuleEl = document.getElementById("course-module");
  if (courseTitleEl) courseTitleEl.textContent = courseData.title;
  if (courseModuleEl) courseModuleEl.textContent = courseData.module;
  if (totalTimeDisplay) totalTimeDisplay.textContent = formatTime(courseData.totalDurationSeconds);

  renderTranscriptList();
  updateUIForTimestamp(currentSeconds);
  drawLectureFrame();
  setupEventListeners();

  // Route depending on hash
  if (window.location.hash === "#course-cs229" || window.location.hash === "#prototype" || window.location.hash === "#courses") {
    showPrototype();
  } else if (window.location.hash === "#dashboard") {
    showLumivraDashboard();
  } else {
    showAuth();
  }
}

// 2. CANVAS DRAWING (Navy blackboard & synaptic network)
function drawLectureFrame() {
  if (!canvas || !ctx) return;
  const width = canvas.width;
  const height = canvas.height;

  // Navy blackboard background
  ctx.fillStyle = "#0c1322";
  ctx.fillRect(0, 0, width, height);

  // Top-left lecture indicators
  ctx.fillStyle = "#64748b";
  ctx.font = "11px 'JetBrains Mono', monospace";
  ctx.fillText("CS229 / LECTURE 02", 48, 45);

  ctx.fillStyle = "#818cf8";
  ctx.font = "bold 11px 'Inter', sans-serif";
  ctx.fillText("02 / THE NON-LINEARITY REQUIREMENT", 48, 70);

  // Big slide heading
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 24px 'Inter', sans-serif";
  ctx.fillText("A neuron needs more than a", 48, 125);
  ctx.fillText("straight line.", 48, 158);

  // Formula box
  ctx.fillStyle = "#ffffff";
  ctx.font = "20px 'Inter', sans-serif";
  ctx.fillText("y = σ(Σ wi xi + b)", 48, 218);

  // Subtext under formula
  ctx.fillStyle = "#94a3b8";
  ctx.font = "12.5px 'Inter', sans-serif";
  ctx.fillText("Apply a non-linear activation to the weighted input.", 48, 252);

  // Top-right status pill
  const pillW = 140;
  const pillH = 26;
  const pillX = width - pillW - 40;
  const pillY = 30;

  ctx.fillStyle = "rgba(255, 255, 255, 0.07)";
  ctx.beginPath();
  ctx.roundRect(pillX, pillY, pillW, pillH, 13);
  ctx.fill();

  // Dot
  ctx.fillStyle = isPlaying ? "#10b981" : "#818cf8";
  ctx.beginPath();
  ctx.arc(pillX + 16, pillY + 13, 4, 0, Math.PI * 2);
  ctx.fill();

  // Status text
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 10px 'JetBrains Mono', monospace";
  ctx.fillText(
    isPlaying ? `PLAYING • ${formatTime(currentSeconds)}` : `PAUSED AT ${formatTime(currentSeconds)}`,
    pillX + 26,
    pillY + 17
  );

  // NEURAL NETWORK SYNAPTIC DIAGRAM ON RIGHT
  const animTime = Date.now() / 600;
  const nodeRadius = 15;
  const centerNodeX = 570;
  const centerNodeY = 210;
  const centerRadius = 36;

  // 3 input nodes
  const inputs = [
    { label: "x₁", x: 440, y: 140 },
    { label: "x₂", x: 440, y: 210 },
    { label: "x₃", x: 440, y: 280 }
  ];

  // Draw connecting synaptic lines
  inputs.forEach((inp, idx) => {
    ctx.strokeStyle = "#475569";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(inp.x + nodeRadius, inp.y);
    ctx.lineTo(centerNodeX - centerRadius + 4, centerNodeY);
    ctx.stroke();

    // Weight labels
    if (idx === 0) {
      ctx.fillStyle = "#94a3b8";
      ctx.font = "10px 'Inter', sans-serif";
      ctx.fillText("w₁", (inp.x + centerNodeX) / 2 - 10, (inp.y + centerNodeY) / 2 - 6);
    }

    // Animated signal pulse traveling along line when playing
    if (isPlaying) {
      const pulseT = ((animTime + idx * 0.33) % 1);
      const px = inp.x + nodeRadius + (centerNodeX - centerRadius - inp.x - nodeRadius) * pulseT;
      const py = inp.y + (centerNodeY - inp.y) * pulseT;

      ctx.fillStyle = "#818cf8";
      ctx.beginPath();
      ctx.arc(px, py, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Draw input circle
    ctx.fillStyle = "#0c1322";
    ctx.strokeStyle = "#64748b";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(inp.x, inp.y, nodeRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Text in input circle
    ctx.fillStyle = "#cbd5e1";
    ctx.font = "11px 'Inter', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(inp.label, inp.x, inp.y);
  });

  // Center Activation Node (Large Purple Glowing Circle with σ)
  ctx.fillStyle = "#1e1b4b";
  ctx.strokeStyle = "#818cf8";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.arc(centerNodeX, centerNodeY, centerRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Greek letter sigma inside
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 30px 'Inter', sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("σ", centerNodeX, centerNodeY - 2);

  // Subtext under center activation circle
  ctx.fillStyle = "#94a3b8";
  ctx.font = "11px 'Inter', sans-serif";
  ctx.fillText("activation function", centerNodeX, centerNodeY + centerRadius + 18);

  // Output line to y
  const outEndX = 680;
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(centerNodeX + centerRadius, centerNodeY);
  ctx.lineTo(outEndX, centerNodeY);
  ctx.stroke();

  // Output label 'y'
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "bold 18px 'Inter', sans-serif";
  ctx.textAlign = "left";
  ctx.textBaseline = "middle";
  ctx.fillText("y", outEndX + 10, centerNodeY);

  ctx.textAlign = "left";
  ctx.textBaseline = "alphabetic";

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
  if (iconPlay) iconPlay.classList.add("hidden");
  if (iconPause) iconPause.classList.remove("hidden");
  if (pauseAskPrompt) pauseAskPrompt.classList.add("hidden");

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
  if (iconPlay) iconPlay.classList.remove("hidden");
  if (iconPause) iconPause.classList.add("hidden");

  if (overlayPauseTime) overlayPauseTime.textContent = formatTime(currentSeconds);
  const btnTimeLabel = document.getElementById("btn-time-label");
  if (btnTimeLabel) btnTimeLabel.textContent = formatTime(currentSeconds);
  if (pauseAskPrompt) pauseAskPrompt.classList.remove("hidden");

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

  if (currentTimeDisplay) currentTimeDisplay.textContent = formatted;
  if (tagTimeLabel) tagTimeLabel.textContent = formatted;
  if (dividerTimeLabel) dividerTimeLabel.textContent = formatted;
  if (bannerPauseTime) bannerPauseTime.textContent = formatted;

  const total = courseData.totalDurationSeconds || 900;
  const pct = (seconds / total) * 100;
  if (scrubberProgress) scrubberProgress.style.width = `${pct}%`;

  // Find active slide based on current timestamp
  const activeSlide =
    courseData.slides.find(
      (s) => seconds >= s.activeFromSeconds && seconds <= s.activeToSeconds
    ) || courseData.slides[1] || courseData.slides[0];

  activeSlideIndex = activeSlide.slideNumber - 1;

  if (slideNumLabel) slideNumLabel.textContent = `SLIDE ${activeSlide.slideNumber} / ${courseData.slides.length}`;
  if (slidePaginationText) slidePaginationText.textContent = `${activeSlide.slideNumber} of ${courseData.slides.length}`;
  if (slideSyncPill) slideSyncPill.textContent = `🔗 Synced to video • ${formatted}`;
  if (slideMainTitle) slideMainTitle.textContent = activeSlide.title;
  if (slideSubDesc) slideSubDesc.textContent = activeSlide.subtitle;

  // Find active connected reading
  const activePdf =
    courseData.pdfReadingNotes.find(
      (p) => seconds >= p.relevantSecondsStart && seconds <= p.relevantSecondsEnd
    ) || courseData.pdfReadingNotes[1] || courseData.pdfReadingNotes[0];

  if (readingChapLabel) readingChapLabel.textContent = `Chapter ${activePdf.chapterNumber}`;
  if (readingSecTitle) readingSecTitle.textContent = activePdf.title;
  if (readingSynopsis) readingSynopsis.textContent = activePdf.contentSnippet;

  // Within horizon check
  if (readingHorizonPill) {
    if (seconds >= activePdf.relevantSecondsStart) {
      readingHorizonPill.innerHTML = `<span>✓</span> Within your horizon`;
      readingHorizonPill.style.color = "var(--primary)";
      readingHorizonPill.style.backgroundColor = "var(--primary-light)";
    } else {
      readingHorizonPill.innerHTML = `<span>🔒</span> Future reading material`;
      readingHorizonPill.style.color = "var(--text-muted)";
      readingHorizonPill.style.backgroundColor = "var(--border-subtle)";
    }
  }

  highlightActiveTranscript(seconds);
  renderHorizonBar(seconds);
}

function highlightActiveTranscript(seconds) {
  if (!transcriptList) return;
  const rows = transcriptList.querySelectorAll(".transcript-chunk-item");
  rows.forEach((row) => {
    const start = parseFloat(row.getAttribute("data-start"));
    const end = parseFloat(row.getAttribute("data-end"));
    if (seconds >= start && seconds <= end) {
      row.classList.add("active");
      row.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      row.classList.remove("active");
    }
  });
}

function renderHorizonBar(seconds) {
  if (!courseData || !horizonBarChunks) return;
  const chunks = courseData.transcriptChunks;
  let accessible = 0;
  let blocked = 0;

  horizonBarChunks.innerHTML = chunks
    .map((c, i) => {
      const isPast = c.startSeconds <= seconds;
      const isCurrent = seconds >= c.startSeconds && seconds <= c.endSeconds;

      if (isPast) accessible++;
      else blocked++;

      let chunkClass = "chunk-segment";
      if (currentRagMode === "temporal") {
        if (isCurrent) {
          chunkClass += " current-chunk";
        } else if (isPast) {
          chunkClass += " accessible";
        } else {
          chunkClass += " blocked";
        }
      } else {
        if (isPast) {
          chunkClass += " accessible";
        } else {
          chunkClass += " blocked mode-naive-unmasked";
        }
      }

      const tooltip = isPast
        ? `[${c.timestampLabel}] Accessible for RAG`
        : currentRagMode === "temporal"
        ? `[${c.timestampLabel}] Masked Future Zone 🔒`
        : `[${c.timestampLabel}] UNPROTECTED (Leaked by Naive RAG)`;

      return `<div class="${chunkClass}" onclick="seekToSeconds(${c.startSeconds})" title="${tooltip}"></div>`;
    })
    .join("");

  if (statAccessibleCount) statAccessibleCount.textContent = currentRagMode === "temporal" ? accessible : chunks.length;
  if (statBlockedCount) statBlockedCount.textContent = currentRagMode === "temporal" ? blocked : 0;
  if (horizonHereLabel) horizonHereLabel.textContent = `${formatTime(seconds)} • YOU ARE HERE`;
}

function renderTranscriptList() {
  if (!courseData || !transcriptList) return;
  transcriptList.innerHTML = courseData.transcriptChunks
    .map(
      (c) => `
    <div class="transcript-chunk-item" data-start="${c.startSeconds}" data-end="${c.endSeconds}" onclick="seekToSeconds(${c.startSeconds})">
      <div class="chunk-header-line">
        <strong>${c.speaker}</strong>
        <span>${c.timestampLabel}</span>
      </div>
      <div class="chunk-text-body">${c.text}</div>
    </div>
  `
    )
    .join("");
}

// 5. RAG RESPONSE LOGIC
function getGroundedResponse(query, pauseSeconds, mode) {
  const qLower = query.toLowerCase();
  const currentFormatted = formatTime(pauseSeconds);
  const activeSlide =
    courseData.slides.find(
      (s) => pauseSeconds >= s.activeFromSeconds && pauseSeconds <= s.activeToSeconds
    ) || courseData.slides[1];

  const isBackprop = qLower.includes("backprop") || qLower.includes("chain rule") || qLower.includes("future");
  const isXor = qLower.includes("xor") || qLower.includes("minsky") || qLower.includes("limitation");
  const isAlpha = qLower.includes("alpha") || qLower.includes("learning rate") || qLower.includes("gradient");

  if (mode === "temporal") {
    if (isBackprop && pauseSeconds < 750) {
      return {
        answer: `You're thinking ahead! At your current lecture timestamp **[${currentFormatted}]**, the class hasn't covered Backpropagation yet.\n\n` +
          `Right now on **Slide ${activeSlide.slideNumber}: ${activeSlide.title}**, the professor is establishing how activation functions prevent linear matrix collapse.\n\n` +
          `💡 **Teacher's Roadmap Alert**: The teacher explains Backpropagation and the multivariate Chain Rule completely at **[12:30]**! Keep watching to understand how today's foundation leads straight into it.`,
        keyIdea: "Backpropagation requires knowing loss surfaces and gradient descent first. The foundation you're building now at 02:30 makes the chain rule intuitive.",
        citation: { label: "Upcoming at [12:30] • Slide 6 ↗", time: 750 }
      };
    }

    if (isXor && pauseSeconds < 630) {
      return {
        answer: `Great forward-looking intuition! A single perceptron can only draw linear hyperplanes, failing on XOR.\n\n` +
          `💡 **Teacher's Roadmap Alert**: Prof. Reynolds introduces the famous 1969 Minsky & Papert XOR limitation at **[10:30]** on Slide 5!`,
        keyIdea: "Single layer networks are strictly bounded by affine hyperplanes. You need non-linear activations to warp coordinate space.",
        citation: { label: "Upcoming at [10:30] • Slide 5 ↗", time: 630 }
      };
    }

    if (isAlpha) {
      return {
        answer: `Alpha (α) represents the gradient descent learning rate hyperparameter.\n\n` +
          `At **[${currentFormatted}]**, you are setting up the neuron's activation function. Optimization dynamics are detailed at **[07:00]** on Slide 4.`,
        keyIdea: "Learning rate alpha scales the step size taken in the direction of steepest descent.",
        citation: { label: "Upcoming at [07:00] • Slide 4 ↗", time: 420 }
      };
    }

    // Default activation doubt
    return {
      answer: `At **[${currentFormatted}]**, Prof. Reynolds is explaining why non-linearity is an absolute requirement.\n\n` +
        `If you chain 100 linear perceptron layers together without an activation function, the mathematical composition simply simplifies back into a single matrix multiplication: \( W_{100} \cdot W_{99} \dots W_1 = W' \).\n\n` +
        `The Sigmoid function squashes values into (0, 1), while ReLU (\( \max(0, x) \)) solves the vanishing gradient problem.`,
      keyIdea: "A linear combination of linear functions is always just a linear function. A non-linear activation is what changes the network's expressive power.",
      citation: { label: "▷ 01:45 • Slide 2 ↗", time: 105 }
    };
  } else {
    // NAIVE RAG: Leaks future material
    if (isBackprop) {
      return {
        answer: `⚠️ **[NAIVE RAG WARNING: Future Topic Leaked!]**\n\n` +
          `Even though you are only at **[${currentFormatted}]**, Naive RAG searched the entire 15-minute lecture and retrieved:\n\n` +
          `*"In the backward pass, error deltas are computed at output neurons and propagated backwards layer by layer using the multivariate Chain Rule"* at **[12:30]**.\n\n` +
          `This leaks upcoming derivations and spoils prerequisites! Switch back to **Temporal RAG** to maintain strict pedagogical progression.`,
        keyIdea: "Spoiler: In backward pass, error deltas ∂L/∂w = (∂L/∂z) · (∂z/∂w) are propagated backwards.",
        citation: { label: "Spoiled from [12:30] • Slide 6 ↗", time: 750 }
      };
    }

    return {
      answer: `[Naive RAG Search]: Unfiltered search returned results across all 15 minutes of lecture transcript. At 02:30, activation functions are discussed, while at 12:30, reverse-mode differentiation is covered.`,
      keyIdea: "Unconstrained search boundaries allow future course material to leak prematurely.",
      citation: { label: "▷ 01:45 • Slide 2 ↗", time: 105 }
    };
  }
}

// 6. CHAT SUBMISSION HANDLER
function handleChatSubmit(e) {
  if (e) e.preventDefault();
  if (!chatQueryInput) return;
  const query = chatQueryInput.value.trim();
  if (!query) return;

  appendUserMessage(query);
  chatQueryInput.value = "";

  setTimeout(() => {
    const res = getGroundedResponse(query, currentSeconds, currentRagMode);
    appendBotMessage(res);
  }, 350);
}

function appendUserMessage(text) {
  if (!chatMessagesContainer) return;
  const userBlock = document.createElement("div");
  userBlock.className = "user-msg-block";
  userBlock.textContent = text;
  chatMessagesContainer.appendChild(userBlock);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

function appendBotMessage(data) {
  if (!chatMessagesContainer) return;
  const botBlock = document.createElement("div");
  botBlock.className = "copilot-message-block";

  const citationHtml = data.citation
    ? `<div><a class="msg-citation-link" onclick="seekToSeconds(${data.citation.time})">${data.citation.label}</a></div>`
    : "";

  const keyIdeaHtml = data.keyIdea
    ? `<div class="msg-key-idea-card">
         <strong>Key Takeaway:</strong> ${data.keyIdea}
         ${citationHtml}
       </div>`
    : citationHtml;

  botBlock.innerHTML = `
    <div class="msg-header-line">
      <span class="msg-author-tag">✨ Lecture Co-Pilot</span>
      <span class="msg-timestamp">Just now</span>
    </div>
    <div class="msg-content-text">
      <p>${data.answer.replace(/\n\n/g, "</p><p>")}</p>
      ${keyIdeaHtml}
    </div>
  `;

  chatMessagesContainer.appendChild(botBlock);
  chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
}

// 7. EVENT LISTENERS SETUP
function setupEventListeners() {
  // --- AUTH VIEW EVENTS (USER REQUEST TRIGGER) ---
  // 1. Enter email, mobile, password and submit -> opens prototype!
  if (authSigninForm) {
    authSigninForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const btn = document.getElementById("btn-signin-submit");
      if (btn) btn.innerHTML = "<span>Signing in...</span>";
      setTimeout(() => {
        if (btn) btn.innerHTML = "<span>Sign in</span> <span>→</span>";
        showPrototype();
      }, 300);
    });
  }

  // 2. Click "Continue with Google" -> opens prototype!
  if (btnGoogleAuth) {
    btnGoogleAuth.addEventListener("click", () => {
      btnGoogleAuth.innerHTML = "<span>Connecting Google account...</span>";
      setTimeout(() => {
        btnGoogleAuth.innerHTML = "<span>Continue with Google</span>";
        showPrototype();
      }, 300);
    });
  }

  // 3. Password visibility toggle
  if (btnTogglePwd && authPasswordInput) {
    btnTogglePwd.addEventListener("click", () => {
      const isPwd = authPasswordInput.type === "password";
      authPasswordInput.type = isPwd ? "text" : "password";
    });
  }

  // 4. Click teaser card on auth page -> opens prototype!
  if (authTeaserCardTrigger) {
    authTeaserCardTrigger.addEventListener("click", () => showPrototype());
  }

  // 5. Help modal in auth page
  if (btnAuthHelp && archModal) {
    btnAuthHelp.addEventListener("click", () => archModal.classList.remove("hidden"));
  }

  // --- LUMIVRA DASHBOARD EVENTS ---
  if (cardFindCourses) {
    cardFindCourses.addEventListener("click", () => showPrototype());
  }
  if (heroBtnStartLearning) {
    heroBtnStartLearning.addEventListener("click", () => showPrototype());
  }
  if (taskContinueModule2) {
    taskContinueModule2.addEventListener("click", () => showPrototype(150));
  }
  if (linkViewAllTasks) {
    linkViewAllTasks.addEventListener("click", (e) => {
      e.preventDefault();
      showPrototype();
    });
  }
  if (btnDashToPrototype) {
    btnDashToPrototype.addEventListener("click", () => showPrototype());
  }
  if (btnDashSignout) {
    btnDashSignout.addEventListener("click", () => showAuth());
  }

  const cardStudyResources = document.getElementById("card-study-resources");
  if (cardStudyResources) {
    cardStudyResources.addEventListener("click", () => {
      showPrototype();
      const pdfTabBtn = document.querySelector('[data-tab="tab-pdf"]');
      if (pdfTabBtn) pdfTabBtn.click();
    });
  }

  const cardMyProgress = document.getElementById("card-my-progress");
  if (cardMyProgress) {
    cardMyProgress.addEventListener("click", () => {
      const bottomGrid = document.querySelector(".lumivra-bottom-grid");
      if (bottomGrid) bottomGrid.scrollIntoView({ behavior: "smooth" });
    });
  }

  const cardCommunity = document.getElementById("card-community");
  if (cardCommunity) {
    cardCommunity.addEventListener("click", () => {
      alert("💬 Lumivra Community: 42 students are actively discussing Module 2: Non-Linearity & Perceptrons! Opening course workspace...");
      showPrototype();
    });
  }

  // --- RETURN TO DASHBOARD / SIGN-OUT EVENTS ---
  if (btnBackToDashboard) {
    btnBackToDashboard.addEventListener("click", () => showLumivraDashboard());
  }
  if (breadcrumbLumivraHome) {
    breadcrumbLumivraHome.addEventListener("click", () => showLumivraDashboard());
  }
  if (navBrandHome) {
    navBrandHome.addEventListener("click", () => showLumivraDashboard());
  }

  // Click on AS avatar pill to sign out / switch account
  if (userAvatarSignout) {
    userAvatarSignout.addEventListener("click", () => {
      if (confirm("Sign out of current learning session and return to Sign-In?")) {
        showAuth();
      }
    });
  }

  // Browser hash change listener
  window.addEventListener("hashchange", handleHashChange);

  // --- PROTOTYPE PLAYER CONTROLS ---
  if (btnPlayPause) btnPlayPause.addEventListener("click", togglePlayPause);
  if (btnRewind) btnRewind.addEventListener("click", () => seekToSeconds(currentSeconds - 10));
  if (btnForward) btnForward.addEventListener("click", () => seekToSeconds(currentSeconds + 10));

  if (scrubberBar) {
    scrubberBar.addEventListener("click", (e) => {
      const rect = scrubberBar.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const pct = Math.max(0, Math.min(1, clickX / rect.width));
      const total = courseData.totalDurationSeconds || 900;
      seekToSeconds(pct * total);
    });
  }

  if (btnFocusDoubt && chatQueryInput) {
    btnFocusDoubt.addEventListener("click", () => {
      chatQueryInput.focus();
      chatQueryInput.placeholder = `Ask your doubt at ${formatTime(currentSeconds)}...`;
    });
  }

  if (btnModeTemporal) btnModeTemporal.addEventListener("click", () => setRagMode("temporal"));
  if (btnModeNaive) btnModeNaive.addEventListener("click", () => setRagMode("naive"));

  if (promptChips) {
    promptChips.querySelectorAll(".quick-prompt-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const q = btn.getAttribute("data-q");
        if (chatQueryInput) {
          chatQueryInput.value = q;
          handleChatSubmit();
        }
      });
    });
  }

  if (chatForm) chatForm.addEventListener("submit", handleChatSubmit);

  if (btnClearChat && chatMessagesContainer) {
    btnClearChat.addEventListener("click", () => {
      chatMessagesContainer.innerHTML = `
        <div class="lecture-pause-divider">
          <span>LECTURE PAUSED • <span>${formatTime(currentSeconds)}</span></span>
        </div>
        <div class="copilot-message-block">
          <div class="msg-header-line">
            <span class="msg-author-tag">✨ Lecture Co-Pilot</span>
            <span class="msg-timestamp">Just now</span>
          </div>
          <div class="msg-content-text">
            <p>Chat cleared. Ask any doubt grounded in what you've learned so far!</p>
          </div>
        </div>
      `;
    });
  }

  document.querySelectorAll(".mw-tab-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll(".mw-tab-btn").forEach((b) => b.classList.remove("active"));
      document.querySelectorAll(".tab-pane").forEach((p) => p.classList.remove("active"));

      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      const pane = document.getElementById(tabId);
      if (pane) pane.classList.add("active");
    });
  });

  if (btnPrevSlide) {
    btnPrevSlide.addEventListener("click", () => {
      if (activeSlideIndex > 0) {
        activeSlideIndex--;
        seekToSeconds(courseData.slides[activeSlideIndex].activeFromSeconds);
      }
    });
  }

  if (btnNextSlide) {
    btnNextSlide.addEventListener("click", () => {
      if (activeSlideIndex < courseData.slides.length - 1) {
        activeSlideIndex++;
        seekToSeconds(courseData.slides[activeSlideIndex].activeFromSeconds);
      }
    });
  }

  const speedBtn = document.getElementById("btn-speed-cycle");
  if (speedBtn) {
    speedBtn.addEventListener("click", () => {
      if (playbackSpeed === 1.0) playbackSpeed = 1.25;
      else if (playbackSpeed === 1.25) playbackSpeed = 1.5;
      else playbackSpeed = 1.0;
      speedBtn.textContent = `${playbackSpeed}x`;
    });
  }

  const fsBtn = document.getElementById("btn-fullscreen");
  if (fsBtn) {
    fsBtn.addEventListener("click", () => {
      const card = document.querySelector(".video-card-container");
      if (!document.fullscreenElement) {
        if (card) card.requestFullscreen().catch((err) => console.log(err));
      } else {
        document.exitFullscreen();
      }
    });
  }

  if (btnOpenArch && archModal) {
    btnOpenArch.addEventListener("click", () => archModal.classList.remove("hidden"));
  }
  if (btnHelpModal && archModal) {
    btnHelpModal.addEventListener("click", () => archModal.classList.remove("hidden"));
  }
  if (btnCloseModal && archModal) {
    btnCloseModal.addEventListener("click", () => archModal.classList.add("hidden"));
  }
  if (archModal) {
    archModal.addEventListener("click", (e) => {
      if (e.target === archModal) archModal.classList.add("hidden");
    });
  }
}

function setRagMode(mode) {
  currentRagMode = mode;
  if (mode === "temporal") {
    if (btnModeTemporal) btnModeTemporal.classList.add("active");
    if (btnModeNaive) btnModeNaive.classList.remove("active");
    if (guardrailStatusPill) guardrailStatusPill.className = "horizon-status-badge";
    if (statusText) statusText.textContent = "Horizon Masking: Active";
    if (horizonDemoTag) horizonDemoTag.textContent = "0.0% future leakage • Demo";
    if (ragLabelTemporal) {
      ragLabelTemporal.className = "boundary-mode-name active-rag";
      ragLabelTemporal.textContent = "Temporal RAG - selected";
    }
    if (ragLabelNaive) {
      ragLabelNaive.className = "boundary-mode-name inactive-rag";
      ragLabelNaive.textContent = "Naive RAG";
    }
  } else {
    if (btnModeNaive) btnModeNaive.classList.add("active");
    if (btnModeTemporal) btnModeTemporal.classList.remove("active");
    if (guardrailStatusPill) guardrailStatusPill.className = "horizon-status-badge mode-naive";
    if (statusText) statusText.textContent = "Horizon Masking: Inactive";
    if (horizonDemoTag) horizonDemoTag.textContent = "Future Spoilers Unlocked";
    if (ragLabelNaive) {
      ragLabelNaive.className = "boundary-mode-name active-rag";
      ragLabelNaive.textContent = "Naive RAG - selected";
    }
    if (ragLabelTemporal) {
      ragLabelTemporal.className = "boundary-mode-name inactive-rag";
      ragLabelTemporal.textContent = "Temporal RAG";
    }
  }
  renderHorizonBar(currentSeconds);
}

// Start app on DOM load
window.addEventListener("DOMContentLoaded", initApp);
