import { SectionHeading } from "@/components/provider-booking/shared";

export function ProviderAboutPanel({ paragraphs, mobile = false }) {
  return (
    <div>
      {mobile ? <SectionHeading title="About" /> : null}
      <div className="md:text-muted-foreground space-y-4 text-sm leading-[1.65] text-[#5B6B8C] md:text-base md:leading-relaxed">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}
