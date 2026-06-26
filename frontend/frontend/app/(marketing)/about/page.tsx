// app/(marketing)/about/page.tsx
import { getPageMeta, defaultMeta } from '@/services/meta'
import { Metadata } from 'next'
import AboutSection from "@/components/AboutSection";
import { PageContentProvider } from "@/providers/PageContentProvider";
import { Section } from "@/components/Section";
import WhyChooseSection from "@/components/WhyChooseSection";
import Script from 'next/script'
import Link from 'next/link'

export const revalidate = 86400;

export async function generateMetadata(): Promise<Metadata> {
    const meta = await getPageMeta('about')
    const title = meta?.title || defaultMeta.about?.title || 'About Us | Migration Reviews — Trusted Immigration Consultant Reviews'
    const description = meta?.description || defaultMeta.about?.description || 'Learn how Migration Reviews is building a transparent, verified platform connecting global migrants with trustworthy immigration consultants. Our mission, values, and impact.'
    const ogTitle = meta?.ogTitle || meta?.title || defaultMeta.about?.ogTitle || defaultMeta.about?.title
    const ogDescription = meta?.ogDescription || meta?.description || defaultMeta.about?.ogDescription || defaultMeta.about?.description
    const ogImage = meta?.ogImage || defaultMeta.about?.ogImage
    const ogType = (meta?.ogType || defaultMeta.about?.ogType || 'website') as 'article' | 'website'
    const twitterTitle = meta?.twitterTitle || meta?.ogTitle || meta?.title || defaultMeta.about?.twitterTitle || defaultMeta.about?.ogTitle || defaultMeta.about?.title
    const twitterDescription = meta?.twitterDescription || meta?.ogDescription || meta?.description || defaultMeta.about?.twitterDescription || defaultMeta.about?.ogDescription || defaultMeta.about?.description
    const twitterImage = meta?.twitterImage || meta?.ogImage || defaultMeta.about?.twitterImage || defaultMeta.about?.ogImage
    return {
        title,
        description,
        keywords: meta?.keywords || defaultMeta.about?.keywords || 'immigration consultant reviews, verified migration agents, trusted visa consultants, global immigration platform',
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            images: ogImage ? [{ url: ogImage }] : [],
            type: ogType,
        },
        twitter: {
            card: 'summary_large_image',
            title: twitterTitle,
            description: twitterDescription,
            images: twitterImage ? [twitterImage] : [],
        },
        alternates: {
            canonical: meta?.canonical || 'https://migrationreviews.com/about/',
        },
        robots: (meta?.robots || defaultMeta.about?.robots) as Metadata['robots'],
    }
}

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://migrationreviews.com/" },
    { "@type": "ListItem", "position": 2, "name": "About Us", "item": "https://migrationreviews.com/about/" }
  ]
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Migration Reviews",
  "url": "https://migrationreviews.com",
  "description": "Trusted platform for verified immigration consultant reviews and transparent visa service ratings worldwide",
  "sameAs": [
    "https://www.linkedin.com/company/migration-reviews",
    "https://www.facebook.com/migrationreviews",
    "https://twitter.com/migrationreviews"
  ]
}

export default function About() {
    return (
        <PageContentProvider page="about">
            <Script
                id="schema-breadcrumb-about"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <Script
                id="schema-organization-about"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <h1 className="sr-only">About Migration Reviews — Trusted Immigration Consultant Review Platform</h1>
            <Section>
                <AboutSection />
            </Section>

            {/* SEO Content Block — About Mission & Impact */}
            <Section tone="neutral">
                <div className="max-w-4xl mx-auto border-t border-border/60 pt-10 pb-6 text-left">
                    <h2 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">
                        Our Mission: Transparency in Global Immigration Services
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        Migration Reviews was founded on a simple belief: choosing an immigration consultant should never be a gamble. Every year, millions of people invest their life savings, take time off work, and bet their futures on migration applications. Yet most of them hire consultants based on slick websites, vague promises, and word-of-mouth from people who may not have experienced the same visa type or situation. This information gap creates a marketplace where bad consultants thrive, good consultants struggle to prove their value, and applicants make expensive mistakes.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        We built Migration Reviews to close this gap. Our platform aggregates verified reviews from past clients who have actually navigated visa applications with specific consultants. Rather than trusting marketing claims or outdated testimonials, applicants can now access real data: approval rates, timelines, communication quality, pricing transparency, and candid feedback from verified past clients. This shift from opinion to evidence is transforming how people choose immigration representation.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Our vision is a world where immigration consultants compete on transparency and track record—not marketing budgets. Where first-time migrants can compare consultants by verified success metrics. Where consultants are incentivized to deliver exceptional service because their reputation depends on honest client feedback. And where the global migration journey becomes less risky, less expensive, and more successful for everyone.
                    </p>

                    <h2 className="mt-8 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                        How Migration Reviews Works
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        Our platform operates on three core principles: verification, transparency, and accessibility. Every review on Migration Reviews comes from a past client who has verifiable evidence of their visa outcome. We don't publish unverified testimonials or fake reviews. When a client submits a review, we verify their identity and visa outcome before publishing. This ensures that every rating, every success story, and every cautionary tale is genuine and traceable. Consultants can't pay to boost their ratings, and applicants can't post revenge reviews—only verified, honest feedback from real clients appears on our platform.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Second, we ensure complete transparency of consultant credentials, specialization, and track record. When you view a consultant's profile on Migration Reviews, you see their registration status (MARA, RCIC, OISC, etc.), years of experience, specific visa types they specialize in, approval rates broken down by visa category, average processing timelines, and fee transparency. You also see reviews segmented by visa type, so you're not comparing Australia skilled migration feedback with UK family visa feedback. This level of detail means you can evaluate a consultant against criteria that actually matter for your situation.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Third, we keep Migration Reviews free and accessible to all migrants, regardless of location or economic background. Our vision is that the ability to choose a trustworthy consultant shouldn't depend on your budget or your network. Whether you're applying from India, Pakistan, Philippines, Nigeria, or any other country, you should have access to verified consultant data. We believe this democratization of information is the fastest path to improving global immigration outcomes.
                    </p>

                    <h2 className="mt-8 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                        Why Consultant Reviews Matter
                    </h2>
                    <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                        Immigration is the only major life decision where most people hire an advisor they can't verify. You wouldn't hire an accountant without checking their qualifications. You wouldn't hire a lawyer without verifying their bar admission. Yet millions of people hire immigration consultants based on a single Google search result or a friend's recommendation from a completely different visa category. This asymmetry of information leads to billions of dollars wasted annually on poor consultant choices, missed deadlines, rejected applications, and delayed dreams.
                    </p>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        Verified consultant reviews change this dynamic. When you can read that a consultant has approved 156 Australian skilled migration visas with a 91% first-time approval rate and an average timeline of 4.3 months, you're making an evidence-based decision, not a guessed-based one. When you can read that clients consistently praise a consultant's communication responsiveness and proactive document management, you know what to expect. When you can read cautionary reviews from clients who experienced delays or fee surprises, you can ask clarifying questions upfront. Reviews empower applicants to evaluate consultants like they would any other professional service.
                    </p>

                    <div className="mt-6 flex gap-4">
                        <Link href="/review" className="inline-block py-3 rounded-lg px-6 font-medium text-white bg-black hover:bg-gray-800 transition-colors">
                            Explore Consultant Reviews
                        </Link>
                        <Link href="/" className="inline-block py-3 rounded-lg px-6 font-medium text-black border border-gray-300 hover:bg-gray-50 transition-colors">
                            Back to Home
                        </Link>
                    </div>
                </div>
            </Section>

            <Section>
                <WhyChooseSection />
            </Section>
        </PageContentProvider>
    )
}