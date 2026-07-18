import { Button } from "@/components/ui/button";
import { ShoppingBag, Leaf, ShieldCheck, Zap, ArrowLeft } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FBFA] text-[#2D3A26] font-['Cairo']" dir="rtl">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-[#E2E8E1] px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#4A6B3E] rounded-full flex items-center justify-center">
              <Leaf className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-[#4A6B3E]">ELIXA</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#" className="hover:text-[#4A6B3E] transition-colors">الرئيسية</a>
            <a href="#products" className="hover:text-[#4A6B3E] transition-colors">منتجاتنا</a>
            <a href="#about" className="hover:text-[#4A6B3E] transition-colors">من نحن</a>
            <a href="#contact" className="hover:text-[#4A6B3E] transition-colors">اتصل بنا</a>
          </div>
          <Button className="bg-[#4A6B3E] hover:bg-[#3D5A32] text-white px-6 rounded-full flex items-center gap-2">
            <ShoppingBag className="w-4 h-4" />
            <span>تسوق الآن</span>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 relative z-10">
            <div className="inline-flex items-center gap-2 bg-[#E9F0E6] text-[#4A6B3E] px-4 py-2 rounded-full text-sm font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>منتجات طبيعية 100% من قلب المغرب</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight text-[#2D3A26]">
              اكتشف سر <span className="text-[#4A6B3E]">الطاقة والحيوية</span> مع إلكسير الطبيعة
            </h1>
            <p className="text-lg text-[#5D6B58] leading-relaxed max-w-lg">
              نقدم لكم أجود أنواع مربى الثوم والتين بزيت الزيتون البكر، مزيج مغربي أصيل يجمع بين الطعم الفاخر والفوائد الصحية المذهلة لتعزيز مناعتك وطاقتك اليومية.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button size="lg" className="bg-[#4A6B3E] hover:bg-[#3D5A32] text-white text-lg px-8 py-7 rounded-2xl shadow-xl shadow-[#4A6B3E]/20">
                اطلب الآن
              </Button>
              <Button size="lg" variant="outline" className="border-[#4A6B3E] text-[#4A6B3E] hover:bg-[#E9F0E6] text-lg px-8 py-7 rounded-2xl">
                تعرف على الفوائد
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-[#4A6B3E]/10 rounded-full blur-3xl"></div>
            <div className="relative bg-white p-8 rounded-[3rem] shadow-2xl border border-[#E2E8E1] transform rotate-3">
               <img 
                src="/manus-storage/hero-jar_f6fbda4f.png" 
                alt="Elixa Jar" 
                className="w-full h-auto rounded-2xl"
                onError={(e) => {
                  e.currentTarget.src = "https://placehold.co/600x600/4A6B3E/white?text=Elixa+Naturel";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">لماذا تختار منتجات إلكسير؟</h2>
            <p className="text-[#5D6B58] max-w-2xl mx-auto">نلتزم بأعلى معايير الجودة لضمان حصولكم على منتج صحي، طبيعي، ولذيذ في آن واحد.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Leaf, title: "مكونات طبيعية", desc: "نستخدم فقط الثوم الأحمر والتين المجفف وزيت الزيتون البكر الممتاز بدون أي مواد حافظة." },
              { icon: Zap, title: "طاقة فورية", desc: "مزيج غني بالعناصر الغذائية التي تمد جسمك بالطاقة والنشاط طوال اليوم." },
              { icon: ShieldCheck, title: "تعزيز المناعة", desc: "يعتبر الثوم وزيت الزيتون من أقوى المضادات الحيوية الطبيعية لتقوية جهاز المناعة." }
            ].map((feature, i) => (
              <div key={i} className="p-8 rounded-3xl bg-[#F9FBFA] border border-[#E2E8E1] hover:border-[#4A6B3E] transition-all group">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:bg-[#4A6B3E] transition-colors">
                  <feature.icon className="text-[#4A6B3E] w-7 h-7 group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-[#5D6B58] leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-[#4A6B3E] rounded-[3rem] p-12 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
          <div className="relative z-10 space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">ابدأ رحلتك نحو حياة صحية اليوم</h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto">انضم إلى آلاف العملاء الراضين الذين اكتشفوا فوائد مربى الثوم والتين من إلكسير.</p>
            <Button size="lg" className="bg-white text-[#4A6B3E] hover:bg-[#F9FBFA] text-lg px-10 py-7 rounded-2xl font-bold">
              اطلب منتجك الآن
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#2D3A26] text-white/60 py-12 px-6 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Leaf className="text-white w-6 h-6" />
            <span className="text-xl font-bold text-white">ELIXA NATUREL MAROC</span>
          </div>
          <p>© 2026 جميع الحقوق محفوظة لشركة إلكسير الطبيعة المغربية.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">فيسبوك</a>
            <a href="#" className="hover:text-white transition-colors">إنستغرام</a>
            <a href="#" className="hover:text-white transition-colors">واتساب</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
