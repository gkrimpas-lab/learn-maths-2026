import { useState } from 'react';
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
    desc: 'Πλήρες τεστ προτύπων με 25 θέματα διαβαθμισμένης δυσκολίας (αριθμητική, γεωμετρία, κλάσματα, ποσοστά, εξισώσεις και προβλήματα λογικής).',
    questionsCount: 25,
    maxScore: 50,
    available: true
  },
  {
    id: 2,
    title: '2ο ΤΕΣΤ ΠΡΟΣΟΜΟΙΩΣΗΣ',
    slug: '02-deytero-test',
    badge: 'Διαθέσιμο',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    desc: 'Τεστ προσομοίωσης με έμφαση στα ποσοστά, τα ανάλογα ποσά, τα συστήματα προβλημάτων και τη συνδυαστική σκέψη.',
    questionsCount: 25,
    maxScore: 50,
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
    maxScore: 50,
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
    maxScore: 50,
    available: false
  }
];

export default function TestProsomoiosisIndexPage() {
  // Επιλογή χρήστη: Χρήση χρονομέτρου (προεπιλογή: true)
  const [useTimer, setUseTimer] = useState(true);

  return (
    <Layout
      title="⏱️ Τεστ Προσομοίωσης Προτύπων - LearnMaths.gr"
      description="Διαδραστικά τεστ προσομοίωσης για τις εξετάσεις εισαγωγής στα Πρότυπα Σχολεία με χρονόμετρο 60 λεπτών και αυτόματη βαθμολόγηση στην κλίμακα 0-50."
      backUrl="/protipa/protipa"
      backText="Πρότυπα"
      showAds={true}
    >
      <div className="py-6 sm:py-8 md:py-10 space-y-8 md:space-y-10">

        {/* HERO BANNER */}
        <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
          <div className="max-w-3xl space-y-2.5">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider text-purple-100 border border-white/20">
              <span>⏱️ Εξετασεις Προτυπων • Προσομοιωση</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Τεστ Προσομοίωσης Εξετάσεων
            </h1>
            <p className="text-xs sm:text-sm md:text-base text-purple-100 leading-relaxed">
              Δοκίμασε τις δυνάμεις σου σε συνθήκες πραγματικών εξετάσεων! Κάθε τεστ περιλαμβάνει 25 θέματα πολλαπλής επιλογής και βαθμολογείται αυτόματα στην κλίμακα 0-50.
            </p>
          </div>
        </div>

        {/* ΟΔΗΓΙΕΣ & ΡΥΘΜΙΣΗ ΧΡΟΝΟΜΕΤΡΟΥ */}
        <div className="bg-white border-2 border-indigo-200 rounded-3xl p-5 sm:p-7 shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base sm:text-lg font-black text-slate-900 flex items-center gap-2">
              <span>📋</span> Οδηγίες Εξέτασης & Δομή Τεστ
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-700">
            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1">
              <span className="text-xl block">⏳</span>
              <span className="text-xs font-bold text-indigo-950 block">Διάρκεια Εξέτασης: 60'</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Στις επίσημες εξετάσεις ο χρόνος είναι 150' για Γλώσσα και Μαθηματικά. Εδώ εξετάζονται μόνο τα Μαθηματικά με 60' online χρόνο.
              </p>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1">
              <span className="text-xl block">🎯</span>
              <span className="text-xs font-bold text-indigo-950 block">25 Ερωτήσεις (2 Μόρια/ερώτηση)</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Κάθε σωστή απάντηση βαθμολογείται με 2 μόρια. Η συνολική βαθμολογία υπολογίζεται αυτόματα από 0 έως 50 μόρια.
              </p>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-100 p-4 rounded-2xl space-y-1">
              <span className="text-xl block">💡</span>
              <span className="text-xs font-bold text-indigo-950 block">Αναλυτικές Λύσεις</span>
              <p className="text-[11px] text-slate-600 leading-relaxed">
                Μετά την υποβολή βλέπεις αναλυτικά ποιες απαντήσεις ήταν σωστές/λάθος με πλήρη μαθηματική επεξήγηση σε κάθε θέμα.
              </p>
            </div>
          </div>

          {/* TOGGLE ΧΡΟΝΟΜΕΤΡΟΥ */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-2 border-t border-slate-100">
            <div className="space-y-0.5">
              <span className="text-xs sm:text-sm font-black text-slate-900 flex items-center gap-1.5">
                <span>⏱️</span> Λειτουργία Αντίστροφης Μέτρησης (60 λεπτά)
              </span>
              <p className="text-[11px] text-slate-500">
                Αν απενεργοποιηθεί, μπορείς να λύσεις το τεστ χωρίς χρονικό άγχος με δικό σου ρυθμό.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0">
              <input
                type="checkbox"
                checked={useTimer}
                onChange={(e) => setUseTimer(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:**Οδηγίες Εξέτασης (Κείμενο για τη σελίδα `test-prosomoiosis`)**
