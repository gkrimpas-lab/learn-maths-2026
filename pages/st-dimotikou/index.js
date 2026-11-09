import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ST_DIMOTIKOU_MODULES, ST_DIMOTIKOU_SECTIONS } from '../../data/st-dimotikou';

const I18N = {
  el: {
    pageTitle: "Ασκήσεις Μαθηματικών ΣΤ' Δημοτικού: Θεωρία, Άλγεβρα & Γεωμετρία | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών για τη ΣΤ' Δημοτικού: ασκήσεις άλγεβρας (κλάσματα, εξισώσεις, ποσοστά), ασκήσεις γεωμετρίας (κύκλος, εμβαδόν, όγκος) και προετοιμασία για τα Πρότυπα.",
    backText: "Αρχική",
    badgeProgram: "ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΠΙΣΗΜΟ ΣΧΟΛΙΚΟ ΠΡΟΓΡΑΜΜΑ",
    heroTitle: "Μαθηματικά ΣΤ' Δημοτικού: Θεωρία & Ασκήσεις",
    heroDesc: "Εξερεύνησε όλα τα κεφάλαια του σχολικού βιβλίου με διαδραστικές ασκήσεις μαθηματικών, προσομοιωτές άλγεβρας και γεωμετρίας και στοχευμένη προετοιμασία για το Γυμνάσιο και τα Πρότυπα Σχολεία!",
    lessonsSuffix: "μαθήματα",
    seoOverviewTitle: "🎒 Ύλη & Ασκήσεις Μαθηματικών ΣΤ' Δημοτικού",
    seoCol1Title: "Ασκήσεις Άλγεβρας: Κλάσματα, ΕΚΠ & ΜΚΔ",
    seoCol1Text: "Πλούσιες διαδραστικές ασκήσεις άλγεβρας στην ανάλυση πρώτων παραγόντων, τον Μέγιστο Κοινό Διαιρέτη (ΜΚΔ), το Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) και όλες τις πράξεις με ομώνυμα και ετερώνυμα κλάσματα.",
    seoCol2Title: "Ασκήσεις σε Εξισώσεις, Αναλογίες & Ποσοστά",
    seoCol2Text: "Εισαγωγή στην άλγεβρα με τη μεταβλητή (x), επίλυση εξισώσεων, ασκήσεις σε ανάλογα και αντιστρόφως ανάλογα ποσά, αναλογίες και πρακτικές εφαρμογές στα ποσοστά.",
    seoCol3Title: "Ασκήσεις Γεωμετρίας & Προετοιμασία Προτύπων",
    seoCol3Text: "Διαδραστικές ασκήσεις γεωμετρίας για τον υπολογισμό εμβαδού και όγκου (τρίγωνα, τραπέζια, κύκλοι, κύβοι, κύλινδροι) και απαιτητικές ασκήσεις για τις εξετάσεις στα Πρότυπα Σχολεία."
  },
  en: {
    pageTitle: "Grade 6 Mathematics Exercises: Theory, Algebra & Geometry | LearnMaths.gr",
    pageDesc: "Interactive math exercises for Grade 6: algebra modules (fractions, equations, percentages), geometry units (circles, area, volume), and Model School entrance preparation.",
    backText: "Home",
    badgeProgram: "GRADE 6 • OFFICIAL CURRICULUM",
    heroTitle: "Grade 6 Mathematics: Theory & Exercises",
    heroDesc: "Explore all curriculum chapters through dynamic math exercises, visual simulators, and comprehensive prep for Middle School and Model School entrance exams!",
    lessonsSuffix: "lessons",
    seoOverviewTitle: "🎒 Grade 6 Mathematics: Core Curriculum",
    seoCol1Title: "Algebra Exercises: Fractions, LCM & GCD",
    seoCol1Text: "Comprehensive algebra exercises covering prime factor decomposition, Greatest Common Divisor (GCD), Least Common Multiple (LCM), and operations with like and unlike fractions.",
    seoCol2Title: "Equations, Proportion & Percentages",
    seoCol2Text: "Pre-algebra exercises with variable solving, direct and inverse proportions, ratio problems, and practical percentage computations.",
    seoCol3Title: "Geometry Exercises & Model School Prep",
    seoCol3Text: "Geometry modules for area and volume calculations (triangles, trapezoids, circles, cylinders) alongside advanced practice sets for competitive entrance exams."
  }
};

export default function STDimotikouIndex() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const canonicalUrl = locale === 'en' 
    ? 'https://learnmaths.gr/en/st-dimotikou' 
    : 'https://learnmaths.gr/st-dimotikou';
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
      "educationalLevel": "Primary Education (ΣΤ' Δημοτικού)",
      "teaches": [
        "Ασκήσεις μαθηματικά",
        "Ασκήσεις μαθηματικών",
        "Ασκήσεις άλγεβρα",
        "Ασκήσεις γεωμετρία",
        "Θέματα Πρότυπα",
        "Κλάσματα και Εξισώσεις",
        "Ποσοστά και Αναλογίες",
        "Εμβαδόν και Όγκος Κύκλου και Στερεών"
      ],
      "provider": { 
        "@type": "Organization", 
        "name": "LearnMaths.gr",
        "url": "https://learnmaths.gr" 
      }
    },
    {
      "@type": "LearningResource",
      "name": t.heroTitle,
      "description": t.pageDesc,
      "learningResourceType": "Practice Problem Set & Interactive Modules",
      "educationalUse": "Primary Math Practice & Middle School Prep",
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
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10">
        
        {/* Banner Header */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-blue-900 to-indigo-900 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-cyan-700/40 text-center md:text-left">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-cyan-500/30 text-cyan-200 border border-cyan-400/30">
              {t.badgeProgram}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {t.heroTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-cyan-100/90 leading-relaxed">
              {t.heroDesc}
            </p>
          </div>
        </header>

        {/* Ενότητες Κεφαλαίων */}
        <div className="space-y-10">
          {ST_DIMOTIKOU_SECTIONS.map((sec) => {
            const sectionModules = ST_DIMOTIKOU_MODULES.filter((m) => m.section === sec.id);
            const sectionTitle = locale === 'en' && sec.titleEn ? sec.titleEn : sec.title;

            return (
              <section key={sec.id} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800">
                    {sectionTitle}
                  </h2>
                  <span className="text-xs font-bold text-cyan-700 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
                    {sectionModules.length} {t.lessonsSuffix}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
                  {sectionModules.map((mod) => {
                    const moduleLabel = locale === 'en' && mod.labelEn ? mod.labelEn : mod.label;

                    return (
                      <Link
                        key={mod.id}
                        href={mod.href}
                        locale={locale}
                        className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between group cursor-pointer min-h-[80px] touch-manipulation ${
                          mod.isReview
                            ? 'bg-amber-50/80 border-amber-300 hover:border-amber-400 hover:shadow-md hover:-translate-y-0.5'
                            : 'bg-white border-slate-200 hover:border-cyan-500 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <span className={`font-bold text-xs sm:text-sm leading-snug transition-colors ${
                          mod.isReview
                            ? 'text-amber-950 group-hover:text-amber-700'
                            : 'text-slate-800 group-hover:text-cyan-700'
                        }`}>
                          {moduleLabel}
                        </span>
                        <span className="text-sm font-bold text-slate-400 group-hover:text-cyan-600 group-hover:translate-x-1 transition-transform ml-2 shrink-0" aria-hidden="true">
                          ➔
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        {/* SEO Overview Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cyan-100 shadow-sm space-y-6 mt-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
            {t.seoOverviewTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">{t.seoCol1Title}</h3>
              <p>
                {t.seoCol1Text}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">{t.seoCol2Title}</h3>
              <p>
                {t.seoCol2Text}
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">{t.seoCol3Title}</h3>
              <p>
                {t.seoCol3Text}
              </p>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}