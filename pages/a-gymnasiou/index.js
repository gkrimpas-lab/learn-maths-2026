import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Layout from '../../components/Layout';

const CHAPTERS = [
  {
    id: '01',
    slug: '01-fysikoi',
    title: 'Φυσικοί Αριθμοί, Πολλαπλασιασμός & Δυνάμεις',
    desc: 'Έννοια φυσικών αριθμών, αριθμητικός άξονας, ιδιότητες πολλαπλασιασμού και δυνάμεις με βάση και εκθέτη φυσικό.',
    badge: 'ΚΕΦΑΛΑΙΟ 1',
    active: true,
  },
  {
    id: '02',
    slug: '02-diairesi',
    title: 'Ευκλείδια διαίρεση - Διαιρετότητα',
    desc: 'Ευκλείδια διαίρεση, διαιρετότητα, κριτήρια διαιρετότητας, πρώτοι και σύνθετοι αριθμοί',
    badge: 'ΚΕΦΑΛΑΙΟ 2',
    active: true,
  },
  {
    id: '03',
    slug: '03-MKD',
    title: 'Μέγιστος Κοινός Διαιρέτης',
    desc: 'Μέγιστος Κοινός Διαιρέτης (ΜΚΔ), ανάλυση σε γινόμενο πρώτων παραγόντων.',
    badge: 'ΚΕΦΑΛΑΙΟ 3',
    active: true,
  },
  {
    id: '04',
    slug: '04-sistima-arithmisis',
    title: 'Συστήματα Αρίθμησης',
    desc: 'Δεκαδικό, Δυαδικό και Οκταδικό Σύστημα Αρίθμησης.',
    badge: 'ΚΕΦΑΛΑΙΟ 4',
    active: true,
  },
  {
    id: '05',
    slug: '05-epanalipsi-1',
    title: 'Επανάληψη Ενοτήτων 1 έως 4',
    desc: 'Φυσικοί αριθμοί, διαίρεση, ΜΚΔ, συστήματα αρίθμησης.',
    badge: 'ΕΠΑΝΑΛΗΨΗ 1',
    active: false,
  },
  {
    id: '06',
    slug: '05-akeraioi',
    title: 'Ακέραιοι Αριθμοί',
    desc: 'Ακέραιοι Αριθμοί, Θετικοί και Αρνητικοί.',
    badge: 'ΚΕΦΑΛΑΙΟ 5',
    active: true,
  },
  {
    id: '07',
    slug: '06-prosthesi-akeraion',
    title: 'Πρόσθεση Ακεραίων',
    desc: 'Πρόσθεση ακεραίων, ομόσημοι και ετερόσημοι αριθμοί.',
    badge: 'ΚΕΦΑΛΑΙΟ 6',
    active: true,
  },
  {
    id: '08',
    slug: '07-afairesi-akeraion',
    title: 'Αφαίρεση Ακεραίων',
    desc: 'Αφαίρεση ακεραίων, ομόσημοι και ετερόσημοι αριθμοί.',
    badge: 'ΚΕΦΑΛΑΙΟ 7',
    active: true,
  },
  {
    id: '09',
    slug: '08-pollaplasiasmos-akeraion',
    title: 'Πολλαπλασιασμός Ακεραίων',
    desc: 'Πολλαπλασιασμός ακεραίων, ομόσημοι και ετερόσημοι αριθμοί, Ιδιότητες πολλαπλασιασμού.',
    badge: 'ΚΕΦΑΛΑΙΟ 8',
    active: true,
  },
  {
    id: '10',
    slug: '09-dinameis',
    title: 'Δυνάμεις',
    desc: 'Δυνάμεις ακεραίων, βάση θετικός αριθμός, βάση αρνητικός αριθμός.',
    badge: 'ΚΕΦΑΛΑΙΟ 9',
    active: true,
  },
  {
    id: '11',
    slug: '10-proteraiotita-prakseon',
    title: 'Προτεραιότητα Πράξεων',
    desc: 'Παρενθέσεις, αγκύλες, άγκιστρα, δυνάμεις, πολλαπλασιασμοί και διαιρέσεις, προσθέσεις και αφαιρέσεις.',
    badge: 'ΚΕΦΑΛΑΙΟ 10',
    active: true,
  },
  {
    id: '12-epanalipsi-2',
    tag: 'ΕΠΑΝΑΛΗΨΗ 2',
    badge: 'ΕΠΑΝΑΛΗΨΗ 2',
    title: 'Επανάληψη Ενοτήτων 5 έως 10',
    desc: 'Ακέραιοι, πρόσθεση, αφαίρεση, πολλαπλασιασμός, δυνάμεις και προτεραιότητα πράξεων.',
    isReview: true,
    url: '/a-gymnasiou/12-epanalipsi-2',
    active: true,
    status: 'ΕΝΕΡΓΟ',
  },
  {
    id: '13',
    slug: '13-ritoi',
    title: 'Ρητοί Αριθμοί',
    desc: 'Ρητοί Αριθμοί, Μετατροπή Κλάσματος σε Δεκαδικό, Μετατροπή Δεκαδικού σε Κλασματική Μορφή.',
    badge: 'ΚΕΦΑΛΑΙΟ 11',
    active: true,
  },
  {
    id: '14',
    slug: '14-isodinama-klasmata',
    title: 'Ισοδύναμα Κλάσματα',
    desc: 'Ισοδύναμα κλάσματα, απλοποίηση, ανάγωγα κλάσματα.',
    badge: 'ΚΕΦΑΛΑΙΟ 12',
    active: true,
  },
  {
    id: '15',
    slug: '15-omonima-eteronima-klasmata',
    title: 'Ομώνυμα - Ετερώνυμα Κλάσματα',
    desc: 'Ομώνυμα - Ετερώνυμα Κλάσματα, σύγκριση, απόλυτη τιμή κλασμάτων.',
    badge: 'ΚΕΦΑΛΑΙΟ 13',
    active: true,
  },
  {
    id: '16',
    slug: '16-prosthesi-klasmata',
    title: 'Πρόσθεση ρητών',
    desc: 'Πρόσθεση Ομώνυμων και Ετερώνυμων Κλασμάτων.',
    badge: 'ΚΕΦΑΛΑΙΟ 14',
    active: true,
  },
  {
    id: '17',
    slug: '17-afairesi-klasmata',
    title: 'Αφαίρεση ρητών',
    desc: 'Αφαίρεση Ομώνυμων και Ετερώνυμων Κλασμάτων.',
    badge: 'ΚΕΦΑΛΑΙΟ 15',
    active: true,
  },
  {
    id: '18',
    slug: '18-pollaplasiasmos-klasmata',
    title: 'Πολλαπλασιασμός ρητών',
    desc: 'Πολλαπλασιασμός Κλασμάτων και δεκαδικών.',
    badge: 'ΚΕΦΑΛΑΙΟ 16',
    active: true,
  },
  {
    id: '19',
    slug: '19-dinami-riton-ekth-thetikos',
    title: 'Δύναμη Ρητού με Θετικό Φυσικό Εκθέτη',
    desc: 'Δύναμη ρητού με εκθέτη φυσικό μεγαλύτερο του μηδενός. Ιδιότητες.',
    badge: 'ΚΕΦΑΛΑΙΟ 17',
    active: true,
  },
  {
    id: '20',
    slug: '20-diairesi-riton',
    title: 'Διαίρεση Ρητών',
    desc: 'Διαίρεση Ρητών, αντιστροφή δεύτερου κλάσματος, σύνθετο κλάσμα σε απλό.',
    badge: 'ΚΕΦΑΛΑΙΟ 18',
    active: true,
  },
  {
    id: '21',
    slug: '21-proteraiotita-prakseon-riton',
    title: 'Προτεραιότητα Πράξεων',
    desc: 'Προτεραιότητα Πράξεων σε ρητούς αριθμούς και παρενθέσεις.',
    badge: 'ΚΕΦΑΛΑΙΟ 19',
    active: true,
  },
  {
    id: '22',
    slug: '22-tipopoimeni-morfi',
    title: 'Τυποποιημένη μορφή Αριθμών',
    desc: 'Τυποποιημένη μορφή μικρών και μεγάλων Αριθμών.',
    badge: 'ΚΕΦΑΛΑΙΟ 20',
    active: true,
  },
  {
    id: '23',
    slug: '23-ritoi-problimata',
    title: 'Προβλήματα με Ρητούς',
    desc: 'Προβλήματα και εφαρμογές με Ρητούς Αριθμούς.',
    badge: 'ΚΕΦΑΛΑΙΟ 21',
    active: true,
  },
  {
    id: '24',
    slug: '24-epanalipsi-3',
    title: 'Επανάληψη Ενοτήτων 11 έως 20',
    desc: 'Ρητοί αριθμοί, Κλάσματα, Πράξεις Κλασμάτων, Δύναμη Ρητών, Προτεραιότητα Πράξεων.',
    badge: 'ΕΠΑΝΑΛΗΨΗ 3',
    active: false,
  },
  {
    id: '25',
    slug: '25-akolouthia',
    title: 'Ακολουθία - Κανονικότητα',
    desc: 'Αριθμητικές - Γεωμετρικές Ακολουθίες - Κανονικότητες.',
    badge: 'ΚΕΦΑΛΑΙΟ 22',
    active: true,
  },
  {
    id: '26',
    slug: '26-akolouthia-view',
    title: 'Αναπαράσταση μιας Ακολουθίας - Κανονικότητας',
    desc: 'Εικόνες - Γεωμετρικά Σχήματα - Πίνακες Τιμών.',
    badge: 'ΚΕΦΑΛΑΙΟ 23',
    active: true,
  },
  {
    id: '27',
    slug: '27-metabliti',
    title: 'Αλγεβρικές Παραστάσεις και τα στοιχεία τους',
    desc: 'Μεταβλητή, Αλγεβρική παράσταση, όροι.',
    badge: 'ΚΕΦΑΛΑΙΟ 24',
    active: true,
  },
  {
    id: '28',
    slug: '28-parastaseis',
    title: 'Αριθμητικές και Αλγεβρικές Παραστάσεις',
    desc: 'Αριθμητική παράσταση, Αλγεβρική παράσταση, Προβλήματα.',
    badge: 'ΚΕΦΑΛΑΙΟ 25',
    active: true,
  },
  {
    id: '29',
    slug: '29-aplopoiisi',
    title: 'Αριθμητική τιμή και Απλοποίηση Αλγεβρικών Παραστάσεων',
    desc: 'Αριθμητική τιμή, Πίνακας τιμών, Απλοποίηση, Επιμεριστική ιδιότητα.',
    badge: 'ΚΕΦΑΛΑΙΟ 26',
    active: true,
  },
  {
    id: '30',
    slug: '30-epanalipsi-4',
    title: 'Επανάληψη Ενοτήτων 22 έως 26',
    desc: 'Ακολουθία, Αναπαράσταση ακολουθίας, Αλγεβρικές παραστάσεις, Αριθμητική τιμή, Απλοποίηση παραστάσεων.',
    badge: 'ΕΠΑΝΑΛΗΨΗ 4',
    active: false,
  },
  {
    id: '31',
    slug: '31-algebrikes-sxeseis',
    title: 'Αλγεβρικές Σχέσεις',
    desc: 'Μεταβλητή, Εξισώσεις, Λύση εξίσωσης.',
    badge: 'ΚΕΦΑΛΑΙΟ 27',
    active: true,
  },
  {
    id: '32',
    slug: '32-isodinames-eksisoseis',
    title: 'Ισοδύναμες Εξισώσεις',
    desc: 'Ισοδύναμες Εξισώσεις, Ιδιότητες ισοτήτων.',
    badge: 'ΚΕΦΑΛΑΙΟ 28',
    active: true,
  },
];

export default function AGymnasiouIndex() {
  return (
    <Layout
      title="Μαθηματικά Α' Γυμνασίου: Θεωρία, Διαδραστικές Ασκήσεις & Τεστ | LearnMaths.gr"
      description="Δωρεάν διαδραστικά μαθήματα, θεωρία, παραδείγματα και ασκήσεις για τα Μαθηματικά Α' Γυμνασίου σύμφωνα με το σχολικό βιβλίο (Φυσικοί, Ακέραιοι, Ρητοί, Εξισώσεις)."
      canonicalUrl="https://learnmaths.gr/a-gymnasiou"
      backUrl="/"
      backText="Αρχική"
      showAds={true}
    >
      {/* Schema.org Breadcrumb & Course Markup */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "BreadcrumbList",
                  "itemListElement": [
                    {
                      "@type": "ListItem",
                      "position": 1,
                      "name": "Αρχική",
                      "item": "https://learnmaths.gr/"
                    },
                    {
                      "@type": "ListItem",
                      "position": 2,
                      "name": "Μαθηματικά Α' Γυμνασίου",
                      "item": "https://learnmaths.gr/a-gymnasiou"
                    }
                  ]
                },
                {
                  "@type": "Course",
                  "name": "Μαθηματικά Α' Γυμνασίου",
                  "description": "Ολοκληρωμένο πρόγραμμα μαθημάτων και διαδραστικών ασκήσεων για την ύλη των Μαθηματικών της Α' Γυμνασίου.",
                  "provider": {
                    "@type": "Organization",
                    "name": "LearnMaths.gr",
                    "sameAs": "https://learnmaths.gr"
                  }
                }
              ]
            })
          }}
        />
      </Head>

      <div className="w-full max-w-[1920px] 2xl:max-w-[2400px] mx-auto px-4 sm:px-6 lg:px-12 py-6 sm:py-10 space-y-8 sm:space-y-12">
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

        {/* Grid Ενοτήτων */}
        <main className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {CHAPTERS.map((ch) => {
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
                    <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                      {ch.title}
                    </h2>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                      {ch.desc}
                    </p>
                  </div>

                  {isItemActive ? (
                    ch.isReview ? (
                      <div className="pt-2">
                        <Link
                          href={ch.url}
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
        </main>

        {/* SEO OVERVIEW SECTION: ΥΛΗ ΚΑΙ ΣΤΟΧΟΙ Α' ΓΥΜΝΑΣΙΟΥ */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 border border-indigo-100 shadow-sm space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 border-b border-slate-100 pb-3">
            📚 Ύλη Μαθηματικών Α' Γυμνασίου: Τι θα μάθεις στο LearnMaths
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-600 text-xs sm:text-sm leading-relaxed">
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-base">Αριθμητική &amp; Άλγεβρα</h3>
              <p>
                Η μετάβαση από το Δημοτικό στο Γυμνάσιο σηματοδοτείται από την εισαγωγή των <strong>αρνητικών αριθμών</strong> και των <strong>ακεραίων</strong>, τις πράξεις με <strong>ρητούς αριθμούς</strong> (κλάσματα και δεκαδικοί) και την κατανόηση της <strong>προτεραιότητας πράξεων</strong>.
              </p>
              <p>
                Μέσα από διαδραστικούς προσομοιωτές, οι μαθητές εξασκούνται στον κανόνα των προσήμων, στις δυνάμεις και στη μετατροπή σύνθετων κλασμάτων.
              </p>
            </div>
            <div className="space-y-3">
              <h3 className="font-bold text-slate-800 text-base">Εξισώσεις &amp; Αλγεβρικές Παραστάσεις</h3>
              <p>
                Εδώ τίθενται οι βάσεις της άλγεβρας: η έννοια της <strong>μεταβλητής</strong>, οι αριθμητικές και αλγεβρικές παραστάσεις, η αναγωγή ομοίων όρων και η επίλυση <strong>εξισώσεων πρώτου βαθμού</strong>.
              </p>
              <p>
                Κάθε ενότητα περιλαμβάνει πλήρη θεωρία με παραδείγματα και ασκήσεις διαβαθμισμένης δυσκολίας με αυτόματο έλεγχο αποτελέσματος.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
