// data/st-dimotikou.js

export const ST_DIMOTIKOU_SECTIONS = [
  { 
    id: 'sec1', 
    title: 'Ενότητα 1: Φυσικοί & Δεκαδικοί Αριθμοί - Πράξεις',
    titleEn: 'Unit 1: Natural & Decimal Numbers - Operations',
    category: 'Αριθμητική & Πράξεις'
  },
  { 
    id: 'sec2', 
    title: 'Ενότητα 2: Διαιρετότητα, ΜΚΔ, ΕΚΠ & Κλάσματα',
    titleEn: 'Unit 2: Divisibility, GCD, LCM & Fractions',
    category: 'Κλάσματα & Διαιρετότητα'
  },
  { 
    id: 'sec3', 
    title: 'Ενότητα 3: Εξισώσεις & Μεταβλητές',
    titleEn: 'Unit 3: Equations & Variables',
    category: 'Άλγεβρα & Εξισώσεις'
  },
  { 
    id: 'sec4', 
    title: 'Ενότητα 4: Λόγοι, Αναλογίες & Ποσοστά',
    titleEn: 'Unit 4: Ratios, Proportions & Percentages',
    category: 'Αναλογίες & Ποσοστά'
  },
  { 
    id: 'sec5', 
    title: 'Ενότητα 5: Στατιστική, Μοτίβα, Γεωμετρία & Μετρήσεις',
    titleEn: 'Unit 5: Statistics, Patterns, Geometry & Measurements',
    category: 'Γεωμετρία & Στατιστική'
  },
];

export const ST_DIMOTIKOU_MODULES = [
  // --- ΕΝΟΤΗΤΑ 1: ΑΡΙΘΜΟΙ & ΠΡΑΞΕΙΣ ---
  { 
    id: '01-fysikoi', 
    section: 'sec1', 
    label: '🔢 1. Φυσικοί αριθμοί', 
    labelEn: '🔢 1. Natural numbers',
    href: '/st-dimotikou/01-fysikoi',
    keywords: ['ασκήσεις μαθηματικά', 'φυσικοί αριθμοί']
  },
  { 
    id: '02-dekadikoi', 
    section: 'sec1', 
    label: '🪙 2. Δεκαδικοί αριθμοί', 
    labelEn: '🪙 2. Decimal numbers',
    href: '/st-dimotikou/02-dekadikoi',
    keywords: ['ασκήσεις μαθηματικά', 'δεκαδικοί αριθμοί']
  },
  { 
    id: '03-arithmoi-dekadika-klasmata', 
    section: 'sec1', 
    label: '🔄 3. Μετατροπή δεκαδικών σε δεκαδικά κλάσματα', 
    labelEn: '🔄 3. Converting decimals to decimal fractions',
    href: '/st-dimotikou/03-arithmoi-dekadika-klasmata',
    keywords: ['δεκαδικά κλάσματα', 'μετατροπή κλασμάτων']
  },
  { 
    id: '04-sigkrisi-arithmon', 
    section: 'sec1', 
    label: '⚖️ 4. Σύγκριση και διάταξη δεκαδικών αριθμών', 
    labelEn: '⚖️ 4. Comparing and ordering decimals',
    href: '/st-dimotikou/04-sigkrisi-arithmon',
    keywords: ['σύγκριση δεκαδικών', 'διάταξη αριθμών']
  },
  { 
    id: '05-prosthesi', 
    section: 'sec1', 
    label: '➕ 5. Πρόσθεση φυσικών και δεκαδικών αριθμών', 
    labelEn: '➕ 5. Adding whole and decimal numbers',
    href: '/st-dimotikou/05-prosthesi',
    keywords: ['ασκήσεις μαθηματικών', 'πρόσθεση δεκαδικών']
  },
  { 
    id: '06-pollaplasiasmos', 
    section: 'sec1', 
    label: '✖️ 6. Πολλαπλασιασμός φυσικών και δεκαδικών', 
    labelEn: '✖️ 6. Multiplying whole and decimal numbers',
    href: '/st-dimotikou/06-pollaplasiasmos',
    keywords: ['ασκήσεις μαθηματικών', 'πολλαπλασιασμός δεκαδικών']
  },
  { 
    id: '07-pollaplasiasmos-dinameis-deka', 
    section: 'sec1', 
    label: '⚡ 7. Πολλαπλασιασμός με δυνάμεις του 10', 
    labelEn: '⚡ 7. Multiplying by powers of 10',
    href: '/st-dimotikou/07-pollaplasiasmos-dinameis-deka',
    keywords: ['δυνάμεις του 10', 'πολλαπλασιασμός με 10']
  },
  { 
    id: '08-diairesi', 
    section: 'sec1', 
    label: '➗ 8. Διαίρεση φυσικών και δεκαδικών αριθμών', 
    labelEn: '➗ 8. Division of whole and decimal numbers',
    href: '/st-dimotikou/08-diairesi',
    keywords: ['ασκήσεις μαθηματικά', 'κάθετη διαίρεση', 'διαίρεση δεκαδικών']
  },
  { 
    id: '09-diairesi-dinameis-deka', 
    section: 'sec1', 
    label: '📉 9. Διαίρεση με δυνάμεις του 10', 
    labelEn: '📉 9. Dividing by powers of 10',
    href: '/st-dimotikou/09-diairesi-dinameis-deka',
    keywords: ['διαίρεση με δυνάμεις του 10', 'διαίρεση με 10 100 1000']
  },
  { 
    id: '10-proteraiotita-prakseon', 
    section: 'sec1', 
    label: '🧮 10. Προτεραιότητα των πράξεων', 
    labelEn: '🧮 10. Order of operations',
    href: '/st-dimotikou/10-proteraiotita-prakseon',
    keywords: ['ασκήσεις άλγεβρα', 'προτεραιότητα πράξεων', 'αριθμητικές παραστάσεις']
  },
  { 
    id: '11-problimata', 
    section: 'sec1', 
    label: '💡 11. Στρατηγικές επίλυσης προβλημάτων', 
    labelEn: '💡 11. Problem-solving strategies',
    href: '/st-dimotikou/11-problimata',
    keywords: ['προβλήματα μαθηματικών', 'θέματα πρότυπα']
  },
  { 
    id: '12-stroggilopoiisi', 
    section: 'sec1', 
    label: '🎯 12. Στρογγυλοποίηση αριθμών', 
    labelEn: '🎯 12. Rounding numbers',
    href: '/st-dimotikou/12-stroggilopoiisi',
    keywords: ['στρογγυλοποίηση', 'ασκήσεις μαθηματικών']
  },

  // --- ΕΝΟΤΗΤΑ 2: ΔΙΑΙΡΕΤΟΤΗΤΑ, ΜΚΔ, ΕΚΠ & ΚΛΑΣΜΑΤΑ ---
  { 
    id: '13-diairetes', 
    section: 'sec2', 
    label: '🛡️ 13. Διαιρέτες φυσικού αριθμού', 
    labelEn: '🛡️ 13. Divisors of a natural number',
    href: '/st-dimotikou/13-diairetes',
    keywords: ['διαιρέτες', 'ασκήσεις άλγεβρα']
  },
  { 
    id: '14-mkd', 
    section: 'sec2', 
    label: '👑 14. Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)', 
    labelEn: '👑 14. Greatest Common Divisor (GCD)',
    href: '/st-dimotikou/14-mkd',
    keywords: ['ασκήσεις μαθηματικά', 'ΜΚΔ', 'μέγιστος κοινός διαιρέτης', 'θέματα πρότυπα']
  },
  { 
    id: '15-kritiria-diairetotitas', 
    section: 'sec2', 
    label: '🔍 15. Κριτήρια διαιρετότητας', 
    labelEn: '🔍 15. Divisibility rules',
    href: '/st-dimotikou/15-kritiria-diairetotitas',
    keywords: ['κριτήρια διαιρετότητας', 'διαιρετότητα']
  },
  { 
    id: '16-protoi', 
    section: 'sec2', 
    label: '💎 16. Πρώτοι και σύνθετοι αριθμοί', 
    labelEn: '💎 16. Prime and composite numbers',
    href: '/st-dimotikou/16-protoi',
    keywords: ['πρώτοι αριθμοί', 'σύνθετοι αριθμοί']
  },
  { 
    id: '17-paragontopoiisi', 
    section: 'sec2', 
    label: '🌳 17. Ανάλυση σε γινόμενο πρώτων παραγόντων', 
    labelEn: '🌳 17. Prime factorization',
    href: '/st-dimotikou/17-paragontopoiisi',
    keywords: ['ασκήσεις άλγεβρα', 'πρώτοι παράγοντες', 'παραγοντοποίηση']
  },
  { 
    id: '18-pollaplasia', 
    section: 'sec2', 
    label: '📈 18. Πολλαπλάσια φυσικού αριθμού', 
    labelEn: '📈 18. Multiples of a natural number',
    href: '/st-dimotikou/18-pollaplasia',
    keywords: ['πολλαπλάσια', 'ασκήσεις μαθηματικά']
  },
  { 
    id: '19-ekp', 
    section: 'sec2', 
    label: '🎯 19. Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.)', 
    labelEn: '🎯 19. Least Common Multiple (LCM)',
    href: '/st-dimotikou/19-ekp',
    keywords: ['ασκήσεις μαθηματικά', 'ΕΚΠ', 'ελάχιστο κοινό πολλαπλάσιο', 'θέματα πρότυπα']
  },
  { 
    id: '20-ekp-protoi', 
    section: 'sec2', 
    label: '⚙️ 20. Υπολογισμός Ε.Κ.Π. με πρώτους παράγοντες', 
    labelEn: '⚙️ 20. Finding LCM using prime factorization',
    href: '/st-dimotikou/20-ekp-protoi',
    keywords: ['ΕΚΠ με πρώτους παράγοντες', 'υπολογισμός ΕΚΠ']
  },
  { 
    id: '21-dinameis', 
    section: 'sec2', 
    label: '💪 21. Η έννοια της δύναμης (Δυνάμεις φυσικών)', 
    labelEn: '💪 21. Concept of exponents and powers',
    href: '/st-dimotikou/21-dinameis',
    keywords: ['δυνάμεις', 'εκθέτης', 'ασκήσεις άλγεβρα']
  },
  { 
    id: '22-dinameis-deka', 
    section: 'sec2', 
    label: '🚀 22. Δυνάμεις του 10', 
    labelEn: '🚀 22. Powers of 10',
    href: '/st-dimotikou/22-dinameis-deka',
    keywords: ['δυνάμεις του 10', 'μεγάλοι αριθμοί']
  },
  { 
    id: '23-klasma', 
    section: 'sec2', 
    label: '🍕 23. Η έννοια του κλάσματος και είδη κλασμάτων', 
    labelEn: '🍕 23. Concept and types of fractions',
    href: '/st-dimotikou/23-klasma',
    keywords: ['κλάσματα', 'είδη κλασμάτων', 'ασκήσεις μαθηματικών']
  },
  { 
    id: '24-klasma-se-dekadiko', 
    section: 'sec2', 
    label: '📊 24. Μετατροπή κλάσματος σε δεκαδικό αριθμό', 
    labelEn: '📊 24. Converting fractions to decimals',
    href: '/st-dimotikou/24-klasma-se-dekadiko',
    keywords: ['μετατροπή κλάσματος', 'δεκαδικός αριθμός']
  },
  { 
    id: '25-isodinama-klasmata', 
    section: 'sec2', 
    label: '🪞 25. Ισοδύναμα κλάσματα και απλοποίηση', 
    labelEn: '🪞 25. Equivalent fractions and simplification',
    href: '/st-dimotikou/25-isodinama-klasmata',
    keywords: ['ισοδύναμα κλάσματα', 'απλοποίηση κλασμάτων', 'ασκήσεις άλγεβρα']
  },
  { 
    id: '26-sigkrisi-klasmaton', 
    section: 'sec2', 
    label: '⚖️ 26. Σύγκριση και διάταξη κλασμάτων', 
    labelEn: '⚖️ 26. Comparing and ordering fractions',
    href: '/st-dimotikou/26-sigkrisi-klasmaton',
    keywords: ['σύγκριση κλασμάτων', 'ομώνυμα κλάσματα', 'ετερώνυμα κλάσματα']
  },
  { 
    id: '27-prosthesi-klasmaton', 
    section: 'sec2', 
    label: '➕ 27. Πρόσθεση κλασμάτων', 
    labelEn: '➕ 27. Addition of fractions',
    href: '/st-dimotikou/27-prosthesi-klasmaton',
    keywords: ['ασκήσεις μαθηματικά', 'πρόσθεση κλασμάτων', 'ετερώνυμα κλάσματα']
  },
  { 
    id: '28-afairesi-klasmaton', 
    section: 'sec2', 
    label: '➖ 28. Αφαίρεση κλασμάτων', 
    labelEn: '➖ 28. Subtraction of fractions',
    href: '/st-dimotikou/28-afairesi-klasmaton',
    keywords: ['ασκήσεις μαθηματικά', 'αφαίρεση κλασμάτων']
  },
  { 
    id: '29-pollaplasiasmos-klasmaton', 
    section: 'sec2', 
    label: '✖️ 29. Πολλαπλασιασμός κλασμάτων', 
    labelEn: '✖️ 29. Multiplication of fractions',
    href: '/st-dimotikou/29-pollaplasiasmos-klasmaton',
    keywords: ['ασκήσεις άλγεβρα', 'πολλαπλασιασμός κλασμάτων']
  },
  { 
    id: '30-diairesi-klasmaton', 
    section: 'sec2', 
    label: '➗ 30. Διαίρεση κλασμάτων (Αντίστροφοι αριθμοί)', 
    labelEn: '➗ 30. Division of fractions and reciprocals',
    href: '/st-dimotikou/30-diairesi-klasmaton',
    keywords: ['ασκήσεις άλγεβρα', 'διαίρεση κλασμάτων', 'αντίστροφοι αριθμοί']
  },
  { 
    id: '31-epanalipsi-1', 
    section: 'sec2', 
    label: '🏆 31. Επαναληπτικές Ασκήσεις: Κεφάλαια 1 – 30', 
    labelEn: '🏆 31. Review Exercises: Chapters 1 – 30',
    href: '/st-dimotikou/31-epanalipsi-1', 
    isReview: true,
    keywords: ['ασκήσεις μαθηματικά', 'επαναληπτικές ασκήσεις', 'θέματα πρότυπα']
  },

  // --- ΕΝΟΤΗΤΑ 3: ΕΞΙΣΩΣΕΙΣ ---
  { 
    id: '32-metabliti', 
    section: 'sec3', 
    label: '🧩 32. Η έννοια της μεταβλητής (x)', 
    labelEn: '🧩 32. The concept of a variable (x)',
    href: '/st-dimotikou/32-metabliti',
    keywords: ['ασκήσεις άλγεβρα', 'μεταβλητή x', 'εισαγωγή στην άλγεβρα']
  },
  { 
    id: '33-agnostos-kai-prosthesi', 
    section: 'sec3', 
    label: '➕ 33. Εξισώσεις: x ＋ α ＝ β', 
    labelEn: '➕ 33. Equations: x ＋ a ＝ b',
    href: '/st-dimotikou/33-agnostos-kai-prosthesi',
    keywords: ['ασκήσεις άλγεβρα', 'εξισώσεις', 'επίλυση εξισώσεων']
  },
  { 
    id: '34-agnostos-kai-afairesi', 
    section: 'sec3', 
    label: '➖ 34. Εξισώσεις: x － α ＝ β', 
    labelEn: '➖ 34. Equations: x － a ＝ b',
    href: '/st-dimotikou/34-agnostos-kai-afairesi',
    keywords: ['ασκήσεις άλγεβρα', 'εξισώσεις με αφαίρεση']
  },
  { 
    id: '35-gnostos-meion-agnostos', 
    section: 'sec3', 
    label: '🔻 35. Εξισώσεις: α － x ＝ β', 
    labelEn: '🔻 35. Equations: a － x ＝ b',
    href: '/st-dimotikou/35-gnostos-meion-agnostos',
    keywords: ['ασκήσεις άλγεβρα', 'εξισώσεις']
  },
  { 
    id: '36-gnostos-epi-agnostos', 
    section: 'sec3', 
    label: '✖️ 36. Εξισώσεις: α · x ＝ β', 
    labelEn: '✖️ 36. Equations: a · x ＝ b',
    href: '/st-dimotikou/36-gnostos-epi-agnostos',
    keywords: ['ασκήσεις άλγεβρα', 'εξισώσεις με πολλαπλασιασμό', 'θέματα πρότυπα']
  },
  { 
    id: '37-agnostos-dia-gnostos', 
    section: 'sec3', 
    label: '➗ 37. Εξισώσεις: x : α ＝ β', 
    labelEn: '➗ 37. Equations: x : a ＝ b',
    href: '/st-dimotikou/37-agnostos-dia-gnostos',
    keywords: ['ασκήσεις άλγεβρα', 'εξισώσεις με διαίρεση']
  },
  { 
    id: '38-gnostos-dia-agnostos', 
    section: 'sec3', 
    label: '🔄 38. Εξισώσεις: α : x ＝ β', 
    labelEn: '🔄 38. Equations: a : x ＝ b',
    href: '/st-dimotikou/38-gnostos-dia-agnostos',
    keywords: ['ασκήσεις άλγεβρα', 'εξισώσεις']
  },
  { 
    id: '39-epanalipsi-2', 
    section: 'sec3', 
    label: '🏆 39. Επαναληπτικές Ασκήσεις: Κεφάλαια 32 – 38', 
    labelEn: '🏆 39. Review Exercises: Chapters 32 – 38',
    href: '/st-dimotikou/39-epanalipsi-2', 
    isReview: true,
    keywords: ['ασκήσεις άλγεβρα', 'επαναληπτικές ασκήσεις εξισώσεων', 'θέματα πρότυπα']
  },

  // --- ΕΝΟΤΗΤΑ 4: ΛΟΓΟΙ, ΑΝΑΛΟΓΙΕΣ & ΠΟΣΟΣΤΑ ---
  { 
    id: '40-logos', 
    section: 'sec4', 
    label: '⚖️ 40. Λόγος δύο μεγεθών', 
    labelEn: '⚖️ 40. Ratio of two quantities',
    href: '/st-dimotikou/40-logos',
    keywords: ['λόγος μεγεθών', 'αναλογίες']
  },
  { 
    id: '41-analogia', 
    section: 'sec4', 
    label: '🔗 41. Από τους λόγους στις αναλογίες', 
    labelEn: '🔗 41. From ratios to proportions',
    href: '/st-dimotikou/41-analogia',
    keywords: ['αναλογίες', 'ασκήσεις μαθηματικά']
  },
  { 
    id: '42-analogia-xiasti', 
    section: 'sec4', 
    label: '⚔️ 42. Ιδιότητες αναλογιών (Γινόμενα χιαστί)', 
    labelEn: '⚔️ 42. Proportion properties (Cross-multiplication)',
    href: '/st-dimotikou/42-analogia-xiasti',
    keywords: ['γινόμενα χιαστί', 'ιδιότητες αναλογιών', 'θέματα πρότυπα']
  },
  { 
    id: '43-posa', 
    section: 'sec4', 
    label: '📌 43. Σταθερά και μεταβλητά ποσά', 
    labelEn: '📌 43. Constant and variable quantities',
    href: '/st-dimotikou/43-posa',
    keywords: ['μεταβλητά ποσά', 'σταθερά ποσά']
  },
  { 
    id: '44-analoga-posa', 
    section: 'sec4', 
    label: '📈 44. Ανάλογα ποσά και συντελεστής αναλογίας', 
    labelEn: '📈 44. Directly proportional quantities and constant',
    href: '/st-dimotikou/44-analoga-posa',
    keywords: ['ανάλογα ποσά', 'συντελεστής αναλογίας', 'ασκήσεις άλγεβρα']
  },
  { 
    id: '45-problem-analoga-posa', 
    section: 'sec4', 
    label: '🛒 45. Προβλήματα με ανάλογα ποσά', 
    labelEn: '🛒 45. Problems with directly proportional quantities',
    href: '/st-dimotikou/45-problem-analoga-posa',
    keywords: ['προβλήματα με ανάλογα ποσά', 'θέματα πρότυπα']
  },
  { 
    id: '46-antistrofos-analoga-posa', 
    section: 'sec4', 
    label: '📉 46. Αντιστρόφως ανάλογα ποσά', 
    labelEn: '📉 46. Inversely proportional quantities',
    href: '/st-dimotikou/46-antistrofos-analoga-posa',
    keywords: ['αντιστρόφως ανάλογα ποσά', 'ασκήσεις μαθηματικών']
  },
  { 
    id: '47-problem-antistrofos-analoga-posa', 
    section: 'sec4', 
    label: '⏳ 47. Προβλήματα με αντιστρόφως ανάλογα ποσά', 
    labelEn: '⏳ 47. Problems with inversely proportional quantities',
    href: '/st-dimotikou/47-problem-antistrofos-analoga-posa',
    keywords: ['προβλήματα αντίστροφα ποσά', 'θέματα πρότυπα']
  },
  { 
    id: '48-methodos-trion', 
    section: 'sec4', 
    label: '📋 48. Απλή μέθοδος των τριών στα ανάλογα ποσά', 
    labelEn: '📋 48. Rule of three with direct proportions',
    href: '/st-dimotikou/48-methodos-trion',
    keywords: ['μέθοδος των τριών', 'ασκήσεις μαθηματικά']
  },
  { 
    id: '49-antistrofos-methodos-trion', 
    section: 'sec4', 
    label: '🔄 49. Απλή μέθοδος των τριών στα αντίστροφα ποσά', 
    labelEn: '🔄 49. Rule of three with inverse proportions',
    href: '/st-dimotikou/49-antistrofos-analoga-posa',
    keywords: ['μέθοδος των τριών αντίστροφα', 'ασκήσεις μαθηματικά']
  },
  { 
    id: '50-pososta', 
    section: 'sec4', 
    label: '🏷️ 50. Η έννοια του ποσοστού', 
    labelEn: '🏷️ 50. The concept of percentage (%)',
    href: '/st-dimotikou/50-pososta',
    keywords: ['ποσοστά', 'έννοια ποσοστού', 'ασκήσεις άλγεβρα']
  },
  { 
    id: '51-problimata-me-pososta', 
    section: 'sec4', 
    label: '💡 51. Προβλήματα με ποσοστά', 
    labelEn: '💡 51. Real-world percentage problems',
    href: '/st-dimotikou/51-problimata-me-pososta',
    keywords: ['προβλήματα με ποσοστά', 'θέματα πρότυπα']
  },
  { 
    id: '52-brisko-arxiki-timi', 
    section: 'sec4', 
    label: '🔙 52. Εύρεση της αρχικής τιμής', 
    labelEn: '🔙 52. Finding the initial value from percentage',
    href: '/st-dimotikou/52-brisko-arxiki-timi',
    keywords: ['εύρεση αρχικής τιμής', 'ποσοστά']
  },
  { 
    id: '53-ksero-arxiki-teliki-timi', 
    section: 'sec4', 
    label: '🔍 53. Εύρεση ποσοστού (αρχική και τελική τιμή)', 
    labelEn: '🔍 53. Calculating percentage rate (initial and final value)',
    href: '/st-dimotikou/53-ksero-arxiki-teliki-timi',
    keywords: ['εύρεση ποσοστού', 'τελική τιμή']
  },
  { 
    id: '54-epanalipsi-3', 
    section: 'sec4', 
    label: '🏆 54. Επαναληπτικές Ασκήσεις: Κεφάλαια 40 – 53', 
    labelEn: '🏆 54. Review Exercises: Chapters 40 – 53',
    href: '/st-dimotikou/54-epanalipsi-3', 
    isReview: true,
    keywords: ['ασκήσεις μαθηματικά', 'επαναληπτικές ασκήσεις ποσοστών', 'θέματα πρότυπα']
  },

  // --- ΕΝΟΤΗΤΑ 5: ΣΤΑΤΙΣΤΙΚΗ, ΜΟΤΙΒΑ, ΓΕΩΜΕΤΡΙΑ & ΜΕΤΡΗΣΕΙΣ ---
  { 
    id: '55-apeikonisi-data', 
    section: 'sec5', 
    label: '📊 55. Συλλογή δεδομένων: Ραβδόγραμμα & εικονόγραμμα', 
    labelEn: '📊 55. Data collection: Bar charts & pictograms',
    href: '/st-dimotikou/55-apeikonisi-data',
    keywords: ['ραβδόγραμμα', 'στατιστική']
  },
  { 
    id: '56-pinakas-sixnotiton', 
    section: 'sec5', 
    label: '📑 56. Ταξινόμηση δεδομένων & πίνακας συχνοτήτων', 
    labelEn: '📑 56. Data classification & frequency tables',
    href: '/st-dimotikou/56-pinakas-sixnotiton',
    keywords: ['πίνακας συχνοτήτων', 'στατιστικά δεδομένα']
  },
  { 
    id: '57-alla-grafimata', 
    section: 'sec5', 
    label: '🥧 57. Γραφήματα γραμμής & κυκλικά διαγράμματα', 
    labelEn: '🥧 57. Line graphs & pie charts',
    href: '/st-dimotikou/57-alla-grafimata',
    keywords: ['κυκλικό διάγραμμα', 'γραφήματα']
  },
  { 
    id: '58-mesos-oros', 
    section: 'sec5', 
    label: '🎯 58. Μέσος Όρος', 
    labelEn: '🎯 58. Mean (Average)',
    href: '/st-dimotikou/58-mesos-oros',
    keywords: ['μέσος όρος', 'ασκήσεις μαθηματικά']
  },
  { 
    id: '59-mikos', 
    section: 'sec5', 
    label: '📏 59. Μέτρηση Μήκους', 
    labelEn: '📏 59. Measuring length',
    href: '/st-dimotikou/59-mikos',
    keywords: ['μέτρηση μήκους', 'μονάδες μέτρησης']
  },
  { 
    id: '60-baros', 
    section: 'sec5', 
    label: '⚖️ 60. Μέτρηση Βάρους (Μάζας)', 
    labelEn: '⚖️ 60. Measuring weight (mass)',
    href: '/st-dimotikou/60-baros',
    keywords: ['μέτρηση μάζας', 'μονάδες βάρους']
  },
  { 
    id: '61-xronos', 
    section: 'sec5', 
    label: '⏰ 61. Μέτρηση Χρόνου', 
    labelEn: '⏰ 61. Measuring time',
    href: '/st-dimotikou/61-xronos',
    keywords: ['μέτρηση χρόνου', 'χρόνος']
  },
  { 
    id: '62-xrimata', 
    section: 'sec5', 
    label: '💶 62. Χρήματα - Ευρώ', 
    labelEn: '💶 62. Money - Euro transactions',
    href: '/st-dimotikou/62-xrimata',
    keywords: ['χρήματα', 'ευρώ']
  },
  { 
    id: '63-geometrika-motiba', 
    section: 'sec5', 
    label: '🔷 63. Γεωμετρικά Μοτίβα (Γεωμετρία)', 
    labelEn: '🔷 63. Geometric patterns (Geometry)',
    href: '/st-dimotikou/63-geometrika-motiba',
    keywords: ['ασκήσεις γεωμετρία', 'γεωμετρικά μοτίβα']
  },
  { 
    id: '64-arithmitika-motiba', 
    section: 'sec5', 
    label: '🔢 64. Αριθμητικά Μοτίβα', 
    labelEn: '🔢 64. Number patterns',
    href: '/st-dimotikou/64-arithmitika-motiba',
    keywords: ['αριθμητικά μοτίβα', 'ακολουθίες']
  },
  { 
    id: '65-sintheta-motiba', 
    section: 'sec5', 
    label: '🌀 65. Σύνθετα Μοτίβα', 
    labelEn: '🌀 65. Complex repeating patterns',
    href: '/st-dimotikou/65-sintheta-motiba',
    keywords: ['μοτίβα', 'θέματα πρότυπα']
  },
  { 
    id: '66-epanalipsi-4', 
    section: 'sec5', 
    label: '🏆 66. Επαναληπτικές Ασκήσεις: Κεφάλαια 55 – 65', 
    labelEn: '🏆 66. Review Exercises: Chapters 55 – 65',
    href: '/st-dimotikou/66-epanalipsi-4', 
    isReview: true,
    keywords: ['ασκήσεις μαθηματικά', 'επαναληπτικές ασκήσεις']
  },
  { 
    id: '67-sximata', 
    section: 'sec5', 
    label: '📐 67. Γεωμετρικά Σχήματα - Πολύγωνα (Γεωμετρία)', 
    labelEn: '📐 67. Geometric shapes - Polygons (Geometry)',
    href: '/st-dimotikou/67-sximata',
    keywords: ['ασκήσεις γεωμετρία', 'πολύγωνα', 'γεωμετρικά σχήματα']
  },
  { 
    id: '68-gonies', 
    section: 'sec5', 
    label: '🧭 68. Γωνίες και είδη γωνιών (Γεωμετρία)', 
    labelEn: '🧭 68. Angles and angle types (Geometry)',
    href: '/st-dimotikou/68-gonies',
    keywords: ['ασκήσεις γεωμετρία', 'γωνίες', 'είδη γωνιών']
  },
  { 
    id: '69-athroisma-gonion', 
    section: 'sec5', 
    label: '🔺 69. Άθροισμα Γωνιών Τριγώνου & Τετραπλεύρου', 
    labelEn: '🔺 69. Angle sum of triangles & quadrilaterals',
    href: '/st-dimotikou/69-athroisma-gonion',
    keywords: ['ασκήσεις γεωμετρία', 'άθροισμα γωνιών', 'τρίγωνα', 'θέματα πρότυπα']
  },
  { 
    id: '70-megethinsi-smikrinsi', 
    section: 'sec5', 
    label: '🔎 70. Κλίμακα - Μεγέθυνση & Σμίκρυνση σχημάτων', 
    labelEn: '🔎 70. Scale - Enlargement & reduction of shapes',
    href: '/st-dimotikou/70-megethinsi-smikrinsi',
    keywords: ['κλίμακα', 'μεγέθυνση σμίκρυνση', 'θέματα πρότυπα']
  },
  { 
    id: '71-simmetria', 
    section: 'sec5', 
    label: '🪞 71. Αξονική Συμμετρία (Γεωμετρία)', 
    labelEn: '🪞 71. Line symmetry (Geometry)',
    href: '/st-dimotikou/71-simmetria',
    keywords: ['ασκήσεις γεωμετρία', 'αξονική συμμετρία']
  },
  { 
    id: '72-embadon', 
    section: 'sec5', 
    label: '🟩 72. Μέτρηση Επιφανειών - Εμβαδόν (Γεωμετρία)', 
    labelEn: '🟩 72. Surface measurement - Area (Geometry)',
    href: '/st-dimotikou/72-embadon',
    keywords: ['ασκήσεις γεωμετρία', 'εμβαδόν', 'μέτρηση επιφανειών']
  },
  { 
    id: '73-embadon-parallilogrammou', 
    section: 'sec5', 
    label: '▰ 73. Εμβαδόν Παραλληλογράμμου (Γεωμετρία)', 
    labelEn: '▰ 73. Area of parallelogram (Geometry)',
    href: '/st-dimotikou/73-embadon-parallilogrammou',
    keywords: ['ασκήσεις γεωμετρία', 'εμβαδόν παραλληλογράμμου']
  },
  { 
    id: '74-embadon-trigonou', 
    section: 'sec5', 
    label: '▲ 74. Εμβαδόν Τριγώνου (Γεωμετρία)', 
    labelEn: '▲ 74. Area of triangle (Geometry)',
    href: '/st-dimotikou/74-embadon-trigonou',
    keywords: ['ασκήσεις γεωμετρία', 'εμβαδόν τριγώνου', 'θέματα πρότυπα']
  },
  { 
    id: '75-embadon-trapeziou', 
    section: 'sec5', 
    label: '⏢ 75. Εμβαδόν Τραπεζίου (Γεωμετρία)', 
    labelEn: '⏢ 75. Area of trapezoid (Geometry)',
    href: '/st-dimotikou/75-embadon-trapeziou',
    keywords: ['ασκήσεις γεωμετρία', 'εμβαδόν τραπεζίου', 'θέματα πρότυπα']
  },
  { 
    id: '76-embadon-kiklou', 
    section: 'sec5', 
    label: '⚪ 76. Εμβαδόν Κύκλου (Γεωμετρία)', 
    labelEn: '⚪ 76. Area of circle (Geometry)',
    href: '/st-dimotikou/76-embadon-kiklou',
    keywords: ['ασκήσεις γεωμετρία', 'εμβαδόν κύκλου', 'ακτίνα κύκλου ρ']
  },
  { 
    id: '77-anaptigma', 
    section: 'sec5', 
    label: '📦 77. Ανάπτυγμα Κύβου & Παραλληλεπιπέδου (Γεωμετρία)', 
    labelEn: '📦 77. Nets of cubes & rectangular prisms (Geometry)',
    href: '/st-dimotikou/77-anaptigma',
    keywords: ['ασκήσεις γεωμετρία', 'ανάπτυγμα κύβου']
  },
  { 
    id: '78-akmes-korifes', 
    section: 'sec5', 
    label: '📍 78. Ακμές & Κορυφές Στερεών Σωμάτων (Γεωμετρία)', 
    labelEn: '📍 78. Edges & vertices of geometric solids (Geometry)',
    href: '/st-dimotikou/78-akmes-korifes',
    keywords: ['ασκήσεις γεωμετρία', 'ακμές κορυφές', 'στερεά σώματα']
  },
  { 
    id: '79-kilindros', 
    section: 'sec5', 
    label: '🥫 79. Κύλινδρος: Ιδιότητες & Ανάπτυγμα (Γεωμετρία)', 
    labelEn: '🥫 79. Cylinder: Properties & Net (Geometry)',
    href: '/st-dimotikou/79-kilindros',
    keywords: ['ασκήσεις γεωμετρία', 'κύλινδρος', 'ανάπτυγμα κυλίνδρου']
  },
  { 
    id: '80-ogkos', 
    section: 'sec5', 
    label: '🧊 80. Η έννοια του Όγκου & Μονάδες Μέτρησης (Γεωμετρία)', 
    labelEn: '🧊 80. Concept of volume & cubic units (Geometry)',
    href: '/st-dimotikou/80-ogkos',
    keywords: ['ασκήσεις γεωμετρία', 'όγκος', 'κυβικά μέτρα']
  },
  { 
    id: '81-ogkos-cube', 
    section: 'sec5', 
    label: '🎲 81. Όγκος κύβου & παραλληλεπιπέδου (Γεωμετρία)', 
    labelEn: '🎲 81. Volume of cube & rectangular prism (Geometry)',
    href: '/st-dimotikou/81-ogkos-cube',
    keywords: ['ασκήσεις γεωμετρία', 'όγκος κύβου', 'όγκος παραλληλεπιπέδου', 'θέματα πρότυπα']
  },
  { 
    id: '82-ogkos-kilindrou', 
    section: 'sec5', 
    label: '🛢️ 82. Όγκος κυλίνδρου (Γεωμετρία)', 
    labelEn: '🛢️ 82. Volume of cylinder (Geometry)',
    href: '/st-dimotikou/82-ogkos-kilindrou',
    keywords: ['ασκήσεις γεωμετρία', 'όγκος κυλίνδρου', 'θέματα πρότυπα']
  },
  { 
    id: '83-epanalipsi-5', 
    section: 'sec5', 
    label: '🏆 83. Επαναληπτικές Ασκήσεις Γεωμετρίας: Κεφάλαια 67 – 82', 
    labelEn: '🏆 83. Review Exercises on Geometry: Chapters 67 – 82',
    href: '/st-dimotikou/83-epanalipsi-5', 
    isReview: true,
    keywords: ['ασκήσεις γεωμετρία', 'επαναληπτικές ασκήσεις', 'θέματα πρότυπα']
  },
];