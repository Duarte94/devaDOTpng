export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div
        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #52D0D0 0%, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full opacity-40 blur-[120px]"
        style={{ background: 'radial-gradient(circle, #7154D6 0%, transparent 70%)' }}
      />
      <div
        className="absolute top-1/3 right-1/4 w-1/3 h-1/3 rounded-full opacity-20 blur-[100px]"
        style={{ background: 'radial-gradient(circle, #52D0D0 0%, transparent 70%)' }}
      />
    </div>
  )
}
