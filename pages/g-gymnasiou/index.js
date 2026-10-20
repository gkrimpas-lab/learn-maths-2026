import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { G_GYMNASIOU_CHAPTERS, G_GYMNASIOU_SECTIONS } from '../../data/g-gymnasiou';

export default function GGymnasiouIndex() {
  const pageSchema = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://learnmaths.gr/" },
        { "@type": "ListItem", "position": 2, "name": "Μαθηματικά Γ' Γυμνασίου", "item": "https://learnmaths.gr/g-gymnasiou" }
      ]
    },
    {
      "@type": "Course",
      "name": "Μαθηματικά Γ' Γυμνασίου (Νέα Βιβλία 2027-2028)",
      "description": "Διαδραστικά μαθήματα, θεωρία, παραδείγματα και ασκήσεις για τα Μαθηματικά Γ' Γυμνασίου με βάση τα νέα σχολικά βιβλία 2027-2028.",
      "provider": { "@type": "Organization", "name": "LearnMaths.gr" }
    }
  ];

  return (
    <Layout
      title="Μαθηματικά Γ' Γυμνασίου (Νέα Ύλη 2027-2028): Θεωρία & Ασκήσεις | LearnMaths.gr"
      description="Δωρεάν διαδραστικά μαθήματα, θεωρία και ασκήσεις για τα Μαθηματικά Γ' Γυμνασίου σύμφωνα με τα νέα σχολικά βιβλία 2027-2028 (Πραγματικοί Αριθμοί, Μονώνυμα, Πολυώνυμα, Ταυτότητες)."
      schemaData={pageSchema}
      backUrl="/"
      backText="Αρχική"
      showAds={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10">
        
        {/* Banner Header */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Γ' ΓΥΜΝΑΣΙΟΥ • ΝΕΑ ΥΛΗ &amp; ΒΙΒΛΙΑ 2027–2028
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Μαθηματικά Γ' Γυμνασίου: Θεωρία &amp; Ασκήσεις
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Εξερεύνησε τη θεωρία με δυναμικά εργαστήρια και εξασκήσου με διαδραστικές ασκήσεις προσαρμοσμένες στη νέα σειρά διδασκαλίας 2027–2028!
            </p>
          </div>
        </header>

        {/* Dynamic Sections (Άλγεβρα, Γεωμετρία) */}
        {G_GYMNASIOU_SECTIONS.map((sec) => {
          const sectionChapters = G_GYMNASIOU_CHAPTERS.filter((ch) => ch.section === sec.id);
          if (sectionChapters.length === 0) return null;

          return (
            <section key={sec.id} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 border-b border-slate-200 pb-2">
                {sec.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sectionChapters.map((ch) => {
                  const isItemActive = ch.active;

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
                        <span>{ch.badge}</span>
                        {isItemActive && (
                          <span className="text-xs bg-indigo-800/80 px-2 py-0.5 rounded-full uppercase">
                            ΕΝΕΡΓΟ
                          </span>
                        )}
                      </div>

                      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                        <div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                            {ch.title}
                          </h3>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {ch.desc}
                          </p>
                        </div>

                        {isItemActive ? (
                          ch.isReview ? (
                            <div className="pt-2">
                              <Link
                                href={`/g-gymnasiou/${ch.slug}`}
                                className="flex items-center justify-center w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-95 text-slate-950 font-black py-2.5 px-4 rounded-xl transition shadow-md text-xs sm:text-sm tracking-wide"
                              >
                                🎯 {ch.badge}
                              </Link>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <Link
                                href={`/g-gymnasiou/${ch.slug}`}
                                className="text-center bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl transition shadow-sm text-xs sm:text-sm flex items-center justify-center gap-1.5"
                              >
                                <span>📖</span>
                                <span>Θεωρία</span>
                              </Link>
                              <Link
                                href={`/g-gymnasiou/${ch.slug}-ask`}
                                className="text-center bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold py-2.5 px-3 rounded-xl transition shadow-sm text-xs sm:text-sm flex items-center justify-center gap-1.5"
                              >
                                <span>🎯</span>
                                <span>Ασκήσεις</span>
                              </Link>
                            </div>
                          )
                        ) : (
                          <button
                            disabled
                            className="w-full bg-slate-300 text-slate-600 font-bold py-2.5 rounded-xl cursor-not-allowed text-xs sm:text-sm uppercase tracking-wider"
                          >
                            ΣΥΝΤΟΜΑ ΔΙΑΘΕΣΙΜΟ
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
            📚 Ύλη Μαθηματικών Γ' Γυμνασίου: Σύμφωνα με τα Νέα Βιβλία (2027–2028)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-base">Πραγματικοί Αριθμοί &amp; Αλγεβρικές Παραστάσεις</h3>
              <p>
                Η Γ' Γυμνασίου αποτελεί τη γέφυρα για το Λύκειο. Καλύπτει σε βάθος τους <strong>πραγματικούς αριθμούς</strong> (ρητούς και άρρητους), τις πράξεις με <strong>μονώνυμα και πολυώνυμα</strong>, τις ταυτότητες και την παραγοντοποίηση.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-base">Γεωμετρία, Τριγωνομετρία &amp; Εξισώσεις</h3>
              <p>
                Με διαδραστικά εργαλεία και αυτόματη αξιολόγηση, οι μαθητές εμπεδώνουν την <strong>ισότητα και ομοιότητα τριγώνων</strong>, τους τριγωνομετρικούς αριθμούς και την επίλυση <strong>εξισώσεων δευτέρου βαθμού</strong>.
              </p>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
