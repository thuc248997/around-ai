const token = (name) => `rgb(var(--${name}) / <alpha-value>)`

module.exports = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-mono)", "ui-monospace", "monospace"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      colors: {
        // terminal theme tokens, values live in globals.css (light + .dark)
        term: {
          bg: token("bg"),
          surface: token("surface"),
          raised: token("raised"),
          line: token("line"),
          fg: token("fg"),
          muted: token("muted"),
          green: token("green"),
          amber: token("amber"),
          band: token("band"),
        },
        accent: {
          50: "#ecfdf3",
          100: "#d1fae0",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
        },
      },
      maxWidth: { prose: "72ch" },
      keyframes: { blink: { "0%,49%": { opacity: 1 }, "50%,100%": { opacity: 0 } } },
      animation: { blink: "blink 1.1s steps(1) infinite" },
    },
  },
  plugins: [require("@tailwindcss/typography")],
}
