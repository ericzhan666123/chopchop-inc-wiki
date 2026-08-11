import fs from "node:fs";
import path from "node:path";
import Image from "next/image";

export function OptionalImage({ src, alt, className = "optional-image" }: { src: string; alt: string; className?: string }) {
  const exists = fs.existsSync(path.join(process.cwd(), "public", src.replace(/^\//, "")));
  if (!exists) return <div className={`${className} image-placeholder`} role="img" aria-label={alt} />;
  return <div className={className}><Image src={src} alt={alt} fill sizes="(max-width: 760px) 100vw, 50vw" /></div>;
}
