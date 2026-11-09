// data/e-dimotikou.js

export const E_DIMOTIKOU_SECTIONS = [
  { 
    id: 'sec1', 
    title: 'Ενότητα 1: Κλάσματα, Πολλαπλάσια, ΕΚΠ & ΜΚΔ',
    titleEn: 'Unit 1: Fractions, Multiples, LCM & GCD'
  },
  { 
    id: 'sec2', 
    title: 'Ενότητα 2: Μέση Τιμή & Ποσοστά',
    titleEn: 'Unit 2: Mean (Average) & Percentages'
  },
  { 
    id: 'sec3', 
    title: 'Ενότητα 3: Γεωμετρία, Τρίγωνα & Συμμετρία',
    titleEn: 'Unit 3: Geometry, Triangles & Symmetry'
  },
  { 
    id: 'sec4', 
    title: 'Ενότητα 4: Μετρήσεις, Περίμετρος, Εμβαδόν & Όγκος',
    titleEn: 'Unit 4: Measurements, Perimeter, Area & Volume'
  },
];

export const E_DIMOTIKOU_MODULES = [
  // --- ΕΝΟΤΗΤΑ 1: ΚΛΑΣΜΑΤΑ, ΕΚΠ & ΜΚΔ ---
  { 
    id: '01-klasma', 
    section: 'sec1', 
    label: '🍕 1. Η έννοια του κλάσματος', 
    labelEn: '🍕 1. The concept of fractions',
    href: '/e-dimotikou/01-klasma' 
  },
  { 
    id: '02-isodinama', 
    section: 'sec1', 
    label: '🔄 2. Ισοδύναμα κλάσματα', 
    labelEn: '🔄 2. Equivalent fractions',
    href: '/e-dimotikou/02-isodinama' 
  },
  { 
    id: '03-aplopoiisi', 
    section: 'sec1', 
    label: '✂️ 3. Απλοποίηση κλασμάτων', 
    labelEn: '✂️ 3. Simplifying fractions',
    href: '/e-dimotikou/03-aplopoiisi' 
  },
  { 
    id: '04-anagogi', 
    section: 'sec1', 
    label: '🔍 4. Αναγωγή στην κλασματική μονάδα', 
    labelEn: '🔍 4. Reduction to unit fractions',
    href: '/e-dimotikou/04-anagogi' 
  },
  { 
    id: '05-pollaplasia', 
    section: 'sec1', 
    label: '📈 5. Πολλαπλάσια φυσικών αριθμών', 
    labelEn: '📈 5. Multiples of natural numbers',
    href: '/e-dimotikou/05-pollaplasia' 
  },
  { 
    id: '06-ekp', 
    section: 'sec1', 
    label: '🎯 6. Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.)', 
    labelEn: '🎯 6. Least Common Multiple (LCM)',
    href: '/e-dimotikou/06-ekp' 
  },
  { 
    id: '07-diairetes', 
    section: 'sec1', 
    label: '🪓 7. Διαιρέτες φυσικών αριθμών', 
    labelEn: '🪓 7. Divisors of natural numbers',
    href: '/e-dimotikou/07-diairetes' 
  },
  { 
    id: '08-mkd', 
    section: 'sec1', 
    label: '🥇 8. Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)', 
    labelEn: '🥇 8. Greatest Common Divisor (GCD)',
    href: '/e-dimotikou/08-mkd' 
  },
  { 
    id: '09-krit-diaret', 
    section: 'sec1', 
    label: '🛡️ 9. Κριτήρια διαιρετότητας', 
    labelEn: '🛡️ 9. Divisibility criteria',
    href: '/e-dimotikou/09-krit-diaret' 
  },
  { 
    id: '10-epanalipsi-1', 
    section: 'sec1', 
    label: '🏆 10. Επανάληψη: Κεφάλαια 1 – 9', 
    labelEn: '🏆 10. Review: Chapters 1 – 9',
    href: '/e-dimotikou/10-epanalipsi-1', 
    isReview: true 
  },

  // --- ΕΝΟΤΗΤΑ 2: ΜΕΣΗ ΤΙΜΗ & ΠΟΣΟΣΤΑ ---
  { 
    id: '11-mesitimi', 
    section: 'sec2', 
    label: '📊 11. Υπολογισμός μέσης τιμής', 
    labelEn: '📊 11. Calculating the mean (average)',
    href: '/e-dimotikou/11-mesitimi' 
  },
  { 
    id: '12-pososta', 
    section: 'sec2', 
    label: '🏷️ 12. Εισαγωγή στα ποσοστά', 
    labelEn: '🏷️ 12. Introduction to percentages',
    href: '/e-dimotikou/12-pososta' 
  },

  // --- ΕΝΟΤΗΤΑ 3: ΓΕΩΜΕΤΡΙΑ & ΤΡΙΓΩΝΑ ---
  { 
    id: '13-gonies', 
    section: 'sec3', 
    label: '🧭 13. Είδη γωνιών και μέτρηση', 
    labelEn: '🧭 13. Angle types and measurement',
    href: '/e-dimotikou/13-gonies' 
  },
  { 
    id: '14-trigona', 
    section: 'sec3', 
    label: '🔺 14. Είδη τριγώνων ως προς τις γωνίες', 
    labelEn: '🔺 14. Triangles classified by angles',
    href: '/e-dimotikou/14-trigona' 
  },
  { 
    id: '15-trigona-pleures', 
    section: 'sec3', 
    label: '▲ 15. Είδη τριγώνων ως προς τις πλευρές', 
    labelEn: '▲ 15. Triangles classified by sides',
    href: '/e-dimotikou/15-trigona-pleures' 
  },
  { 
    id: '16-kathetes-eutheies', 
    section: 'sec3', 
    label: '⟂ 16. Κάθετες ευθείες', 
    labelEn: '⟂ 16. Perpendicular lines',
    href: '/e-dimotikou/16-kathetes-eutheies' 
  },
  { 
    id: '17-apostasi-simeiou-eutheias', 
    section: 'sec3', 
    label: '📏 17. Απόσταση σημείου από ευθεία', 
    labelEn: '📏 17. Distance of a point from a line',
    href: '/e-dimotikou/17-apostasi-simeiou-eutheia' 
  },
  { 
    id: '18-ipsos-trigonou', 
    section: 'sec3', 
    label: '📐 18. Σχεδίαση και μέτρηση ύψους τριγώνου', 
    labelEn: '📐 18. Drawing and measuring triangle altitude',
    href: '/e-dimotikou/18-ipsos-trigonou' 
  },
  { 
    id: '19-aksonas-simmetrias', 
    section: 'sec3', 
    label: '🪞 19. Άξονας συμμετρίας σε γεωμετρικά σχήματα', 
    labelEn: '🪞 19. Axis of symmetry in geometric shapes',
    href: '/e-dimotikou/19-aksonas-simmetrias' 
  },

  // --- ΕΝΟΤΗΤΑ 4: ΜΕΤΡΗΣΕΙΣ, ΠΕΡΙΜΕΤΡΟΣ, ΕΜΒΑΔΟΝ & ΟΓΚΟΣ ---
  { 
    id: '20-mikos-kiklou', 
    section: 'sec4', 
    label: '⭕ 20. Υπολογισμός μήκους κύκλου', 
    labelEn: '⭕ 20. Calculating circumference of a circle',
    href: '/e-dimotikou/20-mikos-kiklou' 
  },
  { 
    id: '21-monades-mikous', 
    section: 'sec4', 
    label: '📐 21. Μονάδες μέτρησης μήκους και μετατροπές', 
    labelEn: '📐 21. Units of length and conversions',
    href: '/e-dimotikou/21-monades-mikous' 
  },
  { 
    id: '22-poligona', 
    section: 'sec4', 
    label: '⬡ 22. Γνωριμία με τα πολύγωνα', 
    labelEn: '⬡ 22. Introduction to polygons',
    href: '/e-dimotikou/22-poligona' 
  },
  { 
    id: '23-kanonika-poligona', 
    section: 'sec4', 
    label: '🛑 23. Κανονικά πολύγωνα', 
    labelEn: '🛑 23. Regular polygons',
    href: '/e-dimotikou/23-kanonika-poligona' 
  },
  { 
    id: '24-perimetros', 
    section: 'sec4', 
    label: '🔲 24. Περίμετρος γεωμετρικών σχημάτων', 
    labelEn: '🔲 24. Perimeter of geometric shapes',
    href: '/e-dimotikou/24-perimetros' 
  },
  { 
    id: '25-embado', 
    section: 'sec4', 
    label: '🟩 25. Η έννοια του εμβαδού', 
    labelEn: '🟩 25. Concept of area',
    href: '/e-dimotikou/25-embado' 
  },
  { 
    id: '26-embado-sximaton', 
    section: 'sec4', 
    label: '▦ 26. Εμβαδόν επιπέδων σχημάτων', 
    labelEn: '▦ 26. Area of 2D plane figures',
    href: '/e-dimotikou/26-embado-sximaton' 
  },
  { 
    id: '27-monades-epifaneias', 
    section: 'sec4', 
    label: '🗺️ 27. Μονάδες μέτρησης επιφάνειας', 
    labelEn: '🗺️ 27. Units of surface area measurement',
    href: '/e-dimotikou/27-monades-epifaneias' 
  },
  { 
    id: '28-ennoia-ogkou', 
    section: 'sec4', 
    label: '📦 28. Η έννοια του όγκου', 
    labelEn: '📦 28. Concept of volume',
    href: '/e-dimotikou/28-ennoia-ogkou' 
  },
  { 
    id: '29-ogkoi-sximaton', 
    section: 'sec4', 
    label: '🧊 29. Υπολογισμός όγκου στερεών σωμάτων', 
    labelEn: '🧊 29. Volume calculation of solid figures',
    href: '/e-dimotikou/29-ogkoi-sximaton' 
  },
  { 
    id: '30-epanalipsi-2', 
    section: 'sec4', 
    label: '🎖️ 30. Επανάληψη: Κεφάλαια 13 – 29', 
    labelEn: '🎖️ 30. Review: Chapters 13 – 29',
    href: '/e-dimotikou/30-epanalipsi-2', 
    isReview: true 
  },
];