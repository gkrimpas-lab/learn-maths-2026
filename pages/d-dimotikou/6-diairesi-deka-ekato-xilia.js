// pages/d-dimotikou/6-diairesi-deka-ekato-xilia.js
import Head from 'next/head';
import Link from 'next/link';
import { LAYOUT } from '../../shared/layout-config';

export default function DiairesiDekaEkatoXiliaPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans flex flex-col justify-between">
      <Head>
        <title>⚡ Διαίρεση με 10, 100, 1000 - LearnMaths.gr</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </Head>

      <div>
        {/* NAVBAR */}
        <nav className="bg-white shadow-md w-full">
          <div className={`${LAYOUT.CONTAINER} py-4 flex justify-between items-center`}>
            <Link href="/d-dimotikou" className="text-2xl font-black text-indigo-600 tracking-tight">
              LearnMaths<span className="text-indigo-600">.gr</span>
            </Link>
            <Link href="/d-dimotikou" className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-5 py-2.5 rounded-xl text-sm font-bold transition shadow-sm">
              🔙 Επιστροφή
            </Link>
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className={`${LAYOUT.LESSON_CONTAINER} py-12`}>
          <div className="space-y-8 bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            
            {/* HEADER ΕΝΟΤΗΤΑΣ */}
            <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white p-8 rounded-2xl shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-3xl font-black 2xl:text-4xl">⚡ Διαίρεση με 10, 100, 1000</h2>
                <p className="text-indigo-100 leading-relaxed text-base xl:text-lg">
                  Μαθαίνουμε το πιο γρήγορο και έξυπνο κόλπο των Μαθηματικών για να διαιρούμε αμέσως!
                </p>
              </div>
              <Link
                href="/d-dimotikou-exercises"
                className="bg-white hover:bg-indigo-50 text-indigo-600 font-black text-sm px-6 py-3.5 rounded-xl transition shadow-md flex items-center gap-2 active:scale-95 whitespace-nowrap"
              >
                📝 Εξάσκηση - Ασκήσεις
              </Link>
            </div>

            {/* ΠΕΡΙΠΤΩΣΗ 1 */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-black text-emerald-800 bg-emerald-100/80 px-4 py-2 rounded-xl inline-block border border-emerald-200">
                👍 Περίπτωση 1: Όταν ο αριθμός τελειώνει σε Μηδενικά
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Σβήνουμε από το τέλος του αριθμού τόσα μηδενικά, όσα έχει ο διαιρέτης (1 για το 10, 2 για το 100, 3 για το 1000).
              </p>

              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                <svg viewBox="0 0 540 100" className="w-full h-auto overflow-visible font-sans select-none">
                  {/* ÷ 10 */}
                  <g transform="translate(5, 5)">
                    <rect x="0" y="0" width="165" height="85" rx="12" className="fill-emerald-50/50 stroke-emerald-400 stroke-[1]" />
                    <text x="82" y="20" className="text-[9px] font-black fill-emerald-900" textAnchor="middle">÷ 10 (1 μηδενικό)</text>
                    <text x="40" y="60" className="text-2xl font-black fill-slate-800 font-mono">54</text>
                    <text x="68" y="60" className="text-2xl font-black fill-slate-300 font-mono">0</text>
                    <line x1="65" y1="65" x2="78" y2="40" className="stroke-red-500 stroke-[3]" />
                    <text x="90" y="58" className="text-lg fill-slate-400">&rarr;</text>
                    <text x="115" y="60" className="text-2xl font-black fill-emerald-600 font-mono">54</text>
                  </g>

                  {/* ÷ 100 */}
                  <g transform="translate(187, 5)">
                    <rect x="0" y="0" width="165" height="85" rx="12" className="fill-blue-50/50 stroke-blue-400 stroke-[1]" />
                    <text x="82" y="20" className="text-[9px] font-black fill-blue-900" textAnchor="middle">÷ 100 (2 μηδενικά)</text>
                    <text x="35" y="60" className="text-2xl font-black fill-slate-800 font-mono">37</text>
                    <text x="63" y="60" className="text-2xl font-black fill-slate-300 font-mono">00</text>
                    <line x1="60" y1="65" x2="90" y2="40" className="stroke-red-500 stroke-[3]" />
                    <text x="100" y="58" className="text-lg fill-slate-400">&rarr;</text>
                    <text x="122" y="60" className="text-2xl font-black fill-emerald-600 font-mono">37</text>
                  </g>

                  {/* ÷ 1000 */}
                  <g transform="translate(370, 5)">
                    <rect x="0" y="0" width="165" height="85" rx="12" className="fill-orange-50/50 stroke-orange-400 stroke-[1]" />
                    <text x="82" y="20" className="text-[9px] font-black fill-orange-900" textAnchor="middle">÷ 1000 (3 μηδενικά)</text>
                    <text x="30" y="60" className="text-2xl font-black fill-slate-800 font-mono">8</text>
                    <text x="45" y="60" className="text-2xl font-black fill-slate-300 font-mono">000</text>
                    <line x1="42" y1="65" x2="85" y2="40" className="stroke-red-500 stroke-[3]" />
                    <text x="100" y="58" className="text-lg fill-slate-400">&rarr;</text>
                    <text x="125" y="60" className="text-2xl font-black fill-emerald-600 font-mono">8</text>
                  </g>
                </svg>
              </div>
            </div>

            {/* ΠΕΡΙΠΤΩΣΗ 2 */}
            <div className="bg-gray-50 p-6 md:p-8 rounded-2xl border border-gray-200 space-y-4">
              <h3 className="text-lg font-black text-amber-800 bg-amber-100/80 px-4 py-2 rounded-xl inline-block border border-amber-200">
                ⚠️ Περίπτωση 2: Όταν ο αριθμός ΔΕΝ έχει μηδενικά
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                Φανταζόμαστε την υποδιαστολή στο τέλος του αριθμού και τη μετακινούμε προς τα <strong>αριστερά</strong> τόσες θέσεις όσα είναι τα μηδενικά.
              </p>

              <div className="bg-white p-4 md:p-6 rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
                <svg viewBox="0 0 540 110" className="min-w-[540px] h-auto overflow-visible font-sans select-none">
                  {/* ÷ 10 */}
                  <g transform="translate(5, 5)">
                    <rect x="0" y="0" width="170" height="95" rx="12" className="fill-amber-50/30 stroke-amber-400 stroke-[1]" />
                    <text x="85" y="18" className="text-[8px] font-black fill-amber-900" textAnchor="middle">245 ÷ 10 (1 θέση αριστερά)</text>
                    <text x="25" y="55" className="text-xl font-bold fill-slate-800 font-mono">2</text>
                    <text x="40" y="55" className="text-xl font-bold fill-slate-800 font-mono">4</text>
                    <text x="55" y="55" className="text-xl font-bold fill-slate-800 font-mono">5</text>
                    <path d="M 62 58 Q 55 68 48 58" className="fill-none stroke-blue-500 stroke-[1.2] stroke-dasharray-[2]" />
                    <text x="45" y="57" className="text-xl font-black fill-red-500 font-mono">,</text>
                    <text x="80" y="52" className="text-base fill-slate-400">&rarr;</text>
                    <text x="105" y="55" className="text-xl font-black fill-indigo-600 font-mono">24,5</text>
                  </g>

                  {/* ÷ 100 */}
                  <g transform="translate(185, 5)">
                    <rect x="0" y="0" width="170" height="95" rx="12" className="fill-amber-50/30 stroke-amber-400 stroke-[1]" />
                    <text x="85" y="18" className="text-[8px] font-black fill-amber-900" textAnchor="middle">245 ÷ 100 (2 θέσεις αριστερά)</text>
                    <text x="25" y="55" className="text-xl font-bold fill-slate-800 font-mono">2</text>
                    <text x="40" y="55" className="text-xl font-bold fill-slate-800 font-mono">4</text>
                    <text x="55" y="55" className="text-xl font-bold fill-slate-800 font-mono">5</text>
                    <path d="M 62 58 Q 55 68 48 58" className="fill-none stroke-blue-500 stroke-[1.2]" />
                    <path d="M 48 58 Q 40 68 32 58" className="fill-none stroke-blue-500 stroke-[1.2]" />
                    <text x="29" y="57" className="text-xl font-black fill-red-500 font-mono">,</text>
                    <text x="80" y="52" className="text-base fill-slate-400">&rarr;</text>
                    <text x="105" y="55" className="text-xl font-black fill-indigo-600 font-mono">2,45</text>
                  </g>

                  {/* ÷ 1000 */}
                  <g transform="translate(365, 5)">
                    <rect x="0" y="0" width="170" height="95" rx="12" className="fill-amber-50/30 stroke-amber-400 stroke-[1]" />
                    <text x="85" y="18" className="text-[8px] font-black fill-amber-900" textAnchor="middle">245 ÷ 1000 (3 θέσεις αριστερά)</text>
                    <text x="25" y="55" className="text-xl font-bold fill-slate-800 font-mono">2</text>
                    <text x="40" y="55" className="text-xl font-bold fill-slate-800 font-mono">4</text>
                    <text x="55" y="55" className="text-xl font-bold fill-slate-800 font-mono">5</text>
                    <path d="M 62 58 Q 55 68 48 58" className="fill-none stroke-blue-500 stroke-[1.2]" />
                    <path d="M 48 58 Q 40 68 32 58" className="fill-none stroke-blue-500 stroke-[1.2]" />
                    <path d="M 32 58 Q 23 68 15 58" className="fill-none stroke-blue-500 stroke-[1.2]" />
                    <text x="12" y="57" className="text-xl font-black fill-red-500 font-mono">,</text>
                    <text x="75" y="52" className="text-base fill-slate-400">&rarr;</text>
                    <text x="100" y="55" className="text-xl font-black fill-indigo-600 font-mono">0,245</text>
                  </g>
                </svg>
              </div>
            </div>

          </div>
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-gray-800 text-gray-400 py-6 text-center text-sm w-full border-t border-gray-700">
        <p>© {new Date().getFullYear()} LearnMaths.gr. Σχεδιασμένο για τη Δ' Δημοτικού.</p>
      </footer>
    </div>
  );
}
