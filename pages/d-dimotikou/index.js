import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { D_DIMOTIKOU_MODULES, D_DIMOTIKOU_SECTIONS } from '../../data/d-dimotikou';

export default function DDimotikouIndex() {
  const pageSchema = [
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Αρχική", "item": "https://learnmaths.gr/" },
        { "@type": "ListItem", "position": 2, "name": "Μαθηματικά Δ' Δημοτικού", "item": "https://learnmaths.gr/d-dimotikou" }
      ]
    },
    {
      "@type": "Course",
      "name": "Μαθηματικά Δ' Δημοτικού",
      "description": "Διαδραστικά μαθήματα, θεωρία, παραδείγματα και ασκήσεις για τα Μαθηματικά Δ' Δημοτικού σύμφωνα με το σχολικό βιβλίο του ΙΕΠ.",
      "provider": { "@type": "Organization", "name": "LearnMaths.gr" }
    }
  ];

  return (
    <Layout
      title="Μαθηματικά Δ' Δημοτικού: Θεωρία & Διαδραστικές Ασκήσεις | LearnMaths.gr"
      description="Δωρεάν διαδραστικές ασκήσεις και θεωρία για τα Μαθηματικά Δ' Δημοτικού (Μεγάλοι Αριθμοί, Κλάσματα, Δεκαδικοί, Διαίρεση, Γεωμετρία, Περίμετρος & Εμβαδόν)."
      schemaData={pageSchema}
      backUrl="/"
      backText="Αρχική"
      showAds={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-10">
        
        {/* Banner Header - Teal Theme της Δ' Δημοτικού */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-900 via-cyan-900 to-blue-950 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-teal-700/40 text-center md:text-left">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-teal-500/30 text-teal-200 border border-teal-400/30">
              Δ' ΔΗΜΟΤΙΚΟΥ • ΕΠΙΣΗΜΟ ΣΧΟΛΙΚΟ ΠΡΟΓΡΑΜΜΑ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Μαθηματικά Δ' Δημοτικού
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-teal-100/90 leading-relaxed">
              Εξερεύνησε τους μεγάλους αριθμούς, τα δεκαδικά κλάσματα, τις κάθετες πράξεις και τα γεωμετρικά σχήματα μέσα από διαδραστικά εργαλεία και παραδείγματα!
            </p>
          </div>
        </header>

        {/* Ενότητες Κεφαλαίων */}
        <div className="space-y-10">
          {D_DIMOTIKOU_SECTIONS.map((sec) => {
            const sectionModules = D_DIMOTIKOU_MODULES.filter((m) => m.section === sec.id);

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
            🎒 Ύλη Μαθηματικών Δ' Δημοτικού: Βασικοί Άξονες Μάθησης
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">Αριθμοί &amp; Πράξεις</h3>
              <p>
                Οι μαθητές εξοικειώνονται με αριθμούς έως το <strong>100.000</strong>, τον πολλαπλασιασμό με διψήφιο και τριψήφιο αριθμό, τη <strong>διαίρεση με διψήφιο διαιρέτη</strong> και την αναγωγή στη μονάδα.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">Δεκαδικοί &amp; Κλάσματα</h3>
              <p>
                Εισαγωγή στα <strong>δεκαδικά κλάσματα</strong> και τη σχέση τους με τους <strong>δεκαδικούς αριθμούς</strong> (έως τρία δεκαδικά ψηφία), καθώς και πράξεις πολλαπλασιασμού και διαίρεσης με το 10, 100, 1.000.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800 text-base">Γεωμετρία &amp; Μετρήσεις</h3>
              <p>
                Μελέτη παραλλήλων και τεμνόμενων ευθειών, ειδών τετραπλεύρων, αξονικής συμμετρίας, μέτρησης <strong>μήκους, μάζας, χρόνου και χωρητικότητας</strong>, καθώς και εισαγωγή στην περίμετρο και το <strong>εμβαδόν</strong>.
              </p>
            </div>
          </div>
        </section>

      </div>
    </Layout>
  );
}
