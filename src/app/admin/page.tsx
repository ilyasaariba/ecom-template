"use client";

import { useEffect, useState, useRef } from "react";
import { supabase } from "@/lib/supabase";
import {
  Loader2, Save, Image as ImageIcon, Settings,
  CheckCircle2, Lock, Unlock, LogOut, UploadCloud,
  X, Users, Phone, MapPin, Clock, Trash2, Package
} from "lucide-react";

const SECRET_PASSWORD = "aariba29012007";

type LeadStatus = "new" | "confirmed" | "finished";

interface Lead {
  id: string;
  full_name: string;
  phone: string;
  city: string;
  status: LeadStatus;
  created_at: string;
  campaign_slug: string;
}

const COLUMNS: { key: LeadStatus; label: string; color: string; bg: string; border: string; icon: string }[] = [
  { key: "new",       label: "طلب جديد",      color: "text-blue-700",   bg: "bg-blue-50",   border: "border-blue-200",  icon: "🔵" },
  { key: "confirmed", label: "تم التأكيد",    color: "text-amber-700",  bg: "bg-amber-50",  border: "border-amber-200", icon: "🟡" },
  { key: "finished",  label: "بيع مكتمل",     color: "text-green-700",  bg: "bg-green-50",  border: "border-green-200", icon: "🟢" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "الآن";
  if (mins < 60) return `منذ ${mins} د`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `منذ ${hrs} س`;
  return `منذ ${Math.floor(hrs / 24)} يوم`;
}

// ─── LEAD CARD ────────────────────────────────────────────────────────────────
function LeadCard({
  lead,
  onDragStart,
  onDelete,
}: {
  lead: Lead;
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, lead)}
      className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 cursor-grab active:cursor-grabbing group transition-all hover:shadow-md hover:-translate-y-0.5 select-none"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 font-black text-sm shrink-0">
          {lead.full_name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-slate-800 text-sm truncate">{lead.full_name}</p>
          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
            <Clock className="w-3 h-3" />
            {timeAgo(lead.created_at)}
          </p>
        </div>
        <button
          onClick={() => onDelete(lead.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-slate-600 text-xs">
          <Phone className="w-3.5 h-3.5 text-slate-400" />
          <span dir="ltr" className="font-mono">{lead.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-slate-600 text-xs">
          <MapPin className="w-3.5 h-3.5 text-slate-400" />
          <span>{lead.city}</span>
        </div>
      </div>
    </div>
  );
}

// ─── KANBAN COLUMN ────────────────────────────────────────────────────────────
function KanbanColumn({
  col,
  leads,
  onDragStart,
  onDrop,
  onDragOver,
  onDelete,
}: {
  col: typeof COLUMNS[0];
  leads: Lead[];
  onDragStart: (e: React.DragEvent, lead: Lead) => void;
  onDrop: (e: React.DragEvent, status: LeadStatus) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDelete: (id: string) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  return (
    <div
      onDragOver={(e) => { onDragOver(e); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={(e) => { onDrop(e, col.key); setIsDragOver(false); }}
      className={`flex flex-col rounded-3xl border-2 transition-all duration-200 ${isDragOver ? "border-blue-400 bg-blue-50/60 scale-[1.01]" : `${col.border} ${col.bg}`}`}
    >
      {/* Column Header */}
      <div className={`flex items-center justify-between p-4 border-b ${col.border}`}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{col.icon}</span>
          <h3 className={`font-black text-sm ${col.color}`}>{col.label}</h3>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-black ${col.color} ${col.bg} border ${col.border}`}>
          {leads.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex-1 p-3 space-y-3 min-h-[200px]">
        {leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-10 text-slate-300">
            <Users className="w-8 h-8 mb-2" />
            <span className="text-xs">لا يوجد طلبات</span>
          </div>
        ) : (
          leads.map((lead) => (
            <LeadCard
              key={lead.id}
              lead={lead}
              onDragStart={onDragStart}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────
export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Product Fields
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [oldPrice, setOldPrice] = useState("");
  const [scarcity, setScarcity] = useState("");
  const [mainImageUrl, setMainImageUrl] = useState("");
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  // Leads
  const [leads, setLeads] = useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = useState(false);
  const draggedLead = useRef<Lead | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<"product" | "leads">("product");

  // ── Auth ────────────────────────────────────────────────────────────────────
  useEffect(() => {
    const auth = localStorage.getItem("admin_auth");
    if (auth === "true") {
      setIsAuthenticated(true);
      fetchProduct();
      fetchLeads();
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === SECRET_PASSWORD) {
      localStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      fetchProduct();
      fetchLeads();
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

  // ── Product Data ─────────────────────────────────────────────────────────────
  const fetchProduct = async () => {
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
        gallery_images: galleryImages,
      })
      .eq("slug", "default");
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  // ── Image Upload ─────────────────────────────────────────────────────────────
  const uploadFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    setUploadingImage(true);
    const { error } = await supabase.storage.from("product-images").upload(fileName, file);
    setUploadingImage(false);
    if (error) { alert("خطأ في رفع الصورة: " + error.message); return null; }
    return supabase.storage.from("product-images").getPublicUrl(fileName).data.publicUrl;
  };

  const handleMainImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const url = await uploadFile(e.target.files[0]);
    if (url) setMainImageUrl(url);
  };

  const handleGalleryImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    for (const file of Array.from(e.target.files)) {
      const url = await uploadFile(file);
      if (url) setGalleryImages((prev) => [...prev, url]);
    }
  };

  // ── Leads ─────────────────────────────────────────────────────────────────────
  const fetchLeads = async () => {
    setLeadsLoading(true);
    const { data } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setLeads(data as Lead[]);
    setLeadsLoading(false);
  };

  const handleDragStart = (e: React.DragEvent, lead: Lead) => {
    draggedLead.current = lead;
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = async (e: React.DragEvent, status: LeadStatus) => {
    e.preventDefault();
    const lead = draggedLead.current;
    if (!lead || lead.status === status) return;

    // Optimistic update
    setLeads((prev) =>
      prev.map((l) => (l.id === lead.id ? { ...l, status } : l))
    );
    await supabase.from("leads").update({ status }).eq("id", lead.id);
    draggedLead.current = null;
  };

  const handleDeleteLead = async (id: string) => {
    setLeads((prev) => prev.filter((l) => l.id !== id));
    await supabase.from("leads").delete().eq("id", id);
  };

  // ── Render: Not loaded ───────────────────────────────────────────────────────
  if (isAuthenticated === null) return null;

  // ── Render: Login ────────────────────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-6 bg-gradient-to-br from-slate-100 to-slate-200">
        <div className="w-full max-w-sm bg-white rounded-3xl p-10 shadow-2xl border border-slate-100">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-black text-center text-slate-900 mb-1">لوحة التحكم</h1>
          <p className="text-center text-slate-400 text-sm mb-8">أدخل كلمة المرور للوصول</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              required
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              placeholder="كلمة المرور..."
              className={`w-full px-5 py-4 border-2 ${loginError ? "border-red-400 bg-red-50" : "border-slate-200 focus:border-slate-900"} rounded-2xl text-slate-900 placeholder-slate-400 outline-none transition-all font-mono`}
            />
            {loginError && <p className="text-red-500 text-xs text-center font-bold">كلمة المرور خاطئة</p>}
            <button
              type="submit"
              className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2"
            >
              <Unlock className="w-5 h-5" />
              دخول
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ── Render: Loading ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 animate-spin text-slate-400" />
      </div>
    );
  }

  // ── Render: Dashboard ─────────────────────────────────────────────────────────
  const leadsBy = (status: LeadStatus) => leads.filter((l) => l.status === status);

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ── Top Bar ── */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-black text-slate-900 text-base leading-none">لوحة التحكم</h1>
              <p className="text-slate-400 text-xs mt-0.5">Boutique Élegance</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all font-bold text-sm"
          >
            <LogOut className="w-4 h-4" />
            خروج
          </button>
        </div>
      </header>

      {/* ── Tab Navigation ── */}
      <div className="max-w-screen-xl mx-auto px-6 pt-6">
        <div className="flex gap-2 bg-white rounded-2xl p-1.5 border border-slate-200 w-fit shadow-sm">
          <button
            onClick={() => setActiveTab("product")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "product" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-800"}`}
          >
            <Package className="w-4 h-4" />
            المنتج
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${activeTab === "leads" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-800"}`}
          >
            <Users className="w-4 h-4" />
            الطلبات
            {leads.filter(l => l.status === "new").length > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-black">
                {leads.filter(l => l.status === "new").length}
              </span>
            )}
          </button>
        </div>
      </div>

      <main className="max-w-screen-xl mx-auto px-6 py-6">

        {/* ════════════════ PRODUCT TAB ════════════════ */}
        {activeTab === "product" && (
          <form onSubmit={handleSave} className="space-y-6">

            {/* Product Info */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <Settings className="w-5 h-5 text-blue-500" />
                  بيانات المنتج
                </h2>
                <p className="text-slate-400 text-sm mt-1">هذه المعلومات ستظهر مباشرة على صفحة المتجر</p>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">اسم المنتج (العنوان الرئيسي)</label>
                  <input
                    type="text" required value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: عطر نسائي فاخر..."
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-900 outline-none transition-all text-base"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">الوصف المختصر</label>
                  <textarea
                    value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2}
                    placeholder="وصف مختصر يظهر أسفل العنوان..."
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-900 outline-none transition-all resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">السعر الحالي (درهم)</label>
                  <input
                    type="number" required value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="مثال: 199"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-900 outline-none transition-all font-black text-xl"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">السعر القديم (درهم) — اختياري</label>
                  <input
                    type="number" value={oldPrice}
                    onChange={(e) => setOldPrice(e.target.value)}
                    placeholder="مثال: 350"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-900 outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">نص الندرة (اختياري)</label>
                  <input
                    type="text" value={scarcity}
                    onChange={(e) => setScarcity(e.target.value)}
                    placeholder="مثال: تبقت 3 قطع فقط في المخزن!"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl text-slate-900 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
              {uploadingImage && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-3xl">
                  <Loader2 className="w-10 h-10 animate-spin text-blue-500 mb-3" />
                  <span className="font-bold text-slate-700">جاري رفع الصورة...</span>
                </div>
              )}
              <div className="p-6 border-b border-slate-100">
                <h2 className="font-black text-slate-900 text-lg flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-purple-500" />
                  صور المنتج
                </h2>
              </div>
              <div className="p-6 space-y-6">
                {/* Main Image */}
                <div>
                  <p className="text-sm font-bold text-slate-700 mb-3">الصورة الرئيسية</p>
                  <div className="flex flex-col sm:flex-row gap-4 items-start">
                    {mainImageUrl ? (
                      <div className="relative w-32 h-32 rounded-2xl overflow-hidden border border-slate-200 shadow group shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={mainImageUrl} className="w-full h-full object-cover" alt="Main" />
                        <button
                          type="button" onClick={() => setMainImageUrl("")}
                          className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-32 h-32 rounded-2xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-200 shrink-0">
                        <ImageIcon className="w-8 h-8 text-slate-300" />
                      </div>
                    )}
                    <label className="cursor-pointer flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-sm">
                      <UploadCloud className="w-5 h-5" />
                      اختر صورة
                      <input type="file" accept="image/*" className="hidden" onChange={handleMainImage} />
                    </label>
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-bold text-slate-700">معرض الصور الإضافية</p>
                    <label className="cursor-pointer flex items-center gap-2 bg-slate-900 hover:bg-black text-white text-xs font-bold py-2 px-4 rounded-xl transition-colors">
                      <UploadCloud className="w-4 h-4" />
                      إضافة
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleGalleryImages} />
                    </label>
                  </div>
                  {galleryImages.length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {galleryImages.map((url, idx) => (
                        <div key={idx} className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 shadow group">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={url} className="w-full h-full object-cover" alt="Gallery" />
                          <button
                            type="button"
                            onClick={() => setGalleryImages((prev) => prev.filter((_, i) => i !== idx))}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-8 flex flex-col items-center justify-center text-slate-300 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                      <ImageIcon className="w-8 h-8 mb-2" />
                      <span className="text-sm">لا توجد صور إضافية</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Save */}
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                type="submit" disabled={saving}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-black text-white font-black px-10 py-4 rounded-2xl transition-all shadow-lg hover:shadow-xl active:scale-95 disabled:opacity-60"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {saving ? "جاري الحفظ..." : "حفظ وتطبيق التغييرات"}
              </button>
              {saved && (
                <span className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 px-5 py-3 rounded-2xl font-bold text-sm">
                  <CheckCircle2 className="w-5 h-5" />
                  تم الحفظ بنجاح!
                </span>
              )}
            </div>
          </form>
        )}

        {/* ════════════════ LEADS TAB ════════════════ */}
        {activeTab === "leads" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-black text-slate-900 text-xl">إدارة الطلبات</h2>
                <p className="text-slate-400 text-sm mt-0.5">اسحب البطاقات بين الأعمدة لتحديث حالة الطلب</p>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
                <Users className="w-4 h-4" />
                <span className="font-bold">{leads.length}</span>
                <span>مجموع الطلبات</span>
              </div>
            </div>

            {leadsLoading ? (
              <div className="flex justify-center py-20">
                <Loader2 className="w-10 h-10 animate-spin text-slate-300" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {COLUMNS.map((col) => (
                  <KanbanColumn
                    key={col.key}
                    col={col}
                    leads={leadsBy(col.key)}
                    onDragStart={handleDragStart}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDelete={handleDeleteLead}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
