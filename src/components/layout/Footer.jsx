export function Footer() {
  return (
    <footer className="z-20 shrink-0 border-t-2 border-gold-500 shadow-[0_-10px_30px_rgba(0,0,0,0.15)]">
      <div 
        className="flex w-full items-center justify-center overflow-hidden px-4"
        style={{
          background: '#103f34',
          height: 'clamp(60px, 10vh, 100px)'
        }}
      >
        <img 
          alt="Footer institucional" 
          className="h-full w-auto max-w-full object-contain py-2" 
          src="/footer_refugios.webp" 
        />
      </div>
    </footer>
  )
}
