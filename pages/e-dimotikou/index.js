// pages/e-dimotikou/index.js
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function EDimotikouMenu() {
  const modules = [
    { id: '1-klasma', label: '🍕 1. Κλάσμα', href: '/e-dimotikou/1-klasma' },
    { id: '2-isodinama', label: '🔄 2. Ισοδύναμα Κλάσματα', href: '/e-dimotikou/2-isodinama' },
    { id: '3-aplopoiisi', label: '✂️ 3. Απλοποίηση Κλασμάτων', href: '/e-dimotikou/3-aplopoiisi' },
    { id: '4-anagogi', label: '🔍 4. Αναγωγή στην Κλασματική Μονάδα', href: '/e-dimotikou/4-anagogi' },
    { id: '5-pollaplasia', label: '🔢 5. Πολλαπλάσια Αριθμού', href: '/e-dimotikou/5-pollaplasia' },
    { id: '6-ekp', label: '🎯 6. ΕΚΠ', href: '/e-dimotikou/6-ekp' },
    { id: '7-diairetes', label: '🛡️ 7. Διαιρέτες Αριθμού', href: '/e-dimotikou/7-diairetes' },
    { id: '8-mkd', label: '🏆 8. ΜΚΔ', href: '/e-dimotikou/8-mkd' },
    { id: '9-krit-diaret', label: '🔍 9. Κριτήρια Διαιρετότητας', href: '/e-dimotikou/9-krit-diaret' },
    { id: '10-mesitimi', label: '📊 10. Μέση Τιμή', href: '/e-dimotikou/10-mesitimi' },
    { id: '11-pososta', label: '🏷️ 11. Ποσοστά', href: '/e-dimotikou/11-pososta' },
    { id: '12-gonies', label: '📐 12. Γωνίες', href: '/e-dimotikou/12-gonies' },
    { id: '13-trigona', label: '🔺 13. Τρίγωνα - Γωνίες', href: '/e-dimotikou/13-trigona' },
    { id: '14-trigona-pleures', label: '🔺 14. Τρίγωνα - Πλευρές', href: '/e-dimotikou/14-trigona-pleures' },
    { id: '15-kathetes-eutheies', label: '🔺 15. Κάθετες - Ευθείες', href: '/e-dimotikou/15-kathetes-eutheies' },
    { id: '16-apostasi-simeiou-eutheias', label: '🔺 16. Απόσταση Σημείου από Ευθεία', href: '/e-dimotikou/16-apostasi-simeiou-eutheia' },
    { id: '17-ipsos-trigonou', label: '🔺 17. Ύψος Τριγώνου', href: '/e-dimotikou/17-ipsos-trigonou' },
    { id: '18-aksonas-simmetrias', label: '🔺 18. Άξονας συμμετρίας', href: '/e-dimotikou/18-aksonas-simmetrias' },
    { id: '19-mikos-kiklou', label: '🔺 19. Μήκος Κύκλου', href: '/e-dimotikou/19-mikos-kiklou' },
    { id: '20-monades-mikous', label: '🔺 20. Μονάδες Μέτρησης Μήκους', href: '/e-dimotikou/20-monades-mikous' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>Ε' Δημοτικού: Μαθηματικά - LearnMaths.gr</title>
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
              🎒 Μαθηματικά Ε' Δημοτικού
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
        <p>© 2026 LearnMaths.gr. Με ❤️ για τους μαθητές της Ε' Δημοτικού.</p>
      </footer>
    </div>
  );
}
