import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { LAYOUT } from '../shared/layout-config';

const I18N = {
  el: {
    pageTitle: "LearnMaths.gr - Τα Μαθηματικά Αλλιώς",
    pageDesc: "Η σύγχρονη πλατφόρμα εκμάθησης Μαθηματικών για το Δημοτικό, το Γυμνάσιο (Νέα Ύλη 2027-2028) και τα Πρότυπα Σχολεία.",
    navPrimary: "Δημοτικό",
    navMiddle: "Γυμνάσιο",
    navProtipa: "🎯 Πρότυπα",
    navContact: "✉️ Επικοινωνία",
    heroSubtitle: "Μάθε τα Μαθηματικά εύκολα, γρήγορα και διαδραστικά από το Δημοτικό έως το Γυμνάσιο!",
    quickPrimary: "Δημοτικό 🎒",
    quickMiddle: "Γυμνάσιο 📐",
    appDownloadText: "ΚΑΤΕΒΑΣΤΕ ΤΗΝ ΕΦΑΡΜΟΓΗ",
    appBadgeImg: "https://play.google.com/intl/en_us/badges/static/images/badges/el_badge_web_generic.png",
    
    // Protipa Banner
    protypaBadge: "🎯 ΕΙΔΙΚΗ ΠΡΟΕΤΟΙΜΑΣΙΑ",
    protypaTitle: "Εισαγωγή στα Πρότυπα Σχολεία",
    protypaDesc: "Προετοιμάσου για τις εξετάσεις με επίσημα θέματα προηγούμενων ετών, τεστ προσομοίωσης και δωρεάν λήψη όλων των θεμάτων σε PDF!",
    protypaBtn: "🚀 Είσοδος στα Πρότυπα",

    // Primary School Section
    primarySectionTitle: "🎒 Μαθηματικά Δημοτικού",
    primarySectionSubtitle: "Χτίζουμε γερές βάσεις για το μέλλον",
    classDTitle: "Δ' Δημοτικού ⭐",
    classETitle: "Ε' Δημοτικού ⭐",
    classSTTitle: "ΣΤ' Δημοτικού",
    modulesTitle: "Διαδραστικές Ενότητες",
    classDDesc: "Μεγάλοι Αριθμοί, Διαίρεση, Κλάσματα, Μήκος, Βάρος κ.α.",
    classEDesc: "Κλάσματα, Απλοποίηση, ΕΚΠ, ΜΚΔ, Ποσοστά, Μέση Τιμή κ.α. με προσομοιωτές!",
    classSTDesc: "Ανάλογα ποσά, εξισώσεις, κλίμακες & προετοιμασία για το Γυμνάσιο.",
    enterClassBtn: "🚀 Είσοδος στην Τάξη",

    // Middle School Section
    curriculumBadge: "✨ ΝΕΟ ΠΡΟΓΡΑΜΜΑ ΣΠΟΥΔΩΝ 2027–2028",
    middleSectionTitle: "📐 Μαθηματικά Γυμνασίου",
    middleSectionSubtitle: "Πλήρως εναρμονισμένα με τη σειρά και τις ενότητες των νέων σχολικών βιβλίων του ΙΕΠ (2027–2028).",
    classA_GymTitle: "Α' Γυμνασίου ⭐",
    classB_GymTitle: "Β' Γυμνασίου ⭐",
    classG_GymTitle: "Γ' Γυμνασίου",
    classA_GymDesc: "Φυσικοί, Δυνάμεις, Κλάσματα, Εξισώσεις, Ποσοστά & Γεωμετρία.",
    classB_GymModuleTitle: "Ενότητα: Συναρτήσεις",
    classB_GymDesc: "Μελέτησε τη συνάρτηση y ＝ α · x και δες live τη γραφική παράσταση στο πλέγμα!",
    classG_GymDesc: "Αλγεβρικές Παραστάσεις, Μονώνυμα, Ταυτότητες & Ομοιότητα.",

    // SEO Overview
    seoMainTitle: "Διαδραστικά Μαθηματικά σύμφωνα με το Σχολικό Πρόγραμμα",
    seoMainDesc: "Το LearnMaths.gr δημιουργήθηκε για να βοηθήσει μαθητές Δημοτικού και Γυμνάσιου να κατανοήσουν σε βάθος τις μαθηματικές έννοιες μέσα από διαδραστικά εργαλεία, οπτικοποιημένα παραδείγματα και στοχευμένες ασκήσεις. Κάθε κεφάλαιο ακολουθεί τη δομή του επίσημου σχολικού βιβλίου (ΙΕΠ), κάνοντας τη μελέτη στο σπίτι απλή και ευχάριστη.",
    seoCard1Title: "Προετοιμασία για Πρότυπα",
    seoCard1Desc: "Ολοκληρωμένη συλλογή με επίσημα παλαιότερα θέματα εξετάσεων για εισαγωγή στα Πρότυπα Γυμνάσια, αναλυτικές απαντήσεις και δωρεάν PDF.",
    seoCard2Title: "Διαδραστικοί Προσομοιωτές",
    seoCard2Desc: "Από τα κλάσματα, το ΕΚΠ και τον ΜΚΔ μέχρι τις γραφικές παραστάσεις συναρτήσεων και τις αλγεβρικές εξισώσεις, οι μαθητές πειραματίζονται ενεργά.",
    seoCard3Title: "Μελέτη από Παντού",
    seoCard3Desc: "Πλήρης συμβατότητα με υπολογιστές, τάμπλετ και κινητά, καθώς και διαθέσιμη δωρεάν εφαρμογή στο Google Play Store.",

    // FAQ
    faqTitle: "Συχνές Ερωτήσεις (FAQ)",
    faq1Q: "Είναι το περιεχόμενο του LearnMaths.gr δωρεάν;",
    faq1A: "Ναι, όλο το εκπαιδευτικό υλικό, η θεωρία, τα διαδραστικά εργαλεία και τα θέματα για τα Πρότυπα Σχολεία διατίθενται εντελώς δωρεάν για όλους τους μαθητές και εκπαιδευτικούς.",
    faq2Q: "Ποιες τάξεις καλύπτει η πλατφόρμα;",
    faq2A: "Καλύπτει τις τάξεις του Δημοτικού (Δ΄, Ε΄, ΣΤ΄ Δημοτικού), όλες τις τάξεις του Γυμνασίου (Α΄, Β΄, Γ΄ Γυμνασίου) και περιλαμβάνει ειδική κατηγορία προετοιμασίας εξετάσεων για τα Πρότυπα Σχολεία.",
    faq3Q: "Ακολουθεί η πλατφόρμα τα Νέα Βιβλία και Προγράμματα Σπουδών 2027-2028;",
    faq3A: "Ναι! Όλη η ύλη και τα διαδραστικά κεφάλαια του Γυμνασίου έχουν αναδιαρθρωθεί σύμφωνα με τα Νέα Βιβλία Μαθηματικών (2027–2028). Τα μαθήματα του Δημοτικού ακολουθούν πιστά το ισχύον πρόγραμμα των τάξεων Δ΄, Ε΄ και ΣΤ΄.",
    faq4Q: "Πώς βοηθούν οι διαδραστικές ασκήσεις στην κατανόηση;",
    faq4A: "Αντί για απλή αποστήθιση, οι μαθητές αλληλεπιδρούν με οπτικά μοντέλα (όπως κλασματικές ράβδους, ζυγαριές εξισώσεων και διαδραστικούς άξονες), κατανοώντας βαθύτερα τη λογική πίσω από κάθε μαθηματική έννοια."
  },
  en: {
    pageTitle: "LearnMaths.gr - Mathematics Reimagined",
    pageDesc: "Modern interactive mathematics learning platform for Elementary, Middle School (New Curriculum), and Selective Magnet Schools.",
    navPrimary: "Elementary",
    navMiddle: "Middle School",
    navProtipa: "🎯 Exam Prep",
    navContact: "✉️ Contact",
    heroSubtitle: "Learn Mathematics easily, quickly, and interactively from Elementary to Middle School!",
    quickPrimary: "Elementary 🎒",
    quickMiddle: "Middle School 📐",
    appDownloadText: "GET IT ON GOOGLE PLAY",
    appBadgeImg: "https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png",

    // Protipa Banner
    protypaBadge: "🎯 SPECIALIZED EXAM PREPARATION",
    protypaTitle: "Model & Magnet School Entrance",
    protypaDesc: "Prepare for standardized entrance examinations with official past papers, simulation tests, and free downloadable PDFs!",
    protypaBtn: "🚀 Access Exam Materials",

    // Primary School Section
    primarySectionTitle: "🎒 Elementary Mathematics",
    primarySectionSubtitle: "Building solid foundations for the future",
    classDTitle: "Grade 4 ⭐",
    classETitle: "Grade 5 ⭐",
    classSTTitle: "Grade 6",
    modulesTitle: "Interactive Modules",
    classDDesc: "Large Numbers, Division, Fractions, Length, Weight measurements and more.",
    classEDesc: "Fractions, Simplification, LCM, GCD, Percentages, Mean with visual simulators!",
    classSTDesc: "Proportional quantities, algebraic equations, scale, and Middle School prep.",
    enterClassBtn: "🚀 Enter Grade",

    // Middle School Section
    curriculumBadge: "✨ OFFICIAL CURRICULUM",
    middleSectionTitle: "📐 Middle School Mathematics",
    middleSectionSubtitle: "Fully structured according to the latest modern mathematics curriculum.",
    classA_GymTitle: "Grade 7 (Year 1) ⭐",
    classB_GymTitle: "Grade 8 (Year 2) ⭐",
    classG_GymTitle: "Grade 9 (Year 3)",
    classA_GymDesc: "Whole Numbers, Powers, Fractions, Linear Equations, Percentages & Geometry.",
    classB_GymModuleTitle: "Module: Functions",
    classB_GymDesc: "Explore the function y ＝ a · x and observe interactive graphing live on the coordinate grid!",
    classG_GymDesc: "Algebraic Expressions, Monomials, Special Products & Triangle Similarity.",

    // SEO Overview
    seoMainTitle: "Interactive Mathematics Aligned with Curriculum Standards",
    seoMainDesc: "LearnMaths.gr was created to help elementary and middle school students gain a deep conceptual understanding of mathematics through interactive tools, visual representations, and targeted problem sets. Every chapter follows clear pedagogical guidelines, making independent study simple and engaging.",
    seoCard1Title: "Model School Preparation",
    seoCard1Desc: "Comprehensive collection of past entrance exam papers, step-by-step solutions, and downloadable PDF material.",
    seoCard2Title: "Interactive Visual Simulators",
    seoCard2Desc: "From fractions, LCM and GCD to coordinate graphing and algebraic balance scales, students learn through hands-on experimentation.",
    seoCard3Title: "Study Anywhere",
    seoCard3Desc: "Fully responsive across desktops, tablets, and smartphones, with a free companion application on Google Play Store.",

    // FAQ
    faqTitle: "Frequently Asked Questions (FAQ)",
    faq1Q: "Is LearnMaths.gr completely free?",
    faq1A: "Yes, all educational resources, theory lessons, interactive tools, and entrance examination materials are provided completely free for students and educators.",
    faq2Q: "Which grades are covered by the platform?",
    faq2A: "The platform covers Elementary school (Grades 4, 5, 6), all Middle School grades (Grades 7, 8, 9), and includes a dedicated section for Model School entrance preparation.",
    faq3Q: "Are the courses aligned with the latest educational standards?",
    faq3A: "Yes! All curriculum content and interactive units have been restructured according to modern mathematics education frameworks and official textbooks.",
    faq4Q: "How do interactive exercises enhance mathematical understanding?",
    faq4A: "Rather than rote memorization, students manipulate visual models (such as fraction bars, equation balance scales, and interactive number lines), fostering deep conceptual understanding."
  }
};

export default function Home() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const navLinks = (
    <>
      <a href="#demotiko" className="hover:text-blue-600 transition font-semibold text-xs sm:text-sm">
        {t.navPrimary}
      </a>
      <a href="#gymnasio" className="hover:text-indigo-600 transition font-semibold text-xs sm:text-sm">
        {t.navMiddle}
      </a>
      <Link 
        href="/protipa/protipa"
        locale={locale}
        className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition duration-300"
      >
        {t.navProtipa}
      </Link>
      <Link 
        href="/epikoinonia"
        locale={locale}
        className="text-gray-600 hover:text-blue-600 font-semibold transition border-l pl-3 sm:pl-4 border-gray-200 text-xs sm:text-sm"
      >
        {t.navContact}
      </Link>
    </>
  );

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      customNavContent={navLinks}
      fullWidth={true}
      showAds={true}
    >
      {/* 1. HERO SECTION */}
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-8 sm:py-10 md:py-12 text-center shadow-md -mt-2">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-4">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
              LearnMaths<span className="text-amber-300">.gr</span>
            </h1>
            <p className="text-xs sm:text-sm md:text-base font-normal opacity-90 mt-2 max-w-xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>

          {/* Quick Jump Buttons */}
          <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3 pt-1">
            <a 
              href="#demotiko" 
              className="bg-white text-blue-700 px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold shadow-sm hover:bg-gray-100 transition text-xs sm:text-sm active:scale-95"
            >
              {t.quickPrimary}
            </a>
            <a 
              href="#gymnasio" 
              className="bg-indigo-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-full font-bold shadow-sm hover:bg-indigo-600 transition border border-indigo-400 text-xs sm:text-sm active:scale-95"
            >
              {t.quickMiddle}
            </a>
          </div>

          {/* App Badge */}
          <div className="flex flex-col items-center justify-center pt-2">
            <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-blue-200 mb-1">
              {t.appDownloadText}
            </p>
            <a
              href="https://play.google.com/store/apps/details?id=com.gkrimpas.learn_maths&pcampaignid=web_share"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block transform hover:scale-105 transition duration-200"
            >
              <img
                src={t.appBadgeImg}
                alt="Get it on Google Play"
                className="w-32 sm:w-36 h-auto mx-auto"
              />
            </a>
          </div>
        </div>
      </header>

      {/* 2. PROTYPA HUB BANNER */}
      <section id="protypa" className="py-8 sm:py-10 bg-amber-50/80 border-b border-amber-200">
        <div className={`${LAYOUT.CONTAINER} px-4 sm:px-6`}>
          <div className="bg-white border-2 border-amber-300 rounded-3xl p-5 sm:p-7 md:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 font-black px-3 py-0.5 rounded-full text-[11px] uppercase tracking-wider border border-amber-300">
                <span>{t.protypaBadge}</span>
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900">
                {t.protypaTitle}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-xl leading-relaxed">
                {t.protypaDesc}
              </p>
            </div>

            <Link
              href="/protipa/protipa"
              locale={locale}
              className="w-full md:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-6 py-3.5 rounded-2xl shadow-md transition transform hover:scale-105 active:scale-95 text-xs sm:text-sm md:text-base text-center whitespace-nowrap flex items-center justify-center gap-2 shrink-0 touch-manipulation cursor-pointer"
            >
              <span>{t.protypaBtn}</span>
              <span aria-hidden="true">➔</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 3. ΔΗΜΟΤΙΚΟ SECTION */}
      <section id="demotiko" className="py-10 md:py-14 bg-white">
        <div className={`${LAYOUT.CONTAINER} px-4 sm:px-6`}>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center mb-1 text-blue-600">
            {t.primarySectionTitle}
          </h2>
          <p className="text-center text-gray-500 mb-8 text-xs sm:text-sm">
            {t.primarySectionSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Δ' Δημοτικού */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="bg-teal-500 py-3 text-center text-white font-black text-base sm:text-lg">
                {t.classDTitle}
              </div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-gray-800 font-bold mb-1.5 text-sm sm:text-base">{t.modulesTitle}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{t.classDDesc}</p>
                </div>
                <Link 
                  href="/d-dimotikou"
                  locale={locale}
                  className="block w-full text-center bg-teal-500 text-white py-2.5 rounded-xl font-black hover:bg-teal-600 transition shadow-sm text-xs sm:text-sm touch-manipulation active:scale-95"
                >
                  {t.enterClassBtn}
                </Link>
              </div>
            </div>

            {/* Ε' Δημοτικού */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-cyan-400 transform md:scale-105 duration-300 flex flex-col justify-between">
              <div className="bg-cyan-500 py-3 text-center text-white font-black text-base sm:text-lg">
                {t.classETitle}
              </div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-gray-800 font-bold mb-1.5 text-sm sm:text-base">{t.modulesTitle}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{t.classEDDesc}</p>
                </div>
                <Link 
                  href="/e-dimotikou"
                  locale={locale}
                  className="block w-full text-center bg-cyan-500 text-white py-2.5 rounded-xl font-black hover:bg-cyan-600 transition shadow-sm text-xs sm:text-sm touch-manipulation active:scale-95"
                >
                  {t.enterClassBtn}
                </Link>
              </div>
            </div>

            {/* ΣΤ' Δημοτικού */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="bg-blue-600 py-3 text-center text-white font-black text-base sm:text-lg">
                {t.classSTTitle}
              </div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-gray-800 font-bold mb-1.5 text-sm sm:text-base">{t.modulesTitle}</p>
                  <p className="text-gray-600 text-xs leading-relaxed">{t.classSTDesc}</p>
                </div>
                <Link 
                  href="/st-dimotikou"
                  locale={locale}
                  className="block w-full text-center bg-blue-600 text-white py-2.5 rounded-xl font-black hover:bg-blue-700 transition shadow-sm text-xs sm:text-sm touch-manipulation active:scale-95"
                >
                  {t.enterClassBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ΓΥΜΝΑΣΙΟ SECTION */}
      <section id="gymnasio" className="py-10 md:py-14 bg-gray-100">
        <div className={`${LAYOUT.CONTAINER} px-4 sm:px-6`}>
          <div className="flex flex-col items-center mb-6">
            <span className="bg-indigo-100 text-indigo-800 text-[11px] font-black uppercase px-3 py-1 rounded-full mb-2 tracking-wide border border-indigo-200">
              {t.curriculumBadge}
            </span>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-center mb-1 text-indigo-600">
              {t.middleSectionTitle}
            </h2>
            <p className="text-center text-gray-600 max-w-xl text-xs sm:text-sm leading-relaxed">
              {t.middleSectionSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {/* Α' Γυμνασίου */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="bg-indigo-500 py-3 text-center text-white font-black text-base sm:text-lg">
                {t.classA_GymTitle}
              </div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-gray-800 font-bold mb-1.5 text-sm sm:text-base">{t.modulesTitle}</p>
                  <p className="text-gray-600 text-xs leading-relaxed">{t.classA_GymDesc}</p>
                </div>
                <Link 
                  href="/a-gymnasiou"
                  locale={locale}
                  className="block w-full text-center bg-indigo-600 text-white py-2.5 rounded-xl font-black hover:bg-indigo-700 transition shadow-sm text-xs sm:text-sm touch-manipulation active:scale-95"
                >
                  {t.enterClassBtn}
                </Link>
              </div>
            </div>

            {/* Β' Γυμνασίου */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-md border-2 border-indigo-400 transform md:scale-105 duration-300 flex flex-col justify-between">
              <div className="bg-indigo-600 py-3 text-center text-white font-black text-base sm:text-lg">
                {t.classB_GymTitle}
              </div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-gray-800 font-bold mb-1.5 text-sm sm:text-base">{t.classB_GymModuleTitle}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{t.classB_GymDesc}</p>
                </div>
                <Link 
                  href="/b-gymnasiou"
                  locale={locale}
                  className="block w-full text-center bg-indigo-600 text-white py-2.5 rounded-xl font-black hover:bg-indigo-700 transition shadow-sm text-xs sm:text-sm touch-manipulation active:scale-95"
                >
                  {t.enterClassBtn}
                </Link>
              </div>
            </div>

            {/* Γ' Γυμνασίου */}
            <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 flex flex-col justify-between">
              <div className="bg-purple-600 py-3 text-center text-white font-black text-base sm:text-lg">
                {t.classG_GymTitle}
              </div>
              <div className="p-5 text-center flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <p className="text-gray-800 font-bold mb-1.5 text-sm sm:text-base">{t.modulesTitle}</p>
                  <p className="text-gray-600 text-xs leading-relaxed">{t.classG_GymDesc}</p>
                </div>
                <Link 
                  href="/g-gymnasiou"
                  locale={locale}
                  className="block w-full text-center bg-purple-600 text-white py-2.5 rounded-xl font-black hover:bg-purple-700 transition shadow-sm text-xs sm:text-sm touch-manipulation active:scale-95"
                >
                  {t.enterClassBtn}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SEO CONTENT SECTION */}
      <section className="py-12 bg-white border-t border-gray-200">
        <div className={`${LAYOUT.CONTAINER} px-4 sm:px-6`}>
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-gray-900">
              {t.seoMainTitle}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {t.seoMainDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-2">🎯</div>
              <h3 className="font-bold text-gray-900 mb-1">{t.seoCard1Title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t.seoCard1Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-2">🧮</div>
              <h3 className="font-bold text-gray-900 mb-1">{t.seoCard2Title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t.seoCard2Desc}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-2xl mb-2">📱</div>
              <h3 className="font-bold text-gray-900 mb-1">{t.seoCard3Title}</h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t.seoCard3Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-12 bg-gray-50 border-t border-gray-200">
        <div className={`${LAYOUT.CONTAINER} px-4 sm:px-6 max-w-4xl mx-auto`}>
          <h2 className="text-2xl sm:text-3xl font-black text-center text-gray-900 mb-8">
            {t.faqTitle}
          </h2>
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-1">
                {t.faq1Q}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t.faq1A}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-1">
                {t.faq2Q}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t.faq2A}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-1">
                {t.faq3Q}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t.faq3A}
              </p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm">
              <h3 className="font-bold text-base text-gray-900 mb-1">
                {t.faq4Q}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                {t.faq4A}
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}