import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <span className="grid size-16 place-items-center rounded-2xl bg-accent-soft text-warn"><Icon name="alert" size={30} /></span>
      <p className="num mt-4 text-4xl font-extrabold">۴۰۴</p>
      <p className="mt-2 text-sm font-bold">صفحه‌ای که به دنبال آن هستید پیدا نشد</p>
      <p className="mt-1 max-w-sm text-xs leading-6 text-muted">ممکن است نشانی را اشتباه وارد کرده باشید یا دسترسی به این بخش برای نقش شما مجاز نباشد.</p>
      <Link to="/" className="btn btn-primary mt-4">بازگشت به داشبورد</Link>
    </div>
  );
}
