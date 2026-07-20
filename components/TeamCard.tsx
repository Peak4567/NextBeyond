type TeamCardProps = {
  name: string;
  role: string;
};

export default function TeamCard({ name, role }: TeamCardProps) {
  return (
    <div className="group flex flex-col items-center rounded-2xl bg-white p-5 text-center shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-soft">
      <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-navy-900 to-navy-950 ring-4 ring-primary-50 transition-all group-hover:ring-primary-200">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="absolute inset-0 h-full w-full p-4 text-slate-500"
        >
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M5 19c1.2-3.2 4-5 7-5s5.8 1.8 7 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h4 className="mt-4 text-sm font-bold text-navy-900">{name}</h4>
      <p className="mt-1 text-xs font-medium text-primary-600">{role}</p>
    </div>
  );
}
