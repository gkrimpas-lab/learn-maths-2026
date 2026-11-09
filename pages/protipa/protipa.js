import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const I18N = {
  el: {
    pageTitle: "🎯 Εισαγωγή στα Πρότυπα Σχολεία - LearnMaths.gr",
    pageDesc: "Πλήρης προετοιμασία για τις εξετάσεις εισαγωγής στα Πρότυπα Σχολεία: Τεστ προσομοίωσης, πραγματικά θέματα εξετάσεων και δωρεάν λήψη θεμάτων & απαντήσεων σε PDF.",
    backText: "Αρχική",
    heroBadge: "🎯 ΕΙΔΙΚΗ ΠΡΟΕΤΟΙΜΑΣΙΑ",
    heroTitle: "Εισαγωγή στα Πρότυπα Σχολεία",
    heroDesc: "Κάνε τη μετάβαση από τη ΣΤ' Δημοτικού στην Α' Γυμνασίου με απόλυτη επιτυχία! Εξασκήσου με πραγματικά θέματα εξετάσεων, λύσε τεστ προσομοίωσης με αυτόματη βαθμολόγηση ή κατέβασε τα αρχεία σε PDF.",
    
    // Section 1: Online Practice
    sec1Title: "Διαδραστική Εξάσκηση Online",
    sec1Subtitle: "Επίλεξε τρόπο εξάσκησης με άμεσο έλεγχο απαντήσεων και βαθμολογία.",
    
    // Card 1: Simulation
    card1Badge: "ΧΡΟΝΟΜΕΤΡΟ ΚΑΙ ΒΑΘΜΟΛΟΓΙΑ",
    card1Title: "ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ",
    card1Desc: "Δοκιμαστικά τεστ στα πρότυπα των πραγματικών εξετάσεων με διαβαθμισμένη δυσκολία, πολλαπλή επιλογή και άμεση αξιολόγηση.",
    card1Btn: "🚀 Έναρξη Προσομοίωσης",

    // Card 2: Past Exams
    card2Badge: "ΕΠΙΣΗΜΑ ΘΕΜΑΤΑ ΥΠΟΥΡΓΕΙΟΥ",
    card2Title: "ΠΡΑΓΜΑΤΙΚΑ ΘΕΜΑΤΑ ΕΞΕΤΑΣΕΩΝ",
    card2Desc: "Λύσε online τα επίσημα θέματα των προηγούμενων ετών ανά χρονιά, δες τις σωστές απαντήσεις και μέτρησε τις επιδόσεις σου.",
    card2Btn: "🔍 Επιλογή Έτους Εξετάσεων",

    // Section 2: PDF Downloads
    sec2Title: "Υλικό για Εκτύπωση & Μελέτη (PDF)",
    sec2Subtitle: "Κατέβασε δωρεάν τα επίσημα έγγραφα θεμάτων και απαντήσεων σε μορφή PDF.",
    pdfDownloadBtn: "Λήψη PDF",
    pdf1Title: "Πρότυπα Σχολεία 2020 - 2026",
    pdf1Desc: "Συγκεντρωμένα όλα τα επίσημα θέματα και οι ενδεικτικές απαντήσεις των τελευταίων ετών.",
    pdf2Title: "Μαθηματικά 2016 - 2019",
    pdf2Desc: "Παλαιότερα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία μαζί με τις λύσεις τους.",
    pdf3Title: "Απαντήσεις Θεμάτων",
    pdf3Desc: "Αναλυτικές και πλήρως επεξηγημένες λύσεις όλων των θεμάτων για όλα τα έτη."
  },
  en: {
    pageTitle: "🎯 Model & Magnet School Entrance Exams - LearnMaths.gr",
    pageDesc: "Complete preparation for selective Model School entrance exams: Simulation tests, official past papers, and free downloadable PDF answer keys.",
    backText: "Home",
    heroBadge: "🎯 SPECIALIZED EXAM PREPARATION",
    heroTitle: "Model & Magnet School Entrance",
    heroDesc: "Bridge the transition from Grade 6 to Middle School with confidence! Practice with official past exam papers, complete timed simulation tests, or download full sets in PDF.",
    
    // Section 1: Online Practice
    sec1Title: "Interactive Online Practice",
    sec1Subtitle: "Select your practice mode with instant scoring and detailed answer validation.",
    
    // Card 1: Simulation
    card1Badge: "TIMER & AUTOMATED SCORING",
    card1Title: "SIMULATION TESTS",
    card1Desc: "Full-length trial tests structured to match official entrance exams, featuring multiple-choice questions and instant feedback.",
    card1Btn: "🚀 Start Simulation Test",

    // Card 2: Past Exams
    card2Badge: "OFFICIAL PAST PAPERS",
    card2Title: "AUTHENTIC EXAM PAPERS",
    card2Desc: "Practice official exam papers sorted by year, review step-by-step solutions, and benchmark your score.",
    card2Btn: "🔍 Select Exam Year",

    // Section 2: PDF Downloads
    sec2Title: "Printable Study Materials (PDF)",
    sec2Subtitle: "Download official exam papers and explanatory solutions completely free in PDF format.",
    pdfDownloadBtn: "Download PDF",
    pdf1Title: "Model Schools 2020 - 2026",
    pdf1Desc: "Consolidated volume containing official exam questions and answer keys from recent years.",
    pdf2Title: "Mathematics 2016 - 2019",
    pdf2Desc: "Past entrance exam papers and worked solutions for earlier testing periods.",
    pdf3Title: "Comprehensive Solutions",
    pdf3Desc: "Detailed, step-by-step mathematical explanations for all examination years."
  }
};

export default function ProtipaHubPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const canonicalUrl = locale === 'en' ? 'https://learnmaths.gr/en/protipa/protipa' : 'https://learnmaths.gr/protipa/protipa';
  const homeUrl = locale === 'en' ? 'https://learnmaths.gr/en' : 'https://learnmaths.gr/';

  const pageSchema = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": t.backText, "item": homeUrl },
        { "@type": "ListItem", "position": 2, "name": t.heroTitle, "item": canonicalUrl }
      ]
    },
    {
      "@type": "Course",
      "name": t.heroTitle,
      "description": t.pageDesc,
      "provider": { "@type": "Organization", "name": "LearnMaths.gr" }
    }
  ];

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      schemaData={pageSchema}
      backUrl="/"
      backText={t.backText}
      showAds={true}
    >
      <div className={`${LAYOUT.CONTAINER} w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 md:py-10 space-y-8 md:space-y-10`}>

        {/* HERO BANNER */}
        <header className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 sm:p-8 md:p-10 text-slate-950 shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 bg-white/30 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider text-slate-900 border border-white/40">
              <span>{t.heroBadge}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
              {t.heroTitle}
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-medium text-slate-900/90 leading-relaxed max-w-2xl">
              {t.heroDesc}
            </p>
          </div>
        </header>

        {/* SECTION 1: ΔΙΑΔΡΑΣΤΙΚΗ ΕΞΑΣΚΗΣΗ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>💻</span> {t.sec1Title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.sec1Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            
            {/* ΚΑΡΤΑ 1: ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ */}
            <article className="bg-white border-2 border-indigo-200 hover:border-indigo-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-black shadow-xs">
                  ⏱️
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 block mb-1">
                    {t.card1Badge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {t.card1Title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.card1Desc}
                </p>
              </div>

              <Link
                href="/protipa/test-prosomoiosis"
                locale={locale}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-95 touch-manipulation cursor-pointer"
              >
                <span>{t.card1Btn}</span>
                <span aria-hidden="true">➔</span>
              </Link>
            </article>

            {/* ΚΑΡΤΑ 2: ΠΡΑΓΜΑΤΙΚΑ ΘΕΜΑΤΑ ΕΞΕΤΑΣΕΩΝ */}
            <article className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-black shadow-xs">
                  📝
                </div>
                <div>
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 block mb-1">
                    {t.card2Badge}
                  </span>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900">
                    {t.card2Title}
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {t.card2Desc}
                </p>
              </div>

              <Link
                href="/protipa/pragmatika-themata"
                locale={locale}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-3 px-4 rounded-2xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-95 touch-manipulation cursor-pointer"
              >
                <span>{t.card2Btn}</span>
                <span aria-hidden="true">➔</span>
              </Link>
            </article>

          </div>
        </section>

        {/* SECTION 2: ΛΗΨΗ ΑΡΧΕΙΩΝ PDF */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📥</span> {t.sec2Title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.sec2Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* PDF 1: 2020 - 2026 */}
            <article className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block">📚</span>
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  {t.pdf1Title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.pdf1Desc}
                </p>
              </div>
              <a
                href="/protypa_2020_2026.pdf"
                download
                className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
              >
                <span>📥</span>
                <span>{t.pdfDownloadBtn}</span>
              </a>
            </article>

            {/* PDF 2: 2016 - 2019 */}
            <article className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block">📐</span>
                <h3 className="font-black text-slate-900 text-base sm:text-lg">
                  {t.pdf2Title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {t.pdf2Desc}
                </p>
              </div>
              <a
                href="/maths_2016_2019.pdf"
                download
                className="w-full text-center bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
              >
                <span>📥</span>
                <span>{t.pdfDownloadBtn}</span>
              </a>
            </article>

            {/* PDF 3: ΑΠΑΝΤΗΣΕΙΣ */}
            <article className="bg-emerald-50/50 rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-emerald-300 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block">✅</span>
                <h3 className="font-black text-emerald-950 text-base sm:text-lg">
                  {t.pdf3Title}
                </h3>
                <p className="text-xs text-emerald-800/80 leading-relaxed">
                  {t.pdf3Desc}
                </p>
              </div>
              <a
                href="/apantiseis_2016_2026.pdf"
                download
                className="w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95 touch-manipulation"
              >
                <span>📥</span>
                <span>{t.pdfDownloadBtn}</span>
              </a>
            </article>

          </div>
        </section>

      </div>
    </Layout>
  );
}