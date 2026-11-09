import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { E_DIMOTIKOU_MODULES, E_DIMOTIKOU_SECTIONS } from '../../data/e-dimotikou';

const I18N = {
  el: {
    pageTitle: "Ασκήσεις Μαθηματικών Ε' Δημοτικού: Θεωρία & Ασκήσεις Online | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών για την Ε' Δημοτικού: ασκήσεις σε κλάσματα, απλοποίηση, ΕΚΠ, ΜΚΔ, ποσοστά, καθώς και ασκήσεις γεωμετρίας (τρίγωνα, εμβαδόν, όγκος).",
    backText: "Αρχική",
    badgeProgram: "Ε' ΔΗΜΟΤΙΚΟΥ • ΕΠΙΣΗΜΟ ΣΧΟΛΙΚΟ ΠΡΟΓΡΑΜΜΑ",
    heroTitle: "Μαθηματικά Ε' Δημοτικού: Θεωρία & Ασκήσεις",
    heroDesc: "Κατανόησε τα κλάσματα, το ΕΚΠ, τον ΜΚΔ, τα ποσοστά και τα γεωμετρικά σχήματα μέσα από διαδραστικούς προσομοιωτές και πλούσιες ασκήσεις μαθηματικών με άμεση επαλήθευση!",
    lessonsSuffix: "μαθήματα",
    seoOverviewTitle: "🎒 Ύλη & Ασκήσεις Μαθηματικών Ε' Δημοτικού",
    seoCol1Title: "Ασκήσεις σε Κλάσματα & Διαιρετότητα",
    seoCol1Text: "Διαδραστικές ασκήσεις άλγεβρας στα ισοδύναμα κλάσματα, την απλοποίηση, την πρόσθεση και αφαίρεση ετερώνυμων κλασμάτων, καθώς και στον υπολογισμό ΕΚΠ και ΜΚΔ.",
    seoCol2Title: "Ασκήσεις σε Ποσοστά & Μέση Τιμή",
    seoCol2Text: "Πρακτικές ασκήσεις μαθηματικών στην επεξεργασία δεδομένων, τον υπολογισμό μέσης τιμής και την επίλυση προβλημάτων καθημερινής ζωής με ποσοστά (%).",
    seoCol3Title: "Ασκήσεις Γεωμετρίας & Μετρήσεων",
    seoCol3Text: "Πλούσιες ασκήσεις γεωμετρίας για τη μελέτη και κατηγοριοποίηση τριγώνων, τα κανονικά πολύγωνα, την αξονική συμμετρία και τον υπολογισμό περιμέτρου, εμβαδού και όγκου."
  },
  en: {
    pageTitle: "Grade 5 Mathematics Exercises: Theory & Interactive Practice | LearnMaths.gr",
    pageDesc: "Interactive math exercises for Grade 5: fractions, simplification, LCM, GCD, percentages, and geometry modules (triangles, area, volume).",
    backText: "Home",
    badgeProgram: "GRADE 5 • OFFICIAL CURRICULUM",
    heroTitle: "Grade 5 Mathematics: Theory & Exercises",
    heroDesc: "Master fractions, LCM, GCD, percentages, and geometric figures through interactive simulators and targeted math exercises with instant grading!",
    lessonsSuffix: "lessons",
    seoOverviewTitle: "🎒 Grade 5 Mathematics: Core Curriculum",
    seoCol1Title: "Fractions & Divisibility Exercises",
    seoCol1Text: "Interactive algebra problems covering equivalent fractions, simplification, fraction arithmetic, and calculating LCM and GCD with divisibility rules.",
    seoCol2Title: "Percentages & Mean Problem Sets",
    seoCol2Text: "Applied math exercises focused on data handling, calculating the arithmetic mean, and solving real-world percentage (%) word problems.",
    seoCol3Title: "Geometry & Measurement Exercises",
    seoCol3Text: "Targeted geometry problems on triangle classification, regular polygons, symmetry axes, perimeter, area, and 3D volume calculations."
  }
};

export default function EDimotikouIndex() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const canonicalUrl = locale === 'en' 
    ? 'https://learnmaths.gr/en/e-dimotikou' 
    : 'https://learnmaths.gr/e-dimotikou';
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
      "educationalLevel": "Primary Education (Ε' Δημοτικού)",
      "teaches": [
        "Ασκήσεις μαθηματικά",
        "Ασκήσεις μαθηματικών",
        "Ασκήσεις άλγεβρα",
        "Ασκήσεις γεωμετρία",
        "Κλάσματα και Απλοποίηση",
        "ΕΚΠ και ΜΚΔ",
        "Ποσοστά",
        "Εμβαδόν και Όγκος"
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
      "educationalUse": "Primary Math Practice",
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
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-teal-900 to-blue-950 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-cyan-700/40 text-center md:text-left">
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
          {E_DIMOTIKOU_SECTIONS.map((sec) => {
            const sectionModules = E_DIMOTIKOU_MODULES.filter((m) => m.section === sec.id);
            const sectionTitle = locale === 'en' && sec.titleEn ? sec.titleEn : sec.title;

            return (
              <section key={sec.id} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800">
                    {sectionTitle}
                  </h2>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
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
                            : 'bg-white border-slate-200 hover:border-teal-500 hover:shadow-md hover:-translate-y-0.5'
                        }`}
                      >
                        <span className={`font-bold text-xs sm:text-sm leading-snug transition-colors ${
                          mod.isReview
                            ? 'text-amber-950 group-hover:text-amber-700'
                            : 'text-slate-800 group-hover:text-teal-700'
                        }`}>
                          {moduleLabel}
                        </span>
                        <span className="text-sm font-bold text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform ml-2 shrink-0" aria-hidden="true">
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
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-teal-100 shadow-sm space-y-6 mt-8">
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