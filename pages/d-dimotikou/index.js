import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { D_DIMOTIKOU_MODULES, D_DIMOTIKOU_SECTIONS } from '../../data/d-dimotikou';

const I18N = {
  el: {
    pageTitle: "Μαθηματικά Δ' Δημοτικού: Θεωρία & Διαδραστικές Ασκήσεις | LearnMaths.gr",
    pageDesc: "Δωρεάν διαδραστικές ασκήσεις και θεωρία για τα Μαθηματικά Δ' Δημοτικού (Μεγάλοι Αριθμοί, Κλάσματα, Δεκαδικοί, Διαίρεση, Γεωμετρία, Περίμετρος & Εμβαδόν).",
    backText: "Αρχική",
    badgeProgram: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΠΙΣΗΜΟ ΣΧΟΛΙΚΟ ΠΡΟΓΡΑΜΜΑ",
    heroTitle: "Μαθηματικά Δ' Δημοτικού",
    heroDesc: "Εξερεύνησε τους μεγάλους αριθμούς, τα δεκαδικά κλάσματα, τις κάθετες πράξεις και τα γεωμετρικά σχήματα μέσα από διαδραστικά εργαλεία και παραδείγματα!",
    lessonsSuffix: "μαθήματα",
    seoOverviewTitle: "🎒 Ύλη Μαθηματικών Δ' Δημοτικού: Βασικοί Άξονες Μάθησης",
    seoCol1Title: "Αριθμοί & Πράξεις",
    seoCol1Text: "Οι μαθητές εξοικειώνονται με αριθμούς έως το 100.000, τον πολλαπλασιασμό με διψήφιο και τριψήφιο αριθμό, τη διαίρεση με διψήφιο διαιρέτη και την αναγωγή στη μονάδα.",
    seoCol2Title: "Δεκαδικοί & Κλάσματα",
    seoCol2Text: "Εισαγωγή στα δεκαδικά κλάσματα και τη σχέση τους με τους δεκαδικούς αριθμούς (έως τρία δεκαδικά ψηφία), καθώς και πράξεις πολλαπλασιασμού και διαίρεσης με το 10, 100, 1.000.",
    seoCol3Title: "Γεωμετρία & Μετρήσεις",
    seoCol3Text: "Μελέτη παραλλήλων και τεμνόμενων ευθειών, ειδών τετραπλεύρων, αξονικής συμμετρίας, μέτρησης μήκους, μάζας, χρόνου και χωρητικότητας, καθώς και εισαγωγή στην περίμετρο και το εμβαδόν."
  },
  en: {
    pageTitle: "Grade 4 Mathematics: Theory & Interactive Exercises | LearnMaths.gr",
    pageDesc: "Free interactive exercises and theory for Grade 4 Mathematics (Large Numbers, Fractions, Decimals, Long Division, Geometry, Perimeter & Area).",
    backText: "Home",
    badgeProgram: "GRADE 4 • OFFICIAL CURRICULUM",
    heroTitle: "Grade 4 Mathematics",
    heroDesc: "Explore large numbers, decimal fractions, vertical operations, and geometric shapes through interactive visual tools and applied problems!",
    lessonsSuffix: "lessons",
    seoOverviewTitle: "🎒 Grade 4 Mathematics Curriculum: Core Learning Pillars",
    seoCol1Title: "Numbers & Operations",
    seoCol1Text: "Students master numbers up to 100,000, multi-digit multiplication, division by two-digit divisors, and the unitary method for problem solving.",
    seoCol2Title: "Decimals & Fractions",
    seoCol2Text: "Introduction to decimal fractions, conversion to decimal numbers (up to three decimal places), and multiplication/division by 10, 100, 1,000.",
    seoCol3Title: "Geometry & Measurement",
    seoCol3Text: "Study of parallel and intersecting lines, quadrilaterals, line symmetry, measuring length, mass, time, capacity, and early work with perimeter and area."
  }
};

export default function DDimotikouIndex() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const canonicalUrl = locale === 'en' ? 'https://learnmaths.gr/en/d-dimotikou' : 'https://learnmaths.gr/d-dimotikou';
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
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10">
        
        {/* Banner Header - Teal Theme της Δ' Δημοτικού */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-950 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-teal-700/40 text-center md:text-left">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-teal-500/30 text-teal-200 border border-teal-400/30">
              {t.badgeProgram}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {t.heroTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-teal-100/90 leading-relaxed">
              {t.heroDesc}
            </p>
          </div>
        </header>

        {/* Ενότητες Κεφαλαίων */}
        <div className="space-y-10">
          {D_DIMOTIKOU_SECTIONS.map((sec) => {
            const sectionModules = D_DIMOTIKOU_MODULES.filter((m) => m.section === sec.id);
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