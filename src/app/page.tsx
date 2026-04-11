import { supabase } from "@/lib/supabase";
import Script from "next/script";

// Forces Next.js to fetch dynamically so updating the DB updates the site instantly
export const revalidate = 0;

export default async function HomePage() {
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("slug", "default")
    .single();

  const title = campaign?.product_title || "تألقي بجاذبية لا تُقاوم مع الفستان الأحمر الساحر";
  const subtitle = campaign?.product_subtitle || "صُمم خصيصاً ليبرز أنوثتك ويمنحك إطلالة تخطف الأنظار في مناسباتك الخاصة.";
  const price = campaign?.price || 229;
  const oldPrice = campaign?.old_price || 329;
  const scarcityText = campaign?.scarcity_text || "تبقّت 3 قطع فقط في المخزون!";
  const mainImage = campaign?.main_image_url || "/designe/440dc75aa99c7da60764681ced6c75e1.jpg";
  const snapPixelId = campaign?.snap_pixel_id || "";

  return (
    <>
      {/* SNAPCHAT PIXEL INJECTION */}
      {snapPixelId && (
        <Script id="snapchat-pixel" strategy="afterInteractive">
          {`
            (function(e,t,n){if(e.snaptr)return;var a=e.snaptr=function()
            {a.handleRequest?a.handleRequest.apply(a,arguments):a.queue.push(arguments)};
            a.queue=[];var s='script';r=t.createElement(s);r.async=!0;
            r.src=n;var u=t.getElementsByTagName(s)[0];
            u.parentNode.insertBefore(r,u);})(window,document,
            'https://sc-static.net/scevent.min.js');

            snaptr('init', '${snapPixelId}', {
              'user_email': '_INSERT_USER_EMAIL_'
            });

            snaptr('track', 'PAGE_VIEW');
          `}
        </Script>
      )}

      {/* Notification Bar */}
      <div className="top-bar">
        <span>🔥 عرض حصري لفترة محدودة - التوصيل متوفر لجميع مدن المغرب</span>
      </div>

      {/* Header / Nav */}
      <header className="navbar">
        <div className="container nav-content">
          <div className="logo">Boutique Élegance</div>
          <a href="#order" className="nav-cta">اشتري الآن</a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container hero-wrapper">
          {/* Text Content */}
          <div className="hero-content">
            <span className="badge">الأكثر مبيعاً 🌟</span>
            <h1>{title}</h1>
            <p className="hero-subtitle">{subtitle}</p>
            
            <div className="pricing-box">
              <div className="prices">
                <span className="price-new">{price} درهم</span>
                {oldPrice && <span className="price-old">{oldPrice} درهم</span>}
              </div>
              {oldPrice && (
                <span className="discount-label">وفري {oldPrice - price} درهم!</span>
              )}
            </div>

            <div className="scarcity-box">
              <span className="pulse-dot"></span>
              <p><strong>{scarcityText}</strong></p>
            </div>

            <a href="#order" className="btn-primary">
              أطلبي الآن وادفعي عند الاستلام
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline-block', marginRight: '8px' }}>
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            
            <div className="trust-icons">
              <div className="trust-item">🚚 توصيل سريع</div>
              <div className="trust-item">🔁 استبدال مضمون</div>
              <div className="trust-item">💵 الدفع عند الاستلام</div>
            </div>
          </div>

          {/* Image Content */}
          <div className="hero-image-box">
            <div className="image-backdrop"></div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={mainImage} alt={title} className="hero-image" />
          </div>
        </div>
      </section>

      {/* Value Proposition Section */}
      <section className="benefits">
        <div className="container">
          <h2 className="section-title">لماذا هذا المنتج هو الخيار الأمثل لك؟</h2>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="icon-box">✨</div>
              <h3>تصميم عصري وجذاب</h3>
              <p>قصة تبرز جمال قوامك بأسلوب أنيق وغير مبالغ فيه، مثالي للسهرات وحفلات العشاء.</p>
            </div>
            <div className="benefit-card">
              <div className="icon-box">👗</div>
              <h3>قماش عالي الجودة</h3>
              <p>مصنوع من خامات مريحة وفخمة تمنحك الثقة وحرية الحركة طوال الوقت.</p>
            </div>
            <div className="benefit-card">
              <div className="icon-box">🇲🇦</div>
              <h3>مفضل لدى المغربيات</h3>
              <p>تصميم يتناسب مع الذوق الرفيع للمرأة المغربية الباحثة عن التميز.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="reviews">
        <div className="container">
          <h2 className="section-title">آراء زبوناتنا الأنيقات</h2>
          <div className="reviews-wrapper">
            <div className="review-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"الفستان كيحمق فالحقيقة حسن من تصويرة، الثوب ديالو واعر وخياطته متقونة. شكرا بزاف!"</p>
              <span className="reviewer-name">- سناء، الدار البيضاء</span>
            </div>
            <div className="review-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"وصلني ليوم وقستو، جا معايا لاطاي هي هاديك ومريح بزاف فاللبسة. أكيد غنبقى نتعامل معاكم."</p>
              <span className="reviewer-name">- مريم، الرباط</span>
            </div>
            <div className="review-card">
              <div className="stars">⭐⭐⭐⭐⭐</div>
              <p>"روعة روعة! اللون دياله أحمر غزال كيبين الفورمة زوينة. التوصيل كان سريع."</p>
              <span className="reviewer-name">- فاطمة הזهراء، مراكش</span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA & Order Form placeholder */}
      <section id="order" className="final-cta">
        <div className="container cta-container">
          <h2>لا تفوتي الفرصة، احجزي قطعتك قبل النفاذ!</h2>
          <p>السعر سيعود إلى {oldPrice || 329} درهم قريباً جداً.</p>
          
          <form 
            className="order-form" 
            action={async (formData) => {
              "use server";
              // Action logic for handling lead orders 
            }}
          >
            <div className="form-group">
              <label htmlFor="name">الاسم الكامل</label>
              <input type="text" id="name" name="name" placeholder="أدخلي اسمك الكامل" required />
            </div>
            <div className="form-group">
              <label htmlFor="phone">رقم الهاتف</label>
              <input type="tel" id="phone" name="phone" placeholder="06XX-XXXXXX" dir="ltr" required />
            </div>
            <div className="form-group">
              <label htmlFor="city">المدينة</label>
              <input type="text" id="city" name="city" placeholder="مثال: الدار البيضاء" required />
            </div>
            
            <button type="submit" className="btn-primary w-100">أكد الطلب الآن ({price} درهم)</button>

            {snapPixelId && (
              <Script id="snap-purchase-pixel" strategy="lazyOnload">
                {`
                  document.querySelector('.order-form').addEventListener('submit', function() {
                      snaptr('track', 'PURCHASE', {
                        'currency': 'MAD',
                        'price': ${price}
                      });
                  });
                `}
              </Script>
            )}

            <p className="secure-text">🔒 معلوماتك آمنة. الدفع يتم فقط بعد استلامك للمنتج.</p>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer>
        <div className="container footer-content">
          <div className="logo">Boutique Élegance</div>
          <p>© 2026 جميع الحقوق محفوظة.</p>
        </div>
      </footer>
    </>
  );
}
