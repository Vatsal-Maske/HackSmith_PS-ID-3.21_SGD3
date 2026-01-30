export default function Card({ className = '', children }) {
  return (
    <div
      className={
        'rounded-2xl bg-white shadow-card ring-1 ring-slate-100/70 ' +
        'transition hover:-translate-y-0.5 hover:shadow-soft ' +
        className
      }
    >
      {children}
    </div>
  )
}
