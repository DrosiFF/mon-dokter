import Link from 'next/link';

export default function SimpleNavigation({ currentPage }: { currentPage: 'search' | 'pharmacy' }) {
  return (
    <div className="mt-8 flex justify-center gap-4">
      {currentPage === 'search' ? (
        <>
          <span className="px-6 py-3 bg-white text-blue-600 rounded-full font-semibold flex items-center gap-2 shadow-lg cursor-default opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            Clinic
          </span>
          <Link
            href="/pharmacy"
            className="px-6 py-3 bg-emerald-500 text-white rounded-full font-semibold hover:bg-emerald-400 hover:shadow-lg flex items-center gap-2 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-transparent hover:border-emerald-300 no-underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
              <path d="M10 6h4"></path>
              <path d="M10 10h4"></path>
              <path d="M10 14h4"></path>
              <path d="M10 18h4"></path>
            </svg>
            Pharmacy →
          </Link>
        </>
      ) : (
        <>
          <Link
            href="/search"
            className="px-6 py-3 bg-white text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 hover:shadow-lg flex items-center gap-2 shadow-sm transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer border-2 border-transparent hover:border-emerald-200 no-underline"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <path d="M16 3.128a4 4 0 0 1 0 7.744"></path>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <circle cx="9" cy="7" r="4"></circle>
            </svg>
            Doctor →
          </Link>
          <span className="px-6 py-3 bg-emerald-500 text-white rounded-full font-semibold flex items-center gap-2 shadow-lg cursor-default opacity-90">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"></path>
              <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"></path>
              <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"></path>
              <path d="M10 6h4"></path>
              <path d="M10 10h4"></path>
              <path d="M10 14h4"></path>
              <path d="M10 18h4"></path>
            </svg>
            Pharmacy
          </span>
        </>
      )}
    </div>
  )
}
