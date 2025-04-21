"use client";
import Image from "next/image";
import { useState } from "react";
import { z } from "zod";

const ImageTypeSchema = z.object({
  src: z.string(),
  width: z.number(),
  height: z.number(),
  alt: z.string(),
});

type ImageType = z.infer<typeof ImageTypeSchema>;

export default function Carousel({
  images,
  itemWidth = "w-1/2",
  aspect = "aspect-square",
}: {
  images: ImageType[];
  itemWidth?: string;
  aspect?: string;
}) {
  const validImages = images.filter(
    (image) => ImageTypeSchema.safeParse(image).success,
  );
  const [selectedImage, setSelectedImage] = useState<ImageType | null>(null);

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
