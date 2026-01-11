/* =========================
   SIDEBAR TYPES
========================= */

export type VisaMenuItem = {
  slug: string
  label: string
}

export type VisaDownload = {
  title: string
  size: string
  icon: string
  url: string
}

export type VisaSidebarBanner = {
  background: string
  image: string
  heading_small: string
  heading_main: string
  points: string[]
  cta: {
    label: string
    url: string
  }
}

/* =========================
   VISA PAGE CONTENT
========================= */

export type VisaOverview = {
  image: string
  title: string
  paragraphs: string[]
}

export type VisaTypeCard = {
  id: number
  title: string
  description: string
  image: string
  hover_image: string
  link: string
}

export type VisaPackageTab = {
  key: string
  icon: string
  title: string
  subtitle: string
  content: {
    heading: string
    text: string
    image: string
  }
}

export type VisaPackages = {
  title: string
  description: string
  tabs: VisaPackageTab[]
}

export type VisaReasonItem = {
  icon: string
  title: string
  text: string
}

/* =========================
   MAIN VISA DETAILS OBJECT
========================= */

export type VisaDetails = {
  overview: VisaOverview
  visa_types: VisaTypeCard[]
  packages: VisaPackages
  reasons: {
    title: string
    description: string
    items: VisaReasonItem[]
  }
}

/* =========================
   FULL API RESPONSE
   (single visa page)
========================= */

export type VisaPageResponse = {
  sidebar: {
    menu: VisaMenuItem[]
    downloads: VisaDownload[]
    banner: VisaSidebarBanner
  }
  details: VisaDetails
}
