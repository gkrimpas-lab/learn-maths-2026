// pages/d-dimotikou/28-sterea-anoigma.js
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';

function toCleanUppercase(str) {
  if (!str) return '';
  const parts = str.split(/(Δ')/g);
  return parts
    .map((part) => {
      if (part === "Δ'") return "Δ'";
      return part.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase();
    })
    .join('');
}

const TRANSLATIONS = {
  el: {
    pageTitle: "Τα Αναπτύγματα των Στερεών Σωμάτων - Θεωρία | LearnMaths.gr",
    pageDesc: "Μαθαίνουμε πώς ανοίγουν και αναπτύσσονται σε επίπεδο τα γεωμετρικά στερεά: κύβος, παραλληλεπίπεδο, πυραμίδες, κύλινδρος, κώνος και η ιδιαιτερότητα της σφαίρας.",
    backText: "Δ' Δημοτικού",
    badgeGrade: "Δ' ΔΗΜΟΤΙΚΟΥ",
    exercisesBtn: "Ασκήσεις",
    heroTitle: "Τα Αναπτύγματα των Στερεών Σωμάτων",
    heroDesc: "Μαθαίνουμε τι συμβαίνει όταν «ανοίγουμε» (ξεδιπλώνουμε) ένα γεωμετρικό στερεό πάνω σε μία επίπεδη επιφάνεια και πώς μπορούμε να το ανακατασκευάσουμε!",
    heroCardTitle: "Έτοιμος για εξάσκηση;",
    heroCardDesc: "Δοκίμασε τις διαδραστικές ασκήσεις στα αναπτύγματα των στερεών για να ελέγξεις τις γνώσεις σου!",
    heroCardBtn: "Μετάβαση στις Ασκήσεις",
    conceptTitle: "Τι είναι το Ανάπτυγμα ενός Στερεού;",
    card1Badge: "1. ΤΟ «ΞΕΔΙΠΛΩΜΑ»",
    card1Title: "Το «Ξεδίπλωμα»",
    card1Text: "Ανάπτυγμα ονομάζεται το επίπεδο σχέδιο από χαρτόνι που, αν το κόψουμε και το διπλώσουμε κατά μήκος των ακμών του, σχηματίζει το τρισδιάστατο στερεό.",
    card2Badge: "2. ΕΠΙΠΕΔΑ ΣΧΗΜΑΤΑ",
    card2Title: "Επίπεδα Σχήματα",
    card2Text: "Κάθε ανάπτυγμα αποτελείται από τα επίπεδα γεωμετρικά σχήματα των εδρών του (τετράγωνα, ορθογώνια, τρίγωνα ή κυκλικούς δίσκους).",
    card3Badge: "3. Η ΣΦΑΙΡΑ",
    card3Title: "Η Σφαίρα",
    card3Text: "Η σφαίρα δεν έχει επίπεδο ανάπτυγμα, επειδή η καμπύλη επιφάνειά της κάμπτεται προς όλες τις κατευθύνσεις και δεν μπορεί να ισιώσει τέλεια σε επίπεδο χαρτί.",
    labTitle: "Διαδραστικό Εργαστήριο: 3D Στερεό & 2D Ανάπτυγμα",
    labSubtitle: "Επίλεξε ένα στερεό σώμα για να συγκρίνεις δίπλα-δίπλα τη μορφή του (3D) με το επίπεδο ανάπτυγμά του (2D)!",
    badge3D: "1. Τρισδιάστατο Στερεό (3D)",
    badge2D: "2. Επίπεδο Ανάπτυγμα (2D)",
    prevBtn: "Προηγούμενο",
    nextBtn: "Επόμενο",
    howToBuildTitle: "Πώς κατασκευάζεται το ανάπτυγμα για:",
    foldLinesNote: "🔸 Οι πορτοκαλί διακεκομμένες γραμμές δείχνουν τα σημεία όπου διπλώνουμε το χαρτόνι!",
    sphereNoNetTitle: "Η σφαίρα δεν ανοίγει σε επίπεδο ανάπτυγμα!",
    sphereNoNetSub: "(Όπως ακριβώς δεν μπορούμε να ισιώσουμε απόλυτα τη φλούδα ενός πορτοκαλιού)",
    tableTitle: "Συγκεντρωτικός Πίνακας Αναπτυγμάτων",
    thSolid: "Στερεό Σώμα",
    thShapes: "Σχήματα στο Ανάπτυγμα",
    thFeatures: "Χαρακτηριστικά",
    ctaTitle: "Ώρα για Εξάσκηση!",
    ctaDesc: "Έμαθες να αναγνωρίζεις τα αναπτύγματα των γεωμετρικών στερεών; Δοκίμασε τις διαδραστικές ασκήσεις!",
    ctaBtn: "Ξεκίνα τις Ασκήσεις",
    footerGrade: "Μαθηματικά Δ' Δημοτικού",
    footerChapter: "Κεφάλαιο 28: Αναπτύγματα Στερεών Σωμάτων",
    footerAction: "Μετάβαση στις Ασκήσεις",
    solids: {
      cube: {
        name: "Κύβος",
        netDesc: "6 ίσα τετράγωνα ενωμένα σε σχήμα σταυρού (ή άλλες 11 ισοδύναμες παραλλαγές αναπτύγματος).",
        shapesCount: "6 Τετράγωνα"
      },
      cuboid: {
        name: "Ορθογώνιο Παραλληλεπίπεδο",
        netDesc: "6 ορθογώνια παραλληλόγραμμα (ανά 2 απέναντι είναι ίσα μεταξύ τους).",
        shapesCount: "6 Ορθογώνια"
      },
      sqPyramid: {
        name: "Τετραγωνική Πυραμίδα",
        netDesc: "1 τετράγωνο στο κέντρο (βάση) και 4 τρίγωνα περιμετρικά (παράπλευρες έδρες) σε σχήμα αστεριού.",
        shapesCount: "1 Τετράγωνο ＋ 4 Τρίγωνα"
      },
      triPyramid: {
        name: "Τριγωνική Πυραμίδα (Τετράεδρο)",
        netDesc: "1 κεντρικό τρίγωνο (βάση) και 3 τρίγωνα συνδεδεμένα στις πλευρές του (σύνολο 4 ισόπλευρα τρίγωνα).",
        shapesCount: "4 Τρίγωνα"
      },
      cylinder: {
        name: "Κύλινδρος",
        netDesc: "1 ορθογώνιο παραλληλόγραμμο (παράπλευρη επιφάνεια) και 2 ίσοι κυκλικοί δίσκοι (πάνω και κάτω βάση).",
        shapesCount: "1 Ορθογώνιο ＋ 2 Κύκλοι"
      },
      cone: {
        name: "Κώνος",
        netDesc: "1 κυκλικός τομέας (τμήμα κύκλου σαν βεντάλια) και 1 κυκλικός δίσκος (βάση) που εφάπτεται στο κυρτό του τόξο.",
        shapesCount: "1 Κυκλικός Τομέας ＋ 1 Κύκλος"
      },
      sphere: {
        name: "Σφαίρα",
        netDesc: "Η σφαίρα δεν έχει επίπεδο ανάπτυγμα. Η καμπύλη επιφάνειά της δεν μπορεί να απλωθεί σε επίπεδο χαρτί χωρίς να τσαλακωθεί ή να σκιστεί.",
        shapesCount: "Κανένα Επίπεδο Ανάπτυγμα"
      }
    }
  },
  en: {
    pageTitle: "Nets of 3D Geometric Solids - Theory | LearnMaths.gr",
    pageDesc: "Learn how geometric solids unfold into 2D nets: cube, rectangular prism, pyramids, cylinder, cone, and the uniqueness of the sphere.",
    backText: "4th Grade",
    badgeGrade: "GRADE 4",
    exercisesBtn: "Exercises",
    heroTitle: "Nets of 3D Geometric Solids",
    heroDesc: "Learn what happens when we unfold a 3D geometric solid onto a flat surface and how we can reconstruct it!",
    heroCardTitle: "Ready to practice?",
    heroCardDesc: "Try the interactive exercises on nets of solids to test your knowledge!",
    heroCardBtn: "Go to Exercises",
    conceptTitle: "What is the Net of a Geometric Solid?",
    card1Badge: "1. THE «UNFOLDING»",
    card1Title: "The «Unfolding»",
    card1Text: "A net is a 2D cardboard pattern that, when cut and folded along its edges, forms the three-dimensional geometric solid.",
    card2Badge: "2. 2D SHAPES",
    card2Title: "2D Shapes",
    card2Text: "Every net consists of the flat geometric shapes of its faces (squares, rectangles, triangles, or circular disks).",
    card3Badge: "3. THE SPHERE",
    card3Title: "The Sphere",
    card3Text: "The sphere does not have a flat net, because its curved surface bends in all directions and cannot flatten completely onto paper without distortion.",
    labTitle: "Interactive Lab: 3D Solid & 2D Net",
    labSubtitle: "Select a solid to compare its 3D form side-by-side with its 2D unfolded net!",
    badge3D: "1. 3D Geometric Solid",
    badge2D: "2. 2D Unfolded Net",
    prevBtn: "Previous",
    nextBtn: "Next",
    howToBuildTitle: "How the net is formed for:",
    foldLinesNote: "🔸 The orange dashed lines show where the cardboard is folded!",
    sphereNoNetTitle: "A sphere cannot unfold into a flat net!",
    sphereNoNetSub: "(Just like we cannot perfectly flatten the peel of an orange)",
    tableTitle: "Summary Table of Nets",
    thSolid: "Solid Shape",
    thShapes: "Shapes in Net",
    thFeatures: "Key Characteristics",
    ctaTitle: "Time for Practice!",
    ctaDesc: "Mastered recognizing nets of 3D solids? Try the interactive exercises!",
    ctaBtn: "Start Exercises",
    footerGrade: "Grade 4 Mathematics",
    footerChapter: "Chapter 28: Nets of 3D Solids",
    footerAction: "Go to Exercises",
    solids: {
      cube: {
        name: "Cube",
        netDesc: "6 equal squares joined in a cross pattern (or 11 other valid net variations).",
        shapesCount: "6 Squares"
      },
      cuboid: {
        name: "Rectangular Prism (Cuboid)",
        netDesc: "6 rectangles (opposite faces are identical in pairs).",
        shapesCount: "6 Rectangles"
      },
      sqPyramid: {
        name: "Square Pyramid",
        netDesc: "1 square in the center (base) and 4 triangles around it (lateral faces) in a star shape.",
        shapesCount: "1 Square ＋ 4 Triangles"
      },
      triPyramid: {
        name: "Triangular Pyramid (Tetrahedron)",
        netDesc: "1 central triangle (base) and 3 triangles connected along its sides (total of 4 equilateral triangles).",
        shapesCount: "4 Triangles"
      },
      cylinder: {
        name: "Cylinder",
        netDesc: "1 rectangle (lateral curved surface) and 2 identical circular disks (top and bottom bases).",
        shapesCount: "1 Rectangle ＋ 2 Circles"
      },
      cone: {
        name: "Cone",
        netDesc: "1 circular sector (fan-shaped part of a circle) and 1 circular disk (base) touching its curved arc.",
        shapesCount: "1 Circular Sector ＋ 1 Circle"
      },
      sphere: {
        name: "Sphere",
        netDesc: "The sphere has no flat 2D net. Its curved surface cannot be laid flat on paper without tearing or wrinkling.",
        shapesCount: "No 2D Net"
      }
    }
  }
};

const BASE_NETS_DATA = [
  {
    id: 'cube',
    translationKey: 'cube',
    tagBg: 'bg-blue-100 text-blue-900 border-blue-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <line x1="50" y1="130" x2="50" y2="70" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50" y1="130" x2="110" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="50" y1="130" x2="90" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="90,100 150,100 150,160 90,160" fill="#3b82f6" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="90,100 150,100 110,70 50,70" fill="#60a5fa" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="3" />
        <polygon points="150,100 150,160 110,130 110,70" fill="#2563eb" fillOpacity="0.55" stroke="#1d4ed8" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        <rect x="75" y="20" width="40" height="40" fill="#60a5fa" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="75" y="60" width="40" height="40" fill="#3b82f6" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="35" y="60" width="40" height="40" fill="#93c5fd" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="115" y="60" width="40" height="40" fill="#93c5fd" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="75" y="100" width="40" height="40" fill="#2563eb" fillOpacity="0.45" stroke="#1d4ed8" strokeWidth="2" />
        <rect x="75" y="140" width="40" height="40" fill="#1d4ed8" fillOpacity="0.35" stroke="#1d4ed8" strokeWidth="2" />
        <line x1="75" y1="60" x2="115" y2="60" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="75" y1="100" x2="115" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="75" y1="140" x2="115" y2="140" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="75" y1="60" x2="75" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="115" y1="60" x2="115" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      </svg>
    )
  },
  {
    id: 'cuboid',
    translationKey: 'cuboid',
    tagBg: 'bg-teal-100 text-teal-900 border-teal-200',
    solidSvg: (
      <svg className="w-48 h-36 mx-auto block select-none" viewBox="0 0 220 180">
        <line x1="30" y1="115" x2="30" y2="60" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="30" y1="115" x2="130" y2="115" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="30" y1="115" x2="70" y2="145" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="70,90 170,90 170,145 70,145" fill="#14b8a6" fillOpacity="0.35" stroke="#0f766e" strokeWidth="3" />
        <polygon points="70,90 170,90 130,60 30,60" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="3" />
        <polygon points="170,90 170,145 130,115 130,60" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        <rect x="63" y="16" width="74" height="26" fill="#2dd4bf" fillOpacity="0.45" stroke="#0f766e" strokeWidth="2" />
        <rect x="63" y="42" width="74" height="38" fill="#14b8a6" fillOpacity="0.55" stroke="#0f766e" strokeWidth="2" />
        <rect x="37" y="42" width="26" height="38" fill="#5eead4" fillOpacity="0.35" stroke="#0f766e" strokeWidth="2" />
        <rect x="137" y="42" width="26" height="38" fill="#5eead4" fillOpacity="0.35" stroke="#0f766e" strokeWidth="2" />
        <rect x="63" y="80" width="74" height="26" fill="#0d9488" fillOpacity="0.55" stroke="#0f766e" strokeWidth="2" />
        <rect x="63" y="106" width="74" height="38" fill="#0f766e" fillOpacity="0.45" stroke="#0f766e" strokeWidth="2" />
        <line x1="63" y1="42" x2="137" y2="42" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="63" y1="80" x2="137" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="63" y1="106" x2="137" y2="106" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="63" y1="42" x2="63" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
        <line x1="137" y1="42" x2="137" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      </svg>
    )
  },
  {
    id: 'sq-pyramid',
    translationKey: 'sqPyramid',
    tagBg: 'bg-amber-100 text-amber-950 border-amber-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <line x1="40" y1="130" x2="130" y2="130" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="70" y2="160" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="130" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="70,160 160,160 100,40" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="160,160 130,130 100,40" fill="#d97706" fillOpacity="0.55" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
        <polygon points="70,160 100,40 40,130" fill="#fbbf24" fillOpacity="0.25" stroke="#b45309" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        <rect x="75" y="75" width="50" height="50" fill="#fbbf24" fillOpacity="0.45" stroke="#b45309" strokeWidth="2" />
        <polygon points="75,75 125,75 100,25" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="75,125 125,125 100,175" fill="#f59e0b" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="75,75 75,125 25,100" fill="#d97706" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="125,75 125,125 175,100" fill="#d97706" fillOpacity="0.35" stroke="#b45309" strokeWidth="2" strokeLinejoin="round" />
        <rect x="75" y="75" width="50" height="50" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      </svg>
    )
  },
  {
    id: 'tri-pyramid',
    translationKey: 'triPyramid',
    tagBg: 'bg-rose-100 text-rose-950 border-rose-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <line x1="90" y1="120" x2="100" y2="40" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="40" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="160" y1="150" x2="90" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <polygon points="40,150 160,150 100,40" fill="#f43f5e" fillOpacity="0.4" stroke="#be123c" strokeWidth="3" strokeLinejoin="round" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        <polygon points="100,30 35,145 165,145" fill="#fda4af" fillOpacity="0.25" stroke="#be123c" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="67.5,87.5 132.5,87.5 100,145" fill="#f43f5e" fillOpacity="0.5" stroke="#be123c" strokeWidth="2" strokeLinejoin="round" />
        <polygon points="67.5,87.5 132.5,87.5 100,145" fill="none" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
      </svg>
    )
  },
  {
    id: 'cylinder',
    translationKey: 'cylinder',
    tagBg: 'bg-purple-100 text-purple-950 border-purple-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 50,60 L 50,150 A 50,15 0 0,0 150,150 L 150,60 Z" fill="#8b5cf6" fillOpacity="0.35" stroke="#6d28d9" strokeWidth="3" />
        <ellipse cx="100" cy="60" rx="50" ry="15" fill="#a78bfa" fillOpacity="0.65" stroke="#6d28d9" strokeWidth="3" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        <circle cx="100" cy="38" r="22" fill="#a78bfa" fillOpacity="0.5" stroke="#6d28d9" strokeWidth="2" />
        <rect x="40" y="65" width="120" height="70" rx="2" fill="#8b5cf6" fillOpacity="0.35" stroke="#6d28d9" strokeWidth="2" />
        <circle cx="100" cy="162" r="22" fill="#a78bfa" fillOpacity="0.5" stroke="#6d28d9" strokeWidth="2" />
        <circle cx="100" cy="65" r="3" fill="#f59e0b" />
        <circle cx="100" cy="135" r="3" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: 'cone',
    translationKey: 'cone',
    tagBg: 'bg-cyan-100 text-cyan-950 border-cyan-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <path d="M 50,150 A 50,15 0 0,1 150,150" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 50,150 L 100,40 L 150,150 A 50,15 0 0,1 50,150 Z" fill="#06b6d4" fillOpacity="0.35" stroke="#0e7490" strokeWidth="3" />
        <circle cx="100" cy="40" r="4.5" fill="#fbbf24" />
      </svg>
    ),
    netSvg: (
      <svg className="w-44 h-44 mx-auto block select-none" viewBox="0 0 200 200">
        <path
          d="M 100,25 L 35,95 A 95,95 0 0,0 165,95 Z"
          fill="#06b6d4"
          fillOpacity="0.35"
          stroke="#0e7490"
          strokeWidth="2.5"
        />
        <circle
          cx="100"
          cy="144"
          r="24"
          fill="#67e8f9"
          fillOpacity="0.55"
          stroke="#0e7490"
          strokeWidth="2.5"
        />
        <circle cx="100" cy="25" r="3.5" fill="#fbbf24" />
        <circle cx="100" cy="120" r="3" fill="#f59e0b" />
      </svg>
    )
  },
  {
    id: 'sphere',
    translationKey: 'sphere',
    tagBg: 'bg-emerald-100 text-emerald-950 border-emerald-200',
    solidSvg: (
      <svg className="w-36 h-36 mx-auto block select-none" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="65" fill="#10b981" fillOpacity="0.35" stroke="#047857" strokeWidth="3" />
        <path d="M 35,100 A 65,20 0 0,1 165,100" fill="none" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        <path d="M 35,100 A 65,20 0 0,0 165,100" fill="none" stroke="#047857" strokeWidth="2.5" />
        <ellipse cx="80" cy="75" rx="15" ry="8" fill="#ffffff" fillOpacity="0.6" transform="rotate(-30, 80, 75)" />
      </svg>
    ),
    netSvg: null
  }
];

export default function StereaAnoigmaTheoryPage() {
  const router = useRouter();
  const rawLocale = router?.locale || 'el';
  const locale = TRANSLATIONS[rawLocale] ? rawLocale : 'el';
  const t = TRANSLATIONS[locale];

  const netsData = BASE_NETS_DATA.map((item) => {
    const sTrans = t.solids[item.translationKey];
    return {
      ...item,
      name: sTrans.name,
      netDesc: sTrans.netDesc,
      shapesCount: sTrans.shapesCount
    };
  });

  const [selectedSolidIndex, setSelectedSolidIndex] = useState(0);
  const currentSolid = netsData[selectedSolidIndex];

  const handleSelectSolid = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex(index);
  };

  const handleNextSolid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex((prev) => (prev + 1) % netsData.length);
  };

  const handlePrevSolid = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedSolidIndex((prev) => (prev - 1 + netsData.length) % netsData.length);
  };

  return (
    <Layout
      title={t.pageTitle}
      description={t.pageDesc}
      backUrl="/d-dimotikou"
      backText={t.backText}
      showAds={true}
      actionButton={
        <Link
          href="/d-dimotikou/28-sterea-anoigma-ask"
          className="bg-amber-500 hover:bg-amber-600 text-white font-black px-4 py-2 rounded-xl text-sm transition shadow-sm flex items-center gap-2 whitespace-nowrap"
        >
          <span>🎯</span> {t.exercisesBtn}
        </Link>
      }
    >
      <div className="w-full max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto px-3 sm:px-6 lg:px-12 2xl:px-16 py-6 pb-28 sm:pb-36 overflow-x-hidden space-y-8">
        {/* HEADER & EXERCISES PROMO CARD */}
        <div className="bg-gradient-to-r from-teal-600 via-indigo-600 to-purple-600 text-white p-6 sm:p-8 rounded-3xl shadow-md relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-3">
              <span className="bg-white/20 text-white text-xs font-black uppercase px-3 py-1 rounded-full tracking-wider">
                {toCleanUppercase(t.badgeGrade)}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
                📦 {t.heroTitle}
              </h1>
              <p className="text-indigo-100 text-sm sm:text-base lg:text-lg leading-relaxed">
                {t.heroDesc}
              </p>
            </div>

            {/* ΠΛΑΙΣΙΟ ΠΑΡΑΠΟΜΠΗΣ ΣΤΙΣ ΑΣΚΗΣΕΙΣ */}
            <div className="bg-white/10 backdrop-blur-md p-5 rounded-2xl border border-white/20 text-center space-y-3 shadow-lg">
              <div className="text-3xl">🚀</div>
              <h2 className="font-extrabold text-white text-lg">{t.heroCardTitle}</h2>
              <p className="text-xs text-indigo-100">
                {t.heroCardDesc}
              </p>
              <Link
                href="/d-dimotikou/28-sterea-anoigma-ask"
                className="inline-block w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-3 px-4 rounded-xl shadow-md transition transform hover:-translate-y-0.5 text-sm"
              >
                🎯 {t.heroCardBtn}
              </Link>
            </div>
          </div>
        </div>

        {/* ΘΕΩΡΙΑ - ΤΙ ΕΙΝΑΙ ΤΟ ΑΝΑΠΤΥΓΜΑ */}
        <div className="bg-white p-6 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📖</span> {t.conceptTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* 1. Ξεδίπλωμα */}
            <div className="bg-blue-50/70 p-5 sm:p-6 rounded-2xl border border-blue-100 space-y-3 shadow-sm">
              <div className="bg-blue-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.card1Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-blue-950 flex items-center gap-2">
                <span>✂️</span> {t.card1Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.card1Text}
              </p>
            </div>

            {/* 2. Σχήματα & Έδρες */}
            <div className="bg-indigo-50/70 p-5 sm:p-6 rounded-2xl border border-indigo-100 space-y-3 shadow-sm">
              <div className="bg-indigo-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.card2Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-indigo-950 flex items-center gap-2">
                <span>📐</span> {t.card2Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.card2Text}
              </p>
            </div>

            {/* 3. Η Εξαίρεση της Σφαίρας */}
            <div className="bg-rose-50/70 p-5 sm:p-6 rounded-2xl border border-rose-100 space-y-3 shadow-sm">
              <div className="bg-rose-600 text-white font-black text-xs px-3 py-1 rounded-full w-fit">
                {toCleanUppercase(t.card3Badge)}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-rose-950 flex items-center gap-2">
                <span>⚽</span> {t.card3Title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {t.card3Text}
              </p>
            </div>
          </div>
        </div>

        {/* ΔΙΑΔΡΑΣΤΙΚΟ ΕΡΓΑΣΤΗΡΙΟ ΑΝΑΠΤΥΓΜΑΤΩΝ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>🧮</span> {t.labTitle}
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              {t.labSubtitle}
            </p>
          </div>

          {/* ΚΟΥΜΠΙΑ ΕΠΙΛΟΓΗΣ */}
          <div className="flex flex-wrap gap-1.5">
            {netsData.map((item, idx) => (
              <button
                key={item.id}
                onClick={(e) => handleSelectSolid(e, idx)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition active:scale-95 touch-manipulation select-none ${
                  selectedSolidIndex === idx
                    ? 'bg-indigo-600 text-white font-black shadow-md shadow-indigo-200'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* ΟΠΤΙΚΗ ΣΥΓΚΡΙΣΗ: 3D ΣΤΕΡΕΟ VS 2D ΑΝΑΠΤΥΓΜΑ */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-2">
            {/* ΑΡΙΣΤΕΡΑ: ΤΟ 3D ΣΤΕΡΕΟ */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl flex flex-col items-center justify-center space-y-3">
              <span className="text-[11px] font-black uppercase tracking-widest text-indigo-400">
                {toCleanUppercase(t.badge3D)}
              </span>

              <div className="py-2 w-full max-w-[220px] aspect-square flex items-center justify-center">
                {currentSolid.solidSvg}
              </div>

              <h3 className="text-xl sm:text-2xl font-black text-white font-mono text-center">
                {currentSolid.name}
              </h3>

              {/* Πλοήγηση Steppers */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={handlePrevSolid}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-bold transition active:scale-95 touch-manipulation"
                  title={t.prevBtn}
                >
                  ◀ {t.prevBtn}
                </button>
                <span className="text-xs font-mono text-slate-400">
                  {selectedSolidIndex + 1} / {netsData.length}
                </span>
                <button
                  onClick={handleNextSolid}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-200 text-xs font-bold transition active:scale-95 touch-manipulation"
                  title={t.nextBtn}
                >
                  {t.nextBtn} ▶
                </button>
              </div>
            </div>

            {/* ΔΕΞΙΑ: ΤΟ ΕΠΙΠΕΔΟ ΑΝΑΠΤΥΓΜΑ (2D) */}
            <div className="bg-slate-950 p-6 sm:p-8 rounded-3xl border-2 border-indigo-500/30 shadow-xl flex flex-col items-center justify-center space-y-3 min-h-[300px]">
              <span className="text-[11px] font-black uppercase tracking-widest text-amber-400">
                {toCleanUppercase(t.badge2D)}
              </span>

              <div className="py-2 w-full max-w-[220px] aspect-square flex items-center justify-center">
                {currentSolid.netSvg ? (
                  currentSolid.netSvg
                ) : (
                  <div className="flex flex-col items-center justify-center h-44 text-center p-4">
                    <span className="text-4xl mb-2">🚫 🗺️</span>
                    <p className="text-xs font-bold text-rose-400">
                      {t.sphereNoNetTitle}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      {t.sphereNoNetSub}
                    </p>
                  </div>
                )}
              </div>

              <div className="text-center pt-1">
                <span className={`text-xs font-black px-3.5 py-1 rounded-full border ${currentSolid.tagBg}`}>
                  {currentSolid.shapesCount}
                </span>
              </div>
            </div>
          </div>

          {/* ΠΕΡΙΓΡΑΦΗ ΑΝΑΠΤΥΓΜΑΤΟΣ */}
          <div className="bg-slate-50 p-4 sm:p-6 rounded-2xl border border-slate-200 space-y-2 shadow-sm">
            <h4 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
              <span>💡</span> {t.howToBuildTitle} <u>{currentSolid.name}</u>
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {currentSolid.netDesc}
            </p>
            {currentSolid.id !== 'sphere' && (
              <p className="text-xs text-amber-800 font-bold">
                {t.foldLinesNote}
              </p>
            )}
          </div>
        </div>

        {/* ΣΥΝΟΠΤΙΚΟΣ ΠΙΝΑΚΑΣ ΑΝΑΠΤΥΓΜΑΤΩΝ */}
        <div className="bg-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 space-y-6">
          <div className="border-b pb-4 border-slate-100">
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <span>📊</span> {t.tableTitle}
            </h2>
          </div>

          {/* MOBILE VIEW: Stacked Cards (Χωρίς οριζόντιο scroll) */}
          <div className="block sm:hidden space-y-3">
            {netsData.map((item) => (
              <div
                key={`card-${item.id}`}
                className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5 shadow-xs"
              >
                <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <h3 className="font-black text-slate-900 text-sm">
                    {item.name}
                  </h3>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${item.tagBg}`}>
                    {item.shapesCount}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                  <span className="font-bold text-slate-900 block mb-1">
                    {t.thFeatures}:
                  </span>
                  {item.netDesc}
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP VIEW: Κλασικός Πίνακας (sm: και πάνω) */}
          <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs sm:text-sm border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 uppercase font-black text-[11px] tracking-wider border-b border-slate-200">
                  <th className="p-3">{toCleanUppercase(t.thSolid)}</th>
                  <th className="p-3">{toCleanUppercase(t.thShapes)}</th>
                  <th className="p-3">{toCleanUppercase(t.thFeatures)}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {netsData.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
                    <td className="p-3 font-black text-slate-900">{item.name}</td>
                    <td className="p-3 font-bold font-mono text-indigo-600">{item.shapesCount}</td>
                    <td className="p-3 text-slate-600">{item.netDesc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BOTTOM EXERCISES CALLOUT BANNER */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 p-6 md:p-8 rounded-3xl shadow-md text-slate-900 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black">📝 {t.ctaTitle}</h3>
            <p className="text-slate-800 text-sm md:text-base">
              {t.ctaDesc}
            </p>
          </div>
          <Link
            href="/d-dimotikou/28-sterea-anoigma-ask"
            className="bg-slate-900 hover:bg-black text-white font-black px-6 py-3.5 rounded-2xl shadow-lg transition transform hover:scale-105 text-sm md:text-base whitespace-nowrap"
          >
            {t.ctaBtn} ➔
          </Link>
        </div>
      </div>

      {/* ΣΤΑΘΕΡΟ BOTTOM FOOTER */}
      <footer className="fixed bottom-0 left-0 w-full z-50 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white py-3 px-4 sm:px-6 shadow-2xl">
        <div className="max-w-[1920px] 2xl:max-w-[2560px] 4k:max-w-[3840px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl hidden sm:inline select-none">📦</span>
            <div className="min-w-0">
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider truncate">
                {toCleanUppercase(t.footerGrade)}
              </p>
              <p className="text-sm font-black text-white truncate">
                {t.footerChapter}
              </p>
            </div>
          </div>
          <Link
            href="/d-dimotikou/28-sterea-anoigma-ask"
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-4 py-2 rounded-xl text-xs sm:text-sm transition transform active:scale-95 shadow-md flex items-center gap-2 whitespace-nowrap shrink-0"
          >
            <span>🎯</span>
            <span>{t.footerAction}</span>
          </Link>
        </div>
      </footer>
    </Layout>
  );
}