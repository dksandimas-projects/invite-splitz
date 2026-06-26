import Image from "next/image";

interface ImageBreakProps {
  src?: string;
  alt?: string;
  priority?: boolean;
}

export function ImageBreak({
  src,
  alt = "",
  priority = false,
}: ImageBreakProps) {
  return (
    <div className="px-6 mb-section-gap-mobile w-full">
      <div className="max-w-guest mx-auto w-full aspect-[4/5] rounded-xl overflow-hidden border border-stone bg-stone-light relative shadow-md">
        {src ? (
          <>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(max-width: 768px) 100vw, 576px"
              className="object-cover"
              priority={priority}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent flex items-end p-6 sm:p-8 md:p-10">
              <p className="text-white text-sm sm:text-base font-light text-left leading-relaxed max-w-md">
                Together with their families, they request the honor of your presence as they celebrate their union.
              </p>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
