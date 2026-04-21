"use client";
import GuideContent from "./guide-content/GuideContent";
import GuideSidebar from "./guide-sidebar/GuideSidebar";
import { useParams, useRouter } from "next/navigation";

const Guide = () => {
  const router = useRouter();
  const params = useParams();

  const slug = Array.isArray(params?.id)
    ? params.id[0]
    : params?.id;

  const handleNavigate = (path: string) => {
    router.push(`/guide/${path}`, { scroll: false });
  };

  return (
    <>
      <GuideSidebar setId={handleNavigate} slug={slug as string} />
      <GuideContent slug={slug as string} />
    </>
  );
};

export default Guide;