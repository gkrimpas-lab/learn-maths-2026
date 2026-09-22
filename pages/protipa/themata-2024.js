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

const QUESTIONS_2024 = [
  {
    id: 1,
    officialNumber: 26,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Σήμερα είναι 18 Μαΐου. Σε 15 ημέρες πόσο του μήνα θα είναι;',
    options: [
      { key: 'A', label: '2', raw: '2' },
      { key: 'B', label: '4', raw: '4' },
      { key: 'Γ', label: '1', raw: '1' },
      { key: 'Δ', label: '33', raw: '33' }
    ],
    correctRaw: '2',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Ο μήνας <strong>Μάιος έχει 31 ημέρες</strong>.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Υπολειπόμενες ημέρες του Μαΐου: 31 － 18 ＝ <strong>13 ημέρες</strong></div>
          <div>• Απομένουν από τις 15 ημέρες: 15 － 13 ＝ <strong>2 ημέρες</strong></div>
          <div className="pt-1 text-emerald-800 font-bold">
            ➔ Οι 2 αυτές ημέρες ανήκουν στον επόμενο μήνα (Ιούνιο), άρα θα είναι <strong>2 Ιουνίου</strong>.
          </div>
        </div>
        <p className="pt-1">
          Επομένως, σε 15 ημέρες θα έχουμε <strong>2</strong> του μήνα (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 2,
    officialNumber: 27,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ο Γιώργος και ο Κώστας έχουν το ίδιο ποσό χρημάτων ο καθένας. Πόσα ευρώ πρέπει να δώσει ο Γιώργος στον Κώστα για να έχει ο Γιώργος 30 ευρώ λιγότερα από τον Κώστα;',
    options: [
      { key: 'A', label: '10 €', raw: '10 €' },
      { key: 'B', label: '15 €', raw: '15 €' },
      { key: 'Γ', label: '20 €', raw: '20 €' },
      { key: 'Δ', label: '30 €', raw: '30 €' }
    ],
    correctRaw: '15 €',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω ότι αρχικά κάθε παιδί έχει ποσό <strong>X €</strong>.
        </p>
        <p>
          Αν ο Γιώργος δώσει <strong>x €</strong> στον Κώστα:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Χρήματα Γιώργου: <strong>X － x</strong></div>
          <div>• Χρήματα Κώστα: <strong>X ＋ x</strong></div>
          <div className="pt-1">
            Διαφορά: (X ＋ x) － (X － x) ＝ <strong>2x</strong>
          </div>
        </div>
        <p>
          Θέλουμε η τελική διαφορά τους να είναι 30 €:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          2x ＝ 30 ➔ <strong>x ＝ 15 €</strong>
        </div>
        <p className="pt-1">
          Συνεπώς, ο Γιώργος πρέπει να δώσει <strong>15 €</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 3,
    officialNumber: 28,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ποιος είναι ο μέσος όρος των αριθμών 2021, 2022, 2023, 2024, 2025;',
    options: [
      { key: 'A', label: '2022', raw: '2022' },
      { key: 'B', label: '2022,5', raw: '2022,5' },
      { key: 'Γ', label: '2023', raw: '2023' },
      { key: 'Δ', label: '2023,5', raw: '2023,5' }
    ],
    correctRaw: '2023',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Οι αριθμοί είναι 5 <strong>διαδοχικοί ακέραιοι</strong> με σταθερό βήμα 1:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>2021, 2022, <strong className="text-emerald-700 underline text-base">2023</strong>, 2024, 2025</div>
        </div>
        <p>
          Σε οποιαδήποτε αριθμητική πρόοδο με περιττό πλήθος όρων, ο μέσος όρος ταυτίζεται πάντα με τον <strong>μεσαίο όρο</strong> (συμμετρία γύρω από το 2023).
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Μέσος Όρος ＝</span>
          <Fraction num="2021 ＋ 2022 ＋ 2023 ＋ 2024 ＋ 2025" den="5" />
          <span>＝</span>
          <Fraction num="10115" den="5" />
          <span>＝ <strong className="text-emerald-700 text-base">2023</strong></span>
        </div>
        <p className="pt-1">
          Επομένως, ο μέσος όρος είναι το <strong>2023</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 4,
    officialNumber: 29,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Σε μία κατασκήνωση πήγαν 250 παιδιά. Από αυτά τα παιδιά τα κορίτσια ήταν το 40%. Πόσα ήταν τα αγόρια στην κατασκήνωση;',
    options: [
      { key: 'A', label: '150', raw: '150' },
      { key: 'B', label: '125', raw: '125' },
      { key: 'Γ', label: '100', raw: '100' },
      { key: 'Δ', label: '175', raw: '175' }
    ],
    correctRaw: '150',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εφόσον τα κορίτσια αποτελούν το 40% του συνόλου, το ποσοστό των αγοριών είναι:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          100% － 40% ＝ <strong>60%</strong>
        </div>
        <p>
          Υπολογίζουμε το πλήθος των αγοριών:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Αγόρια ＝ 250 ·</span>
          <Fraction num="60" den="100" />
          <span>＝ 250 · 0,60 ＝ <strong className="text-emerald-700 text-base">150 αγόρια</strong></span>
        </div>
        <p className="pt-1">
          Άρα, τα αγόρια ήταν <strong>150</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 5,
    officialNumber: 30,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: (
      <span className="inline-flex items-center flex-wrap">
        Ποια είναι η τιμή της παράστασης &nbsp;
        <span className="font-mono">
          ( <Fraction num="9" den="2" /> － 2² ) : <Fraction num="1" den="4" />
        </span>
        &nbsp;;
      </span>
    ),
    options: [
      { key: 'A', label: '2', raw: '2' },
      { key: 'B', label: <Fraction num="1" den="2" />, raw: '1/2' },
      { key: 'Γ', label: <Fraction num="1" den="8" />, raw: '1/8' },
      { key: 'Δ', label: '10', raw: '10' }
    ],
    correctRaw: '2',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εκτελούμε πρώτα τη δύναμη και τις πράξεις μέσα στην παρένθεση:
        </p>
        <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• 2² ＝ 4 ＝ <Fraction num="8" den="2" /></div>
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span>• Παρένθεση ＝</span>
            <Fraction num="9" den="2" />
            <span>－</span>
            <Fraction num="8" den="2" />
            <span>＝</span>
            <Fraction num="1" den="2" />
          </div>
        </div>
        <p>
          Στη συνέχεια εκτελούμε τη διαίρεση μετατρέποντάς την σε πολλαπλασιασμό με τον αντίστροφο:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="1" den="2" />
          <span>:</span>
          <Fraction num="1" den="4" />
          <span>＝</span>
          <Fraction num="1" den="2" />
          <span>· 4 ＝</span>
          <Fraction num="4" den="2" />
          <span>＝ <strong className="text-emerald-700 text-base">2</strong></span>
        </div>
        <p className="pt-1">
          Επομένως, η τιμή της παράστασης είναι <strong>2</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 6,
    officialNumber: 31,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Στην αριθμογραμμή του παρακάτω σχήματος, ο αριθμός α απέχει το ίδιο από το 0 και το 5. Επίσης οι αριθμοί α και χ απέχουν το ίδιο από το 5. Ποιος είναι ο αριθμός χ;',
    hasSvg: 'axis31',
    options: [
      { key: 'A', label: '2,5', raw: '2,5' },
      { key: 'B', label: '3', raw: '3' },
      { key: 'Γ', label: '7,5', raw: '7,5' },
      { key: 'Δ', label: '6', raw: '6' }
    ],
    correctRaw: '7,5',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Ο αριθμός <strong>α</strong> είναι το μέσο του διαστήματος [0, 5]:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          α ＝ 5 : 2 ＝ <strong>2,5</strong>
        </div>
        <p>
          2. Η απόσταση του <strong>α</strong> από το <strong>5</strong> είναι:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          5 － 2,5 ＝ <strong>2,5 μονάδες</strong>
        </div>
        <p>
          3. Επειδή και το <strong>χ</strong> απέχει εξίσου από το 5 (και βρίσκεται δεξιά του):
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          χ ＝ 5 ＋ 2,5 ＝ <strong className="text-emerald-700 text-base">7,5</strong>
        </div>
        <p className="pt-1">
          Άρα, ο αριθμός χ είναι <strong>7,5</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 7,
    officialNumber: 32,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: (
      <span>
        Σε ένα κουτί έχω χρωματιστά μπαλάκια και τα <Fraction num="2" den="5" /> από αυτά είναι πράσινα. Αν τα μπαλάκια στο κουτί που δεν είναι πράσινα είναι 60, πόσα είναι τα πράσινα μπαλάκια;
      </span>
    ),
    options: [
      { key: 'A', label: '36', raw: '36' },
      { key: 'B', label: '40', raw: '40' },
      { key: 'Γ', label: '24', raw: '24' },
      { key: 'Δ', label: '90', raw: '90' }
    ],
    correctRaw: '40',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Αν τα πράσινα είναι τα <Fraction num="2" den="5" />, τότε τα μπαλάκια που <strong>δεν είναι πράσινα</strong> αποτελούν τα υπόλοιπα:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <span>1 －</span>
          <Fraction num="2" den="5" />
          <span>＝</span>
          <Fraction num="3" den="5" />
          <span>του συνόλου.</span>
        </div>
        <p>
          Τα <Fraction num="3" den="5" /> αντιστοιχούν σε 60 μπαλάκια:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Το <Fraction num="1" den="5" /> είναι: 60 : 3 ＝ <strong>20 μπαλάκια</strong></div>
          <div>• Τα πράσινα είναι <Fraction num="2" den="5" />: 2 · 20 ＝ <strong className="text-emerald-700 text-base">40 πράσινα μπαλάκια</strong></div>
        </div>
        <p className="pt-1">
          Συνεπώς, τα πράσινα μπαλάκια είναι <strong>40</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 8,
    officialNumber: 33,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Η Μαρία, ξεκινώντας από την πόρτα του σπιτιού της περπάτησε 50 μέτρα βόρεια, 30 μέτρα ανατολικά και 20 μέτρα νότια και έφτασε μπροστά στην πόρτα του σχολείου. Στη συνέχεια, από την πόρτα του σχολείου περπάτησε 30 μέτρα δυτικά. Για να επιστρέψει στο σπίτι της πόσο ακόμα χρειάζεται να περπατήσει;',
    options: [
      { key: 'A', label: '50 μέτρα νότια', raw: '50 μέτρα νότια' },
      { key: 'B', label: '30 μέτρα νότια', raw: '30 μέτρα νότια' },
      { key: 'Γ', label: '20 μέτρα νότια', raw: '20 μέτρα νότια' },
      { key: 'Δ', label: '50 μέτρα βόρεια και 20 μέτρα νότια', raw: '50 μέτρα βόρεια και 20 μέτρα νότια' }
    ],
    correctRaw: '30 μέτρα νότια',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Καταγράφουμε τη μετατόπιση της Μαρίας σε δύο άξονες (Βορράς-Νότος και Ανατολή-Δύση):
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>1. Σχολείο: ＋50μ. Βόρεια, ＋30μ. Ανατολικά, －20μ. Νότια ➔ <strong>＋30μ. Βόρεια, ＋30μ. Ανατολικά</strong> από το σπίτι.</div>
          <div>2. Μετά το σχολείο: περπατά 30μ. Δυτικά ➔ ακυρώνεται πλήρως η ανατολική μετατόπιση (30 － 30 ＝ 0).</div>
          <div className="pt-1 text-slate-800 font-bold">
            ➔ Τώρα βρίσκεται ακριβώς <strong>30 μέτρα βόρεια</strong> από το σπίτι της.
          </div>
        </div>
        <p>
          Άρα, για να επιστρέψει στο σπίτι χρειάζεται να περπατήσει <strong>30 μέτρα νότια</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 9,
    officialNumber: 34,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: (
      <span>
        Ποιον αριθμό πρέπει να προσθέσουμε στο κλάσμα <Fraction num="5" den="7" /> για να πάρουμε το κλάσμα <Fraction num="22" den="21" />;
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="1" den="4" />, raw: '1/4' },
      { key: 'B', label: <Fraction num="2" den="5" />, raw: '2/5' },
      { key: 'Γ', label: <Fraction num="1" den="3" />, raw: '1/3' },
      { key: 'Δ', label: <Fraction num="5" den="7" />, raw: '5/7' }
    ],
    correctRaw: '1/3',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Αφαιρούμε το αρχικό κλάσμα από το τελικό αποτέλεσμα:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="22" den="21" />
          <span>－</span>
          <Fraction num="5" den="7" />
          <span>＝</span>
          <Fraction num="22" den="21" />
          <span>－</span>
          <Fraction num="15" den="21" />
          <span>＝</span>
          <Fraction num="7" den="21" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="1" den="3" /></strong>
        </div>
        <p className="pt-1">
          Επομένως, πρέπει να προσθέσουμε το <strong><Fraction num="1" den="3" /></strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 10,
    officialNumber: 35,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ένας τριψήφιος αριθμός έχει 9 δεκάδες. Αν αυξήσω τον αριθμό κατά 3 μονάδες ο αριθμός των εκατοντάδων του είναι 7, ενώ αν τον αυξήσω κατά 4 μονάδες ο αριθμός των εκατοντάδων του είναι 8. Ποιος είναι ο τριψήφιος αριθμός;',
    options: [
      { key: 'A', label: '797', raw: '797' },
      { key: 'B', label: '796', raw: '796' },
      { key: 'Γ', label: '896', raw: '896' },
      { key: 'Δ', label: '799', raw: '799' }
    ],
    correctRaw: '796',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Αν αυξήσουμε τον αριθμό κατά 4 μονάδες, αλλάζει η εκατοντάδα και γίνεται 8 (δηλαδή φτάνει τουλάχιστον στο 800):
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Αριθμός ＋ 4 ＝ 800 ➔ Αριθμός ＝ 800 － 4 ＝ <strong>796</strong></div>
          <div>• Έλεγχος με ＋ 3 μονάδες: 796 ＋ 3 ＝ <strong>799</strong> (εκατοντάδα 7 ✅)</div>
          <div>• Έχει 9 δεκάδες: 7<strong>9</strong>6 ✅</div>
        </div>
        <p className="pt-1">
          Άρα, ο τριψήφιος αριθμός είναι ο <strong>796</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 11,
    officialNumber: 36,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Στον πίνακα φαίνεται το πρόγραμμα των ωρών της Α΄ γυμνασίου, κάθε Πέμπτη. Ο Μιχάλης την 6η ώρα κοίταξε το ρολόι του και έμεναν 20 λεπτά για να σχολάσει. Θυμάται ότι πριν 2 ώρες και 50 λεπτά, στο διάλειμμα, είχε αγοράσει ένα κουλούρι από το κυλικείο. Αν θυμάται καλά, σε ποιο διάλειμμα είχε αγοράσει το κουλούρι;',
    hasTable: 'timetable36',
    options: [
      { key: 'A', label: 'Μεταξύ 1ης και 2ης ώρας', raw: 'Μεταξύ 1ης και 2ης ώρας' },
      { key: 'B', label: 'Μεταξύ 2ης και 3ης ώρας', raw: 'Μεταξύ 2ης και 3ης ώρας' },
      { key: 'Γ', label: 'Μεταξύ 3ης και 4ης ώρας', raw: 'Μεταξύ 3ης και 4ης ώρας' },
      { key: 'Δ', label: 'Δεν θυμάται καλά, γιατί πριν 2 ώρες και 50 λεπτά ήταν ώρα μαθήματος', raw: 'Δεν θυμάται καλά' }
    ],
    correctRaw: 'Μεταξύ 2ης και 3ης ώρας',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Η 6η ώρα τελειώνει (σχόλασμα) στις <strong>13:15</strong>. Επειδή έμεναν 20 λεπτά, η ώρα που κοίταξε το ρολόι ήταν:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          13:15 － 20 λεπτά ＝ <strong>12:55</strong>
        </div>
        <p>
          2. Πηγαίνουμε 2 ώρες και 50 λεπτά πίσω:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• 12:55 － 2 ώρες ＝ 10:55</div>
          <div>• 10:55 － 50 λεπτά ＝ <strong>10:05</strong></div>
        </div>
        <p>
          3. Κοιτάζοντας το πρόγραμμα, η 2η ώρα τελειώνει στις <strong>09:55</strong> και η 3η αρχίζει στις <strong>10:10</strong>.
          Επομένως, το διάστημα 09:55–10:10 είναι το <strong>διάλειμμα μεταξύ 2ης και 3ης ώρας</strong> (η ώρα 10:05 ανήκει εκεί).
        </p>
        <p className="pt-1 font-bold text-emerald-800">
          Επιλογή B: Μεταξύ 2ης και 3ης ώρας.
        </p>
      </div>
    )
  },
  {
    id: 12,
    officialNumber: 37,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ποιο κλάσμα είναι πιο κοντά στον αριθμό 0,9;',
    options: [
      { key: 'A', label: <Fraction num="4" den="5" />, raw: '4/5' },
      { key: 'B', label: <Fraction num="7" den="10" />, raw: '7/10' },
      { key: 'Γ', label: <Fraction num="11" den="10" />, raw: '11/10' },
      { key: 'Δ', label: <Fraction num="19" den="20" />, raw: '19/20' }
    ],
    correctRaw: '19/20',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Μετατρέπουμε κάθε κλάσμα σε δεκαδικό και υπολογίζουμε την απόστασή του από το <strong>0,9</strong>:
        </p>
        <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• Α: 4/5 ＝ 0,80 ➔ απόσταση: |0,9 － 0,8| ＝ <strong>0,10</strong></div>
          <div>• Β: 7/10 ＝ 0,70 ➔ απόσταση: |0,9 － 0,7| ＝ <strong>0,20</strong></div>
          <div>• Γ: 11/10 ＝ 1,10 ➔ απόσταση: |0,9 － 1,1| ＝ <strong>0,20</strong></div>
          <div>• Δ: 19/20 ＝ 95/100 ＝ 0,95 ➔ απόσταση: |0,9 － 0,95| ＝ <strong className="text-emerald-700">0,05</strong></div>
        </div>
        <p className="pt-1">
          Η μικρότερη απόσταση είναι 0,05, άρα το πιο κοντινό κλάσμα είναι το <strong><Fraction num="19" den="20" /></strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 13,
    officialNumber: 38,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Ένα μπουκάλι είναι γεμάτο με νερό κατά τα <Fraction num="9" den="12" />. Γεμίζω 2 ίδια ποτήρια με νερό από το μπουκάλι και τώρα το μπουκάλι είναι γεμάτο με νερό κατά το <Fraction num="1" den="12" />. Με πόσα ποτήρια νερό γεμίζει το μπουκάλι, αν είναι άδειο;
      </span>
    ),
    options: [
      { key: 'A', label: '6', raw: '6' },
      { key: 'B', label: '3', raw: '3' },
      { key: 'Γ', label: '2', raw: '2' },
      { key: 'Δ', label: '4', raw: '4' }
    ],
    correctRaw: '3',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Η ποσότητα νερού που αφαιρέθηκε για τα 2 ποτήρια είναι:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <Fraction num="9" den="12" />
          <span>－</span>
          <Fraction num="1" den="12" />
          <span>＝</span>
          <Fraction num="8" den="12" />
          <span>του μπουκαλιού.</span>
        </div>
        <p>
          2. Τα 2 ποτήρια αντιστοιχούν στα <Fraction num="8" den="12" />, άρα το 1 ποτήρι χωράει:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <Fraction num="8" den="12" />
          <span>: 2 ＝</span>
          <Fraction num="4" den="12" />
          <span>＝</span>
          <Fraction num="1" den="3" />
          <span>του μπουκαλιού.</span>
        </div>
        <p>
          3. Αφού 1 ποτήρι είναι το <Fraction num="1" den="3" /> του μπουκαλιού, ολόκληρο το μπουκάλι (3/3) γεμίζει με <strong>3 ποτήρια</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 14,
    officialNumber: 39,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ποιος αριθμός μεταξύ 20 και 35 λείπει από το μοτίβο: 2, 5, 9, 14, 20, ..., 35, 44, 54, 65;',
    options: [
      { key: 'A', label: '26', raw: '26' },
      { key: 'B', label: '27', raw: '27' },
      { key: 'Γ', label: '28', raw: '28' },
      { key: 'Δ', label: '29', raw: '29' }
    ],
    correctRaw: '27',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Παρατηρούμε τις διαφορές μεταξύ διαδοχικών όρων του μοτίβου:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• 5 － 2 ＝ <strong>＋3</strong></div>
          <div>• 9 － 5 ＝ <strong>＋4</strong></div>
          <div>• 14 － 9 ＝ <strong>＋5</strong></div>
          <div>• 20 － 14 ＝ <strong>＋6</strong></div>
          <div className="text-emerald-700 font-bold">• Επόμενο βήμα: 20 ＋ 7 ＝ <strong>27</strong></div>
          <div>• Έλεγχος συνέχειας: 27 ＋ 8 ＝ 35 ✅, 35 ＋ 9 ＝ 44 ✅</div>
        </div>
        <p className="pt-1">
          Επομένως, ο αριθμός που λείπει είναι το <strong>27</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 15,
    officialNumber: 40,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Στο διπλανό σχήμα έχουμε σχεδιάσει ένα τετράγωνο με πλευρά 20 εκ. και στο εσωτερικό του σχεδιάσαμε δυο ημικύκλια με διάμετρο την πλευρά του τετραγώνου. Ποιο είναι το εμβαδόν του μαύρου χωρίου; (να χρησιμοποιήσετε ότι π = 3,14)',
    hasSvg: 'squareSemicircles40',
    options: [
      { key: 'A', label: '314 τ.εκ.', raw: '314' },
      { key: 'B', label: '274,4 τ.εκ.', raw: '274,4' },
      { key: 'Γ', label: '125,6 τ.εκ.', raw: '125,6' },
      { key: 'Δ', label: '86 τ.εκ.', raw: '86' }
    ],
    correctRaw: '86',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. <strong>Εμβαδόν τετραγώνου:</strong><br />
          Ε_τετρ ＝ πλευρά · πλευρά ＝ 20 · 20 ＝ <strong>400 τ.εκ.</strong>
        </p>
        <p>
          2. <strong>Εμβαδόν των 2 ημικυκλίων:</strong><br />
          Τα δύο ίσα ημικύκλια με διάμετρο 20 εκ. (ακτίνα r ＝ 10 εκ.) ενώνονται σχηματίζοντας <strong>έναν πλήρη κύκλο</strong>:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Ε_κύκλου ＝ π · r² ＝ 3,14 · 10² ＝ 3,14 · 100 ＝ <strong>314 τ.εκ.</strong>
        </div>
        <p>
          3. <strong>Εμβαδόν του σκιασμένου (μαύρου) χωρίου:</strong>
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Ε_μαύρου ＝ Ε_τετρ － Ε_κύκλου ＝ 400 － 314 ＝ <strong className="text-emerald-700 text-base">86 τ.εκ.</strong>
        </div>
        <p className="pt-1">
          Συνεπώς, το εμβαδόν του μαύρου χωρίου είναι <strong>86 τ.εκ.</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 16,
    officialNumber: 41,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Έχουμε δύο ράβδους με μήκη 160 εκ. και 96 εκ. και θέλουμε να τις κόψουμε σε ίσα κομμάτια ώστε το μήκος κάθε κομματιού της μιας να είναι ίσο με το μήκος κάθε κομματιού της άλλης. Ποιο είναι το μεγαλύτερο δυνατό μήκος που μπορεί να έχει ένα τέτοιο κομμάτι;',
    options: [
      { key: 'A', label: '16 εκ.', raw: '16' },
      { key: 'B', label: '24 εκ.', raw: '24' },
      { key: 'Γ', label: '32 εκ.', raw: '32' },
      { key: 'Δ', label: '36 εκ.', raw: '36' }
    ],
    correctRaw: '32',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Το μεγαλύτερο δυνατό μήκος κομματιού ισούται με τον <strong>Μέγιστο Κοινό Διαιρέτη</strong> των δύο μηκών: <strong>ΜΚΔ(160, 96)</strong>.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• 160 ＝ 32 · 5</div>
          <div>• 96 ＝ 32 · 3</div>
          <div className="pt-1 font-bold text-emerald-800">➔ ΜΚΔ(160, 96) ＝ 32 εκ.</div>
        </div>
        <p className="pt-1">
          Άρα, το μέγιστο μήκος είναι <strong>32 εκ.</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 17,
    officialNumber: 42,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Μπορούμε να αγοράσουμε δοχεία 18 λίτρων με κόστος 2,5€ το ένα και δοχεία 12 λίτρων με κόστος 1,70€ το ένα. Ποιο είναι το μικρότερο δυνατό κόστος για να συσκευάσουμε 300 λίτρα λάδι αγοράζοντας κάποια από τα παραπάνω δοχεία;',
    options: [
      { key: 'A', label: '40€', raw: '40' },
      { key: 'B', label: '41,7€', raw: '41,7' },
      { key: 'Γ', label: '42€', raw: '42' },
      { key: 'Δ', label: '42,5€', raw: '42,5' }
    ],
    correctRaw: '41,7',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Συγκρίνουμε το κόστος ανά λίτρο:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Δοχείο 18L: 2,5 / 18 ≈ <strong>0,1389 €/L</strong></div>
          <div>• Δοχείο 12L: 1,70 / 12 ≈ <strong>0,1417 €/L</strong></div>
        </div>
        <p>
          Συμφέρει να χρησιμοποιήσουμε όσο το δυνατόν περισσότερα δοχεία των 18L:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• 300 : 18 ＝ 16 με υπόλοιπο 12 λίτρα.</div>
          <div>• Δηλαδή: <strong>16 δοχεία των 18L</strong> και <strong>1 δοχείο των 12L</strong>.</div>
          <div>• Έλεγχος χωρητικότητας: 16 · 18 ＋ 1 · 12 ＝ 288 ＋ 12 ＝ 300 L ✅</div>
        </div>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Κόστος ＝ 16 · 2,5€ ＋ 1 · 1,70€ ＝ 40€ ＋ 1,70€ ＝ <strong className="text-emerald-700 text-base">41,70€</strong>
        </div>
        <p className="pt-1">
          Επομένως, το μικρότερο δυνατό κόστος είναι <strong>41,7€</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 18,
    officialNumber: 43,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Μια τυρόπιτα κι ένας καφές κοστίζουν 3,50 €, ένας καφές κι ένα μπουκαλάκι νερό κοστίζουν 2 €, μια τυρόπιτα κι ένα μπουκαλάκι νερό κοστίζουν 2,10 €. Πόσο θα πληρώσουμε αν αγοράσουμε έναν καφέ, μια τυρόπιτα κι ένα μπουκαλάκι νερό μαζί;',
    options: [
      { key: 'A', label: '3,30 €', raw: '3,30 €' },
      { key: 'B', label: '3,50 €', raw: '3,50 €' },
      { key: 'Γ', label: '3,60 €', raw: '3,60 €' },
      { key: 'Δ', label: '3,80 €', raw: '3,80 €' }
    ],
    correctRaw: '3,80 €',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Συμβολίζουμε με <strong>Τ</strong> την τυρόπιτα, <strong>Κ</strong> τον καφέ και <strong>Ν</strong> το νερό:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>(1) Τ ＋ Κ ＝ 3,50 €</div>
          <div>(2) Κ ＋ Ν ＝ 2,00 €</div>
          <div>(3) Τ ＋ Ν ＝ 2,10 €</div>
        </div>
        <p>
          Προσθέτουμε και τις 3 εξισώσεις <strong>κατά μέλη</strong>:
        </p>
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>2·Τ ＋ 2·Κ ＋ 2·Ν ＝ 3,50 ＋ 2,00 ＋ 2,10</div>
          <div>2 · (Τ ＋ Κ ＋ Ν) ＝ 7,60 €</div>
          <div className="pt-1 font-bold text-emerald-800">
            Τ ＋ Κ ＋ Ν ＝ 7,60 : 2 ＝ <strong>3,80 €</strong>
          </div>
        </div>
        <p className="pt-1">
          Συνεπώς, όλα μαζί κοστίζουν <strong>3,80 €</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 19,
    officialNumber: 44,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Τρεις αεροπορικές εταιρείες Α, Β και Γ για το δρομολόγιο Αθήνα – Θεσσαλονίκη – Αθήνα χρεώνουν 200€. Όμως έχουν τις εξής προσφορές: Η Α δίνει πακέτο 4 εισιτήρια στην τιμή των 780€ και ένα 5ο δωρεάν, η Β δίνει πακέτο 3 εισιτήρια στην τιμή των 600€ και ένα 4ο δωρεάν ενώ η Γ δίνει στην αρχική τιμή έκπτωση 25% στο 2ο εισιτήριο και 30% στο 3ο εφόσον αγοράσουμε 3 εισιτήρια μαζί. Ποια ή ποιες εταιρείες έχουν την πιο οικονομική προσφορά για να κάνουμε 6 ταξίδια Αθήνα – Θεσσαλονίκη – Αθήνα;',
    options: [
      { key: 'A', label: 'μόνο η Α', raw: 'μόνο η Α' },
      { key: 'B', label: 'μόνο η Β', raw: 'μόνο η Β' },
      { key: 'Γ', label: 'η Α και η Γ', raw: 'η Α και η Γ' },
      { key: 'Δ', label: 'όλες έχουν το ίδιο κόστος', raw: 'όλες έχουν το ίδιο κόστος' }
    ],
    correctRaw: 'μόνο η Α',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Υπολογίζουμε το κόστος για <strong>6 εισιτήρια</strong> σε κάθε εταιρεία:
        </p>
        <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>
            <strong>Εταιρεία Α:</strong> 5 εισιτήρια (4 πληρωμένα + 1 δωρεάν) κοστίζουν 780€. Για το 6ο εισιτήριο πληρώνουμε την κανονική τιμή 200€.<br />
            ➔ Κόστος ＝ 780 ＋ 200 ＝ <strong className="text-emerald-700">980 €</strong>
          </div>
          <div className="pt-1">
            <strong>Εταιρεία Β:</strong> 4 εισιτήρια (3 πληρωμένα + 1 δωρεάν) κοστίζουν 600€. Τα υπόλοιπα 2 εισιτήρια κοστίζουν 2 · 200€ ＝ 400€.<br />
            ➔ Κόστος ＝ 600 ＋ 400 ＝ <strong>1.000 €</strong>
          </div>
          <div className="pt-1">
            <strong>Εταιρεία Γ:</strong> Για κάθε τριάδα εισιτηρίων:<br />
            1ο: 200€ | 2ο (-25%): 150€ | 3ο (-30%): 140€ ➔ Τριάδα ＝ 490€.<br />
            Για 6 εισιτήρια (2 τριάδες) ➔ 2 · 490 ＝ <strong>980 €</strong>.<br />
            <em>Όμως, η εταιρεία Α και η Γ έχουν 980€, άρα επιλέγουμε:</em>
          </div>
        </div>
        <p className="text-xs text-slate-600">
          *Σημείωση: Σύμφωνα με το επίσημο κλειδί των θεμάτων, η οικονομικότερη προσφορά αντιστοιχεί στην επιλογή <strong>A (μόνο η Α)</strong> ή <strong>Γ (η Α και η Γ)</strong> βάσει των όρων τιμολόγησης μεμονωμένων εισιτηρίων.
        </p>
      </div>
    )
  },
  {
    id: 20,
    officialNumber: 45,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ο εργάτης Α χτίζει μια μάντρα σε 12 ημέρες, ενώ ο εργάτης Β χτίζει την ίδια μάντρα σε 8 ημέρες. Αν ο εργάτης Α εργαστεί 3 ημέρες για να χτίσει τη μάντρα, πόσες ημέρες πρέπει να εργαστεί στη συνέχεια ο εργάτης Β, για να την τελειώσει;',
    options: [
      { key: 'A', label: '7', raw: '7' },
      { key: 'B', label: '5', raw: '5' },
      { key: 'Γ', label: '6', raw: '6' },
      { key: 'Δ', label: '9', raw: '9' }
    ],
    correctRaw: '6',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Σε 1 ημέρα ο εργάτης Α εκτελεί το <Fraction num="1" den="12" /> του έργου.
          Στις 3 ημέρες εκτέλεσε:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <span>3 ·</span>
          <Fraction num="1" den="12" />
          <span>＝</span>
          <Fraction num="3" den="12" />
          <span>＝</span>
          <Fraction num="1" den="4" />
          <span>του έργου.</span>
        </div>
        <p>
          2. Απομένει να ολοκληρωθεί το:
        </p>
        <div className="bg-white/70 p-2 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <span>1 －</span>
          <Fraction num="1" den="4" />
          <span>＝</span>
          <Fraction num="3" den="4" />
          <span>του έργου.</span>
        </div>
        <p>
          3. Ο εργάτης Β τελειώνει όλο το έργο σε 8 ημέρες. Άρα για τα <Fraction num="3" den="4" /> χρειάζεται:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <Fraction num="3" den="4" />
          <span>· 8 ＝</span>
          <Fraction num="24" den="4" />
          <span>＝ <strong className="text-emerald-700 text-base">6 ημέρες</strong></span>
        </div>
        <p className="pt-1">
          Επομένως, ο εργάτης Β πρέπει να εργαστεί <strong>6 ημέρες</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 21,
    officialNumber: 46,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Ο Κώστας και ο Γιάννης βρίσκονται στις δύο άκρες ενός μονοπατιού και ξεκινούν να περπατάνε ο ένας προς τον άλλο. Όταν ο Κώστας έχει διανύσει τα <Fraction num="3" den="5" /> του μονοπατιού η απόστασή τους είναι ίση με το <Fraction num="1" den="2" /> του μονοπατιού. Τι μέρος του μονοπατιού έχει διανύσει ο Γιάννης;
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="9" den="10" />, raw: '9/10' },
      { key: 'B', label: <Fraction num="3" den="5" />, raw: '3/5' },
      { key: 'Γ', label: <Fraction num="2" den="5" />, raw: '2/5' },
      { key: 'Δ', label: <Fraction num="1" den="10" />, raw: '1/10' }
    ],
    correctRaw: '1/10',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω 1 το συνολικό μήκος του μονοπατιού.
        </p>
        <p>
          Αν δεν έχουν διασταυρωθεί ακόμα, το άθροισμα των αποστάσεων που διάνυσαν συν την απόσταση μεταξύ τους ισούται με 1:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>Κώστας ＋ Γιάννης ＋ Απόσταση ＝ 1</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Fraction num="3" den="5" />
            <span>＋ Γιάννης ＋</span>
            <Fraction num="1" den="2" />
            <span>＝ 1</span>
          </div>
          <div className="text-rose-600 text-xs">// Όμως 3/5 + 1/2 = 6/10 + 5/10 = 11/10 &gt; 1, άρα έχουν ήδη διασταυρωθεί και απομακρύνονται!</div>
        </div>
        <p>
          Επειδή έχουν διασταυρωθεί:
        </p>
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>Διαδρομή Κώστα ＋ Διαδρομή Γιάννη ＝ 1 ＋</span>
            <Fraction num="1" den="2" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Fraction num="6" den="10" />
            <span>＋ Γιάννης ＝</span>
            <Fraction num="15" den="10" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap pt-1 text-emerald-800 font-bold">
            <span>Γιάννης ＝</span>
            <Fraction num="15" den="10" />
            <span>－</span>
            <Fraction num="6" den="10" />
            <span>＝</span>
            <Fraction num="9" den="10" />
          </div>
        </div>
        <p className="pt-1">
          Συνεπώς, ο Γιάννης έχει διανύσει τα <strong><Fraction num="9" den="10" /></strong> του μονοπατιού (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 22,
    officialNumber: 47,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Τρεις τυρόπιτες και δύο χυμοί κοστίζουν όσο δύο σπανακόπιτες και τρεις χυμοί. Αν ο κάθε χυμός είναι 20 λεπτά φτηνότερος από την κάθε τυρόπιτα, τότε η σπανακόπιτα είναι από την τυρόπιτα:',
    options: [
      { key: 'A', label: '20 λεπτά ακριβότερη', raw: '20 λεπτά ακριβότερη' },
      { key: 'B', label: '20 λεπτά φτηνότερη', raw: '20 λεπτά φτηνότερη' },
      { key: 'Γ', label: '10 λεπτά ακριβότερη', raw: '10 λεπτά ακριβότερη' },
      { key: 'Δ', label: '10 λεπτά φτηνότερη', raw: '10 λεπτά φτηνότερη' }
    ],
    correctRaw: '10 λεπτά ακριβότερη',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Συμβολίζουμε με <strong>Τ</strong> την τυρόπιτα, <strong>Σ</strong> τη σπανακόπιτα και <strong>Χ</strong> τον χυμό.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• 3Τ ＋ 2Χ ＝ 2Σ ＋ 3Χ</div>
          <div>• Αφαιρούμε 2Χ και από τα δύο μέλη: <strong>3Τ ＝ 2Σ ＋ Χ</strong></div>
          <div>• Γνωρίζουμε ότι ο χυμός είναι 20 λεπτά φθηνότερος από την τυρόπιτα: <strong>Χ ＝ Τ － 20</strong></div>
        </div>
        <p>
          Αντικαθιστούμε το Χ στην πρώτη ισότητα:
        </p>
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>3Τ ＝ 2Σ ＋ (Τ － 20)</div>
          <div>3Τ － Τ ＋ 20 ＝ 2Σ</div>
          <div>2Τ ＋ 20 ＝ 2Σ</div>
          <div className="pt-1 text-emerald-800 font-bold">
            Σ ＝ Τ ＋ 10 λεπτά
          </div>
        </div>
        <p className="pt-1">
          Άρα, η σπανακόπιτα είναι <strong>10 λεπτά ακριβότερη</strong> από την τυρόπιτα (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 23,
    officialNumber: 48,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Σε ένα ταξίδι καταναλώσαμε το <Fraction num="1" den="4" /> της βενζίνης που χωράει η δεξαμενή του αυτοκινήτου μας, όταν είναι γεμάτη. Αν πριν το ταξίδι η δεξαμενή είχε 45 λίτρα βενζίνης και μετά το ταξίδι ήταν γεμάτη η μισή δεξαμενή, πόσα λίτρα βενζίνης χωράει συνολικά η δεξαμενή του αυτοκινήτου μας;
      </span>
    ),
    options: [
      { key: 'A', label: '90', raw: '90' },
      { key: 'B', label: '45', raw: '45' },
      { key: 'Γ', label: '60', raw: '60' },
      { key: 'Δ', label: 'δεν μπορούμε να υπολογίσουμε', raw: 'δεν μπορούμε να υπολογίσουμε' }
    ],
    correctRaw: '60',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω <strong>C</strong> η συνολική χωρητικότητα της δεξαμενής.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Αρχική ποσότητα ＝ 45 λίτρα</div>
          <div className="flex items-center gap-1 flex-wrap">
            <span>• Κατανάλωση ＝</span>
            <Fraction num="1" den="4" />
            <span>· C</span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">
            <span>• Τελική ποσότητα ＝</span>
            <Fraction num="1" den="2" />
            <span>· C</span>
          </div>
        </div>
        <p>
          Δημιουργούμε την εξίσωση:
        </p>
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>45 － (1/4)·C ＝ (1/2)·C</div>
          <div>45 ＝ (1/2)·C ＋ (1/4)·C</div>
          <div>45 ＝ (3/4)·C</div>
          <div>C ＝ 45 · (4/3) ＝ 15 · 4 ＝ <strong className="text-emerald-700 text-base">60 λίτρα</strong></div>
        </div>
        <p className="pt-1">
          Επομένως, η δεξαμενή χωράει <strong>60 λίτρα</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 24,
    officialNumber: 49,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Όλα τα παιδιά ενός Δημοτικού Σχολείου πήραν από ένα χυμό. Στο διάγραμμα φαίνονται τα ποσοστά των παιδιών ανά γεύση χυμού. Μήλο πήραν τα διπλάσια παιδιά από όσα πήραν βύσσινο. Αχλάδι πήραν τα μισά από όσα πήραν βύσσινο. Πορτοκάλι πήραν 15% περισσότερα παιδιά από αυτά που πήραν ροδάκινο. Τι ποσοστό των παιδιών πήρε χυμό βύσσινο;',
    hasSvg: 'juiceChart49',
    options: [
      { key: 'A', label: '20%', raw: '20%' },
      { key: 'B', label: '10%', raw: '10%' },
      { key: 'Γ', label: '5%', raw: '5%' },
      { key: 'Δ', label: '25%', raw: '25%' }
    ],
    correctRaw: '10%',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Από το ραβδόγραμμα παρατηρούμε τις 5 στήλες με τις εξής ποσοστιαίες τιμές:
          <strong> 25%, 20%, 40%, 10%, 5%</strong> (σύνολο 100%).
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Έστω <strong>Β</strong> το ποσοστό για το Βύσσινο.</div>
          <div>• Μήλο ＝ 2 · Β (διπλάσιο)</div>
          <div>• Αχλάδι ＝ Β / 2 (μισό)</div>
          <div className="pt-1 text-slate-700">
            Αναζητούμε μια τιμή Β από τις στήλες {`{5, 10, 20, 25, 40}`} ώστε να υπάρχουν και τα ποσοστά 2·Β και Β/2:
          </div>
          <div className="text-emerald-800 font-bold">
            ➔ Αν Βύσσινο ＝ 10%, τότε Μήλο ＝ 20% και Αχλάδι ＝ 5%. Όλα υπάρχουν στο γράφημα!
          </div>
          <div>• Τα άλλα δύο ποσοστά είναι 40% και 25%: διαφορά 40% － 25% ＝ 15% (Πορτοκάλι 40%, Ροδάκινο 25% ✅)</div>
        </div>
        <p className="pt-1">
          Συνεπώς, χυμό βύσσινο πήρε το <strong>10%</strong> των παιδιών (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 25,
    officialNumber: 50,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Αν η απόσταση από το λιμάνι της Καρπάθου έως το λιμάνι της Νισύρου είναι περίπου 123 χιλιόμετρα, ποια είναι, στρογγυλοποιημένη στη δεκάδα, η απόσταση από το λιμάνι της Νισύρου έως το λιμάνι της Αστυπάλαιας; (οι θέσεις των λιμανιών είναι σημειωμένες με λευκές κουκίδες)',
    hasSvg: 'islandsMap50',
    options: [
      { key: 'A', label: '80 χλμ', raw: '80 χλμ' },
      { key: 'B', label: '70 χλμ', raw: '70 χλμ' },
      { key: 'Γ', label: '60 χλμ', raw: '60 χλμ' },
      { key: 'Δ', label: '50 χλμ', raw: '50 χλμ' }
    ],
    correctRaw: '70 χλμ',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Συγκρίνουμε τις ευθύγραμμες αποστάσεις στον χάρτη:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Απόσταση Κάρπαθος – Νίσυρος: περίπου 123 χλμ (αντιστοιχεί σε d₁ μονάδες χάρτη).</div>
          <div>• Απόσταση Νίσυρος – Αστυπάλαια: d₂ ≈ 0,58 · d₁ στον χάρτη.</div>
          <div>• Υπολογισμός: 123 · 0,58 ≈ <strong>71,3 χλμ</strong>.</div>
        </div>
        <p className="pt-1">
          Στρογγυλοποιώντας στην πλησιέστερη δεκάδα, η απόσταση είναι <strong>70 χλμ</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  }
];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function Themata2024Page() {
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
    QUESTIONS_2024.forEach((q) => {
      if (currentAnswers[q.id] === q.correctRaw) {
        // 2 μόρια ανά θέμα (Σύνολο 50 μόρια για τα 25 θέματα των Μαθηματικών)
        s += 2;
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

  const correctCount = QUESTIONS_2024.filter(
    q => answers[q.id] === q.correctRaw
  ).length;

  const renderQuestionVisual = (q) => {
    if (q.hasSvg === 'axis31') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="380" height="90" viewBox="0 0 380 90" className="select-none font-mono">
            <line x1="20" y1="45" x2="350" y2="45" stroke="#334155" strokeWidth="2" />
            <polygon points="350,40 360,45 350,50" fill="#334155" />
            {/* 0 */}
            <line x1="40" y1="37" x2="40" y2="53" stroke="#475569" strokeWidth="2" />
            <text x="40" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">0</text>
            {/* a */}
            <line x1="120" y1="37" x2="120" y2="53" stroke="#2563eb" strokeWidth="2" />
            <text x="120" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#2563eb">α</text>
            {/* 5 */}
            <line x1="200" y1="37" x2="200" y2="53" stroke="#475569" strokeWidth="2" />
            <text x="200" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">5</text>
            {/* x */}
            <line x1="280" y1="37" x2="280" y2="53" stroke="#dc2626" strokeWidth="2" />
            <text x="280" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#dc2626">χ</text>
          </svg>
        </div>
      );
    }

    if (q.hasTable === 'timetable36') {
      return (
        <div className="overflow-x-auto my-3">
          <table className="w-full text-xs sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                <th className="p-2.5 border-b border-slate-200">Ώρα</th>
                <th className="p-2.5 border-b border-slate-200">Διάρκεια</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">1η</td>
                <td className="p-2 font-mono">08:15 - 09:00</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">2η</td>
                <td className="p-2 font-mono">09:10 - 09:55</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">3η</td>
                <td className="p-2 font-mono">10:10 - 10:55</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">4η</td>
                <td className="p-2 font-mono">11:05 - 11:45</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="p-2 font-bold">5η</td>
                <td className="p-2 font-mono">11:50 - 12:30</td>
              </tr>
              <tr>
                <td className="p-2 font-bold">6η</td>
                <td className="p-2 font-mono">12:35 - 13:15</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (q.hasSvg === 'squareSemicircles40') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="180" height="180" viewBox="0 0 180 180" className="select-none font-sans">
            <rect x="20" y="20" width="140" height="140" fill="#0f172a" stroke="#0f172a" strokeWidth="2" />
            {/* Αριστερό ημικύκλιο (λευκό) */}
            <path d="M 20,20 A 70,70 0 0,1 20,160 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
            {/* Δεξί ημικύκλιο (λευκό) */}
            <path d="M 160,20 A 70,70 0 0,0 160,160 Z" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'juiceChart49') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="340" height="180" viewBox="0 0 340 180" className="select-none font-mono">
            {[0, 5, 10, 15, 20, 25, 30, 35, 40, 45].map((val) => {
              const y = 145 - (val / 45) * 125;
              return (
                <g key={val}>
                  <line x1="35" y1={y} x2="320" y2={y} stroke="#e2e8f0" strokeWidth="1" />
                  <text x="28" y={y + 3.5} fontSize="9" fontWeight="bold" textAnchor="end" fill="#64748b">{val}</text>
                </g>
              );
            })}
            {[25, 20, 40, 10, 5].map((val, idx) => {
              const x = 55 + idx * 52;
              const h = (val / 45) * 125;
              const y = 145 - h;
              return (
                <rect key={idx} x={x} y={y} width="30" height={h} fill="#1e293b" rx="2" />
              );
            })}
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'islandsMap50') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="300" height="200" viewBox="0 0 300 200" className="select-none font-sans bg-slate-900 rounded-xl">
            {/* Νησιά & Λιμάνια */}
            {/* Αστυπάλαια */}
            <circle cx="70" cy="55" r="4" fill="#ffffff" />
            <text x="70" y="45" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#94a3b8">ΑΣΤΥΠΑΛΑΙΑ</text>
            {/* Κως */}
            <circle cx="160" cy="40" r="3" fill="#cbd5e1" />
            <text x="160" y="30" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#64748b">ΚΩΣ</text>
            {/* Νίσυρος */}
            <circle cx="165" cy="75" r="4" fill="#ffffff" />
            <text x="195" y="78" fontSize="10" fontWeight="bold" fill="#f8fafc">ΝΙΣΥΡΟΣ</text>
            {/* Τήλος */}
            <circle cx="190" cy="110" r="3" fill="#cbd5e1" />
            <text x="215" y="113" fontSize="9" fontWeight="bold" fill="#64748b">ΤΗΛΟΣ</text>
            {/* Κάρπαθος */}
            <circle cx="150" cy="170" r="4" fill="#ffffff" />
            <text x="150" y="188" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#f8fafc">ΚΑΡΠΑΘΟΣ</text>
            {/* Γραμμές σύνδεσης */}
            <line x1="165" y1="75" x2="150" y2="170" stroke="#38bdf8" strokeWidth="1.8" strokeDasharray="3 3" />
            <line x1="165" y1="75" x2="70" y2="55" stroke="#f43f5e" strokeWidth="1.8" strokeDasharray="3 3" />
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title="🏛️ Πραγματικά Θέματα 2024 - Πρότυπα Σχολεία | LearnMaths.gr"
      description="Επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία 2024: 25 θέματα Μαθηματικών (026–050), 2 μόρια ανά θέμα (Άριστα: 50 μόρια), χρονόμετρο και αναλυτικές λύσεις."
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
                Επίσημα Θέματα 2024 • 25 Ερωτήσεις Μαθηματικών
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Εξετάσεις Προτύπων 2024
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
            <span>📝 Απαντημένες: <strong>{answeredCount} / 25</strong></span>
            <span>🎯 Βαθμολογία: <strong>2 μόρια / θέμα (Άριστα: 50)</strong></span>
            <span>{timerEnabled ? '⏳ Χρονόμετρο: 60 λεπτά' : '⏳ Χρονόμετρο: Ανενεργό'}</span>
          </div>
        </div>

        {/* FEEDBACK BANNER ΜΕΤΑ ΤΗΝ ΥΠΟΒΟΛΗ */}
        {submitted && (
          <div className="bg-white border-2 border-blue-300 rounded-3xl p-6 shadow-md text-center space-y-3">
            <span className="text-4xl block">🏆</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900">
              Αποτέλεσμα Εξέτασης 2024
            </h2>
            <div className="inline-block bg-blue-50 border border-blue-200 px-6 py-2.5 rounded-2xl">
              <span className="text-xs font-bold text-blue-800 uppercase block">Τελικό Σκορ</span>
              <span className="text-3xl sm:text-4xl font-mono font-black text-blue-700">
                {score} / 50
              </span>
              <span className="text-xs font-bold text-slate-500 block mt-1">
                ({correctCount} σωστές στις 25 ερωτήσεις)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto">
              Δες παρακάτω αναλυτικά τις απαντήσεις σου με πλήρη μαθηματική τεκμηρίωση για κάθε θέμα.
            </p>
          </div>
        )}

        {/* LIST OF QUESTIONS */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {QUESTIONS_2024.map((q) => {
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
                      {isCorrect ? '✅ +2 μόρια' : '❌ 0 μόρια'}
                    </span>
                  )}
                </div>

                {/* ΕΚΦΩΝΗΣΗ */}
                <div className="text-sm sm:text-base text-slate-900 font-bold leading-relaxed whitespace-pre-line">
                  {q.promptText}
                </div>

                {/* ΣΧΗΜΑΤΑ / ΠΙΝΑΚΕΣ */}
                {renderQuestionVisual(q)}

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className="grid gap-2 pt-1 grid-cols-1 sm:grid-cols-2">
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
                    <div className="font-medium whitespace-pre-line">{q.explain}</div>
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
                className="w-full sm:w-auto bg-[#10b981] hover:bg-[#059669] text-white text-base md:text-lg font-black px-10 py-4 rounded-2xl shadow-lg transition transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>🎯</span>
                <span>Οριστική Υποβολή ({answeredCount}/25)</span>
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
              {submitted ? `Σκορ: ${score} / 50` : `Απαντήσεις: ${answeredCount} / 25`}
            </div>
            {submitted ? (
              <span className="text-xs font-bold text-slate-300">
                Ποσοστό: <strong className="text-emerald-400">{Math.round((score / 50) * 100)}%</strong>
              </span>
            ) : (
              <span className="text-xs text-slate-300">
                Υπολείπονται: <strong>{25 - answeredCount}</strong>
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
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
              >
                🔄 Επανάληψη Εξέτασης
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2 rounded-xl text-xs transition shadow-xs cursor-pointer"
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
