import { TabPanelHeader } from "@/components/provider-booking/shared";

export function ProviderAboutPanel({ provider, paragraphs }) {
  return (
    <div>
      <TabPanelHeader
        title="About Doctor"
        description="Professional background, experience, and consultation details."
      />

      <div className="text-muted-foreground -mt-2 space-y-4 text-sm leading-relaxed md:text-base">
        {paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 32)}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-border/60 bg-[#F8F9FC] p-4 md:p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">Experience</p>
          <p className="mt-2 text-xl font-bold">{provider.yearsOfExperience}+ Years</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-[#F8F9FC] p-4 md:p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">Total Bookings</p>
          <p className="mt-2 text-xl font-bold">{provider.totalBookings}+</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-[#F8F9FC] p-4 md:p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">Consultation Modes</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed">Onsite · Online · Home Visit</p>
        </div>
        <div className="rounded-xl border border-border/60 bg-[#F8F9FC] p-4 md:p-5">
          <p className="text-muted-foreground text-xs font-semibold uppercase tracking-wide">Languages</p>
          <p className="mt-2 text-sm font-semibold leading-relaxed">English · Hindi · Gujarati</p>
        </div>
      </div>
    </div>
  );
}
