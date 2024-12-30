import { Header } from './components/layout/Header'
import { Navigation } from './components/layout/Navigation'

export function Layout({ children }) {
    return (
      <div className="min-h-screen w-full flex flex-col">
        <Header />
        <Navigation />
        <main className="flex-1 bg-neutral-100">
          {children}
        </main>
      </div>
    )
  }