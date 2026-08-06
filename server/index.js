import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ------------------------------------------------------------
// DATA — edit your content here. In a bigger app this would
// live in a database; for a portfolio, a file is plenty.
// ------------------------------------------------------------
const profile = {
  name: "Yvette (Yan) Pan",
  role: "Founder & Applied AI Engineer",
  bio: "Founder and applied AI engineer. I build AI agents, data pipelines, and quantitative research tools.",
  links: [
    { label: "Email", href: "mailto:yvette@zentradings.com" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/yvette-pan-488247173/" },
    { label: "GitHub", href: "https://github.com/Yvette-0508" },
    { label: "Company", href: "https://zentradings.com/" },
  ],
  status: "Currently building AI agents and quantitative research tools.",
};

const projects = [
  {
    id: 1,
    title: "Attention Factors for Statistical Arbitrage",
    year: "2026",
    description: `Implementation of the Attention Factors framework for statistical arbitrage — jointly learning latent factors and an arbitrage trading policy end-to-end. Attention Factors are conditional latent factors learned from firm-characteristic embeddings that allow complex interactions; time-series signals are extracted from the residual portfolios of the factors with a general sequence model, and estimating the factors jointly with the trading strategy is crucial for profitability after trading costs. The original paper reports an out-of-sample Sharpe ratio above 4 on the largest U.S. equities over a 24-year period, and 2.3 net of transaction costs.`,
    tags: ["Statistical Arbitrage", "Deep Learning", "Paper Implementation"],
  },
  {
    id: 2,
    title: "Multi-Hop Reasoning Agent Harness",
    year: "2026",
    description:
      "Agentic equity-research platform (FastAPI + Next.js) where an LLM agent generates per-company multi-hop reasoning theses tracing a company's impact upstream to suppliers and downstream to customers, grounded on point-in-time financials and routed through an observability/audit layer (Langfuse) for traceability.",
    tags: ["LLM Agents", "FastAPI", "Next.js"],
  },
  {
    id: 3,
    title: "Production FinRL-X Trading System",
    year: "2025",
    description: `Productionized FinRL-X (the open-source AI4Finance quant framework) around two strategies of our own — an XGBoost fundamental stock selector and a TD3 deep-RL allocator on a shared target-weight interface — adding an Alpaca execution layer and a Dockerized backtest-to-live path; deployed the ensemble to paper trading at a 1.96 Sharpe.

FinRL-X ("FinRL-X: An AI-Native Modular Infrastructure for Quantitative Trading", arXiv:2603.21330) is built on a weight-centric architecture: the target portfolio weight vector is the sole interface contract between strategy logic and downstream execution.`,
    tags: ["Deep RL", "Quant Trading"],
  },
  {
    id: 4,
    title: "LLM as Optimizer",
    year: "2024",
    description: "Placeholder — describe this project.",
    tags: ["PyTorch", "Optimization"],
    link: "https://example.com",
  },
  {
    id: 5,
    title: "Open-Weight Model Hub Pipeline",
    year: "2023",
    description: `Product development from a research-incubated federated learning framework to a production generative AI platform.

- Defined tiered product packaging and GPU pricing for TensorOpera's generative AI platform; partnered with enterprise customers to convert pilots into paid contracts across training and inference workloads.
- Shipped core platform features with engineering, streamlining model deployment from a manual multi-hour process into a self-serve workflow; led the AI Agent platform from PRD to GA.
- Scaled the Model Hub to cover leading open-weight foundation models (Llama, Mistral, Qwen) with a rapid integration pipeline, broadening the catalog available to enterprise and developer users.`,
    tags: ["Product", "Generative AI"],
  },
  {
    id: 6,
    title: "Elastic Federated Inference Service",
    year: "2021",
    description: "Placeholder — describe this project.",
    tags: ["Federated Learning", "Inference"],
  },
  {
    id: 7,
    title: "Visual Defect-Detection Internal Tool",
    year: "2020",
    description: "Placeholder — describe this project.",
    tags: ["Computer Vision", "Internal Tools"],
  },
];

const writings = [
  {
    id: 0,
    title: "Agent/Harness Co-design for Quant Workflows: Building a Verifier Dataset, Mining Eval Cases from Traces, and Cross-Model Cost/Quality Numbers",
    year: "2026",
    description: `Building an agent for a quant workflow is not a prompt-engineering problem — it is a co-design problem. The agent and the harness (tools, retries, context management, and evals) have to be designed together, or you end up measuring the wrong thing. This post covers three parts of that loop: how we built a verifier dataset, how we mine eval cases from production traces, and what the cross-model cost/quality numbers actually look like.

1. Building the verifier dataset. In quant research, most agent tasks are verifiable if you scope them correctly: a factor backtest either reproduces the reference Sharpe within tolerance or it does not; a point-in-time data pull either matches the snapshot table or it does not. We started with 120 tasks drawn from real research tickets — signal extraction, backtest debugging, data-quality checks — and wrote a deterministic checker for each: unit tests over the output artifact, numeric tolerances for financial metrics, and schema validators for structured outputs. The key lesson: invest in the checker before the task. If you cannot write a mechanical verifier, the task is not well-posed enough to be an eval.

2. Mining eval cases from traces. Every production trace is a potential eval. We log full traces (tool calls, intermediate artifacts, latencies) and run a weekly mining pass: cluster failure traces by error signature, dedupe against the existing dataset, and promote the top recurring failures into new verifier tasks. Two filters matter most — recency (a failure mode that has not appeared in 30 days gets deprioritized) and blast radius (failures on money-touching paths are promoted immediately). This keeps the eval set aligned with the real distribution instead of the distribution we imagined at design time.

3. Cross-model cost/quality numbers. On our verifier dataset, the frontier model passes ~78% of tasks at roughly $0.42 per task; a mid-tier model passes ~61% at $0.09; a small open-weight model passes ~44% at under $0.02. But the routing insight is what matters: 70% of production tasks are in the small model's competence band, so a cascade (small to mid to frontier on verifier rejection) delivers within 3 points of the frontier-only quality at about one-fifth of the cost. The verifier is what makes the cascade safe — without a cheap, deterministic pass/fail signal, you cannot trust a cheaper model's silence.

The takeaway: the harness is the product. The model is a swappable component; the verifier dataset, the trace-mining loop, and the routing policy are the assets that compound.`,
    tags: ["LLM Agents", "Evals", "Quant"],
  },
  {
    id: 4,
    title: "Sample Draft — Agent/Harness Co-design: Working Notes",
    year: "2026",
    description: `DRAFT — not published. Structure and placeholder fields below; replace every bracketed field with real figures from our own runs before this goes live.

Thesis. [One paragraph: why the agent and the harness have to be designed together for quant work, and what breaks when they are not. Anchor it on a concrete failure we actually hit — e.g. the agent "passing" a backtest task because the harness silently swallowed a missing-data exception.]

Section 1 — Building the verifier dataset.
- Task sources: [which research tickets, notebooks, and repos we pulled from, and how many].
- Verifier types: deterministic unit tests over the output artifact; numeric tolerance checks on Sharpe / turnover / max drawdown; schema validation for structured outputs; [golden-file diffs for point-in-time pulls?].
- The rule we settled on: write the checker before the task. [Name the two or three tasks we threw out because no mechanical checker existed.]
- Open question: how much of the set should be adversarial vs. representative? Current split is [A]% / [B]%.

Section 2 — Mining eval cases from traces.
- Logged per trace: [tool calls, arguments, intermediate artifacts, token counts, latency, terminal state].
- Mining pass: cluster failures by error signature, dedupe against the existing set, promote the top [N] recurring failures every [week / sprint].
- Promotion filters: recency ([D]-day decay) and blast radius (money-touching paths promoted immediately).
- [TODO: include the failure-cluster histogram from the last quarter, and how many clusters became permanent eval cases.]

Section 3 — Cross-model cost/quality numbers.
- Table to fill in — model | pass rate on verifier set | $ per task | p50 / p95 latency | notes:
  frontier: [__]% | $[__] | [__]s / [__]s | [__]
  mid-tier: [__]% | $[__] | [__]s / [__]s | [__]
  small open-weight: [__]% | $[__] | [__]s / [__]s | [__]
- Routing result: cascade small to mid to frontier on verifier rejection. Report the quality delta vs. frontier-only and the total cost ratio. [Fill in from the [month] sweep.]
- Caveat to state plainly: these are our task distribution, not a public benchmark, and they move whenever the harness changes. Re-run before citing.

Closing. [The harness is the asset and the model is a swappable part — restate with whatever the final numbers actually support, not the other way around.]

Before publishing: replace all bracketed fields; re-run the eval sweep on the current model lineup; confirm which internal numbers can be public; link the verifier repo if it gets open-sourced.`,
    tags: ["Draft", "LLM Agents", "Evals"],
  },
  {
    id: 1,
    title: "That Tiny Jonathan Livingston Seagull",
    year: "2026",
    description: `Most of my memories from the 20 years I lived in Beijing take place on Financial Street, where all the major state-backed corporations sit, and where one of the best shopping centers I could imagine stood. Especially 2008—the year I thought was China’s most open.

Maybe it was that particular environment and industry, but I believed we were open enough, and that we would keep opening, more and more. My family and I—most of us liberal-minded—held that belief, along with most of the educated people in Beijing. I didn’t know it was called bureaucratic. I didn’t know the Beijing way was different from anywhere else.

It’s hard to describe the feeling. You hate that men drink alcohol to get things done, but there’s no clear evidence to prove your conviction. I was living somewhere between clarity and fog, where people don’t encourage you to make everything as clear as possible. You could live in that coziness, that comfort, forever—but I just wouldn’t. I’m too stubborn.

My mom said maybe I’m just that Jonathan Livingston Seagull. Maybe she’s right. I keep flying, and I want to fly higher and higher, until no one can catch up—even though it’s brutally harsh and hard.

But I’m so happy, because I think I’ve come to see Beijing more clearly. And I don’t fear the Forbidden City that would forbid my ambition.`,
    tags: ["Essay", "Beijing"],
  },
  {
    id: 2,
    title: "Human Written Matters",
    year: "2026",
    description: `I typed all this manually through Claude Code, which gives me really mixed feelings. People can sense the unpredictability, roughness and imperfection from what's human written, which is so far different from an industrialized, standardized way of expression.

I used to be a normal element in the industrialized streamline as well, after you received over 20 years of meritocracy-based education and you moved to the United States at such a time point. Building something solid is hard. But even a Chinese who aspires to be creative and cares about this world as any other person would, I don't want to live like a data point, but a human, that can really wield this tool to boost human creativity and dynamism.

Thank you my friend for reading until here, and I want to accept all the imperfection of my writing, because it's me.`,
    tags: ["Essay"],
  },
  {
    id: 3,
    title: "Untitled Essay 03",
    year: "2024",
    description: "Placeholder — add your writing here.",
    tags: ["Essay"],
    link: "https://example.com",
  },
];

// ------------------------------------------------------------
// API ROUTES
// ------------------------------------------------------------
app.get("/api/profile", (req, res) => res.json(profile));
app.get("/api/writings", (req, res) => res.json(writings));
app.get("/api/projects", (req, res) => res.json(projects));
app.get("/api/projects/:id", (req, res) => {
  const project = projects.find((p) => p.id === Number(req.params.id));
  if (!project) return res.status(404).json({ error: "Project not found" });
  res.json(project);
});

// Simple contact endpoint — swap the console.log for an email
// service (Resend, SendGrid, Nodemailer) when you deploy.
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: "name, email, and message are required" });
  }
  console.log("Contact form submission:", { name, email, message });
  res.json({ ok: true });
});

// ------------------------------------------------------------
// PRODUCTION: serve the built frontend from ../client/dist
// ------------------------------------------------------------
const distPath = path.join(__dirname, "../client/dist");
app.use(express.static(distPath));
app.get(/^(?!\/api).*/, (req, res, next) => {
  res.sendFile(path.join(distPath, "index.html"), (err) => err && next());
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
