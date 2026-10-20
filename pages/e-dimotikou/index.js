import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { E_DIMOTIKOU_MODULES, E_DIMOTIKOU_SECTIONS } from '../../data/e-dimotikou';

export default function EDimotikouIndex() {
  const pageSchema = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://learnmaths.gr/" },
        { "@type": "ListItem", "position": 2, "name": "Μαθηματικά Ε' Δημοτικού", "item": "https://learnmaths.gr/e-dimotikou" }
      ]
    },
    {
      "@type": "Course",
      "name": "Μαθηματικά Ε' Δημοτικού",
      "description": "Διαδραστικά μαθήματα, θεωρία, παραδείγματα και ασκήσεις για τα Μαθηματικά Ε' Δημοτικού σύμφωνα με το σχολικό βιβλίο του ΙΕΠ.",
      "provider": { "@type": "Organization", "name": "LearnMaths.gr" }
    }
  ];

  return (
    <Layout
      title="Μαθηματικά Ε' Δημοτικού: Θεωρία & Διαδραστικές Ασκήσεις | LearnMaths.gr"
      description="Δωρεάν διαδραστικές ασκήσεις και θεωρία για τα Μαθηματικά Ε' Δημοτικού (Κλάσματα, ΕΚΠ, ΜΚΔ, Ποσοστά, Γεωμετρία, Εμβαδόν & Όγκος)."
      schemaData={pageSchema}
      backUrl="/"
      backText="Αρχική"
      showAds={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10">
        
        {/* Banner Header - Cyan/Teal Theme της Ε' Δημοτικού */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-900 via-teal-900 to-blue-950 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-cyan-700/40 text-center md:text-left">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-cyan-500/30 text-cyan-200 border border-cyan-400/30">
              Ε' ΔΗΜΟΤΙΚΟΥ • ΕΠΙΣΗΜΟ ΣΧΟΛΙΚΟ ΠΡΟΓΡΑΜΜΑ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Μαθηματικά Ε' Δημοτικού
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-cyan-100/90 leading-relaxed">
              Κατανόησε τα κλάσματα, το ΕΚΠ, τον ΜΚΔ και τις γεωμετρικές έννοιες μέσα από διαδραστικούς προσομοιωτές και πρακτικές ασκήσεις με άμεσο feedback!
            </p>
          </div>
        </header>

        {/* Ενότητες Κεφαλαίων */}
        <div className="space-y-10">
          {E_DIMOTIKOU_SECTIONS.map((sec) => {
            const sectionModules = E_DIMOTIKOU_MODULES.filter((m) => m.section === sec.id);

            return (
              <section key={sec.id} className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                  <h2 className="text-lg sm:text-xl md:text-2xl font-black text-slate-800">
                    {sec.title}
                  </h2>
                  <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                    {sectionModules.length} μαθήματα
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 sm:gap-5">
                  {sectionModules.map((mod) => (
                    <Link
                      key={mod.id}
                      href={mod.href}
                      className={`p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-center justify-between group cursor-pointer min-h-[80px] ${
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
                        {mod.label}
                      </span>
                      <span className="text-sm font-bold text-slate-400 group-hover:text-teal-600 group-hover:translate-x-1 transition-transform ml-2 shrink-0">
                        ➔
                      </span>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        {/* SEO Overview Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-teal-100 shadow-sm space-y-6 mt-8">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
            🎒 Ύλη Μαθηματικών Ε' Δημοτικού: Βασικοί Άξονες Μάθησης
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">Κλάσματα &amp; Διαιρετότητα</h3>
              <p>
                Η Ε' Δημοτικού εμβαθύνει στα <strong>ισοδύναμα κλάσματα</strong>, την <strong>απλοποίηση</strong>, την αναγωγή στην κλασματική μονάδα, καθώς και στον υπολογισμό του <strong>ΕΚΠ</strong> και του <strong>ΜΚΔ</strong> με κριτήρια διαιρετότητας.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">Μέση Τιμή &amp; Ποσοστά</h3>
              <p>
                Εισαγωγή στην επεξεργασία δεδομένων με την έννοια της <strong>μέσης τιμής</strong> και στα πρώτα πρακτικά προβλήματα με <strong>ποσοστά (%)</strong> στην καθημερινή ζωή.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">Γεωμετρία &amp; Μετρήσεις</h3>
              <p>
                Μελέτη των <strong>ειδών τριγώνων</strong> (ως προς πλευρές και γωνίες), κανονικών πολυγώνων, αξονικής συμμετρίας και υπολογισμός <strong>περιμέτρου, εμβαδού και όγκου</strong> στερεών σωμάτων.
              </p>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
