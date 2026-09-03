import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const SIMULATION_TESTS = [
  {
    id: 1,
    title: '1ο ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ',
    slug: '01-proto-test',
    badge: 'Διαθέσιμο',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    desc: 'Πλήρες διαγνωστικό τεστ εισαγωγής στα Πρότυπα Σχολεία με διαβαθμισμένα θέματα σε αριθμητική, γεωμετρία και προβλήματα.',
    questionsCount: 25,
    duration: '90 λεπτά',
    available: true
  },
  {
    id: 2,
    title: '2ο ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ',
    slug: '02-deytero-test',
    badge: 'Διαθέσιμο',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    desc: 'Τεστ προσομοίωσης με έμφαση στα κλάσματα, τα ποσοστά, τις εξισώσεις και συνδυαστικά προβλήματα λογικής.',
    questionsCount: 25,
    duration: '90 λεπτά',
    available: true
  },
  {
    id: 3,
    title: '3ο ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ',
    slug: '03-trito-test',
    badge: 'Σύντομα',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    desc: 'Προχωρημένο τεστ εξάσκησης με απαιτητικά θέματα άλγεβρας και γεωμετρικών υπολογισμών.',
    questionsCount: 25,
    duration: '90 λεπτά',
    available: false
  },
  {
    id: 4,
    title: '4ο ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ',
    slug: '04-tetarto-test',
    badge: 'Σύντομα',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    desc: 'Τελική προσομοίωση συνθηκών εξέτασης για πλήρη έλεγχο ετοιμότητας.',
    questionsCount: 25,
    duration: '90 λεπτά',
    available: false
  }
];

export default function TestProsomoiosisIndexPage() {
  return (
    <Layout
      title="⏱️ Τεστ Προσομοίωσης Προτύπων - LearnMaths.gr"
      description="Διαδραστικά τεστ προσομοίωσης για τις εξετάσεις εισαγωγής στα Πρότυπα Σχολεία με χρονόμετρο και αυτόματη βαθμολόγηση."
      backUrl="/protipa/protipa"
      backText="Πρότυπα"
      showAds={true}
    >
      <div className="py-6 sm:py-8 md:py-10 space-y-8 md:space-y-10">

        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider text-purple-100 border border-white/20">
              <span>⏱️ Τεστ Προσομοιωσης • Εξετασεις Προτυπων</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Τεστ Προσομοίωσης
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-purple-100 leading-relaxed">
              Δοκίμασε τις δυνάμεις σου σε πραγματικές συνθήκες εξέτασης! Κάθε τεστ περιλαμβάνει επιλεγμένα θέματα πολλαπλής επιλογής και στο τέλος λαμβάνεις το συνολικό σου σκορ με αναλυτικές λύσεις.
            </p>
          </div>
        </div>

        {/* GRID ΜΕ ΤΑ ΤΕΣΤ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {SIMULATION_TESTS.map((test) => (
            <div
              key={test.id}
              className={`bg-white rounded-3xl p-5 sm:p-6 border-2 shadow-sm flex flex-col justify-between space-y-5 transition-all ${
                test.available 
                  ? 'border-slate-200 hover:border-indigo-400 hover:shadow-md' 
                  : 'border-slate-100 opacity-70'
              }`}
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-base sm:text-lg font-black text-slate-900 font-mono">
                    {test.title}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border ${test.badgeColor}`}>
                    {test.badge}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {test.desc}
                </p>

                <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500 font-mono pt-1">
                  <span>📊 {test.questionsCount} Ερωτήσεις</span>
                  <span>⏳ {test.duration}</span>
                </div>
              </div>

              {test.available ? (
                <Link
                  href={`/protipa/${test.slug}`}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
                >
                  <span>✍️ Έναρξη {test.title}</span>
                  <span>➔</span>
                </Link>
              ) : (
                <button
                  type="button"
                  disabled
                  className="w-full bg-slate-100 text-slate-400 font-bold py-2.5 px-4 rounded-xl text-xs sm:text-sm cursor-not-allowed text-center"
                >
                  🔒 Σύντομα Διαθέσιμο
                </button>
              )}
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
