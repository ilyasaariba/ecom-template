"use client";

import { useRef, useState } from "react";

interface GalleryCarouselProps {
  images: string[];
  productName: string;
  discountPct?: number;
}

export default function GalleryCarousel({ images, productName, discountPct }: GalleryCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  if (!images || images.length === 0) return null;

  // Logic for Desktop Thumbnail click
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

  // Logic for Desktop Thumbs Drag Scroll
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
    <div className="product-gallery-container">
      {/* =========================================
          MOBILE VIEW (< 768px): HORIZONTAL SCROLL 
          ========================================= */}
      <div className="mobile-gallery-scroll">
        {images.map((imgUrl, idx) => (
          <div className="mobile-gallery-item" key={`mobile-img-${idx}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={imgUrl} 
              alt={`${productName} - ${idx + 1}`} 
              className="mobile-gallery-img"
              loading={idx === 0 ? "eager" : "lazy"}
              onClick={() => { setActiveIndex(idx); setLightboxOpen(true); }}
            />
            {idx === 0 && discountPct && (
              <div className="image-discount-badge">-{discountPct}%</div>
            )}
          </div>
        ))}
      </div>

      {/* =========================================
          DESKTOP VIEW (>= 768px): MAIN + THUMBS
          ========================================= */}
      <div className="desktop-gallery-interactive">
        
        {/* Main large image */}
        <div className="gallery-main-view">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIndex]}
            alt={`${productName} - ${activeIndex + 1}`}
            className="gallery-main-img"
            onClick={() => setLightboxOpen(true)}
            title="انقري لتكبير الصورة"
          />
          {activeIndex === 0 && discountPct && (
            <div className="image-discount-badge">-{discountPct}%</div>
          )}

          {/* Desktop Left/Right Navigation Arrows on Main Image */}
          {images.length > 1 && activeIndex > 0 && (
            <button
              className="gallery-nav-arrow gallery-prev-arrow"
              onClick={(e) => { e.stopPropagation(); scrollToThumb(activeIndex - 1); }}
              aria-label="الصورة السابقة"
            >
              ‹
            </button>
          )}
          {images.length > 1 && activeIndex < images.length - 1 && (
            <button
              className="gallery-nav-arrow gallery-next-arrow"
              onClick={(e) => { e.stopPropagation(); scrollToThumb(activeIndex + 1); }}
              aria-label="الصورة التالية"
            >
              ›
            </button>
          )}

          <div className="gallery-zoom-hint" onClick={() => setLightboxOpen(true)}>
            <span>🔍</span>
          </div>
        </div>

        {/* Desktop Thumbnail Strip */}
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
                key={`thumb-${index}`}
                onClick={() => scrollToThumb(index)}
                className={`gallery-thumb ${activeIndex === index ? "gallery-thumb--active" : ""}`}
                aria-label={`عرض الصورة ${index + 1}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt={`Thumbnail ${index + 1}`} loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* =========================================
          GLOBAL LIGHTBOX (WORKS ON BOTH)
          ========================================= */}
      {lightboxOpen && (
        <div className="gallery-lightbox" onClick={() => setLightboxOpen(false)}>
          <button className="gallery-lightbox-close" onClick={() => setLightboxOpen(false)}>✕</button>

          {activeIndex > 0 && (
            <button
              className="gallery-lightbox-nav gallery-lightbox-prev"
              onClick={(e) => { e.stopPropagation(); setActiveIndex(activeIndex - 1); }}
            >‹</button>
          )}

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={images[activeIndex]}
            alt={productName}
            className="gallery-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />

          {activeIndex < images.length - 1 && (
            <button
              className="gallery-lightbox-nav gallery-lightbox-next"
              onClick={(e) => { e.stopPropagation(); setActiveIndex(activeIndex + 1); }}
            >›</button>
          )}

          <div className="gallery-lightbox-dots">
            {images.map((_, i) => (
              <button
                key={`dot-${i}`}
                onClick={(e) => { e.stopPropagation(); setActiveIndex(i); }}
                className={`gallery-dot ${i === activeIndex ? "gallery-dot--active" : ""}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
