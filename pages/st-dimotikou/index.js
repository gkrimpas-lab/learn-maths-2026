// pages/st-dimotikou/index.js
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function STDimotikouMenu() {
  const modules = [
  { id: '01-fysikoi', label: '🔢 1. Φυσικοί αριθμοί', href: '/st-dimotikou/01-fysikoi' },
  { id: '02-dekadikoi', label: '🪙 2. Δεκαδικοί αριθμοί', href: '/st-dimotikou/02-dekadikoi' },
  { id: '03-arithmoi-dekadika-klasmata', label: '🔄 3. Μετατροπή δεκαδικών σε δεκαδικά κλάσματα', href: '/st-dimotikou/03-arithmoi-dekadika-klasmata' },
  { id: '04-sigkrisi-arithmon', label: '⚖️ 4. Σύγκριση και διάταξη δεκαδικών αριθμών', href: '/st-dimotikou/04-sigkrisi-arithmon' },
  { id: '05-prosthesi', label: '➕ 5. Πρόσθεση φυσικών και δεκαδικών αριθμών', href: '/st-dimotikou/05-prosthesi' },
  { id: '06-pollaplasiasmos', label: '✖️ 6. Πολλαπλασιασμός φυσικών και δεκαδικών', href: '/st-dimotikou/06-pollaplasiasmos' },
  { id: '07-pollaplasiasmos-dinameis-deka', label: '⚡ 7. Πολλαπλασιασμός με δυνάμεις του 10', href: '/st-dimotikou/07-pollaplasiasmos-dinameis-deka' },
  { id: '08-diairesi', label: '➗ 8. Διαίρεση φυσικών και δεκαδικών αριθμών', href: '/st-dimotikou/08-diairesi' },
  { id: '09-diairesi-dinameis-deka', label: '📉 9. Διαίρεση με δυνάμεις του 10', href: '/st-dimotikou/09-diairesi-dinameis-deka' },
  { id: '10-proteraiotita-prakseon', label: '🧮 10. Προτεραιότητα των πράξεων', href: '/st-dimotikou/10-proteraiotita-prakseon' },
  { id: '11-problimata', label: '💡 11. Στρατηγικές επίλυσης προβλημάτων', href: '/st-dimotikou/11-problimata' },
  { id: '12-stroggilopoiisi', label: '🎯 12. Στρογγυλοποίηση αριθμών', href: '/st-dimotikou/12-stroggilopoiisi' },
  { id: '13-diairetes', label: '🛡️ 13. Διαιρέτες φυσικού αριθμού', href: '/st-dimotikou/13-diairetes' },
  { id: '14-mkd', label: '🏆 14. Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)', href: '/st-dimotikou/14-mkd' },
  { id: '15-kritiria-diairetotitas', label: '🔍 15. Κριτήρια διαιρετότητας', href: '/st-dimotikou/15-kritiria-diairetotitas' },
  { id: '16-protoi', label: '💎 16. Πρώτοι και σύνθετοι αριθμοί', href: '/st-dimotikou/16-protoi' },
  { id: '17-paragontopoiisi', label: '🌳 17. Ανάλυση σε γινόμενο πρώτων παραγόντων', href: '/st-dimotikou/17-paragontopoiisi' },
  { id: '18-pollaplasia', label: '📈 18. Πολλαπλάσια φυσικού αριθμού', href: '/st-dimotikou/18-pollaplasia' },
  { id: '19-ekp', label: '🎯 19. Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.)', href: '/st-dimotikou/19-ekp' },
  { id: '20-ekp-protoi', label: '⚙️ 20. Υπολογισμός Ε.Κ.Π. με ανάλυση σε πρώτους παράγοντες', href: '/st-dimotikou/20-ekp-protoi' },
  { id: '21-dinameis', label: '💪 21. Η έννοια της δύναμης (Δυνάμεις φυσικών)', href: '/st-dimotikou/21-dinameis' },
  { id: '22-dinameis-deka', label: '🚀 22. Δυνάμεις του 10', href: '/st-dimotikou/22-dinameis-deka' },
  { id: '23-klasma', label: '🍕 23. Η έννοια του κλάσματος και είδη κλασμάτων', href: '/st-dimotikou/23-klasma' },
  { id: '24-klasma-se-dekadiko', label: '📊 24. Μετατροπή κλάσματος σε δεκαδικό αριθμό', href: '/st-dimotikou/24-klasma-se-dekadiko' },
  { id: '25-isodinama-klasmata', label: '🪞 25. Ισοδύναμα κλάσματα και απλοποίηση', href: '/st-dimotikou/25-isodinama-klasmata' },
  { id: '26-sigkrisi-klasmaton', label: '⚖️ 26. Σύγκριση και διάταξη κλασμάτων (Ομώνυμα/Ετερώνυμα)', href: '/st-dimotikou/26-sigkrisi-klasmaton' },
  { id: '27-prosthesi-klasmaton', label: '➕ 27. Πρόσθεση κλασμάτων', href: '/st-dimotikou/27-prosthesi-klasmaton' },
  { id: '28-afairesi-klasmaton', label: '➖ 28. Αφαίρεση κλασμάτων', href: '/st-dimotikou/28-afairesi-klasmaton' },
  { id: '29-pollaplasiasmos-klasmaton', label: '✖️ 29. Πολλαπλασιασμός κλασμάτων', href: '/st-dimotikou/29-pollaplasiasmos-klasmaton' },
  { id: '30-diairesi-klasmaton', label: '➗ 30. Διαίρεση κλασμάτων (Αντίστροφοι αριθμοί)', href: '/st-dimotikou/30-diairesi-klasmaton' },
  { id: '31-epanalipsi-1', label: '🏆 31. Επανάληψη: Κεφάλαια 1 – 30', href: '/st-dimotikou/31-epanalipsi-1' },
  { id: '32-metabliti', label: '🧩 32. Η έννοια της μεταβλητής (x)', href: '/st-dimotikou/32-metabliti' },
  { id: '33-agnostos-kai-prosthesi', label: '➕ 33. Εξισώσεις της μορφής: x + α = β', href: '/st-dimotikou/33-agnostos-kai-prosthesi' },
  { id: '34-agnostos-kai-afairesi', label: '➖ 34. Εξισώσεις της μορφής: x − α = β', href: '/st-dimotikou/34-agnostos-kai-afairesi' },
  { id: '35-gnostos-meion-agnostos', label: '🔻 35. Εξισώσεις της μορφής: α − x = β', href: '/st-dimotikou/35-gnostos-meion-agnostos' },
  { id: '36-gnostos-epi-agnostos', label: '✖️ 36. Εξισώσεις της μορφής: α · x = β', href: '/st-dimotikou/36-gnostos-epi-agnostos' },
  { id: '37-agnostos-dia-gnostos', label: '➗ 37. Εξισώσεις της μορφής: x : α = β', href: '/st-dimotikou/37-agnostos-dia-gnostos' },
  { id: '38-gnostos-dia-agnostos', label: '🔄 38. Εξισώσεις της μορφής: α : x = β', href: '/st-dimotikou/38-gnostos-dia-agnostos' },
  { id: '39-epanalipsi-2', label: '🏆 39. Επανάληψη: Κεφάλαια 32 – 38', href: '/st-dimotikou/39-epanalipsi-2' },
  { id: '40-logos', label: '⚖️ 40. Λόγος δύο μεγεθών', href: '/st-dimotikou/40-logos' },
  { id: '41-analogia', label: '🔗 41. Από τους λόγους στις αναλογίες', href: '/st-dimotikou/41-analogia' },
  { id: '42-analogia-xiasti', label: '✖️ 42. Ιδιότητες αναλογιών (Γινόμενα χιαστί)', href: '/st-dimotikou/42-analogia-xiasti' },
  { id: '43-posa', label: '📊 43. Σταθερά και μεταβλητά ποσά', href: '/st-dimotikou/43-posa' },
  { id: '44-analoga-posa', label: '📈 44. Ανάλογα ποσά και συντελεστής αναλογίας', href: '/st-dimotikou/44-analoga-posa' },
  { id: '45-problem-analoga-posa', label: '🛒 45. Προβλήματα με ανάλογα ποσά', href: '/st-dimotikou/45-problem-analoga-posa' },
  { id: '46-antistrofos-analoga-posa', label: '📉 46. Αντιστρόφως ανάλογα ποσά', href: '/st-dimotikou/46-antistrofos-analoga-posa' },
  { id: '47-problem-antistrofos-analoga-posa', label: '⏳ 47. Προβλήματα με αντιστρόφως ανάλογα ποσά', href: '/st-dimotikou/47-problem-antistrofos-analoga-posa' },
  { id: '48-methodos-trion', label: '📋 48. Απλή μέθοδος των τριών στα ανάλογα ποσά', href: '/st-dimotikou/48-methodos-trion' },
  { id: '49-antistrofos-analoga-posa', label: '🔄 49. Απλή μέθοδος των τριών στα αντιστρόφως ανάλογα ποσά', href: '/st-dimotikou/49-antistrofos-analoga-posa' },
  { id: '50-pososta', label: '🏷️ 50. Η έννοια του ποσοστού', href: '/st-dimotikou/50-pososta' },
  { id: '51-problimata-me-pososta', label: '💡 51. Προβλήματα με ποσοστά', href: '/st-dimotikou/51-problimata-me-pososta' },
  { id: '52-brisko-arxiki-timi', label: '🔙 52. Εύρεση της αρχικής τιμής', href: '/st-dimotikou/52-brisko-arxiki-timi' },
  { id: '53-ksero-arxiki-teliki-timi', label: '🔍 53. Εύρεση ποσοστού (Γνωρίζοντας αρχική και τελική τιμή)', href: '/st-dimotikou/53-ksero-arxiki-teliki-timi' },
  { id: '54-epanalipsi-3', label: '🏆 54. Επανάληψη: Κεφάλαια 40 – 53', href: '/st-dimotikou/54-epanalipsi-3' },
  { id: '55-apeikonisi-data', label: '📊 55. Συλλογή δεδομένων: Ραβδόγραμμα και εικονόγραμμα', href: '/st-dimotikou/55-apeikonisi-data' },
  { id: '56-pinakas-sixnotiton', label: '📑 56. Ταξινόμηση δεδομένων και πίνακας συχνοτήτων', href: '/st-dimotikou/56-pinakas-sixnotiton' },
  { id: '57-alla-grafimata', label: '🥧 57. Γραφήματα γραμμής και κυκλικά διαγράμματα', href: '/st-dimotikou/57-alla-grafimata' }
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
