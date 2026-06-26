interface ImageBreakProps {
  src?: string;
  alt?: string;
}

export function ImageBreak({ src, alt = "" }: ImageBreakProps) {
  return (
    <div className="px-6 mb-section-gap-mobile">
      <div className="max-w-guest mx-auto w-full aspect-[4/5] rounded-xl overflow-hidden border border-stone bg-stone-light">
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
    </div>
  );
}
