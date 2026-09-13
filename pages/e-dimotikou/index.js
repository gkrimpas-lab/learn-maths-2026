// pages/e-dimotikou/index.js
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export const modules = [
  // --- ΕΝΟΤΗΤΑ 1: ΑΡΙΘΜΟΙ & ΚΛΑΣΜΑΤΑ (1 - 10) ---
  {
    id: '01-klasma',
    label: '🍕 1. Κλάσμα',
    href: '/e-dimotikou/01-klasma',
    image: '/images/e-dimotikou/01-klasma.svg',
    category: 'Κλάσματα',
    color: 'from-amber-500 to-orange-600'
  },
  {
    id: '02-isodinama',
    label: '🔄 2. Ισοδύναμα Κλάσματα',
    href: '/e-dimotikou/02-isodinama',
    image: '/images/e-dimotikou/02-isodinama.svg',
    category: 'Κλάσματα',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: '03-aplopoiisi',
    label: '✂️ 3. Απλοποίηση Κλασμάτων',
    href: '/e-dimotikou/03-aplopoiisi',
    image: '/images/e-dimotikou/03-aplopoiisi.svg',
    category: 'Κλάσματα',
    color: 'from-rose-500 to-pink-600'
  },
  {
    id: '04-anagogi',
    label: '🔍 4. Αναγωγή στην Κλασματική Μονάδα',
    href: '/e-dimotikou/04-anagogi',
    image: '/images/e-dimotikou/04-anagogi.svg',
    category: 'Κλάσματα',
    color: 'from-teal-500 to-emerald-600'
  },
  {
    id: '05-pollaplasia',
    label: '🔢 5. Πολλαπλάσια Αριθμού',
    href: '/e-dimotikou/05-pollaplasia',
    image: '/images/e-dimotikou/05-pollaplasia.svg',
    category: 'Αριθμητική',
    color: 'from-purple-500 to-indigo-600'
  },
  {
    id: '06-ekp',
    label: '🎯 6. ΕΚΠ',
    href: '/e-dimotikou/06-ekp',
    image: '/images/e-dimotikou/06-ekp.svg',
    category: 'Αριθμητική',
    color: 'from-red-500 to-rose-600'
  },
  {
    id: '07-diairetes',
    label: '🛡️ 7. Διαιρέτες Αριθμού',
    href: '/e-dimotikou/07-diairetes',
    image: '/images/e-dimotikou/07-diairetes.svg',
    category: 'Αριθμητική',
    color: 'from-sky-500 to-blue-600'
  },
  {
    id: '08-mkd',
    label: '🏆 8. ΜΚΔ',
    href: '/e-dimotikou/08-mkd',
    image: '/images/e-dimotikou/08-mkd.svg',
    category: 'Αριθμητική',
    color: 'from-amber-500 to-yellow-600'
  },
  {
    id: '09-krit-diaret',
    label: '✨ 9. Κριτήρια Διαιρετότητας',
    href: '/e-dimotikou/09-krit-diaret',
    image: '/images/e-dimotikou/09-krit-diaret.svg',
    category: 'Αριθμητική',
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: '10-epanalipsi-1',
    label: '📋 10. Επανάληψη (Κεφ. 1 - 9)',
    href: '/e-dimotikou/10-epanalipsi-1',
    image: '/images/e-dimotikou/10-epanalipsi-1.svg',
    category: 'Επανάληψη',
    color: 'from-slate-700 to-slate-900'
  },

  // --- ΕΝΟΤΗΤΑ 2: ΣΤΑΤΙΣΤΙΚΗ & ΠΟΣΟΣΤΑ (11 - 12) ---
  {
    id: '11-mesitimi',
    label: '📊 11. Μέση Τιμή',
    href: '/e-dimotikou/11-mesitimi',
    image: '/images/e-dimotikou/11-mesitimi.svg',
    category: 'Στατιστική',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: '12-pososta',
    label: '🏷️ 12. Ποσοστά',
    href: '/e-dimotikou/12-pososta',
    image: '/images/e-dimotikou/12-pososta.svg',
    category: 'Ποσοστά',
    color: 'from-violet-500 to-purple-600'
  },

  // --- ΕΝΟΤΗΤΑ 3: ΓΕΩΜΕΤΡΙΑ, ΣΧΗΜΑΤΑ & ΜΕΤΡΗΣΕΙΣ (13 - 30) ---
  {
    id: '13-gonies',
    label: '📐 13. Γωνίες',
    href: '/e-dimotikou/13-gonies',
    image: '/images/e-dimotikou/13-gonies.svg',
    category: 'Γεωμετρία',
    color: 'from-blue-600 to-indigo-700'
  },
  {
    id: '14-trigona',
    label: '🔺 14. Τρίγωνα - Γωνίες',
    href: '/e-dimotikou/14-trigona',
    image: '/images/e-dimotikou/14-trigona.svg',
    category: 'Γεωμετρία',
    color: 'from-indigo-600 to-violet-700'
  },
  {
    id: '15-trigona-pleures',
    label: '📐 15. Τρίγωνα - Πλευρές',
    href: '/e-dimotikou/15-trigona-pleures',
    image: '/images/e-dimotikou/15-trigona-pleures.svg',
    category: 'Γεωμετρία',
    color: 'from-teal-600 to-cyan-700'
  },
  {
    id: '16-kathetes-eutheies',
    label: '⟂ 16. Κάθετες - Ευθείες',
    href: '/e-dimotikou/16-kathetes-eutheies',
    image: '/images/e-dimotikou/16-kathetes-eutheies.svg',
    category: 'Γεωμετρία',
    color: 'from-sky-600 to-blue-700'
  },
  {
    id: '17-apostasi-simeiou-eutheias',
    label: '📏 17. Απόσταση Σημείου από Ευθεία',
    href: '/e-dimotikou/17-apostasi-simeiou-eutheia',
    image: '/images/e-dimotikou/17-apostasi-simeiou-eutheias.svg',
    category: 'Γεωμετρία',
    color: 'from-cyan-600 to-teal-700'
  },
  {
    id: '18-ipsos-trigonou',
    label: '📐 18. Ύψος Τριγώνου',
    href: '/e-dimotikou/18-ipsos-trigonou',
    image: '/images/e-dimotikou/18-ipsos-trigonou.svg',
    category: 'Γεωμετρία',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: '19-aksonas-simmetrias',
    label: '🪞 19. Άξονας Συμμετρίας',
    href: '/e-dimotikou/19-aksonas-simmetrias',
    image: '/images/e-dimotikou/19-aksonas-simmetrias.svg',
    category: 'Γεωμετρία',
    color: 'from-violet-600 to-purple-700'
  },
  {
    id: '20-mikos-kiklou',
    label: '⭕ 20. Μήκος Κύκλου',
    href: '/e-dimotikou/20-mikos-kiklou',
    image: '/images/e-dimotikou/20-mikos-kiklou.svg',
    category: 'Γεωμετρία',
    color: 'from-pink-600 to-rose-700'
  },
  {
    id: '21-monades-mikous',
    label: '📏 21. Μονάδες Μέτρησης Μήκους',
    href: '/e-dimotikou/21-monades-mikous',
    image: '/images/e-dimotikou/21-monades-mikous.svg',
    category: 'Μετρήσεις',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: '22-poligona',
    label: '⬡ 22. Πολύγωνα',
    href: '/e-dimotikou/22-poligona',
    image: '/images/e-dimotikou/22-poligona.svg',
    category: 'Γεωμετρία',
    color: 'from-indigo-600 to-blue-700'
  },
  {
    id: '23-kanonika-poligona',
    label: '🛑 23. Κανονικά Πολύγωνα',
    href: '/e-dimotikou/23-kanonika-poligona',
    image: '/images/e-dimotikou/23-kanonika-poligona.svg',
    category: 'Γεωμετρία',
    color: 'from-emerald-600 to-green-700'
  },
  {
    id: '24-perimetros',
    label: '🔲 24. Περίμετρος',
    href: '/e-dimotikou/24-perimetros',
    image: '/images/e-dimotikou/24-perimetros.svg',
    category: 'Γεωμετρία',
    color: 'from-blue-600 to-sky-700'
  },
  {
    id: '25-embado',
    label: '🟩 25. Εμβαδό',
    href: '/e-dimotikou/25-embado',
    image: '/images/e-dimotikou/25-embado.svg',
    category: 'Γεωμετρία',
    color: 'from-emerald-600 to-teal-700'
  },
  {
    id: '26-embado-sximaton',
    label: '📐 26. Εμβαδό Σχημάτων',
    href: '/e-dimotikou/26-embado-sximaton',
    image: '/images/e-dimotikou/26-embado-sximaton.svg',
    category: 'Γεωμετρία',
    color: 'from-amber-600 to-orange-700'
  },
  {
    id: '27-monades-epifaneias',
    label: '🗺️ 27. Μονάδες Μέτρησης Επιφάνειας',
    href: '/e-dimotikou/27-monades-epifaneias',
    image: '/images/e-dimotikou/27-monades-epifaneias.svg',
    category: 'Μετρήσεις',
    color: 'from-teal-600 to-emerald-700'
  },
  {
    id: '28-ennoia-ogkou',
    label: '📦 28. Όγκος',
    href: '/e-dimotikou/28-ennoia-ogkou',
    image: '/images/e-dimotikou/28-ennoia-ogkou.svg',
    category: 'Στερεομετρία',
    color: 'from-sky-600 to-blue-700'
  },
  {
    id: '29-ogkoi-sximaton',
    label: '🧊 29. Όγκοι Σχημάτων',
    href: '/e-dimotikou/29-ogkoi-sximaton',
    image: '/images/e-dimotikou/29-ogkoi-sximaton.svg',
    category: 'Στερεομετρία',
    color: 'from-indigo-600 to-violet-700'
  },
  {
    id: '30-epanalipsi-2',
    label: '🏆 30. Επανάληψη (Κεφ. 13 - 29)',
    href: '/e-dimotikou/30-epanalipsi-2',
    image: '/images/e-dimotikou/30-epanalipsi-2.svg',
    category: 'Επανάληψη',
    color: 'from-slate-800 to-indigo-950'
  }
];

export default function EDimotikouMenu() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>Ε' Δημοτικού: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
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

        {/* GRID ΕΝΟΤΗΤΩΝ ΜΕ ΕΙΚΟΝΕΣ ΚΑΙ BADGES */}
        <main className={`${LAYOUT.CONTAINER} py-12`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {modules.map((mod) => (
              <Link
                key={mod.id}
                href={mod.href}
                className="group relative bg-white rounded-3xl border border-slate-200 hover:border-indigo-500 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden transform hover:-translate-y-1"
              >
                {/* Εικόνα / Thumbnail Κεφαλαίου */}
                <div className="w-full h-36 bg-slate-50 border-b border-slate-100 flex items-center justify-center p-4 relative overflow-hidden group-hover:bg-indigo-50/30 transition">
                  <img
                    src={mod.image}
                    alt={mod.label}
                    className="max-h-full max-w-full object-contain drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                  <span className={`absolute top-3 left-3 text-[10px] font-black text-white px-2.5 py-0.5 rounded-full bg-gradient-to-r ${mod.color} shadow-xs`}>
                    {mod.category}
                  </span>
                </div>

                {/* Τίτλος & Βέλος */}
                <div className="p-4 sm:p-5 flex items-center justify-between mt-auto">
                  <h3 className="text-sm sm:text-base font-black text-slate-900 group-hover:text-indigo-600 transition">
                    {mod.label}
                  </h3>
                  <span className="text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform font-bold">
                    →
                  </span>
                </div>
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
