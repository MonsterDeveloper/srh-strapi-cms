export const siteConfig = {
  name: "SRH",
  url: "http://localhost:3000",
  description: "SRH",
  baseLinks: {
    quotes: {
      overview: "/quotes/overview",
      monitoring: "/quotes/monitoring",
      audits: "/quotes/audits",
    },
  },
}

export type siteConfig = typeof siteConfig
