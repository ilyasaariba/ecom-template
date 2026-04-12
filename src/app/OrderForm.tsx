"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface OrderFormProps {
  price: number;
}

export default function OrderForm({ price }: OrderFormProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim()) return;

    setSubmitting(true);
    setError("");

    const { error: dbError } = await supabase.from("leads").insert({
      campaign_slug: "default",
      full_name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      quantity,
    });

    setSubmitting(false);

    if (dbError) {
      setError("حدث خطأ، يرجى المحاولة مجدداً.");
      return;
    }

    setSubmitted(true);
  };

  // ── Success State ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="checkout-box success-box">
        <div className="success-icon">🎉</div>
        <h3 className="success-title">تم استلام طلبك بنجاح!</h3>
        <p className="success-message">
          مرحباً <strong>{name}</strong>! شكراً لثقتك بنا.
        </p>
        <p className="success-sub">
          سيتصل بك فريقنا على الرقم <strong dir="ltr">{phone}</strong> خلال أقل من 24 ساعة لتأكيد الطلب والترتيب للتوصيل إلى <strong>{city}</strong>.
        </p>
        <div className="success-details">
          <span>🛍️ الكمية: <strong>{quantity} قطعة</strong></span>
          <span>💰 المبلغ الإجمالي: <strong>{price * quantity} درهم</strong></span>
          <span>🚚 الدفع يتم عند الاستلام</span>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <div className="checkout-box">
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">الاسم الكامل</label>
          <input
            className="form-input"
            type="text"
            id="name"
            placeholder="أدخلي اسمك الكامل"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="phone">رقم الهاتف للتواصل معك</label>
          <input
            className="form-input"
            type="tel"
            id="phone"
            placeholder="06XX-XXXXXX"
            dir="ltr"
            inputMode="numeric"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="city">المدينة</label>
          <input
            className="form-input"
            type="text"
            id="city"
            placeholder="مدينة التوصيل"
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        {/* Quantity Selector */}
        <div className="form-group">
          <label className="form-label" htmlFor="quantity">الكمية</label>
          <div className="quantity-selector">
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              aria-label="تقليل الكمية"
            >
              −
            </button>
            <span className="qty-value">{quantity}</span>
            <button
              type="button"
              className="qty-btn"
              onClick={() => setQuantity((q) => Math.min(9, q + 1))}
              aria-label="زيادة الكمية"
            >
              +
            </button>
          </div>
          {quantity > 1 && (
            <p className="qty-total">المجموع: <strong>{price * quantity} درهم</strong></p>
          )}
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? "⏳ جاري الإرسال..." : `أكدي الطلب الآن — ${price * quantity} درهم`}
        </button>

        <div className="secure-payment-icons">
          <span>🔒</span>
          <span style={{ fontSize: "0.9rem", alignSelf: "center" }}>
            الدفع يتم فقط بعد استلامك للمنتج
          </span>
        </div>
      </form>
    </div>
  );
}
