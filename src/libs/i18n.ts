import { useRouter } from "next/router"
import { CONFIG } from "site.config"

export const LOCALES = ["en", "vi"] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = "en"

/** A post's Vietnamese translation lives at `<slug>-vi` */
export const VI_SUFFIX = "-vi"

export const toLocale = (l?: string): Locale => (l === "vi" ? "vi" : "en")

/** BCP 47 tag for dates and <html lang> */
export const dateLocale = (l: Locale) => (l === "vi" ? "vi-VN" : CONFIG.lang)

/** Public URL of a path in a locale: "/blog" -> "https://around-ai.com/vi/blog" */
export const localeUrl = (path: string, l: Locale) =>
  `${CONFIG.link}${l === DEFAULT_LOCALE ? "" : `/${l}`}${
    path === "/" ? "" : path
  }`

/** Site copy from site.config, with the locale's overrides applied */
export function siteCopy(l: Locale) {
  const vi = l === "vi" ? CONFIG.vi : undefined
  return {
    profile: { ...CONFIG.profile, ...vi?.profile },
    home: { ...CONFIG.home, ...vi?.home },
    blog: { ...CONFIG.blog, ...vi?.blog },
    projects: CONFIG.projects.map((p, i) => ({ ...p, ...vi?.projects?.[i] })),
  }
}

const en = {
  nav: { home: "home", blog: "blog", about: "about" },
  langSwitch: "Language",
  skip: "Skip to content",
  logoSubtitle: "AI engineering / field notes",
  footer: {
    explore: "Explore",
    content: "Content",
    projects: "Projects",
    home: "Home",
    about: "About",
    contact: "Contact",
    blog: "Blog",
    rss: "RSS feed",
    sitemap: "Sitemap",
    tagline: "Notes on LLMs, machine learning and the systems around them.",
    rights: "All rights reserved.",
  },
  home: {
    crumb: "engineering notebook",
    crumbRight: "ideas — systems — lessons",
    read: "Read the notebook",
    aboutMe: "About me",
    buildCta: "Let's build something useful",
    terminalFooter: "Hands-on by choice. Curious by default.",
    statPosts: "Published posts",
    statSince: (y: number | string) => `Since ${y}`,
    statSinceLabel: "Writing in the open",
    statTopics: "Topics covered",
    workLabel: "Selected work",
    workTitle: "From an idea to something useful.",
    allProjects: "All projects",
    explore: (name: string) => `Explore ${name}`,
    projectFooter: "Self-hosted. Markdown in, blog out.",
    howIWork: "02 / How I work",
    background: "Background & experience",
    explorationsLabel: "Current explorations",
    explorationsTitle: "The questions keeping me curious.",
    notesLabel: "Field notes",
    notesTitle: "Building things. Writing it down.",
    allArticles: "All articles",
    note: "NOTE",
    noPosts: "No posts yet — check back soon.",
    viewAll: (n: number) => `View all ${n} posts`,
    talk: "Let's talk",
  },
  blog: {
    crumb: "blog / the engineering notebook",
    title: "Ideas tested.",
    titleAccent: "Lessons shared.",
    lead: "Field notes from building AI systems. Practical experiments, engineering decisions, and lessons worth sharing.",
    by: (name: string) => `by ${name} · building in the open`,
    latest: "The latest essay",
    openEssay: "open essay",
    workbench: "From the workbench",
    smallFix: "A small fix.",
    usefulLesson: "A useful lesson.",
    openNote: "Open field note",
    archive: "The archive",
    archiveRight: "articles & field notes",
    all: "All",
    search: "grep title, tag, keyword",
    posts: (n: number) => `${n === 1 ? "post" : "posts"}`,
    noMatch: "grep: no matches.",
    prev: "← Previous",
    next: "Next →",
    pageOf: (p: number, n: number) => `${p} of ${n}`,
    pathEyebrow: "A way into the writing",
    pathTitle: "Choose a reading path.",
    pathText: "Starting points, depending on what you're building.",
    behind: "Behind the notebook",
    builtInPractice: "Built in practice.",
    sharedInPublic: "Shared in public.",
    meet: "Meet the author",
    follow: "Follow new writing",
    followText: "Articles and engineering notes, in your feed reader.",
    subscribe: "Subscribe via RSS",
  },
  post: {
    minRead: (n: number) => `${n} min read`,
    by: (name: string) => `by ${name}`,
    writtenBy: "Written by",
    allPosts: "All posts",
    noTranslation: "This post is only available in English.",
  },
  error: {
    notFound: "This page could not be found.",
    server: "Something went wrong. Please try again later.",
  },
}

const vi: typeof en = {
  nav: { home: "trang chủ", blog: "blog", about: "về mình" },
  langSwitch: "Ngôn ngữ",
  skip: "Bỏ qua đến nội dung",
  logoSubtitle: "Kỹ thuật AI / ghi chép thực chiến",
  footer: {
    explore: "Khám phá",
    content: "Nội dung",
    projects: "Dự án",
    home: "Trang chủ",
    about: "Giới thiệu",
    contact: "Liên hệ",
    blog: "Blog",
    rss: "RSS feed",
    sitemap: "Sơ đồ trang",
    tagline:
      "Ghi chép về LLM, machine learning và các hệ thống xoay quanh chúng.",
    rights: "Đã đăng ký bản quyền.",
  },
  home: {
    crumb: "sổ tay kỹ thuật",
    crumbRight: "ý tưởng — hệ thống — bài học",
    read: "Đọc sổ tay",
    aboutMe: "Về mình",
    buildCta: "Cùng xây dựng điều gì đó hữu ích",
    terminalFooter: "Thích bắt tay vào làm. Luôn tò mò.",
    statPosts: "Bài đã đăng",
    statSince: (y) => `Từ ${y}`,
    statSinceLabel: "Viết và chia sẻ công khai",
    statTopics: "Chủ đề",
    workLabel: "Dự án tiêu biểu",
    workTitle: "Từ một ý tưởng đến thứ thực sự hữu ích.",
    allProjects: "Tất cả dự án",
    explore: (name) => `Xem ${name}`,
    projectFooter: "Tự host. Markdown vào, blog ra.",
    howIWork: "02 / Cách mình làm việc",
    background: "Kinh nghiệm & quá trình",
    explorationsLabel: "Đang tìm hiểu",
    explorationsTitle: "Những câu hỏi khiến mình tò mò.",
    notesLabel: "Ghi chép",
    notesTitle: "Xây dựng. Rồi viết lại.",
    allArticles: "Tất cả bài viết",
    note: "GHI CHÉP",
    noPosts: "Chưa có bài viết nào — hãy quay lại sau nhé.",
    viewAll: (n) => `Xem tất cả ${n} bài`,
    talk: "Trò chuyện nhé",
  },
  blog: {
    crumb: "blog / sổ tay kỹ thuật",
    title: "Thử nghiệm ý tưởng.",
    titleAccent: "Chia sẻ bài học.",
    lead: "Ghi chép từ quá trình xây dựng hệ thống AI. Thử nghiệm thực tế, quyết định kỹ thuật và những bài học đáng chia sẻ.",
    by: (name) => `bởi ${name} · xây dựng công khai`,
    latest: "Bài mới nhất",
    openEssay: "đọc bài",
    workbench: "Từ bàn làm việc",
    smallFix: "Một bản sửa nhỏ.",
    usefulLesson: "Một bài học hữu ích.",
    openNote: "Đọc ghi chép",
    archive: "Lưu trữ",
    archiveRight: "bài viết & ghi chép",
    all: "Tất cả",
    search: "grep tiêu đề, tag, từ khóa",
    posts: () => "bài",
    noMatch: "grep: không tìm thấy kết quả.",
    prev: "← Trước",
    next: "Sau →",
    pageOf: (p, n) => `${p} / ${n}`,
    pathEyebrow: "Bắt đầu từ đâu",
    pathTitle: "Chọn lộ trình đọc.",
    pathText: "Điểm khởi đầu, tùy vào thứ bạn đang xây dựng.",
    behind: "Phía sau sổ tay",
    builtInPractice: "Xây dựng từ thực tế.",
    sharedInPublic: "Chia sẻ công khai.",
    meet: "Về tác giả",
    follow: "Theo dõi bài mới",
    followText:
      "Bài viết và ghi chép kỹ thuật, ngay trong trình đọc feed của bạn.",
    subscribe: "Đăng ký qua RSS",
  },
  post: {
    minRead: (n) => `${n} phút đọc`,
    by: (name) => `bởi ${name}`,
    writtenBy: "Viết bởi",
    allPosts: "Tất cả bài viết",
    noTranslation: "Bài viết này hiện chỉ có bản tiếng Anh.",
  },
  error: {
    notFound: "Không tìm thấy trang này.",
    server: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
  },
}

export const messages = { en, vi }

export function useLocale(): Locale {
  return toLocale(useRouter().locale)
}

/** UI strings plus localized site copy for the current locale */
export function useT() {
  const locale = useLocale()
  return { locale, t: messages[locale], copy: siteCopy(locale) }
}
