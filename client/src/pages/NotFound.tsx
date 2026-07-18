import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FBFA] px-6 font-['Cairo']" dir="rtl">
      <div className="text-center space-y-8">
        <h1 className="text-9xl font-black text-[#4A6B3E]/20">404</h1>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-[#2D3A26]">الصفحة غير موجودة</h2>
          <p className="text-[#5D6B58]">عذراً، الرابط الذي تحاول الوصول إليه غير موجود أو تم نقله.</p>
        </div>
        <Link href="/">
          <Button className="bg-[#4A6B3E] hover:bg-[#3D5A32] text-white px-8 py-6 rounded-2xl flex items-center gap-2 mx-auto">
            <Home className="w-5 h-5" />
            <span>العودة للرئيسية</span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
