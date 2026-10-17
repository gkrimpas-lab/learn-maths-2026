import React from 'react';
import Link from 'next/link';
import Layout from '../../components/Layout';

const CHAPTERS = [
  {
    id: '01',
    slug: '01-dekadiki-morfi-riton',
    title: 'Δεκαδική Μορφή Ρητών Αριθμών',
    desc: 'Ρητός, Περιοδικός δεκαδικός αριθμός, Περίοδος.',
    badge: 'ΚΕΦΑΛΑΙΟ 01',
    active: true,
  },
  {
    id: '02',
    slug: '02-dekadiki-morfi-arriton',
    title: 'Δεκαδική Μορφή των Άρρητων Αριθμών',
    desc: 'Άρρητοι, Ρητές προσεγγίσεις.',
    badge: 'ΚΕΦΑΛΑΙΟ 02',
    active: true,
  },
   {
    id: '03',
    slug: '03-pragmatikoi',
    title: 'Πραγματικοί Αριθμοί',
    desc: 'Σύνολο πραγματικών, διάταξη πραγματικών.',
    badge: 'ΚΕΦΑΛΑΙΟ 03',
    active: true,
  },
  {
    id: '10',
    slug: '10-mononima-polionima',
    title: 'Μονώνυμα - Πολυώνυμα',
    desc: 'Μονώνυμα, πρόσθεση, αφαίρεση, πολλαπλασιασμός διαίρεση μονωνύμων.',
    badge: 'ΚΕΦΑΛΑΙΟ 10',
    active: true,
  },
  {
    id: '11',
    slug: '11-prosthesi-afairesi-polionimon',
    title: 'Πρόσθεση Αφαίρεση Πολυώνυμων',
    desc: 'Πρόσθεση - αφαίρεση πολυωνύμων.',
    badge: 'ΚΕΦΑΛΑΙΟ 11',
    active: true,
  },
  
];

export default function AGymnasiouIndex() {
  return (
    <Layout
      title="Μαθηματικά Γ' Γυμνασίου | LearnMaths.gr"
      description="Διαδραστικά μαθήματα, θεωρία και ασκήσεις για τα Μαθηματικά της Γ' Γυμνασίου."
      backUrl="/"
      backText="Αρχική"
      showAds={true}
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8 sm:space-y-12">
        {/* Banner Header - Ενιαίο Indigo Theme της Γ' Γυμνασίου */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-indigo-900 to-indigo-800 text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-700/50">
          <div className="max-w-4xl space-y-3">
            <span className="inline-block px-3 py-1 rounded-full text-xs sm:text-sm font-bold tracking-wider bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
              Γ' ΓΥΜΝΑΣΙΟΥ • ΔΙΑΔΡΑΣΤΙΚΑ ΜΑΘΗΜΑΤΑ
            </span>
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white">
              Μαθηματικά Γ' Γυμνασίου
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-indigo-100/90 leading-relaxed">
              Εξερεύνησε τη θεωρία με δυναμικά εργαστήρια και εξασκήσου με διαδραστικές ασκήσεις και άμεσο feedback!
            </p>
          </div>
        </section>

        {/* Grid Ενοτήτων */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {CHAPTERS.map((ch) => (
            <div
              key={ch.id}
              className={`rounded-2xl border flex flex-col justify-between overflow-hidden transition-all duration-200 ${
                ch.active
                  ? 'bg-white border-indigo-200 shadow-md hover:shadow-lg'
                  : 'bg-slate-50 border-slate-200 opacity-70'
              }`}
            >
              {/* Header Κάρτας με το χαρακτηριστικό Indigo-500 της Α' Γυμνασίου */}
              <div className="bg-indigo-500 py-3 px-5 flex items-center justify-between text-white font-black text-sm sm:text-base">
                <span>{ch.badge}</span>
                {ch.active && <span className="text-xs bg-indigo-700/60 px-2 py-0.5 rounded-full">ΕΝΕΡΓΟ</span>}
              </div>

              <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                    {ch.title}
                  </h2>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                    {ch.desc}
                  </p>
                </div>

                {ch.active ? (
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <Link
                      href={`/g-gymnasiou/${ch.slug}`}
                      className="text-center bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-2.5 px-3 rounded-xl transition shadow-sm text-xs sm:text-sm"
                    >
                      📖 Θεωρία
                    </Link>
                    <Link
                      href={`/g-gymnasiou/${ch.slug}-ask`}
                      className="text-center bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-950 font-bold py-2.5 px-3 rounded-xl transition shadow-sm text-xs sm:text-sm"
                    >
                      🎯 Ασκήσεις
                    </Link>
                  </div>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-300 text-slate-600 font-bold py-2.5 rounded-xl cursor-not-allowed text-xs sm:text-sm"
                  >
                    ΣΥΝΤΟΜΑ ΔΙΑΘΕΣΙΜΟ
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}
