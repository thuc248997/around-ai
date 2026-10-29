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
      title: "The whole system.",
      accent: "From technology to business.",
      text: "How I work: see the whole system, from technology and engineering to business, before going into the details.",
      items: [
        { title: "Pick the technology for the problem, not the hype.", text: "Know the strengths, limits and cost of each option (models, infra, data) before committing." },
        { title: "Engineer for production, not the demo.", text: "Clear architecture that can be measured and operated: latency, cost and reliability planned from day one." },
        { title: "Tie every technical choice to business value.", text: "Start from users and goals, and measure by real outcomes, not just technical metrics." },
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
        title: "Bức tranh hệ thống.",
        accent: "Từ công nghệ đến kinh doanh.",
        text: "Cách mình làm việc: nhìn toàn cảnh hệ thống, từ công nghệ, kỹ thuật đến kinh doanh, trước khi đi vào từng chi tiết.",
        items: [
          { title: "Chọn công nghệ vì bài toán, không vì xu hướng.", text: "Hiểu điểm mạnh, giới hạn và chi phí của từng lựa chọn (mô hình, hạ tầng, dữ liệu) trước khi quyết định." },
          { title: "Thiết kế để chạy thật, không chỉ để demo.", text: "Kiến trúc rõ ràng, đo lường được và vận hành được: độ trễ, chi phí, độ tin cậy được tính từ ngày đầu." },
          { title: "Mỗi quyết định kỹ thuật gắn với giá trị kinh doanh.", text: "Bắt đầu từ người dùng và mục tiêu, đo bằng kết quả thực tế chứ không chỉ bằng chỉ số kỹ thuật." },
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