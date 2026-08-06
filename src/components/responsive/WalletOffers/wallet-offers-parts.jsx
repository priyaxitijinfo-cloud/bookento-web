"use client";

function OfferValueBadge({ discountLabel }) {
  return (
    <div className="flex h-[88px] w-[72px] shrink-0 flex-col overflow-hidden rounded-xl bg-background md:h-[92px] md:w-[80px]">
      <div className="flex flex-1 items-center justify-center px-2 pb-2 pt-2 md:pb-2.5">
        <img
          src="/icons/vector.png"
          alt=""
          className="size-8 object-contain md:size-9"
          draggable={false}
        />
      </div>
      <div className="mx-3 h-px bg-gradient-to-r from-transparent via-[#B0C6FD] to-transparent" aria-hidden />
      <div className="flex h-[38px] items-center justify-center px-1 md:h-[40px]">
        <span className="text-[15px] font-bold leading-none text-[#1E293B] md:text-base">{discountLabel}</span>
      </div>
    </div>
  );
}

export function OfferCard({ offer, onApply }) {
  return (
    <div className="rounded-2xl border-[1.5px] border-dashed border-[#B0C6FD] bg-[#F2F7FE] p-3 md:p-4">
      <div className="flex items-stretch gap-3 md:gap-4">
        <OfferValueBadge discountLabel={offer.discountLabel} />

        <div className="flex min-w-0 flex-1 items-stretch gap-3 md:gap-4">
          <div className="min-w-0 flex-1 py-0.5">
            <p className="text-[16px] font-bold text-foreground md:text-[17px]">{offer.code}</p>
            <p className="mt-1 text-[14px] leading-snug text-[#64748B] md:text-[15px]">{offer.description}</p>
            <p className="mt-2 text-[13px] font-medium text-[#475569] md:text-[14px]">
              Valid till {offer.validTill}
            </p>
          </div>

          <div className="flex w-[92px] shrink-0 flex-col items-center justify-between border-l border-dashed border-[#CBD5E1] py-0.5 pl-3 md:w-[100px] md:pl-4">
            <span className="rounded-full bg-[#E3EBFF] px-2.5 py-1 text-[10px] font-semibold text-primary md:text-[11px]">
              Save {offer.savePercent}%
            </span>
            <span className="text-xl font-bold text-primary md:text-[1.375rem]">
              ₹{offer.minAmount.toLocaleString("en-IN")}
            </span>
            <button
              type="button"
              onClick={() => onApply(offer)}
              className="gradient-brand rounded-lg px-4 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-95 md:text-[13px]"
            >
              Apply
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function OffersSearchForm({ couponCode, onCouponChange, onSubmit }) {
  return (
    <form
      onSubmit={onSubmit}
      className="flex items-center gap-2 rounded-full border border-border/60 bg-background px-3 py-2 shadow-card md:gap-3 md:px-4 md:py-2.5"
    >
      <img
        src="/icons/coupon.svg"
        alt=""
        className="pointer-events-none size-6 shrink-0 object-contain md:size-7"
        draggable={false}
      />
      <input
        type="search"
        value={couponCode}
        onChange={(event) => onCouponChange(event.target.value.toUpperCase())}
        placeholder="Search or enter coupon code"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="characters"
        spellCheck={false}
        enterKeyHint="search"
        className="relative z-10 min-w-0 w-full flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60 md:text-[15px]"
        aria-label="Search or enter coupon code"
      />
      <button
        type="submit"
        className="gradient-brand shrink-0 rounded-full px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-95 md:px-5 md:py-2.5 md:text-sm"
      >
        Apply
      </button>
    </form>
  );
}

export function OffersList({ offers, couponCode, onApplyOffer }) {
  if (offers.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border/60 bg-background px-4 py-8 text-center text-sm text-muted-foreground md:text-[15px]">
        No offers match &quot;{couponCode.trim()}&quot;. Try another code or keyword.
      </p>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} onApply={onApplyOffer} />
      ))}
    </div>
  );
}
