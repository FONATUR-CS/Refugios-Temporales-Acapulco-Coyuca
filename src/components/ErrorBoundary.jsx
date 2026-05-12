import { Component } from 'react'

/**
 * ErrorBoundary de clase: captura errores de render/mount en el árbol React
 * y muestra un mensaje institucional en lugar de una pantalla en blanco.
 */
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-slate-100 px-4 text-center">
          <div className="max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-md">
            <p className="text-sm font-bold uppercase tracking-wide text-red-600">
              Error de aplicación
            </p>
            <p className="mt-2 text-base font-bold text-slate-900">
              No se pudo cargar el geoportal
            </p>
            <p className="mt-1 text-sm text-slate-600">
              Recarga la página. Si el problema persiste, contacta al administrador.
            </p>
            {this.state.error?.message ? (
              <pre className="mt-3 overflow-auto rounded-lg bg-slate-100 px-3 py-2 text-left text-xs text-slate-700">
                {this.state.error.message}
              </pre>
            ) : null}
            <button
              className="mt-4 rounded-xl bg-institutional-700 px-4 py-2 text-sm font-extrabold text-white transition hover:bg-institutional-900"
              onClick={() => window.location.reload()}
              type="button"
            >
              Recargar
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
