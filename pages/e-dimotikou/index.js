// pages/e-dimotikou/index.js
import Head from 'next/head';
import Link from 'next/link';

export default function EDimotikouMenu() {
  const modules = [
    { id: '1-klasma', label: '🍕 1. Κλάσμα', href: '/e-dimotikou/1-klasma' },
    { id: '2-isodinama', label: '🔄 2. Ισοδύναμα', href: '/e-dimotikou/2-isodinama' },
    { id: '3-aplopoiisi', label: '✂️ 3. Απλοποίηση', href: '/e-dimotikou/3-aplopoiisi' },
    { id: '4-anagogi', label: '🔍 4. Αναγωγή', href: '/e-dimotikou/4-anagogi' },
    { id: '5-pollaplasia', label: '🔢 5. Πολλαπλ.', href: '/e-dimotikou/5-pollaplasia' },
    { id: '6-ekp', label: '🎯 6. ΕΚΠ', href: '/e-dimotikou/6-ekp' },
    { id: '7-diairetes', label: '🛡️ 7. Διαιρέτες', href: '/e-dimotikou/7-diairetes' },
    { id: '8-mkd', label: '🏆 8. ΜΚΔ', href: '/e-dimotikou/8-mkd' },
    { id: '9-krit-diaret', label: '🔍 9. Κριτήρια', href: '/e-dimotikou/9-krit-diaret' },
    { id: '10-mesitimi', label: '📊 10. Μέση Τιμή', href: '/e-dimotikou/10-mesitimi' },
    { id: '11-pososta', label: '🏷️ 11. Ποσοστά', href: '/e-dimotikou/11-pososta' },
    { id: '12-gonies', label: '📐 12. Γωνίες', href: '/e-dimotikou/12-gonies' },
    { id: '13-trigona', label: '🔺 13. Τρίγωνα', href: '/e-dimotikou/13-trigona' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>Ε' Δημοτικού: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR - Άνοιγμα σε μεγάλο πλάτος */}
        <nav className="bg-white shadow-md w-full">
          <div className="max-w-[90%] 2xl:max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
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
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl md:text-5xl font-black mb-3 drop-shadow-sm flex items-center justify-center gap-3">
              🎒 Μαθηματικά Ε' Δημοτικού
            </h1>
            <p className="text-cyan-100 opacity-95 text-base md:text-lg font-medium tracking-wide">
              Επιλέξτε μια διαδραστική ενότητα για να ξεκινήσετε
            </p>
          </div>
        </header>

        {/* ΚΕΝΤΡΙΚΟ ΠΛΕΓΜΑ ΕΝΟΤΗΤΩΝ - Πλέον προσαρμόζεται σε 2K/4K αναλύσεις */}
        <main className="max-w-[90%] 2xl:max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-6">
            {modules.map((mod) => (
              <Link key={mod.id} href={mod.href} passHref legacyBehavior>
                <a className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:border-cyan-500 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-between group cursor-pointer min-h-[80px]">
                  <span className="font-bold text-gray-700 group-hover:text-cyan-600 text-base md:text-lg transition-colors">
                    {mod.label}
                  </span>
                  <span className="text-xl transform group-hover:translate-x-1 transition-transform opacity-70 group-hover:opacity-100">
                    🚀
                  </span>
                </a>
              </Link>
            ))}
          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm w-full mt-12 border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Με ❤️ για τους μαθητές της Ε' Δημοτικού.</p>
      </footer>
    </div>
  );
}
