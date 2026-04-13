import { supabase } from "@/lib/supabase";
import OrderForm from "./OrderForm";
import GalleryCarousel from "./GalleryCarousel";

// Forces Next.js to fetch dynamically so updating the DB updates the site instantly
export const revalidate = 0;

export default async function HomePage() {
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", "default")
    .single();

  const title = campaign?.product_title || "تألقي بإطلالة لا تُنسى";
  const subtitle = campaign?.product_subtitle || "جودة عالية وتصميم عصري يناسب كل أوقاتك";
  const price = campaign?.price || 199;
  const oldPrice = campaign?.old_price || 350;
  const scarcityText = campaign?.scarcity_text || "انتباه: تبقت 3 قطع فقط في المخزن!";
  const mainImage = campaign?.main_image_url || "";
  const galleryImages: string[] = campaign?.gallery_images || [];

  return (
    <>
      {/* Announcement Bar */}
      <div className="top-bar">
        <span>✨ شراء آمن &nbsp;|&nbsp; 🚚 توصيل سريع لجميع المدن &nbsp;|&nbsp; 💰 الدفع عند الاستلام</span>
      </div>

      {/* Navbar */}
      <header className="navbar">
        <div className="container nav-content">
          <div className="logo">Boutique Élegance</div>
        </div>
      </header>

      {/* ═══ HERO SECTION ═══ */}
      <section className="hero">
        <div className="container">

          {/* Trust Signal */}
          <div className="trust-signal">
            <span className="trust-stars">★★★★★</span>
            <span>تقييم 4.9 من 5 &nbsp;·&nbsp; أكثر من 10,000 زبونة سعيدة</span>
          </div>

          {/* Headline */}
          <h1 className="hero-title">{title}</h1>
          <p className="hero-subtitle">{subtitle}</p>

          {/* === PRODUCT IMAGE BLOCK === */}
          <div className="product-image-block">
            {/* Main Hero Image */}
            {mainImage && (
              <div className="main-image-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mainImage} className="main-image" alt={title} />
                {oldPrice && oldPrice > price && (
                  <div className="image-discount-badge">
                    -{Math.round(((oldPrice - price) / oldPrice) * 100)}%
                  </div>
                )}
              </div>
            )}

            {/* Gallery Carousel */}
            {galleryImages.length > 0 && (
              <GalleryCarousel images={galleryImages} productName={title} />
            )}
          </div>

          {/* Pricing */}
          <div className="pricing-container">
            {oldPrice && oldPrice > price && (
              <div className="savings-badge">🔥 وفري {oldPrice - price} درهم اليوم فقط</div>
            )}
            <div className="price-row">
              <span className="price-new">{price} درهم</span>
              {oldPrice && <span className="price-old">{oldPrice} درهم</span>}
            </div>
          </div>

          {/* Scarcity */}
          {scarcityText && (
            <div className="scarcity-block">
              <span className="pulse-dot"></span>
              <span className="scarcity-text">{scarcityText}</span>
            </div>
          )}

          {/* Primary CTA */}
          <a href="#order" className="btn-primary hero-cta">
            <span>أطلبي الآن &mdash; الدفع عند الاستلام</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)', flexShrink: 0 }}>
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>

          {/* Trust Pills */}
          <div className="trust-pills">
            <span className="trust-pill">🚚 توصيل مجاني</span>
            <span className="trust-pill">🔒 دفع آمن</span>
            <span className="trust-pill">↩️ استبدال مضمون</span>
          </div>
        </div>
      </section>

      {/* ═══ BENEFITS SECTION ═══ */}
      <section className="solution-layer">
        <div className="container">
          <h2 className="section-title">لماذا تختارينه؟</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">✨</div>
              <div className="benefit-text">
                <h3>تصميم عصري وجذاب</h3>
                <p>يبرز جمالك بأسلوب أنيق وغير مبالغ فيه، مثالي لكل الأوقات.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⭐</div>
              <div className="benefit-text">
                <h3>جودة عالية وخامات فاخرة</h3>
                <p>مريح طوال اليوم ومصنوع بعناية لتمنحك الثقة والأناقة.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🇲🇦</div>
              <div className="benefit-text">
                <h3>الأكثر مبيعاً في المغرب</h3>
                <p>اختيار آلاف الزبونات الباحثات عن التميز والجمال كل يوم.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ SOCIAL PROOF ═══ */}
      <section className="social-proof">
        <div className="container">
          <h2 className="section-title">آراء زبوناتنا الأنيقات 💬</h2>
          <div className="review-slider">
            <div className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">س</div>
                <div>
                  <div className="reviewer-name">سناء — الدار البيضاء</div>
                  <div className="review-stars">★★★★★</div>
                </div>
              </div>
              <div className="review-content">
                <p>&quot;المنتج كيحمق فالحقيقة حسن من تصويرة، واعر بزاف. شكرا بزاف!&quot;</p>
              </div>
            </div>
            <div className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">م</div>
                <div>
                  <div className="reviewer-name">مريم — الرباط</div>
                  <div className="review-stars">★★★★★</div>
                </div>
              </div>
              <div className="review-content">
                <p>&quot;وصلني ليوم، جا روعة وممتاز فالاستعمال. التوصيل كان سريع والتعامل راقي.&quot;</p>
              </div>
            </div>
            <div className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">ف</div>
                <div>
                  <div className="reviewer-name">فاطمة — مراكش</div>
                  <div className="review-stars">★★★★★</div>
                </div>
              </div>
              <div className="review-content">
                <p>&quot;الجودة ممتازة والكاليتي كتبان من أول شوفة. أكيد غنبقى نتعامل معاكم.&quot;</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ORDER FORM ═══ */}
      <section id="order" className="form-section">
        <div className="container">
          <h2 className="section-title">احجزي قطعتك الآن 🛍️</h2>
          <p className="form-section-sub">الدفع عند الاستلام — لا مخاطر، لا دفع مسبق</p>
          <OrderForm price={price} />
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">أسئلة شائعة</h2>
          <details className="faq-item">
            <summary className="faq-question"><span>⏱️ متى سأتوصل بالمنتج؟</span></summary>
            <div className="faq-answer">التوصيل سريع جداً! نصلك خلال 24 إلى 48 ساعة في جميع مدن المغرب.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-question"><span>💳 كيف يتم الدفع؟</span></summary>
            <div className="faq-answer">الدفع يتم عند الاستلام فقط. لن تدفعي أي شيء حتى يصلك المنتج وتتأكدي منه.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-question"><span>↩️ هل يمكن إرجاع المنتج؟</span></summary>
            <div className="faq-answer">نعم بالتأكيد! إذا كان هناك أي عيب أو مشكلة يمكنك استبداله بسهولة.</div>
          </details>
          <details className="faq-item">
            <summary className="faq-question"><span>📦 ما هي مدن التوصيل؟</span></summary>
            <div className="faq-answer">نوصل لجميع مدن وقرى المملكة المغربية بدون استثناء.</div>
          </details>
        </div>
      </section>

      {/* Sticky CTA (Mobile Only) */}
      <div className="sticky-cta-bar">
        <a href="#order" className="btn-primary">
          🛍️ أطلبي الآن — {price} درهم
        </a>
      </div>

      <footer className="site-footer">
        <div className="container">
          <div className="logo">Boutique Élegance</div>
          <p className="footer-tagline">جمالك، أولويتنا.</p>
          <p dir="ltr" className="footer-copy">© 2026 Boutique Élegance. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
