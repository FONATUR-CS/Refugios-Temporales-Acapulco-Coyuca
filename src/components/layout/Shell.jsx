export function Shell({ map, onClosePanel, panel, panelExpanded }) {
  return (
    <main className="relative min-h-0 flex-1 overflow-hidden bg-slate-200">
      <section className="absolute inset-0 z-0 bg-white">
        {map}
      </section>
      
      {/* Overlay para cerrar el menú en mobile al tocar el mapa */}
      {panelExpanded && (
        <button
          aria-label="Cerrar menú"
          className="absolute inset-0 z-[490] bg-slate-900/20 backdrop-blur-[2px] md:hidden"
          onClick={onClosePanel}
          type="button"
        />
      )}

      <aside
        className={`absolute z-[500] overflow-hidden bg-white shadow-[0_20px_60px_rgba(15,23,42,0.2)] transition-all duration-300 ease-in-out
          /* Mobile: Menú lateral izquierdo */
          inset-y-0 left-0 w-[280px] -translate-x-full border-r border-gold-100/50 md:translate-x-0
          /* Desktop: Panel flotante original */
          md:inset-y-auto md:bottom-5 md:left-4 md:top-24 md:w-[360px] md:rounded-3xl md:border lg:left-5 lg:w-[390px]
          ${panelExpanded ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {panel}
      </aside>
    </main>
  )
}
