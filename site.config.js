const CONFIG = {
  // profile setting (required)
  profile: {
    name: "danielpham",
    image: "/avatar.svg", // If you want to create your own notion avatar, check out https://notion-avatar.vercel.app
    role: "AI Engineer",
    bio: "Welcome to my blog! I am DanielPham, an AI Engineer. This blog is where I share my knowledge and experience around AI.",
    email: "thuc248997@gmail.com",
    linkedin: "thuc-pham-807241132",
    github: "thuc248997",
    instagram: "",
  },
  projects: [
    {
      name: `around-ai blog`,
      href: "https://github.com/thuc248997/around-ai",
      label: "Open source / Self-hosted",
      tagline: "Write in markdown. Ship on your own box.",
      description:
        "This blog: a self-hosted Next.js + PostgreSQL stack with a markdown editor, running in Docker behind a Cloudflare Tunnel.",
      tags: ["Next.js", "PostgreSQL", "Docker"],
    },
  ],
  // home page copy (layout sections)
  home: {
    eyebrow: "AI Engineer / Field notes",
    headline: "Building AI",
    headlineAccent: "beyond the demo.",
    lead: "I'm danielpham, an AI Engineer. I build with LLMs and machine learning, and write down what actually works.",
    principles: {
      title: "The bigger picture.",
      accent: "The engineering detail.",
      text: "How I approach AI work: start from the real problem, measure everything, and leave notes the next engineer can use.",
      items: [
        { title: "Start with the real constraint.", text: "Latency, cost, privacy and the people using the system shape the design from day one." },
        { title: "Make decisions measurable.", text: "Benchmark the options. Write down the tradeoffs. Trust evidence over a polished demo." },
        { title: "Build understanding that lasts.", text: "Share the reasoning and the lessons so the next build starts further ahead." },
      ],
    },
    explorations: [
      { title: "LLM applications", text: "Agents, RAG and tool use that hold up outside of a notebook." },
      { title: "Machine learning in practice", text: "Training, evaluation and the boring parts that make models useful." },
      { title: "Running AI yourself", text: "Self-hosting models and infra: what it costs and what it takes." },
    ],
    cta: {
      eyebrow: "The next page",
      title: "Good systems start with a conversation.",
      text: "Have a project, a question, or an interesting idea? I'd love to hear it.",
    },
  },
  // Vietnamese copy, served under /vi. Anything missing falls back to the English values above.
  vi: {
    profile: {
      bio: "Chào mừng đến với blog của mình! Mình là DanielPham, một AI Engineer. Đây là nơi mình chia sẻ kiến thức và kinh nghiệm xoay quanh AI.",
    },
    projects: [
      {
        label: "Mã nguồn mở / Tự host",
        tagline: "Viết bằng markdown. Chạy trên máy của chính bạn.",
        description:
          "Chính blog này: một stack Next.js + PostgreSQL tự host, có trình soạn thảo markdown, chạy trong Docker phía sau Cloudflare Tunnel.",
      },
    ],
    home: {
      eyebrow: "AI Engineer / Ghi chép thực chiến",
      headline: "Xây dựng AI",
      headlineAccent: "vượt xa bản demo.",
      lead: "Mình là danielpham, một AI Engineer. Mình làm việc với LLM và machine learning, và ghi lại những gì thực sự hiệu quả.",
      principles: {
        title: "Bức tranh toàn cảnh.",
        accent: "Chi tiết kỹ thuật.",
        text: "Cách mình tiếp cận công việc AI: bắt đầu từ bài toán thật, đo lường mọi thứ, và để lại ghi chú mà kỹ sư đi sau có thể dùng được.",
        items: [
          { title: "Bắt đầu từ ràng buộc thực tế.", text: "Độ trễ, chi phí, quyền riêng tư và người dùng hệ thống định hình thiết kế ngay từ ngày đầu." },
          { title: "Quyết định phải đo lường được.", text: "Benchmark các phương án. Ghi lại các đánh đổi. Tin vào bằng chứng hơn là một bản demo bóng bẩy." },
          { title: "Xây dựng hiểu biết bền vững.", text: "Chia sẻ lập luận và bài học để lần xây dựng sau bắt đầu từ một vị trí xa hơn." },
        ],
      },
      explorations: [
        { title: "Ứng dụng LLM", text: "Agent, RAG và tool use vẫn chạy tốt khi ra khỏi notebook." },
        { title: "Machine learning thực tế", text: "Huấn luyện, đánh giá và những phần nhàm chán giúp mô hình thực sự hữu ích." },
        { title: "Tự vận hành AI", text: "Tự host mô hình và hạ tầng: tốn bao nhiêu và cần những gì." },
      ],
      cta: {
        eyebrow: "Trang tiếp theo",
        title: "Hệ thống tốt bắt đầu từ một cuộc trò chuyện.",
        text: "Bạn có dự án, câu hỏi hay một ý tưởng thú vị? Mình rất muốn được nghe.",
      },
    },
    blog: {
      description:
        "Ghi chép thực chiến về AI engineering của danielpham: ứng dụng LLM, agent, RAG, machine learning thực tế và tự vận hành AI.",
    },
  },

  // blog setting (required)
  blog: {
    title: "Around-ai",
    description:
      "Field notes on AI engineering by danielpham: LLM applications, agents, RAG, machine learning in practice and self-hosting AI.",
    theme: "auto", // ['light', 'dark', 'auto'] — auto: dark 18:00–06:00 in the visitor's local time
  },

  // CONFIG configration (required)
  link: "https://around-ai.com", // canonical url, no trailing slash
  since: 2023, // If leave this empty, current year will be used.
  lang: "en-US", // ['en-US', 'zh-CN', 'zh-HK', 'zh-TW', 'ja-JP', 'es-ES', 'ko-KR']
  seo: {
    keywords: ["AI engineering", "LLM", "AI agents", "RAG", "Machine Learning", "Self-hosted AI", "Blog"],
  },

  // plugin configuration (optional)
  googleAnalytics: {
    enable: false,
    config: {
      measurementId: process.env.NEXT_PUBLIC_GOOGLE_MEASUREMENT_ID || "",
    },
  },
  googleSearchConsole: {
    enable: false,
    config: {
      siteVerification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || "",
    },
  },
  utterances: {
    enable: false,
    config: {
      repo: "thuc248997/around-ai",
      "issue-term": "og:title",
      label: "💬 Utterances",
    },
  },
  isProd: process.env.NODE_ENV === "production",
}

module.exports = { CONFIG }