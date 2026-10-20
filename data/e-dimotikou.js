export const E_DIMOTIKOU_SECTIONS = [
  { id: 'sec1', title: 'Ενότητα 1: Κλάσματα, Πολλαπλάσια, ΕΚΠ & ΜΚΔ' },
  { id: 'sec2', title: 'Ενότητα 2: Μέση Τιμή & Ποσοστά' },
  { id: 'sec3', title: 'Ενότητα 3: Γεωμετρία, Τρίγωνα & Συμμετρία' },
  { id: 'sec4', title: 'Ενότητα 4: Μετρήσεις, Περίμετρος, Εμβαδόν & Όγκος' },
];

export const E_DIMOTIKOU_MODULES = [
  // --- ΕΝΟΤΗΤΑ 1: ΚΛΑΣΜΑΤΑ, ΕΚΠ & ΜΚΔ ---
  { id: '01-klasma', section: 'sec1', label: '🍕 1. Η έννοια του κλάσματος', href: '/e-dimotikou/01-klasma' },
  { id: '02-isodinama', section: 'sec1', label: '🔄 2. Ισοδύναμα κλάσματα', href: '/e-dimotikou/02-isodinama' },
  { id: '03-aplopoiisi', section: 'sec1', label: '✂️ 3. Απλοποίηση κλασμάτων', href: '/e-dimotikou/03-aplopoiisi' },
  { id: '04-anagogi', section: 'sec1', label: '🔍 4. Αναγωγή στην κλασματική μονάδα', href: '/e-dimotikou/04-anagogi' },
  { id: '05-pollaplasia', section: 'sec1', label: '🔢 5. Πολλαπλάσια φυσικών αριθμών', href: '/e-dimotikou/05-pollaplasia' },
  { id: '06-ekp', section: 'sec1', label: '🎯 6. Ελάχιστο Κοινό Πολλαπλάσιο (Ε.Κ.Π.)', href: '/e-dimotikou/06-ekp' },
  { id: '07-diairetes', section: 'sec1', label: '🛡️ 7. Διαιρέτες φυσικών αριθμών', href: '/e-dimotikou/07-diairetes' },
  { id: '08-mkd', section: 'sec1', label: '🏆 8. Μέγιστος Κοινός Διαιρέτης (Μ.Κ.Δ.)', href: '/e-dimotikou/08-mkd' },
  { id: '09-krit-diaret', section: 'sec1', label: '🔍 9. Κριτήρια διαιρετότητας', href: '/e-dimotikou/09-krit-diaret' },
  { id: '10-epanalipsi-1', section: 'sec1', label: '🏆 10. Επανάληψη: Κεφάλαια 1 – 9', href: '/e-dimotikou/10-epanalipsi-1', isReview: true },

  // --- ΕΝΟΤΗΤΑ 2: ΜΕΣΗ ΤΙΜΗ & ΠΟΣΟΣΤΑ ---
  { id: '11-mesitimi', section: 'sec2', label: '📊 11. Υπολογισμός μέσης τιμής', href: '/e-dimotikou/11-mesitimi' },
  { id: '12-pososta', section: 'sec2', label: '🏷️ 12. Εισαγωγή στα ποσοστά', href: '/e-dimotikou/12-pososta' },

  // --- ΕΝΟΤΗΤΑ 3: ΓΕΩΜΕΤΡΙΑ & ΤΡΙΓΩΝΑ ---
  { id: '13-gonies', section: 'sec3', label: '📐 13. Είδη γωνιών και μέτρηση', href: '/e-dimotikou/13-gonies' },
  { id: '14-trigona', section: 'sec3', label: '🔺 14. Είδη τριγώνων ως προς τις γωνίες', href: '/e-dimotikou/14-trigona' },
  { id: '15-trigona-pleures', section: 'sec3', label: '📐 15. Είδη τριγώνων ως προς τις πλευρές', href: '/e-dimotikou/15-trigona-pleures' },
  { id: '16-kathetes-eutheies', section: 'sec3', label: '⟂ 16. Κάθετες ευθείες', href: '/e-dimotikou/16-kathetes-eutheies' },
  { id: '17-apostasi-simeiou-eutheias', section: 'sec3', label: '📏 17. Απόσταση σημείου από ευθεία', href: '/e-dimotikou/17-apostasi-simeiou-eutheia' },
  { id: '18-ipsos-trigonou', section: 'sec3', label: '📐 18. Σχεδίαση και μέτρηση ύψους τριγώνου', href: '/e-dimotikou/18-ipsos-trigonou' },
  { id: '19-aksonas-simmetrias', section: 'sec3', label: '🪞 19. Άξονας συμμετρίας σε γεωμετρικά σχήματα', href: '/e-dimotikou/19-aksonas-simmetrias' },

  // --- ΕΝΟΤΗΤΑ 4: ΜΕΤΡΗΣΕΙΣ, ΠΕΡΙΜΕΤΡΟΣ, ΕΜΒΑΔΟΝ & ΟΓΚΟΣ ---
  { id: '20-mikos-kiklou', section: 'sec4', label: '⭕ 20. Υπολογισμός μήκους κύκλου', href: '/e-dimotikou/20-mikos-kiklou' },
  { id: '21-monades-mikous', section: 'sec4', label: '📏 21. Μονάδες μέτρησης μήκους και μετατροπές', href: '/e-dimotikou/21-monades-mikous' },
  { id: '22-poligona', section: 'sec4', label: '⬡ 22. Γνωριμία με τα πολύγωνα', href: '/e-dimotikou/22-poligona' },
  { id: '23-kanonika-poligona', section: 'sec4', label: '🛑 23. Κανονικά πολύγωνα', href: '/e-dimotikou/23-kanonika-poligona' },
  { id: '24-perimetros', section: 'sec4', label: '🔲 24. Περίμετρος γεωμετρικών σχημάτων', href: '/e-dimotikou/24-perimetros' },
  { id: '25-embado', section: 'sec4', label: '🟩 25. Η έννοια του εμβαδού', href: '/e-dimotikou/25-embado' },
  { id: '26-embado-sximaton', section: 'sec4', label: '📐 26. Εμβαδόν επιπέδων σχημάτων', href: '/e-dimotikou/26-embado-sximaton' },
  { id: '27-monades-epifaneias', section: 'sec4', label: '🗺️ 27. Μονάδες μέτρησης επιφάνειας', href: '/e-dimotikou/27-monades-epifaneias' },
  { id: '28-ennoia-ogkou', section: 'sec4', label: '📦 28. Η έννοια του όγκου', href: '/e-dimotikou/28-ennoia-ogkou' },
  { id: '29-ogkoi-sximaton', section: 'sec4', label: '🧊 29. Υπολογισμός όγκου στερεών σωμάτων', href: '/e-dimotikou/29-ogkoi-sximaton' },
  { id: '30-epanalipsi-2', section: 'sec4', label: '🏆 30. Επανάληψη: Κεφάλαια 13 – 29', href: '/e-dimotikou/30-epanalipsi-2', isReview: true },
];
