import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const EXAM_YEARS = [
  {
    year: '2026',
    slug: '2026',
    badge: 'Πρόσφατο',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    desc: 'Επίσημα θέματα εξετάσεων 2026 με online επίλυση και άμεση αξιολόγηση.',
    questionsCount: 25,
    available: true
  },
  {
    year: '2025',
    slug: '2025',
    badge: 'Επίσημο',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    desc: 'Επίσημα θέματα εξετάσεων 2025 με online επίλυση και άμεση αξιολόγηση.',
    questionsCount: 25,
    available: true
  },
  {
    year: '2024',
    slug: '2024',
    badge: 'Επίσημο',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    desc: 'Επίσημα θέματα εξετάσεων 2024 με online επίλυση και άμεση αξιολόγηση.',
    questionsCount: 25,
    available: true
  },
  {
    year: '2023',
    slug: '2023',
    badge: 'Επίσημο',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    desc: 'Επίσημα θέματα εξετάσεων 2023 με online επίλυση και άμεση αξιολόγηση.',
    questionsCount: 25,
    available: true
  },
  {
    year: '2022',
    slug: '2022',
    badge: 'Επίσημο',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    desc: 'Επίσημα θέματα εξετάσεων 2022 με online επίλυση και άμεση αξιολόγηση.',
    questionsCount: 25,
    available: true
  },
  {
    year: '2021',
    slug: '2021',
    badge: 'Επίσημο',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    desc: 'Επίσημα θέματα εξετάσεων 2021 με online επίλυση και άμεση αξιολόγηση.',
    questionsCount: 25,
    available: true
  },
  {
    year: '2020',
    slug: '2020',
    badge: 'Επίσημο',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    desc: 'Επίσημα θέματα εξετάσεων 2020 με online επίλυση και άμεση αξιολόγηση.',
    questionsCount: 25,
    available: true
  }
];

export default function PragmatikaThemataIndexPage() {
  return (
    <Layout
      title="📝 Πραγματικά Θέματα Εξετάσεων Προτύπων - LearnMaths.gr"
      description="Εξασκήσου online στα επίσημα θέματα των εξετάσεων εισαγωγής στα Πρότυπα Σχολεία για τις χρονιές 2020 έως 2026 με αυτόματη βαθμολόγηση."
      backUrl="/protipa/protipa"
      backText="Πρότυπα"
      showAds={true}
    >
      <div className="py-6 sm:py-8 md:py-10 space-y-8 md:space-y-10">

        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider text-blue-100 border border-white/20">
              <span>📝 Εξετασεις Προτυπων • 2020 - 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Πραγματικά Θέματα ανά Έτος
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-blue-100 leading-relaxed">
              Επίλεξε τη χρονιά που επιθυμείς και λύσε τα πραγματικά θέματα των εξετάσεων. Στο τέλος θα λάβεις αναλυτική βαθμολογία και επεξηγήσεις για κάθε ερώτηση.
            </p>
          </div>
        </div>

        {/* GRID ΜΕ ΤΙΣ ΧΡΟΝΙΕΣ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {EXAM_YEARS.map((item) => (
            <div
              key={item.year}
              className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-slate-200 hover:border-blue-400 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-2xl sm:text-3xl font-black font-mono text-blue-700">
                    {item.year}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-black px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
                <div className="text-[11px] font-bold text-slate-400 font-mono">
                  📊 {item.questionsCount} Ερωτήσεις Πολλαπλής Επιλογής
                </div>
              </div>

              <Link
                href={`/protipa/themata-${item.slug}`}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-2.5 px-4 rounded-xl text-xs sm:text-sm transition text-center shadow-xs flex items-center justify-center gap-1.5 active:scale-95"
              >
                <span>✍️ Έναρξη Εξέτασης {item.year}</span>
                <span>➔</span>
              </Link>
            </div>
          ))}
        </div>

      </div>
    </Layout>
  );
}
