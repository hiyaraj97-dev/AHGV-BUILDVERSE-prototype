// server/data/lectureData.js
// Mock database representing AWS S3 + Transcribe + PDF/PPT unified middleware

const lectureCourse = {
  id: "cs229-dl-01",
  title: "CS229: Foundations of Deep Learning",
  module: "Module 2: Perceptrons, Loss Surfaces & Backpropagation",
  instructor: "Prof. Andrew Reynolds (Stanford AI Lab)",
  totalDurationSeconds: 900, // 15:00 minutes
  videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4", // Reliable fallback MP4 stream
  chapters: [
    { id: "c1", title: "1. The Artificial Perceptron Model", startSeconds: 0, endSeconds: 105 },
    { id: "c2", title: "2. Non-Linear Activation Functions (Sigmoid & ReLU)", startSeconds: 105, endSeconds: 255 },
    { id: "c3", title: "3. Loss Functions & Mean Squared Error", startSeconds: 255, endSeconds: 420 },
    { id: "c4", title: "4. Gradient Descent & Learning Rate Dynamics", startSeconds: 420, endSeconds: 630 },
    { id: "c5", title: "5. Limitations of Single Layers & The XOR Problem", startSeconds: 630, endSeconds: 750 },
    { id: "c6", title: "6. Backpropagation & The Chain Rule", startSeconds: 750, endSeconds: 900 }
  ],
  // 30-second segmented transcripts (simulating AWS Transcribe output)
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
  // Presentation slides synchronized by timestamp intervals
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
  // Course PDF reading notes (simulating AWS S3 courseware documents)
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

module.exports = { lectureCourse };
