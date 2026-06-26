import Image from "next/image";

interface ImageBreakProps {
  src?: string;
  alt?: string;
}

export function ImageBreak({ src, alt = "" }: ImageBreakProps) {
  return (
    <div className="px-6 mb-section-gap-mobile">
      <div className="max-w-guest mx-auto w-full aspect-[4/5] rounded-xl overflow-hidden border border-stone bg-stone-light relative">
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 768px) 100vw, 576px"
            className="object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}
