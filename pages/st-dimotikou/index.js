// pages/st-dimotikou/index.js
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function STDimotikouMenu() {
  const modules = [
    { id: '1-fisikoi-arithmoi', label: '🍕 1. Φυσικοί Αριθμοί', href: '/st-dimotikou/1-fisikoi-arithmoi' },
    { id: '2-dekadikoi', label: '🍕 2. Δεκαδικοί Αριθμοί', href: '/st-dimotikou/2-dekadikoi' },
    { id: '3-arithmoi-dekadika-klasmata', label: '🍕 3. Δεκαδικοί Αριθμοί σε Δεκαδικά Κλάσματα', href: '/st-dimotikou/3-arithmoi-dekadika-klasmata' },
    { id: '4-sigkrisi-arithmon', label: '🍕 4. Σύγκριση Δεκαδικών Αριθμών', href: '/st-dimotikou/4-sigkrisi-arithmon' },
    { id: '5-prosthesi', label: '🍕 5. Πρόσθεση Φυσικών Αριθμών', href: '/st-dimotikou/5-prosthesi' },
    { id: '6-pollaplasiasmos', label: '🍕 6. Πολλαπλασιασμός Φυσικών Αριθμών', href: '/st-dimotikou/6-pollaplasiasmos' },
    { id: '7-pollaplasiasmos-dinameis-deka', label: '🍕 7. Πολλαπλασιασμός Δυνάμεις του 10', href: '/st-dimotikou/7-pollaplasiasmos-dinameis-deka' },
    { id: '8-diairesi', label: '🍕 8. Διαίρεση Φυσικών', href: '/st-dimotikou/8-diairesi' },
    { id: '9-diairesi-dinameis-deka', label: '🍕 9. Διαίρεση Δυνάμεις του 10', href: '/st-dimotikou/9-diairesi-dinameis-deka' },
    { id: '10-proteraiotita-prakseon', label: '🍕 10. Προτεραιότητα Πράξεων', href: '/st-dimotikou/10-proteraiotita-prakseon' },
    { id: '11-stroggilopoiisi', label: '🍕 11. Στρογγυλοποίηση Αριθμών', href: '/st-dimotikou/11-stroggilopoiisi' },
    { id: '12-diairetes', label: '🍕 12. Διαιρέτες Αριθμού', href: '/st-dimotikou/12-diairetes' },
    { id: '13-mkd', label: '🍕 13. Μέγιστος Κοινός Διαιρέτης (ΜΚΔ)', href: '/st-dimotikou/13-mkd' },
    { id: '14-kritiria-diairetotitas', label: '🍕 14. Κριτήρια Διαιρετότητας', href: '/st-dimotikou/14-kritiria-diairetotitas' },
    { id: '15-protoi', label: '🍕 15. Πρώτοι - Σύνθετοι Αριθμοί', href: '/st-dimotikou/15-protoi' },
    { id: '16-paragontopoiisi', label: '🍕 16. Παραγοντοποίηση Φυσικών Αριθμών', href: '/st-dimotikou/16-paragontopoiisi' },
    { id: '17-pollaplasia', label: '🍕 17. Πολλαπλάσια Αριθμού', href: '/st-dimotikou/17-pollaplasia' },
    { id: '18-ekp', label: '🍕 18. Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ)', href: '/st-dimotikou/18-ekp' },
    { id: '19-ekp-protoi', label: '🍕 19. ΕΚΠ - Αλγόριθμος Πρώτοι Αριθμοί', href: '/st-dimotikou/19-ekp-protoi' },
    { id: '20-dinameis', label: '🍕 20. Δύναμη φυσικού Αριθμού', href: '/st-dimotikou/20-dinameis' },
    { id: '21-dinameis-deka', label: '🍕 21. Δυνάμεις του 10', href: '/st-dimotikou/21-dinameis-deka' },
    { id: '22-klasma', label: '🍕 22. Κλάσματα', href: '/st-dimotikou/22-klasma' },
    { id: '23-klasma-se-dekadiko', label: '🍕 23. Κλάσματα σε Δεκαδικό', href: '/st-dimotikou/23-klasma-se-dekadiko' },
    { id: '24-isodinama-klasmata', label: '🍕 24. Ισοδύναμα Κλάσματα', href: '/st-dimotikou/24-isodinama-klasmata' },
    { id: '25-sigkrisi-klasmaton', label: '🍕 25. Σύγκριση Κλασμάτων', href: '/st-dimotikou/25-sigkrisi-klasmaton' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>ΣΤ' Δημοτικού: Μαθηματικά - LearnMaths.gr</title>
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
              🎒 Μαθηματικά ΣΤ' Δημοτικού
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
        <p>© 2026 LearnMaths.gr. Με ❤️ για τους μαθητές της ΣΤ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
