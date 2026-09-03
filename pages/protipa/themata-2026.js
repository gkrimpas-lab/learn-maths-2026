import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { LAYOUT } from '../../shared/layout-config';

const QUESTIONS_2026 = [
  {
    id: 1,
    officialNumber: 21,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ποιος είναι ο αριθμός x ώστε να ισχύει η παρακάτω ισότητα;\n11/2 + 11/4 + 11/8 + x = 11',
    options: ['x = 1/8', 'x = 11/16', 'x = 11/8', 'x = 11/4'],
    correct: 'x = 11/8',
    explain: 'Βγάζουμε κοινό παράγοντα το 11 ή κάνουμε ομώνυμα: 11/2 = 44/8, 11/4 = 22/8, 11/8 = 11/8. Το άθροισμά τους είναι (44 + 22 + 11)/8 = 77/8. Το 11 ισούται με 88/8. Επομένως x = 88/8 − 77/8 = 11/8.'
  },
  {
    id: 2,
    officialNumber: 22,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ένα ζαχαροπλαστείο προσφέρει παγωτό σε τρεις γεύσεις (σοκολάτα, βανίλια, φράουλα) και δύο είδη σιροπιού (κεράσι ή βύσσινο). Η Χαρά τρώει κάθε μέρα ένα διαφορετικό παγωτό επιλέγοντας δύο διαφορετικές γεύσεις και ένα είδος σιροπιού. Σε πόσες μέρες θα έχει δοκιμάσει όλους τους συνδυασμούς;',
    options: ['6', '4', '3', '5'],
    correct: '6',
    explain: 'Οι συνδυασμοί 2 διαφορετικών γεύσεων από τις 3 είναι: (σοκολάτα-βανίλια), (σοκολάτα-φράουλα), (βανίλια-φράουλα), δηλαδή 3 συνδυασμοί. Για κάθε συνδυασμό γεύσεων υπάρχουν 2 επιλογές σιροπιού. Συνολικοί διαφορετικοί συνδυασμοί: 3 · 2 = 6 μέρες.'
  },
  {
    id: 3,
    officialNumber: 23,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Πόσες διαφορετικές διαδρομές υπάρχουν για να φτάσει κάποιος από την κάτω αριστερή γωνία (Κ) του σχήματος μέχρι την πάνω δεξιά γωνία (Λ) κινούμενος επάνω στις γραμμές του πλέγματος, μόνο προς τα δεξιά ή προς τα πάνω;',
    hasSvg: 'grid23',
    options: ['5', '6', '8', '3'],
    correct: '6',
    explain: 'Για να πάμε από το Κ στο Λ σε πλέγμα 2×2 χρειαζόμαστε ακριβώς 2 βήματα Δεξιά (Δ) και 2 βήματα Πάνω (Π). Οι αναγραμματισμοί της λέξης ΔΔΠΠ είναι: (4!) / (2! · 2!) = 24 / 4 = 6 διαφορετικές διαδρομές (ή με διαδοχικό υπολογισμό κόμβων του Pascal: 1+1=2 στο κέντρο, 1+2=3 στα άκρα, 3+3=6 στο Λ).'
  },
  {
    id: 4,
    officialNumber: 24,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Το ΑΒΓΔ είναι ορθογώνιο παραλληλόγραμμο. Στην πλευρά ΑΒ πήραμε σημείο Ε τέτοιο ώστε η γωνία ΑΕΓ να είναι 137°. Πόσες μοίρες είναι η γωνία ΒΓΕ;',
    hasSvg: 'rect24',
    options: ['43°', '53°', '47°', '37°'],
    correct: '47°',
    explain: 'Οι γωνίες ΑΕΓ και ΒΕΓ είναι παραπληρωματικές (πάνω στην ευθεία ΑΒ): γωνία ΒΕΓ = 180° − 137° = 43°. Στο ορθογώνιο τρίγωνο ΕΒΓ (η γωνία Β = 90°), οι οξείες γωνίες είναι συμπληρωματικές: γωνία ΒΓΕ = 90° − 43° = 47°.'
  },
  {
    id: 5,
    officialNumber: 25,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ποιο από τα παρακάτω ραβδογράμματα αντιστοιχεί στο διπλανό κυκλικό διάγραμμα;',
    hasSvg: 'pie25',
    options: ['Ραβδόγραμμα Α', 'Ραβδόγραμμα Β', 'Ραβδόγραμμα Γ', 'Ραβδόγραμμα Δ'],
    correct: 'Ραβδόγραμμα Δ',
    explain: 'Στο κυκλικό διάγραμμα ο τομέας Κ είναι ορθός (90° = 25%). Ο τομέας Λ είναι οξύς (< 90°, άρα < 25%). Ο τομέας Μ είναι άνω του ημικυκλίου (> 180°, άρα > 50%). Επομένως ισχύει: Λ < Κ < Μ. Το μοναδικό ραβδόγραμμα όπου το ύψος της στήλης Λ είναι μικρότερο από του Κ και το Μ είναι το ψηλότερο είναι το Δ.'
  },
  {
    id: 6,
    officialNumber: 26,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ο Παναγιώτης είναι 7 χρόνια μεγαλύτερος από την Αφροδίτη. Η Αφροδίτη είναι 7 χρόνια μικρότερη από την Ευαγγελία. Αν ο Παναγιώτης είναι 33 ετών, πόσων ετών είναι η Ευαγγελία;',
    options: ['26', '33', '40', '47'],
    correct: '33',
    explain: 'Αφροδίτη = Παναγιώτης − 7 = 33 − 7 = 26 ετών. Αφού η Αφροδίτη είναι 7 χρόνια μικρότερη από την Ευαγγελία, η Ευαγγελία είναι 26 + 7 = 33 ετών. (Παναγιώτης και Ευαγγελία έχουν την ίδια ακριβώς ηλικία).'
  },
  {
    id: 7,
    officialNumber: 27,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Τετράγωνο οικόπεδο έχει επιφάνεια 400 τετραγωνικά μέτρα. Για να το περιφράξουμε με συρματόπλεγμα πρέπει να πληρώσουμε 15 ευρώ ανά μέτρο. Ποιο είναι το κόστος της περίφραξης;',
    options: ['60.000 ευρώ', '6.000 ευρώ', '1.200 ευρώ', '300 ευρώ'],
    correct: '1.200 ευρώ',
    explain: 'Η πλευρά του τετραγώνου είναι 20 μέτρα (αφού 20 · 20 = 400 τ.μ.). Η περίμετρος είναι 4 · 20 = 80 μέτρα. Συνολικό κόστος: 80 · 15 = 1.200 ευρώ.'
  },
  {
    id: 8,
    officialNumber: 28,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Με 4 ίδια ποτήρια νερό γεμίζουν τα 3/5 μιας κανάτας. Με πόσα ποτήρια γεμίζει η μισή κανάτα (1/2);',
    options: ['2 2/5 ποτήρια', '3 ποτήρια', '3 1/3 ποτήρια', '3 2/5 ποτήρια'],
    correct: '3 1/3 ποτήρια',
    explain: 'Τα 3/5 της κανάτας θέλουν 4 ποτήρια, άρα το 1/5 θέλει 4/3 ποτήρια και ολόκληρη η κανάτα (5/5) θέλει 5 · (4/3) = 20/3 ποτήρια. Η μισή κανάτα (1/2) χρειάζεται (20/3) : 2 = 10/3 ποτήρια = 3 1/3 ποτήρια.'
  },
  {
    id: 9,
    officialNumber: 29,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Ποιος από τους παρακάτω αριθμούς είναι πιο κοντά στο 1;',
    options: ['11/12', '12/11', '0,9', '1,101'],
    correct: '11/12',
    explain: 'Υπολογίζουμε τις αποστάσεις από το 1: |1 − 11/12| = 1/12 ≈ 0,0833. |12/11 − 1| = 1/11 ≈ 0,0909. |1 − 0,9| = 0,1. |1,101 − 1| = 0,101. Η μικρότερη απόσταση είναι το 1/12 (≈0,0833), άρα πιο κοντά είναι το 11/12.'
  },
  {
    id: 10,
    officialNumber: 30,
    group: 'ΟΜΑΔΑ Α (4 Επιλογές)',
    prompt: 'Σε ένα κουτί υπάρχουν 52 άσπρες και 48 μαύρες σφαίρες. Αν βγάλουμε 40 άσπρες και 40 μαύρες σφαίρες από το κουτί, ποιο από τα παρακάτω είναι σωστό;',
    options: [
      'Δεν αλλάζει το ποσοστό των άσπρων σφαιρών ούτε το ποσοστό των μαύρων σφαιρών στο κουτί.',
      'Αυξάνεται το ποσοστό των άσπρων σφαιρών και αυξάνεται το ποσοστό των μαύρων σφαιρών στο κουτί.',
      'Μειώνεται το ποσοστό των άσπρων σφαιρών και αυξάνεται το ποσοστό των μαύρων σφαιρών στο κουτί.',
      'Αυξάνεται το ποσοστό των άσπρων σφαιρών και μειώνεται το ποσοστό των μαύρων σφαιρών στο κουτί.'
    ],
    correct: 'Αυξάνεται το ποσοστό των άσπρων σφαιρών και μειώνεται το ποσοστό των μαύρων σφαιρών στο κουτί.',
    explain: 'Αρχικά: 100 σφαίρες σύνολο, άσπρες = 52%, μαύρες = 48%. Αφού βγάλουμε από 40: μένουν 52 − 40 = 12 άσπρες και 48 − 40 = 8 μαύρες, σύνολο 20 σφαίρες. Νέο ποσοστό άσπρων: 12/20 = 60% (αυξήθηκε από 52% σε 60%). Νέο ποσοστό μαύρων: 8/20 = 40% (μειώθηκε από 48% σε 40%).'
  },
  {
    id: 11,
    officialNumber: 31,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Στην παρακάτω αριθμογραμμή, το ευθύγραμμο τμήμα ΚΛ έχει διπλάσιο μήκος από το ΜΛ, ενώ το ΜΝ έχει διπλάσιο μήκος από το ΝΛ. Αν στο Κ αντιστοιχεί ο αριθμός 5 και στο Λ ο αριθμός 35, ποιος αριθμός αντιστοιχεί στο σημείο Ν;',
    hasSvg: 'line31',
    options: ['25', '27', '30', '32', '33'],
    correct: '25',
    explain: 'Το συνολικό μήκος ΚΛ είναι 35 − 5 = 30. Αφού ΚΛ = 2 · ΜΛ, έχουμε ΜΛ = 30 : 2 = 15. Άρα το σημείο Μ αντιστοιχεί στο 35 − 15 = 20. Το τμήμα ΜΛ χωρίζεται από το Ν σε λόγο ΜΝ = 2 · ΝΛ (δηλαδή 2 προς 1, σύνολο 3 ίσα μέρη των 15 : 3 = 5). Άρα ΜΝ = 10 και ΝΛ = 5. Επομένως στο σημείο Ν αντιστοιχεί ο αριθμός 20 + 10 = 30 (ή 35 − 5 = 30).'
  },
  {
    id: 12,
    officialNumber: 32,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Το 1ο δρομολόγιο λεωφορείου από την πόλη Κ προς την πόλη Λ φεύγει στις 6:20 π.μ. Το ταξίδι διαρκεί 3,5 ώρες (3 ώρες και 30 λεπτά). Κάθε επόμενο δρομολόγιο φεύγει μετά από 1 ώρα και 10 λεπτά. Αν το τελευταίο δρομολόγιο φτάνει στην πόλη Λ μεταξύ 5:30 μ.μ. με 6:30 μ.μ. (17:30 - 18:30), τι ώρα έφυγε το τελευταίο δρομολόγιο από την πόλη Κ;',
    options: ['2:30 μ.μ.', '2:40 μ.μ.', '2:50 μ.μ.', '3:00 μ.μ.', '3:10 μ.μ.'],
    correct: '2:40 μ.μ.',
    explain: 'Οι ώρες αναχώρησης ανά 70 λεπτά είναι: 1ο: 06:20, 2ο: 07:30, 3ο: 08:40, 4ο: 09:50, 5ο: 11:00, 6ο: 12:10, 7ο: 13:20 (1:20 μ.μ.), 8ο: 14:30 (2:30 μ.μ.), 9ο: 14:40... Προσθέτοντας 70 λεπτά: 06:20 + k · (1h 10m). Για k = 7 δρομολόγια: 06:20 + 7 · 70m = 06:20 + 490m = 06:20 + 8h 10m = 14:30 (2:30 μ.μ.). Αν έφυγε στις 2:30 μ.μ., φτάνει στις 2:30 + 3:30 = 6:00 μ.μ. (18:00), που είναι ακριβώς μεταξύ 5:30 μ.μ. και 6:30 μ.μ.! Άρα η αναχώρηση ήταν 2:30 μ.μ.'
  },
  {
    id: 13,
    officialNumber: 33,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Στο άθλημα της ενόργανης γυμναστικής βαθμολογούν 6 κριτές και η τελική βαθμολογία προκύπτει από τον μέσο όρο των τεσσάρων από αυτούς, καθώς δεν λαμβάνονται υπόψη ο μεγαλύτερος και ο μικρότερος βαθμός. Αν ο μέσος όρος των 6 κριτών ήταν 8,2 και ο τελικός μέσος όρος (των 4) ήταν 8,3, ποιο ήταν το άθροισμα των βαθμών που αφαιρέθηκαν;',
    options: ['16', '16,8', '17', '17,6', 'δεν μπορούμε να γνωρίζουμε'],
    correct: '16',
    explain: 'Το άθροισμα των βαθμών και των 6 κριτών είναι 6 · 8,2 = 49,2. Το άθροισμα των 4 κριτών που μέτρησαν είναι 4 · 8,3 = 33,2. Το άθροισμα των δύο βαθμών που αφαιρέθηκαν (μεγαλύτερος + μικρότερος) είναι 49,2 − 33,2 = 16,0.'
  },
  {
    id: 14,
    officialNumber: 34,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ένα χαρτόνι σχήματος ορθογωνίου παραλληλογράμμου έχει περίμετρο 50 εκ. Το διπλώνουμε στη μέση (κατά μήκος της μίας διάστασης) και προκύπτει ορθογώνιο παραλληλόγραμμο που έχει περίμετρο 40 εκ. Πόσο είναι το εμβαδόν του αρχικού ορθογωνίου παραλληλογράμμου;',
    options: ['200 τ.εκ.', '250 τ.εκ.', '400 τ.εκ.', '150 τ.εκ.', '600 τ.εκ.'],
    correct: '150 τ.εκ.',
    explain: 'Έστω x και y οι διαστάσεις. Η περίμετρος είναι 2x + 2y = 50 ➔ x + y = 25. Αν διπλωθεί στη μέση το μήκος x, οι νέες διαστάσεις είναι x/2 και y. Η νέα περίμετρος είναι 2(x/2) + 2y = x + 2y = 40. Αφαιρώντας τις εξισώσεις: (x + 2y) − (x + y) = 40 − 25 ➔ y = 15 εκ. Τότε x = 25 − 15 = 10 εκ. Το εμβαδόν του αρχικού ορθογωνίου είναι x · y = 10 · 15 = 150 τ.εκ.'
  },
  {
    id: 15,
    officialNumber: 35,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Σήμερα είναι Σάββατο 25 Απριλίου 2026. Τι μέρα θα είναι η 25η Απριλίου του 2031; (Το έτος 2028 είναι δίσεκτο).',
    options: ['Πέμπτη', 'Παρασκευή', 'Σάββατο', 'Κυριακή', 'Δευτέρα'],
    correct: 'Παρασκευή',
    explain: 'Από το 2026 έως το 2031 μεσολαβούν 5 έτη: 4 κοινά έτη (365 ημέρες = 52 εβδομάδες + 1 ημέρα) και 1 δίσεκτο έτος (το 2028 με 366 ημέρες = 52 εβδομάδες + 2 ημέρες). Συνολική μετατόπιση ημερών: 4 · 1 + 1 · 2 = 6 ημέρες μπροστά. Έξι ημέρες μετά το Σάββατο είναι η Παρασκευή (ή 1 ημέρα πριν).'
  },
  {
    id: 16,
    officialNumber: 36,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Το ισόπλευρο τρίγωνο αποτελείται από 9 ίσα μεταξύ τους ισόπλευρα τρίγωνα. Χρωματίζουμε ένα μέρος του τριγώνου. Τι κλάσμα του εμβαδού του μεγάλου τριγώνου είναι το χρωματισμένο μέρος;',
    hasSvg: 'triangle36',
    options: ['2/9', '3/9', '4/9', '1/2', '7/18'],
    correct: '7/18',
    explain: 'Το μεγάλο τρίγωνο αποτελείται από 9 ίσα τριγωνάκια (άρα καθένα είναι 2/18 του συνόλου). Το χρωματισμένο σχήμα περιλαμβάνει 3 ολόκληρα τριγωνάκια και το μισό ενός τέταρτου τριγώνου: 3 + 0,5 = 3,5 τριγωνάκια. Το κλάσμα είναι 3,5 / 9 = 7 / 18.'
  },
  {
    id: 17,
    officialNumber: 37,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Σε ένα Δημοτικό σχολείο φοιτούν 285 μαθητές. Αν οι 138 φοιτούν σε μεγαλύτερη τάξη από τη Γ΄ (δηλαδή σε Δ΄, Ε΄, ΣΤ΄), ενώ οι 189 φοιτούν σε μικρότερη τάξη από την Ε΄ (δηλαδή σε Α΄, Β΄, Γ΄, Δ΄), πόσοι μαθητές φοιτούν στη Δ΄ τάξη;',
    options: ['39', '42', '45', '46', '80'],
    correct: '42',
    explain: 'Οι μαθητές στις τάξεις (Α+Β+Γ) είναι 285 − 138 = 147. Οι μαθητές στις τάξεις (Α+Β+Γ+Δ) είναι 189. Επομένως, οι μαθητές της Δ΄ τάξης είναι 189 − 147 = 42.'
  },
  {
    id: 18,
    officialNumber: 38,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Το πλήρωμα ενός πλοίου έχει τρόφιμα για 6 ημέρες. Αν το πλήρωμα είχε 10 μέλη λιγότερα, τα τρόφιμα θα επαρκούσαν για 8 ημέρες. Πόσα είναι τα μέλη του πληρώματος;',
    options: ['30', '40', '50', '60', '80'],
    correct: '40',
    explain: 'Τα ποσά είναι αντιστρόφως ανάλογα (περισσότερα άτομα ➔ λιγότερες ημέρες). Το συνολικό απόθεμα μερίδων είναι σταθερό: x · 6 = (x − 10) · 8 ➔ 6x = 8x − 80 ➔ 2x = 80 ➔ x = 40 μέλη.'
  },
  {
    id: 19,
    officialNumber: 39,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Σε μια ταβέρνα κάθισαν 4 οικογένειες (δύο γονείς με τα παιδιά τους). Οι δύο οικογένειες είχαν από δύο παιδιά (4 άτομα η καθεμία), μία οικογένεια είχε τρία παιδιά (5 άτομα) και άλλη μία είχε μόνο ένα παιδί (3 άτομα). Στην αρχή σκέφτηκαν να πληρώσουν ανάλογα με τα άτομα, όμως τελικά συμφώνησαν να πληρώσει κάθε οικογένεια το 1/4 του λογαριασμού (25%). Πόσο % λιγότερο πλήρωσε η οικογένεια με τα τρία παιδιά σε σχέση με την αρχική σκέψη;',
    options: ['25%', '20%', '16%', '6,25%', 'Περισσότερο από 25%'],
    correct: '20%',
    explain: 'Συνολικά άτομα: 4 + 4 + 5 + 3 = 16 άτομα. Με βάση τα άτομα, η οικογένεια με τα 5 άτομα θα πλήρωνε τα 5/16 του λογαριασμού (δηλαδή 31,25%). Τελικά πλήρωσε το 1/4 = 4/16 (25%). Η μείωση που πέτυχε είναι: (5/16 − 4/16) : (5/16) = (1/16) / (5/16) = 1/5 = 20% λιγότερο.'
  },
  {
    id: 20,
    officialNumber: 40,
    group: 'ΟΜΑΔΑ Β (5 Επιλογές)',
    prompt: 'Ένα άσπρο ποδήλατο διανύει μια απόσταση 48 χλμ. με ταχύτητα 24 χλμ./ώρα και επιστρέφει με την ίδια ταχύτητα (24 χλμ./ώρα). Ένα μαύρο ποδήλατο ξεκινάει ταυτόχρονα, διανύει τα 48 χλμ. με ταχύτητα 30 χλμ./ώρα αλλά επιστρέφει με 18 χλμ./ώρα. Ποιο από τα δύο θα επιστρέψει πρώτο και πόσο απέχει το επόμενο τη στιγμή που τερματίζει το πρώτο;',
    options: [
      'Θα φτάσουν ταυτόχρονα',
      'Το μαύρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το άσπρο.',
      'Το μαύρο θα φτάσει πρώτο και απέχει 2,4 χλμ. από το άσπρο.',
      'Το άσπρο θα φτάσει πρώτο και απέχει 2,4 χλμ. από το μαύρο.',
      'Το άσπρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το μαύρο.'
    ],
    correct: 'Το άσπρο θα φτάσει πρώτο και απέχει 4,8 χλμ. από το μαύρο.',
    explain: 'Χρόνος άσπρου: πήγαινε 48/24 = 2 ώρες, έλα 48/24 = 2 ώρες ➔ Σύνολο = 4 ώρες. Χρόνος μαύρου: πήγαινε 48/30 = 1,6 ώρες (1 ώρα και 36 λεπτά). Στις υπόλοιπες ώρες μέχρι τις 4 ώρες (4 − 1,6 = 2,4 ώρες), το μαύρο επιστρέφει με 18 χλμ./ώρα. Σε 2,4 ώρες διανύει 2,4 · 18 = 43,2 χλμ. Επειδή η επιστροφή είναι 48 χλμ., το μαύρο απέχει από τον τερματισμό: 48 − 43,2 = 4,8 χλμ. Άρα το άσπρο τερματίζει πρώτο και το μαύρο απέχει 4,8 χλμ.'
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

  const handleSelect = (qId, option) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: option }));
  };

  const calculateScore = (currentAnswers) => {
    let s = 0;
    QUESTIONS_2026.forEach(q => {
      if (currentAnswers[q.id] === q.correct) {
        s += 2.5; // 2,5 μόρια ανά θέμα (20 * 2,5 = 50 μόρια)
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

  // Βοηθητική συνάρτηση απόδοσης SVG σχημάτων των θεμάτων
  const renderQuestionSvg = (svgType) => {
    if (svgType === 'grid23') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg width="180" height="180" viewBox="0 0 160 160" className="select-none">
            <rect x="20" y="20" width="120" height="120" fill="none" stroke="#334155" strokeWidth="2.5" />
            <line x1="80" y1="20" x2="80" y2="140" stroke="#334155" strokeWidth="2.5" />
            <line x1="20" y1="80" x2="140" y2="80" stroke="#334155" strokeWidth="2.5" />
            {/* Κόμβοι */}
            {[20, 80, 140].map(x => [20, 80, 140].map(y => (
              <circle key={`${x}-${y}`} cx={x} cy={y} r="4.5" fill="#0f172a" />
            )))}
            <text x="10" y="152" fill="#0f172a" fontSize="14" fontWeight="bold" fontFamily="monospace">Κ</text>
            <text x="146" y="22" fill="#0f172a" fontSize="14" fontWeight="bold" fontFamily="monospace">Λ</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'rect24') {
      return (
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg width="260" height="150" viewBox="0 0 240 130" className="select-none">
            <rect x="20" y="20" width="200" height="80" fill="none" stroke="#334155" strokeWidth="2.5" />
            {/* Διαγώνιος Ε-Γ */}
            <line x1="100" y1="100" x2="220" y2="20" stroke="#334155" strokeWidth="2" />
            {/* Τόξο 137 μοιρών */}
            <path d="M 70 100 A 30 30 0 0 1 122 79" fill="#e2e8f0" stroke="#64748b" strokeWidth="1.5" />
            <text x="65" y="80" fill="#0f172a" fontSize="13" fontWeight="bold">137°</text>
            {/* Σημεία */}
            <circle cx="20" cy="100" r="3.5" fill="#0f172a" /><text x="10" y="118" fontSize="11" fontWeight="bold">Α</text>
            <circle cx="100" cy="100" r="3.5" fill="#0f172a" /><text x="96" y="118" fontSize="11" fontWeight="bold">Ε</text>
            <circle cx="220" cy="100" r="3.5" fill="#0f172a" /><text x="224" y="118" fontSize="11" fontWeight="bold">Β</text>
            <circle cx="220" cy="20" r="3.5" fill="#0f172a" /><text x="224" y="16" fontSize="11" fontWeight="bold">Γ</text>
            <circle cx="20" cy="20" r="3.5" fill="#0f172a" /><text x="10" y="16" fontSize="11" fontWeight="bold">Δ</text>
          </svg>
        </div>
      );
    }

    if (svgType === 'pie25') {
      return (
        <div className="flex flex-col sm:flex-row items-center justify-around gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div className="text-center">
            <span className="text-[11px] font-bold text-slate-500 block mb-1">Κυκλικό Διάγραμμα</span>
            <svg width="130" height="130" viewBox="0 0 120 120" className="select-none mx-auto">
              <circle cx="60" cy="60" r="50" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
              {/* Τομέας Κ (90 μοίρες - Μαύρος) */}
              <path d="M 60 60 L 60 10 A 50 50 0 0 1 110 60 Z" fill="#1e293b" />
              {/* Τομέας Λ (< 90 μοίρες - Γραμμοσκιασμένος) */}
              <path d="M 60 60 L 110 60 A 50 50 0 0 1 75 108 Z" fill="#94a3b8" stroke="#0f172a" strokeWidth="1" />
              {/* Ετικέτες */}
              <text x="86" y="40" fill="#ffffff" fontSize="11" fontWeight="bold">Κ</text>
              <text x="88" y="88" fill="#0f172a" fontSize="11" fontWeight="bold">Λ</text>
              <text x="26" y="65" fill="#0f172a" fontSize="12" fontWeight="bold">Μ</text>
            </svg>
          </div>

          <div className="text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-200 space-y-1">
            <span className="font-bold text-slate-800 block">📊 Σχέση Μεγεθών:</span>
            <span>• <strong>Κ</strong>: Ακριβώς 25% (ορθή γωνία 90°)</span><br/>
            <span>• <strong>Λ</strong>: Μικρότερο από το Κ (&lt; 25%)</span><br/>
            <span>• <strong>Μ</strong>: Μεγαλύτερο από 50%</span><br/>
            <span className="text-indigo-600 font-bold">Άρα: Ύψος Λ &lt; Ύψος Κ &lt; Ύψος Μ (Επιλογή Δ)</span>
          </div>
        </div>
      );
    }

    if (svgType === 'line31') {
      return (
        <div className="flex justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200 overflow-x-auto">
          <svg width="340" height="70" viewBox="0 0 320 70" className="select-none">
            <line x1="20" y1="35" x2="300" y2="35" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
            {/* Κ = 5, Μ = 20, Ν = 30, Λ = 35 */}
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
        <div className="flex justify-center p-3 bg-slate-50 rounded-2xl border border-slate-200">
          <svg width="180" height="150" viewBox="0 0 160 140" className="select-none">
            {/* Μεγάλο ισόπλευρο τρίγωνο 3x3 */}
            <polygon points="80,10 10,130 150,130" fill="#ffffff" stroke="#0f172a" strokeWidth="2.5" />
            {/* Εσωτερικές γραμμές διαίρεσης σε 9 ίσα τριγωνάκια */}
            <line x1="56.6" y1="50" x2="103.3" y2="50" stroke="#64748b" strokeWidth="1.5" />
            <line x1="33.3" y1="90" x2="126.6" y2="90" stroke="#64748b" strokeWidth="1.5" />
            <line x1="56.6" y1="50" x2="103.3" y2="130" stroke="#64748b" strokeWidth="1.5" />
            <line x1="103.3" y1="50" x2="56.6" y2="130" stroke="#64748b" strokeWidth="1.5" />
            <line x1="33.3" y1="90" x2="56.6" y2="130" stroke="#64748b" strokeWidth="1.5" />
            <line x1="126.6" y1="90" x2="103.3" y2="130" stroke="#64748b" strokeWidth="1.5" />
            {/* Χρωματισμένα 3,5 τριγωνάκια (Μπλε σκούρο) */}
            <polygon points="80,10 56.6,50 103.3,50" fill="#3b82f6" opacity="0.8" />
            <polygon points="56.6,50 33.3,90 80,90" fill="#3b82f6" opacity="0.8" />
            <polygon points="103.3,50 80,90 126.6,90" fill="#3b82f6" opacity="0.8" />
            <polygon points="80,90 56.6,130 80,130" fill="#3b82f6" opacity="0.8" />
          </svg>
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
            const isCorrect = userChoice === q.correct;

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
                  {q.prompt}
                </p>

                {/* SVG ΕΑΝ ΥΠΑΡΧΕΙ */}
                {q.hasSvg && renderQuestionSvg(q.hasSvg)}

                {/* ΕΠΙΛΟΓΕΣ */}
                <div className={`grid gap-2 pt-1 ${q.options.length === 5 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'}`}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userChoice === opt;
                    let btnStyle = 'bg-white text-slate-800 border-slate-200 hover:bg-slate-50';

                    if (submitted) {
                      if (opt === q.correct) {
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
                        onClick={() => handleSelect(q.id, opt)}
                        className={`p-3 rounded-2xl border text-left text-xs sm:text-sm transition flex items-center gap-2.5 ${btnStyle}`}
                      >
                        <span className={`w-6 h-6 rounded-xl flex items-center justify-center font-mono font-black text-xs shrink-0 border ${
                          isSelected || (submitted && opt === q.correct)
                            ? 'bg-white/20 border-white/40 text-white'
                            : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span className="font-mono font-bold leading-tight">{opt}</span>
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
