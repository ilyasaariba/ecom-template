"use client";

import { useRef, useState } from "react";

interface GalleryCarouselProps {
  images: string[];
  productName: string;
}

export default function GalleryCarousel({ images, productName }: GalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  if (!images || images.length === 0) return null;

  const scrollToThumb = (index: number) => {
    setActiveIndex(index);
    const slider = sliderRef.current;
    if (!slider) return;
    const thumb = slider.querySelectorAll(".gallery-thumb")[index] as HTMLElement;
    if (thumb) {
      const thumbLeft = thumb.offsetLeft - slider.offsetWidth / 2 + thumb.offsetWidth / 2;
      slider.scrollTo({ left: thumbLeft, behavior: "smooth" });
    }
  };

  // Mouse drag scroll
  const onMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true;
    startX.current = e.pageX - (sliderRef.current?.offsetLeft || 0);
    scrollLeft.current = sliderRef.current?.scrollLeft || 0;
    if (sliderRef.current) sliderRef.current.style.cursor = "grabbing";
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !sliderRef.current) return;
    e.preventDefault();
    const x = e.pageX - (sliderRef.current.offsetLeft || 0);
    const walk = (x - startX.current) * 1.5;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };
  const onMouseUp = () => {
    isDragging.current = false;
    if (sliderRef.current) sliderRef.current.style.cursor = "grab";
  };

  return (
    <>
      {/* Main viewed image */}
      <div
        className="gallery-main-view"
        onClick={() => setLightboxOpen(true)}
        title="انقري لتكبير الصورة"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[activeIndex]}
          alt={`${productName} - ${activeIndex + 1}`}
          className="gallery-main-img"
        />
        <div className="gallery-zoom-hint">
          <span>🔍</span>
        </div>
        {images.length > 1 && (
          <div className="gallery-counter">{activeIndex + 1} / {images.length}</div>
        )}
      </div>

      {/* Thumbnail strip */}
      {images.length > 1 && (
        <div
          className="gallery-thumbs"
          ref={sliderRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
        >
          {images.map((imgUrl, index) => (
            <button
              key={index}
              onClick={() => scrollToThumb(index)}
              className={`gallery-thumb ${activeIndex === index ? "gallery-thumb--active" : ""}`}
              aria-label={`صورة ${index + 1}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imgUrl} alt={`thumb-${index + 1}`} />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="gallery-lightbox"
          onClick={() => setLightboxOpen(false)}
        >
          <button className="gallery-lightbox-close" onClick={() => setLightboxOpen(false)}>✕</button>

          {/* prev */}
          {activeIndex > 0 && (
            <button
              className="gallery-lightbox-nav gallery-lightbox-prev"
              onClick={(e) => { e.stopPropagation(); scrollToThumb(activeIndex - 1); }}
            >‹</button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIndex]}
            alt={productName}
            className="gallery-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

          {/* next */}
          {activeIndex < images.length - 1 && (
            <button
              className="gallery-lightbox-nav gallery-lightbox-next"
              onClick={(e) => { e.stopPropagation(); scrollToThumb(activeIndex + 1); }}
            >›</button>
          )}

          <div className="gallery-lightbox-dots">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); scrollToThumb(i); }}
                className={`gallery-dot ${i === activeIndex ? "gallery-dot--active" : ""}`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
