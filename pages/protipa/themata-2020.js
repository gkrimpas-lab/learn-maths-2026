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

const QUESTIONS_2020 = [
  {
    id: 1,
    officialNumber: 26,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: (
      <span className="inline-flex items-center gap-1 font-mono text-base flex-wrap">
        Ποια είναι η τιμή της αριθμητικής παράστασης: &nbsp;
        20 : <Fraction num="1" den="2" /> － 20 － 2 : 0,2 ＋ 2 · 2² ＋ 2 ＝
      </span>
    ),
    options: [
      { key: 'A', label: '2', raw: '2' },
      { key: 'B', label: '0,2', raw: '0,2' },
      { key: 'Γ', label: '20', raw: '20' },
      { key: 'Δ', label: '40', raw: '40' }
    ],
    correctRaw: '20',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Εκτελούμε πρώτα τις δυνάμεις, τους πολλαπλασιασμούς και τις διαιρέσεις:
        </p>
        <div className="bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• 20 : (1/2) ＝ 20 · 2 ＝ <strong>40</strong></div>
          <div>• 2 : 0,2 ＝ 20 : 2 ＝ <strong>10</strong></div>
          <div>• 2 · 2² ＝ 2 · 4 ＝ <strong>8</strong></div>
        </div>
        <p>
          Αντικαθιστούμε στην παράσταση και εκτελούμε τις πράξεις από αριστερά προς τα δεξιά:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>40 － 20 － 10 ＋ 8 ＋ 2</div>
          <div>＝ 20 － 10 ＋ 8 ＋ 2</div>
          <div>＝ 10 ＋ 8 ＋ 2 ＝ <strong className="text-emerald-700 text-base">20</strong></div>
        </div>
        <p className="pt-1">
          Άρα, η τιμή είναι <strong>20</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 2,
    officialNumber: 27,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ποιος αριθμός είναι τριπλάσιος του αριθμού που αντιστοιχεί στο σημείο Α του παρακάτω τμήματος της αριθμογραμμής;',
    hasSvg: 'axis27',
    options: [
      { key: 'A', label: '3', raw: '3' },
      { key: 'B', label: '2,7', raw: '2,7' },
      { key: 'Γ', label: '0,3', raw: '0,3' },
      { key: 'Δ', label: '0,9', raw: '0,9' }
    ],
    correctRaw: '2,7',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Στην αριθμογραμμή το διάστημα από το 0 έως το 1 είναι χωρισμένο σε 10 ίσα τμήματα (κάθε υποδιαίρεση αντιστοιχεί σε 0,1).
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Το σημείο Α βρίσκεται στην 9η υποδιαίρεση: <strong>Α ＝ 0,9</strong></div>
          <div>• Ο τριπλάσιος αριθμός του Α είναι: 3 · 0,9 ＝ <strong className="text-emerald-700 text-base">2,7</strong></div>
        </div>
        <p className="pt-1">
          Επομένως, ο αριθμός είναι το <strong>2,7</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 3,
    officialNumber: 28,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ο Παναγιώτης είναι 7 χρόνια μεγαλύτερος από την Αφροδίτη. Η Αφροδίτη είναι 7 χρόνια μικρότερη από την Ευαγγελία. Αν ο Παναγιώτης είναι 33 ετών, πόσων ετών είναι η Ευαγγελία;',
    options: [
      { key: 'A', label: '19', raw: '19' },
      { key: 'B', label: '33', raw: '33' },
      { key: 'Γ', label: '40', raw: '40' },
      { key: 'Δ', label: '47', raw: '47' }
    ],
    correctRaw: '33',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Καταγράφουμε τις σχέσεις των ηλικιών:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1.5">
          <div>• Παναγιώτης ＝ Αφροδίτη ＋ 7 ➔ 33 ＝ Αφροδίτη ＋ 7 ➔ <strong>Αφροδίτη ＝ 26 ετών</strong></div>
          <div>• Αφροδίτη ＝ Ευαγγελία － 7 ➔ 26 ＝ Ευαγγελία － 7 ➔ <strong>Ευαγγελία ＝ 33 ετών</strong></div>
        </div>
        <p className="pt-1">
          Άρα, η Ευαγγελία είναι <strong>33</strong> ετών (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 4,
    officialNumber: 29,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Η Μαρία θέλει να καλέσει τους φίλους και τις φίλες της στο σπίτι για παιχνίδι. Θα μαζευτούν από 2 μέχρι το πολύ 5 παιδιά. Πόσες το λιγότερο καραμέλες πρέπει να αγοράσει ώστε σε κάθε περίπτωση να τις μοιραστούν δίκαια και να μην περισσέψει καμιά;',
    options: [
      { key: 'A', label: '10', raw: '10' },
      { key: 'B', label: '15', raw: '15' },
      { key: 'Γ', label: '60', raw: '60' },
      { key: 'Δ', label: '120', raw: '120' }
    ],
    correctRaw: '60',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Ο αριθμός των καραμελών πρέπει να διαιρείται ακριβώς με το 2, το 3, το 4 και το 5. Άρα αναζητούμε το <strong>Ελάχιστο Κοινό Πολλαπλάσιο</strong> των αριθμών αυτών:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>ΕΚΠ(2, 3, 4, 5) ＝ 2² · 3 · 5 ＝ 4 · 3 · 5 ＝ <strong className="text-emerald-700 text-base">60</strong></div>
        </div>
        <p className="pt-1">
          Επομένως, πρέπει να αγοράσει το λιγότερο <strong>60</strong> καραμέλες (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 5,
    officialNumber: 30,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Παρατήρησε τις παρακάτω ζυγαριές που ισορροπούν. Πόσο ζυγίζουν τα κρεμμύδια;',
    hasSvg: 'scales30',
    options: [
      { key: 'A', label: '14 κιλά', raw: '14 κιλά' },
      { key: 'B', label: '16 κιλά', raw: '16 κιλά' },
      { key: 'Γ', label: '32 κιλά', raw: '32 κιλά' },
      { key: 'Δ', label: '24 κιλά', raw: '24 κιλά' }
    ],
    correctRaw: '16 κιλά',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Συμβολίζουμε με <strong>Π</strong> τις πατάτες και με <strong>Κ</strong> τα κρεμμύδια.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>(1) 1η ζυγαριά: Π ＋ Κ ＝ 28 κιλά</div>
          <div>(2) 2η ζυγαριά: Κ ＝ Π ＋ 4 κιλά ➔ Κ － Π ＝ 4 κιλά</div>
        </div>
        <p>
          Προσθέτουμε τις δύο σχέσεις κατά μέλη:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>(Π ＋ Κ) ＋ (Κ － Π) ＝ 28 ＋ 4</div>
          <div>2 · Κ ＝ 32 ➔ Κ ＝ 32 : 2 ＝ <strong className="text-emerald-700 text-base">16 κιλά</strong></div>
        </div>
        <p className="pt-1">
          Άρα, τα κρεμμύδια ζυγίζουν <strong>16 κιλά</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 6,
    officialNumber: 31,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Σε ένα κιβώτιο υπήρχαν 60 μήλα. Οι μαθητές και οι μαθήτριες μιας Στ τάξης στο πλαίσιο ενός προγράμματος υγιεινής διατροφής πήραν από 3 μήλα ο καθένας. Στο τέλος έμειναν 6 μήλα στο κιβώτιο. Ποια από τις παρακάτω εξισώσεις θα χρησιμοποιήσεις για να βρεις πόσοι ήταν οι μαθητές και οι μαθήτριες αυτής της τάξης;',
    options: [
      { key: 'A', label: <span className="font-mono">60 : x ＝ 3</span>, raw: '60:x=3' },
      { key: 'B', label: <span className="font-mono">3 · x － 6 ＝ 60</span>, raw: '3*x-6=60' },
      { key: 'Γ', label: <span className="font-mono">(60 － 6) : x ＝ 3</span>, raw: '(60-6):x=3' },
      { key: 'Δ', label: <span className="font-mono">66 : x ＝ 3</span>, raw: '66:x=3' }
    ],
    correctRaw: '(60-6):x=3',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Τα μήλα που μοιράστηκαν στους μαθητές είναι: <strong>60 － 6</strong>.
        </p>
        <p>
          2. Αν <strong>x</strong> είναι το πλήθος των μαθητών, διαιρώντας τα μήλα που μοιράστηκαν με τους μαθητές, προκύπτουν 3 μήλα ανά μαθητή:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold">
          (60 － 6) : x ＝ 3
        </div>
        <p className="pt-1">
          Επομένως, σωστή είναι η εξίσωση <strong>Γ</strong>.
        </p>
      </div>
    )
  },
  {
    id: 7,
    officialNumber: 32,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Η Αριάδνη έκανε 25 βολές στο χθεσινό παιχνίδι μπάσκετ και πέτυχε πόντους στις 19 από αυτές. Τι ποσοστό στα % των βολών της ήταν άστοχες;',
    options: [
      { key: 'A', label: '6%', raw: '6%' },
      { key: 'B', label: '19%', raw: '19%' },
      { key: 'Γ', label: '24%', raw: '24%' },
      { key: 'Δ', label: '76%', raw: '76%' }
    ],
    correctRaw: '24%',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Οι άστοχες βολές είναι: 25 － 19 ＝ <strong>6 βολές</strong>.
        </p>
        <p>
          2. Υπολογίζουμε το ποσοστό των άστοχων βολών:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Ποσοστό ＝</span>
          <Fraction num="6" den="25" />
          <span>＝</span>
          <Fraction num="24" den="100" />
          <span>＝ <strong className="text-emerald-700 text-base">24%</strong></span>
        </div>
        <p className="pt-1">
          Άρα, το ποσοστό των άστοχων βολών ήταν <strong>24%</strong> (Επιλογή <strong>Γ</strong>).
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
        Ο Στέλιος φτιάχνει 2 μερίδες από την αγαπημένη του φρουτοσαλάτα χρησιμοποιώντας <Fraction num="3" den="4" /> του κιλού μήλα. Πόσα γραμμάρια μήλα πρέπει να χρησιμοποιήσει για να φτιάξει μια μερίδα από την αγαπημένη του φρουτοσαλάτα;
      </span>
    ),
    options: [
      { key: 'A', label: '250 γραμμάρια', raw: '250 γραμμάρια' },
      { key: 'B', label: '345 γραμμάρια', raw: '345 γραμμάρια' },
      { key: 'Γ', label: '375 γραμμάρια', raw: '375 γραμμάρια' },
      { key: 'Δ', label: '750 γραμμάρια', raw: '750 γραμμάρια' }
    ],
    correctRaw: '375 γραμμάρια',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Μετατρέπουμε τα 3/4 του κιλού σε γραμμάρια (1 κιλό = 1.000 γρ.):
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          (3/4) · 1.000 γρ. ＝ <strong>750 γραμμάρια</strong> για 2 μερίδες.
        </div>
        <p>
          2. Για μία μερίδα απαιτούνται τα μισά:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          750 : 2 ＝ <strong className="text-emerald-700 text-base">375 γραμμάρια</strong>
        </div>
        <p className="pt-1">
          Συνεπώς, θα χρησιμοποιήσει <strong>375 γραμμάρια</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 9,
    officialNumber: 34,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Το παρακάτω ραβδόγραμμα δείχνει τον αριθμό των απαντήσεων των παιδιών ενός Δημοτικού Σχολείου σε μια έρευνα που έγινε με θέμα την αγαπημένη ενασχόλησή τους στον ελεύθερο χρόνο τους. Τι ποσοστό των παιδιών απάντησαν ότι η αγαπημένη τους ενασχόληση είναι η μουσική;',
    hasSvg: 'freeTimeChart34',
    options: [
      { key: 'A', label: '10%', raw: '10%' },
      { key: 'B', label: '25%', raw: '25%' },
      { key: 'Γ', label: '20%', raw: '20%' },
      { key: 'Δ', label: '80%', raw: '80%' }
    ],
    correctRaw: '25%',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Υπολογίζουμε το σύνολο όλων των παιδιών από τις στήλες:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          30 (Ηλεκτρονικά) ＋ 20 (Παιχνίδι) ＋ 20 (Μουσική) ＋ 10 (Λογοτεχνία) ＝ <strong>80 παιδιά</strong>
        </div>
        <p>
          2. Το ποσοστό για τη μουσική (20 παιδιά) είναι:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="20" den="80" />
          <span>＝</span>
          <Fraction num="1" den="4" />
          <span>＝ <strong className="text-emerald-700 text-base">25%</strong></span>
        </div>
        <p className="pt-1">
          Άρα, το ποσοστό είναι <strong>25%</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 10,
    officialNumber: 35,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Η Αφροδίτη είναι αθλήτρια ενόργανης γυμναστικής. Στους περσινούς πανελλήνιους αγώνες οι κριτές της έδωσαν στο άθλημα του άλματος τις παρακάτω βαθμολογίες. Ποιος κριτής της έδωσε βαθμολογία που διαφέρει περισσότερο από το μέσο όρο της βαθμολογίας της;',
    hasTable: 'judgesTable35',
    options: [
      { key: 'A', label: '1ος κριτής', raw: '1ος κριτής' },
      { key: 'B', label: '2ος κριτής', raw: '2ος κριτής' },
      { key: 'Γ', label: '3ος κριτής', raw: '3ος κριτής' },
      { key: 'Δ', label: '4ος κριτής', raw: '4ος κριτής' }
    ],
    correctRaw: '3ος κριτής',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Υπολογίζουμε τον μέσο όρο των 4 βαθμολογιών:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>Μέσος Όρος ＝</span>
          <Fraction num="9 ＋ 8,8 ＋ 8,2 ＋ 9,2" den="4" />
          <span>＝</span>
          <Fraction num="35,2" den="4" />
          <span>＝ <strong>8,8</strong></span>
        </div>
        <p>
          2. Εξετάζουμε τη διαφορά κάθε βαθμολογίας από το 8,8:
        </p>
        <div className="space-y-1 bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• 1ος κριτής: |9 － 8,8| ＝ 0,2</div>
          <div>• 2ος κριτής: |8,8 － 8,8| ＝ 0</div>
          <div>• 3ος κριτής: |8,2 － 8,8| ＝ <strong className="text-emerald-700">0,6</strong> (μέγιστη διαφορά)</div>
          <div>• 4ος κριτής: |9,2 － 8,8| ＝ 0,4</div>
        </div>
        <p className="pt-1">
          Επομένως, διαφέρει περισσότερο η βαθμολογία του <strong>3ου κριτή</strong> (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 11,
    officialNumber: 36,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Τα παιδιά της Στ τάξης ζήτησαν από το Διευθυντή του σχολείου τους, για να μην τραυματίζονται, να τοποθετήσει ελαστικό τάπητα στην αυλή κάτω από τον κήπο σχήματος τετραγώνου. Ο Διευθυντής τους ζήτησε να υπολογίσουν πόσο θα κοστίσει. Τους ενημέρωσε ότι η τιμή του τάπητα είναι 10 ευρώ το τ.μ. και τους έδωσε το παρακάτω σχεδιάγραμμα της αυλής. Πόσο θα κοστίσει ο τάπητας;',
    hasSvg: 'yardPlan36',
    options: [
      { key: 'A', label: '240 ευρώ', raw: '240 ευρώ' },
      { key: 'B', label: '420 ευρώ', raw: '420 ευρώ' },
      { key: 'Γ', label: '600 ευρώ', raw: '600 ευρώ' },
      { key: 'Δ', label: '960 ευρώ', raw: '960 ευρώ' }
    ],
    correctRaw: '420 ευρώ',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. <strong>Διαστάσεις κήπου και αυλής:</strong><br />
          • Το συνολικό οριζόντιο μήκος της αυλής είναι 12 μ. Τα δύο πλαϊνά τμήματα είναι 3 μ. και 3 μ., άρα η πλευρά του τετράγωνου κήπου είναι: 12 － 3 － 3 ＝ <strong>6 μ.</strong><br />
          • Εμβαδόν ολόκληρου του ορθογωνίου της αυλής (πριν αφαιρεθεί το κομμάτι του κήπου): 12 μ. · 5 μ. ＝ 60 τ.μ.
        </p>
        <p>
          2. Ο κήπος έχει συνολικό ύψος 6 μ. και εισχωρεί στην αυλή κατά: 6 μ. － 3 μ. ＝ <strong>3 μ.</strong><br />
          Άρα το μέρος του κήπου που βρίσκεται μέσα στην αυλή είναι ένα ορθογώνιο διαστάσεων 6 μ. × 3 μ. με εμβαδόν: 6 · 3 ＝ <strong>18 τ.μ.</strong>
        </p>
        <p>
          3. Καθαρό εμβαδόν αυλής για τάπητα: 60 － 18 ＝ <strong>42 τ.μ.</strong>
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Κόστος ＝ 42 τ.μ. · 10 €/τ.μ. ＝ <strong className="text-emerald-700 text-base">420 ευρώ</strong>
        </div>
        <p className="pt-1">
          Άρα, ο τάπητας θα κοστίσει <strong>420 ευρώ</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 12,
    officialNumber: 37,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Η γειτόνισσά μας έφτιαξε 5 κιλά μαρμελάδα πορτοκάλι και θέλει να την τοποθετήσει σε βαζάκια. Αν το κάθε βαζάκι χωράει <Fraction num="2" den="10" /> του κιλού μαρμελάδα, πόσα βαζάκια θα χρειαστεί;
      </span>
    ),
    options: [
      { key: 'A', label: '25 βαζάκια', raw: '25 βαζάκια' },
      { key: 'B', label: '20 βαζάκια', raw: '20 βαζάκια' },
      { key: 'Γ', label: '1 βαζάκι', raw: '1 βαζάκι' },
      { key: 'Δ', label: '50 βαζάκια', raw: '50 βαζάκια' }
    ],
    correctRaw: '25 βαζάκια',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Διαιρούμε τη συνολική ποσότητα με τη χωρητικότητα του ενός βάζου:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <span>5 :</span>
          <Fraction num="2" den="10" />
          <span>＝ 5 ·</span>
          <Fraction num="10" den="2" />
          <span>＝ 5 · 5 ＝ <strong className="text-emerald-700 text-base">25 βαζάκια</strong></span>
        </div>
        <p className="pt-1">
          Συνεπώς, θα χρειαστεί <strong>25 βαζάκια</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 13,
    officialNumber: 38,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Οι μαθητές ενός σχολείου πέρυσι ήταν 300. Φέτος ο αριθμός τους αυξήθηκε κατά 8%. Πόσους μαθητές έχει φέτος το σχολείο;',
    options: [
      { key: 'A', label: '320', raw: '320' },
      { key: 'B', label: '324', raw: '324' },
      { key: 'Γ', label: '290', raw: '290' },
      { key: 'Δ', label: '342', raw: '342' }
    ],
    correctRaw: '324',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Υπολογίζουμε την αύξηση των μαθητών:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          8% · 300 ＝ 0,08 · 300 ＝ <strong>24 μαθητές</strong>
        </div>
        <p>
          2. Προσθέτουμε στον αρχικό αριθμό:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          300 ＋ 24 ＝ <strong className="text-emerald-700 text-base">324 μαθητές</strong>
        </div>
        <p className="pt-1">
          Άρα, φέτος το σχολείο έχει <strong>324</strong> μαθητές (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 14,
    officialNumber: 39,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Σε μια εταιρεία 3 υπάλληλοι χρειάζονται 18 ημέρες για να ολοκληρώσουν μια εργασία. Σε πόσες ημέρες θα ολοκληρώσουν την εργασία αν εργαστούν 9 υπάλληλοι;',
    options: [
      { key: 'A', label: 'σε 54 ημέρες', raw: 'σε 54 ημέρες' },
      { key: 'B', label: 'σε 6 ημέρες', raw: 'σε 6 ημέρες' },
      { key: 'Γ', label: 'σε 27 ημέρες', raw: 'σε 27 ημέρες' },
      { key: 'Δ', label: 'σε 3 ημέρες', raw: 'σε 3 ημέρες' }
    ],
    correctRaw: 'σε 6 ημέρες',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Τα ποσά (υπάλληλοι και ημέρες) είναι <strong>αντιστρόφως ανάλογα</strong>:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Το γινόμενο είναι σταθερό: 3 υπάλληλοι · 18 ημέρες ＝ <strong>54 ανθρωποημέρες</strong></div>
          <div>• Για 9 υπαλλήλους: 54 : 9 ＝ <strong className="text-emerald-700 text-base">6 ημέρες</strong></div>
        </div>
        <p className="pt-1">
          Επομένως, θα ολοκληρώσουν την εργασία <strong>σε 6 ημέρες</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 15,
    officialNumber: 40,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Έξι φίλοι παράγγειλαν: 3 πίτσες που η καθεμιά κόστιζε 6 ευρώ, 6 μακαρονάδες που η καθεμιά κόστιζε 3,90 ευρώ και 6 χυμούς που κόστιζε ο καθένας 1,20 ευρώ. Πόσα χρήματα θα πληρώσει ο καθένας αν μοιραστούν τον λογαριασμό;',
    options: [
      { key: 'A', label: '8,1 €', raw: '8,1 €' },
      { key: 'B', label: '36', raw: '36' },
      { key: 'Γ', label: '6,9', raw: '6,9' },
      { key: 'Δ', label: '7 €', raw: '7 €' }
    ],
    correctRaw: '8,1 €',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Υπολογίζουμε το συνολικό κόστος:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• 3 πίτσες: 3 · 6 € ＝ 18 €</div>
          <div>• 6 μακαρονάδες: 6 · 3,90 € ＝ 23,40 €</div>
          <div>• 6 χυμοί: 6 · 1,20 € ＝ 7,20 €</div>
          <div className="pt-1 font-bold">Σύνολο λογαριασμού ＝ 18 ＋ 23,40 ＋ 7,20 ＝ 48,60 €</div>
        </div>
        <p>
          2. Διαιρούμε ισόποσα διά 6:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          48,60 € : 6 ＝ <strong className="text-emerald-700 text-base">8,10 €</strong>
        </div>
        <p className="pt-1">
          Άρα, ο καθένας θα πληρώσει <strong>8,1 €</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 16,
    officialNumber: 41,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Με 1 <Fraction num="1" den="2" /> λίτρα γάλα πόσα ποτήρια του <Fraction num="1" den="4" /> λίτρου γεμίζουμε;
      </span>
    ),
    options: [
      { key: 'A', label: '4 ποτήρια', raw: '4 ποτήρια' },
      { key: 'B', label: '6 ποτήρια', raw: '6 ποτήρια' },
      { key: 'Γ', label: <span>4 <Fraction num="1" den="4" /> ποτήρια</span>, raw: '4 1/4' },
      { key: 'Δ', label: '5 ποτήρια', raw: '5 ποτήρια' }
    ],
    correctRaw: '6 ποτήρια',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Μετατρέπουμε τον μεικτό αριθμό σε κλάσμα:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1">
          <span>1</span>
          <Fraction num="1" den="2" />
          <span>＝</span>
          <Fraction num="3" den="2" />
          <span>λίτρα.</span>
        </div>
        <p>
          2. Διαιρούμε με το 1/4 του λίτρου:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="3" den="2" />
          <span>:</span>
          <Fraction num="1" den="4" />
          <span>＝</span>
          <Fraction num="3" den="2" />
          <span>· 4 ＝</span>
          <Fraction num="12" den="2" />
          <span>＝ <strong className="text-emerald-700 text-base">6 ποτήρια</strong></span>
        </div>
        <p className="pt-1">
          Επομένως, γεμίζουμε <strong>6 ποτήρια</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 17,
    officialNumber: 42,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: (
      <span>
        Μερικά παιδιά έλαβαν μέρος σε έναν αγώνα δρόμου. Στο πρώτο δεκάλεπτο η Μαρία είχε διανύσει τα <Fraction num="9" den="10" /> της διαδρομής, ο Χρήστος τα <Fraction num="7" den="8" />, η Κατερίνα τα <Fraction num="19" den="20" /> και ο Πέτρος τα <Fraction num="4" den="5" />. Βάλε τα παιδιά στη σειρά ξεκινώντας από αυτό που διένυσε τη μεγαλύτερη απόσταση.
      </span>
    ),
    options: [
      { key: 'A', label: 'Μαρία, Κατερίνα, Πέτρος, Χρήστος', raw: 'A' },
      { key: 'B', label: 'Πέτρος, Κατερίνα, Μαρία, Χρήστος', raw: 'B' },
      { key: 'Γ', label: 'Κατερίνα, Μαρία, Πέτρος, Χρήστος', raw: 'Γ' },
      { key: 'Δ', label: 'Κατερίνα, Μαρία, Χρήστος, Πέτρος', raw: 'Δ' }
    ],
    correctRaw: 'Δ',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Μετατρέπουμε τα κλάσματα σε δεκαδικούς αριθμούς:
        </p>
        <div className="space-y-1.5 bg-white/70 p-3.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          <div>• Κατερίνα: 19/20 ＝ <strong>0,950</strong></div>
          <div>• Μαρία: 9/10 ＝ <strong>0,900</strong></div>
          <div>• Χρήστος: 7/8 ＝ <strong>0,875</strong></div>
          <div>• Πέτρος: 4/5 ＝ <strong>0,800</strong></div>
        </div>
        <p>
          Συγκρίνοντας σε φθίνουσα σειρά: 0,950 &gt; 0,900 &gt; 0,875 &gt; 0,800.
        </p>
        <p className="pt-1 font-bold text-emerald-800">
          Σειρά: Κατερίνα, Μαρία, Χρήστος, Πέτρος (Επιλογή Δ).
        </p>
      </div>
    )
  },
  {
    id: 18,
    officialNumber: 43,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Από τους 250 μαθητές ενός σχολείου το 40% μετακινείται με λεωφορείο, το 38% με αυτοκίνητο και οι υπόλοιποι με τα πόδια. Πόσα παιδιά έρχονται με τα πόδια στο σχολείο;',
    options: [
      { key: 'A', label: '195', raw: '195' },
      { key: 'B', label: '25', raw: '25' },
      { key: 'Γ', label: '55', raw: '55' },
      { key: 'Δ', label: '95', raw: '95' }
    ],
    correctRaw: '55',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Βρίσκουμε το ποσοστό των μαθητών που έρχονται με τα πόδια:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          100% － (40% ＋ 38%) ＝ 100% － 78% ＝ <strong>22%</strong>
        </div>
        <p>
          2. Υπολογίζουμε το πλήθος των παιδιών:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          250 · 0,22 ＝ <strong className="text-emerald-700 text-base">55 παιδιά</strong>
        </div>
        <p className="pt-1">
          Άρα, με τα πόδια έρχονται <strong>55</strong> παιδιά (Επιλογή <strong>Γ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 19,
    officialNumber: 44,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Το εμβαδόν ενός τετραγώνου είναι 81 τ.εκ. Ένα ορθογώνιο έχει την ίδια περίμετρο με το τετράγωνο. Το μήκος του ορθογωνίου είναι διπλάσιο από το πλάτος του. Πόσο είναι το εμβαδόν του ορθογωνίου;',
    options: [
      { key: 'A', label: '36 τ.εκ.', raw: '36' },
      { key: 'B', label: '6 τ.εκ.', raw: '6' },
      { key: 'Γ', label: '18 τ.εκ', raw: '18' },
      { key: 'Δ', label: '72 τ.εκ.', raw: '72' }
    ],
    correctRaw: '72',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. <strong>Τετράγωνο:</strong><br />
          • Πλευρά α ＝ √81 ＝ 9 εκ.<br />
          • Περίμετρος Π ＝ 4 · 9 ＝ <strong>36 εκ.</strong>
        </p>
        <p>
          2. <strong>Ορθογώνιο:</strong><br />
          • Έστω πλάτος <strong>x</strong> και μήκος <strong>2x</strong>.<br />
          • Περίμετρος: 2 · (x ＋ 2x) ＝ 6x ＝ 36 ➔ <strong>x ＝ 6 εκ.</strong> (πλάτος) και μήκος ＝ 2 · 6 ＝ <strong>12 εκ.</strong>
        </p>
        <p>
          3. <strong>Εμβαδόν ορθογωνίου:</strong>
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Ε ＝ 12 · 6 ＝ <strong className="text-emerald-700 text-base">72 τ.εκ.</strong>
        </div>
        <p className="pt-1">
          Συνεπώς, το εμβαδόν είναι <strong>72 τ.εκ.</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 20,
    officialNumber: 45,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Αν πολλαπλασιάσουμε έναν αριθμό με 10 θα πάρουμε γινόμενο 500. Ποιον αριθμό θα παίρναμε αν διαιρούσαμε τον αρχικό αριθμό με το 10;',
    options: [
      { key: 'A', label: '0,5', raw: '0,5' },
      { key: 'B', label: '5', raw: '5' },
      { key: 'Γ', label: '50', raw: '50' },
      { key: 'Δ', label: '500', raw: '500' }
    ],
    correctRaw: '5',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Βρίσκουμε τον αρχικό αριθμό:
        </p>
        <div className="bg-white/70 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Αριθμός · 10 ＝ 500 ➔ Αριθμός ＝ 500 : 10 ＝ <strong>50</strong>
        </div>
        <p>
          2. Διαιρούμε τον αριθμό με το 10:
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          50 : 10 ＝ <strong className="text-emerald-700 text-base">5</strong>
        </div>
        <p className="pt-1">
          Επομένως, θα παίρναμε το <strong>5</strong> (Επιλογή <strong>B</strong>).
        </p>
      </div>
    )
  },
  {
    id: 21,
    officialNumber: 46,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Σε ένα διαγώνισμα Αγγλικών οι υποψήφιοι έγραφαν με μαύρο ή μπλε στυλό. Το παρακάτω κυκλικό διάγραμμα δείχνει τι μέρος των υποψηφίων έγραφε με μπλε και τι μέρος έγραφε με μαύρο στυλό. Ποια από τις παρακάτω προτάσεις είναι σωστή;',
    hasSvg: 'penPie46',
    options: [
      { key: 'A', label: 'Αν με μπλε στυλό έγραφαν 120 υποψήφιοι, τότε με μαύρο έγραφαν 30 υποψήφιοι.', raw: 'A' },
      { key: 'B', label: 'Αν με μπλε στυλό έγραφαν 120 υποψήφιοι, τότε με μαύρο έγραφαν 40 υποψήφιοι.', raw: 'B' },
      { key: 'Γ', label: 'Οι υποψήφιοι που έγραφαν με μπλε στυλό ήταν 4 φορές περισσότεροι από τους υποψηφίους που έγραφαν με μαύρο στυλό.', raw: 'Γ' },
      { key: 'Δ', label: <span>Το <Fraction num="1" den="3" /> των υποψηφίων έγραφε με μαύρο στυλό.</span>, raw: 'Δ' }
    ],
    correctRaw: 'B',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Στο κυκλικό διάγραμμα το μπλε στυλό καταλαμβάνει το <strong>75% (3/4)</strong> και το μαύρο το υπόλοιπο <strong>25% (1/4)</strong>.
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Ο λόγος Μπλε προς Μαύρο είναι: 75% : 25% ＝ <strong>3 προς 1</strong> (το μπλε είναι τριπλάσιο του μαύρου).</div>
          <div>• Αν με μπλε έγραφαν 120 υποψήφιοι, τότε με μαύρο έγραφαν: 120 : 3 ＝ <strong className="text-emerald-700">40 υποψήφιοι</strong>.</div>
        </div>
        <p className="pt-1">
          Συνεπώς, σωστή είναι η πρόταση <strong>B</strong>.
        </p>
      </div>
    )
  },
  {
    id: 22,
    officialNumber: 47,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Στο ορθογώνιο ΑΖΕΔ η πλευρά ΑΔ είναι 19 εκατοστά. Το τετράγωνο ΒΓΕΔ έχει εμβαδόν 49 τετραγωνικά εκατοστά. Πόσο είναι το εμβαδόν του γραμμοσκιασμένου ορθογωνίου ΑΖΓΒ;',
    hasSvg: 'rectSquare47',
    options: [
      { key: 'A', label: '98 τ.εκ.', raw: '98' },
      { key: 'B', label: '121 τ.εκ.', raw: '121' },
      { key: 'Γ', label: '84 τ.εκ.', raw: '84' },
      { key: 'Δ', label: '42 τ.εκ.', raw: '42' }
    ],
    correctRaw: '84',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. <strong>Διαστάσεις τετραγώνου ΒΓΕΔ:</strong><br />
          Ε_τετρ ＝ 49 τ.εκ., άρα η πλευρά του είναι: ΒΔ ＝ ΓΒ ＝ √49 ＝ <strong>7 εκ.</strong>
        </p>
        <p>
          2. <strong>Διαστάσεις ορθογωνίου ΑΖΓΒ:</strong><br />
          • Μήκος βάσης ΑΒ: ΑΔ － ΒΔ ＝ 19 εκ. － 7 εκ. ＝ <strong>12 εκ.</strong><br />
          • Ύψος ΓΒ (κοινό με την πλευρά του τετραγώνου): <strong>7 εκ.</strong>
        </p>
        <p>
          3. <strong>Εμβαδόν γραμμοσκιασμένου:</strong>
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-slate-900">
          Ε ＝ ΑΒ · ΓΒ ＝ 12 · 7 ＝ <strong className="text-emerald-700 text-base">84 τ.εκ.</strong>
        </div>
        <p className="pt-1">
          Άρα, το εμβαδόν είναι <strong>84 τ.εκ.</strong> (Επιλογή <strong>Γ</strong>).
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
        Η Χριστίνα και οι 3 φίλες της μοιράστηκαν μισή πίτσα σε ίσα κομμάτια. Τι μέρος της πίτσας πήρε η καθεμία;
      </span>
    ),
    options: [
      { key: 'A', label: <Fraction num="1" den="3" />, raw: '1/3' },
      { key: 'B', label: <Fraction num="1" den="4" />, raw: '1/4' },
      { key: 'Γ', label: <Fraction num="1" den="6" />, raw: '1/6' },
      { key: 'Δ', label: <Fraction num="1" den="8" />, raw: '1/8' }
    ],
    correctRaw: '1/8',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Συνολικά τα άτομα είναι 4 (η Χριστίνα και οι 3 φίλες της: 1 ＋ 3 ＝ 4).
        </p>
        <p>
          2. Μοιράστηκαν τη μισή πίτσα (1/2), άρα η καθεμία πήρε:
        </p>
        <div className="bg-white/80 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 flex items-center gap-1.5 flex-wrap">
          <Fraction num="1" den="2" />
          <span>: 4 ＝</span>
          <Fraction num="1" den="2 · 4" />
          <span>＝</span>
          <strong className="text-emerald-700 text-base"><Fraction num="1" den="8" /></strong>
        </div>
        <p className="pt-1">
          Επομένως, πήρε το <strong><Fraction num="1" den="8" /></strong> της πίτσας (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  },
  {
    id: 24,
    officialNumber: 49,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Τα παιδιά ενός τμήματος της Α΄ Γυμνασίου σχηματίζουν μια σειρά στο προαύλιο του σχολείου. Το παιδί που βρίσκεται ακριβώς στη μέση είναι το δέκατο τέταρτο στη σειρά. Πόσα είναι τα παιδιά του τμήματος;',
    options: [
      { key: 'A', label: '27', raw: '27' },
      { key: 'B', label: '28', raw: '28' },
      { key: 'Γ', label: '29', raw: '29' },
      { key: 'Δ', label: '30', raw: '30' }
    ],
    correctRaw: '27',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          Αφού το μεσαίο παιδί είναι το 14ο στη σειρά:
        </p>
        <div className="bg-white/70 p-3 rounded-xl border border-slate-200/80 font-mono text-slate-900 space-y-1">
          <div>• Υπάρχουν 13 παιδιά πριν από αυτό.</div>
          <div>• Υπάρχουν 13 παιδιά μετά από αυτό.</div>
          <div className="pt-1 font-bold">Σύνολο παιδιών ＝ 13 ＋ 1 (το μεσαίο) ＋ 13 ＝ <span className="text-emerald-700 text-base">27 παιδιά</span></div>
        </div>
        <p className="pt-1">
          Άρα, τα παιδιά του τμήματος είναι <strong>27</strong> (Επιλογή <strong>A</strong>).
        </p>
      </div>
    )
  },
  {
    id: 25,
    officialNumber: 50,
    group: 'ΟΜΑΔΑ Β (4 Επιλογές)',
    promptText: 'Ποιο είναι το τελευταίο ψηφίο ενός διψήφιου περιττού (μονού) αριθμού, ο οποίος αν διαιρεθεί με το 5 αφήνει υπόλοιπο 4;',
    options: [
      { key: 'A', label: '4', raw: '4' },
      { key: 'B', label: '0', raw: '0' },
      { key: 'Γ', label: '5', raw: '5' },
      { key: 'Δ', label: '9', raw: '9' }
    ],
    correctRaw: '9',
    explain: (
      <div className="space-y-3 text-xs sm:text-sm">
        <p>
          1. Οι αριθμοί που διαιρούμενοι με το 5 αφήνουν υπόλοιπο 4 έχουν τελευταίο ψηφίο <strong>4</strong> ή <strong>9</strong> (αφού τα πολλαπλάσια του 5 λήγουν σε 0 ή 5).
        </p>
        <p>
          2. Επειδή ο αριθμός είναι <strong>περιττός (μονός)</strong>, το τελευταίο ψηφίο δεν μπορεί να είναι άρτιο (απορρίπτεται το 4).
        </p>
        <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/80 font-mono text-emerald-800 font-bold">
          ➔ Το τελευταίο ψηφίο είναι το 9.
        </div>
        <p className="pt-1">
          Επομένως, το τελευταίο ψηφίο είναι το <strong>9</strong> (Επιλογή <strong>Δ</strong>).
        </p>
      </div>
    )
  }
];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function Themata2020Page() {
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
    QUESTIONS_2020.forEach((q) => {
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

  const correctCount = QUESTIONS_2020.filter(
    q => answers[q.id] === q.correctRaw
  ).length;

  const renderQuestionVisual = (q) => {
    if (q.hasSvg === 'axis27') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="340" height="75" viewBox="0 0 340 75" className="select-none font-mono">
            <line x1="20" y1="35" x2="310" y2="35" stroke="#334155" strokeWidth="2" />
            <polygon points="310,31 320,35 310,39" fill="#334155" />
            {/* 0 */}
            <line x1="40" y1="27" x2="40" y2="43" stroke="#334155" strokeWidth="2" />
            <text x="40" y="60" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">0</text>
            {/* 1 */}
            <line x1="160" y1="27" x2="160" y2="43" stroke="#334155" strokeWidth="2" />
            <text x="160" y="60" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">1</text>
            {/* 2 */}
            <line x1="280" y1="27" x2="280" y2="43" stroke="#334155" strokeWidth="2" />
            <text x="280" y="60" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#1e293b">2</text>
            {/* Υποδιαιρέσεις ανάμεσα στο 0 και 1 */}
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
              <line key={i} x1={40 + i * 12} y1="31" x2={40 + i * 12} y2="39" stroke="#94a3b8" strokeWidth="1" />
            ))}
            {/* Σημείο Α στο 0.9 */}
            <line x1="148" y1="23" x2="148" y2="47" stroke="#2563eb" strokeWidth="2.5" />
            <text x="148" y="16" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#2563eb">A</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'scales30') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="450" height="150" viewBox="0 0 450 150" className="select-none font-sans mx-auto block">
            {/* 1η Ζυγαριά (Αριστερά) */}
            <g transform="translate(10, 10)">
              {/* Δίσκοι και βάση */}
              <line x1="10" y1="120" x2="190" y2="120" stroke="#000000" strokeWidth="2.5" />
              <line x1="100" y1="120" x2="100" y2="140" stroke="#000000" strokeWidth="2.5" />
              {/* Κουτί: Πατάτες και κρεμμύδια */}
              <rect x="15" y="10" width="80" height="108" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="55" y="55" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000000">πατάτες</text>
              <text x="55" y="70" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000000">και κρεμμύδια</text>
              {/* Βαρίδι 28 κιλά */}
              <path d="M 130,50 C 130,35 160,35 160,50 C 175,70 175,115 145,118 C 115,115 115,70 130,50 Z" fill="#f8fafc" stroke="#000000" strokeWidth="2" />
              <text x="145" y="85" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000000">28 κιλά</text>
            </g>

            {/* 2η Ζυγαριά (Δεξιά) */}
            <g transform="translate(235, 10)">
              {/* Δίσκοι και βάση */}
              <line x1="10" y1="120" x2="200" y2="120" stroke="#000000" strokeWidth="2.5" />
              <line x1="105" y1="120" x2="105" y2="140" stroke="#000000" strokeWidth="2.5" />
              {/* Κουτί: Κρεμμύδια */}
              <rect x="15" y="30" width="70" height="88" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="50" y="78" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#000000">κρεμμύδια</text>
              {/* Κουτί: Πατάτες */}
              <rect x="105" y="55" width="48" height="63" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              <text x="129" y="90" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#000000">πατάτες</text>
              {/* Βαρίδι 4 κιλά */}
              <path d="M 172,70 C 172,60 188,60 188,70 C 196,80 196,115 180,118 C 164,115 164,80 172,70 Z" fill="#f8fafc" stroke="#000000" strokeWidth="1.8" />
              <text x="180" y="96" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#000000">4 κιλά</text>
            </g>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'freeTimeChart34') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="340" height="190" viewBox="0 0 340 190" className="select-none font-sans mx-auto block">
            <text x="170" y="16" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              Ενασχόληση στον ελεύθερο χρόνο
            </text>
            {/* Οριζόντιες γραμμές 0, 10, 20, 30, 40 */}
            {[0, 10, 20, 30, 40].map((v) => {
              const y = 140 - (v / 40) * 110;
              return (
                <g key={v}>
                  <line x1="40" y1={y} x2="310" y2={y} stroke="#cbd5e1" strokeWidth="1" />
                  <text x="32" y={y + 3.5} fontSize="9" fontWeight="bold" textAnchor="end" fill="#64748b">{v}</text>
                </g>
              );
            })}
            {/* Στήλες */}
            {[
              { lines: ['ηλεκτρονικά', 'παιχνίδια'], val: 30 },
              { lines: ['παιχνίδι με', 'φίλους'], val: 20 },
              { lines: ['μουσική'], val: 20 },
              { lines: ['λογοτεχνία'], val: 10 }
            ].map((col, idx) => {
              const x = 55 + idx * 64;
              const h = (col.val / 40) * 110;
              const y = 140 - h;
              const cx = x + 16;
              return (
                <g key={idx}>
                  <rect x={x} y={y} width="32" height={h} fill="#2563eb" rx="1.5" />
                  {col.lines.length === 1 ? (
                    <text x={cx} y="156" fontSize="8.5" fontWeight="bold" textAnchor="middle" fill="#334155">{col.lines[0]}</text>
                  ) : (
                    <text x={cx} y="153" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#334155">
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

    if (q.hasTable === 'judgesTable35') {
      return (
        <div className="overflow-x-auto my-3">
          <table className="w-full text-xs sm:text-sm border-collapse bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 text-center">
            <thead>
              <tr className="bg-slate-200/80 text-slate-800 font-black">
                <th className="p-2.5 border-b border-slate-200">1ος κριτής</th>
                <th className="p-2.5 border-b border-slate-200">2ος κριτής</th>
                <th className="p-2.5 border-b border-slate-200">3ος κριτής</th>
                <th className="p-2.5 border-b border-slate-200">4ος κριτής</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2 font-mono font-bold">9</td>
                <td className="p-2 font-mono font-bold">8,8</td>
                <td className="p-2 font-mono font-bold text-blue-700">8,2</td>
                <td className="p-2 font-mono font-bold">9,2</td>
              </tr>
            </tbody>
          </table>
        </div>
      );
    }

    if (q.hasSvg === 'yardPlan36') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="340" height="200" viewBox="0 0 340 200" className="select-none font-sans mx-auto block">
            {/* Αυλή (γκρι) */}
            <polygon
              points="40,65 125,65 125,120 215,120 215,65 300,65 300,165 40,165"
              fill="#cbd5e1"
              stroke="#0f172a"
              strokeWidth="2"
            />
            {/* Κήπος (λευκό τετράγωνο) */}
            <rect x="125" y="25" width="90" height="95" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
            <text x="170" y="75" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0f172a">κήπος</text>

            {/* Διαστάσεις */}
            <text x="25" y="115" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">5 μ.</text>
            <text x="315" y="115" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">5 μ.</text>
            <text x="82.5" y="55" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">3 μ.</text>
            <text x="257.5" y="55" fontSize="9" fontWeight="bold" textAnchor="middle" fill="#334155">3 μ.</text>
            <text x="115" y="45" fontSize="9" fontWeight="bold" textAnchor="end" fill="#334155">3 μ.</text>
            <text x="225" y="45" fontSize="9" fontWeight="bold" textAnchor="start" fill="#334155">3 μ.</text>
            <text x="170" y="182" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#334155">12 μ.</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'penPie46') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="180" height="180" viewBox="0 0 180 180" className="select-none font-sans">
            {/* 75% Μπλε */}
            <circle cx="90" cy="90" r="75" fill="#e0f2fe" stroke="#0f172a" strokeWidth="2" />
            {/* 25% Μαύρο */}
            <path d="M 90,90 L 90,15 A 75,75 0 0,1 165,90 Z" fill="#000000" />
            <line x1="90" y1="90" x2="90" y2="15" stroke="#0f172a" strokeWidth="2" />
            <line x1="90" y1="90" x2="165" y2="90" stroke="#0f172a" strokeWidth="2" />
            <text x="135" y="60" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#ffffff">Μαύρο</text>
            <text x="65" y="105" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0369a1">Μπλε</text>
            <text x="65" y="122" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#0369a1">75%</text>
          </svg>
        </div>
      );
    }

    if (q.hasSvg === 'rectSquare47') {
      return (
        <div className="flex justify-center p-3 bg-white/80 rounded-2xl border border-slate-200/90 overflow-x-auto my-3">
          <svg width="340" height="150" viewBox="0 0 340 150" className="select-none font-sans">
            {/* Ορισμός pattern για διαγώνιες γραμμές */}
            <defs>
              <pattern id="diagonalHatch" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                <line x1="0" y1="0" x2="0" y2="8" stroke="#000000" strokeWidth="2" />
              </pattern>
            </defs>
            {/* Γραμμοσκιασμένο ορθογώνιο ΑΖΓΒ */}
            <rect x="35" y="30" width="160" height="80" fill="url(#diagonalHatch)" stroke="#000000" strokeWidth="2.2" />
            {/* Τετράγωνο ΒΓΕΔ */}
            <rect x="195" y="30" width="80" height="80" fill="#ffffff" stroke="#000000" strokeWidth="2.2" />

            {/* Σημεία */}
            <circle cx="35" cy="30" r="3.5" fill="#000000" /><text x="25" y="25" fontSize="12" fontWeight="bold" fill="#000000">Ζ</text>
            <circle cx="35" cy="110" r="3.5" fill="#000000" /><text x="20" y="122" fontSize="12" fontWeight="bold" fill="#000000">Α</text>
            <circle cx="195" cy="30" r="3.5" fill="#000000" /><text x="195" y="22" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000000">Γ</text>
            <circle cx="195" cy="110" r="3.5" fill="#000000" /><text x="195" y="125" fontSize="12" fontWeight="bold" textAnchor="middle" fill="#000000">Β</text>
            <circle cx="275" cy="30" r="3.5" fill="#000000" /><text x="285" y="25" fontSize="12" fontWeight="bold" fill="#000000">Ε</text>
            <circle cx="275" cy="110" r="3.5" fill="#000000" /><text x="285" y="122" fontSize="12" fontWeight="bold" fill="#000000">Δ</text>
          </svg>
        </div>
      );
    }

    return null;
  };

  return (
    <Layout
      title="🏛️ Πραγματικά Θέματα 2020 - Πρότυπα Σχολεία | LearnMaths.gr"
      description="Επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία 2020: 25 θέματα Μαθηματικών (026–050), 2 μόρια ανά θέμα (Άριστα: 50 μόρια), χρονόμετρο και αναλυτικές λύσεις."
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
                Επίσημα Θέματα 2020 • 25 Ερωτήσεις Μαθηματικών
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Εξετάσεις Προτύπων 2020
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
              Αποτέλεσμα Εξέτασης 2020
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
          {QUESTIONS_2020.map((q) => {
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
