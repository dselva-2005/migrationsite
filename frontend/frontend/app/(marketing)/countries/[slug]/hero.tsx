"use client"

import { usePageContent } from "@/providers/PageContentProvider";

type HeroImage = {
  url: string;
};

type PageContent = {
  heroimage?: HeroImage;
};

type PageHeroProps = {
  title: string;
};

export default function PageHero({ title }: PageHeroProps) {
  const { content, loading } = usePageContent() as {
    content: PageContent | null;
    loading: boolean;
  };

  const imageUrl = content?.heroimage?.url;

  if (loading) return null;

  return (
    <section className="relative h-[400px] md:h-[500px] w-full">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: imageUrl ? `url("${imageUrl}")` : 'linear-gradient(to right, #3b82f6, #1d4ed8)',
        }}
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            {title}
          </h1>
        </div>
      </div>
    </section>
  );
}