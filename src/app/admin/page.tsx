"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2, Save, Image as ImageIcon, Settings, CheckCircle2, Lock, Unlock, LogOut, UploadCloud, X } from "lucide-react";

const SECRET_PASSWORD = "aariba29012007";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [scarcity, setScarcity] = useState("");
  
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchData();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === SECRET_PASSWORD) {
      localStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      fetchData();
    } else {
      setLoginError(true);
      setTimeout(() => setLoginError(false), 2000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
    setPasswordInput("");
  };

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("campaigns")
      .select("*")
      .eq("slug", "default")
      .single();
    if (data) {
      setTitle(data.product_title || "");
      setSubtitle(data.product_subtitle || "");
      setPrice(data.price?.toString() || "");
      setOldPrice(data.old_price?.toString() || "");
      setScarcity(data.scarcity_text || "");
      setMainImageUrl(data.main_image_url || "");
      setGalleryImages(data.gallery_images || []);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await supabase
      .from("campaigns")
      .update({
        product_title: title,
        product_subtitle: subtitle,
        price: parseFloat(price) || 0,
        old_price: oldPrice ? parseFloat(oldPrice) : null,
        scarcity_text: scarcity,
        main_image_url: mainImageUrl,
        gallery_images: galleryImages
      })
      .eq("slug", "default");

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const uploadFileToSupabase = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    setUploadingImage(true);
    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(fileName, file);

    setUploadingImage(false);
    
    if (uploadError) {
      alert("حدث خطأ أثناء رفع الصورة: " + uploadError.message);
      return null;
    }

    const { data } = supabase.storage.from("product-images").getPublicUrl(fileName);
    return data.publicUrl;
  };

  const handleMainImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const url = await uploadFileToSupabase(file);
    if (url) setMainImageUrl(url);
  };

  const handleGalleryImagesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      const url = await uploadFileToSupabase(file);
      if (url) {
        setGalleryImages(prev => [...prev, url]);
      }
    }
  };

  const removeGalleryImage = (indexToRemove: number) => {
    setGalleryImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };


  // ─── LOGIN SCREEN ────────────────────────────────────────────────────────
  if (isAuthenticated === false) {
    return (
      <div 
        className="min-h-screen w-full flex items-center justify-center p-6"
        style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
      >
        <div className="w-full max-w-sm bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-10 shadow-[0_20px_60px_rgba(0,0,0,0.1)]">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-100">
              <Lock className="w-8 h-8 text-slate-800" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-800 mb-2">تسجيل الدخول</h1>
          <p className="text-center text-slate-500 text-sm mb-8 font-medium">أدخل كلمة المرور للوصول إلى التحكم</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="كلمة المرور..."
                className={`w-full px-5 py-4 bg-white/50 border ${loginError ? 'border-red-400' : 'border-slate-200 focus:border-blue-500'} rounded-xl text-slate-800 placeholder-slate-400 outline-none transition-all focus:ring-4 focus:ring-blue-500/10 font-mono`}
              />
              {loginError && <p className="text-red-500 text-xs mt-2 text-center font-bold">عذراً، كلمة المرور خاطئة</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-black text-white font-bold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Unlock className="w-5 h-5" />
              تأكيد الدخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ─── DASHBOARD SCREEN ───────────────────────────────────────────────────
  if (loading || isAuthenticated === null) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 animate-spin text-slate-800 mb-4" />
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-4 md:p-8"
      style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}
    >
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-2xl border border-white rounded-[2rem] shadow-[0_30px_60px_rgba(0,0,0,0.12)] p-6 md:p-10 my-auto max-h-[95vh] overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 pb-6 border-b border-slate-200">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
              لوحة التحكم
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full border border-green-200 shadow-sm font-bold">فعّال</span>
            </h1>
            <p className="text-slate-500 mt-2 text-sm font-medium">إدارة صفحة الهبوط والوسائط (تم دمج Pixel تلقائياً)</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center justify-center md:justify-start gap-2 px-5 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 transition-all font-bold text-sm shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          
          {/* SECTION 1: Product Data */}
          <div className="bg-white/50 border border-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shadow-sm">
                <Settings className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">بيانات المنتج</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">العنوان الرئيسي</label>
                <input
                  type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-slate-800 outline-none transition-all shadow-sm focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">الوصف الفرعي</label>
                <textarea
                  value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-slate-800 outline-none transition-all shadow-sm focus:ring-4 focus:ring-blue-500/10 resize-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">السعر الحالي</label>
                <div className="relative">
                  <input
                    type="number" required value={price} onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-3.5 pl-14 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-slate-800 outline-none transition-all shadow-sm font-bold text-lg focus:ring-4 focus:ring-blue-500/10"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">MAD</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">السعر القديم (مُخفّض)</label>
                <div className="relative">
                  <input
                    type="number" value={oldPrice} onChange={(e) => setOldPrice(e.target.value)}
                    className="w-full px-4 py-3.5 pl-14 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-slate-800 outline-none transition-all shadow-sm font-bold focus:ring-4 focus:ring-blue-500/10"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm line-through">MAD</span>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-700 mb-2">نص الندرة (مثال: تبقت 3 قطع!)</label>
                <input
                  type="text" value={scarcity} onChange={(e) => setScarcity(e.target.value)}
                  className="w-full px-4 py-3.5 bg-white border border-slate-200 focus:border-blue-500 rounded-xl text-slate-800 outline-none transition-all shadow-sm focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Media Management */}
          <div className="bg-white/50 border border-white rounded-3xl p-6 shadow-sm relative">
            {uploadingImage && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-3xl">
                <Loader2 className="w-10 h-10 animate-spin text-purple-600 mb-3" />
                <span className="font-bold text-slate-800">جاري رفع الصورة...</span>
              </div>
            )}
            
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center shadow-sm">
                <ImageIcon className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-800">الصور والوسائط</h2>
            </div>
            
            <div className="space-y-8">
              {/* Main Image Upload */}
              <div className="p-5 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                <label className="block text-sm font-black text-slate-800 mb-3">الصورة الرئيسية (Hero Image)</label>
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {mainImageUrl ? (
                    <div className="shrink-0 w-32 h-32 rounded-xl overflow-hidden shadow-md border-2 border-white relative group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mainImageUrl} className="w-full h-full object-cover" alt="Main" />
                      <button type="button" onClick={() => setMainImageUrl("")} className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="shrink-0 w-32 h-32 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-200">
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    </div>
                  )}
                  
                  <div className="flex-1 w-full">
                    <label className="cursor-pointer flex items-center justify-center gap-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold py-3 px-6 rounded-xl border border-purple-200 transition-colors w-full sm:w-auto">
                      <UploadCloud className="w-5 h-5" />
                      اختر صورة من جهازك
                      <input type="file" accept="image/*" className="hidden" onChange={handleMainImageChange} />
                    </label>
                    <p className="text-xs text-slate-500 mt-3">ملفات الصور المدعومة: JPG, PNG, WEBP. الحجم الأقصى 5MB.</p>
                  </div>
                </div>
              </div>

              {/* Gallery Images Upload */}
              <div className="p-5 bg-white border-2 border-dashed border-slate-200 rounded-2xl">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-black text-slate-800">معرض الصور (تظهر أسفل الصورة الرئيسية)</label>
                  <label className="cursor-pointer flex items-center gap-2 bg-slate-800 hover:bg-black text-white text-xs font-bold py-2 px-4 rounded-lg transition-colors shadow-sm">
                    <UploadCloud className="w-4 h-4" />
                    إضافة صور إضافية
                    <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryImagesChange} />
                  </label>
                </div>
                
                {galleryImages.length > 0 ? (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {galleryImages.map((url, idx) => (
                      <div key={idx} className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-white shadow-md group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} className="w-full h-full object-cover" alt="Gallery" />
                        <button type="button" onClick={() => removeGalleryImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md">
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-6 flex flex-col items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-slate-100">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <span className="text-sm">لا توجد صور إضافية حالياً</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-800 hover:bg-black text-white font-black px-10 py-4 rounded-xl transition-all shadow-xl hover:shadow-2xl active:scale-95 disabled:opacity-70 disabled:hover:scale-100"
            >
              {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
              {saving ? "جاري التحديث..." : "حفظ المعلومات والتطبيق مباشرة"}
            </button>

            {saved && (
              <span className="text-green-600 text-sm font-black flex items-center gap-2 animate-in fade-in zoom-in bg-green-50 px-4 py-3 rounded-xl border border-green-200">
                <CheckCircle2 className="w-5 h-5" />
                تم التحديث بنجاح!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
