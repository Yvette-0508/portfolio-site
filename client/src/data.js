// Fallback content bundled with the frontend so the site still
// works when deployed statically (no backend). Keep this in sync
// with server/index.js, or delete one source of truth once you
// decide how you want to deploy.

export const FALLBACK_PROFILE = {
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

export const FALLBACK_WRITINGS = [
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

export const FALLBACK_PROJECTS = [
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
