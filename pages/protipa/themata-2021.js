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

const QUESTIONS_2021 = [
  {
    id: 1,
    officialNumber: 26,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: (
      <span className="inline-flex items-center gap-1 font-mono text-base">
        <Fraction num="2" den="8" /> ＋ <Fraction num="3" den="8" /> ＝
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="5" den="16" />, raw: '5/16' },
      { key: 'B', label: <Fraction num="5" den="8" />, raw: '5/8' },
      { key: 'Γ', label: <Fraction num="6" den="64" />, raw: '6/64' },
      { key: 'Δ', label: <Fraction num="6" den="8" />, raw: '6/8' }
    ],
    correctRaw: '5/8',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Τα κλάσματα είναι ομώνυμα, οπότε προσθέτουμε τους αριθμητές και διατηρούμε τον ίδιο παρονομαστή:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="2" den="8" />
          <span>＋</span>
          <Fraction num="3" den="8" />
          <span>＝</span>
          <Fraction num="2 ＋ 3" den="8" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="5" den="8" /></strong>
        </div>
        <p className="pt-1">
          Επομένως, το αποτέλεσμα είναι <strong><Fraction num="5" den="8" /></strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 2,
    officialNumber: 27,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: '8 ＋ 20 : 2² － 2 ＝',
    options: [
      { key: 'A', label: '5', raw: '5' },
      { key: 'B', label: '11', raw: '11' },
      { key: 'Γ', label: '14', raw: '14' },
      { key: 'Δ', label: '18', raw: '18' }
    ],
    correctRaw: '11',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Τηρούμε αυστηρά την προτεραιότητα των πράξεων (δυνάμεις ➔ διαιρέσεις ➔ προσθέσεις/αφαιρέσεις):
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>1. Δύναμη: 2² ＝ 4</div>
          <div>2. Διαίρεση: 20 : 4 ＝ 5</div>
          <div>3. Πράξεις από αριστερά προς τα δεξιά: 8 ＋ 5 － 2 ＝ 13 － 2 ＝ <strong className="text-emerald-700 text-base">11</strong></div>
        </div>
        <p className="pt-1">
          Άρα, το αποτέλεσμα είναι <strong>11</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 3,
    officialNumber: 28,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Η περίμετρος τετραγώνου με εμβαδό 36 τετραγωνικά μέτρα είναι:',
    options: [
      { key: 'A', label: '6 μέτρα', raw: '6 μέτρα' },
      { key: 'B', label: '24 μέτρα', raw: '24 μέτρα' },
      { key: 'Γ', label: '36 μέτρα', raw: '36 μέτρα' },
      { key: 'Δ', label: '144 μέτρα', raw: '144 μέτρα' }
    ],
    correctRaw: '24 μέτρα',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Το εμβαδόν του τετραγώνου δίνεται από τον τύπο Ε ＝ α². Βρίσκουμε την πλευρά α:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          α ＝ √36 ＝ <strong>6 μέτρα</strong>
        </div>
        <p>
          2. Η περίμετρος ενός τετραγώνου ισούται με 4 φορές την πλευρά του:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Π ＝ 4 · α ＝ 4 · 6 ＝ <strong className="text-emerald-700 text-base">24 μέτρα</strong>
        </div>
        <p className="pt-1">
          Επομένως, η περίμετρος είναι <strong>24 μέτρα</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 4,
    officialNumber: 29,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Αν στο διπλάσιο ενός αριθμού προσθέσω το μισό του ίδιου αριθμού βρίσκω 8. Ποιος είναι ο αριθμός;',
    options: [
      { key: 'A', label: '25', raw: '25' },
      { key: 'B', label: '3,2', raw: '3,2' },
      { key: 'Γ', label: '12', raw: '12' },
      { key: 'Δ', label: '3,5', raw: '3,5' }
    ],
    correctRaw: '3,2',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω <strong>x</strong> ο ζητούμενος αριθμός. Σύμφωνα με την εκφώνηση:
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div className="flex items-center gap-1 flex-wrap">
            <span>2 · x ＋</span>
            <Fraction num="x" den="2" />
            <span>＝ 8</span>
          </div>
          <div>2x ＋ 0,5x ＝ 8</div>
          <div>2,5 · x ＝ 8</div>
          <div>x ＝ 8 : 2,5 ＝ 80 : 25 ➔ <strong className="text-emerald-700 text-base">x ＝ 3,2</strong></div>
        </div>
        <p className="pt-1">
          Άρα, ο αριθμός είναι το <strong>3,2</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 5,
    officialNumber: 30,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Τα 30% του 20% των 1.200 ευρώ είναι:',
    options: [
      { key: 'A', label: '72 ευρώ', raw: '72 ευρώ' },
      { key: 'B', label: '240 ευρώ', raw: '240 ευρώ' },
      { key: 'Γ', label: '360 ευρώ', raw: '360 ευρώ' },
      { key: 'Δ', label: '600 ευρώ', raw: '600 ευρώ' }
    ],
    correctRaw: '72 ευρώ',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Υπολογίζουμε διαδοχικά ή πολλαπλασιάζουμε τα ποσοστά:
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-2">
          <div>• 20% των 1.200 € ＝ 0,20 · 1.200 ＝ <strong>240 €</strong></div>
          <div>• 30% των 240 € ＝ 0,30 · 240 ＝ <strong className="text-emerald-700 text-base">72 €</strong></div>
        </div>
        <p className="pt-1">
          Επομένως, το ποσό είναι <strong>72 ευρώ</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 6,
    officialNumber: 31,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Στην εξίσωση x · (3² : 3) = 30, βρείτε το x:',
    options: [
      { key: 'A', label: 'x = 15', raw: 'x = 15' },
      { key: 'B', label: 'x = 8', raw: 'x = 8' },
      { key: 'Γ', label: 'x = 10', raw: 'x = 10' },
      { key: 'Δ', label: 'x = 1', raw: 'x = 1' }
    ],
    correctRaw: 'x = 10',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εκτελούμε πρώτα τις πράξεις μέσα στην παρένθεση:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>3² : 3 ＝ 9 : 3 ＝ 3</div>
          <div>Η εξίσωση γίνεται: x · 3 ＝ 30</div>
          <div>x ＝ 30 : 3 ➔ <strong className="text-emerald-700 text-base">x ＝ 10</strong></div>
        </div>
        <p className="pt-1">
          Άρα, <strong>x = 10</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 7,
    officialNumber: 32,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Το 25% των παιδιών του σχολείου παίζει βόλεϊ. Τα παιδιά του σχολείου που δεν παίζουν βόλεϊ είναι 180. Πόσα παιδιά έχει το σχολείο;',
    options: [
      { key: 'A', label: '240', raw: '240' },
      { key: 'B', label: '225', raw: '225' },
      { key: 'Γ', label: '135', raw: '135' },
      { key: 'Δ', label: '250', raw: '250' }
    ],
    correctRaw: '240',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Τα παιδιά που δεν παίζουν βόλεϊ αντιστοιχούν σε ποσοστό:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          100% － 25% ＝ <strong>75%</strong> του σχολείου.
        </div>
        <p>
          2. Το 75% (δηλαδή τα 3/4) είναι 180 παιδιά:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Το 25% (το 1/4) είναι: 180 : 3 ＝ 60 παιδιά.</div>
          <div>• Όλο το σχολείο (100%): 60 · 4 ＝ <strong className="text-emerald-700 text-base">240 παιδιά</strong>.</div>
        </div>
        <p className="pt-1">
          Συνεπώς, το σχολείο έχει <strong>240</strong> παιδιά (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 8,
    officialNumber: 33,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ποιος από τους παρακάτω αριθμούς είναι πιο κοντά στο 9;',
    options: [
      { key: 'A', label: '9,9', raw: '9,9' },
      { key: 'B', label: '9,99', raw: '9,99' },
      { key: 'Γ', label: '10,009', raw: '10,009' },
      { key: 'Δ', label: '10,01', raw: '10,01' }
    ],
    correctRaw: '9,9',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Υπολογίζουμε την απόσταση κάθε αριθμού από το 9 με αφαίρεση:
        </p>
        <div className="space-y-1 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• 9,9 － 9 ＝ <strong className="text-emerald-700">0,9</strong></div>
          <div>• 9,99 － 9 ＝ 0,99</div>
          <div>• 10,009 － 9 ＝ 1,009</div>
          <div>• 10,01 － 9 ＝ 1,01</div>
        </div>
        <p className="pt-1">
          Η μικρότερη διαφορά είναι το 0,9, άρα ο πιο κοντινός αριθμός είναι το <strong>9,9</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 9,
    officialNumber: 34,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Το άθροισμα δύο γωνιών ενός τριγώνου είναι 130°. Το τρίγωνο δεν μπορεί να είναι:',
    options: [
      { key: 'A', label: 'Ισόπλευρο', raw: 'Ισόπλευρο' },
      { key: 'B', label: 'Ισοσκελές', raw: 'Ισοσκελές' },
      { key: 'Γ', label: 'Οξυγώνιο', raw: 'Οξυγώνιο' },
      { key: 'Δ', label: 'Ορθογώνιο', raw: 'Ορθογώνιο' }
    ],
    correctRaw: 'Ισόπλευρο',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Το άθροισμα των γωνιών κάθε τριγώνου είναι 180°. Άρα η τρίτη γωνία ισούται με:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          180° － 130° ＝ <strong>50°</strong>
        </div>
        <p>
          Σε ένα <strong>ισόπλευρο τρίγωνο</strong> όλες οι γωνίες είναι υποχρεωτικά ίσες με <strong>60°</strong> (και κάθε άθροισμα δύο γωνιών θα έπρεπε να είναι 120°). Επομένως, το τρίγωνο δεν μπορεί να είναι ισόπλευρο.
        </p>
        <p className="pt-1 font-bold text-emerald-800">
          Επιλογή A: Ισόπλευρο.
        </p>
      </div>
    )
  },
  {
    id: 10,
    officialNumber: 35,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Σε έναν αγώνα μπάσκετ ένας παίκτης έβαλε τόσα δίποντα όσα και τρίποντα και δεν έβαλε κανένα άλλο καλάθι εκτός από αυτά. Τι μέρος των συνολικών πόντων που έβαλε ο παίκτης ήταν οι πόντοι που έβαλε με τρίποντα;',
    options: [
      { key: 'A', label: <Fraction num="2" den="3" />, raw: '2/3' },
      { key: 'B', label: <Fraction num="1" den="2" />, raw: '1/2' },
      { key: 'Γ', label: <Fraction num="2" den="5" />, raw: '2/5' },
      { key: 'Δ', label: <Fraction num="3" den="5" />, raw: '3/5' }
    ],
    correctRaw: '3/5',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω ότι έβαλε <strong>x</strong> δίποντα και <strong>x</strong> τρίποντα:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Πόντοι από δίποντα: 2 · x</div>
          <div>• Πόντοι από τρίποντα: 3 · x</div>
          <div>• Συνολικοί πόντοι: 2x ＋ 3x ＝ <strong>5x</strong></div>
        </div>
        <p>
          Το κλάσμα των πόντων από τρίποντα προς το σύνολο είναι:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="3x" den="5x" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="3" den="5" /></strong>
        </div>
        <p className="pt-1">
          Άρα, ήταν τα <strong><Fraction num="3" den="5" /></strong> των συνολικών πόντων (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 11,
    officialNumber: 36,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Είχα τα διπλάσια χρήματα από τον Άκη. Έδωσε ο καθένας μας τα μισά του χρήματα και αγοράσαμε μια φουσκωτή βάρκα που κόστισε 52,50 ευρώ. Πόσα χρήματα είχα;',
    options: [
      { key: 'A', label: '35 ευρώ', raw: '35 ευρώ' },
      { key: 'B', label: '52,50 ευρώ', raw: '52,50 ευρώ' },
      { key: 'Γ', label: '70 ευρώ', raw: '70 ευρώ' },
      { key: 'Δ', label: '105 ευρώ', raw: '105 ευρώ' }
    ],
    correctRaw: '70 ευρώ',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω <strong>x</strong> τα χρήματα του Άκη. Τότε εγώ είχα <strong>2x</strong> χρήματα.
        </p>
        <p>
          Δώσαμε τα μισά μας χρήματα για τη βάρκα:
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Ο Άκης έδωσε: x / 2</div>
          <div>• Εγώ έδωσα: 2x / 2 ＝ x</div>
          <div>• Συνολικό κόστος: x ＋ x/2 ＝ 1,5 · x ＝ 52,50 €</div>
          <div>• x ＝ 52,50 : 1,5 ＝ <strong>35 €</strong> (χρήματα Άκη)</div>
        </div>
        <p>
          Εγώ είχα τα διπλάσια:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          2 · 35 € ＝ <strong className="text-emerald-700 text-base">70 ευρώ</strong>
        </div>
        <p className="pt-1">
          Επομένως, είχα <strong>70 ευρώ</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 12,
    officialNumber: 37,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ο μέσος όρος των βαθμών της Άρτεμις σε πέντε διαγωνίσματα Γεωγραφίας ήταν 85. Το άθροισμα των βαθμών της στα πέντε διαγωνίσματα ήταν:',
    options: [
      { key: 'A', label: '95', raw: '95' },
      { key: 'B', label: '100', raw: '100' },
      { key: 'Γ', label: '425', raw: '425' },
      { key: 'Δ', label: '495', raw: '495' }
    ],
    correctRaw: '425',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Ο μέσος όρος ισούται με το άθροισμα δια του πλήθους των διαγωνισμάτων:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>Άθροισμα ＝ Μέσος Όρος · Πλήθος</div>
          <div>Άθροισμα ＝ 85 · 5 ＝ <strong className="text-emerald-700 text-base">425</strong></div>
        </div>
        <p className="pt-1">
          Άρα, το άθροισμα των βαθμών ήταν <strong>425</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 13,
    officialNumber: 38,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span className="inline-flex items-center flex-wrap">
        Ο αντίστροφος του αριθμού που προκύπτει από την αφαίρεση &nbsp;
        <Fraction num="1" den="8" /> － <Fraction num="1" den="9" /> &nbsp; είναι ο αριθμός:
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="1" den="17" />, raw: '1/17' },
      { key: 'B', label: '72', raw: '72' },
      { key: 'Γ', label: '17', raw: '17' },
      { key: 'Δ', label: <Fraction num="1" den="72" />, raw: '1/72' }
    ],
    correctRaw: '72',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Κάνουμε την αφαίρεση κάνοντας τα κλάσματα ομώνυμα με ΕΚΠ(8, 9) ＝ 72:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="1" den="8" />
          <span>－</span>
          <Fraction num="1" den="9" />
          <span>＝</span>
          <Fraction num="9" den="72" />
          <span>－</span>
          <Fraction num="8" den="72" />
          <span>＝</span>
          <Fraction num="1" den="72" />
        </div>
        <p>
          2. Ο αντίστροφος του αριθμού <Fraction num="1" den="72" /> είναι το <strong>72</strong>.
        </p>
        <p className="pt-1 font-bold text-emerald-800">
          Επιλογή B: 72.
        </p>
      </div>
    )
  },
  {
    id: 14,
    officialNumber: 39,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Σε ποια σειρά οι αριθμοί είναι τοποθετημένοι σωστά;',
    options: [
      {
        key: 'A',
        label: <span className="font-mono">0,8 &gt; 0,63 &gt; <Fraction num="13" den="20" /> &gt; <Fraction num="7" den="25" /></span>,
        raw: 'A'
      },
      {
        key: 'B',
        label: <span className="font-mono">0,8 &lt; <Fraction num="7" den="25" /> &lt; 0,63 &lt; <Fraction num="13" den="20" /></span>,
        raw: 'B'
      },
      {
        key: 'Γ',
        label: <span className="font-mono"><Fraction num="7" den="25" /> &lt; 0,63 &lt; <Fraction num="13" den="20" /> &lt; 0,8</span>,
        raw: 'Γ'
      },
      {
        key: 'Δ',
        label: <span className="font-mono"><Fraction num="7" den="25" /> &gt; 0,63 &gt; <Fraction num="13" den="20" /> &gt; 0,8</span>,
        raw: 'Δ'
      }
    ],
    correctRaw: 'Γ',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Μετατρέπουμε όλους τους αριθμούς σε δεκαδική μορφή:
        </p>
        <div className="space-y-1.5 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• 7/25 ＝ 28/100 ＝ <strong>0,28</strong></div>
          <div>• <strong>0,63</strong></div>
          <div>• 13/20 ＝ 65/100 ＝ <strong>0,65</strong></div>
          <div>• <strong>0,80</strong></div>
        </div>
        <p>
          Διατάσσουμε σε αύξουσα σειρά: 0,28 &lt; 0,63 &lt; 0,65 &lt; 0,80, δηλαδή:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold flex items-center gap-1.5 flex-wrap">
          <Fraction num="7" den="25" />
          <span>&lt; 0,63 &lt;</span>
          <Fraction num="13" den="20" />
          <span>&lt; 0,8</span>
        </div>
        <p className="pt-1">
          Επομένως, σωστή είναι η σειρά <strong>Γ</strong>.
        </p>
      </div>
    )
  },
  {
    id: 15,
    officialNumber: 40,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Στην εξίσωση 400 : 8 ＋ x ＝ 125 · 2 － 100 : 2, το x είναι ίσο με:',
    options: [
      { key: 'A', label: '150', raw: '150' },
      { key: 'B', label: '400', raw: '400' },
      { key: 'Γ', label: '250', raw: '250' },
      { key: 'Δ', label: '100', raw: '100' }
    ],
    correctRaw: '150',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εκτελούμε πρώτα τους πολλαπλασιασμούς και τις διαιρέσεις σε κάθε μέλος:
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Αριστερό μέλος: 400 : 8 ＋ x ＝ <strong>50 ＋ x</strong></div>
          <div>• Δεξί μέλος: 125 · 2 － 100 : 2 ＝ 250 － 50 ＝ <strong>200</strong></div>
          <div className="pt-1">
            50 ＋ x ＝ 200 ➔ x ＝ 200 － 50 ➔ <strong className="text-emerald-700 text-base">x ＝ 150</strong>
          </div>
        </div>
        <p className="pt-1">
          Άρα, το x είναι ίσο με <strong>150</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 16,
    officialNumber: 41,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span className="inline-flex items-center flex-wrap">
        Ποιο από τα παρακάτω κλάσματα βρίσκεται ανάμεσα στο &nbsp;<Fraction num="1" den="5" /> &nbsp; και στο &nbsp;<Fraction num="2" den="3" />&nbsp;;
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="4" den="3" />, raw: '4/3' },
      { key: 'B', label: <Fraction num="9" den="15" />, raw: '9/15' },
      { key: 'Γ', label: <Fraction num="5" den="6" />, raw: '5/6' },
      { key: 'Δ', label: <Fraction num="1" den="10" />, raw: '1/10' }
    ],
    correctRaw: '9/15',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Μετατρέπουμε τα άκρα σε δεκαδικούς αριθμούς:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• 1/5 ＝ <strong>0,20</strong></div>
          <div>• 2/3 ≈ <strong>0,667</strong></div>
        </div>
        <p>
          Εξετάζουμε τις επιλογές:
        </p>
        <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• Α: 4/3 ≈ 1,33 (&gt; 0,667)</div>
          <div>• Β: 9/15 ＝ 3/5 ＝ <strong className="text-emerald-700">0,60</strong> (βρίσκεται ανάμεσα στο 0,20 και 0,667 ✅)</div>
          <div>• Γ: 5/6 ≈ 0,833 (&gt; 0,667)</div>
          <div>• Δ: 1/10 ＝ 0,10 (&lt; 0,20)</div>
        </div>
        <p className="pt-1">
          Συνεπώς, το κλάσμα είναι το <strong><Fraction num="9" den="15" /></strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 17,
    officialNumber: 42,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Η διαφορά του 900.000 από τον μικρότερο εξαψήφιο αριθμό με διαφορετικά ψηφία είναι:',
    options: [
      { key: 'A', label: '797.655', raw: '797655' },
      { key: 'B', label: '776.544', raw: '776544' },
      { key: 'Γ', label: '777.777', raw: '777777' },
      { key: 'Δ', label: '800.000', raw: '800000' }
    ],
    correctRaw: '797655',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Ο μικρότερος εξαψήφιος αριθμός με διαφορετικά ψηφία ξεκινά με 1 και συνεχίζει με τα μικρότερα δυνατά ψηφία {0, 2, 3, 4, 5}:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Μικρότερος αριθμός ＝ <strong>102.345</strong>
        </div>
        <p>
          2. Υπολογίζουμε τη διαφορά:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          900.000 － 102.345 ＝ <strong className="text-emerald-700 text-base">797.655</strong>
        </div>
        <p className="pt-1">
          Άρα, η διαφορά είναι <strong>797.655</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 18,
    officialNumber: 43,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Το άθροισμα των αριθμών των δύο τελευταίων σελίδων ενός βιβλίου είναι 155. Πόσες σελίδες έχει το βιβλίο;',
    options: [
      { key: 'A', label: '77', raw: '77' },
      { key: 'B', label: '78', raw: '78' },
      { key: 'Γ', label: '155', raw: '155' },
      { key: 'Δ', label: 'Περισσότερες από 155', raw: 'more155' }
    ],
    correctRaw: '78',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Οι δύο τελευταίες σελίδες είναι <strong>διαδοχικοί ακέραιοι αριθμοί</strong>, έστω <strong>n</strong> και <strong>n ＋ 1</strong>:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>n ＋ (n ＋ 1) ＝ 155</div>
          <div>2n ＋ 1 ＝ 155</div>
          <div>2n ＝ 154 ➔ n ＝ 77</div>
        </div>
        <p>
          Η τελευταία σελίδα του βιβλίου είναι η: n ＋ 1 ＝ 77 ＋ 1 ＝ <strong>78</strong>.
        </p>
        <p className="pt-1 font-bold text-emerald-800">
          Επομένως, το βιβλίο έχει 78 σελίδες (Επιλογή B).
        </p>
      </div>
    )
  },
  {
    id: 19,
    officialNumber: 44,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Από τους παρακάτω αριθμούς ο μικρότερος είναι:
      </span>
    ),
    options: [
      { key: 'A', label: 'Το 5% του 40', raw: 'A' },
      { key: 'B', label: 'Το 10% του 15', raw: 'B' },
      { key: 'Γ', label: <span>Τα <Fraction num="2" den="8" /> του 12</span>, raw: 'Γ' },
      { key: 'Δ', label: <span>Το <Fraction num="1" den="3" /> του διπλάσιου του 3</span>, raw: 'Δ' }
    ],
    correctRaw: 'B',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Υπολογίζουμε την τιμή κάθε επιλογής:
        </p>
        <div className="space-y-1.5 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• Α: 5% · 40 ＝ 0,05 · 40 ＝ <strong>2</strong></div>
          <div>• Β: 10% · 15 ＝ 0,10 · 15 ＝ <strong className="text-emerald-700">1,5</strong></div>
          <div>• Γ: 2/8 · 12 ＝ 1/4 · 12 ＝ <strong>3</strong></div>
          <div>• Δ: 1/3 · (2 · 3) ＝ 1/3 · 6 ＝ <strong>2</strong></div>
        </div>
        <p className="pt-1">
          Ο μικρότερος αριθμός είναι το 1,5, δηλαδή <strong>Το 10% του 15</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 20,
    officialNumber: 45,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Αγοράσαμε 7 δοχεία μπογιάς για να βάψουμε τέσσερις ίδιους τοίχους. Για να βάψουμε τον έναν χρειάστηκε το 1 <Fraction num="1" den="3" /> ενός δοχείου μπογιάς. Πόση μπογιά θα περισσέψει αν βάψουμε και τους υπόλοιπους τοίχους;
      </span>
    ),
    options: [
      { key: 'A', label: <span>5 <Fraction num="1" den="3" /></span>, raw: '5 1/3' },
      { key: 'B', label: <span>1 <Fraction num="1" den="3" /></span>, raw: '1 1/3' },
      { key: 'Γ', label: <span>1 <Fraction num="2" den="3" /></span>, raw: '1 2/3' },
      { key: 'Δ', label: <Fraction num="2" den="3" />, raw: '2/3' }
    ],
    correctRaw: '1 2/3',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Μετατρέπουμε τον μεικτό αριθμό σε κλάσμα:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <span>1</span>
          <Fraction num="1" den="3" />
          <span>＝</span>
          <Fraction num="4" den="3" />
          <span>δοχείου ανά τοίχο.</span>
        </div>
        <p>
          2. Για τους 4 τοίχους θα χρειαστούν συνολικά:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <span>4 ·</span>
          <Fraction num="4" den="3" />
          <span>＝</span>
          <Fraction num="16" den="3" />
          <span>δοχεία.</span>
        </div>
        <p>
          3. Αφαιρούμε από τα 7 δοχεία που αγοράσαμε (7 ＝ 21/3):
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="21" den="3" />
          <span>－</span>
          <Fraction num="16" den="3" />
          <span>＝</span>
          <Fraction num="5" den="3" />
          <span>＝ <strong className="text-emerald-700 text-base">1 <Fraction num="2" den="3" /></strong> δοχείο.</span>
        </div>
        <p className="pt-1">
          Επομένως, θα περισσέψει <strong>1 <Fraction num="2" den="3" /></strong> δοχείο μπογιάς (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 21,
    officialNumber: 46,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Η γραφική παράσταση παρουσιάζει τη διαδρομή που κάνει ο Μάριος με το σχολικό λεωφορείο. Αν μπήκε στο λεωφορείο στις 7:40, τι ώρα ήταν όταν αυτό σταμάτησε για να πάρει ακόμα δύο συμμαθητές του;',
    hasSvg: 'busGraph46',
    options: [
      { key: 'A', label: '7:44', raw: '7:44' },
      { key: 'B', label: '7:48', raw: '7:48' },
      { key: 'Γ', label: '7:52', raw: '7:52' },
      { key: 'Δ', label: '7:54', raw: '7:54' }
    ],
    correctRaw: '7:48',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Στη γραφική παράσταση απόστασης-χρόνου, η στάση του λεωφορείου αντιστοιχεί στο <strong>οριζόντιο ευθύγραμμο τμήμα</strong> (όπου ο χρόνος κυλά αλλά η απόσταση μένει σταθερή).
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Η στάση ξεκινά στο <strong>8ο λεπτό</strong> (και διαρκεί μέχρι το 10ο λεπτό).</div>
          <div>• Ώρα έναρξης: 7:40</div>
          <div>• 7:40 ＋ 8 λεπτά ＝ <strong className="text-emerald-700 text-base">7:48</strong></div>
        </div>
        <p className="pt-1">
          Άρα, η ώρα ήταν <strong>7:48</strong> (Επιλογή <strong>B</strong>).
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
        Η ηλικία του Χρήστου είναι το <Fraction num="1" den="3" /> της ηλικίας της γιαγιάς του, αλλά και το <Fraction num="1" den="2" /> της ηλικίας της μαμάς του. Αν η γιαγιά του είναι μεγαλύτερη από τη μαμά του κατά 23 χρόνια, τότε η γιαγιά του Χρήστου είναι:
      </span>
    ),
    options: [
      { key: 'A', label: '75 ετών', raw: '75 ετών' },
      { key: 'B', label: '72 ετών', raw: '72 ετών' },
      { key: 'Γ', label: '69 ετών', raw: '69 ετών' },
      { key: 'Δ', label: '63 ετών', raw: '63 ετών' }
    ],
    correctRaw: '69 ετών',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Έστω <strong>x</strong> η ηλικία του Χρήστου.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Γιαγιά: 3 · x (αφού ο Χρήστος είναι το 1/3)</div>
          <div>• Μαμά: 2 · x (αφού ο Χρήστος είναι το 1/2)</div>
        </div>
        <p>
          Η διαφορά ηλικίας γιαγιάς και μαμάς είναι 23 χρόνια:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          3x － 2x ＝ 23 ➔ <strong>x ＝ 23 ετών</strong> (ηλικία Χρήστου)
        </div>
        <p>
          Ηλικία γιαγιάς:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          3 · 23 ＝ <strong className="text-emerald-700 text-base">69 ετών</strong>
        </div>
        <p className="pt-1">
          Επομένως, η γιαγιά είναι <strong>69 ετών</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 23,
    officialNumber: 48,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Από το διπλάσιο ενός αριθμού αφαιρώ 12 και βρίσκω διαφορά 10. Ποιος είναι ο αριθμός;',
    options: [
      { key: 'A', label: '22', raw: '22' },
      { key: 'B', label: '11', raw: '11' },
      { key: 'Γ', label: '14', raw: '14' },
      { key: 'Δ', label: '8', raw: '8' }
    ],
    correctRaw: '11',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Σχηματίζουμε την εξίσωση:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>2 · x － 12 ＝ 10</div>
          <div>2 · x ＝ 10 ＋ 12</div>
          <div>2 · x ＝ 22 ➔ <strong className="text-emerald-700 text-base">x ＝ 11</strong></div>
        </div>
        <p className="pt-1">
          Άρα, ο αριθμός είναι το <strong>11</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 24,
    officialNumber: 49,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ο Βαγγέλης αγόρασε 48 αυγά σε συσκευασίες των 6 και πλήρωσε 2,1 ευρώ τη μία. Αν αγόραζε την ίδια ποσότητα αυγών σε συσκευασίες των 4 θα πλήρωνε 4,8 ευρώ περισσότερα, συνολικά. Πόσο κόστιζε κάθε συσκευασία των 4 αυγών;',
    options: [
      { key: 'A', label: '1,8 ευρώ', raw: '1,8 ευρώ' },
      { key: 'B', label: '4 ευρώ', raw: '4 ευρώ' },
      { key: 'Γ', label: '2,5 ευρώ', raw: '2,5 ευρώ' },
      { key: 'Δ', label: '2 ευρώ', raw: '2 ευρώ' }
    ],
    correctRaw: '1,8 ευρώ',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. <strong>Κόστος στις συσκευασίες των 6:</strong><br />
          • Πλήθος συσκευασιών: 48 : 6 ＝ 8 συσκευασίες.<br />
          • Συνολικό κόστος: 8 · 2,1 € ＝ <strong>16,80 €</strong>.
        </p>
        <p>
          2. <strong>Κόστος στις συσκευασίες των 4:</strong><br />
          • Συνολικό ποσό: 16,80 € ＋ 4,80 € ＝ <strong>21,60 €</strong>.<br />
          • Πλήθος συσκευασιών: 48 : 4 ＝ 12 συσκευασίες.<br />
          • Τιμή ανά συσκευασία των 4: 21,60 € : 12 ＝ <strong className="text-emerald-700 text-base">1,80 €</strong>.
        </p>
        <p className="pt-1">
          Συνεπώς, κάθε συσκευασία των 4 κόστιζε <strong>1,8 ευρώ</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 25,
    officialNumber: 50,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ο διευθυντής ενός σχολείου της Κρήτης προμηθεύτηκε 47 εισιτήρια λεωφορείου για τη μετάβαση των μαθητών της Στ΄ τάξης στον αρχαιολογικό χώρο της Κνωσού και 47 εισιτήρια για την επιστροφή τους. Επειδή κάποιοι μαθητές απουσίαζαν δε χρησιμοποιήθηκαν 6 εισιτήρια. Με ποια από τις παρακάτω εξισώσεις μπορούμε να βρούμε τον αριθμό των μαθητών που πήγαν στην Κνωσό;',
    options: [
      { key: 'A', label: <span className="font-mono">x ＋ 6 ＝ 94</span>, raw: 'x + 6 = 94' },
      { key: 'B', label: <span className="font-mono">94 ＋ 6 ＝ x · 2</span>, raw: '94 + 6 = x*2' },
      { key: 'Γ', label: <span className="font-mono">2 · x ＋ 6 ＝ 94</span>, raw: '2*x + 6 = 94' },
      { key: 'Δ', label: <span className="font-mono">94 － x ＝ 6</span>, raw: '94 - x = 6' }
    ],
    correctRaw: '2*x + 6 = 94',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Συνολικά εισιτήρια: 47 (μετάβαση) ＋ 47 (επιστροφή) ＝ <strong>94 εισιτήρια</strong>.
        </p>
        <p>
          2. Κάθε μαθητής που πήγε στην εκδρομή (έστω <strong>x</strong> μαθητές) χρησιμοποίησε <strong>2 εισιτήρια</strong> (ένα για τη μετάβαση και ένα για την επιστροφή), άρα χρησιμοποιήθηκαν <strong>2 · x</strong> εισιτήρια.
        </p>
        <p>
          3. Προσθέτοντας τα 6 εισιτήρια που περίσσεψαν, προκύπτει το σύνολο:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold">
          2 · x ＋ 6 ＝ 94
        </div>
        <p className="pt-1">
          Επομένως, η σωστή εξίσωση είναι η <strong>Γ</strong>.
        </p>
      </div>
    )
  }
];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function Themata2021Page() {
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
    QUESTIONS_2021.forEach((q) => {
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

  const correctCount = QUESTIONS_2021.filter(
    q => answers[q.id] === q.correctRaw
  ).length;

  const renderQuestionVisual = (q) => {
    if (q.hasSvg === 'busGraph46') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="420" height="180" viewBox="0 0 420 180" className="select-none font-sans mx-auto block">
            {/* Πλέγμα φόντου */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => (
              <line key={`v-${i}`} x1={40 + i * 26} y1="20" x2={40 + i * 26} y2="135" stroke="#f1f5f9" strokeWidth="1" />
            ))}
            {[0, 1, 2, 3, 4].map(i => (
              <line key={`h-${i}`} x1="40" y1={20 + i * 28.75} x2="385" y2={20 + i * 28.75} stroke="#f1f5f9" strokeWidth="1" />
            ))}

            {/* Άξονες */}
            <line x1="40" y1="135" x2="395" y2="135" stroke="#334155" strokeWidth="1.8" />
            <polygon points="395,131 403,135 395,139" fill="#334155" />

            <line x1="40" y1="135" x2="40" y2="15" stroke="#334155" strokeWidth="1.8" />
            <polygon points="36,15 40,7 44,15" fill="#334155" />

            {/* Ετικέτες αξόνων */}
            <text x="390" y="160" fontSize="10" fontWeight="bold" textAnchor="end" fill="#334155">Χρόνος σε λεπτά</text>
            <text x="22" y="75" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#334155" transform="rotate(-90 22 75)">Απόσταση</text>

            {/* Αριθμοί χρόνου 0-13 */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map(i => (
              <g key={i}>
                <line x1={40 + i * 26} y1="135" x2={40 + i * 26} y2="140" stroke="#334155" strokeWidth="1" />
                <text x={40 + i * 26} y="152" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#475569">{i}</text>
              </g>
            ))}

            {/* Τεθλασμένη γραμμή διαδρομής (στάση μεταξύ 8 και 10) */}
            <polyline
              points={`40,135 ${40 + 8 * 26},75 ${40 + 10 * 26},75 ${40 + 13.5 * 26},20`}
              fill="none"
              stroke="#0f172a"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            {/* Σημεία καμπής */}
            <circle cx={40 + 8 * 26} cy="75" r="3.5" fill="#2563eb" />
            <circle cx={40 + 10 * 26} cy="75" r="3.5" fill="#2563eb" />
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title="🏛️ Πραγματικά Θέματα 2021 - Πρότυπα Σχολεία | LearnMaths.gr"
      description="Επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία 2021: 25 θέματα Μαθηματικών (026–050), 2 μόρια ανά θέμα (Άριστα: 50 μόρια), χρονόμετρο και αναλυτικές λύσεις."
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
                Επίσημα Θέματα 2021 • 25 Ερωτήσεις Μαθηματικών
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Εξετάσεις Προτύπων 2021
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
              Αποτέλεσμα Εξέτασης 2021
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
          {QUESTIONS_2021.map((q) => {
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
