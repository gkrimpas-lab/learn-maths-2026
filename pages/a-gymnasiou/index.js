import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { A_GYMNASIOU_CHAPTERS, A_GYMNASIOU_SECTIONS } from '../../data/a-gymnasiou';

export default function AGymnasiouIndex() {
  const pageSchema = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://learnmaths.gr/" },
        { "@type": "ListItem", "position": 2, "name": "Μαθηματικά Α' Γυμνασίου", "item": "https://learnmaths.gr/a-gymnasiou" }
      ]
    },
    {
      "@type": "Course",
      "name": "Μαθηματικά Α' Γυμνασίου",
      "description": "Ολοκληρωμένο πρόγραμμα μαθημάτων και διαδραστικών ασκήσεων για την ύλη των Μαθηματικών της Α' Γυμνασίου (Άλγεβρα & Γεωμετρία).",
      "provider": { "@type": "Organization", "name": "LearnMaths.gr" }
    }
  ];

  return (
    <Layout
      title="Μαθηματικά Α' Γυμνασίου: Θεωρία, Ασκήσεις & Τεστ | LearnMaths.gr"
      description="Δωρεάν διαδραστικά μαθήματα, θεωρία, παραδείγματα και ασκήσεις για τα Μαθηματικά Α' Γυμνασίου σύμφωνα με το σχολικό βιβλίο (Άλγεβρα και Γεωμετρία)."
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
              Α' ΓΥΜΝΑΣΙΟΥ • ΔΙΑΔΡΑΣΤΙΚΑ ΜΑΘΗΜΑΤΑ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Μαθηματικά Α' Γυμνασίου: Θεωρία &amp; Ασκήσεις
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Εξερεύνησε τη θεωρία με δυναμικά εργαστήρια και εξασκήσου με διαδραστικές ασκήσεις και άμεσο feedback σύμφωνα με τη σχολική ύλη!
            </p>
          </div>
        </header>

        {/* Sections (Άλγεβρα, Γεωμετρία κ.λπ.) */}
        {A_GYMNASIOU_SECTIONS.map((sec) => {
          const sectionChapters = A_GYMNASIOU_CHAPTERS.filter((ch) => ch.section === sec.id);
          if (sectionChapters.length === 0) return null;

          return (
            <section key={sec.id} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-black text-slate-800 border-b border-slate-200 pb-2">
                {sec.title}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sectionChapters.map((ch) => {
                  const isItemActive = ch.active || ch.status === 'ΕΝΕΡΓΟ';
                  const badgeLabel = ch.badge || ch.tag;

                  return (
                    <article
                      key={ch.id}
                      className={`rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-200 ${
                        isItemActive
                          ? 'bg-white border-indigo-200 shadow-md hover:shadow-lg'
                          : 'bg-slate-50 border-slate-200 opacity-70'
                      }`}
                    >
                      <div className="bg-indigo-500 py-3 px-5 flex items-center justify-between text-white font-black text-sm sm:text-base">
                        <span>{badgeLabel}</span>
                        {isItemActive && (
                          <span className="text-xs bg-indigo-700/60 px-2 py-0.5 rounded-full uppercase">
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
                                href={ch.url || `/a-gymnasiou/${ch.slug}`}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] text-slate-950 font-black py-3 px-4 rounded-xl transition-all shadow-md text-xs sm:text-sm uppercase tracking-wider"
                              >
                                <span>🎯</span>
                                <span>ΕΝΑΡΞΗ ΕΠΑΝΑΛΗΨΗΣ</span>
                              </Link>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3 pt-2">
                              <Link
                                href={`/a-gymnasiou/${ch.slug}`}
                                className="text-center bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl transition shadow-sm text-xs sm:text-sm flex items-center justify-center gap-1.5"
                              >
                                <span>📖</span>
                                <span>Θεωρία</span>
                              </Link>
                              <Link
                                href={`/a-gymnasiou/${ch.slug}-ask`}
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
            📚 Ύλη Μαθηματικών Α' Γυμνασίου: Τι περιλαμβάνει το πρόγραμμα
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-base">Αριθμητική &amp; Άλγεβρα</h3>
              <p>
                Πλήρης κάλυψη στους <strong>φυσικούς, ακέραιους και ρητούς αριθμούς</strong>, τις δυνάμεις, την προτεραιότητα πράξεων και την εισαγωγή στις <strong>εξισώσεις πρώτου βαθμού</strong>.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-base">Γεωμετρία &amp; Μετρήσεις</h3>
              <p>
                Μελέτη βασικών σχημάτων, <strong>γωνιών</strong>, παραλληλίας, καθετότητας, καθώς και υπολογισμός <strong>εμβαδών και περιμέτρων</strong> με διαδραστικά σχεδιαστικά εργαλεία.
              </p>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
