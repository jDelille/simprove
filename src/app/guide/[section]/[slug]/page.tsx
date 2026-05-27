import { notFound } from "next/navigation";
import { guides } from "@/lib/guides";
import GuideSidebar from "@/components/guide/guide-sidebar/GuideSidebar";
import GuideContent from "@/components/guide/guide-content/GuideContent";

export default async function GuidePage({
  params,
}: {
  params: Promise<{ section: string; slug: string }>;
}) {
  const { section, slug } = await params;

  const guideSection = guides.find((s) => s.slug === section);
  if (!guideSection) notFound();

  const guide = guideSection.links.find((link) => link.slug === slug);
  if (!guide) notFound();

  return (
    <div className="guide-page">
      <GuideSidebar  />
      <GuideContent guide={guide} />
    </div>
  );
}

export function generateStaticParams() {
  return guides
    .flatMap((section) => section.links)
    .map((link) => ({ slug: link.slug }));
}
