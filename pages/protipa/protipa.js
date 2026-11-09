import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const I18N = {
  el: {
    pageTitle: "Θέματα Προτύπων & Τεστ Προσομοίωσης - LearnMaths.gr",
    pageDesc: "Επίσημα θέματα προτύπων σχολείων προηγούμενων ετών με αναλυτικές λύσεις, διαδραστικά τεστ προσομοίωσης και δωρεάν λήψη θεμάτων σε PDF για μαθητές Δημοτικού.",
    backText: "Αρχική",
    heroBadge: "🎯 ΕΠΙΣΗΜΑ ΘΕΜΑΤΑ ΠΡΟΤΥΠΩΝ & ΠΡΟΣΟΜΟΙΩΣΗ",
    heroTitle: "Επίσημα Θέματα Προτύπων & Τεστ Προσομοίωσης",
    heroDesc: "Ολοκληρωμένη προετοιμασία για τις εισαγωγικές εξετάσεις στα Πρότυπα Σχολεία (Πρότυπα Γυμνάσια). Λύσε online τα επίσημα θέματα προτύπων προηγούμενων ετών, εξασκήσου με τεστ προσομοίωσης με χρονόμετρο και αυτόματη βαθμολόγηση, ή κατέβασε δωρεάν όλα τα θέματα και τις απαντήσεις σε PDF.",
    
    // Section 1: Online Practice
    sec1Title: "Διαδραστική Προσομοίωση & Εξάσκηση Online",
    sec1Subtitle: "Επίλεξε τρόπο εξάσκησης με αυτόματη βαθμολόγηση, χρονόμετρο και άμεσο έλεγχο απαντήσεων στα μαθηματικά.",
    
    // Card 1: Simulation
    card1Badge: "ΧΡΟΝΟΜΕΤΡΟ & ΑΥΤΟΜΑΤΗ ΒΑΘΜΟΛΟΓΗΣΗ",
    card1Title: "Τεστ Προσομοίωσης Προτύπων",
    card1Desc: "Ολοκληρωμένα τεστ προσομοίωσης βασισμένα στα πραγματικά θέματα εξετάσεων με διαβαθμισμένη δυσκολία, ερωτήσεις πολλαπλής επιλογής και άμεση αξιολόγηση.",
    card1Btn: "🚀 Έναρξη Τεστ Προσομοίωσης",

    // Card 2: Past Exams
    card2Badge: "ΕΠΙΣΗΜΑ ΘΕΜΑΤΑ ΠΡΟΗΓΟΥΜΕΝΩΝ ΕΤΩΝ",
    card2Title: "Επίσημα Θέματα Προτύπων (Ανά Έτος)",
    card2Desc: "Λύσε διαδραστικά όλα τα επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία ανά σχολικό έτος, έλεγξε τις λύσεις και υπολόγισε το σκορ σου.",
    card2Btn: "🔍 Επιλογή Έτους Εξετάσεων",

    // Section 2: PDF Downloads
    sec2Title: "Επίσημα Θέματα Προτύπων σε PDF (Δωρεάν Λήψη)",
    sec2Subtitle: "Κατέβασε, εκτύπωσε και μελέτησε τα επίσημα θέματα προτύπων και τις αναλυτικές λύσεις σε μορφή PDF.",
    pdfDownloadBtn: "Λήψη PDF",
    pdf1Title: "Θέματα Προτύπων 2020 - 2026",
    pdf1Desc: "Συγκεντρωτικά όλα τα επίσημα θέματα εξετάσεων και οι απαντήσεις των τελευταίων ετών.",
    pdf2Title: "Μαθηματικά Προτύπων 2016 - 2019",
    pdf2Desc: "Παλαιότερα επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Γυμνάσια μαζί με τις λύσεις τους.",
    pdf3Title: "Αναλυτικές Λύσεις & Απαντήσεις",
    pdf3Desc: "Πλήρως επεξηγημένες μαθηματικές λύσεις για όλα τα θέματα εξετάσεων όλων των ετών."
  },
  en: {
    pageTitle: "Model School Entrance Exam Papers & Simulation Tests - LearnMaths.gr",
    pageDesc: "Official Model School past entrance exam papers with detailed solutions, timed simulation mock tests, and free downloadable PDF study guides.",
    backText: "Home",
    heroBadge: "🎯 OFFICIAL EXAM PAPERS & SIMULATION",
    heroTitle: "Model School Entrance Papers & Simulation Tests",
    heroDesc: "Comprehensive preparation for standardized entrance examinations for selective Model Schools. Practice official past exam papers, complete timed mock simulation tests with instant scoring, or download all exam materials in PDF format.",
    
    // Section 1: Online Practice
    sec1Title: "Interactive Online Simulation & Practice",
    sec1Subtitle: "Select your testing mode featuring automated scoring, exam timer, and immediate answer keys.",
    
    // Card 1: Simulation
    card1Badge: "TIMER & AUTOMATED SCORING",
    card1Title: "Model School Simulation Tests",
    card1Desc: "Full-length mock tests modeled after real entrance exam standards, offering graded difficulty levels, multiple-choice questions, and instant analytics.",
    card1Btn: "🚀 Start Simulation Test",

    // Card 2: Past Exams
    card2Badge: "OFFICIAL PAST EXAM PAPERS",
    card2Title: "Official Exam Papers by Year",
    card2Desc: "Solve authentic past papers from official testing cycles, review step-by-step mathematical answers, and assess your progress.",
    card2Btn: "🔍 Select Exam Year",

    // Section 2: PDF Downloads
    sec2Title: "Download Official Exam Papers in PDF (Free)",
    sec2Subtitle: "Download, print, and study complete official past papers and step-by-step solutions in PDF.",
    pdfDownloadBtn: "Download PDF",
    pdf1Title: "Model Schools 2020 - 2026",
    pdf1Desc: "Comprehensive collection containing all official examination questions and answer keys from recent years.",
    pdf2Title: "Mathematics 2016 - 2019",
    pdf2Desc: "Earlier examination sets and verified step-by-step worked mathematical solutions.",
    pdf3Title: "Complete Solutions & Explanations",
    pdf3Desc: "Detailed, pedagogically broken-down mathematical answers for all examination years."
  }
};

export default function ProtipaHubPage() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const canonicalUrl = locale === 'en' 
    ? 'https://learnmaths.gr/en/protipa/protipa' 
    : 'https://learnmaths.gr/protipa/protipa';
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
      "educationalLevel": "Primary to Secondary Transition (ΣΤ' Δημοτικού - Α' Γυμνασίου)",
      "provider": { 
        "@type": "Organization", 
        "name": "LearnMaths.gr",
        "url": "https://learnmaths.gr" 
      },
      "hasCourseInstance": {
        "@type": "CourseInstance",
        "courseMode": "online",
        "inLanguage": locale === 'en' ? 'en' : 'el'
      }
    },
    {
      "@type": "LearningResource",
      "name": t.heroTitle,
      "description": t.pageDesc,
      "learningResourceType": "Assessment / Practice Exam",
      "educationalUse": "Exam Preparation",
      "inLanguage": locale === 'en' ? 'en' : 'el'
    }
  ];

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      schemaData={pageSchema}
      backUrl="/"
      backText={t.backText}
      showAds={false}
    >
      <div className={`${LAYOUT.CONTAINER} w-full max-w-[1920px] 2xl:max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-8 md:py-10 space-y-8 md:space-y-10`}>

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

        {/* SECTION 1: ΔΙΑΔΡΑΣΤΙΚΗ ΕΞΑΣΚΗΣΗ & ΠΡΟΣΟΜΟΙΩΣΗ */}
        <section className="space-y-4">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span aria-hidden="true">💻</span> {t.sec1Title}
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
                  <span aria-hidden="true">⏱️</span>
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

            {/* ΚΑΡΤΑ 2: ΕΠΙΣΗΜΑ ΘΕΜΑΤΑ ΕΞΕΤΑΣΕΩΝ */}
            <article className="bg-white border-2 border-blue-200 hover:border-blue-400 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center text-2xl font-black shadow-xs">
                  <span aria-hidden="true">📝</span>
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

        {/* SECTION 2: ΛΗΨΗ ΕΠΙΣΗΜΩΝ ΘΕΜΑΤΩΝ ΣΕ PDF */}
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div>
            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span aria-hidden="true">📥</span> {t.sec2Title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.sec2Subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            
            {/* PDF 1: 2020 - 2026 */}
            <article className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block" aria-hidden="true">📚</span>
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
                <span aria-hidden="true">📥</span>
                <span>{t.pdfDownloadBtn}</span>
              </a>
            </article>

            {/* PDF 2: 2016 - 2019 */}
            <article className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-200 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block" aria-hidden="true">📐</span>
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
                <span aria-hidden="true">📥</span>
                <span>{t.pdfDownloadBtn}</span>
              </a>
            </article>

            {/* PDF 3: ΑΠΑΝΤΗΣΕΙΣ */}
            <article className="bg-emerald-50/50 rounded-3xl p-5 sm:p-6 shadow-sm border-2 border-emerald-300 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-3xl block" aria-hidden="true">✅</span>
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
                <span aria-hidden="true">📥</span>
                <span>{t.pdfDownloadBtn}</span>
              </a>
            </article>

          </div>
        </section>

      </div>
    </Layout>
  );
}