import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import { G_GYMNASIOU_CHAPTERS, G_GYMNASIOU_SECTIONS } from '../../data/g-gymnasiou';

const I18N = {
  el: {
    pageTitle: "Μαθηματικά Γ' Γυμνασίου (Νέα Ύλη 2027-2028): Θεωρία & Ασκήσεις | LearnMaths.gr",
    pageDesc: "Δωρεάν διαδραστικά μαθήματα, θεωρία και ασκήσεις για τα Μαθηματικά Γ' Γυμνασίου σύμφωνα με τα νέα σχολικά βιβλία 2027-2028 (Πραγματικοί Αριθμοί, Μονώνυμα, Πολυώνυμα, Ταυτότητες).",
    backText: "Αρχική",
    badgeProgram: "Γ' ΓΥΜΝΑΣΙΟΥ • ΝΕΑ ΥΛΗ & ΒΙΒΛΙΑ 2027–2028",
    heroTitle: "Μαθηματικά Γ' Γυμνασίου: Θεωρία & Ασκήσεις",
    heroDesc: "Εξερεύνησε τη θεωρία με δυναμικά εργαστήρια και εξασκήσου με διαδραστικές ασκήσεις προσαρμοσμένες στη νέα σειρά διδασκαλίας 2027–2028!",
    statusActive: "ΕΝΕΡΓΟ",
    statusSoon: "ΣΥΝΤΟΜΑ ΔΙΑΘΕΣΙΜΟ",
    startReviewBtn: "ΕΝΑΡΞΗ ΕΠΑΝΑΛΗΨΗΣ",
    theoryBtn: "Θεωρία",
    exercisesBtn: "Ασκήσεις",
    seoOverviewTitle: "📚 Ύλη Μαθηματικών Γ' Γυμνασίου: Σύμφωνα με τα Νέα Βιβλία (2027–2028)",
    seoCol1Title: "Πραγματικοί Αριθμοί & Αλγεβρικές Παραστάσεις",
    seoCol1Text: "Η Γ' Γυμνασίου αποτελεί τη γέφυρα για το Λύκειο. Καλύπτει σε βάθος τους πραγματικούς αριθμούς (ρητούς και άρρητους), τις πράξεις με μονώνυμα και πολυώνυμα, τις ταυτότητες και την παραγοντοποίηση.",
    seoCol2Title: "Γεωμετρία, Τριγωνομετρία & Εξισώσεις",
    seoCol2Text: "Με διαδραστικά εργαλεία και αυτόματη αξιολόγηση, οι μαθητές εμπεδώνουν την ισότητα και ομοιότητα τριγώνων, τους τριγωνομετρικούς αριθμούς και την επίλυση εξισώσεων δευτέρου βαθμού."
  },
  en: {
    pageTitle: "Grade 9 Mathematics (Curriculum 2027-2028): Theory & Exercises | LearnMaths.gr",
    pageDesc: "Free interactive lessons, theory, and exercises for Grade 9 Mathematics based on modern textbooks (Real Numbers, Polynomials, Special Products, Geometry).",
    backText: "Home",
    badgeProgram: "GRADE 9 • NEW CURRICULUM 2027–2028",
    heroTitle: "Grade 9 Mathematics: Theory & Exercises",
    heroDesc: "Explore theory through dynamic labs and practice with interactive exercises structured according to the modern curriculum framework!",
    statusActive: "ACTIVE",
    statusSoon: "COMING SOON",
    startReviewBtn: "START REVIEW",
    theoryBtn: "Theory",
    exercisesBtn: "Exercises",
    seoOverviewTitle: "📚 Grade 9 Mathematics Curriculum: Key Topics",
    seoCol1Title: "Real Numbers & Algebraic Expressions",
    seoCol1Text: "Grade 9 serves as the bridge to High School. It covers real numbers (rationals and irrationals) in depth, operations with monomials and polynomials, algebraic identities, and factoring.",
    seoCol2Title: "Geometry, Trigonometry & Equations",
    seoCol2Text: "Through interactive tools and instant feedback, students master triangle congruence, similarity, trigonometric ratios, and quadratic equations."
  }
};

export default function GGymnasiouIndex() {
  const router = useRouter();
  const locale = router.locale === 'en' ? 'en' : 'el';
  const t = I18N[locale];

  const canonicalUrl = locale === 'en' ? 'https://learnmaths.gr/en/g-gymnasiou' : 'https://learnmaths.gr/g-gymnasiou';
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
        
        {/* Banner Header */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              {t.badgeProgram}
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              {t.heroTitle}
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              {t.heroDesc}
            </p>
          </div>
        </header>

        {/* Dynamic Sections (Άλγεβρα, Γεωμετρία) */}
        {G_GYMNASIOU_SECTIONS.map((sec) => {
          const sectionChapters = G_GYMNASIOU_CHAPTERS.filter((ch) => ch.section === sec.id);
          if (sectionChapters.length === 0) return null;

          const sectionTitle = locale === 'en' && sec.titleEn ? sec.titleEn : sec.title;

          return (
            <section key={sec.id} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 border-b border-slate-200 pb-2">
                {sectionTitle}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sectionChapters.map((ch) => {
                  const isItemActive = ch.active;
                  const badgeLabel = locale === 'en' && ch.badgeEn ? ch.badgeEn : ch.badge;
                  const chapterTitle = locale === 'en' && ch.titleEn ? ch.titleEn : ch.title;
                  const chapterDesc = locale === 'en' && ch.descEn ? ch.descEn : ch.desc;
                  const chapterIcon = ch.icon || '📘';

                  return (
                    <article
                      key={ch.id}
                      className={`rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-200 ${
                        isItemActive
                          ? 'bg-white border-indigo-200 shadow-md hover:shadow-lg'
                          : 'bg-slate-50 border-slate-200 opacity-70'
                      }`}
                    >
                      <div className="bg-indigo-600 py-3 px-5 flex items-center justify-between text-white font-black text-sm sm:text-base">
                        <div className="flex items-center gap-2">
                          <span>{chapterIcon}</span>
                          <span>{badgeLabel}</span>
                        </div>
                        {isItemActive && (
                          <span className="text-xs bg-indigo-800/80 px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                            {t.statusActive}
                          </span>
                        )}
                      </div>

                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                            {chapterTitle}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {chapterDesc}
                          </p>
                        </div>

                        {isItemActive ? (
                          ch.isReview ? (
                            <div className="pt-2">
                              <Link
                                href={`/g-gymnasiou/${ch.slug}`}
                                locale={locale}
                                className="flex items-center justify-center w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-black py-2.5 px-4 rounded-xl transition shadow-md text-xs sm:text-sm tracking-wide touch-manipulation cursor-pointer"
                              >
                                <span>🎯</span>
                                <span className="ml-1.5">{t.startReviewBtn}</span>
                              </Link>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <Link
                                href={`/g-gymnasiou/${ch.slug}`}
                                locale={locale}
                                className="text-center bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl transition shadow-sm text-xs sm:text-sm flex items-center justify-center gap-1.5 touch-manipulation cursor-pointer"
                              >
                                <span>📖</span>
                                <span>{t.theoryBtn}</span>
                              </Link>
                              <Link
                                href={`/g-gymnasiou/${ch.slug}-ask`}
                                locale={locale}
                                className="text-center bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold py-2.5 px-3 rounded-xl transition shadow-sm text-xs sm:text-sm flex items-center justify-center gap-1.5 touch-manipulation cursor-pointer"
                              >
                                <span>🎯</span>
                                <span>{t.exercisesBtn}</span>
                              </Link>
                            </div>
                          )
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="w-full bg-slate-200 text-slate-500 font-bold py-2.5 rounded-xl cursor-not-allowed text-xs sm:text-sm uppercase tracking-wider"
                          >
                            {t.statusSoon}
                          </button>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}

        {/* SEO Overview Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-indigo-100 shadow-sm space-y-6 mt-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
            {t.seoOverviewTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-base">{t.seoCol1Title}</h3>
              <p>
                {t.seoCol1Text}
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-base">{t.seoCol2Title}</h3>
              <p>
                {t.seoCol2Text}
              </p>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}