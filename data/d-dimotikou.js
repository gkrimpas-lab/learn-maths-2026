// data/d-dimotikou.js

export const D_DIMOTIKOU_SECTIONS = [
  { 
    id: 'sec1', 
    title: 'Ενότητα 1: Αριθμοί ως το 20.000, Πράξεις & Δεκαδικά Κλάσματα',
    titleEn: 'Unit 1: Numbers up to 20,000, Operations & Decimal Fractions'
  },
  { 
    id: 'sec2', 
    title: 'Ενότητα 2: Δεκαδικοί Αριθμοί, Ευθείες, Εμβαδόν & Τετράπλευρα',
    titleEn: 'Unit 2: Decimal Numbers, Lines, Area & Quadrilaterals'
  },
  { 
    id: 'sec3', 
    title: 'Ενότητα 3: Μεγάλοι Αριθμοί (έως 100.000) & Πολλαπλασιασμός / Διαίρεση',
    titleEn: 'Unit 3: Large Numbers (up to 100,000) & Multiplication / Division'
  },
  { 
    id: 'sec4', 
    title: 'Ενότητα 4: Μέτρηση Χρόνου, Γεωμετρικά Στερεά & Χωρητικότητα',
    titleEn: 'Unit 4: Measuring Time, Geometric Solids & Capacity'
  },
];

export const D_DIMOTIKOU_MODULES = [
  // --- ΕΝΟΤΗΤΑ 1: ΑΡΙΘΜΟΙ ΕΩΣ 20.000, ΠΡΑΞΕΙΣ & ΚΛΑΣΜΑΤΑ ---
  { 
    id: '1-arithmoi-eos-20-xiliades', 
    section: 'sec1', 
    label: '🔢 1. Αριθμοί έως το 20.000', 
    labelEn: '🔢 1. Numbers up to 20,000',
    href: '/d-dimotikou/1-arithmoi-eos-20-xiliades' 
  },
  { 
    id: '2-poligona', 
    section: 'sec1', 
    label: '🔺 2. Γνωρίζω τα πολύγωνα', 
    labelEn: '🔺 2. Discovering polygons',
    href: '/d-dimotikou/2-poligona' 
  },
  { 
    id: '3-prosthesi-afairesi', 
    section: 'sec1', 
    label: '➕ 3. Πρόσθεση και αφαίρεση (Αντίστροφες πράξεις)', 
    labelEn: '➕ 3. Addition and subtraction (Inverse operations)',
    href: '/d-dimotikou/3-prosthesi-afairesi' 
  },
  { 
    id: '4-pollaplasiasmos', 
    section: 'sec1', 
    label: '✖️ 4. Πολλαπλασιασμός με διψήφιο αριθμό', 
    labelEn: '✖️ 4. Multiplication by two-digit numbers',
    href: '/d-dimotikou/4-pollaplasiasmos' 
  },
  { 
    id: '5-diairesi', 
    section: 'sec1', 
    label: '➗ 5. Διαίρεση με μονοψήφιο διαιρέτη', 
    labelEn: '➗ 5. Division by single-digit divisors',
    href: '/d-dimotikou/5-diairesi' 
  },
  { 
    id: '6-dekadikoi', 
    section: 'sec1', 
    label: '🍰 6. Δεκαδικά κλάσματα', 
    labelEn: '🍰 6. Decimal fractions',
    href: '/d-dimotikou/6-dekadikoi' 
  },
  { 
    id: '7-dekadikoi-sinexeia', 
    section: 'sec1', 
    label: '🪙 7. Δεκαδικά κλάσματα και δεκαδικοί αριθμοί', 
    labelEn: '🪙 7. Decimal fractions and decimal numbers',
    href: '/d-dimotikou/7-dekadikoi-sinexeia' 
  },
  { 
    id: '8-mikos', 
    section: 'sec1', 
    label: '📏 8. Μονάδες μέτρησης μήκους', 
    labelEn: '📏 8. Measuring units of length',
    href: '/d-dimotikou/8-mikos' 
  },
  { 
    id: '9-baros', 
    section: 'sec1', 
    label: '⚖️ 9. Μονάδες μέτρησης μάζας (βάρους)', 
    labelEn: '⚖️ 9. Measuring units of mass (weight)',
    href: '/d-dimotikou/9-baros' 
  },
  { 
    id: '10-epanalipsi-1', 
    section: 'sec1', 
    label: '🏆 10. Επανάληψη: Κεφάλαια 1 – 9', 
    labelEn: '🏆 10. Review: Chapters 1 – 9',
    href: '/d-dimotikou/10-epanalipsi-1', 
    isReview: true 
  },

  // --- ΕΝΟΤΗΤΑ 2: ΔΕΚΑΔΙΚΟΙ, ΕΥΘΕΙΕΣ & ΕΜΒΑΔΟΝ ---
  { 
    id: '11-dekadikoi-3-psifia', 
    section: 'sec2', 
    label: '🏷️ 11. Δεκαδικοί αριθμοί με τρία δεκαδικά ψηφία', 
    labelEn: '🏷️ 11. Decimals with three decimal places',
    href: '/d-dimotikou/11-dekadikoi-3-psifia' 
  },
  { 
    id: '12-diairesi-deka-ekato-xilia', 
    section: 'sec2', 
    label: '⚡ 12. Πολλαπλασιασμός & διαίρεση με 10, 100, 1.000', 
    labelEn: '⚡ 12. Multiplying & dividing by 10, 100, 1,000',
    href: '/d-dimotikou/12-diairesi-deka-ekato-xilia' 
  },
  { 
    id: '13-paralliles', 
    section: 'sec2', 
    label: '⏸️ 13. Παράλληλες και τεμνόμενες ευθείες', 
    labelEn: '⏸️ 13. Parallel and intersecting lines',
    href: '/d-dimotikou/13-paralliles' 
  },
  { 
    id: '14-apostasi-simeiou-eutheia', 
    section: 'sec2', 
    label: '📐 14. Απόσταση σημείου από ευθεία', 
    labelEn: '📐 14. Distance of a point from a line',
    href: '/d-dimotikou/14-apostasi-simeiou-eutheia' 
  },
  { 
    id: '15-embadon', 
    section: 'sec2', 
    label: '🟩 15. Έννοια και μέτρηση εμβαδού', 
    labelEn: '🟩 15. Concept and measurement of area',
    href: '/d-dimotikou/15-embadon' 
  },
  { 
    id: '16-tetrapleura', 
    section: 'sec2', 
    label: '🔷 16. Είδη τετραπλεύρων και ιδιότητες', 
    labelEn: '🔷 16. Types and properties of quadrilaterals',
    href: '/d-dimotikou/16-tetrapleura' 
  },
  { 
    id: '17-perimetros', 
    section: 'sec2', 
    label: '🔲 17. Υπολογισμός περιμέτρου', 
    labelEn: '🔲 17. Calculating perimeter',
    href: '/d-dimotikou/17-perimetros' 
  },
  { 
    id: '18-simmetria', 
    section: 'sec2', 
    label: '🪞 18. Αξονική συμμετρία', 
    labelEn: '🪞 18. Line symmetry',
    href: '/d-dimotikou/18-simmetria' 
  },
  { 
    id: '19-epanalipsi-2', 
    section: 'sec2', 
    label: '🏆 19. Επανάληψη: Κεφάλαια 11 – 18', 
    labelEn: '🏆 19. Review: Chapters 11 – 18',
    href: '/d-dimotikou/19-epanalipsi-2', 
    isReview: true 
  },

  // --- ΕΝΟΤΗΤΑ 3: ΜΕΓΑΛΟΙ ΑΡΙΘΜΟΙ & ΠΡΑΞΕΙΣ ---
  { 
    id: '20-megaloi-arithmoi', 
    section: 'sec3', 
    label: '🪐 20. Αριθμοί ως το 100.000 (Μεγάλοι αριθμοί)', 
    labelEn: '🪐 20. Numbers up to 100,000 (Large numbers)',
    href: '/d-dimotikou/20-megaloi-arithmoi' 
  },
  { 
    id: '21-pollaplasiasmos-3-psifia', 
    section: 'sec3', 
    label: '🧮 21. Πολλαπλασιασμός με τριψήφιο αριθμό', 
    labelEn: '🧮 21. Multiplication by three-digit numbers',
    href: '/d-dimotikou/21-pollaplasiasmos-3-psifia' 
  },
  { 
    id: '22-diairesi-2-psifia', 
    section: 'sec3', 
    label: '🧩 22. Διαίρεση με διψήφιο διαιρέτη', 
    labelEn: '🧩 22. Division by two-digit divisors',
    href: '/d-dimotikou/22-diairesi-2-psifia' 
  },
  { 
    id: '23-anagogi-monada', 
    section: 'sec3', 
    label: '🛒 23. Προβλήματα με αναγωγή στη μονάδα', 
    labelEn: '🛒 23. Unitary method problems',
    href: '/d-dimotikou/23-anagogi-monada' 
  },
  { 
    id: '24-epanalipsi-3', 
    section: 'sec3', 
    label: '🏆 24. Επανάληψη: Κεφάλαια 20 – 23', 
    labelEn: '🏆 24. Review: Chapters 20 – 23',
    href: '/d-dimotikou/24-epanalipsi-3', 
    isReview: true 
  },

  // --- ΕΝΟΤΗΤΑ 4: ΧΡΟΝΟΣ, ΣΤΕΡΕΑ & ΧΩΡΗΤΙΚΟΤΗΤΑ ---
  { 
    id: '25-ora', 
    section: 'sec4', 
    label: '⏰ 25. Μέτρηση χρόνου: Η ώρα και το ρολόι', 
    labelEn: '⏰ 25. Measuring time: The clock and telling time',
    href: '/d-dimotikou/25-ora' 
  },
  { 
    id: '26-aionas', 
    section: 'sec4', 
    label: '📅 26. Μονάδες χρόνου: Ημέρες, μήνες, έτη, αιώνες', 
    labelEn: '📅 26. Time units: Days, months, years, centuries',
    href: '/d-dimotikou/26-aionas' 
  },
  { 
    id: '27-sterea', 
    section: 'sec4', 
    label: '🧊 27. Γεωμετρικά στερεά σώματα', 
    labelEn: '🧊 27. Geometric solid figures',
    href: '/d-dimotikou/27-sterea' 
  },
  { 
    id: '28-sterea-anoigma', 
    section: 'sec4', 
    label: '📦 28. Αναπτύγματα γεωμετρικών στερεών', 
    labelEn: '📦 28. Nets of geometric solids',
    href: '/d-dimotikou/28-sterea-anoigma' 
  },
  { 
    id: '29-posotita-igrou', 
    section: 'sec4', 
    label: '🥛 29. Μέτρηση χωρητικότητας (Υγρά)', 
    labelEn: '🥛 29. Measuring liquid capacity',
    href: '/d-dimotikou/29-posotita-igrou' 
  },
];