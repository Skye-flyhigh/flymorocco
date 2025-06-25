"use client";
import { ImageType, ImageTypeSchema } from "@/lib/types/image";
import { extractImageDimensions } from "@/scripts/imageProcessing";
import Image from "next/image";
import { useMemo, useState } from "react";

export default function Carousel({
  images,
  itemWidth = "w-1/2",
  aspect = "aspect-square",
}: {
  images: ImageType[];
  itemWidth?: string;
  aspect?: string;
}) {
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

  const validImages = useMemo(() => {
    return images
      .filter((image) => ImageTypeSchema.safeParse(image).success)
      .map((image) => {
        if (!image.width || !image.height) {
          const { width, height } = extractImageDimensions(image.src);
          image.width = width;
          image.height = height;
        }
        return image;
      });
  }, [images]);

  return (
    <>
      <div
        className="carousel carousel-center"
        role="region"
        aria-label="Image Carousel"
      >
        {validImages.map((image) => (
          <div
            className={`carousel-item ${itemWidth} max-w-80`}
            key={image.src}
            onClick={() => setSelectedImage(image)}
            role="button"
            aria-label={`View image ${image.alt}`}
          >
            <div className="relative overflow-hidden max-w-80">
              <Image
                src={image.src}
                alt={image.alt}
                width={image.width}
                height={image.height}
                className={`object-cover ${aspect}`}
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/70 bg- z-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
          role="dialog"
          aria-modal="true"
        >
          <div className="max-w-full max-h-full p-4">
            <Image
              src={selectedImage.src}
              alt={selectedImage.alt}
              width={selectedImage.width}
              height={selectedImage.height}
              className="object-contain max-h-[90vh] max-w-[90vw]"
            />
          </div>
        </div>
      )}
    </>
  );
}
