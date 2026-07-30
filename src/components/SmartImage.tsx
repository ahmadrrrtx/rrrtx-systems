/* eslint-disable @next/next/no-img-element */
import Image from "next/image";

export function SmartImage({
  src,
  alt,
  className,
  sizes = "100vw",
  priority = false,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const isLocal = src.startsWith("/");
  if (isLocal) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
      />
    );
  }

  // External CMS images intentionally remain browser-fetched so existing hosts
  // continue to work without a restrictive build-time host allowlist.
  return (
    <img
      src={src}
      alt={alt}
      width={1408}
      height={768}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
