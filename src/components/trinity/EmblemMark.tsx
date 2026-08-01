import Image from "next/image";

export default function EmblemMark({ size = 96, className = "" }: { size?: number; className?: string }) {
  return (
    <div
      className={`relative rounded-full overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/media/trinity/emblem.png"
        alt="Trinity"
        fill
        priority
        className="object-cover scale-[1.35]"
        sizes={`${size}px`}
      />
    </div>
  );
}
