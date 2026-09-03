import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

export default function ProtipaHubPage() {
  return (
    <Layout
      title="🎯 Εισαγωγή στα Πρότυπα Σχολεία - LearnMaths.gr"
      description="Πλήρης προετοιμασία για τις εξετάσεις εισαγωγής στα Πρότυπα Σχολεία: Τεστ προσομοίωσης, πραγματικά θέματα εξετάσεων και δωρεάν λήψη θεμάτων & απαντήσεων σε PDF."
      backUrl="/"
      backText="Αρχική"
      showAds={true}
    >
      <div className="py-6 sm:py-8 md:py-10 space-y-8 md:space-y-10">

        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 md:p-10 text-slate-950 shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-900 border border-white/40">
              <span>🎯 Ειδικη Προετοιμασια</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Εισαγωγή στα Πρότυπα Σχολεία
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-900/90 leading-relaxed max-w-2xl">
              Κάνε τη μετάβαση από τη ΣΤ' Δημοτικού στην Α' Γυμνασίου με απόλυτη επιτυχία! Εξασκήσου με <strong>πραγματικά θέματα εξετάσεων</strong>, λύσε <strong>τεστ προσομοίωσης</strong> με αυτόματη βαθμολόγηση ή κατέβασε τα αρχεία σε <strong>PDF</strong>.
            </p>
          </div>
        </div>

        {/* SECTION 1: ΔΙΑΔΡΑΣΤΙΚΗ ΕΞΑΣΚΗΣΗ */}
        <div className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>💻</span> Διαδραστική Εξάσκηση Online
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Επίλεξε τρόπο εξάσκησης με άμεσο έλεγχο απαντήσεων και βαθμολογία.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* ΚΑΡΤΑ 1: ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ */}
            <div className="bg-white border-2 border-indigo-200 hover:border-indigo-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black shadow-xs">
                  ⏱️
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block mb-1">
                    Χρονόμετρο & Βαθμολογία
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Δοκιμαστικά τεστ στα πρότυπα των πραγματικών εξετάσεων με διαβαθμισμένη δυσκολία, πολλαπλή επιλογή και άμεση αξιολόγηση.
                </p>
              </div>

              <Link
                href="/protipa/test-prosomoiosis"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <span>🚀 Έναρξη Προσομοίωσης</span>
                <span>➔</span>
              </Link>
            </div>

            {/* ΚΑΡΤΑ 2: ΠΡΑΓΜΑΤΙΚΑ ΘΕΜΑΤΑ ΕΞΕΤΑΣΕΩΝ */}
            <div className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-black shadow-xs">
                  📝
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 block mb-1">
                    Επίσημα Θέματα Υπουργείου
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    ΠΡΑΓΜΑΤΙΚΑ ΘΕΜΑΤΑ ΕΞΕΤΑΣΕΩΝ
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Λύσε online τα επίσημα θέματα των προηγούμενων ετών ανά χρονιά, δες τις σωστές απαντήσεις και μέτρησε τις επιδόσεις σου.
                </p>
              </div>

              <Link
                href="/protipa/pragmatika-themata"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-95"
              >
                <span>🔍 Επιλογή Έτους Εξετάσεων</span>
                <span>➔</span>
              </Link>
            </div>

          </div>
        </div>

        {/* SECTION 2: ΛΗΨΗ ΑΡΧΕΙΩΝ PDF */}
        <div className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
              <span>📥</span> Υλικό για Εκτύπωση & Μελέτη (PDF)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Κατέβασε δωρεάν τα επίσημα έγγραφα θεμάτων και απαντήσεων σε μορφή PDF.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* PDF 1: 2020 - 2025 */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block">📚</span>
                <h4 className="font-black text-slate-900 text-base sm:text-lg">
                  Πρότυπα Σχολεία 2020 - 2025
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Συγκεντρωμένα όλα τα επίσημα θέματα και οι ενδεικτικές απαντήσεις των τελευταίων ετών.
                </p>
              </div>
              <a
                href="/protypa_2020_2025.pdf"
                download
                className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>📥</span>
                <span>Λήψη PDF</span>
              </a>
            </div>

            {/* PDF 2: 2016 - 2019 */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block">📐</span>
                <h4 className="font-black text-slate-900 text-base sm:text-lg">
                  Μαθηματικά 2016 - 2019
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Παλαιότερα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία μαζί με τις λύσεις τους.
                </p>
              </div>
              <a
                href="/maths_2016_2019.pdf"
                download
                className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>📥</span>
                <span>Λήψη PDF</span>
              </a>
            </div>

            {/* PDF 3: ΑΠΑΝΤΗΣΕΙΣ */}
            <div className="bg-emerald-50/50 rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-emerald-300 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block">✅</span>
                <h4 className="font-black text-emerald-950 text-base sm:text-lg">
                  Απαντήσεις Θεμάτων
                </h4>
                <p className="text-xs text-emerald-800/80 leading-relaxed">
                  Αναλυτικές και πλήρως επεξηγημένες λύσεις όλων των θεμάτων για όλα τα έτη.
                </p>
              </div>
              <a
                href="/apanteseis_2016_2025.pdf"
                download
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>📥</span>
                <span>Λήψη PDF</span>
              </a>
            </div>

          </div>
        </div>

      </div>
    </Layout>
  );
}
