import AboutSection from "@/components/AboutSection";
import { PageContentProvider } from "@/providers/PageContentProvider";
import { Section } from "@/components/Section";
import WhyChooseSection from "@/components/WhyChooseSection";

export default function About() {
    return (
        <PageContentProvider page="about">
            <Section>
                <AboutSection></AboutSection>
                <WhyChooseSection></WhyChooseSection>
            </Section>
        </PageContentProvider>
    )
}