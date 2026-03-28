const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11']

export default function SalesDynamic() {
  return (
    <div className="bg-white p-8 rounded-2xl card-shadow">
      <div className="flex justify-between items-center mb-8">
        <h3 className="section-label">Sales Dynamic</h3>
        <div className="flex gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-crimson"></div>
            <span className="section-label">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-300"></div>
            <span className="section-label">Target</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-zinc-200"></div>
            <span className="section-label">Past</span>
          </div>
        </div>
      </div>
      <div className="relative h-56 w-full">
        <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1000 200">
          <line stroke="#F9FAFB" strokeWidth="1" x1="0" x2="1000" y1="50" y2="50" />
          <line stroke="#F9FAFB" strokeWidth="1" x1="0" x2="1000" y1="100" y2="100" />
          <line stroke="#F9FAFB" strokeWidth="1" x1="0" x2="1000" y1="150" y2="150" />
          <path d="M0 160 Q 250 140, 500 100 T 1000 40" fill="none" stroke="#6fdc98" strokeDasharray="8,4" strokeWidth="3" />
          <path d="M0 180 Q 250 160, 500 150 T 1000 140" fill="none" stroke="#e2e2e2" strokeWidth="2" />
          <path d="M0 170 Q 150 150, 300 100 T 600 80 T 1000 20" fill="none" stroke="#E8175D" strokeWidth="4" />
          <circle cx="300" cy="100" fill="#E8175D" r="6" />
          <circle cx="600" cy="80" fill="#E8175D" r="6" />
        </svg>
        <div className="flex justify-between mt-6 section-label">
          {weeks.map((w) => <span key={w}>{w}</span>)}
        </div>
      </div>
    </div>
  )
}
