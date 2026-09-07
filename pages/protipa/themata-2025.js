import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

// Component για κάθετη απεικόνιση κλασμάτων
function Fraction({ num, den, inline = true }) {
  return (
    <span className={`${inline ? 'inline-flex' : 'flex'} flex-col items-center justify-center align-middle mx-1 font-mono font-bold text-sm leading-none select-none`}>
      <span className="border-b-2 border-current px-1 pb-0.5 text-center w-full block">{num}</span>
      <span className="pt-0.5 text-center w-full block">{den}</span>
    </span>
  );
}

const QUESTIONS_2025 = [
  {
    id: 1,
    officialNumber: 21,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Ποια από τις παρακάτω αριθμητικές παραστάσεις έχει τη μεγαλύτερη τιμή;',
    options: [
      { key: 'A', label: <span className="inline-flex items-center">11 ＋ <Fraction num="2" den="3" /> － <Fraction num="1" den="5" /></span>, raw: 'A' },
      { key: 'B', label: <span className="inline-flex items-center">11 ＋ <Fraction num="1" den="2" /> － <Fraction num="1" den="5" /></span>, raw: 'B' },
      { key: 'Γ', label: <span className="inline-flex items-center">11 ＋ <Fraction num="3" den="4" /> － <Fraction num="1" den="5" /></span>, raw: 'Γ' },
      { key: 'Δ', label: <span className="inline-flex items-center">11 ＋ <Fraction num="3" den="4" /> － <Fraction num="1" den="3" /></span>, raw: 'Δ' }
    ],
    correctRaw: 'Γ',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Όλες οι παραστάσεις ξεκινούν με <strong>11</strong>, οπότε μπορούμε να μην το υπολογίσουμε στις πράξεις και να συγκρίνουμε μόνο τα κλάσματα κάθε επιλογής:
        </p>

        <div className="space-y-2 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-medium">
          {/* Επιλογή Α */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="font-bold text-slate-900 w-5">Α:</span>
            <Fraction num="2" den="3" />
            <span>－</span>
            <Fraction num="1" den="5" />
            <span>＝</span>
            <Fraction num="10" den="15" />
            <span>－</span>
            <Fraction num="3" den="15" />
            <span>＝</span>
            <Fraction num="7" den="15" />
            <span className="text-slate-500 font-mono text-xs">(≈ 0,467 &lt; 0,5)</span>
          </div>

          {/* Επιλογή Β */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="font-bold text-slate-900 w-5">Β:</span>
            <Fraction num="1" den="2" />
            <span>－</span>
            <Fraction num="1" den="5" />
            <span>＝</span>
            <Fraction num="5" den="10" />
            <span>－</span>
            <Fraction num="2" den="10" />
            <span>＝</span>
            <Fraction num="3" den="10" />
            <span className="text-slate-500 font-mono text-xs">(＝ 0,3 &lt; 0,5)</span>
          </div>

          {/* Επιλογή Γ */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="font-bold text-emerald-700 w-5">Γ:</span>
            <Fraction num="3" den="4" />
            <span>－</span>
            <Fraction num="1" den="5" />
            <span>＝</span>
            <Fraction num="15" den="20" />
            <span>－</span>
            <Fraction num="4" den="20" />
            <span>＝</span>
            <Fraction num="11" den="20" />
            <span className="text-emerald-700 font-bold font-mono text-xs">(＝ 0,55 &gt; 0,5)</span>
          </div>

          {/* Επιλογή Δ */}
          <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
            <span className="font-bold text-slate-900 w-5">Δ:</span>
            <Fraction num="3" den="4" />
            <span>－</span>
            <Fraction num="1" den="3" />
            <span>＝</span>
            <Fraction num="9" den="12" />
            <span>－</span>
            <Fraction num="4" den="12" />
            <span>＝</span>
            <Fraction num="5" den="12" />
            <span className="text-slate-500 font-mono text-xs">(≈ 0,417 &lt; 0,5)</span>
          </div>
        </div>

        <p className="pt-1">
          Συγκρίνοντας τα αποτελέσματα, η μεγαλύτερη διαφορά είναι το <strong className="text-emerald-800">11/20 (= 0,55)</strong>. Επομένως, η παράσταση με τη μεγαλύτερη τιμή είναι η <strong>Γ</strong>.
        </p>
      </div>
    )
  },
  {
    id: 2,
    officialNumber: 22,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Αν 3 φορές το 🍎 και 2 φορές το 🍐 κάνει 19, ενώ 2 φορές το 🍎 και 3 φορές το 🍐 κάνει 41, τότε το άθροισμα των 🍎 και 🍐 είναι:',
    options: [
      { key: 'A', label: '62', raw: '62' },
      { key: 'B', label: <Fraction num="62" den="5" />, raw: '62/5' },
      { key: 'Γ', label: '60', raw: '60' },
      { key: 'Δ', label: '12', raw: '12' }
    ],
    correctRaw: '12',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Συμβολίζουμε με <strong>x</strong> το 🍎 και με <strong>y</strong> το 🍐.
        </p>

        <p>
          Από τα δεδομένα της εκφώνησης προκύπτουν δύο εξισώσεις:
        </p>

        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 space-y-1.5 font-mono text-slate-800">
          <div>• 3 φορές το 🍎 και 2 φορές το 🍐 κάνει 19 ➔ <strong>3x ＋ 2y ＝ 19</strong></div>
          <div>• 2 φορές το 🍎 και 3 φορές το 🍐 κάνει 41 ➔ <strong>2x ＋ 3y ＝ 41</strong></div>
        </div>

        <p>
          Μας ζητείται το άθροισμα των 🍎 και 🍐, δηλαδή η τιμή του <strong>x ＋ y</strong> (και όχι να βρούμε το καθένα ξεχωριστά).
        </p>

        <p>
          Προσθέτουμε τις δύο εξισώσεις <strong>κατά μέλη</strong>:
        </p>

       <div className="bg-white/70 p-4 rounded-xl border border-slate-200/80 font-mono text-slate-900 text-sm max-w-fit">
          {/* Κάθετη πρόσθεση με φυσικά κενά και αριστερή στοίχιση */}
          <div className="pb-2 border-b-2 border-slate-700 space-y-1">
            <div className="pl-6">
              3x ＋ 2y ＝ 19
            </div>
            <div className="flex items-center">
              <span className="w-6 font-bold leading-none">＋</span>
              <span>2x ＋ 3y ＝ 41</span>
            </div>
          </div>

          {/* Βήματα επίλυσης */}
          <div className="pt-3 space-y-2">
            <div>5x ＋ 5y ＝ 41 ＋ 19</div>
            <div>5x ＋ 5y ＝ 60</div>
            <div>5 · (x ＋ y) ＝ 60</div>
            <div className="flex items-center gap-2 pt-1">
              <span>x ＋ y ＝</span>
              <Fraction num="60" den="5" />
              <span>➔ <strong className="text-emerald-700">x ＋ y ＝ 12</strong></span>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Άρα, το άθροισμα των 🍎 και 🍐 είναι <strong>12</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 3,
    officialNumber: 23,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Τέσσερα καταστήματα πουλάνε την ίδια μπλούζα στις εκπτώσεις. Σύμφωνα με τον πίνακα που ακολουθεί, σε ποιο κατάστημα η μπλούζα κοστίζει φθηνότερα στις εκπτώσεις;',
    hasTable: 'table23',
    options: [
      { key: 'A', label: 'Της Αλίνας', raw: 'Αλίνα' },
      { key: 'B', label: 'Του Βασίλη', raw: 'Βασίλης' },
      { key: 'Γ', label: 'Της Γιάννας', raw: 'Γιάννα' },
      { key: 'Δ', label: 'Του Δημοσθένη', raw: 'Δημοσθένης' }
    ],
    correctRaw: 'Δημοσθένης',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Για να βρούμε την τιμή (της έκπτωσης ή της αύξησης) αν γνωρίζουμε το ποσοστό, πολλαπλασιάζουμε πάντα την <strong>αρχική τιμή με το ποσοστό</strong>.
        </p>

        <p>
          Βρίσκουμε πρώτα την έκπτωση και στη συνέχεια το τελικό ποσό που θα πληρώσουμε με αφαίρεση:
        </p>

        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-bold text-center text-slate-800 text-xs sm:text-sm">
          Τελική Τιμή Πληρωμής ＝ Αρχική Τιμή － Έκπτωση
        </div>

        <div className="space-y-2.5 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          {/* Αλίνα */}
          <div className="border-b border-slate-100 pb-2 space-y-1">
            <div className="font-sans font-bold text-slate-950">1. Αλίνα:</div>
            <div className="flex items-center gap-1.5 flex-wrap pl-2">
              <span>Έκπτωση ＝ 50 ·</span>
              <Fraction num="20" den="100" />
              <span>＝</span>
              <Fraction num="1000" den="100" />
              <span>＝ <strong>10€</strong></span>
            </div>
            <div className="pl-2 text-slate-700">
              Τελική Τιμή ＝ 50 － 10 ＝ <strong>40€</strong>
            </div>
          </div>

          {/* Βασίλης */}
          <div className="border-b border-slate-100 pb-2 space-y-1">
            <div className="font-sans font-bold text-slate-950">2. Βασίλης:</div>
            <div className="flex items-center gap-1.5 flex-wrap pl-2">
              <span>Έκπτωση ＝ 45 ·</span>
              <Fraction num="15" den="100" />
              <span>＝</span>
              <Fraction num="675" den="100" />
              <span>＝ <strong>6,75€</strong></span>
            </div>
            <div className="pl-2 text-slate-700">
              Τελική Τιμή ＝ 45 － 6,75 ＝ <strong>38,25€</strong>
            </div>
          </div>

          {/* Γιάννα */}
          <div className="border-b border-slate-100 pb-2 space-y-1">
            <div className="font-sans font-bold text-slate-950">3. Γιάννα:</div>
            <div className="flex items-center gap-1.5 flex-wrap pl-2">
              <span>Έκπτωση ＝ 45 ·</span>
              <Fraction num="10" den="100" />
              <span>＝</span>
              <Fraction num="450" den="100" />
              <span>＝ <strong>4,50€</strong></span>
            </div>
            <div className="pl-2 text-slate-700">
              Τελική Τιμή ＝ 45 － 4,50 ＝ <strong>40,50€</strong>
            </div>
          </div>

          {/* Δημοσθένης */}
          <div className="space-y-1 pt-0.5">
            <div className="font-sans font-bold text-emerald-800">4. Δημοσθένης:</div>
            <div className="flex items-center gap-1.5 flex-wrap pl-2">
              <span>Έκπτωση ＝ 40 ·</span>
              <Fraction num="10" den="100" />
              <span>＝</span>
              <Fraction num="400" den="100" />
              <span>＝ <strong>4€</strong></span>
            </div>
            <div className="pl-2 text-emerald-800 font-bold">
              Τελική Τιμή ＝ 40 － 4 ＝ <strong>36€</strong>
            </div>
          </div>
        </div>

        <p className="pt-1">
          Η χαμηλότερη τιμή είναι τα <strong>36€</strong> στο κατάστημα <strong>του Δημοσθένη</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 4,
    officialNumber: 24,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    promptText: 'Στρίβουμε ένα συνηθισμένο κέρμα και ρίχνουμε ένα συνηθισμένο ζάρι (με 6 έδρες). Ποιο από τα επόμενα είναι πιθανότερο να συμβεί;',
    options: [
      { key: 'A', label: 'Να έρθει «γράμματα» στο κέρμα.', raw: 'A' },
      { key: 'B', label: 'Να έρθει 1 στο ζάρι.', raw: 'B' },
      { key: 'Γ', label: 'Να έρθει αριθμός μεγαλύτερος του 1 στο ζάρι.', raw: 'Γ' },
      { key: 'Δ', label: 'Να μην έρθει «γράμματα» στο κέρμα.', raw: 'Δ' }
    ],
    correctRaw: 'Γ',
    explain: 'Πιθανότητες:\n• Περίπτωση Α: Να έρθει «γράμματα» = 1/2 = 50%\n• Περίπτωση Β:  Να έρθει 1 στο ζάρι = 1/6 ≈ 16,7%\n• Περίπτωση Γ:  Οι αριθμοί {2, 3, 4, 5, 6} είναι > του 1. Άρα κερδίζω αν έρθει 2 ή 3 ή 4 ή 5 ή 6. Προσθέτω τις περιπτώσεις που κερδίζω και είναι 5 στις 6 περιπτώσεις: 5/6 ≈ 83,3%\n• Περίπτωση Δ:  Να μην έρθει «γράμματα» σημαίνει να έρθει «κεφαλή» = 1/2 = 50%.\nΠιθανότερο είναι το ενδεχόμενο Γ (5/6 ≈ 83,3%).'
  },
  {
    id: 5,
    officialNumber: 25,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Σε μια κατασκήνωση κάθε παιδί έχει επιλέξει να κάνει ακριβώς ένα άθλημα. Στον πίνακα που ακολουθεί φαίνονται τα ποσοστά των παιδιών για διάφορους συνδυασμούς φύλου και αθλήματος. Για παράδειγμα, το 17% των παιδιών είναι αγόρια που έχουν επιλέξει μπάσκετ. Τι ποσοστό των κοριτσιών έχει επιλέξει μπάσκετ;',
    hasTable: 'table25',
    options: [
      { key: 'A', label: '12%', raw: '12%' },
      { key: 'B', label: '25%', raw: '25%' },
      { key: 'Γ', label: '64%', raw: '64%' },
      { key: 'Δ', label: '48%', raw: '48%' }
    ],
    correctRaw: '25%',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Κάθε παιδί (αγόρι ή κορίτσι) επιλέγει <strong>ακριβώς ένα άθλημα</strong>, επομένως υπολογίζεται μόνο μία φορά στα ποσοστά του πίνακα. Δεν χρειάζεται να γνωρίζουμε τον ακριβή αριθμό των παιδιών της κατασκήνωσης.
        </p>

        <p>
          1. <strong>Εύρεση ποσοστού κοριτσιών στο μπάσκετ (επί του συνόλου):</strong><br />
          Προσθέτουμε τα γνωστά ποσοστά όλων των κελιών:
        </p>

        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          5,5% ＋ 29,5% ＋ 29,5% ＋ 6,5% ＋ 17% ＝ <strong>88%</strong>
        </div>

        <p>
          Αφαιρούμε από το <strong>100%</strong> (σύνολο όλων των παιδιών):
        </p>

        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          100% － 88% ＝ <strong>12%</strong> των παιδιών είναι κορίτσια που παίζουν μπάσκετ.
        </div>

        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl text-amber-950 space-y-1">
          <span className="font-black block uppercase text-[11px] tracking-wider text-amber-800">
            ⚠️ Προσοχη:
          </span>
          <p>
            Το <strong>12%</strong> εκφράζει το ποσοστό στον <strong>συνολικό αριθμό</strong> όλων των παιδιών.<br />
            Η ερώτηση ζητάει: <em>«Τι ποσοστό <strong>των κοριτσιών</strong> έχει επιλέξει μπάσκετ;»</em>
          </p>
        </div>

        <p>
          2. <strong>Συνολικό ποσοστό κοριτσιών στην κατασκήνωση:</strong><br />
          Αθροίζουμε τα κορίτσια και από τα τρία αθλήματα:
        </p>

        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          29,5% (Βόλεϊ) ＋ 6,5% (Ποδόσφαιρο) ＋ 12% (Μπάσκετ) ＝ <strong>48%</strong>
        </div>

        <p>
          3. <strong>Ποσοστό των κοριτσιών που επέλεξαν μπάσκετ:</strong><br />
          Διαιρούμε τα κορίτσια του μπάσκετ με το σύνολο των κοριτσιών:
        </p>

        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="Κορίτσια Μπάσκετ" den="Σύνολο Κοριτσιών" />
          <span>＝</span>
          <Fraction num="12" den="48" />
          <span>＝</span>
          <Fraction num="1" den="4" />
          <span>＝ <strong className="text-emerald-700 text-base">25%</strong></span>
        </div>

        <p className="pt-1">
          Άρα, το <strong>25%</strong> των κοριτσιών επέλεξε μπάσκετ (Επιλογή <strong>Β</strong>).
        </p>
      </div>
    )
  },
  {
    id: 6,
    officialNumber: 26,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: (
      <span>
        Ποιος αριθμός από τους επόμενους είναι πιο κοντά στο{' '}
        <Fraction num="1" den="2" /> από ό,τι είναι στο{' '}
        <Fraction num="1" den="4" />;
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="1" den="6" />, raw: '1/6' },
      { key: 'B', label: <Fraction num="1" den="5" />, raw: '1/5' },
      { key: 'Γ', label: <Fraction num="3" den="8" />, raw: '3/8' },
      { key: 'Δ', label: '1', raw: '1' }
    ],
    correctRaw: '1',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Για να συγκρίνουμε τις αποστάσεις των αριθμών από το{' '}
          <Fraction num="1" den="4" /> και το{' '}
          <Fraction num="1" den="2" />, υπολογίζουμε αρχικά το <strong>μέσο</strong> τους (το σημείο που ισαπέχει ακριβώς και από τα δύο):
        </p>

        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Μέσο ＝ (</span>
          <Fraction num="1" den="4" />
          <span>＋</span>
          <Fraction num="1" den="2" />
          <span>) : 2 ＝ (</span>
          <Fraction num="1" den="4" />
          <span>＋</span>
          <Fraction num="2" den="4" />
          <span>) : 2 ＝</span>
          <Fraction num="3" den="4" />
          <span>: 2 ＝ <strong><Fraction num="3" den="8" /> (＝ 0,375)</strong></span>
        </div>

        {/* ΑΡΙΘΜΟΓΡΑΜΜΗ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 overflow-x-auto my-2">
          <svg width="420" height="120" viewBox="0 0 420 120" className="select-none mx-auto block font-mono">
            <defs>
              <marker id="arrow-axis" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 2 L 8 5 L 0 8 z" fill="#334155" />
              </marker>
            </defs>

            {/* Άξονας αριθμών: x = 0 αντιστοιχεί σε 0px (x=30), x = 1 αντιστοιχεί σε 340px (x=370) */}
            <line x1="20" y1="58" x2="395" y2="58" stroke="#334155" strokeWidth="2" markerEnd="url(#arrow-axis)" />

            {/* Σημεία αναφοράς 1/4, 3/8 (μέσο), 1/2 */}
            {/* 0 -> 30 */}
            <line x1="30" y1="50" x2="30" y2="66" stroke="#94a3b8" strokeWidth="1.5" />
            <text x="30" y="82" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#64748b">0</text>

            {/* 1/6 ≈ 0.167 -> x = 30 + 340*0.1667 = 87 */}
            <circle cx="87" cy="58" r="4" fill="#64748b" />
            <text x="87" y="38" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">1/6</text>

            {/* 1/5 = 0.200 -> x = 30 + 340*0.20 = 98 */}
            <circle cx="98" cy="58" r="4" fill="#64748b" />
            <text x="98" y="82" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">1/5</text>

            {/* 1/4 = 0.250 -> x = 30 + 340*0.25 = 115 */}
            <circle cx="115" cy="58" r="5" fill="#2563eb" />
            <text x="115" y="38" fontSize="12" fontWeight="black" textAnchor="middle" fill="#1d4ed8">1/4</text>

            {/* Μέσο 3/8 = 0.375 -> x = 30 + 340*0.375 = 157.5 */}
            <line x1="157.5" y1="46" x2="157.5" y2="70" stroke="#d97706" strokeWidth="2" strokeDasharray="3 2" />
            <circle cx="157.5" cy="58" r="4.5" fill="#f59e0b" />
            <text x="157.5" y="86" fontSize="10" fontWeight="black" textAnchor="middle" fill="#b45309">3/8 (μέσο)</text>

            {/* 1/2 = 0.500 -> x = 30 + 340*0.50 = 200 */}
            <circle cx="200" cy="58" r="5" fill="#2563eb" />
            <text x="200" y="38" fontSize="12" fontWeight="black" textAnchor="middle" fill="#1d4ed8">1/2</text>

            {/* 1 = 1.000 -> x = 30 + 340*1.00 = 370 */}
            <circle cx="370" cy="58" r="5" fill="#15803d" />
            <text x="370" y="38" fontSize="12" fontWeight="black" textAnchor="middle" fill="#15803d">1</text>
            <text x="370" y="82" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#15803d">1</text>
          </svg>
        </div>

        <p>
          <strong>Συμπέρασμα από την αριθμογραμμή:</strong>
        </p>

        <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
          <li>
            Το <strong><Fraction num="3" den="8" /></strong> βρίσκεται ακριβώς στη μέση των <Fraction num="1" den="4" /> και <Fraction num="1" den="2" />, επομένως <strong>ισαπέχει</strong> και από τα δύο.
          </li>
          <li>
            Οι αριθμοί <strong><Fraction num="1" den="6" /></strong> και <strong><Fraction num="1" den="5" /></strong> είναι μικρότεροι από το <Fraction num="1" den="4" />, άρα βρίσκονται σαφώς πιο κοντά στο <Fraction num="1" den="4" />.
          </li>
          <li>
            Οποιοσδήποτε αριθμός βρίσκεται <strong>δεξιότερα από το μέσο <Fraction num="3" den="8" /></strong> είναι πιο κοντά στο <Fraction num="1" den="2" /> από ό,τι στο <Fraction num="1" den="4" />.
          </li>
          <li>
            Ο αριθμός <strong>1</strong> έχει απόσταση από το <Fraction num="1" den="2" /> ίση με <strong>0,5</strong>, ενώ από το <Fraction num="1" den="4" /> απέχει <strong>0,75</strong>.
          </li>
        </ul>

        <p className="pt-1">
          Επομένως, ο αριθμός που είναι πιο κοντά στο <Fraction num="1" den="2" /> από ό,τι στο <Fraction num="1" den="4" /> είναι το <strong>1</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 7,
    officialNumber: 27,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Αναμειγνύουμε ίδια ποσότητα από τρία ροφήματα. Τα δύο περιέχουν 22% πορτοκάλι το καθένα, ενώ το τρίτο περιέχει 34% πορτοκάλι. Πόσο % πορτοκάλι περιέχει το ρόφημα που προέκυψε από την ανάμειξη;',
    options: [
      { key: 'A', label: '22%', raw: '22%' },
      { key: 'B', label: '26%', raw: '26%' },
      { key: 'Γ', label: '28%', raw: '28%' },
      { key: 'Δ', label: '30%', raw: '30%' }
    ],
    correctRaw: '26%',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έχουμε 3 ροφήματα με περιεκτικότητες σε πορτοκάλι και τα αναμειγνύουμε. Το βασικό στοιχείο είναι ότι οι ποσότητες που αναμειγνύουμε είναι <strong>ίσες</strong>.
        </p>

        <p>
          Επομένως, το τελικό μείγμα αποτελείται κατά το <Fraction num="1" den="3" /> από κάθε επιμέρους ρόφημα.
        </p>

        <p>
          Η ποσότητα πορτοκαλιού στο τελικό ρόφημα προκύπτει από το άθροισμα:
        </p>

        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-medium text-slate-800 text-center">
          <Fraction num="1" den="3" /> του 1ου ＋ <Fraction num="1" den="3" /> του 2ου ＋ <Fraction num="1" den="3" /> του 3ου
        </div>

        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Fraction num="1" den="3" />
            <span>· 22% ＋</span>
            <Fraction num="1" den="3" />
            <span>· 22% ＋</span>
            <Fraction num="1" den="3" />
            <span>· 34% ＝</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pl-2">
            <span>＝</span>
            <Fraction num="1" den="3" />
            <span>· (22% ＋ 22% ＋ 34%) ＝</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pl-2">
            <span>＝</span>
            <Fraction num="1" den="3" />
            <span>· 78% ＝</span>
            <Fraction num="78" den="3" />
            <span>% ＝ <strong className="text-emerald-700 text-base">26%</strong></span>
          </div>
        </div>

        <p className="pt-1">
          Άρα, το ρόφημα που προέκυψε περιέχει <strong>26%</strong> πορτοκάλι (Επιλογή <strong>Β</strong>).
        </p>
      </div>
    )
  },
  {
    id: 8,
    officialNumber: 28,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Έχουμε 225 αμύγδαλα, 99 καρύδια και 54 κάστανα. Θέλουμε να τα μοιράσουμε σε σακουλάκια ώστε όλα να περιέχουν ίδιο αριθμό από αμύγδαλα, ίδιο αριθμό από καρύδια και ίδιο αριθμό από κάστανα. Πόσα το πολύ τέτοια σακουλάκια μπορούμε να γεμίσουμε;',
    options: [
      { key: 'A', label: '1', raw: '1' },
      { key: 'B', label: '3', raw: '3' },
      { key: 'Γ', label: '5', raw: '5' },
      { key: 'Δ', label: '9', raw: '9' }
    ],
    correctRaw: '9',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Το μέγιστο πλήθος από σακουλάκια που μπορούμε να γεμίσουμε ισούται με τον <strong>Μέγιστο Κοινό Διαιρέτη</strong> των ποσοτήτων των καρπών: <strong>ΜΚΔ(225, 99, 54)</strong>.
        </p>

        <p>
          Βρίσκουμε όλους τους διαιρέτες του κάθε αριθμού:
        </p>

        <div className="space-y-2 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>
            <strong className="font-sans text-slate-950">Διαιρέτες του 225:</strong> 1, 3, 5, <strong className="text-emerald-700 font-bold underline">9</strong>, 15, 25, 45, 75, 225
          </div>
          <div>
            <strong className="font-sans text-slate-950">Διαιρέτες του 99:</strong> 1, 3, <strong className="text-emerald-700 font-bold underline">9</strong>, 11, 33, 99
          </div>
          <div>
            <strong className="font-sans text-slate-950">Διαιρέτες του 54:</strong> 1, 2, 3, 6, <strong className="text-emerald-700 font-bold underline">9</strong>, 18, 27, 54
          </div>
        </div>

        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 space-y-1.5">
          <div className="font-mono text-slate-800">
            • <strong>Κοινοί Διαιρέτες:</strong> 1, 3, 9
          </div>
          <div className="font-mono text-emerald-800 font-bold">
            • <strong>Μέγιστος Κοινός Διαιρέτης:</strong> ΜΚΔ(225, 99, 54) ＝ 9
          </div>
        </div>

        <p className="pt-1">
          Επομένως, το μέγιστο πλήθος σακουλών που μπορούμε να γεμίσουμε είναι <strong>9</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 9,
    officialNumber: 29,
    group: 'ΟΜΑΔΑ Α (4 Επιλογες)',
    promptText: 'Οι πλευρές ενός τετραγώνου και ενός τριγώνου είναι όλες ίσες μεταξύ τους. Αν το άθροισμα των περιμέτρων τους είναι 21 εκατοστά, το εμβαδόν του τετραγώνου σε τ. εκ. (τετραγωνικά εκατοστά) είναι:',
    options: [
      { key: 'A', label: '6', raw: '6' },
      { key: 'B', label: '9', raw: '9' },
      { key: 'Γ', label: '12', raw: '12' },
      { key: 'Δ', label: '49', raw: '49' }
    ],
    correctRaw: '9',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Έστω <strong>x</strong> το κοινό μήκος της πλευράς του τετραγώνου και του τριγώνου. Εφόσον όλες οι πλευρές είναι ίσες, το τρίγωνο είναι <strong>ισόπλευρο</strong>:
        </p>

        {/* SVG ΣΧΗΜΑ ΤΕΤΡΑΓΩΝΟΥ & ΙΣΟΠΛΕΥΡΟΥ ΤΡΙΓΩΝΟΥ */}
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="320" height="135" viewBox="0 0 320 135" className="select-none font-mono">
            {/* ΤΕΤΡΑΓΩΝΟ (πλευρά 70px) */}
            <g>
              <rect x="35" y="35" width="70" height="70" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" rx="2" />
              {/* Ετικέτες x στις 4 πλευρές */}
              <text x="70" y="25" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
              <text x="70" y="122" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
              <text x="22" y="74" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
              <text x="118" y="74" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
              <text x="70" y="75" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#64748b" fontFamily="sans-serif">Τετράγωνο</text>
            </g>

            {/* ΙΣΟΠΛΕΥΡΟ ΤΡΙΓΩΝΟ (βάση 70px, ύψος ≈ 61px) */}
            <g>
              <polygon points="235,35 200,96 270,96" fill="#f8fafc" stroke="#1e293b" strokeWidth="2" strokeLinejoin="round" />
              {/* Ετικέτες x στις 3 πλευρές */}
              <text x="235" y="115" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#2563eb">x</text>
              <text x="206" y="58" fontSize="13" fontWeight="bold" textAnchor="end" fill="#2563eb">x</text>
              <text x="264" y="58" fontSize="13" fontWeight="bold" textAnchor="start" fill="#2563eb">x</text>
              <text x="235" y="80" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b" fontFamily="sans-serif">Τρίγωνο</text>
            </g>
          </svg>
        </div>

        {/* ΥΠΟΛΟΓΙΣΜΟΙ */}
        <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• <strong>Περίμετρος τετραγώνου (Π₁)</strong> ＝ 4 · x</div>
          <div>• <strong>Περίμετρος τριγώνου (Π₂)</strong> ＝ 3 · x</div>
          
          <div className="pt-2 border-t border-slate-200 space-y-2">
            <div>Συνολική Περίμετρος ＝ Π₁ ＋ Π₂ ＝ 21</div>
            <div>4 · x ＋ 3 · x ＝ 21</div>
            <div>7 · x ＝ 21</div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <span>x ＝</span>
              <Fraction num="21" den="7" />
              <span>➔ <strong>x ＝ 3 εκ.</strong></span>
            </div>
          </div>
        </div>

        {/* ΕΜΒΑΔΟΝ */}
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div className="font-sans font-bold text-slate-950">Εμβαδόν τετραγώνου:</div>
          <div>Ε ＝ πλευρά · πλευρά ＝ x · x ＝ 3 · 3 ＝ <strong className="text-emerald-700 text-base">9 τ. εκ.</strong></div>
        </div>

        <p className="pt-1">
          Άρα, το εμβαδόν του τετραγώνου είναι <strong>9 τ. εκ.</strong> (Επιλογή <strong>Β</strong>).
        </p>
      </div>
    )
  },
  {
    id: 10,
    officialNumber: 30,
    group: 'ΟΜΑΔΑ Α (4 επιλογες)',
    promptText: 'Πριν από μια ημερήσια σχολική εκδρομή οι μαθητές και οι μαθήτριες ενός σχολείου δήλωσαν από μία τροφή την οποία θα ήθελαν να περιέχει το γεύμα τους. Οι απαντήσεις σε ποσοστά (%) φαίνονται στο διάγραμμα που ακολουθεί. Σύμφωνα με τις απαντήσεις, τι ποσοστό των παιδιών δήλωσε τροφή ζωικής προέλευσης;',
    hasSvg: 'foodChart30',
    options: [
      { key: 'A', label: '5%', raw: '5%' },
      { key: 'B', label: '20%', raw: '20%' },
      { key: 'Γ', label: '45%', raw: '45%' },
      { key: 'Δ', label: '60%', raw: '60%' }
    ],
    correctRaw: '60%',
    explain: 'Οι τροφές ζωικής προέλευσης είναι: Αυγό κότας (15%), Γάλα αγελάδας (15%), Κρέας (5%), Κατσικίσιο τυρί (25%). Άθροισμα: 15 + 15 + 5 + 25 = 60%.'
  },
  {
    id: 11,
    officialNumber: 31,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Ένας καλαθοσφαιριστής έκανε 20 σουτ, δύο και τριών πόντων, και ευστόχησε κατά 60%, με αποτέλεσμα να πετύχει 29 πόντους. Πόσα εύστοχα τρίποντα είχε;',
    options: [
      { key: 'A', label: '7', raw: '7' },
      { key: 'B', label: '3', raw: '3' },
      { key: 'Γ', label: '8', raw: '8' },
      { key: 'Δ', label: '9', raw: '9' },
      { key: 'E', label: '5', raw: '5' }
    ],
    correctRaw: '5',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          1. <strong>Εύρεση συνολικών εύστοχων σουτ:</strong><br />
          Ο καλαθοσφαιριστής έκανε 20 σουτ και ευστόχησε στο 60% αυτών.
        </p>

        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Εύστοχα σουτ ＝ 20 ·</span>
          <Fraction num="60" den="100" />
          <span>＝ 20 · 0,60 ＝ <strong>12 εύστοχα σουτ</strong></span>
        </div>

        <p>
          2. <strong>Δημιουργία εξισώσεων:</strong><br />
          Ορίζουμε άγνωστους απευθείας στα <em>εύστοχα</em> σουτ:
        </p>

        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 space-y-1.5 font-mono text-slate-900">
          <div>• Έστω <strong>x</strong> ο αριθμός των <strong>εύστοχων δίποντων</strong>.</div>
          <div>• Έστω <strong>y</strong> ο αριθμός των <strong>εύστοχων τρίποντων</strong>.</div>
          <div className="pt-1 text-slate-700">
            Σύνολο εύστοχων: <strong>x ＋ y ＝ 12</strong> (1)
          </div>
          <div className="text-slate-700">
            Σύνολο πόντων: <strong>2x ＋ 3y ＝ 29</strong> (2)
          </div>
        </div>

        <p>
          3. <strong>Επίλυση:</strong>
          <br />
          Αναλύουμε το 2x σε <strong>x ＋ x</strong> και το 3y σε <strong>y ＋ y ＋ y</strong> στην εξίσωση των πόντων:
        </p>

        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div>2x ＋ 3y ＝ 29</div>
          <div>x ＋ x ＋ y ＋ y ＋ y ＝ 29</div>
          <div>(x ＋ y) ＋ (x ＋ y) ＋ y ＝ 29</div>
          <div className="text-slate-600 text-xs">// Αντικαθιστούμε όπου (x ＋ y) το 12</div>
          <div>12 ＋ 12 ＋ y ＝ 29</div>
          <div>24 ＋ y ＝ 29</div>
          <div>y ＝ 29 － 24 ➔ <strong className="text-emerald-700 text-base">y ＝ 5</strong></div>
        </div>

        <p className="pt-1">
          Επομένως, ο καλαθοσφαιριστής είχε <strong>5 εύστοχα τρίποντα</strong> (Επιλογή <strong>E</strong>).
        </p>
      </div>
    )
  },
    {
    id: 12,
    officialNumber: 32,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: (
      <div className="space-y-3">
        <p>Μια εφαρμογή σε κινητό τηλέφωνο εκτελεί τα εξής βήματα:</p>
        <ul className="space-y-1.5 pl-4 sm:pl-6 text-slate-800 font-medium list-disc">
          <li><strong>Βήμα 1:</strong> Ζητάει από τον χρήστη έναν ακέραιο αριθμό.</li>
          <li><strong>Βήμα 2:</strong> Διπλασιάζει τον αριθμό που έδωσε ο χρήστης στο βήμα 1.</li>
          <li><strong>Βήμα 3:</strong> Ζητάει από τον χρήστη έναν ακέραιο αριθμό.</li>
          <li><strong>Βήμα 4:</strong> Προσθέτει τον αριθμό που έδωσε ο χρήστης στο βήμα 3 με το αποτέλεσμα του βήματος 2.</li>
          <li><strong>Βήμα 5:</strong> Γράφει το αποτέλεσμα του βήματος 4.</li>
          <li><strong>Βήμα 6:</strong> Γράφει το γινόμενο των αριθμών που έδωσε ο χρήστης στο βήμα 1 και το βήμα 3.</li>
        </ul>
        <p>
          Αν ο αριθμός που γράφει η εφαρμογή στο βήμα 5 είναι 11 και ο αριθμός που γράφει στο βήμα 6 είναι 15, τότε ο αριθμός που έδωσε ο χρήστης στο βήμα 1 είναι:
        </p>
      </div>
    ),
    options: [
      { key: 'A', label: '1', raw: '1' },
      { key: 'B', label: '2', raw: '2' },
      { key: 'Γ', label: '3', raw: '3' },
      { key: 'Δ', label: '4', raw: '4' },
      { key: 'E', label: '5', raw: '5' }
    ],
    correctRaw: '3',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Συμβολίζουμε με <strong>x</strong> τον ακέραιο αριθμό στο Βήμα 1 και με <strong>y</strong> τον ακέραιο αριθμό στο Βήμα 3.
        </p>

        <p>
          Ακολουθούμε αναλυτικά τα βήματα της εφαρμογής:
        </p>

        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• <strong>Βήμα 1:</strong> x</div>
          <div>• <strong>Βήμα 2:</strong> 2 · x <span className="text-slate-500 font-sans text-xs">(διπλασιασμός του x)</span></div>
          <div>• <strong>Βήμα 3:</strong> y</div>
          <div>• <strong>Βήμα 4:</strong> y ＋ 2 · x</div>
          <div>• <strong>Βήμα 5:</strong> Εκτύπωσε: <strong>y ＋ 2 · x ＝ 11</strong></div>
          <div>• <strong>Βήμα 6:</strong> Εκτύπωσε: <strong>x · y ＝ 15</strong></div>
        </div>

        <p>
          Έχουμε λοιπόν δύο σχέσεις που πρέπει να ικανοποιούνται <strong>ταυτόχρονα</strong>:
        </p>

        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>(1) y ＋ 2 · x ＝ 11</div>
          <div>(2) x · y ＝ 15</div>
        </div>

        <p>
          Εξετάζουμε τους συνδυασμούς <strong>ακέραιων αριθμών</strong> για τη σχέση (2):
        </p>

        <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div className="flex items-center gap-2 flex-wrap">
            <span>• Για <strong>x ＝ 1</strong>, <strong>y ＝ 15</strong>:</span>
            <span className="text-rose-700">15 ＋ 2 · 1 ＝ 17 ≠ 11</span>
            <span className="text-rose-600 font-sans text-xs">(απορρίπτεται)</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span>• Για <strong>x ＝ 3</strong>, <strong>y ＝ 5</strong>:</span>
            <span className="text-emerald-700 font-bold">5 ＋ 2 · 3 ＝ 5 ＋ 6 ＝ 11</span>
            <span className="text-emerald-600 font-sans text-xs">(επαληθεύεται!)</span>
          </div>
        </div>

        <p className="pt-1">
          Άρα, ο αριθμός <strong>x</strong> που έδωσε ο χρήστης στο Βήμα 1 είναι το <strong>3</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
 {
    id: 13,
    officialNumber: 33,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Για την παρασκευή ενός φρουτοχυμού χρειάζονται 4 ποτήρια χυμού πορτοκαλιού, 11 ποτήρια χυμού μήλου και 13 ποτήρια χυμού αχλαδιού. Για την παρασκευή μεγαλύτερης ποσότητας φρουτοχυμού με την ίδια αναλογία συστατικών, για ένα πάρτι, τα ποτήρια χυμού αχλαδιού που χρησιμοποιήσαμε ήταν κατά 45 περισσότερα από τα ποτήρια χυμού πορτοκαλιού. Πόσα ποτήρια χυμού μήλου χρησιμοποιήσαμε;',
    options: [
      { key: 'A', label: '20', raw: '20' },
      { key: 'B', label: '55', raw: '55' },
      { key: 'Γ', label: '45', raw: '45' },
      { key: 'Δ', label: '65', raw: '65' },
      { key: 'E', label: '70', raw: '70' }
    ],
    correctRaw: '55',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Η αρχική αναλογία συστατικών για τον φρουτοχυμό είναι:
        </p>

        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• <strong>4</strong> ποτήρια χυμού πορτοκαλιού</div>
          <div>• <strong>11</strong> ποτήρια χυμού μήλου</div>
          <div>• <strong>13</strong> ποτήρια χυμού αχλαδιού</div>
        </div>

        {/* 1ος ΤΡΟΠΟΣ */}
        <div className="bg-white/80 p-3.5 rounded-2xl border border-slate-200/90 space-y-2.5">
          <div className="font-sans font-bold text-blue-900 text-sm border-b border-slate-200 pb-1">
            🔷 1ος Τρόπος (με εξίσωση αναλογιών)
          </div>

          <p className="text-slate-800">
            Έστω <strong>x</strong> τα τελικά ποτήρια χυμού πορτοκαλιού. Τότε τα ποτήρια χυμού αχλαδιού είναι <strong>x ＋ 45</strong>.
          </p>

          <p className="text-slate-700 font-medium">
            Επειδή η αναλογία διατηρείται σταθερή:
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Fraction num="Πορτοκάλι (αρχικό)" den="Αχλάδι (αρχικό)" />
              <span>＝</span>
              <Fraction num="Πορτοκάλι (τελικό)" den="Αχλάδι (τελικό)" />
            </div>

            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              <Fraction num="4" den="13" />
              <span>＝</span>
              <Fraction num="x" den="x ＋ 45" />
            </div>

            <div className="pt-1 space-y-1">
              <div>4 · (x ＋ 45) ＝ 13x</div>
              <div>4x ＋ 180 ＝ 13x</div>
              <div>180 ＝ 13x － 4x</div>
              <div>180 ＝ 9x</div>
              <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
                <span>x ＝</span>
                <Fraction num="180" den="9" />
                <span>➔ <strong>x ＝ 20 ποτήρια πορτοκαλιού</strong></span>
              </div>
            </div>
          </div>

          <p className="text-slate-800 pt-1">
            Έχουμε λοιπόν <strong>20</strong> ποτήρια πορτοκαλιού (και 20 ＋ 45 ＝ 65 αχλαδιού). Υπολογίζουμε τα ποτήρια χυμού μήλου (έστω <strong>m</strong>):
          </p>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Fraction num="4" den="11" />
              <span>＝</span>
              <Fraction num="20" den="m" />
            </div>
            <div className="space-y-1">
              <div>4 · m ＝ 20 · 11</div>
              <div>4 · m ＝ 4 · 5 · 11</div>
              <div>m ＝ 5 · 11 ➔ <strong className="text-emerald-700 text-base">m ＝ 55 ποτήρια μήλου</strong></div>
            </div>
          </div>
        </div>

        {/* 2ος ΤΡΟΠΟΣ */}
        <div className="bg-emerald-50/50 p-3.5 rounded-2xl border border-emerald-200/80 space-y-2">
          <div className="font-sans font-bold text-emerald-900 text-sm border-b border-emerald-200 pb-1">
            💡 2ος Τρόπος (με μερίδια)
          </div>

          <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
            <li>
              Η διαφορά σε μερίδια μεταξύ αχλαδιού και πορτοκαλιού είναι: <strong>13 － 4 ＝ 9 μερίδια</strong>.
            </li>
            <li>
              Τα 9 μερίδια αντιστοιχούν σε 45 ποτήρια, άρα το 1 μερίδιο είναι: <strong>45 : 9 ＝ 5 ποτήρια</strong>.
            </li>
            <li>
              Τα ποτήρια χυμού μήλου αντιστοιχούν σε 11 μερίδια: <strong>11 · 5 ＝ 55 ποτήρια</strong>.
            </li>
          </ul>
        </div>

        <p className="pt-1">
          Συνεπώς, χρησιμοποιήσαμε <strong>55 ποτήρια</strong> χυμού μήλου (Επιλογή <strong>Β</strong>).
        </p>
      </div>
    )
  },
  {
    id: 14,
    officialNumber: 34,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Ένας κύβος αποτελείται από 27 ίσα κυβάκια, όπως στο σχήμα που ακολουθεί (με εναλλάξ άσπρα και μαύρα κυβάκια). Πόσα είναι τα άσπρα κυβάκια;',
    options: [
      { key: 'A', label: '9', raw: '9' },
      { key: 'B', label: '12', raw: '12' },
      { key: 'Γ', label: '13', raw: '13' },
      { key: 'Δ', label: '14', raw: '14' },
      { key: 'E', label: '15', raw: '15' }
    ],
    correctRaw: '13',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <div className="bg-amber-50 border-l-4 border-amber-500 p-3 rounded-r-xl text-amber-950 space-y-1">
          <span className="font-black block uppercase text-[11px] tracking-wider text-amber-800">
            ⚠️ Προσοχη στο ζητουμενο:
          </span>
          <p>
            Μας ζητείται να μετρήσουμε τα <strong>άσπρα κυβάκια</strong> ως τρισδιάστατα σώματα και <strong>όχι τις άσπρες πλευρές</strong> (έδρες) που φαίνονται εξωτερικά. Κάθε μικρό κυβάκι έχει 6 έδρες, αλλά εδώ μετράμε το πλήθος των κύβων.
          </p>
        </div>

        <p>
          Ο μεγάλος κύβος (3 × 3 × 3 = 27 κυβάκια) αναλύεται σε <strong>3 οριζόντια επίπεδα (στρώσεις)</strong> των 9 κύβων (3 × 3):
        </p>

        {/* SVG ΜΕ ΤΑ 3 ΞΕΧΩΡΙΣΤΑ ΕΠΙΠΕΔΑ ΣΕ ΙΣΟΜΕΤΡΙΚΗ 3D ΠΡΟΒΟΛΗ */}
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          {(() => {
            // Μετατροπή ισομετρικών συντεταγμένων (col, row) σε (x, y)
            const getIsoCoords = (col, row, ox, oy) => ({
              x: ox + (col - row) * 16,
              y: oy + (col + row) * 9
            });

            // Component για κάθε μικρό 3D κυβάκι με 3 ορατές έδρες (πάνω, αριστερά, δεξιά)
            const IsoCube = ({ col, row, isWhite, ox, oy }) => {
              const { x, y } = getIsoCoords(col, row, ox, oy);
              const topFill = isWhite ? '#ffffff' : '#1e293b';
              const leftFill = isWhite ? '#cbd5e1' : '#0f172a';
              const rightFill = isWhite ? '#94a3b8' : '#020617';
              const strokeColor = '#334155';

              return (
                <g stroke={strokeColor} strokeWidth="1.2" strokeLinejoin="round">
                  {/* Πάνω έδρα */}
                  <polygon points={`${x},${y - 12} ${x + 16},${y - 3} ${x},${y + 6} ${x - 16},${y - 3}`} fill={topFill} />
                  {/* Αριστερή έδρα */}
                  <polygon points={`${x - 16},${y - 3} ${x},${y + 6} ${x},${y + 20} ${x - 16},${y + 11}`} fill={leftFill} />
                  {/* Δεξιά έδρα */}
                  <polygon points={`${x},${y + 6} ${x + 16},${y - 3} ${x + 16},${y + 11} ${x},${y + 20}`} fill={rightFill} />
                </g>
              );
            };

            // Διάταξη των 3 επιπέδων (true = άσπρο κυβάκι, false = μαύρο)
            const topLayer = [
              [false, true, false],
              [true, false, true],
              [false, true, false]
            ];

            const midLayer = [
              [true, false, true],
              [false, true, false],
              [true, false, true]
            ];

            const botLayer = [
              [false, true, false],
              [true, false, true],
              [false, true, false]
            ];

            // Render στρώσης με σωστή σειρά σχεδίασης (από πίσω προς τα εμπρός)
            const renderLayer = (layerGrid, ox, oy) => {
              const cubes = [];
              for (let sum = 0; sum <= 4; sum++) {
                for (let r = 0; r < 3; r++) {
                  const c = sum - r;
                  if (c >= 0 && c < 3) {
                    cubes.push(
                      <IsoCube
                        key={`${c}-${r}`}
                        col={c}
                        row={r}
                        isWhite={layerGrid[r][c]}
                        ox={ox}
                        oy={oy}
                      />
                    );
                  }
                }
              }
              return cubes;
            };

            return (
              <svg width="450" height="175" viewBox="0 0 450 175" className="select-none font-sans">
                {/* 1. ΠΑΝΩ ΣΤΡΩΣΗ */}
                <g>
                  <text x="75" y="20" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                    Πάνω στρώση
                  </text>
                  {renderLayer(topLayer, 75, 48)}
                  <text x="75" y="155" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0284c7">
                    4 άσπρα
                  </text>
                </g>

                {/* 2. ΜΕΣΑΙΑ ΣΤΡΩΣΗ */}
                <g>
                  <text x="225" y="20" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                    Μεσαία στρώση
                  </text>
                  {renderLayer(midLayer, 225, 48)}
                  <text x="225" y="155" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0284c7">
                    5 άσπρα
                  </text>
                </g>

                {/* 3. ΚΑΤΩ ΣΤΡΩΣΗ */}
                <g>
                  <text x="375" y="20" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                    Κάτω στρώση
                  </text>
                  {renderLayer(botLayer, 375, 48)}
                  <text x="375" y="155" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0284c7">
                    4 άσπρα
                  </text>
                </g>
              </svg>
            );
          })()}
        </div>
        {/* ΚΑΤΑΜΕΤΡΗΣΗ */}
        <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• <strong>Πάνω στρώση:</strong> 4 άσπρα κυβάκια (στις 4 γωνίες)</div>
          <div>• <strong>Μεσαία στρώση:</strong> 5 άσπρα κυβάκια (στα 4 μέσα των πλευρών ＋ το κέντρο)</div>
          <div>• <strong>Κάτω στρώση:</strong> 4 άσπρα κυβάκια (στις 4 γωνίες, ακριβώς όπως η πάνω)</div>

          <div className="pt-2 border-t border-slate-200 flex items-center gap-2 flex-wrap">
            <span>Συνολικά άσπρα κυβάκια ＝ 4 ＋ 5 ＋ 4 ＝</span>
            <strong className="text-emerald-700 text-base">13 κυβάκια</strong>
          </div>
        </div>

        <p className="pt-1">
          Άρα, τα άσπρα κυβάκια είναι συνολικά <strong>13</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 15,
    officialNumber: 35,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Πόσοι τριψήφιοι θετικοί ακέραιοι αριθμοί έχουν γινόμενο ψηφίων ίσο με 6;',
    options: [
      { key: 'A', label: '3', raw: '3' },
      { key: 'B', label: '6', raw: '6' },
      { key: 'Γ', label: '8', raw: '8' },
      { key: 'Δ', label: '9', raw: '9' },
      { key: 'E', label: '12', raw: '12' }
    ],
    correctRaw: '9',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Έστω ότι ο τριψήφιος αριθμός αποτελείται από τα ψηφία <strong>x, y, z</strong>. Θέλουμε:
        </p>

        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono font-bold text-center text-slate-900 text-sm">
          x · y · z ＝ 6
        </div>

        <p>
          Κανένα ψηφίο δεν μπορεί να είναι <strong>0</strong>, διότι τότε το γινόμενο θα μηδενιζόταν. Επομένως, τα πιθανά μη μηδενικά ψηφία πρέπει να είναι <strong>διαιρέτες του 6</strong>, δηλαδή τα <strong>1, 2, 3 και 6</strong>.
        </p>

        <p>
          Οι μοναδικοί συνδυασμοί τριών ψηφίων με γινόμενο 6 είναι:
        </p>

        <div className="space-y-3 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          {/* 1ος συνδυασμός */}
          <div className="border-b border-slate-200 pb-2.5 space-y-1.5">
            <div className="font-sans font-bold text-slate-950">
              1. Ψηφία {'{1, 1, 6}'} <span className="text-slate-500 font-normal font-mono text-xs">(1 · 1 · 6 ＝ 6)</span>:
            </div>
            <div className="pl-3 flex items-center gap-2 flex-wrap">
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">116</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">161</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">611</span>
              <span className="text-slate-600 font-sans text-xs">➔ <strong>3 αριθμοί</strong></span>
            </div>
          </div>

          {/* 2ος συνδυασμός */}
          <div className="space-y-1.5 pt-0.5">
            <div className="font-sans font-bold text-slate-950">
              2. Ψηφία {'{1, 2, 3}'} <span className="text-slate-500 font-normal font-mono text-xs">(1 · 2 · 3 ＝ 6)</span>:
            </div>
            <div className="pl-3 flex items-center gap-2 flex-wrap">
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">123</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">132</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">213</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">231</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">312</span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold">321</span>
              <span className="text-slate-600 font-sans text-xs">➔ <strong>6 αριθμοί</strong></span>
            </div>
          </div>
        </div>

        <p>
          Δεν υπάρχει άλλος συνδυασμός μονοψήφιων θετικών ακεραίων, καθώς οποιαδήποτε άλλη επιλογή δίνει γινόμενο διαφορετικό από 6.
        </p>

        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-2 flex-wrap">
          <span>Συνολικό πλήθος αριθμών ＝ 3 ＋ 6 ＝</span>
          <strong className="text-emerald-700 text-base">9 τριψήφιοι αριθμοί</strong>
        </div>

        <p className="pt-1">
          Συνεπώς, υπάρχουν <strong>9</strong> τέτοιοι τριψήφιοι αριθμοί (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 16,
    officialNumber: 36,
    group: 'ΟΜΑΔΑ Β (5 Επιλογες)',
    promptText: 'Μέσα σε ένα τετράγωνο με εμβαδόν 4 τ. εκ. σχεδιάσαμε πέντε μικρότερα και ίσα μεταξύ τους τετράγωνα. Ποιο είναι το εμβαδόν του σκιασμένου τετραγώνου σε τ. εκ.;',
    hasSvg: 'squares36',
    options: [
      { key: 'A', label: '0,5', raw: '0.5' },
      { key: 'B', label: '0,8', raw: '0.8' },
      { key: 'Γ', label: '0,4', raw: '0.4' },
      { key: 'Δ', label: '0,3', raw: '0.3' },
      { key: 'E', label: 'Κανένα από τα προηγούμενα', raw: 'none' }
    ],
    correctRaw: '0.5',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Αναλύουμε το μεγάλο τετράγωνο μετρώντας πόσα ίσα μικρά τετράγωνα σχηματίζονται συνολικά από τα κομμάτια του:
        </p>

        {/* ΔΙΠΛΟ ΣΧΗΜΑ: ΑΝΑΛΥΣΗ ΚΟΜΜΑΤΙΩΝ ΚΑΙ ΑΝΑΣΥΝΘΕΣΗ ΣΕ 8 ΤΕΤΡΑΓΩΝΑ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="410" height="190" viewBox="0 0 410 190" className="select-none font-sans">
            {/* 1ο ΣΧΗΜΑ: ΑΡΧΙΚΟ ΜΕ ΧΡΩΜΑΤΙΣΜΕΝΑ ΚΟΜΜΑΤΙΑ */}
            <g transform="translate(15, 10)">
              <text x="80" y="0" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Ανάλυση στο Μεγάλο Τετράγωνο
              </text>
              <g transform="translate(0, 10)">
                {/* Εξωτερικό πλαίσιο */}
                <rect x="0" y="0" width="160" height="160" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />

                {/* 4 μπλε γωνιακά τρίγωνα */}
                <polygon points="0,0 40,0 0,40" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.2" fillOpacity="0.85" />
                <polygon points="160,0 120,0 160,40" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.2" fillOpacity="0.85" />
                <polygon points="160,160 120,160 160,120" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.2" fillOpacity="0.85" />
                <polygon points="0,160 40,160 0,120" fill="#2563eb" stroke="#1d4ed8" strokeWidth="1.2" fillOpacity="0.85" />

                {/* 2 πράσινα τρίγωνα (πάνω & κάτω) */}
                <polygon points="40,0 120,0 80,40" fill="#4ade80" stroke="#16a34a" strokeWidth="1.2" fillOpacity="0.85" />
                <polygon points="40,160 120,160 80,120" fill="#4ade80" stroke="#16a34a" strokeWidth="1.2" fillOpacity="0.85" />

                {/* 2 πορτοκαλί τρίγωνα (αριστερά & δεξιά) */}
                <polygon points="0,40 0,120 40,80" fill="#fb923c" stroke="#ea580c" strokeWidth="1.2" fillOpacity="0.85" />
                <polygon points="160,40 160,120 120,80" fill="#fb923c" stroke="#ea580c" strokeWidth="1.2" fillOpacity="0.85" />

                {/* Τετράγωνα 1, 2, 4, 5 */}
                <polygon points="0,40 40,0 80,40 40,80" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <polygon points="120,0 160,40 120,80 80,40" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <polygon points="0,120 40,80 80,120 40,160" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <polygon points="120,80 160,120 120,160 80,120" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />

                {/* Κεντρικό σκιασμένο τετράγωνο (3) */}
                <polygon points="80,40 120,80 80,120 40,80" fill="#64748b" stroke="#0f172a" strokeWidth="2" />

                {/* Αριθμοί 1-5 */}
                <text x="40" y="45" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#dc2626">1</text>
                <text x="120" y="45" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#dc2626">2</text>
                <text x="80" y="85" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#ffffff">3</text>
                <text x="40" y="125" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#dc2626">4</text>
                <text x="120" y="125" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#dc2626">5</text>
              </g>
            </g>

            {/* ΒΕΛΟΣ ΜΕΤΑΒΑΣΗΣ */}
            <g transform="translate(188, 90)">
              <line x1="0" y1="0" x2="22" y2="0" stroke="#0f172a" strokeWidth="2" />
              <polygon points="22,-4 30,0 22,4" fill="#0f172a" />
            </g>

            {/* 2ο ΣΧΗΜΑ: ΤΑ 8 ΙΣΑ ΤΕΤΡΑΓΩΝΑ ΕΝΩΜΕΝΑ */}
            <g transform="translate(235, 10)">
              <text x="75" y="0" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Ένωση σε 8 Ίσα Τετράγωνα
              </text>
              <g transform="translate(0, 20)">
                {/* Σειρά 1: Τετράγωνα 1, 2, 3, 4 */}
                <rect x="0" y="0" width="36" height="36" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <text x="18" y="23" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#dc2626">1</text>

                <rect x="38" y="0" width="36" height="36" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <text x="56" y="23" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#dc2626">2</text>

                <rect x="76" y="0" width="36" height="36" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
                <text x="94" y="23" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ffffff">3</text>

                <rect x="114" y="0" width="36" height="36" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <text x="132" y="23" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#dc2626">4</text>

                {/* Σειρά 2: Τετράγωνο 5, Πορτοκαλί (6), Πράσινο (7), Μπλε (8) */}
                <rect x="0" y="42" width="36" height="36" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
                <text x="18" y="65" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#dc2626">5</text>

                {/* 6: 2 πορτοκαλί μισά */}
                <g transform="translate(38, 42)">
                  <polygon points="0,0 36,0 0,36" fill="#fb923c" stroke="#ea580c" strokeWidth="1" />
                  <polygon points="36,36 36,0 0,36" fill="#fb923c" stroke="#ea580c" strokeWidth="1" />
                  <rect x="0" y="0" width="36" height="36" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                  <text x="18" y="23" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#7c2d12">6</text>
                </g>

                {/* 7: 2 πράσινα μισά */}
                <g transform="translate(76, 42)">
                  <polygon points="0,0 36,0 0,36" fill="#4ade80" stroke="#16a34a" strokeWidth="1" />
                  <polygon points="36,36 36,0 0,36" fill="#4ade80" stroke="#16a34a" strokeWidth="1" />
                  <rect x="0" y="0" width="36" height="36" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                  <text x="18" y="23" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#14532d">7</text>
                </g>

                {/* 8: 4 μπλε τεταρτημόρια γωνιών */}
                <g transform="translate(114, 42)">
                  <polygon points="0,0 18,18 0,36" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.8" />
                  <polygon points="0,0 18,18 36,0" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.8" />
                  <polygon points="36,0 18,18 36,36" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.8" />
                  <polygon points="0,36 18,18 36,36" fill="#2563eb" stroke="#1d4ed8" strokeWidth="0.8" />
                  <rect x="0" y="0" width="36" height="36" fill="none" stroke="#0f172a" strokeWidth="1.5" />
                  <text x="18" y="23" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#ffffff">8</text>
                </g>
              </g>

              <text x="75" y="130" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#0369a1">
                Σύνολο: 8 ίσα τετράγωνα
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΗ ΚΑΤΑΜΕΤΡΗΣΗ */}
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• <strong>5 ακέραια τετράγωνα:</strong> Τα 1, 2, 3 (σκιασμένο), 4 και 5.</div>
          <div>• <strong>6ο τετράγωνο:</strong> Τα 2 πορτοκαλί τρίγωνα (αριστερά και δεξιά) ενώνονται σε 1 τετράγωνο.</div>
          <div>• <strong>7ο τετράγωνο:</strong> Τα 2 πράσινα τρίγωνα (πάνω και κάτω) ενώνονται σε 1 τετράγωνο.</div>
          <div>• <strong>8ο τετράγωνο:</strong> Τα 4 μπλε γωνιακά τριγωνάκια ενώνονται και σχηματίζουν 1 τετράγωνο.</div>
        </div>

        <p>
          Επομένως, ολόκληρο το αρχικό τετράγωνο αποτελείται ακριβώς από <strong>8 ίσα μικρά τετράγωνα</strong>:
        </p>

        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div>• Εμβαδόν μεγάλου τετραγώνου ＝ <strong>4 τ. εκ.</strong></div>
          <div>• Πλήθος ίσων τετραγώνων ＝ <strong>8</strong></div>

          <div className="pt-2 border-t border-slate-200 flex items-center gap-1.5 flex-wrap">
            <span>Εμβαδόν σκιασμένου τετραγώνου ＝</span>
            <Fraction num="4" den="8" />
            <span>＝</span>
            <Fraction num="1" den="2" />
            <span>＝ <strong className="text-emerald-700 text-base">0,5 τ. εκ.</strong></span>
          </div>
        </div>

        <p className="pt-1">
          Άρα, το εμβαδόν του σκιασμένου τετραγώνου είναι <strong>0,5 τ. εκ.</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
 {
    id: 17,
    officialNumber: 37,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Ένα μπουκάλι γεμάτο με νερό ζυγίζει ένα ορισμένο βάρος. Αν αδειάσουμε το μισό νερό, το συνολικό βάρος γίνεται το 60% του αρχικού βάρους. Ποιος είναι ο λόγος του βάρους του άδειου μπουκαλιού προς το βάρος του νερού που χωράει;',
    options: [
      { key: 'A', label: <Fraction num="1" den="4" />, raw: '1/4' },
      { key: 'B', label: <Fraction num="1" den="3" />, raw: '1/3' },
      { key: 'Γ', label: <Fraction num="1" den="2" />, raw: '1/2' },
      { key: 'Δ', label: <Fraction num="2" den="5" />, raw: '2/5' },
      { key: 'E', label: <Fraction num="3" den="4" />, raw: '3/4' }
    ],
    correctRaw: '1/4',
    explain: (
      <div className="space-y-4 text-xs sm:text-sm">
        <p>
          Ορίζουμε τις μεταβλητές για τα βάρη:
        </p>

        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Έστω <strong>x</strong> το βάρος του νερού όταν το μπουκάλι είναι γεμάτο.</div>
          <div>• Έστω <strong>y</strong> το βάρος του άδειου μπουκαλιού.</div>
          <div className="pt-1 text-slate-700 font-sans font-medium flex items-center gap-1.5 flex-wrap">
            <span>Ζητούμενο: Ο λόγος του άδειου μπουκαλιού προς το νερό, δηλαδή το</span>
            <strong className="font-mono text-blue-700"><Fraction num="y" den="x" /></strong>.
          </div>
        </div>

        {/* SVG ΣΧΗΜΑ: ΓΕΜΑΤΟ VS ΜΙΣΟΓΕΜΑΤΟ ΜΠΟΥΚΑΛΙ */}
        <div className="flex justify-center p-3 bg-white/90 rounded-2xl border border-slate-200/90 my-2 overflow-x-auto">
          <svg width="360" height="195" viewBox="0 0 360 195" className="select-none font-sans">
            {/* 1. ΑΡΧΙΚΗ ΚΑΤΑΣΤΑΣΗ: ΓΕΜΑΤΟ ΜΠΟΥΚΑΛΙ */}
            <g transform="translate(45, 12)">
              <text x="50" y="0" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Αρχικό Βάρος (x ＋ y)
              </text>
              
              {/* Σώμα μπουκαλιού */}
              <rect x="25" y="45" width="50" height="85" rx="6" fill="#f8fafc" stroke="#334155" strokeWidth="1.8" />
              {/* Λαιμός & Στόμιο */}
              <path d="M 40,45 L 40,20 L 60,20 L 60,45" fill="#f8fafc" stroke="#334155" strokeWidth="1.8" />
              <rect x="38" y="16" width="24" height="6" rx="2" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />

              {/* Νερό (Γεμάτο: ύψος 75px) */}
              <rect x="27" y="52" width="46" height="76" rx="4" fill="#38bdf8" fillOpacity="0.75" />
              <text x="50" y="93" fontSize="13" fontWeight="bold" textAnchor="middle" fill="#0369a1" fontFamily="monospace">
                νερό (x)
              </text>

              {/* Ετικέτα μπουκαλιού y */}
              <text x="50" y="148" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#64748b">
                μπουκάλι (y)
              </text>
              <text x="50" y="166" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a" fontFamily="monospace">
                Σύνολο: x ＋ y
              </text>
            </g>

            {/* 2. ΤΕΛΙΚΗ ΚΑΤΑΣΤΑΣΗ: ΜΙΣΟΓΕΜΑΤΟ ΜΠΟΥΚΑΛΙ */}
            <g transform="translate(215, 12)">
              <text x="50" y="0" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
                Τελικό Βάρος (x/2 ＋ y)
              </text>

              {/* Σώμα μπουκαλιού */}
              <rect x="25" y="45" width="50" height="85" rx="6" fill="#f8fafc" stroke="#334155" strokeWidth="1.8" />
              {/* Λαιμός & Στόμιο */}
              <path d="M 40,45 L 40,20 L 60,20 L 60,45" fill="#f8fafc" stroke="#334155" strokeWidth="1.8" />
              <rect x="38" y="16" width="24" height="6" rx="2" fill="#94a3b8" stroke="#334155" strokeWidth="1.5" />

              {/* Νερό (Μισό: ύψος 38px) */}
              <rect x="27" y="90" width="46" height="38" rx="4" fill="#38bdf8" fillOpacity="0.75" />
              <line x1="27" y1="90" x2="73" y2="90" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="2 2" />
              <text x="50" y="112" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0369a1" fontFamily="monospace">
                x/2
              </text>

              {/* Ετικέτα μπουκαλιού y */}
              <text x="50" y="148" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#64748b">
                μπουκάλι (y)
              </text>
              <text x="50" y="166" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0284c7" fontFamily="monospace">
                60% · (x ＋ y)
              </text>
            </g>
          </svg>
        </div>

        {/* ΑΝΑΛΥΤΙΚΗ ΕΠΙΛΥΣΗ ΕΞΙΣΩΣΗΣ */}
        <p>
          Όταν αδειάσουμε το μισό νερό, το νέο βάρος είναι ίσο με το 60% του αρχικού:
        </p>

        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Fraction num="x" den="2" />
            <span>＋ y ＝ 60% · (x ＋ y)</span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap pl-2">
            <Fraction num="x" den="2" />
            <span>＋ y ＝ 0,6 · (x ＋ y)</span>
          </div>

          <div className="text-slate-500 font-sans text-xs pl-2">
            // Πολλαπλασιάζουμε όλη την εξίσωση με το 2 για απαλοιφή παρονομαστή:
          </div>

          <div className="pl-2 space-y-1">
            <div>x ＋ 2y ＝ 2 · 0,6 · (x ＋ y)</div>
            <div>x ＋ 2y ＝ 1,2 · (x ＋ y)</div>
            <div>x ＋ 2y ＝ 1,2x ＋ 1,2y</div>
          </div>

          <div className="text-slate-500 font-sans text-xs pl-2">
            // Χωρίζουμε μεταβλητές (τα y αριστερά και τα x δεξιά):
          </div>

          <div className="pl-2 space-y-1">
            <div>2y － 1,2y ＝ 1,2x － x</div>
            <div>0,8y ＝ 0,2x</div>
            <div>8y ＝ 2x</div>
            <div>4y ＝ x</div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center gap-2 flex-wrap">
            <span>Λόγος:</span>
            <Fraction num="y" den="x" />
            <span>＝</span>
            <strong className="text-emerald-700 text-base"><Fraction num="1" den="4" /></strong>
          </div>
        </div>

        <p className="pt-1">
          Επομένως, ο λόγος του βάρους του άδειου μπουκαλιού προς το βάρος του νερού είναι <strong><Fraction num="1" den="4" /></strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 18,
    officialNumber: 38,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    promptText: 'Ένα ορθογώνιο παραλληλόγραμμο έχει υποδιαιρεθεί σε εννιά μικρότερα ορθογώνια παραλληλόγραμμα διαφορετικών διαστάσεων, όπως στο σχήμα που ακολουθεί. Αν οι περίμετροι των Α, Β και Γ είναι 36, 56 και 50 εκ. αντίστοιχα, ποια είναι η περίμετρος του αρχικού ορθογωνίου;',
    hasSvg: 'grid38',
    options: [
      { key: 'A', label: '138 εκ.', raw: '138' },
      { key: 'B', label: '150 εκ.', raw: '150' },
      { key: 'Γ', label: '146 εκ.', raw: '146' },
      { key: 'Δ', label: '142 εκ.', raw: '142' },
      { key: 'E', label: 'Δεν μπορούμε να την υπολογίσουμε με βάση τα δεδομένα.', raw: 'unknown' }
    ],
    correctRaw: '142',
    explain: 'Αν x1, x2, x3 είναι τα πλάτη των τριών στηλών και y1, y2, y3 τα ύψη των τριών γραμμών, η περίμετρος του αρχικού ορθογωνίου είναι 2 · (x1 + x2 + x3 + y1 + y2 + y3). Οι περίμετροι των διαγώνιων ορθογωνίων είναι 2(x1 + y1) = 36, 2(x2 + y2) = 56 και 2(x3 + y3) = 50. Προσθέτοντας κατά μέλη: 2(x1 + y1) + 2(x2 + y2) + 2(x3 + y3) = 36 + 56 + 50 = 142 εκ., που ισούται ακριβώς με την περίμετρο του αρχικού ορθογωνίου.'
  },
      {
    id: 19,
    officialNumber: 39,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    promptText: 'Ο Χρήστος ξεκινάει από το σπίτι του μια συγκεκριμένη ώρα κάθε ημέρα και πηγαίνει στην παραλία μέσω μιας ευθείας διαδρομής. Όταν πηγαίνει με το ποδήλατο και με σταθερή ταχύτητα 25 χιλιόμετρα την ώρα, φτάνει στις 3:00 μ.μ. Όταν πηγαίνει με τα πόδια και με σταθερή ταχύτητα 5 χιλιόμετρα την ώρα, φτάνει στις 3:40 μ.μ. Τι ώρα ξεκινάει από το σπίτι του;',
    options: [
      { key: 'A', label: '2:30 μ.μ.', raw: '2:30' },
      { key: 'B', label: '2:52 μ.μ.', raw: '2:52' },
      { key: 'Γ', label: '2:50 μ.μ.', raw: '2:50' },
      { key: 'Δ', label: '11:40 π.μ.', raw: '11:40' },
      { key: 'E', label: '12:40 μ.μ.', raw: '12:40' }
    ],
    correctRaw: '2:50',
    explain: 'Η χρονική διαφορά μεταξύ των δύο μετακινήσεων είναι 40 λεπτά, δηλαδή 40/60 = 2/3 της ώρας. Αν d είναι η απόσταση σε χιλιόμετρα: d/5 − d/25 = 2/3 ➔ (5d − d)/25 = 2/3 ➔ 4d/25 = 2/3 ➔ 12d = 50 ➔ d = 50/12 = 25/6 χλμ. Ο χρόνος που χρειάζεται με το ποδήλατο είναι d / 25 = (25/6) / 25 = 1/6 της ώρας, δηλαδή 10 λεπτά. Εφόσον φτάνει στις 3:00 μ.μ., ξεκίνησε 10 λεπτά νωρίτερα: 2:50 μ.μ.'
  },
  {
    id: 20,
    officialNumber: 40,
    group: 'ΟΜΑΔΑ Β (5 επιλογες)',
    promptText: 'Σε μια πολυκατοικία όλοι οι όροφοι έχουν το ίδιο ύψος και ακριβώς την ίδια όψη, όπως στο σχήμα που ακολουθεί. Με βάση τα δεδομένα του σχήματος ποιο είναι το ύψος του κάθε ορόφου;',
    hasSvg: 'building40',
    options: [
      { key: 'A', label: '290 εκ.', raw: '290' },
      { key: 'B', label: '215 εκ.', raw: '215' },
      { key: 'Γ', label: '300 εκ.', raw: '300' },
      { key: 'Δ', label: '280 εκ.', raw: '280' },
      { key: 'E', label: '430 εκ.', raw: '430' }
    ],
    correctRaw: '290',
    explain: 'Έστω H το ύψος κάθε ορόφου, h το ύψος κάθε παραθύρου, d_top η απόσταση από το πάνω μέρος του ορόφου έως το παράθυρο και d_bot η απόσταση από το κάτω μέρος του παραθύρου έως το πάτωμα του ορόφου. Επομένως, το ύψος του ορόφου είναι H = h + d_top + d_bot. Η απόσταση ανάμεσα στα παράθυρα δύο διαδοχικών ορόφων είναι d_bot + d_top = 150 εκ. Η διάσταση 430 εκ. εκτείνεται από το πάνω μέρος του παραθύρου του 3ου ορόφου έως το κάτω μέρος του παραθύρου του 2ου ορόφου, δηλαδή: h + (d_bot + d_top) + h = 430 ➔ 2h + 150 = 430 ➔ 2h = 280 ➔ h = 140 εκ. Άρα το ύψος κάθε ορόφου είναι H = h + 150 = 140 + 150 = 290 εκ.'
  }
    ];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function Themata2025Page() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME_SECONDS);
  const [timerEnabled, setTimerEnabled] = useState(true);

  const timerRef = useRef(null);

  useEffect(() => {
    if (router.isReady) {
      const { timer } = router.query;
      setTimerEnabled(timer !== '0');
    }
  }, [router.isReady, router.query]);

  useEffect(() => {
    if (!timerEnabled || submitted) return;

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [timerEnabled, submitted]);

  const handleSelect = (qId, optionRaw) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionRaw }));
  };

  const calculateScore = (currentAnswers) => {
    let s = 0;
    QUESTIONS_2025.forEach(q => {
      if (currentAnswers[q.id] === q.correctRaw) {
        s += 2.5;
      }
    });
    return s;
  };

  const handleAutoSubmit = () => {
    setAnswers(prev => {
      const finalScore = calculateScore(prev);
      setScore(finalScore);
      setSubmitted(true);
      return prev;
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (submitted) return;
    if (timerRef.current) clearInterval(timerRef.current);

    const finalScore = calculateScore(answers);
    setScore(finalScore);
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const answeredCount = Object.keys(answers).length;

  const renderQuestionVisual = (q) => {
    if (q.hasTable === 'table23') {
      return (
        <div className="overflow-x-auto my-3">
          <table className="w-full text-xs sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                <th className="p-2.5 border-b border-slate-200">Κατάστημα</th>
                <th className="p-2.5 border-b border-slate-200">Αρχική τιμή Μπλούζας</th>
                <th className="p-2.5 border-b border-slate-200">Έκπτωση ως ποσοστό της αρχικής τιμής</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">Της Αλίνας</td>
                <td className="p-2">50 ευρώ</td>
                <td className="p-2 font-mono">20%</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">Του Βασίλη</td>
                <td className="p-2">45 ευρώ</td>
                <td className="p-2 font-mono">15%</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">Της Γιάννας</td>
                <td className="p-2">45 ευρώ</td>
                <td className="p-2 font-mono">10%</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Του Δημοσθένη</td>
                <td className="p-2">40 ευρώ</td>
                <td className="p-2 font-mono">10%</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (q.hasTable === 'table25') {
      return (
        <div className="overflow-x-auto my-3">
          <table className="w-full text-xs sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                <th className="p-2.5 border-b border-slate-200">Άθλημα</th>
                <th className="p-2.5 border-b border-slate-200">Αγόρια</th>
                <th className="p-2.5 border-b border-slate-200">Κορίτσια</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">Βόλεϊ</td>
                <td className="p-2 font-mono">5,5%</td>
                <td className="p-2 font-mono">29,5%</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">Ποδόσφαιρο</td>
                <td className="p-2 font-mono">29,5%</td>
                <td className="p-2 font-mono">6,5%</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">Μπάσκετ</td>
                <td className="p-2 font-mono">17%</td>
                <td className="p-2 font-mono font-bold text-indigo-600">;</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (q.hasSvg === 'foodChart30') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto my-3">
          <svg width="370" height="195" viewBox="0 0 370 195" className="select-none">
            {/* Οριζόντιες γραμμές 0, 5, 10, 15, 20, 25, 30 */}
            {[0, 5, 10, 15, 20, 25, 30].map((val) => {
              const y = 140 - (val / 30) * 120;
              return (
                <g key={val}>
                  <line x1="30" y1={y} x2="360" y2={y} stroke="#cbd5e1" strokeWidth="1" />
                  <text x="24" y={y + 3.5} fontSize="9" fontWeight="bold" textAnchor="end" fill="#64748b">{val}</text>
                </g>
              );
            })}

            {/* Στήλες ραβδογράμματος */}
            {[
              { lines: ['Αυγό', 'κότας'], val: 15, isAnimal: true },
              { lines: ['Γάλα', 'αγελάδας'], val: 15, isAnimal: true },
              { lines: ['Ελιές'], val: 5, isAnimal: false },
              { lines: ['Ντομάτα'], val: 5, isAnimal: false },
              { lines: ['Κρέας'], val: 5, isAnimal: true },
              { lines: ['Ρεβύθια'], val: 10, isAnimal: false },
              { lines: ['Κατσικίσιο', 'τυρί'], val: 25, isAnimal: true },
              { lines: ['Φυστίκια'], val: 20, isAnimal: false }
            ].map((col, idx) => {
              const x = 40 + idx * 39;
              const h = (col.val / 30) * 120;
              const y = 140 - h;
              const cx = x + 11;

              return (
                <g key={idx}>
                  <rect x={x} y={y} width="22" height={h} fill={col.isAnimal ? '#0284c7' : '#0369a1'} rx="2" />
                  
                  {col.lines.length === 1 ? (
                    <text x={cx} y="156" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#334155">
                      {col.lines[0]}
                    </text>
                  ) : (
                    <text x={cx} y="153" fontSize="7.5" fontWeight="bold" textAnchor="middle" fill="#334155">
                      <tspan x={cx} dy="0">{col.lines[0]}</tspan>
                      <tspan x={cx} dy="10">{col.lines[1]}</tspan>
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'cube34') {
      // 3D Ισομετρικός Κύβος 3x3x3
      // Κεντρική εμπρόσθια-άνω κορυφή (κοινή για τις 3 ορατές έδρες)
      const cx = 105;
      const cy = 76;
      
      // Διανύσματα ισομετρικής προβολής (30 μοίρες)
      const ux = 22;  // Δεξιά-Πάνω (Top & Right)
      const uy = 12.7;
      const vx = -22; // Αριστερά-Πάνω (Top & Left)
      const vy = 12.7;
      const h = 25.4; // Κατακόρυφη διάσταση

      const topTiles = [];
      const leftTiles = [];
      const rightTiles = [];

      // 1. ΠΑΝΩ ΕΔΡΑ (Top Face)
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          // Η εμπρός κορυφή (i=0, j=0) είναι γκρι
          const isDark = (i + j) % 2 === 0;
          const p0 = [cx + i * ux + j * vx, cy - i * uy - j * vy];
          const p1 = [cx + (i + 1) * ux + j * vx, cy - (i + 1) * uy - j * vy];
          const p2 = [cx + (i + 1) * ux + (j + 1) * vx, cy - (i + 1) * uy - (j + 1) * vy];
          const p3 = [cx + i * ux + (j + 1) * vx, cy - i * uy - (j + 1) * vy];

          topTiles.push({
            pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`,
            fill: isDark ? '#64748b' : '#ffffff'
          });
        }
      }

      // 2. ΑΡΙΣΤΕΡΗ ΕΔΡΑ (Left Face)
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          const isDark = (j + k) % 2 === 0;
          const p0 = [cx + j * vx, cy - j * vy + k * h];
          const p1 = [cx + (j + 1) * vx, cy - (j + 1) * vy + k * h];
          const p2 = [cx + (j + 1) * vx, cy - (j + 1) * vy + (k + 1) * h];
          const p3 = [cx + j * vx, cy - j * vy + (k + 1) * h];

          leftTiles.push({
            pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`,
            fill: isDark ? '#64748b' : '#ffffff'
          });
        }
      }

      // 3. ΔΕΞΙΑ ΕΔΡΑ (Right Face)
      for (let i = 0; i < 3; i++) {
        for (let k = 0; k < 3; k++) {
          const isDark = (i + k) % 2 === 0;
          const p0 = [cx + i * ux, cy - i * uy + k * h];
          const p1 = [cx + (i + 1) * ux, cy - (i + 1) * uy + k * h];
          const p2 = [cx + (i + 1) * ux, cy - (i + 1) * uy + (k + 1) * h];
          const p3 = [cx + i * ux, cy - i * uy + (k + 1) * h];

          rightTiles.push({
            pts: `${p0[0]},${p0[1]} ${p1[0]},${p1[1]} ${p2[0]},${p2[1]} ${p3[0]},${p3[1]}`,
            fill: isDark ? '#64748b' : '#ffffff'
          });
        }
      }

      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg width="210" height="190" viewBox="0 0 210 190" className="select-none">
            {/* Πάνω έδρα */}
            {topTiles.map((t, idx) => (
              <polygon key={`top-${idx}`} points={t.pts} fill={t.fill} stroke="#0f172a" strokeWidth="1.8" strokeLinejoin="round" />
            ))}
            {/* Αριστερή έδρα */}
            {leftTiles.map((t, idx) => (
              <polygon key={`left-${idx}`} points={t.pts} fill={t.fill} stroke="#0f172a" strokeWidth="1.8" strokeLinejoin="round" />
            ))}
            {/* Δεξιά έδρα */}
            {rightTiles.map((t, idx) => (
              <polygon key={`right-${idx}`} points={t.pts} fill={t.fill} stroke="#0f172a" strokeWidth="1.8" strokeLinejoin="round" />
            ))}
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'squares36') {
      // Μεγάλο εξωτερικό τετράγωνο πλευράς 120 (από 20 έως 140)
      // Κάθε πλευρά χωρίζεται από τις κορυφές των τετραγώνων:
      // x0 = 20, x1 = 50, x2 = 110, x3 = 140 (και αντίστοιχα για y)
      // Κεντρικό σημείο: (80, 80)
      // Κορυφές κεντρικού σκιασμένου τετραγώνου: (80, 50), (110, 80), (80, 110), (50, 80)
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg width="180" height="180" viewBox="0 0 160 160" className="select-none">
            {/* 1. Μεγάλο εξωτερικό τετράγωνο */}
            <rect x="20" y="20" width="120" height="120" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />

            {/* 2. Κεντρικό σκιασμένο τετράγωνο */}
            <polygon
              points="80,50 110,80 80,110 50,80"
              fill="#64748b"
              stroke="#1e293b"
              strokeWidth="2"
            />

            {/* 3. Τέσσερα λευκά περιφερειακά τετράγωνα */}
            {/* Πάνω-Αριστερά */}
            <polygon points="50,20 80,50 50,80 20,50" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            {/* Πάνω-Δεξιά */}
            <polygon points="110,20 140,50 110,80 80,50" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            {/* Κάτω-Αριστερά */}
            <polygon points="20,110 50,80 80,110 50,140" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />
            {/* Κάτω-Δεξιά */}
            <polygon points="80,110 110,80 140,110 110,140" fill="#ffffff" stroke="#1e293b" strokeWidth="2" />

            {/* Μικρές κουκκίδες στις 4 γωνίες του εξωτερικού τετραγώνου όπως στο πρωτότυπο */}
            <circle cx="20" cy="20" r="2.5" fill="#1e293b" />
            <circle cx="140" cy="20" r="2.5" fill="#1e293b" />
            <circle cx="20" cy="140" r="2.5" fill="#1e293b" />
            <circle cx="140" cy="140" r="2.5" fill="#1e293b" />
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'grid38') {
      // Συνολικό πλάτος: 180 (x από 25 έως 205), Συνολικό ύψος: 120 (y από 20 έως 140)
      // Πλάτη στηλών: 1η = 60, 2η (μεσαία) = 50, 3η = 70 -> χωρίσματα στο x = 85 και x = 135
      // Ύψη γραμμών: 1η = 32, 2η (μεσαία) = 52, 3η = 36 -> χωρίσματα στο y = 52 και y = 104
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3">
          <svg width="230" height="160" viewBox="0 0 230 160" className="select-none">
            {/* Εξωτερικό περίγραμμα */}
            <rect x="25" y="20" width="180" height="120" fill="#ffffff" stroke="#000000" strokeWidth="2.2" />

            {/* Κάθετες γραμμές (ασύμμετρες στήλες) */}
            <line x1="85" y1="20" x2="85" y2="140" stroke="#000000" strokeWidth="1.8" />
            <line x1="135" y1="20" x2="135" y2="140" stroke="#000000" strokeWidth="1.8" />

            {/* Οριζόντιες γραμμές (ασύμμετρες γραμμές) */}
            <line x1="25" y1="52" x2="205" y2="52" stroke="#000000" strokeWidth="1.8" />
            <line x1="25" y1="104" x2="205" y2="104" stroke="#000000" strokeWidth="1.8" />

            {/* Γράμματα Α, Β, Γ κεντραρισμένα στα αντίστοιχα κελιά */}
            {/* Κελί Α: x [25, 85], y [20, 52] -> κέντρο (55, 41) */}
            <text x="55" y="41" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#000000" fontFamily="sans-serif">Α</text>
            
            {/* Κελί Β: x [85, 135], y [52, 104] -> κέντρο (110, 84) */}
            <text x="110" y="84" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#000000" fontFamily="sans-serif">Β</text>
            
            {/* Κελί Γ: x [135, 205], y [104, 140] -> κέντρο (170, 127) */}
            <text x="170" y="127" fontSize="18" fontWeight="bold" textAnchor="middle" fill="#000000" fontFamily="sans-serif">Γ</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'building40') {
      // Διάταξη από αριστερά προς τα δεξιά:
      // 1. Ένδειξη 430 εκ.: Κείμενο (x=46) -> Βέλος (x=60)
      // 2. Ένδειξη 150 εκ.: Κείμενο (x=114) -> Βέλος (x=128)
      // 3. Κτίριο (x=190 έως 330) με παράθυρα (x=230)
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200 my-3 overflow-x-auto">
          <svg width="350" height="250" viewBox="0 0 350 250" className="select-none">
            <defs>
              <marker id="arrow" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                <path d="M 0 1.5 L 10 5 L 0 8.5 z" fill="#0f172a" />
              </marker>
            </defs>

            {/* Πρόσοψη 3 ορόφων */}
            <rect x="190" y="20" width="140" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
            <rect x="190" y="90" width="140" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />
            <rect x="190" y="160" width="140" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="2.2" />

            {/* Παράθυρα */}
            <rect x="230" y="32" width="26" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="230" y="102" width="26" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />
            <rect x="230" y="172" width="26" height="34" fill="#ffffff" stroke="#0f172a" strokeWidth="1.8" />

            {/* Οριζόντιες διακεκομμένες γραμμές */}
            <line x1="60" y1="32" x2="230" y2="32" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="128" y1="66" x2="230" y2="66" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="128" y1="102" x2="230" y2="102" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />
            <line x1="60" y1="136" x2="230" y2="136" stroke="#475569" strokeWidth="1.2" strokeDasharray="3 3" />

            {/* Εξωτερική διάσταση (430 εκ.) - τέρμα αριστερά */}
            <text x="46" y="88" fontSize="11" fontWeight="bold" textAnchor="end" fill="#0f172a">430 εκ.</text>
            <line x1="60" y1="38" x2="60" y2="130" stroke="#0f172a" strokeWidth="1.6" markerStart="url(#arrow)" markerEnd="url(#arrow)" />

            {/* Εσωτερική διάσταση (150 εκ.) - δεξιότερα, ανάμεσα στο 430 και το κτίριο */}
            <text x="114" y="88" fontSize="10" fontWeight="bold" textAnchor="end" fill="#0f172a">150 εκ.</text>
            <line x1="128" y1="72" x2="128" y2="96" stroke="#0f172a" strokeWidth="1.6" markerStart="url(#arrow)" markerEnd="url(#arrow)" />

            {/* Δείκτης για το παράθυρο */}
            <text x="114" y="193" fontSize="11" fontWeight="bold" textAnchor="end" fill="#0f172a">ΠΑΡΑΘΥΡΟ</text>
            <line x1="120" y1="189" x2="224" y2="197" stroke="#0f172a" strokeWidth="1.5" markerEnd="url(#arrow)" />
          </svg>
        </div>
      );
    }
    return null;
  };

  return (
    <Layout
      title="🏛️ Πραγματικά Θέματα 2025 - Πρότυπα Σχολεία | LearnMaths.gr"
      description="Επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία 2025: 20 θέματα, 2,5 μόρια ανά θέμα (0-50 μόρια), χρονόμετρο και αναλυτικές λύσεις."
      backUrl="/protipa/pragmatika-themata"
      backText="Πραγματικά Θέματα"
      hideFooter={true}
    >
      <div className="py-6 sm:py-8 space-y-6 pb-28 sm:pb-32">

        {/* HERO BANNER & TIMER HEADER */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-cyan-700 rounded-3xl p-5 sm:p-7 text-white shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1.5">
              <span className="inline-block bg-white/20 px-3 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider text-blue-100">
                Επισημα Θεματα 2025 • 20 Ερωτησεις
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Εξετάσεις Προτύπων 2025
              </h1>
            </div>

            {timerEnabled && (
              <div className={`px-4 py-2 rounded-2xl font-mono font-black text-base sm:text-lg flex items-center gap-2 shadow-inner self-stretch sm:self-auto justify-center ${
                timeLeft < 300 ? 'bg-rose-500 text-white animate-pulse' : 'bg-white text-blue-950'
              }`}>
                <span>⏱️</span>
                <span>{formatTime(timeLeft)}</span>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-blue-100 border-t border-white/20 pt-3">
            <span>📝 Απαντημένες: <strong>{answeredCount} / 20</strong></span>
            <span>🎯 Βαθμολογία: <strong>2,5 μόρια / θέμα (Άριστα: 50)</strong></span>
            <span>{timerEnabled ? '⏳ Χρονόμετρο: 60 λεπτά' : '⏳ Χρονόμετρο: Ανενεργό'}</span>
          </div>
        </div>

        {/* FEEDBACK BANNER ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
        {submitted && (
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 shadow-md text-center space-y-3">
            <span className="text-4xl block">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Αποτέλεσμα Εξέτασης 2025
            </h2>
            <div className="inline-block bg-blue-50 border border-blue-200 px-6 py-2.5 rounded-2xl">
              <span className="text-xs font-bold text-blue-800 uppercase block">Τελικό Σκορ</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-blue-700">
                {score} / 50
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                ({score / 2.5} σωστές στις 20 ερωτήσεις)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Δες παρακάτω αναλυτικά τις απαντήσεις σου με πλήρη μαθηματική τεκμηρίωση για κάθε θέμα.
            </p>
          </div>
        )}

        {/* LIST OF 20 QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS_2025.map((q) => {
            const userChoice = answers[q.id];
            const isCorrect = userChoice === q.correctRaw;

            let cardBorder = 'border-slate-200';
            if (submitted) {
              cardBorder = isCorrect ? 'border-emerald-400 bg-emerald-50/30' : 'border-rose-400 bg-rose-50/30';
            }

            return (
              <div
                key={q.id}
                className={`bg-white rounded-3xl p-5 sm:p-6 border-2 shadow-sm transition-all space-y-4 ${cardBorder}`}
              >
                {/* ΚΕΦΑΛΙΔΑ ΕΡΩΤΗΣΗΣ */}
                <div className="flex justify-between items-center gap-2 border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="bg-blue-100 text-blue-900 font-mono font-black text-xs px-3 py-1 rounded-xl">
                      Θέμα {q.officialNumber}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {q.group}
                    </span>
                  </div>

                  {submitted && (
                    <span className="text-sm sm:text-base font-black">
                      {isCorrect ? '✅ +2,5 μόρια' : '❌ 0 μόρια'}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ */}
                <p className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed whitespace-pre-line">
                  {q.promptText}
                </p>

                {/* ΣΧΗΜΑΤΑ / ΠΙΝΑΚΕΣ */}
                {renderQuestionVisual(q)}

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className={`grid gap-2 pt-1 ${q.options.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === opt.raw;
                    let btnStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50';

                    if (submitted) {
                      if (opt.raw === q.correctRaw) {
                        btnStyle = 'bg-emerald-600 text-white border-emerald-600 shadow-sm font-black';
                      } else if (isSelected && !isCorrect) {
                        btnStyle = 'bg-rose-600 text-white border-rose-600 font-black';
                      } else {
                        btnStyle = 'bg-slate-100 text-slate-400 border-slate-200 opacity-60';
                      }
                    } else if (isSelected) {
                      btnStyle = 'bg-blue-600 text-white border-blue-600 shadow-sm font-black';
                    }

                    return (
                      <button
                        key={optIdx}
                        type="button"
                        disabled={submitted}
                        onClick={() => handleSelect(q.id, opt.raw)}
                        className={`p-3 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center gap-2.5 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                          isSelected || (submitted && opt.raw === q.correctRaw)
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          {opt.key}
                        </span>
                        <div className="font-bold leading-normal flex items-center">{opt.label}</div>
                      </button>
                    );
                  })}
                </div>

                {/* ΕΠΕΞΗΓΗΣΗ ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
                {submitted && (
                  <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed border ${
                    isCorrect 
                      ? 'bg-emerald-100/60 text-emerald-950 border-emerald-200' 
                      : 'bg-rose-100/60 text-rose-950 border-rose-200'
                  }`}>
                    <div className="font-black mb-1 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>Μαθηματική Επεξήγηση:</span>
                    </div>
                    <p className="font-medium whitespace-pre-line">{q.explain}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* ΚΟΥΜΠΙ ΥΠΟΒΟΛΗΣ */}
          {!submitted && (
            <div className="flex justify-center pt-4">
              <button
                type="submit"
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5"
              >
                <span>🎯</span>
                <span>Οριστική Υποβολή ({answeredCount}/20)</span>
              </button>
            </div>
          )}
        </form>

      </div>

      {/* FIXED BOTTOM SCORE & TIMER BAR */}
      <div className="fixed bottom-0 left-0 w-full bg-slate-900 text-white border-t border-slate-800 shadow-2xl py-3 px-4 sm:px-6 z-50">
        <div className={`${LAYOUT.CONTAINER} flex flex-col sm:flex-row justify-between items-center gap-3`}>
          
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="bg-amber-400 text-slate-950 font-black px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-mono shadow-xs">
              {submitted ? `Σκορ: ${score} / 50` : `Απαντήσεις: ${answeredCount} / 20`}
            </div>
            {submitted ? (
              <span className="text-xs font-bold text-slate-300">
                Ποσοστό: <strong className="text-emerald-400">{Math.round((score / 50) * 100)}%</strong>
              </span>
            ) : (
              <span className="text-xs text-slate-300">
                Υπολείπονται: <strong>{20 - answeredCount}</strong>
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {timerEnabled && !submitted && (
              <span className={`text-xs font-mono font-black px-3 py-1 rounded-lg ${
                timeLeft < 300 ? 'bg-rose-600 text-white animate-pulse' : 'bg-slate-800 text-slate-200'
              }`}>
                ⏱️ {formatTime(timeLeft)}
              </span>
            )}

            {submitted ? (
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setSubmitted(false);
                  setScore(0);
                  setTimeLeft(TOTAL_TIME_SECONDS);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs"
              >
                🔄 Επανάληψη Εξέτασης
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-xs"
              >
                Έλεγχος & Βαθμολόγηση ➔
              </button>
            )}
          </div>

        </div>
      </div>
    </Layout>
  );
}
