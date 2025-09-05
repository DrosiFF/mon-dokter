import Link from 'next/link'
import { Search, Calendar, Users, Shield } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Prenota il tuo medico
              <span className="text-blue-600"> online</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Trova e prenota appuntamenti con i migliori medici specialisti nella tua zona. 
              Semplice, veloce e sicuro.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/search"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Cerca un medico
              </Link>
              <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900">
                Scopri di più <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-blue-600">Perché scegliere MioDottore</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              La salute a portata di click
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Una piattaforma moderna e sicura per gestire i tuoi appuntamenti medici
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Search className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Ricerca avanzata
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Trova il medico giusto per te filtrando per specializzazione, zona e disponibilità.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Calendar className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Prenotazione istantanea
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Prenota il tuo appuntamento in pochi click, 24 ore su 24, 7 giorni su 7.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Users className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Medici verificati
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  Tutti i nostri medici sono verificati e abilitati all'esercizio della professione.
                </dd>
              </div>
              <div className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <Shield className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  Sicurezza garantita
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">
                  I tuoi dati sono protetti e la privacy è garantita secondo le normative GDPR.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Inizia subito a prenderti cura della tua salute
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-blue-100">
              Unisciti a migliaia di pazienti che hanno già scelto la nostra piattaforma
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/search"
                className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                Trova il tuo medico
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

