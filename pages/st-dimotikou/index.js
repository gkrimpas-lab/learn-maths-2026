import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { ST_DIMOTIKOU_MODULES, ST_DIMOTIKOU_SECTIONS } from '../../data/st-dimotikou';

const I18N = {
  el: {
    pageTitle: "Μαθηματικά ΣΤ' Δημοτικού: Θεωρία & Διαδραστικές Ασκήσεις (Όλα τα Κεφάλαια) | LearnMaths.gr",
    pageDesc: "Δωρεάν διαδραστικές ασκήσεις, θεωρία και επαναληπτικά τεστ για όλα τα κεφάλαια των Μαθηματικών ΣΤ' Δημοτικού (Κλάσματα, Εξισώσεις, Ποσοστά, Γεωμετρία, Πρότυπα).",
    backText: "Αρχική",
    badgeProgram: "ΣΤ' ΔΗΜΟΤΙΚΟΥ • ΕΠΙΣΗΜΟ ΣΧΟΛΙΚΟ ΠΡΟΓΡΑΜΜΑ",
    heroTitle: "Μαθηματικά ΣΤ' Δημοτικού",
    heroDesc: "Εξερεύνησε τα 83 κεφάλαια του σχολικού βιβλίου με διαδραστικές ασκήσεις, οπτικοποίηση εννοιών και πλήρη προετοιμασία για το Γυμνάσιο και τα Πρότυπα Σχολεία!",
    lessonsSuffix: "μαθήματα",
    seoOverviewTitle: "🎒 Η Ύλη των Μαθηματικών ΣΤ' Δημοτικού: Θεμέλια για το Γυμνάσιο",
    seoCol1Title: "Κλάσματα, ΕΚΠ & ΜΚΔ",
    seoCol1Text: "Οι μαθητές εμπεδώνουν την ανάλυση σε πρώτους παράγοντες, τον Μέγιστο Κοινό Διαιρέτη (ΜΚΔ), το Ελάχιστο Κοινό Πολλαπλάσιο (ΕΚΠ) και όλες τις πράξεις με ομώνυμα και ετερώνυμα κλάσματα.",
    seoCol2Title: "Εξισώσεις & Ποσοστά",
    seoCol2Text: "Εισαγωγή στην άλγεβρα με τη μεταβλητή (x), επίλυση απλών εξισώσεων, κατανόηση των αναλογιών, των ανάλογων και αντιστρόφως ανάλογων ποσών και πρακτική εφαρμογή στα ποσοστά.",
    seoCol3Title: "Γεωμετρία & Μετρήσεις",
    seoCol3Text: "Υπολογισμός εμβαδού και όγκου (τρίγωνο, τραπέζιο, κύκλος, κύβος, κύλινδρος), μελέτη μοτίβων και στατιστικών διαγραμμάτων (ραβδογράμματα, μέσος όρος)."
  },
  en: {
    pageTitle: "Grade 6 Mathematics: Theory & Interactive Exercises (All Chapters) | LearnMaths.gr",
    pageDesc: "Free interactive math exercises, comprehensive theory, and practice tests for all Grade 6 curriculum chapters (Fractions, Equations, Percentages, Geometry).",
    backText: "Home",
    badgeProgram: "GRADE 6 • OFFICIAL CURRICULUM",
    heroTitle: "Grade 6 Mathematics",
    heroDesc: "Explore all 83 curriculum chapters with interactive exercises, visual math models, and full preparation for Middle School and advanced exams!",
    lessonsSuffix: "lessons",
    seoOverviewTitle: "🎒 Grade 6 Mathematics Curriculum: Foundations for Middle School",
    seoCol1Title: "Fractions, LCM & GCD",
    seoCol1Text: "Students master prime factor decomposition, Greatest Common Divisor (GCD), Least Common Multiple (LCM), and operations with like and unlike fractions.",
    seoCol2Title: "Equations & Percentages",
    seoCol2Text: "Introduction to pre-algebra with variable (x), solving linear single-variable equations, direct and inverse proportion, and real-world percentage problems.",
    seoCol3Title: "Geometry & Measurement",
    seoCol3Text: "Area and volume computation (triangles, trapezoids, circles, cubes, cylinders), arithmetic patterns, and statistical analysis (bar charts, mean)."
  }
};

export default function STDimotikouIndex() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const canonicalUrl = locale === 'en' ? 'https://learnmaths.gr/en/st-dimotikou' : 'https://learnmaths.gr/st-dimotikou';
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
        
        {/* Banner Header - Cyan/Blue Theme της ΣΤ' Δημοτικού */}
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