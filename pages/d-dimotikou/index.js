// pages/d-dimotikou/index.js
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DDimotikouMenu() {
  const modules = [
    { id: '1-arithmoi-eos-20-xiliades', label: '🍕 1. Αριθμοί έως 20.000', href: '/d-dimotikou/1-arithmoi-eos-20-xiliades' },
    { id: '2-poligona', label: '🍕 2. Πολύγωνα', href: '/d-dimotikou/2-poligona' },
    { id: '3-prosthesi-afairesi', label: '🍕 3. Πρόσθεση - Αφαίρεση Αντίστροφες', href: '/d-dimotikou/3-prosthesi-afairesi' },
    { id: '4-pollaplasiasmos', label: '🍕 4. Πολλαπλασιασμός', href: '/d-dimotikou/4-pollaplasiasmos' },
    { id: '5-diairesi', label: '🍕 5. Διαίρεση με 1 ψηφίο', href: '/d-dimotikou/5-diairesi' },
    { id: '6-dekadikoi', label: '✂️ 6. Δεκαδικά Κλάσματα', href: '/d-dimotikou/6-dekadikoi' },
    { id: '7-dekadikoi-sinexeia', label: '✂️ 7. Δεκαδικά Κλάσματα και Δεκαδικοί', href: '/d-dimotikou/7-dekadikoi-sinexeia' },
    { id: '8-mikos', label: '🔍 8. Μήκος', href: '/d-dimotikou/8-mikos' },
    { id: '9-baros', label: '🔢 9. Βάρος', href: '/d-dimotikou/9-baros' },
    { id: '10-epanalipsi-1', label: '🎯 10. Επαναληπτικές Ασκήσεις 1 - 9', href: '/d-dimotikou/10-epanalipsi-1' },
    { id: '11-dekadikoi-3-psifia', label: '✂️ 11. Δεκαδικοί με 3 ψηφία', href: '/d-dimotikou/11-dekadikoi-3-psifia' },
    { id: '12-diairesi-deka-ekato-xilia', label: '🎯 12. Διαίρεση με 10, 100, 1000', href: '/d-dimotikou/12-diairesi-deka-ekato-xilia' },
    { id: '13-paralliles', label: '🎯 13. Παράλληλες ευθείες', href: '/d-dimotikou/13-paralliles' },
    { id: '14-apostasi-simeiou-eutheia', label: '🎯 14. Απόσταση σημείου από ευθεία', href: '/d-dimotikou/14-apostasi-simeiou-eutheia' },
    { id: '15-embadon', label: '🎯 15. Εμβαδόν', href: '/d-dimotikou/15-embadon' },
    { id: '16-tetrapleura', label: '🎯 16. Τετράπλευρα', href: '/d-dimotikou/16-tetrapleura' },
    { id: '17-perimetros', label: '🎯 17. Περίμετρος', href: '/d-dimotikou/17-perimetros' },
    { id: '1-megaloi-arithmoi', label: '🍕 100. Μεγάλοι Αριθμοί', href: '/d-dimotikou/1-megaloi-arithmoi' },
    { id: '2-katheti-diairesi', label: '🔄 200. Κάθετη Διαίρεση', href: '/d-dimotikou/2-katheti-diairesi' }
        
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>Δ' Δημοτικού: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR - Fluid */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🏠 Αρχική
            </Link>
          </div>
        </nav>

        {/* HEADER */}
        <header className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-16 text-center shadow-inner w-full">
          <div className="w-[90%] mx-auto px-4">
            <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-black mb-3 drop-shadow-sm">
              🎒 Μαθηματικά Δ' Δημοτικού
            </h1>
            <p className="text-cyan-100 opacity-95 text-base md:text-lg 2xl:text-xl font-medium tracking-wide">
              Επιλέξτε μια διαδραστική ενότητα για να ξεκινήσετε
            </p>
          </div>
        </header>

        {/* GRID ΕΝΟΤΗΤΩΝ - 4 στήλες στα μεγάλα monitor, 5 στήλες στα 2K/4K */}
        <main className={`${LAYOUT.CONTAINER} py-12`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {modules.map((mod) => (
              <Link key={mod.id} href={mod.href} passHref legacyBehavior>
                <a className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-cyan-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group cursor-pointer min-h-[90px] 2xl:p-8">
                  <span className="font-bold text-gray-700 group-hover:text-cyan-600 text-base md:text-lg 2xl:text-xl transition-colors">
                    {mod.label}
                  </span>
                  <span className="text-xl 2xl:text-2xl transform group-hover:translate-x-1 transition-transform opacity-70 group-hover:opacity-100">
                    🚀
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </main>
      </div>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm w-full border-t border-gray-700">
        <p>© 2026 LearnMaths.gr. Με ❤️ για τους μαθητές της Δ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
