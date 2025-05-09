import { motion, useScroll, useMotionValue, useMotionValueEvent, animate, MotionValue } from "framer-motion";
import { useRef } from "react";

const opaque = "#000";
const transparent = "#0000";
const leftInset = "20%";
const rightInset = "80%";

function useScrollOverflowMask(scrollXProgress : MotionValue<number>) {
  const maskImage = useMotionValue(
    `linear-gradient(90deg, ${opaque}, ${opaque} 0%, ${opaque} ${rightInset}, ${transparent})`
  );

  useMotionValueEvent(scrollXProgress, "change", (value) => {
    if (value === 0) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${opaque}, ${opaque} 0%, ${opaque} ${rightInset}, ${transparent})`
      );
    } else if (value === 1) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} 100%, ${opaque})`
      );
    } else if (
      scrollXProgress.getPrevious() === 0 ||
      scrollXProgress.getPrevious() === 1
    ) {
      animate(
        maskImage,
        `linear-gradient(90deg, ${transparent}, ${opaque} ${leftInset}, ${opaque} ${rightInset}, ${transparent})`
      );
    }
  });

  return maskImage;
}

type ImageItem = {
    src: string;
    alt: string;
  };
  
  interface ProductGalleryProps {
    images: ImageItem[];
  }

export function ProductGallery({ images }: ProductGalleryProps) {
  const ref = useRef(null);
  const { scrollXProgress } = useScroll({ container: ref });
  const maskImage = useScrollOverflowMask(scrollXProgress);

  return (
    <div id="gallery-container" className="relative w-[80%] max-w-[600px] mx-auto">
      {/* Progress Circle */}
      <svg
        width="60"
        height="60"
        viewBox="0 0 100 100"
        className="absolute -top-12 left-4 rotate-[-90deg]"
      >
        <circle cx="50" cy="50" r="30" pathLength="1" className="stroke-neutral-800 fill-none stroke-[10]" />
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          pathLength="1"
          className="stroke-orange-600 fill-none stroke-[10]"
          style={{ pathLength: scrollXProgress }}
        />
      </svg>

      {/* Scrollable Image List */}
      <motion.ul
        ref={ref}
        style={{ maskImage }}
        className="flex overflow-x-scroll gap-6 py-6 px-4 hide-scrollbar"
      >
        {images.map((img, index) => (
          <li
            key={index}
            className="flex-none w-[220px] h-[300px] rounded-xl overflow-hidden shadow-lg"
          >
            <img
              src={img.src}
              alt={img.alt}
              className="w-full h-full object-cover"
            />
          </li>
        ))}
      </motion.ul>
    </div>
  );
}
