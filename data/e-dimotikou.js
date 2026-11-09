// data/e-dimotikou.js

export const E_DIMOTIKOU_SECTIONS = [
  { 
    id: 'sec1', 
    title: 'Ενότητα 1: Κλάσματα, Πολλαπλάσια, ΕΚΠ & ΜΚΔ',
    titleEn: 'Unit 1: Fractions, Multiples, LCM & GCD',
    category: 'Κλάσματα & Αριθμητική'
  },
  { 
    id: 'sec2', 
    title: 'Ενότητα 2: Μέση Τιμή & Ποσοστά',
    titleEn: 'Unit 2: Mean (Average) & Percentages',
    category: 'Στατιστική & Ποσοστά'
  },
  { 
    id: 'sec3', 
    title: 'Ενότητα 3: Γεωμετρία, Τρίγωνα & Συμμετρία',
    titleEn: 'Unit 3: Geometry, Triangles & Symmetry',
    category: 'Γεωμετρία'
  },
  { 
    id: 'sec4', 
    title: 'Ενότητα 4: Μετρήσεις, Περίμετρος, Εμβαδόν & Όγκος',
    titleEn: 'Unit 4: Measurements, Perimeter, Area & Volume',
    category: 'Γεωμετρία & Μετρήσεις'
  },
];

export const E_DIMOTIKOU_MODULES = [
  // --- ΕΝΟΤΗΤΑ 1: ΚΛΑΣΜΑΤΑ, ΕΚΠ & ΜΚΔ ---
  { 
    id: '01-klasma', 
    section: 'sec1', 
    label: '🍕 1. Η έννοια του κλάσματος', 
    labelEn: '🍕 1. The concept of fractions',
    href: '/e-dimotikou/01-klasma',
    keywords: ['ασκήσεις μαθηματικά', 'κλάσματα', 'έννοια κλάσματος']
  },
  { 
    id: '02-isodinama', 
    section: 'sec1', 
    label: '🔄 2. Ισοδύναμα κλάσματα', 
    labelEn: '🔄 2. Equivalent fractions',
    href: '/e-dimotikou/02-isodinama',
    keywords: ['ασκήσεις άλγεβρα', 'ισοδύναμα κλάσματα']
  },
  { 
    id: '03-aplopoiisi', 
    section: 'sec1', 
    label: '✂️ 3. Απλοποίηση κλασμάτων', 
    labelEn: '✂️ 3. Simplifying fractions',
    href: '/e-dimotikou/03-aplopoiisi',
    keywords: ['ασκήσεις μαθηματικών', 'απλοποίηση κλασμάτων']
  },
  { 
    id: '04-anagogi', 
    section: 'sec1', 
    label: '🔍 4. Αναγωγή στην κλασματική μονάδα', 
    labelEn: '🔍 4. Reduction to unit fractions',
    href: '/e-dimotikou/04-anagogi',
    keywords: ['κλασματική μονάδα', 'ασκήσεις κλάσματα']
  },
  { 
    id: '05-pollaplasia', 
    section: 'sec1', 
    label: '📈 5. Πολλαπλάσια φυσικών αριθμών', 
    labelEn: '📈 5. Multiples of natural numbers',
    href: '/e-dimotikou/05-pollaplasia',
    keywords: ['πολλαπλάσια', 'φυσικοί αριθμοί']
  },
  { 
    id: '06-ekp', 
    section: 'sec1', 
    label: '🎯 6. Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.)', 
    labelEn: '🎯 6. Least Common Multiple (LCM)',
    href: '/e-dimotikou/06-ekp',
    keywords: ['ασκήσεις μαθηματικά', 'ΕΚΠ', 'ελάχιστο κοινό πολλαπλάσιο']
  },
  { 
    id: '07-diairetes', 
    section: 'sec1', 
    label: '🪓 7. Διαιρέτες φυσικών αριθμών', 
    labelEn: '🪓 7. Divisors of natural numbers',
    href: '/e-dimotikou/07-diairetes',
    keywords: ['διαιρέτες', 'ασκήσεις μαθηματικών']
  },
  { 
    id: '08-mkd', 
    section: 'sec1', 
    label: '🥇 8. Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)', 
    labelEn: '🥇 8. Greatest Common Divisor (GCD)',
    href: '/e-dimotikou/08-mkd',
    keywords: ['ασκήσεις άλγεβρα', 'ΜΚΔ', 'μέγιστος κοινός διαιρέτης']
  },
  { 
    id: '09-krit-diaret', 
    section: 'sec1', 
    label: '🛡️ 9. Κριτήρια διαιρετότητας', 
    labelEn: '🛡️ 9. Divisibility criteria',
    href: '/e-dimotikou/09-krit-diaret',
    keywords: ['κριτήρια διαιρετότητας', 'διαιρετότητα']
  },
  { 
    id: '10-epanalipsi-1', 
    section: 'sec1', 
    label: '🏆 10. Επαναληπτικές Ασκήσεις: Κεφάλαια 1 – 9', 
    labelEn: '🏆 10. Review Exercises: Chapters 1 – 9',
    href: '/e-dimotikou/10-epanalipsi-1', 
    isReview: true,
    keywords: ['ασκήσεις μαθηματικά', 'επαναληπτικές ασκήσεις']
  },

  // --- ΕΝΟΤΗΤΑ 2: ΜΕΣΗ ΤΙΜΗ & ΠΟΣΟΣΤΑ ---
  { 
    id: '11-mesitimi', 
    section: 'sec2', 
    label: '📊 11. Υπολογισμός μέσης τιμής', 
    labelEn: '📊 11. Calculating the mean (average)',
    href: '/e-dimotikou/11-mesitimi',
    keywords: ['μέση τιμή', 'υπολογισμός μέσης τιμής']
  },
  { 
    id: '12-pososta', 
    section: 'sec2', 
    label: '🏷️ 12. Εισαγωγή στα ποσοστά', 
    labelEn: '🏷️ 12. Introduction to percentages',
    href: '/e-dimotikou/12-pososta',
    keywords: ['ασκήσεις άλγεβρα', 'ποσοστά', 'ασκήσεις στα ποσοστά']
  },

  // --- ΕΝΟΤΗΤΑ 3: ΓΕΩΜΕΤΡΙΑ & ΤΡΙΓΩΝΑ ---
  { 
    id: '13-gonies', 
    section: 'sec3', 
    label: '🧭 13. Είδη γωνιών και μέτρηση (Γεωμετρία)', 
    labelEn: '🧭 13. Angle types and measurement (Geometry)',
    href: '/e-dimotikou/13-gonies',
    keywords: ['ασκήσεις γεωμετρία', 'γωνίες', 'είδη γωνιών']
  },
  { 
    id: '14-trigona', 
    section: 'sec3', 
    label: '🔺 14. Είδη τριγώνων ως προς τις γωνίες (Γεωμετρία)', 
    labelEn: '🔺 14. Triangles classified by angles (Geometry)',
    href: '/e-dimotikou/14-trigona',
    keywords: ['ασκήσεις γεωμετρία', 'τρίγωνα', 'είδη τριγώνων']
  },
  { 
    id: '15-trigona-pleures', 
    section: 'sec3', 
    label: '▲ 15. Είδη τριγώνων ως προς τις πλευρές (Γεωμετρία)', 
    labelEn: '▲ 15. Triangles classified by sides (Geometry)',
    href: '/e-dimotikou/15-trigona-pleures',
    keywords: ['ασκήσεις γεωμετρία', 'ισόπλευρο τρίγωνο', 'ισοσκελές']
  },
  { 
    id: '16-kathetes-eutheies', 
    section: 'sec3', 
    label: '⟂ 16. Κάθετες ευθείες (Γεωμετρία)', 
    labelEn: '⟂ 16. Perpendicular lines (Geometry)',
    href: '/e-dimotikou/16-kathetes-eutheies',
    keywords: ['ασκήσεις γεωμετρία', 'κάθετες ευθείες']
  },
  { 
    id: '17-apostasi-simeiou-eutheias', 
    section: 'sec3', 
    label: '📏 17. Απόσταση σημείου από ευθεία (Γεωμετρία)', 
    labelEn: '📏 17. Distance of a point from a line (Geometry)',
    href: '/e-dimotikou/17-apostasi-simeiou-eutheia',
    keywords: ['ασκήσεις γεωμετρία', 'απόσταση σημείου']
  },
  { 
    id: '18-ipsos-trigonou', 
    section: 'sec3', 
    label: '📐 18. Σχεδίαση και μέτρηση ύψους τριγώνου (Γεωμετρία)', 
    labelEn: '📐 18. Drawing and measuring triangle altitude (Geometry)',
    href: '/e-dimotikou/18-ipsos-trigonou',
    keywords: ['ασκήσεις γεωμετρία', 'ύψος τριγώνου']
  },
  { 
    id: '19-aksonas-simmetrias', 
    section: 'sec3', 
    label: '🪞 19. Άξονας συμμετρίας σε γεωμετρικά σχήματα', 
    labelEn: '🪞 19. Axis of symmetry in geometric shapes',
    href: '/e-dimotikou/19-aksonas-simmetrias',
    keywords: ['ασκήσεις γεωμετρία', 'άξονας συμμετρίας']
  },

  // --- ΕΝΟΤΗΤΑ 4: ΜΕΤΡΗΣΕΙΣ, ΠΕΡΙΜΕΤΡΟΣ, ΕΜΒΑΔΟΝ & ΟΓΚΟΣ ---
  { 
    id: '20-mikos-kiklou', 
    section: 'sec4', 
    label: '⭕ 20. Υπολογισμός μήκους κύκλου (Γεωμετρία)', 
    labelEn: '⭕ 20. Calculating circumference of a circle (Geometry)',
    href: '/e-dimotikou/20-mikos-kiklou',
    keywords: ['ασκήσεις γεωμετρία', 'μήκος κύκλου', 'ακτίνα κύκλου']
  },
  { 
    id: '21-monades-mikous', 
    section: 'sec4', 
    label: '📐 21. Μονάδες μέτρησης μήκους και μετατροπές', 
    labelEn: '📐 21. Units of length and conversions',
    href: '/e-dimotikou/21-monades-mikous',
    keywords: ['μονάδες μήκους', 'μετατροπές μονάδων']
  },
  { 
    id: '22-poligona', 
    section: 'sec4', 
    label: '⬡ 22. Γνωριμία με τα πολύγωνα (Γεωμετρία)', 
    labelEn: '⬡ 22. Introduction to polygons (Geometry)',
    href: '/e-dimotikou/22-poligona',
    keywords: ['ασκήσεις γεωμετρία', 'πολύγωνα']
  },
  { 
    id: '23-kanonika-poligona', 
    section: 'sec4', 
    label: '🛑 23. Κανονικά πολύγωνα (Γεωμετρία)', 
    labelEn: '🛑 23. Regular polygons (Geometry)',
    href: '/e-dimotikou/23-kanonika-poligona',
    keywords: ['ασκήσεις γεωμετρία', 'κανονικά πολύγωνα']
  },
  { 
    id: '24-perimetros', 
    section: 'sec4', 
    label: '🔲 24. Περίμετρος γεωμετρικών σχημάτων (Γεωμετρία)', 
    labelEn: '🔲 24. Perimeter of geometric shapes (Geometry)',
    href: '/e-dimotikou/24-perimetros',
    keywords: ['ασκήσεις γεωμετρία', 'περίμετρος']
  },
  { 
    id: '25-embado', 
    section: 'sec4', 
    label: '🟩 25. Η έννοια του εμβαδού (Γεωμετρία)', 
    labelEn: '🟩 25. Concept of area (Geometry)',
    href: '/e-dimotikou/25-embado',
    keywords: ['ασκήσεις γεωμετρία', 'εμβαδόν']
  },
  { 
    id: '26-embado-sximaton', 
    section: 'sec4', 
    label: '▦ 26. Εμβαδόν επιπέδων σχημάτων (Γεωμετρία)', 
    labelEn: '▦ 26. Area of 2D plane figures (Geometry)',
    href: '/e-dimotikou/26-embado-sximaton',
    keywords: ['ασκήσεις γεωμετρία', 'εμβαδόν σχημάτων']
  },
  { 
    id: '27-monades-epifaneias', 
    section: 'sec4', 
    label: '🗺️ 27. Μονάδες μέτρησης επιφάνειας', 
    labelEn: '🗺️ 27. Units of surface area measurement',
    href: '/e-dimotikou/27-monades-epifaneias',
    keywords: ['μονάδες επιφάνειας', 'τετραγωνικά μέτρα']
  },
  { 
    id: '28-ennoia-ogkou', 
    section: 'sec4', 
    label: '📦 28. Η έννοια του όγκου (Γεωμετρία)', 
    labelEn: '📦 28. Concept of volume (Geometry)',
    href: '/e-dimotikou/28-ennoia-ogkou',
    keywords: ['ασκήσεις γεωμετρία', 'όγκος']
  },
  { 
    id: '29-ogkoi-sximaton', 
    section: 'sec4', 
    label: '🧊 29. Υπολογισμός όγκου στερεών σωμάτων (Γεωμετρία)', 
    labelEn: '🧊 29. Volume calculation of solid figures (Geometry)',
    href: '/e-dimotikou/29-ogkoi-sximaton',
    keywords: ['ασκήσεις γεωμετρία', 'όγκος στερεών', 'κύβος']
  },
  { 
    id: '30-epanalipsi-2', 
    section: 'sec4', 
    label: '🎖️ 30. Επαναληπτικές Ασκήσεις: Κεφάλαια 13 – 29', 
    labelEn: '🎖️ 30. Review Exercises: Chapters 13 – 29',
    href: '/e-dimotikou/30-epanalipsi-2', 
    isReview: true,
    keywords: ['ασκήσεις μαθηματικά', 'επαναληπτικές ασκήσεις γεωμετρίας']
  },
];