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

const QUESTIONS_2026 = [
  {
    id: 1,
    officialNumber: 21,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ποιος είναι ο αριθμός x ώστε να ισχύει η παρακάτω ισότητα;',
    customPromptComponent: (
      <div className="flex items-center justify-center gap-1 sm:gap-2 my-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-base sm:text-lg font-mono font-bold text-slate-900 flex-wrap">
        <Fraction num="11" den="2" />
        <span>＋</span>
        <Fraction num="11" den="4" />
        <span>＋</span>
        <Fraction num="11" den="8" />
        <span>＋ x ＝ 11</span>
      </div>
    ),
    options: [
      { key: 'A', label: <span className="inline-flex items-center">x ＝ <Fraction num="1" den="8" /></span>, raw: '1/8' },
      { key: 'B', label: <span className="inline-flex items-center">x ＝ <Fraction num="11" den="16" /></span>, raw: '11/16' },
      { key: 'Γ', label: <span className="inline-flex items-center">x ＝ <Fraction num="11" den="8" /></span>, raw: '11/8' },
      { key: 'Δ', label: <span className="inline-flex items-center">x ＝ <Fraction num="11" den="4" /></span>, raw: '11/4' }
    ],
    correctRaw: '11/8',
    explain: 'Μετατρέπουμε τα κλάσματα σε ομώνυμα με κοινό παρονομαστή το 8: 11/2 = 44/8, 11/4 = 22/8 και 11/8. Το άθροισμά τους είναι (44 + 22 + 11)/8 = 77/8. Το 11 γράφεται ως 88/8. Άρα: x = 88/8 − 77/8 = 11/8.'
  },
  {
    id: 2,
    officialNumber: 22,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ένα ζαχαροπλαστείο προσφέρει παγωτό σε τρεις γεύσεις (σοκολάτα, βανίλια, φράουλα) και δύο είδη σιροπιού (κεράσι ή βύσσινο). Η Χαρά τρώει κάθε μέρα ένα διαφορετικό παγωτό επιλέγοντας δύο διαφορετικές γεύσεις και ένα είδος σιροπιού. Σε πόσες μέρες θα έχει δοκιμάσει όλους τους συνδυασμούς;',
    options: [
      { key: 'A', label: '6', raw: '6' },
      { key: 'B', label: '4', raw: '4' },
      { key: 'Γ', label: '3', raw: '3' },
      { key: 'Δ', label: '5', raw: '5' }
    ],
    correctRaw: '6',
    explain: 'Οι διαφορετικοί συνδυασμοί 2 γεύσεων από τις 3 είναι 3: (σοκολάτα-βανίλια), (σοκολάτα-φράουλα) και (βανίλια-φράουλα). Για καθέναν από τους 3 συνδυασμούς γεύσεων υπάρχουν 2 επιλογές σιροπιού: 3 · 2 = 6 διαφορετικές ημέρες.'
  },
  {
    id: 3,
    officialNumber: 23,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Πόσες διαφορετικές διαδρομές υπάρχουν για να φτάσει κάποιος από την κάτω αριστερή γωνία (Κ) του σχήματος μέχρι την πάνω δεξιά γωνία (Λ) κινούμενος επάνω στις γραμμές του πλέγματος, μόνο προς τα δεξιά ή προς τα πάνω;',
    hasSvg: 'grid23',
    options: [
      { key: 'A', label: '5', raw: '5' },
      { key: 'B', label: '6', raw: '6' },
      { key: 'Γ', label: '8', raw: '8' },
      { key: 'Δ', label: '3', raw: '3' }
    ],
    correctRaw: '6',
    explain: 'Σε πλέγμα 2×2 χρειαζόμαστε 2 κινήσεις δεξιά (Δ) και 2 κινήσεις πάνω (Π). Ο αριθμός των διαφορετικών διαδρομών είναι οι αναγραμματισμοί της λέξης ΔΔΠΠ: 4! / (2! · 2!) = 24 / 4 = 6 διαδρομές.'
  },
  {
    id: 4,
    officialNumber: 24,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Το ΑΒΓΔ είναι ορθογώνιο παραλληλόγραμμο. Στην πλευρά ΑΒ πήραμε σημείο Ε τέτοιο ώστε η γωνία ΑΕΓ να είναι 137°. Πόσες μοίρες είναι η γωνία ΒΓΕ;',
    hasSvg: 'rect24',
    options: [
      { key: 'A', label: '43°', raw: '43' },
      { key: 'B', label: '53°', raw: '53' },
      { key: 'Γ', label: '47°', raw: '47' },
      { key: 'Δ', label: '37°', raw: '37' }
    ],
    correctRaw: '47',
    explain: 'Οι γωνίες ΑΕΓ και ΒΕΓ είναι παραπληρωματικές (ευθεία γωνία 180°): γωνία ΒΕΓ = 180° − 137° = 43°. Στο ορθογώνιο τρίγωνο ΕΒΓ (γωνία Β = 90°), οι οξείες γωνίες είναι συμπληρωματικές: γωνία ΒΓΕ = 90° − 43° = 47°.'
  },
  {
    id: 5,
    officialNumber: 25,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ποιο από τα παρακάτω ραβδογράμματα αντιστοιχεί στο διπλανό κυκλικό διάγραμμα;',
    hasSvg: 'pie25',
    options: [
      { key: 'A', label: 'Ραβδόγραμμα Α', raw: 'A' },
      { key: 'B', label: 'Ραβδόγραμμα Β', raw: 'B' },
      { key: 'Γ', label: 'Ραβδόγραμμα Γ', raw: 'Γ' },
      { key: 'Δ', label: 'Ραβδόγραμμα Δ', raw: 'Δ' }
    ],
    correctRaw: 'Δ',
    explain: 'Στο κυκλικό διάγραμμα ο τομέας Κ είναι ορθή γωνία (90° = 25%). Ο τομέας Λ είναι μεγαλύτερος από το Κ (περίπου 110°-120°, άρα > 30%). Ο τομέας Μ είναι ο υπόλοιπος (> 50%). Επομένως: ύψος Κ < ύψος Λ < ύψος Μ. Το μόνο ραβδόγραμμα που τηρεί αυτή τη σχέση είναι το Δ.'
  },
  {
    id: 6,
    officialNumber: 26,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ο Παναγιώτης είναι 7 χρόνια μεγαλύτερος από την Αφροδίτη. Η Αφροδίτη είναι 7 χρόνια μικρότερη από την Ευαγγελία. Αν ο Παναγιώτης είναι 33 ετών, πόσων ετών είναι η Ευαγγελία;',
    options: [
      { key: 'A', label: '26', raw: '26' },
      { key: 'B', label: '33', raw: '33' },
      { key: 'Γ', label: '40', raw: '40' },
      { key: 'Δ', label: '47', raw: '47' }
    ],
    correctRaw: '33',
    explain: 'Αφροδίτη = 33 − 7 = 26 ετών. Ευαγγελία = 26 + 7 = 33 ετών. Ο Παναγιώτης και η Ευαγγελία έχουν την ίδια ηλικία.'
  },
  {
    id: 7,
    officialNumber: 27,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Τετράγωνο οικόπεδο έχει επιφάνεια 400 τετραγωνικά μέτρα. Για να το περιφράξουμε με συρματόπλεγμα πρέπει να πληρώσουμε 15 ευρώ ανά μέτρο. Ποιο είναι το κόστος της περίφραξης;',
    options: [
      { key: 'A', label: '60.000 ευρώ', raw: '60000' },
      { key: 'B', label: '6.000 ευρώ', raw: '6000' },
      { key: 'Γ', label: '1.200 ευρώ', raw: '1200' },
      { key: 'Δ', label: '300 ευρώ', raw: '300' }
    ],
    correctRaw: '1200',
    explain: 'Η πλευρά του τετραγώνου είναι 20 μέτρα (20 · 20 = 400). Η περίμετρος είναι 4 · 20 = 80 μέτρα. Συνολικό κόστος: 80 · 15 = 1.200 ευρώ.'
  },
  {
    id: 8,
    officialNumber: 28,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Με 4 ίδια ποτήρια νερό γεμίζουν τα 3/5 μιας κανάτας. Με πόσα ποτήρια γεμίζει η μισή κανάτα;',
    options: [
      { key: 'A', label: <span>2 <Fraction num="2" den="5" /> ποτήρια</span>, raw: '2 2/5' },
      { key: 'B', label: '3 ποτήρια', raw: '3' },
      { key: 'Γ', label: <span>3 <Fraction num="1" den="3" /> ποτήρια</span>, raw: '3 1/3' },
      { key: 'Δ', label: <span>3 <Fraction num="2" den="5" /> ποτήρια</span>, raw: '3 2/5' }
    ],
    correctRaw: '3 1/3',
    explain: 'Τα 3/5 της κανάτας απαιτούν 4 ποτήρια, άρα ολόκληρη η κανάτα (5/5) χρειάζεται (4 : 3) · 5 = 20/3 ποτήρια. Η μισή κανάτα (1/2) χρειάζεται (20/3) : 2 = 10/3 ποτήρια = 3 1/3 ποτήρια.'
  },
  {
    id: 9,
    officialNumber: 29,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Ποιος από τους παρακάτω αριθμούς είναι πιο κοντά στο 1;',
    options: [
      { key: 'A', label: <Fraction num="11" den="12" />, raw: '11/12' },
      { key: 'B', label: <Fraction num="12" den="11" />, raw: '12/11' },
      { key: 'Γ', label: '0,9', raw: '0.9' },
      { key: 'Δ', label: '1,101', raw: '1.101' }
    ],
    correctRaw: '11/12',
    explain: 'Αποστάσεις από το 1: |1 − 11/12| = 1/12 ≈ 0,0833. |12/11 − 1| = 1/11 ≈ 0,0909. |1 − 0,9| = 0,1. |1,101 − 1| = 0,101. Η μικρότερη απόσταση είναι το 1/12, άρα το 11/12 είναι πιο κοντά.'
  },
  {
    id: 10,
    officialNumber: 30,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    promptText: 'Σε ένα κουτί υπάρχουν 52 άσπρες και 48 μαύρες σφαίρες. Αν βγάλουμε 40 άσπρες και 40 μαύρες σφαίρες από το κουτί, ποιο από τα παρακάτω είναι σωστό;',
    options: [
      { key: 'A', label: 'Δεν αλλάζει το ποσοστό των άσπρων σφαιρών ούτε το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'A' },
      { key: 'B', label: 'Αυξάνεται το ποσοστό των άσπρων σφαιρών και αυξάνεται το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'B' },
      { key: 'Γ', label: 'Μειώνεται το ποσοστό των άσπρων σφαιρών και αυξάνεται το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'Γ' },
      { key: 'Δ', label: 'Αυξάνεται το ποσοστό των άσπρων σφαιρών και μειώνεται το ποσοστό των μαύρων σφαιρών στο κουτί.', raw: 'Δ' }
    ],
    correctRaw: 'Δ',
    explain: 'Αρχικά: 52 άσπρες στις 100 (52%) και 48 μαύρες στις 100 (48%). Μετά την αφαίρεση: μένουν 12 άσπρες και 8 μαύρες (σύνολο 20). Νέο ποσοστό άσπρων: 12/20 = 60% (αυξήθηκε). Νέο ποσοστό μαύρων: 8/20 = 40% (μειώθηκε).'
  },
  {
    id: 11,
    officialNumber: 31,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Στην παρακάτω αριθμογραμμή, το ευθύγραμμο τμήμα ΚΛ έχει διπλάσιο μήκος από το ΜΛ, ενώ το ΜΝ έχει διπλάσιο μήκος από το ΝΛ. Αν στο Κ αντιστοιχεί ο αριθμός 5 και στο Λ ο αριθμός 35, ποιος αριθμός αντιστοιχεί στο σημείο Ν;',
    hasSvg: 'line31',
    options: [
      { key: 'A', label: '25', raw: '25' },
      { key: 'B', label: '27', raw: '27' },
      { key: 'Γ', label: '30', raw: '30' },
      { key: 'Δ', label: '32', raw: '32' },
      { key: 'E', label: '33', raw: '33' }
    ],
    correctRaw: '25',
    explain: 'Το μήκος ΚΛ είναι 35 − 5 = 30. Αφού ΚΛ = 2 · ΜΛ, έχουμε ΜΛ = 15. Άρα το σημείο Μ είναι στο 35 − 15 = 20. Το τμήμα ΜΛ χωρίζεται από το Ν σε λόγο 2:1 (3 ίσα μέρη του 5). Επομένως ΜΝ = 10 και ΝΛ = 5, άρα στο Ν αντιστοιχεί ο αριθμός 20 + 10 = 30 (ή 35 − 5 = 30).'
  },
  {
    id: 12,
    officialNumber: 32,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Το 1ο δρομολόγιο λεωφορείου από την πόλη Κ προς την πόλη Λ φεύγει στις 6:20 π.μ. Το ταξίδι διαρκεί 3,5 ώρες. Κάθε επόμενο δρομολόγιο φεύγει μετά από 1 ώρα και 10 λεπτά. Αν το τελευταίο δρομολόγιο φτάνει στην πόλη Λ μεταξύ 5:30 μ.μ. με 6:30 μ.μ., τι ώρα έφυγε το τελευταίο δρομολόγιο από την πόλη Κ;',
    options: [
      { key: 'A', label: '2:30 μ.μ.', raw: '2:30' },
      { key: 'B', label: '2:40 μ.μ.', raw: '2:40' },
      { key: 'Γ', label: '2:50 μ.μ.', raw: '2:50' },
      { key: 'Δ', label: '3:00 μ.μ.', raw: '3:00' },
      { key: 'E', label: '3:10 μ.μ.', raw: '3:10' }
    ],
    correctRaw: '2:30',
    explain: 'Προσθέτοντας διαδοχικά 1 ώρα και 10 λεπτά (70 λεπτά): 06:20, 07:30, 08:40, 09:50, 11:00, 12:10, 13:20, 14:30 (2:30 μ.μ.). Αν αναχωρήσει στις 2:30 μ.μ., με διάρκεια 3,5 ώρες φτάνει στις 6:00 μ.μ. (18:00), που είναι ακριβώς μεταξύ 5:30 μ.μ. και 6:30 μ.μ.'
  },
  {
    id: 13,
    officialNumber: 33,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Στο άθλημα της ενόργανης γυμναστικής βαθμολογούν 6 κριτές και η τελική βαθμολογία προκύπτει από τον μέσο όρο των τεσσάρων από αυτούς, καθώς αφαιρούνται ο μεγαλύτερος και ο μικρότερος βαθμός. Αν ο μέσος όρος των 6 κριτών ήταν 8,2 και ο τελικός μέσος όρος (των 4) ήταν 8,3, ποιο ήταν το άθροισμα των βαθμών που αφαιρέθηκαν;',
    options: [
      { key: 'A', label: '16', raw: '16' },
      { key: 'B', label: '16,8', raw: '16.8' },
      { key: 'Γ', label: '17', raw: '17' },
      { key: 'Δ', label: '17,6', raw: '17.6' },
      { key: 'E', label: 'δεν μπορούμε να γνωρίζουμε', raw: 'unknown' }
    ],
    correctRaw: '16',
    explain: 'Το συνολικό άθροισμα των 6 κριτών είναι 6 · 8,2 = 49,2. Το άθροισμα των 4 κριτών είναι 4 · 8,3 = 33,2. Το άθροισμα των 2 βαθμών που αφαιρέθηκαν είναι 49,2 − 33,2 = 16.'
  },
  {
    id: 14,
    officialNumber: 34,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Ένα χαρτόνι σχήματος ορθογωνίου παραλληλογράμμου έχει περίμετρο 50 εκ. Το διπλώνουμε στη μέση και προκύπτει ορθογώνιο παραλληλόγραμμο που έχει περίμετρο 40 εκ. Πόσο είναι το εμβαδόν του αρχικού ορθογωνίου παραλληλογράμμου;',
    options: [
      { key: 'A', label: '200 τ.εκ.', raw: '200' },
      { key: 'B', label: '250 τ.εκ.', raw: '250' },
      { key: 'Γ', label: '400 τ.εκ.', raw: '400' },
      { key: 'Δ', label: '150 τ.εκ.', raw: '150' },
      { key: 'E', label: '600 τ.εκ.', raw: '600' }
    ],
    correctRaw: '150',
    explain: 'Έστω διαστάσεις x και y: 2x + 2y = 50 ➔ x + y = 25. Διπλώνοντας κατά τη μία πλευρά, η νέα περίμετρος είναι x + 2y = 40. Αφαιρώντας κατά μέλη προκύπτει y = 15 εκ., άρα x = 10 εκ. Το εμβαδόν του αρχικού ορθογωνίου είναι 10 · 15 = 150 τ.εκ.'
  },
  {
    id: 15,
    officialNumber: 35,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Σήμερα είναι Σάββατο 25 Απριλίου 2026. Τι μέρα θα είναι η 25η Απριλίου του 2031; (Το έτος 2028 είναι δίσεκτο).',
    options: [
      { key: 'A', label: 'Πέμπτη', raw: 'Πέμπτη' },
      { key: 'B', label: 'Παρασκευή', raw: 'Παρασκευή' },
      { key: 'Γ', label: 'Σάββατο', raw: 'Σάββατο' },
      { key: 'Δ', label: 'Κυριακή', raw: 'Κυριακή' },
      { key: 'E', label: 'Δευτέρα', raw: 'Δευτέρα' }
    ],
    correctRaw: 'Παρασκευή',
    explain: 'Στα 5 έτη έχουμε 4 κοινά έτη (+1 ημέρα έκαστο) και 1 δίσεκτο έτος (+2 ημέρες). Συνολική μετατόπιση: 4 · 1 + 2 = 6 ημέρες μπροστά από το Σάββατο, δηλαδή Παρασκευή.'
  },
  {
    id: 16,
    officialNumber: 36,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Το ισόπλευρο τρίγωνο του σχήματος στα αριστερά αποτελείται από 9 ίσα μεταξύ τους ισόπλευρα τρίγωνα. Χρωματίζουμε ένα μέρος του τριγώνου, όπως στο σχήμα στα δεξιά. Τι κλάσμα του εμβαδού του μεγάλου τριγώνου είναι το χρωματισμένο μέρος;',
    hasSvg: 'triangle36',
    options: [
      { key: 'A', label: <Fraction num="2" den="9" />, raw: '2/9' },
      { key: 'B', label: <Fraction num="3" den="9" />, raw: '3/9' },
      { key: 'Γ', label: <Fraction num="4" den="9" />, raw: '4/9' },
      { key: 'Δ', label: <Fraction num="1" den="2" />, raw: '1/2' },
      { key: 'E', label: <Fraction num="7" den="18" />, raw: '7/18' }
    ],
    correctRaw: '7/18',
    explain: 'Το μεγάλο τρίγωνο αποτελείται από 9 ίσα τριγωνάκια. Το σκιασμένο μέρος περιέχει 3 ολόκληρα τριγωνάκια και το μισό ενός τέταρτου: 3 + 0,5 = 3,5 τριγωνάκια. Το κλάσμα του εμβαδού είναι 3,5 / 9 = 7 / 18.'
  },
  {
    id: 17,
    officialNumber: 37,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Σε ένα Δημοτικό σχολείο φοιτούν 285 μαθητές. Αν οι 138 φοιτούν σε μεγαλύτερη τάξη από τη Γ΄ (Δ΄, Ε΄, ΣΤ΄), ενώ οι 189 φοιτούν σε μικρότερη τάξη από την Ε΄ (Α΄, Β΄, Γ΄, Δ΄), πόσοι μαθητές φοιτούν στη Δ΄ τάξη;',
    options: [
      { key: 'A', label: '39', raw: '39' },
      { key: 'B', label: '42', raw: '42' },
      { key: 'Γ', label: '45', raw: '45' },
      { key: 'Δ', label: '46', raw: '46' },
      { key: 'E', label: '80', raw: '80' }
    ],
    correctRaw: '42',
    explain: 'Οι μαθητές των τάξεων Α΄, Β΄, Γ΄ είναι 285 − 138 = 147. Οι μαθητές των τάξεων Α΄, Β΄, Γ΄, Δ΄ είναι 189. Επομένως στη Δ΄ τάξη φοιτούν 189 − 147 = 42 μαθητές.'
  },
  {
    id: 18,
    officialNumber: 38,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Το πλήρωμα ενός πλοίου έχει τρόφιμα για 6 ημέρες. Αν το πλήρωμα είχε 10 μέλη λιγότερα, θα είχε τρόφιμα για 8 ημέρες. Πόσα είναι τα μέλη του πληρώματος;',
    options: [
      { key: 'A', label: '30', raw: '30' },
      { key: 'B', label: '40', raw: '40' },
      { key: 'Γ', label: '50', raw: '50' },
      { key: 'Δ', label: '60', raw: '60' },
      { key: 'E', label: '80', raw: '80' }
    ],
    correctRaw: '40',
    explain: 'Τα ποσά είναι αντιστρόφως ανάλογα: 6 · x = 8 · (x − 10) ➔ 6x = 8x − 80 ➔ 2x = 80 ➔ x = 40 μέλη.'
  },
  {
    id: 19,
    officialNumber: 39,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Σε μια ταβέρνα κάθισαν 4 οικογένειες (δύο γονείς με τα παιδιά τους). Οι δύο οικογένειες είχαν από δύο παιδιά, μία οικογένεια είχε τρία παιδιά και άλλη μία είχε μόνο ένα παιδί. Στην αρχή σκέφτηκαν να πληρώσουν τον λογαριασμό ανάλογα με τα άτομα. Όμως τελικά συμφώνησαν να πληρώσει κάθε οικογένεια το 1/4 του λογαριασμού. Πόσο % λιγότερο πλήρωσε η οικογένεια με τα τρία παιδιά σε σχέση με την αρχική της υποχρέωση;',
    options: [
      { key: 'A', label: '25%', raw: '25' },
      { key: 'B', label: '20%', raw: '20' },
      { key: 'Γ', label: '16%', raw: '16' },
      { key: 'Δ', label: '6,25%', raw: '6.25' },
      { key: 'E', label: 'Περισσότερο από 25%', raw: 'more' }
    ],
    correctRaw: '20',
    explain: 'Συνολικά άτομα: 4 + 4 + 5 + 3 = 16. Η οικογένεια με τα 5 άτομα αντιστοιχούσε στα 5/16 του λογαριασμού. Τελικά πλήρωσε το 1/4 = 4/16. Η μείωση είναι (5/16 − 4/16) : (5/16) = (1/16) / (5/16) = 1/5 = 20%.'
  },
  {
    id: 20,
    officialNumber: 40,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    promptText: 'Ένα άσπρο ποδήλατο διανύει μια απόσταση 48 χλμ. με ταχύτητα 24 χλμ./ώρα και επιστρέφει με την ίδια ταχύτητα. Ένα μαύρο ποδήλατο ξεκινάει ταυτόχρονα με το άσπρο και διανύει την ίδια διαδρομή με ταχύτητα 30 χλμ./ώρα, αλλά επιστρέφει με 18 χλμ./ώρα. Ποιο από τα δύο θα επιστρέψει πρώτο και πόσο απέχει το επόμενο τη στιγμή του τερματισμού;',
    options: [
      { key: 'A', label: 'Θα φτάσουν ταυτόχρονα', raw: 'same' },
      { key: 'B', label: 'Το μαύρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το άσπρο.', raw: 'black4.8' },
      { key: 'Γ', label: 'Το μαύρο θα φτάσει πρώτο και απέχει 2,4 χλμ. από το άσπρο.', raw: 'black2.4' },
      { key: 'Δ', label: 'Το άσπρο θα φτάσει πρώτο και απέχει 2,4 χλμ. από το μαύρο.', raw: 'white2.4' },
      { key: 'E', label: 'Το άσπρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το μαύρο.', raw: 'white4.8' }
    ],
    correctRaw: 'white4.8',
    explain: 'Το άσπρο κάνει 48/24 + 48/24 = 2 + 2 = 4 ώρες. Το μαύρο χρειάζεται 48/30 = 1,6 ώρες για να πάει. Στις υπόλοιπες 2,4 ώρες επιστρέφει με 18 χλμ./ώρα, διανύοντας 2,4 · 18 = 43,2 χλμ. Απομένουν 48 − 43,2 = 4,8 χλμ. Άρα το άσπρο φτάνει πρώτο και το μαύρο απέχει 4,8 χλμ.'
  }
];

const TOTAL_TIME_SECONDS = 60 * 60; // 60 λεπτά

export default function Themata2026Page() {
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
    QUESTIONS_2026.forEach(q => {
      if (currentAnswers[q.id] === q.correctRaw) {
        s += 2.5; // 2,5 μόρια ανά θέμα
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

  const renderQuestionSvg = (svgType) => {
    if (svgType === 'grid23') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg width="180" height="180" viewBox="0 0 160 160" className="select-none">
            <rect x="20" y="20" width="120" height="120" fill="none" stroke="#334155" strokeWidth="2.5" />
            <line x1="80" y1="20" x2="80" y2="140" stroke="#334155" strokeWidth="2.5" />
            <line x1="20" y1="80" x2="140" y2="80" stroke="#334155" strokeWidth="2.5" />
            {[20, 80, 140].map(x => [20, 80, 140].map(y => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="#0f172a" />
            )))}
            <text x="8" y="152" fill="#0f172a" fontSize="14" fontWeight="bold">Κ</text>
            <text x="146" y="22" fill="#0f172a" fontSize="14" fontWeight="bold">Λ</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'rect24') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg width="260" height="145" viewBox="0 0 250 130" className="select-none">
            <rect x="25" y="25" width="195" height="75" fill="none" stroke="#1e293b" strokeWidth="2.5" />
            <line x1="105" y1="100" x2="220" y2="25" stroke="#1e293b" strokeWidth="2.5" />
            
            <path
              d="M 105 100 L 60 100 A 45 45 0 0 1 138 69.5 Z"
              fill="#cbd5e1"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <text x="70" y="79" fill="#0f172a" fontSize="13" fontWeight="900" fontFamily="sans-serif">137°</text>

            <circle cx="25" cy="100" r="4" fill="#0f172a" /><text x="14" y="118" fontSize="12" fontWeight="bold">Α</text>
            <circle cx="105" cy="100" r="4" fill="#0f172a" /><text x="101" y="118" fontSize="12" fontWeight="bold">Ε</text>
            <circle cx="220" cy="100" r="4" fill="#0f172a" /><text x="225" y="118" fontSize="12" fontWeight="bold">Β</text>
            <circle cx="220" cy="25" r="4" fill="#0f172a" /><text x="225" y="20" fontSize="12" fontWeight="bold">Γ</text>
            <circle cx="25" cy="25" r="4" fill="#0f172a" /><text x="14" y="20" fontSize="12" fontWeight="bold">Δ</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'pie25') {
      return (
        <div className="space-y-4 p-3 sm:p-5 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="flex flex-col items-center">
            <svg width="150" height="150" viewBox="0 0 140 140" className="select-none">
              <defs>
                <pattern id="hatch_diag2" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                  <line x1="0" y1="0" x2="0" y2="6" stroke="#000000" strokeWidth="1.8" />
                </pattern>
              </defs>
              <circle cx="70" cy="70" r="58" fill="#ffffff" stroke="#000000" strokeWidth="2" />
              {/* Τομέας Κ (90°) */}
              <path d="M 70 70 L 70 12 A 58 58 0 0 1 128 70 Z" fill="#000000" />
              {/* Τομέας Λ (μεγαλύτερος) */}
              <path d="M 70 70 L 128 70 A 58 58 0 0 1 52 126 Z" fill="url(#hatch_diag2)" stroke="#000000" strokeWidth="1.2" />
              
              <text x="135" y="32" fill="#000000" fontSize="13" fontWeight="bold">Κ</text>
              <text x="112" y="132" fill="#000000" fontSize="13" fontWeight="bold">Λ</text>
              <text x="20" y="74" fill="#000000" fontSize="14" fontWeight="bold">Μ</text>
            </svg>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-200">
            {[
              { label: 'A', rects: [{x:20, y:55, h:25}, {x:47, y:48, h:32}, {x:74, y:15, h:65}] },
              { label: 'B', rects: [{x:20, y:20, h:60}, {x:47, y:50, h:30}, {x:74, y:20, h:60}] },
              { label: 'Γ', rects: [{x:20, y:48, h:32}, {x:47, y:40, h:40}, {x:74, y:15, h:65}] },
              { label: 'Δ', rects: [{x:20, y:38, h:42}, {x:47, y:48, h:32}, {x:74, y:15, h:65}] }
            ].map((item, idx) => (
              <div key={idx} className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center">
                <svg width="110" height="100" viewBox="0 0 110 100" className="select-none">
                  <line x1="10" y1="80" x2="100" y2="80" stroke="#cbd5e1" strokeWidth="1.5" />
                  {item.rects.map((r, ri) => (
                    <rect key={ri} x={r.x} y={r.y} width="16" height={r.h} fill="#475569" />
                  ))}
                  <text x="28" y="93" fontSize="10" fontWeight="bold" textAnchor="middle">Κ</text>
                  <text x="55" y="93" fontSize="10" fontWeight="bold" textAnchor="middle">Λ</text>
                  <text x="82" y="93" fontSize="10" fontWeight="bold" textAnchor="middle">Μ</text>
                </svg>
                <span className="font-bold text-xs mt-1 text-slate-700">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (svgType === 'line31') {
      return (
        <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
          <svg width="340" height="70" viewBox="0 0 320 70" className="select-none">
            <line x1="20" y1="35" x2="300" y2="35" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            <circle cx="20" cy="35" r="4.5" fill="#1e3a8a" /><text x="16" y="20" fontSize="11" fontWeight="bold">Κ (5)</text>
            <circle cx="160" cy="35" r="4.5" fill="#0f172a" /><text x="156" y="20" fontSize="11" fontWeight="bold">Μ</text>
            <circle cx="253" cy="35" r="5" fill="#b91c1c" /><text x="249" y="20" fontSize="11" fontWeight="black" fill="#b91c1c">Ν (?)</text>
            <circle cx="300" cy="35" r="4.5" fill="#1e3a8a" /><text x="290" y="20" fontSize="11" fontWeight="bold">Λ (35)</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'triangle36') {
      return (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          {/* Αριστερό Σχήμα: 9 ίσα ισόπλευρα τρίγωνα */}
          <div className="flex flex-col items-center">
            <svg width="150" height="135" viewBox="0 0 160 145" className="select-none">
              <polygon points="80,12 10,133 150,133" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />
              <line x1="56.6" y1="52.3" x2="103.3" y2="52.3" stroke="#475569" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="126.6" y2="92.6" stroke="#475569" strokeWidth="2" />
              <line x1="56.6" y1="52.3" x2="103.3" y2="133" stroke="#475569" strokeWidth="2" />
              <line x1="103.3" y1="52.3" x2="56.6" y2="133" stroke="#475569" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="56.6" y2="133" stroke="#475569" strokeWidth="2" />
              <line x1="126.6" y1="92.6" x2="103.3" y2="133" stroke="#475569" strokeWidth="2" />
              {[
                [80, 12],
                [56.6, 52.3], [103.3, 52.3],
                [33.3, 92.6], [80, 92.6], [126.6, 92.6],
                [10, 133], [56.6, 133], [103.3, 133], [150, 133]
              ].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="4.5" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
              ))}
            </svg>
          </div>

          {/* Δεξί Σχήμα: Με 2 συμμετρικές διαγώνιες και σωστά σκιασμένα τα 3,5 τρίγωνα */}
          <div className="flex flex-col items-center">
            <svg width="150" height="135" viewBox="0 0 160 145" className="select-none">
              {/* Λευκό φόντο τριγώνου */}
              <polygon points="80,12 10,133 150,133" fill="#ffffff" stroke="#1e293b" strokeWidth="2.5" />

              {/* 1. Πάνω σκιασμένο τμήμα (πάνω από την πάνω διαγώνιο) */}
              <polygon points="56.6,52.3 103.3,52.3 10,133" fill="#94a3b8" />

              {/* 2. Κάτω σκιασμένο τμήμα (κάτω από την κάτω διαγώνιο) */}
              <polygon points="10,133 103.3,133 126.6,92.6" fill="#94a3b8" />

              {/* Γραμμές βασικού πλέγματος */}
              <line x1="56.6" y1="52.3" x2="103.3" y2="52.3" stroke="#1e293b" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="126.6" y2="92.6" stroke="#1e293b" strokeWidth="2" />
              <line x1="56.6" y1="52.3" x2="103.3" y2="133" stroke="#1e293b" strokeWidth="2" />
              <line x1="103.3" y1="52.3" x2="56.6" y2="133" stroke="#1e293b" strokeWidth="2" />
              <line x1="33.3" y1="92.6" x2="56.6" y2="133" stroke="#1e293b" strokeWidth="2" />
              <line x1="126.6" y1="92.6" x2="103.3" y2="133" stroke="#1e293b" strokeWidth="2" />

              {/* ΟΙ 2 ΔΙΑΓΩΝΙΕΣ ΓΡΑΜΜΕΣ ΤΟΥ ΣΧΗΜΑΤΟΣ */}
              {/* Πάνω διαγώνιος (η κόκκινη γραμμή σου) */}
              <line x1="10" y1="133" x2="103.3" y2="52.3" stroke="#1e293b" strokeWidth="2.5" />
              {/* Κάτω διαγώνιος */}
              <line x1="10" y1="133" x2="126.6" y2="92.6" stroke="#1e293b" strokeWidth="2.5" />

              {/* Κόμβοι (κουκκίδες) */}
              {[
                [80, 12],
                [56.6, 52.3], [103.3, 52.3],
                [33.3, 92.6], [80, 92.6], [126.6, 92.6],
                [10, 133], [56.6, 133], [103.3, 133], [150, 133]
              ].map(([cx, cy], idx) => (
                <circle key={idx} cx={cx} cy={cy} r="4.5" fill="#64748b" stroke="#0f172a" strokeWidth="1.5" />
              ))}
            </svg>
          </div>
        </div>
      );
    }

    return null;
  };
  return (
    <Layout
      title="🏛️ Πραγματικά Θέματα 2026 - Πρότυπα Σχολεία | LearnMaths.gr"
      description="Επίσημα θέματα εξετάσεων εισαγωγής στα Πρότυπα Σχολεία 2026: 20 θέματα, 2,5 μόρια ανά θέμα (0-50 μόρια), χρονόμετρο και αναλυτικές λύσεις."
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
                Επίσημα Θέματα 2026 • 20 Ερωτήσεις
              </span>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight">
                Εξετάσεις Προτύπων 2026
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
              Αποτέλεσμα Εξέτασης 2026
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
          {QUESTIONS_2026.map((q) => {
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

                {/* ΕΙΔΙΚΟ COMPONENT ΕΚΦΩΝΗΣΗΣ (π.χ. Κλάσματα Θέματος 21) */}
                {q.customPromptComponent}

                {/* SVG ΕΑΝ ΥΠΑΡΧΕΙ */}
                {q.hasSvg && renderQuestionSvg(q.hasSvg)}

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
                    <p className="font-medium">{q.explain}</p>
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
