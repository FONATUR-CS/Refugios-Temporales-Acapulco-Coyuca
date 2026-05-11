export function Shell({ map, panel, panelExpanded }) {
  return (
    <main className="relative min-h-[calc(100vh-126px)] overflow-hidden bg-slate-200 lg:min-h-[calc(100vh-132px)]">
      <section className="absolute inset-0 z-0 bg-white">
        {map}
      </section>
      <aside
        className={`absolute inset-x-3 bottom-3 z-[500] overflow-hidden rounded-3xl border border-white/70 bg-white/95 shadow-panel backdrop-blur transition-[max-height] duration-300 ease-out md:inset-x-auto md:bottom-5 md:left-4 md:top-24 md:max-h-none md:w-[360px] lg:left-5 lg:w-[380px] ${
          panelExpanded ? 'max-h-[42vh]' : 'max-h-[92px]'
        }`}
      >
        {panel}
      </aside>
    </main>
  )
}
