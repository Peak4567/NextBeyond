type CourseCardProps = {
  title: string;
  university: string;
  price: string;
  rating: string;
  students: string;
  description: string;
};

export default function CourseCard({
  title,
  university,
  price,
  rating,
  students,
  description,
}: CourseCardProps) {
  return (
    <div className="group rounded-xl border border-slate-100 bg-white p-6 shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-navy-900">{title}</h3>
          <p className="mt-1 text-xs text-slate-400">{university}</p>
        </div>
        <span className="rounded-xl bg-primary-50 px-3 py-1 text-xs font-semibold text-primary-600">
          {price}
        </span>
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-slate-400">
        <span className="flex items-center gap-1 text-amber-500">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.8L5.8 21l1.6-7-5.4-4.7 7.1-.6L12 2z" />
          </svg>
          {rating}
        </span>
        <span>•</span>
        <span>{students}</span>
      </div>

      <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>

      <button className="mt-5 w-full rounded-xl bg-primary-600 py-2.5 text-sm font-semibold text-white shadow-soft transition-all group-hover:bg-primary-700 group-hover:shadow-glow">
        ดูรายละเอียด
      </button>
    </div>
  );
}
