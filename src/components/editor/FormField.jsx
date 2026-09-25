export function FormField({ label, children, className = '' }) {
  return (
    <label className={`form-field ${className}`}>
      <span>{label}</span>
      {children}
    </label>
  )
}

export function SectionIntro({ children }) {
  return <p className="section-intro">{children}</p>
}
