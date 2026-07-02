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
    { id: '11-pososta', label: '🏷️ 11. Ποσοστά', href: '/e-dimotikou/11-pososta' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      <Head>
        <title>Ε' Δημοτικού: Μαθηματικά - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      {/* NAVBAR */}
      <nav className="bg-white shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-black text-blue-600 tracking-tight">LearnMaths<span className="text-indigo-600">.gr</span></Link>
          <Link href="/" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-bold transition">🏠 Αρχική</Link>
        </div>
      </nav>

      {/* HEADER */}
      <header className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-12 text-center shadow-inner">
        <h1 className="text-4xl font-black mb-2">🎒 Μαθηματικά Ε' Δημοτικού</h1>
        <p className="text-cyan-100 opacity-90 font-medium">Επιλέξτε μια διαδραστική ενότητα για να ξεκινήσετε</p>
      </header>

      {/* ΚΕΝΤΡΙΚΟ ΠΛΕΓΜΑ ΕΝΟΤΗΤΩΝ */}
      <main className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {modules.map((mod) => (
            <Link key={mod.id} href={mod.href} passHref legacyBehavior>
              <a className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 hover:border-cyan-500 hover:shadow-md transition duration-300 flex items-center justify-between group cursor-pointer">
                <span className="font-bold text-gray-700 group-hover:text-cyan-600 transition">
                  {mod.label}
                </span>
                <span className="text-gray-400 group-hover:text-cyan-500 group-hover:translate-x-1 transition transform">
                  🚀
                </span>
              </a>
            </Link>
          ))}
        </div>
      </main>

      <footer className="bg-gray-800 text-gray-400 py-8 text-center text-sm mt-12">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για την Ε' Δημοτικού.</p>
      </footer>
    </div>
  );
}
