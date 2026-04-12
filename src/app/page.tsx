import { supabase } from "@/lib/supabase";

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
      <div className="top-bar">
        <span>🔥 عرض حصري لفترة محدودة - التوصيل متوفر لجميع مدن المغرب</span>
      </div>

      <header className="navbar">
        <div className="container nav-content">
          <div className="logo">Boutique Élegance</div>
        </div>
      </header>

      {/* Hero Section (The Hook & Emotion) */}
      <section className="hero">
        <div className="container hero-wrapper">
          <div className="hero-content">
            <div className="trust-signal">
              <span className="trust-stars">★★★★★</span>
              <span>تقييم 4.9/5 من طرف +10,000 زبونة</span>
            </div>
            
            <h1>{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>

            <div className="hero-image-box lg:hidden">
              {mainImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mainImage} className="main-image" alt={title} />
              )}
            </div>

            <div className="pricing-container">
              {oldPrice && oldPrice > price && (
                <div className="savings-badge">🔥 وفري {oldPrice - price} درهم اليوم</div>
              )}
              <div className="price-row">
                <span className="price-new">{price} درهم</span>
                {oldPrice && <span className="price-old">{oldPrice} درهم</span>}
              </div>
            </div>

            {scarcityText && (
              <div className="scarcity-block">
                <span className="pulse-dot"></span>
                <span className="scarcity-text">{scarcityText}</span>
              </div>
            )}

            <a href="#order" className="btn-primary">
              أطلبي الآن وادفعي عند الاستلام
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: 'rotate(180deg)' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            
            <div className="secure-payment-icons">
              <span title="توصيل مجاني">🚚</span>
              <span title="دفع آمن">🔒</span>
              <span title="جودة مضمونة">✨</span>
            </div>
          </div>

          <div className="hero-image-box hidden lg:block">
            {mainImage && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mainImage} className="main-image" alt={title} />
            )}
          </div>
        </div>
      </section>

      {/* Discovery Layer (Carousel) */}
      {galleryImages && galleryImages.length > 0 && (
        <section className="container">
          <div className="gallery-carousel">
            {galleryImages.map((imgUrl, index) => (
              <div key={index} className="gallery-item">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={imgUrl} alt={`صورة المنتج ${index + 1}`} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Solution Layer */}
      <section className="solution-layer">
        <div className="container">
          <h2 className="section-title">لماذا هذا المنتج هو الخيار الأمثل لك؟</h2>
          <div className="benefits-list">
            <div className="benefit-item">
              <div className="benefit-icon">✨</div>
              <div className="benefit-text">
                <h3>تصميم عصري وجذاب</h3>
                <p>يبرز جمالك بأسلوب أنيق وغير مبالغ فيه، مثالي لكل الأوقات والمناسبات.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">⭐</div>
              <div className="benefit-text">
                <h3>مواد عالية الجودة</h3>
                <p>مصنوع من خامات مريحة وفخمة تمنحك الثقة وحرية الحركة طوال اليوم.</p>
              </div>
            </div>
            <div className="benefit-item">
              <div className="benefit-icon">🇲🇦</div>
              <div className="benefit-text">
                <h3>مفضل لدى الزبونات المغربيات</h3>
                <p>منتج يتناسب مع الذوق الرفيع والباحثات عن التميز باستمرار.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Layer */}
      <section className="social-proof">
        <div className="container">
          <h2 className="section-title">ماذا يقلن زبوناتنا الأنيقات؟</h2>
          <div className="review-slider">
            <div className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">س</div>
                <div>
                  <div className="reviewer-name">سناء، الدار البيضاء</div>
                  <div className="review-stars">★★★★★</div>
                </div>
              </div>
              <div className="review-content">
                <p>"المنتج كيحمق فالحقيقة حسن من تصويرة، واعر بزاف ومريح. شكرا جزيلا!"</p>
              </div>
            </div>
            <div className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">م</div>
                <div>
                  <div className="reviewer-name">مريم، الرباط</div>
                  <div className="review-stars">★★★★★</div>
                </div>
              </div>
              <div className="review-content">
                <p>"وصلني ليوم، جا روعة وممتاز فالاستعمال. التوصيل كان سريع والتعامل راقي."</p>
              </div>
            </div>
            <div className="review-card">
              <div className="review-header">
                <div className="reviewer-avatar">ف</div>
                <div>
                  <div className="reviewer-name">فاطمة الزهراء، مراكش</div>
                  <div className="review-stars">★★★★★</div>
                </div>
              </div>
              <div className="review-content">
                <p>"روعة روعة! الجودة ممتازة والكاليتي كتبان من أول شوفة. أكيد غنبقى نتعامل معاكم."</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conversion Layer (Form) */}
      <section id="order" className="form-section">
        <div className="container">
          <h2 className="section-title">احجزي قطعتك الآن! الدفع عند الاستلام</h2>
          <div className="checkout-box">
            <form 
              action={async (formData) => {
                "use server";
                const name = formData.get("name");
                const phone = formData.get("phone");
                const city = formData.get("city");
                if (!name || !phone || !city) return;

                await supabase.from("leads").insert({
                  campaign_slug: "default",
                  full_name: name,
                  phone: phone,
                  city: city
                });
              }}
            >
              <div className="form-group">
                <label className="form-label" htmlFor="name">الاسم الكامل</label>
                <input className="form-input" type="text" id="name" name="name" placeholder="أدخلي اسمك الكامل" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="phone">رقم الهاتف للاتصال بك</label>
                <input className="form-input" type="tel" id="phone" name="phone" placeholder="06XX-XXXXXX" dir="ltr" inputMode="numeric" required />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="city">المدينة</label>
                <input className="form-input" type="text" id="city" name="city" placeholder="مدينة التوصيل" required />
              </div>
              
              <button type="submit" className="btn-primary">
                أكدي الطلب الآن ({price} درهم)
              </button>
              
              <div className="secure-payment-icons">
                <span>🔒</span>
                <span style={{fontSize: '0.9rem', alignSelf: 'center'}}>معلوماتك آمنة 100%. الدفع يتم بعد استلامك للمنتج.</span>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Objection Handler (FAQ) */}
      <section className="faq-section">
        <div className="container">
          <h2 className="section-title">أسئلة شائعة</h2>
          <details className="faq-item">
            <summary className="faq-question">
              <span>متى سأتوصل بالمنتج؟</span>
            </summary>
            <div className="faq-answer">
              التوصيل سريع جداً! في العادة نصلك خلال 24 إلى 48 ساعة فقط، في جميع مدن المغرب.
            </div>
          </details>
          <details className="faq-item">
            <summary className="faq-question">
              <span>كيف يمكنني الدفع؟</span>
            </summary>
            <div className="faq-answer">
              نحن نوفر خدمة "الدفع عند الاستلام". لن تدفعي أي شيء حتى يصلك المنتج إلى باب منزلك وتتأكدي منه.
            </div>
          </details>
          <details className="faq-item">
            <summary className="faq-question">
              <span>هل يمكن إرجاع المنتج؟</span>
            </summary>
            <div className="faq-answer">
              نعم بالتأكيد! نحن نثق في جودة منتجاتنا. إذا كان هناك أي عيب أو مشكلة يمكنك استبداله بسهولة.
            </div>
          </details>
        </div>
      </section>

      {/* Sticky CTA (Mobile) */}
      <div className="sticky-cta-bar">
        <a href="#order" className="btn-primary">
          أطلبي الآن ({price} درهم)
        </a>
      </div>

      <footer className="site-footer">
        <div className="container">
          <div className="logo">Boutique Élegance</div>
          <p dir="ltr">© 2026 Boutique Élegance. All rights reserved.</p>
        </div>
      </footer>
    </>
  );
}
