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

const QUESTIONS_2023 = [
  {
    id: 1,
    officialNumber: 26,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Το Ελάχιστο Κοινό Πολλαπλάσιο των αριθμών 3, 6 και 8 είναι:',
    options: [
      { key: 'A', label: '12', raw: '12' },
      { key: 'B', label: '24', raw: '24' },
      { key: 'Γ', label: '48', raw: '48' },
      { key: 'Δ', label: '72', raw: '72' }
    ],
    correctRaw: '24',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Αναλύουμε τους αριθμούς σε γινόμενο πρώτων παραγόντων:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• 3 ＝ 3¹</div>
          <div>• 6 ＝ 2 · 3</div>
          <div>• 8 ＝ 2³</div>
        </div>
        <p>
          Παίρνουμε όλους τους κοινούς και μη κοινούς πρώτους παράγοντες με τον μεγαλύτερο εκθέτη:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          ΕΚΠ(3, 6, 8) ＝ 2³ · 3 ＝ 8 · 3 ＝ <strong className="text-emerald-700 text-base">24</strong>
        </div>
        <p className="pt-1">
          Άρα, το Ελάχιστο Κοινό Πολλαπλάσιο είναι το <strong>24</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 2,
    officialNumber: 27,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: (
      <span className="inline-flex items-center flex-wrap">
        Η τιμή της παράστασης &nbsp;
        <span className="font-mono">
          <Fraction num="17" den="2" /> － 2³ : 6
        </span>
        &nbsp; είναι:
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="43" den="6" />, raw: '43/6' },
      { key: 'B', label: <Fraction num="1" den="12" />, raw: '1/12' },
      { key: 'Γ', label: <Fraction num="15" den="2" />, raw: '15/2' },
      { key: 'Δ', label: <Fraction num="59" den="6" />, raw: '59/6' }
    ],
    correctRaw: '43/6',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εκτελούμε πρώτα τη δύναμη και τη διαίρεση, τηρώντας την προτεραιότητα των πράξεων:
        </p>
        <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• 2³ ＝ 8</div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>• 8 : 6 ＝</span>
            <Fraction num="8" den="6" />
            <span>＝</span>
            <Fraction num="4" den="3" />
          </div>
        </div>
        <p>
          Στη συνέχεια κάνουμε την αφαίρεση κάνοντας τα κλάσματα ομώνυμα (ΕΚΠ(2, 3) ＝ 6):
        </p>
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="17" den="2" />
          <span>－</span>
          <Fraction num="8" den="6" />
          <span>＝</span>
          <Fraction num="51" den="6" />
          <span>－</span>
          <Fraction num="8" den="6" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="43" den="6" /></strong>
        </div>
        <p className="pt-1">
          Επομένως, η τιμή της παράστασης είναι <strong><Fraction num="43" den="6" /></strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 3,
    officialNumber: 28,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Το γεωμετρικό σχήμα που βρίσκεται στην 51η θέση του παρακάτω μοτίβου είναι:',
    hasSvg: 'pattern28',
    options: [
      { key: 'A', label: 'Τρίγωνο', raw: 'Τρίγωνο' },
      { key: 'B', label: 'Τετράγωνο', raw: 'Τετράγωνο' },
      { key: 'Γ', label: 'Κύκλος', raw: 'Κύκλος' },
      { key: 'Δ', label: 'Ορθογώνιο', raw: 'Ορθογώνιο' }
    ],
    correctRaw: 'Τρίγωνο',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Παρατηρώντας το σχήμα, το μοτίβο επαναλαμβάνεται ανά <strong>4 σχήματα</strong>:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>1. Ορθογώνιο ➔ 2. Κύκλος ➔ <strong>3. Τρίγωνο</strong> ➔ 4. Τετράγωνο</div>
        </div>
        <p>
          Διαιρούμε τη θέση 51 με το πλήθος των σχημάτων της περιόδου (4):
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>51 ＝ 4 · 12 ＋ <strong>3</strong></div>
          <div className="text-emerald-800 font-bold pt-1">
            ➔ 12 πλήρεις τετράδες και υπόλοιπο 3.
          </div>
        </div>
        <p className="pt-1">
          Το 3ο σχήμα της τετράδας είναι το <strong>Τρίγωνο</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 4,
    officialNumber: 29,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Αν η πλευρά ενός τετραγώνου μειωθεί στο μισό, τότε το εμβαδόν του σε σχέση με το αρχικό είναι το:',
    options: [
      { key: 'A', label: '50%', raw: '50%' },
      { key: 'B', label: '75%', raw: '75%' },
      { key: 'Γ', label: '25%', raw: '25%' },
      { key: 'Δ', label: '100%', raw: '100%' }
    ],
    correctRaw: '25%',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω <strong>α</strong> η αρχική πλευρά του τετραγώνου. Το αρχικό εμβαδόν είναι <strong>Ε₁ ＝ α²</strong>.
        </p>
        <p>
          Αν η νέα πλευρά γίνει <strong>α / 2</strong>, το νέο εμβαδόν είναι:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Ε₂ ＝ (α / 2)² ＝</span>
          <Fraction num="α²" den="4" />
          <span>＝</span>
          <Fraction num="1" den="4" />
          <span>· Ε₁ ＝ <strong className="text-emerald-700 text-base">25%</strong> του Ε₁</span>
        </div>
        <p className="pt-1">
          Άρα, το εμβαδόν του γίνεται το <strong>25%</strong> του αρχικού (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 5,
    officialNumber: 30,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ποιο κλάσμα είναι πιο κοντά στη μονάδα;',
    options: [
      { key: 'A', label: <Fraction num="2" den="17" />, raw: '2/17' },
      { key: 'B', label: <Fraction num="2" den="18" />, raw: '2/18' },
      { key: 'Γ', label: <Fraction num="2" den="13" />, raw: '2/13' },
      { key: 'Δ', label: <Fraction num="2" den="9" />, raw: '2/9' }
    ],
    correctRaw: '2/9',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Όλα τα κλάσματα έχουν τον ίδιο αριθμητή (2) και είναι γνήσια (μικρότερα του 1).
        </p>
        <p>
          Όσο <strong>μικρότερος είναι ο παρονομαστής</strong> σε κλάσματα με ίδιο θετικό αριθμητή, τόσο <strong>μεγαλύτερη είναι η τιμή</strong> του κλάσματος:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="2" den="18" />
          <span>&lt;</span>
          <Fraction num="2" den="17" />
          <span>&lt;</span>
          <Fraction num="2" den="13" />
          <span>&lt;</span>
          <strong className="text-emerald-700 text-base"><Fraction num="2" den="9" /></strong>
        </div>
        <p className="pt-1">
          Επομένως, το μεγαλύτερο κλάσμα που πλησιάζει περισσότερο τη μονάδα είναι το <strong><Fraction num="2" den="9" /></strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 6,
    officialNumber: 31,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ένα μπλουζάκι κόστιζε 25€ και στις εκπτώσεις το αγοράσαμε 15€. Το ποσοστό έκπτωσης ήταν:',
    options: [
      { key: 'A', label: '40%', raw: '40%' },
      { key: 'B', label: '60%', raw: '60%' },
      { key: 'Γ', label: '30%', raw: '30%' },
      { key: 'Δ', label: '15%', raw: '15%' }
    ],
    correctRaw: '40%',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Υπολογίζουμε το ποσό της έκπτωσης σε ευρώ:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Έκπτωση ＝ 25€ － 15€ ＝ <strong>10€</strong>
        </div>
        <p>
          2. Βρίσκουμε το ποσοστό επί της <strong>αρχικής τιμής</strong>:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Ποσοστό ＝</span>
          <Fraction num="10" den="25" />
          <span>＝</span>
          <Fraction num="40" den="100" />
          <span>＝ <strong className="text-emerald-700 text-base">40%</strong></span>
        </div>
        <p className="pt-1">
          Άρα, το ποσοστό της έκπτωσης ήταν <strong>40%</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 7,
    officialNumber: 32,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Το διπλάσιο ενός αριθμού μειωμένο κατά το μισό του ισούται με 15. Ποια εξίσωση περιγράφει το πρόβλημα;',
    options: [
      { key: 'A', label: <span className="font-mono">2 · x － x/2 ＝ 15</span>, raw: '2*x - x/2 = 15' },
      { key: 'B', label: <span className="font-mono">2 · x － x ＝ 15</span>, raw: '2*x - x = 15' },
      { key: 'Γ', label: <span className="font-mono">x/2 ＝ 15</span>, raw: 'x/2 = 15' },
      { key: 'Δ', label: <span className="font-mono">2 · (x － x/2) ＝ 15</span>, raw: '2*(x - x/2) = 15' }
    ],
    correctRaw: '2*x - x/2 = 15',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Αν συμβολίσουμε τον άγνωστο αριθμό με <strong>x</strong>:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Το διπλάσιο του αριθμού: <strong>2 · x</strong></div>
          <div>• Το μισό του αριθμού: <strong>x / 2</strong></div>
          <div className="pt-1">
            • Μειωμένο κατά το μισό του: <strong>2 · x － x/2 ＝ 15</strong>
          </div>
        </div>
        <p className="pt-1">
          Επομένως, η σωστή εξίσωση είναι η <strong>2 · x － x/2 ＝ 15</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 8,
    officialNumber: 33,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: (
      <span>
        Το <Fraction num="1" den="3" /> των μισών παιδιών ενός σχολείου μιλάει Γερμανικά. Αν ο αριθμός αυτών των παιδιών είναι 36, πόσοι είναι όλοι οι μαθητές του σχολείου;
      </span>
    ),
    options: [
      { key: 'A', label: '216', raw: '216' },
      { key: 'B', label: '108', raw: '108' },
      { key: 'Γ', label: '12', raw: '12' },
      { key: 'Δ', label: '120', raw: '120' }
    ],
    correctRaw: '216',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω <strong>X</strong> ο συνολικός αριθμός των μαθητών του σχολείου.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>Τα μισά παιδιά είναι:</span>
            <Fraction num="X" den="2" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>Το</span>
            <Fraction num="1" den="3" />
            <span>των μισών είναι:</span>
            <Fraction num="1" den="3" />
            <span>·</span>
            <Fraction num="X" den="2" />
            <span>＝</span>
            <Fraction num="X" den="6" />
          </div>
        </div>
        <p>
          Γνωρίζουμε ότι το <Fraction num="1" den="6" /> του σχολείου είναι 36 μαθητές:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          X ＝ 36 · 6 ＝ <strong className="text-emerald-700 text-base">216 μαθητές</strong>
        </div>
        <p className="pt-1">
          Άρα, όλοι οι μαθητές είναι <strong>216</strong> (Επιλογή <strong>A</strong>).
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
        Στην αριθμογραμμή ο αριθμός <Fraction num="5" den="3" /> είναι στο μέσο της απόστασης του αριθμού α από τον αριθμό <Fraction num="9" den="4" />. Τότε ο αριθμός α είναι:
      </span>
    ),
    hasSvg: 'axis34',
    options: [
      { key: 'A', label: <Fraction num="13" den="12" />, raw: '13/12' },
      { key: 'B', label: <Fraction num="1" den="12" />, raw: '1/12' },
      { key: 'Γ', label: <Fraction num="4" den="3" />, raw: '4/3' },
      { key: 'Δ', label: <Fraction num="11" den="12" />, raw: '11/12' }
    ],
    correctRaw: '13/12',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Επειδή το <Fraction num="5" den="3" /> είναι το μέσο του τμήματος ανάμεσα στο α και το <Fraction num="9" den="4" />:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>(α ＋</span>
            <Fraction num="9" den="4" />
            <span>) : 2 ＝</span>
            <Fraction num="5" den="3" />
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span>α ＋</span>
            <Fraction num="9" den="4" />
            <span>＝ 2 ·</span>
            <Fraction num="5" den="3" />
            <span>＝</span>
            <Fraction num="10" den="3" />
          </div>
        </div>
        <p>
          Λύνουμε ως προς α (με κοινό παρονομαστή το 12):
        </p>
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>α ＝</span>
          <Fraction num="10" den="3" />
          <span>－</span>
          <Fraction num="9" den="4" />
          <span>＝</span>
          <Fraction num="40" den="12" />
          <span>－</span>
          <Fraction num="27" den="12" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="13" den="12" /></strong>
        </div>
        <p className="pt-1">
          Συνεπώς, ο αριθμός α είναι <strong><Fraction num="13" den="12" /></strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 10,
    officialNumber: 35,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Μια βρύση γεμίζει μια δεξαμενή σε 10 ώρες. Μια άλλη βρύση γεμίζει την ίδια δεξαμενή σε 12 ώρες. Αν ανοίξουμε και τις δυο βρύσες μαζί για 1 ώρα, τι μέρος της δεξαμενής θα γεμίσουν;',
    options: [
      { key: 'A', label: <Fraction num="12" den="60" />, raw: '12/60' },
      { key: 'B', label: <Fraction num="1" den="22" />, raw: '1/22' },
      { key: 'Γ', label: <Fraction num="2" den="22" />, raw: '2/22' },
      { key: 'Δ', label: <Fraction num="22" den="120" />, raw: '22/120' }
    ],
    correctRaw: '22/120',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Σε 1 ώρα:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div className="flex items-center gap-1">
            <span>• Η 1η βρύση γεμίζει το</span>
            <Fraction num="1" den="10" />
            <span>της δεξαμενής.</span>
          </div>
          <div className="flex items-center gap-1">
            <span>• Η 2η βρύση γεμίζει το</span>
            <Fraction num="1" den="12" />
            <span>της δεξαμενής.</span>
          </div>
        </div>
        <p>
          Μαζί σε 1 ώρα γεμίζουν:
        </p>
        <div className="bg-white/80 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="1" den="10" />
          <span>＋</span>
          <Fraction num="1" den="12" />
          <span>＝</span>
          <Fraction num="12" den="120" />
          <span>＋</span>
          <Fraction num="10" den="120" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="22" den="120" /></strong>
          <span className="text-slate-500 font-sans text-xs">(ή 11/60)</span>
        </div>
        <p className="pt-1">
          Επομένως, γεμίζουν τα <strong><Fraction num="22" den="120" /></strong> της δεξαμενής (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 11,
    officialNumber: 36,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Η Μαρία εκτρέφει κουνέλια και κάθε χρόνο ο πληθυσμός τους αυξάνει κατά 50%. Αν σήμερα έχει 64 κουνέλια, πόσα θα έχει σε δύο χρόνια;',
    options: [
      { key: 'A', label: '128', raw: '128' },
      { key: 'B', label: '144', raw: '144' },
      { key: 'Γ', label: '164', raw: '164' },
      { key: 'Δ', label: '256', raw: '256' }
    ],
    correctRaw: '144',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Αύξηση κατά 50% σημαίνει ότι ο πληθυσμός γίνεται 1,5 φορά ο προηγούμενος (ή προσθέτουμε τα μισά):
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div>
            <strong>1ος χρόνος:</strong> 64 ＋ 50% · 64 ＝ 64 ＋ 32 ＝ <strong>96 κουνέλια</strong>
          </div>
          <div>
            <strong>2ος χρόνος:</strong> 96 ＋ 50% · 96 ＝ 96 ＋ 48 ＝ <strong className="text-emerald-700 text-base">144 κουνέλια</strong>
          </div>
        </div>
        <p className="pt-1">
          Άρα, σε δύο χρόνια θα έχει <strong>144</strong> κουνέλια (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 12,
    officialNumber: 37,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ο Παναγιώτης βρίσκεται αρχικά στη θέση Ο και θέλει να πάει στο σπίτι του. Ξεκινά να περπατά στην κατεύθυνση που δείχνει το βέλος για 1.600 μέτρα. Μετά στρίβει 90° αριστερά και περπατάει για ακόμη 400 μέτρα μέχρι να ξαναστρίψει 90° αριστερά και να περπατήσει άλλο 1 χιλιόμετρο (1.000 μ.) ώστε να φτάσει στο σπίτι του. Αν η απόσταση ΑΒ είναι 800 μέτρα, σε ποια θέση είναι το σπίτι του Παναγιώτη;',
    hasSvg: 'gridMap37',
    options: [
      { key: 'A', label: 'στο Α', raw: 'στο Α' },
      { key: 'B', label: 'στο Β', raw: 'στο Β' },
      { key: 'Γ', label: 'στο Γ', raw: 'στο Γ' },
      { key: 'Δ', label: 'σε διαφορετικό σημείο από τα Α, Β, Γ', raw: 'σε διαφορετικό σημείο' }
    ],
    correctRaw: 'στο Α',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. <strong>Κλίμακα καννάβου:</strong> Παρατηρούμε στο πλέγμα ότι το σημείο Α απέχει από το Β κατά 4 κατακόρυφα τετραγωνάκια.
          Εφόσον ΑΒ ＝ 800 μέτρα, κάθε τετραγωνάκι έχει πλευρά:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          800 : 4 ＝ <strong>200 μέτρα ανά τετραγωνάκι</strong>
        </div>
        <p>
          2. <strong>Διαδρομή του Παναγιώτη:</strong>
        </p>
        <ul className="space-y-1.5 pl-4 sm:pl-5 text-slate-800 list-disc font-medium">
          <li>1.600 μ. δεξιά (ανατολικά) ➔ 1.600 : 200 ＝ <strong>8 κουτάκια δεξιά</strong>.</li>
          <li>Στροφή 90° αριστερά και 400 μ. πάνω (βόρεια) ➔ 400 : 200 ＝ <strong>2 κουτάκια πάνω</strong>.</li>
          <li>Στροφή 90° αριστερά και 1.000 μ. αριστερά (δυτικά) ➔ 1.000 : 200 ＝ <strong>5 κουτάκια αριστερά</strong>.</li>
        </ul>
        <p>
          Τελική συντεταγμένη από το Ο: 8 － 5 ＝ 3 κουτάκια δεξιά και 2 κουτάκια πάνω.
          Στο πλέγμα, αυτό ακριβώς είναι το σημείο <strong>Α</strong>!
        </p>
        <p className="pt-1 font-bold text-emerald-800">
          Άρα, το σπίτι βρίσκεται στο σημείο Α (Επιλογή A).
        </p>
      </div>
    )
  },
  {
    id: 13,
    officialNumber: 38,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Αν κάθε τετραγωνάκι έχει εμβαδόν 1, τότε για το εμβαδόν Ε του μαύρου σχήματος (έλλειψη με άξονες μήκους 10 και 6 τετραγωνάκια) ισχύει ότι:',
    hasSvg: 'ellipse38',
    options: [
      { key: 'A', label: 'Ε < 50', raw: 'Ε < 50' },
      { key: 'B', label: '50 < Ε < 52', raw: '50 < Ε < 52' },
      { key: 'Γ', label: '52 < Ε < 54', raw: '52 < Ε < 54' },
      { key: 'Δ', label: 'Ε > 54', raw: 'Ε > 54' }
    ],
    correctRaw: 'Ε < 50',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Το σχήμα είναι μία έλλειψη εγγεγραμμένη σε ορθογώνιο διαστάσεων 10 × 6 (μεγάλος άξονας 2a ＝ 10, μικρός άξονας 2b ＝ 6, άρα a ＝ 5 και b ＝ 3):
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Εμβαδόν περιγεγραμμένου ορθογωνίου: 10 · 6 ＝ 60 τετραγωνάκια</div>
          <div>• Τύπος εμβαδού έλλειψης: <strong>Ε ＝ π · a · b</strong></div>
          <div>• Ε ＝ 3,14 · 5 · 3 ＝ 3,14 · 15 ＝ <strong className="text-emerald-700 text-base">47,1</strong></div>
        </div>
        <p className="pt-1">
          Επομένως, το εμβαδόν είναι 47,1, οπότε ισχύει ότι <strong>Ε &lt; 50</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 14,
    officialNumber: 39,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Θέλουμε να ταξιδέψουμε με λεωφορείο από την Αθήνα προς τον Πύργο και να φτάσουμε νωρίτερα από τις 3:30 μ.μ. (15:30). Σύμφωνα με τους πίνακες δρομολογίων (απευθείας ή μέσω Πάτρας), τι ώρα το αργότερο πρέπει να φύγουμε από την Αθήνα;',
    hasTable: 'busTable39',
    options: [
      { key: 'A', label: '08:30', raw: '08:30' },
      { key: 'B', label: '09:30', raw: '09:30' },
      { key: 'Γ', label: '11:00', raw: '11:00' },
      { key: 'Δ', label: '12:15', raw: '12:15' }
    ],
    correctRaw: '11:00',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εξετάζουμε τα απευθείας δρομολόγια και τα δρομολόγια με ανταπόκριση μέσω Πάτρας:
        </p>
        <div className="space-y-2 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>
            <strong>1. Απευθείας Αθήνα - Πύργος:</strong><br />
            • Αναχώρηση 08:30 ➔ Άφιξη: 08:30 ＋ 3ω 50λ ＝ 12:20 (πριν τις 15:30 ✅)<br />
            • Αναχώρηση 12:15 ➔ Άφιξη: 12:15 ＋ 3ω 50λ ＝ 16:05 (αργότερα από 15:30 ❌)
          </div>
          <div className="pt-1">
            <strong>2. Μέσω Πάτρας (Αθήνα ➔ Πάτρα ➔ Πύργος):</strong><br />
            • Αναχώρηση από Αθήνα στις <strong>11:00</strong>:<br />
            &nbsp;&nbsp;Άφιξη Πάτρα: 11:00 ＋ 2ω 50λ ＝ 13:50.<br />
            &nbsp;&nbsp;Προλαβαίνει το λεωφορείο Πάτρα - Πύργος των <strong>14:15</strong>!<br />
            &nbsp;&nbsp;Άφιξη Πύργος: 14:15 ＋ 70λ (1ω 10λ) ＝ <strong>15:25</strong> (πριν τις 15:30 ✅)
          </div>
        </div>
        <p className="pt-1">
          Η πιο αργοπορημένη ώρα αναχώρησης από την Αθήνα είναι στις <strong>11:00</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 15,
    officialNumber: 40,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Για την κατασκευή μιας πλατείας σε σχήμα ορθογωνίου παραλληλογράμμου αποφασίστηκε ένα μέρος της να γίνει πεζόδρομος (λευκό) και το υπόλοιπο να φυτευτεί με γρασίδι (γκρι). Οι πεζόδρομοι έχουν παντού το ίδιο πλάτος στα 3 σχέδια. Σε ποιο σχέδιο υπάρχει περισσότερο γρασίδι;',
    hasSvg: 'parks40',
    options: [
      { key: 'A', label: 'το 1ο', raw: 'το 1ο' },
      { key: 'B', label: 'το 2ο', raw: 'το 2ο' },
      { key: 'Γ', label: 'το 3ο', raw: 'το 3ο' },
      { key: 'Δ', label: 'όλα έχουν το ίδιο γρασίδι', raw: 'όλα έχουν το ίδιο γρασίδι' }
    ],
    correctRaw: 'όλα έχουν το ίδιο γρασίδι',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω <strong>L</strong> το μήκος και <strong>W</strong> το πλάτος της πλατείας, και <strong>d</strong> το σταθερό πλάτος του πεζοδρόμου (οριζόντιου και κατακόρυφου).
        </p>
        <p>
          Αν «σπρώξουμε» τα κομμάτια του γρασιδιού ώστε να ενωθούν:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Και στα 3 σχέδια αφαιρείται μία κατακόρυφη λωρίδα πλάτους d και μία οριζόντια λωρίδα πλάτους d.</div>
          <div>• Το συνολικό εμβαδόν του γρασιδιού ισούται πάντα με:</div>
          <div className="text-emerald-700 font-bold text-center text-sm">
            Ε_γρασιδιού ＝ (L － d) · (W － d)
          </div>
        </div>
        <p className="pt-1">
          Επομένως, <strong>όλα τα σχέδια έχουν ακριβώς το ίδιο γρασίδι</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 16,
    officialNumber: 41,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Το πηλίκο της διαίρεσης 50.204 : 5 είναι ίσο με:',
    options: [
      { key: 'A', label: '10.004,8', raw: '10004,8' },
      { key: 'B', label: '10.040,8', raw: '10040,8' },
      { key: 'Γ', label: '10.004,08', raw: '10004,08' },
      { key: 'Δ', label: '1.004,8', raw: '1004,8' }
    ],
    correctRaw: '10040,8',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εκτελούμε τη διαίρεση ή διπλασιάζουμε διαιρετέο και διαιρέτη:
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div className="flex items-center gap-1.5 flex-wrap">
            <Fraction num="50204" den="5" />
            <span>＝</span>
            <Fraction num="50204 · 2" den="5 · 2" />
            <span>＝</span>
            <Fraction num="100408" den="10" />
            <span>＝ <strong className="text-emerald-700 text-base">10.040,8</strong></span>
          </div>
        </div>
        <p className="pt-1">
          Συνεπώς, το πηλίκο είναι <strong>10.040,8</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 17,
    officialNumber: 42,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Σε έρευνα για το αγαπημένο άθλημα οι απαντήσεις ήταν «ποδόσφαιρο», «τένις», «μπάσκετ» και «βόλεϊ». Τα περισσότερα παιδιά απάντησαν «ποδόσφαιρο», ενώ «μπάσκετ» απάντησαν αρκετά περισσότερα παιδιά από όσα απάντησαν «τένις». Στο κυκλικό διάγραμμα, σε ποιο άθλημα αντιστοιχεί το μαύρο μέρος;',
    hasSvg: 'pieChart42',
    options: [
      { key: 'A', label: 'Τένις', raw: 'Τένις' },
      { key: 'B', label: 'Μπάσκετ', raw: 'Μπάσκετ' },
      { key: 'Γ', label: 'Ποδόσφαιρο', raw: 'Ποδόσφαιρο' },
      { key: 'Δ', label: 'Βόλεϊ', raw: 'Βόλεϊ' }
    ],
    correctRaw: 'Τένις',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Παρατηρούμε τα 4 τμήματα του κυκλικού διαγράμματος σε φθίνουσα σειρά μεγέθους:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>1. Μεγαλύτερο τμήμα (&gt; 25%): <strong>Ποδόσφαιρο</strong> (τα περισσότερα παιδιά).</div>
          <div>2. Επόμενο μεγάλο τμήμα (25%): <strong>Μπάσκετ</strong>.</div>
          <div>3. Μικρότερο τμήμα (οξύς μαύρος τομέας &lt; 25%): <strong>Τένις</strong> (αφού μπάσκετ &gt;&gt; τένις).</div>
        </div>
        <p className="pt-1">
          Άρα, το μικρό μαύρο κομμάτι αντιστοιχεί στο <strong>Τένις</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 18,
    officialNumber: 43,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Για 800 γραμμάρια καφέ πληρώσαμε μαζί με τα μεταφορικά 17€, ενώ για 500 γραμμάρια καφέ πληρώσαμε 11€. Αν το κόστος μεταφοράς είναι σταθερό, πόσο θα πληρώσουμε για 300 γραμμάρια καφέ μαζί με τα μεταφορικά;',
    options: [
      { key: 'A', label: '6€', raw: '6€' },
      { key: 'B', label: '6,5€', raw: '6,5€' },
      { key: 'Γ', label: '7€', raw: '7€' },
      { key: 'Δ', label: '7,5€', raw: '7,5€' }
    ],
    correctRaw: '7€',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Η διαφορά στα δύο ποσά οφείλεται αποκλειστικά στα επιπλέον 300 γρ. καφέ:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          800γρ － 500γρ ＝ 300γρ καφέ κοστίζουν: 17€ － 11€ ＝ <strong>6€</strong> (χωρίς μεταφορικά).
        </div>
        <p>
          2. Βρίσκουμε το σταθερό κόστος των μεταφορικών:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• 100γρ καφέ ＝ 6€ : 3 ＝ 2€</div>
          <div>• 500γρ καφέ σκέτα ＝ 5 · 2€ ＝ 10€</div>
          <div>• Μεταφορικά ＝ 11€ － 10€ ＝ <strong>1€</strong></div>
        </div>
        <p>
          3. Για 300 γραμμάρια καφέ μαζί με τα μεταφορικά:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Σύνολο ＝ 6€ (καφές) ＋ 1€ (μεταφορικά) ＝ <strong className="text-emerald-700 text-base">7€</strong>
        </div>
        <p className="pt-1">
          Επομένως, θα πληρώσουμε <strong>7€</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 19,
    officialNumber: 44,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Τα παιδιά του ΣΤ1 χωρίστηκαν σε πεντάδες και περίσσεψαν 2 παιδιά. Την ίδια ημέρα, τα παιδιά των τμημάτων ΣΤ1 και ΣΤ2 μαζί χωρίστηκαν σε πεντάδες και δεν περίσσεψε κανένα παιδί. Στη συνέχεια, χωρίστηκαν σε πεντάδες τα παιδιά του ΣΤ2. Πόσα περίσσεψαν;',
    options: [
      { key: 'A', label: 'Κανένα', raw: 'Κανένα' },
      { key: 'B', label: '5', raw: '5' },
      { key: 'Γ', label: '2', raw: '2' },
      { key: 'Δ', label: '3', raw: '3' }
    ],
    correctRaw: '3',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Αναλύουμε τα υπόλοιπα της διαίρεσης με το 5:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Παιδιά ΣΤ1 ＝ (πολλαπλάσιο του 5) ＋ <strong>2</strong></div>
          <div>• Παιδιά ΣΤ1 ＋ ΣΤ2 ＝ (πολλαπλάσιο του 5) ＋ <strong>0</strong></div>
        </div>
        <p>
          Για να συμπληρωθεί ακέραια πεντάδα από το άθροισμα, τα 2 παιδιά του ΣΤ1 πρέπει να ενωθούν με τα υπολειπόμενα παιδιά του ΣΤ2:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          2 ＋ Υπόλοιπο(ΣΤ2) ＝ 5 ➔ Υπόλοιπο(ΣΤ2) ＝ 5 － 2 ＝ <strong className="text-emerald-700 text-base">3 παιδιά</strong>
        </div>
        <p className="pt-1">
          Άρα, στο ΣΤ2 περίσσεψαν <strong>3</strong> παιδιά (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 20,
    officialNumber: 45,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Σκέφτηκα έναν αριθμό. Σε αυτόν πρόσθεσα 3. Διαίρεσα το άθροισμα που βρήκα με 2. Από το αποτέλεσμα της διαίρεσης αφαίρεσα 1 και βρήκα 10. Ποιον αριθμό σκέφτηκα στην αρχή;',
    options: [
      { key: 'A', label: '15', raw: '15' },
      { key: 'B', label: '19', raw: '19' },
      { key: 'Γ', label: '21', raw: '21' },
      { key: 'Δ', label: '25', raw: '25' }
    ],
    correctRaw: '19',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εκτελούμε τις αντίστροφες πράξεις από το τέλος προς την αρχή:
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>1. Τελικό αποτέλεσμα: <strong>10</strong></div>
          <div>2. Αντίστροφο της αφαίρεσης 1: 10 ＋ 1 ＝ <strong>11</strong></div>
          <div>3. Αντίστροφο της διαίρεσης με 2: 11 · 2 ＝ <strong>22</strong></div>
          <div>4. Αντίστροφο της πρόσθεσης 3: 22 － 3 ＝ <strong className="text-emerald-700 text-base">19</strong></div>
        </div>
        <p className="pt-1">
          Συνεπώς, ο αρχικός αριθμός ήταν το <strong>19</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 21,
    officialNumber: 46,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Μία εταιρεία συσκευάζει τα στυλό σε πακέτα: 5 μπλε, 3 μαύρα και 2 κόκκινα το καθένα. Συνολικά, στα πακέτα που πήρε ένας βιβλιοπώλης, τα μπλε στυλό ήταν 60 περισσότερα από τα κόκκινα. Πόσα περισσότερα ήταν συνολικά τα μπλε από τα μαύρα;',
    options: [
      { key: 'A', label: '180', raw: '180' },
      { key: 'B', label: '120', raw: '120' },
      { key: 'Γ', label: '40', raw: '40' },
      { key: 'Δ', label: '20', raw: '20' }
    ],
    correctRaw: '40',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Σε <strong>κάθε 1 πακέτο</strong> περιέχονται:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Διαφορά Μπλε με Κόκκινα: 5 － 2 ＝ <strong>3 στυλό ανά πακέτο</strong></div>
          <div>• Διαφορά Μπλε με Μαύρα: 5 － 3 ＝ <strong>2 στυλό ανά πακέτο</strong></div>
        </div>
        <p>
          Επειδή συνολικά τα μπλε ήταν 60 περισσότερα από τα κόκκινα, τα πακέτα ήταν:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          60 : 3 ＝ <strong>20 πακέτα</strong>
        </div>
        <p>
          Άρα, τα μπλε ήταν περισσότερα από τα μαύρα κατά:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          20 πακέτα · 2 στυλό/πακέτο ＝ <strong className="text-emerald-700 text-base">40 στυλό</strong>
        </div>
        <p className="pt-1">
          Επομένως, ήταν <strong>40</strong> περισσότερα (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 22,
    officialNumber: 47,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Έχουμε τρία ίδια ποτήρια με νερό. Αρχικά, το 1ο ποτήρι είναι γεμάτο κατά τα <Fraction num="5" den="8" /> και το 3ο κατά το <Fraction num="1" den="2" />. Με όλο το νερό από το 3ο ποτήρι γεμίζουμε τελείως το 1ο και 2ο ποτήρι. Τι μέρος του 2ου ποτηριού ήταν γεμάτο αρχικά;
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="1" den="2" />, raw: '1/2' },
      { key: 'B', label: <Fraction num="3" den="8" />, raw: '3/8' },
      { key: 'Γ', label: <Fraction num="7" den="8" />, raw: '7/8' },
      { key: 'Δ', label: <Fraction num="1" den="8" />, raw: '1/8' }
    ],
    correctRaw: '7/8',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Για να γεμίσει τελείως το 1ο ποτήρι χρειάζεται ακόμα:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <span>1 －</span>
          <Fraction num="5" den="8" />
          <span>＝</span>
          <Fraction num="3" den="8" />
          <span>νερού.</span>
        </div>
        <p>
          2. Το 3ο ποτήρι είχε αρχικά <Fraction num="1" den="2" /> ＝ <Fraction num="4" den="8" /> νερό. Αφού δώσει <Fraction num="3" den="8" /> στο 1ο ποτήρι, περισσεύει για το 2ο ποτήρι:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <Fraction num="4" den="8" />
          <span>－</span>
          <Fraction num="3" den="8" />
          <span>＝</span>
          <Fraction num="1" den="8" />
          <span>νερού.</span>
        </div>
        <p>
          3. Με αυτό το <Fraction num="1" den="8" /> το 2ο ποτήρι γέμισε τελείως (έφτασε στο 1 ＝ 8/8). Άρα αρχικά περιείχε:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <Fraction num="8" den="8" />
          <span>－</span>
          <Fraction num="1" den="8" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="7" den="8" /></strong>
        </div>
        <p className="pt-1">
          Συνεπώς, αρχικά ήταν γεμάτο κατά τα <strong><Fraction num="7" den="8" /></strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 23,
    officialNumber: 48,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Το 60% των μαθητών πήγαν σε νησί. Από αυτούς που δεν πήγαν σε νησί, οι μισοί πήγαν στη Θεσσαλονίκη. Αν αυτοί που πήγαν στην Καλαμάτα και στην Πάτρα ήταν συνολικά 30, τότε πόσοι ήταν όλοι οι μαθητές που απάντησαν στην ερώτηση;',
    options: [
      { key: 'A', label: '75', raw: '75' },
      { key: 'B', label: '150', raw: '150' },
      { key: 'Γ', label: '50', raw: '50' },
      { key: 'Δ', label: '300', raw: '300' }
    ],
    correctRaw: '150',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Αυτοί που <strong>δεν πήγαν σε νησί</strong> είναι: 100% － 60% ＝ <strong>40%</strong>.
        </p>
        <p>
          2. Οι μισοί από αυτούς (40% : 2 ＝ 20%) πήγαν στη Θεσσαλονίκη.
        </p>
        <p>
          3. Το υπόλοιπο <strong>20%</strong> των μαθητών πήγαν στην Καλαμάτα και στην Πάτρα.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Το 20% του συνόλου είναι 30 μαθητές.</div>
          <div>• Το 100% (όλοι οι μαθητές) είναι: 30 · 5 ＝ <strong className="text-emerald-700 text-base">150 μαθητές</strong></div>
        </div>
        <p className="pt-1">
          Άρα, όλοι οι μαθητές ήταν <strong>150</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 24,
    officialNumber: 49,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Μία μακαρονάδα και μία σαλάτα κοστίζουν 13€. Μία σούπα και μία σαλάτα κοστίζουν 10€. Η οικογένεια της Χρύσας πλήρωσε 30€, αλλά ο σερβιτόρος έκανε λάθος και τους χρέωσε τη μία σούπα όσο τη μακαρονάδα. Πόσο είναι το ποσό που θα έπρεπε να πληρώσουν κανονικά;',
    options: [
      { key: 'A', label: '27', raw: '27' },
      { key: 'B', label: '33', raw: '33' },
      { key: 'Γ', label: '23', raw: '23' },
      { key: 'Δ', label: 'Δεν μπορούμε να το υπολογίσουμε', raw: 'none' }
    ],
    correctRaw: '27',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Συγκρίνουμε τις δύο παραγγελίες:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Μακαρονάδα ＋ Σαλάτα ＝ 13 €</div>
          <div>• Σούπα ＋ Σαλάτα ＝ 10 €</div>
          <div className="pt-1 font-bold text-slate-800">
            ➔ Μακαρονάδα － Σούπα ＝ 13 － 10 ＝ 3 € (η μακαρονάδα είναι 3€ ακριβότερη από τη σούπα).
          </div>
        </div>
        <p>
          Επειδή ο σερβιτόρος χρέωσε τη σούπα ως μακαρονάδα, υπερχρέωσε τον λογαριασμό κατά <strong>3 €</strong>:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Κανονικό ποσό ＝ 30 € － 3 € ＝ <strong className="text-emerald-700 text-base">27 €</strong>
        </div>
        <p className="pt-1">
          Επομένως, κανονικά θα έπρεπε να πληρώσουν <strong>27 €</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 25,
    officialNumber: 50,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Η Χριστίνα ακολουθεί εβδομαδιαίο πρόγραμμα κολύμβησης: Δευ: 2χμ, Τρ: 1χμ, Τετ: 1χμ, Πεμ: 2χμ, Παρ: 3χμ, Σαβ: 4χμ, Κυρ: 3χμ. Αν σε 50 ημέρες έχει κολυμπήσει συνολικά 116 χιλιόμετρα, πόσα χιλιόμετρα θα κολυμπήσει τις επόμενες 50 μέρες;',
    options: [
      { key: 'A', label: '115', raw: '115' },
      { key: 'B', label: '116', raw: '116' },
      { key: 'Γ', label: '117', raw: '117' },
      { key: 'Δ', label: '232', raw: '232' }
    ],
    correctRaw: '116',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. <strong>Χιλιόμετρα μίας πλήρους εβδομάδας (7 ημέρες):</strong>
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          2 ＋ 1 ＋ 1 ＋ 2 ＋ 3 ＋ 4 ＋ 3 ＝ <strong>16 χιλιόμετρα ανά εβδομάδα</strong>
        </div>
        <p>
          2. Ανάλυση των 50 ημερών σε εβδομάδες:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>50 ＝ 7 · 7 ＋ <strong>1 ημέρα</strong> (7 πλήρεις εβδομάδες και 1 επιπλέον ημέρα)</div>
          <div>• Οι 7 πλήρεις εβδομάδες δίνουν: 7 · 16 ＝ 112 χλμ.</div>
          <div>• Η 1 επιπλέον ημέρα έδωσε: 116 － 112 ＝ <strong>4 χλμ</strong> (άρα ξεκίνησε ημέρα Σάββατο!).</div>
        </div>
        <p>
          3. <strong>Οι επόμενες 50 ημέρες:</strong><br />
          Θα περιλαμβάνουν ξανά 7 πλήρεις εβδομάδες (112 χλμ) συν την 51η ημέρα της δεύτερης περιόδου, η οποία έχει το ίδιο μοτίβο και αποδίδει πάλι <strong>116 χιλιόμετρα</strong>.
        </p>
        <p className="pt-1">
          Άρα, θα κολυμπήσει <strong>116</strong> χιλιόμετρα (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  }
];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function Themata2023Page() {
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
    QUESTIONS_2023.forEach((q) => {
      if (currentAnswers[q.id] === q.correctRaw) {
        s += 2; // 2 μόρια ανά θέμα = 50 μόρια άριστα
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

  const correctCount = QUESTIONS_2023.filter(
    q => answers[q.id] === q.correctRaw
  ).length;

  const renderQuestionVisual = (q) => {
    if (q.hasSvg === 'pattern28') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="460" height="60" viewBox="0 0 460 60" className="select-none">
            {/* 1η Τετράδα */}
            {/* Ορθογώνιο */}
            <rect x="10" y="16" width="34" height="24" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />
            {/* Κύκλος */}
            <circle cx="72" cy="28" r="14" fill="none" stroke="#000000" strokeWidth="2.5" />
            {/* Τρίγωνο */}
            <polygon points="118,12 105,42 131,42" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Τετράγωνο */}
            <rect x="150" y="16" width="26" height="26" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />

            {/* 2η Τετράδα */}
            {/* Ορθογώνιο */}
            <rect x="196" y="16" width="34" height="24" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />
            {/* Κύκλος */}
            <circle cx="258" cy="28" r="14" fill="none" stroke="#000000" strokeWidth="2.5" />
            {/* Τρίγωνο */}
            <polygon points="304,12 291,42 317,42" fill="none" stroke="#000000" strokeWidth="2.5" strokeLinejoin="round" />
            {/* Τετράγωνο */}
            <rect x="336" y="16" width="26" height="26" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />

            {/* 3η Τετράδα (απόσπασμα & αποσιωπητικά) */}
            {/* Ορθογώνιο */}
            <rect x="382" y="16" width="34" height="24" fill="none" stroke="#000000" strokeWidth="2.5" rx="1" />
            {/* Αποσιωπητικά */}
            <circle cx="430" cy="30" r="3" fill="#000000" />
            <circle cx="440" cy="30" r="3" fill="#000000" />
            <circle cx="450" cy="30" r="3" fill="#000000" />
          </svg>
        </div>
      );
    }
    
    if (q.hasSvg === 'axis34') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="380" height="90" viewBox="0 0 380 90" className="select-none font-mono">
            <line x1="20" y1="45" x2="350" y2="45" stroke="#334155" strokeWidth="2" />
            <polygon points="350,40 360,45 350,50" fill="#334155" />
            {/* a */}
            <line x1="60" y1="37" x2="60" y2="53" stroke="#2563eb" strokeWidth="2" />
            <text x="60" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#2563eb">α</text>
            {/* 5/3 */}
            <line x1="180" y1="37" x2="180" y2="53" stroke="#16a34a" strokeWidth="2" />
            <text x="180" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#16a34a">5/3</text>
            {/* 9/4 */}
            <line x1="300" y1="37" x2="300" y2="53" stroke="#dc2626" strokeWidth="2" />
            <text x="300" y="70" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#dc2626">9/4</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'gridMap37') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="260" height="260" viewBox="0 0 260 260" className="select-none font-sans">
            {/* Κάνναβος 10x10 */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <g key={i}>
                <line x1={20 + i * 22} y1="20" x2={20 + i * 22} y2="240" stroke="#e2e8f0" strokeWidth="1.5" />
                <line x1="20" y1={20 + i * 22} x2="240" y2={20 + i * 22} stroke="#e2e8f0" strokeWidth="1.5" />
              </g>
            ))}
            {/* Σημείο Ο */}
            <circle cx="42" cy="152" r="4.5" fill="#0f172a" />
            <text x="30" y="146" fontSize="11" fontWeight="bold" fill="#0f172a">Ο</text>
            <line x1="42" y1="152" x2="75" y2="152" stroke="#0f172a" strokeWidth="2.5" />
            <polygon points="75,148 83,152 75,156" fill="#0f172a" />

            {/* Σημείο Α */}
            <circle cx="174" cy="108" r="4.5" fill="#2563eb" />
            <text x="165" y="100" fontSize="11" fontWeight="bold" fill="#2563eb">Α</text>

            {/* Σημείο Β */}
            <circle cx="174" cy="196" r="4.5" fill="#0f172a" />
            <text x="165" y="212" fontSize="11" fontWeight="bold" fill="#0f172a">Β</text>

            {/* Σημείο Γ */}
            <circle cx="218" cy="42" r="4.5" fill="#0f172a" />
            <text x="210" y="34" fontSize="11" fontWeight="bold" fill="#0f172a">Γ</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'ellipse38') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="260" height="170" viewBox="0 0 260 170" className="select-none">
            {/* Πλέγμα */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
              <line key={`v-${i}`} x1={20 + i * 22} y1="15" x2={20 + i * 22} y2="155" stroke="#cbd5e1" strokeWidth="1" />
            ))}
            {[0, 1, 2, 3, 4, 5, 6].map(i => (
              <line key={`h-${i}`} x1="15" y1={25 + i * 20} x2="245" y2={25 + i * 20} stroke="#cbd5e1" strokeWidth="1" />
            ))}
            {/* Έλλειψη */}
            <ellipse cx="130" cy="85" rx="110" ry="60" fill="#334155" opacity="0.95" />
          </svg>
        </div>
      );
    }

    if (q.hasTable === 'busTable39') {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3">
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
              <thead>
                <tr className="bg-slate-200/80 text-slate-800 font-black">
                  <th colSpan="2" className="p-2 border-b border-slate-200">Αθήνα - Πύργος (Απευθείας)</th>
                </tr>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-1.5">Αναχώρηση</th>
                  <th className="p-1.5">Διάρκεια</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100"><td className="p-1.5 font-mono">07:30</td><td className="p-1.5">3ω και 45λ</td></tr>
                <tr className="border-b border-slate-100"><td className="p-1.5 font-mono font-bold text-blue-700">08:30</td><td className="p-1.5">3ω και 50λ</td></tr>
                <tr className="border-b border-slate-100"><td className="p-1.5 font-mono">12:15</td><td className="p-1.5">3ω και 50λ</td></tr>
                <tr className="border-b border-slate-100"><td className="p-1.5 font-mono">14:00</td><td className="p-1.5">3ω και 50λ</td></tr>
                <tr><td className="p-1.5 font-mono">17:00</td><td className="p-1.5">3ω και 45λ</td></tr>
              </tbody>
            </table>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
              <thead>
                <tr className="bg-slate-200/80 text-slate-800 font-black">
                  <th colSpan="2" className="p-2 border-b border-slate-200">Αθήνα - Πάτρα</th>
                  <th colSpan="2" className="p-2 border-b border-slate-200 bg-slate-300/80">Πάτρα - Πύργος</th>
                </tr>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-1.5">Αναχ.</th>
                  <th className="p-1.5">Διάρκ.</th>
                  <th className="p-1.5 bg-slate-200/70">Αναχ.</th>
                  <th className="p-1.5 bg-slate-200/70">Διάρκ.</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100"><td className="p-1.5 font-mono">08:00</td><td className="p-1.5">2ω 45λ</td><td className="p-1.5 font-mono">07:00</td><td className="p-1.5">70λ</td></tr>
                <tr className="border-b border-slate-100"><td className="p-1.5 font-mono">09:30</td><td className="p-1.5">2ω 50λ</td><td className="p-1.5 font-mono">10:30</td><td className="p-1.5">70λ</td></tr>
                <tr className="border-b border-slate-100 bg-emerald-50"><td className="p-1.5 font-mono font-bold text-emerald-800">11:00</td><td className="p-1.5 font-bold text-emerald-800">2ω 50λ</td><td className="p-1.5 font-mono font-bold text-emerald-800">14:15</td><td className="p-1.5 font-bold text-emerald-800">70λ</td></tr>
                <tr className="border-b border-slate-100"><td className="p-1.5 font-mono">13:30</td><td className="p-1.5">2ω 50λ</td><td className="p-1.5 font-mono">21:00</td><td className="p-1.5">70λ</td></tr>
                <tr><td className="p-1.5 font-mono">18:30</td><td className="p-1.5">2ω 45λ</td><td className="p-1.5 font-mono">-</td><td className="p-1.5">-</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (q.hasSvg === 'parks40') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="360" height="110" viewBox="0 0 360 110" className="select-none font-sans">
            {/* 1ο σχέδιο */}
            <g transform="translate(10, 10)">
              <rect x="0" y="0" width="100" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="18" y="22" width="82" height="48" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
              <text x="50" y="88" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">1ο σχέδιο</text>
            </g>
            {/* 2ο σχέδιο */}
            <g transform="translate(130, 10)">
              <rect x="0" y="0" width="100" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="0" y="0" width="41" height="25" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
              <rect x="59" y="0" width="41" height="25" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
              <rect x="0" y="45" width="41" height="25" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
              <rect x="59" y="45" width="41" height="25" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
              <text x="50" y="88" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">2ο σχέδιο</text>
            </g>
            {/* 3ο σχέδιο */}
            <g transform="translate(250, 10)">
              <rect x="0" y="0" width="100" height="70" fill="#ffffff" stroke="#0f172a" strokeWidth="1.5" />
              <rect x="0" y="0" width="38" height="48" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
              <rect x="56" y="0" width="44" height="48" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
              <text x="50" y="88" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#475569">3ο σχέδιο</text>
            </g>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'pieChart42') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="180" height="180" viewBox="0 0 180 180" className="select-none">
            {/* Κυκλικό διάγραμμα */}
            <circle cx="90" cy="90" r="75" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <line x1="15" y1="90" x2="90" y2="90" stroke="#0f172a" strokeWidth="2" />
            <line x1="90" y1="15" x2="90" y2="165" stroke="#0f172a" strokeWidth="2" />
            {/* Μαύρος τομέας (Τένις) */}
            <path d="M 90,90 L 90,15 A 75,75 0 0,1 143,37 Z" fill="#0f172a" />
            <line x1="90" y1="90" x2="143" y2="37" stroke="#0f172a" strokeWidth="2" />
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title="🏛️ Πραγματικά Θέματα 2023 - Πρότυπα Σχολεία | LearnMaths.gr"
      description="Επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία 2023: 25 θέματα Μαθηματικών (026–050), 2 μόρια ανά θέμα (Άριστα: 50 μόρια), χρονόμετρο και αναλυτικές λύσεις."
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
                Επίσημα Θέματα 2023 • 25 Ερωτήσεις Μαθηματικών
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Εξετάσεις Προτύπων 2023
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
              Αποτέλεσμα Εξέτασης 2023
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
          {QUESTIONS_2023.map((q) => {
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
