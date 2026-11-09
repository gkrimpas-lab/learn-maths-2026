import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { D_DIMOTIKOU_MODULES, D_DIMOTIKOU_SECTIONS } from '../../data/d-dimotikou';

const I18N = {
  el: {
    pageTitle: "Ασκήσεις Μαθηματικών Δ' Δημοτικού: Θεωρία & Ασκήσεις Online | LearnMaths.gr",
    pageDesc: "Διαδραστικές ασκήσεις μαθηματικών για τη Δ' Δημοτικού: ασκήσεις αριθμητικής (μεγάλοι αριθμοί, κλάσματα, δεκαδικοί, διαίρεση) και ασκήσεις γεωμετρίας (σχήματα, περίμετρος, εμβαδόν).",
    backText: "Αρχική",
    badgeProgram: "Δ' ΔΗΜΟΤΙΚΟΥ • ΕΠΙΣΗΜΟ ΣΧΟΛΙΚΟ ΠΡΟΓΡΑΜΜΑ",
    heroTitle: "Μαθηματικά Δ' Δημοτικού: Θεωρία & Ασκήσεις",
    heroDesc: "Μάθε τα μαθηματικά της Δ' Δημοτικού διαδραστικά! Λύσε ασκήσεις μαθηματικών στους μεγάλους αριθμούς, τα κλάσματα, τις κάθετες πράξεις και ασκήσεις γεωμετρίας με άμεση επαλήθευση.",
    lessonsSuffix: "μαθήματα",
    seoOverviewTitle: "🎒 Ύλη & Ασκήσεις Μαθηματικών Δ' Δημοτικού",
    seoCol1Title: "Ασκήσεις Αριθμητικής & Πράξεων",
    seoCol1Text: "Διαδραστικές ασκήσεις μαθηματικών στους αριθμούς έως το 100.000, κάθετο πολλαπλασιασμό, κάθετη διαίρεση με διψήφιο διαιρέτη και προβλήματα αναγωγής στη μονάδα.",
    seoCol2Title: "Ασκήσεις σε Κλάσματα & Δεκαδικούς",
    seoCol2Text: "Εμπέδωση στα δεκαδικά κλάσματα, μετατροπή σε δεκαδικούς αριθμούς και στοχευμένες ασκήσεις πολλαπλασιασμού και διαίρεσης με το 10, 100 και 1.000.",
    seoCol3Title: "Ασκήσεις Γεωμετρίας & Μετρήσεων",
    seoCol3Text: "Πλούσιες ασκήσεις γεωμετρίας σε παράλληλες και κάθετες ευθείες, αναγνώριση τετραπλεύρων, άξονες συμμετρίας, μονάδες μέτρησης και υπολογισμό περιμέτρου και εμβαδού."
  },
  en: {
    pageTitle: "Grade 4 Mathematics Exercises: Theory & Interactive Practice | LearnMaths.gr",
    pageDesc: "Interactive math exercises for Grade 4: arithmetic problem sets (large numbers, fractions, decimals, division) and geometry modules (perimeter, area, symmetry).",
    backText: "Home",
    badgeProgram: "GRADE 4 • OFFICIAL CURRICULUM",
    heroTitle: "Grade 4 Mathematics: Theory & Exercises",
    heroDesc: "Explore Grade 4 mathematics interactively! Practice arithmetic problem sets, fraction models, vertical long division, and geometry problems with instant feedback.",
    lessonsSuffix: "lessons",
    seoOverviewTitle: "🎒 Grade 4 Mathematics: Core Curriculum",
    seoCol1Title: "Arithmetic & Operations Exercises",
    seoCol1Text: "Interactive math problems covering whole numbers up to 100,000, multi-digit multiplication, long division with two-digit divisors, and unitary method problems.",
    seoCol2Title: "Fractions & Decimals Practice",
    seoCol2Text: "Exercises on decimal fractions, decimal place values, and multiplication/division with powers of 10 (10, 100, 1,000).",
    seoCol3Title: "Geometry & Measurement Exercises",
    seoCol3Text: "Targeted geometry problems on parallel and perpendicular lines, quadrilaterals, line symmetry, units of measurement, perimeter, and area."
  }
};

export default function DDimotikouIndex() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const canonicalUrl = locale === 'en' 
    ? 'https://learnmaths.gr/en/d-dimotikou' 
    : 'https://learnmaths.gr/d-dimotikou';
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
      "educationalLevel": "Primary Education (Δ' Δημοτικού)",
      "teaches": [
        "Ασκήσεις μαθηματικά",
        "Ασκήσεις μαθηματικών",
        "Ασκήσεις γεωμετρία",
        "Μεγάλοι Αριθμοί",
        "Κλάσματα και Δεκαδικοί",
        "Κάθετη Διαίρεση",
        "Περίμετρος και Εμβαδόν"
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