import { useState } from "react";
import { Badge, Button, Card, CardHeader, PageHeader } from "../components/ui";
import { Icon } from "../components/Icon";
import { useToast } from "../components/Toast";
import { useMockQuery } from "../lib/demo";
import { jalaliTime } from "../lib/format";

const sample = `{
  "endpoint": "/api/v1/satba/projects",
  "synced_at": "1405-08-13T09:20:00+03:30",
  "records": [
    {
      "code": "P-1403-001",
      "capacity_kw": 5,
      "stage": "execution",
      "progress": 62,
      "paid_amount": 218400000
    }
  ]
}`;

export default function SatbaApi() {
  const { toast } = useToast();
  const [syncing, setSyncing] = useState(false);
  const q = useMockQuery(() => ({ lastSync: new Date(Date.now() - 1000 * 60 * 12).toISOString(), version: "v1.4.2" }), []);

  const sync = () => {
    setSyncing(true);
    window.setTimeout(() => {
      setSyncing(false);
      toast("همگام‌سازی آزمایشی انجام شد (دمو).");
    }, 1200);
  };

  return (
    <div>
      <PageHeader title="اتصال API" subtitle="وضعیت اتصال سکو به سامانه ساتبا (نمایشی)" actions={<Badge tone="info" dot>محیط دمو</Badge>} />

      <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-4">
          <Card>
            <CardHeader title="وضعیت اتصال" subtitle="در نسخه دمو، داده‌ها از فایل‌های Mock خوانده می‌شوند" icon="external" action={<Badge tone="success" dot>متصل</Badge>} />
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {[
                ["آدرس سرویس", "https://api.satba.gov.ir/solar/v1"],
                ["نوع احراز هویت", "API Key + mTLS"],
                ["آخرین همگام‌سازی", q.data ? jalaliTime(q.data.lastSync) : "—"],
                ["نسخه سرویس", q.data?.version ?? "—"],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl border border-line-soft p-3">
                  <p className="text-[0.65rem] text-muted">{k}</p>
                  <p className="mt-0.5 truncate text-xs font-bold">{v}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-line-soft px-4 py-3">
              <Button variant="accent" icon="refresh" onClick={sync} disabled={syncing}>{syncing ? "در حال همگام‌سازی…" : "همگام‌سازی دستی"}</Button>
              <Button variant="ghost" icon="download">دریافت آخرین بسته داده</Button>
            </div>
          </Card>

          <Card>
            <CardHeader title="دامنه داده‌های ارسالی" subtitle="فقط داده‌های نظارتی، بدون اطلاعات هویتی کامل" icon="shield" />
            <ul className="divide-y divide-line-soft text-xs">
              {[
                ["پروژه‌ها و ظرفیت", "کد پروژه، استان، ظرفیت، مرحله، پیشرفت"],
                ["مدارک و آزمون‌ها", "وضعیت تأیید، نوع مدرک، تاریخ"],
                ["وضعیت مالی", "مبلغ قرارداد، مجموع پرداخت، اقساط معوق"],
              ].map(([t, d]) => (
                <li key={t} className="flex items-start justify-between gap-3 px-4 py-3">
                  <div>
                    <p className="font-bold">{t}</p>
                    <p className="text-[0.65rem] text-muted">{d}</p>
                  </div>
                  <Icon name="checkCircle" size={16} className="mt-0.5 shrink-0 text-success" />
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <aside className="space-y-3">
          <Card className="p-4">
            <p className="flex items-center gap-1.5 text-xs font-bold"><Icon name="file" size={14} /> نمونه پاسخ سرویس</p>
            <pre dir="ltr" className="mt-2 max-h-64 overflow-auto rounded-lg bg-[#0e1723] p-3 text-left text-[0.65rem] leading-5 text-[#d5e3f0]">{sample}</pre>
          </Card>
          <Card className="p-4">
            <p className="text-xs font-bold">محدودیت‌ها</p>
            <ul className="mt-1.5 space-y-1 text-[0.7rem] leading-6 text-muted">
              <li>• حداکثر ۶۰ درخواست در دقیقه</li>
              <li>• بازه همگام‌سازی حداقل ۱۵ دقیقه</li>
              <li>• دسترسی فقط خواندنی برای ساتبا</li>
            </ul>
          </Card>
        </aside>
      </div>
    </div>
  );
}
