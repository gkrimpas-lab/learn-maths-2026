// shared/layout-config.js

export const LAYOUT = {
  // Απλώνει το Navbar και τα κεντρικά Grid σε όλη την οθόνη (με ένα ελεύθερο 5% δεξιά-αριστερά)
  // Στο 2xl (2K οθόνες) μεγαλώνει η βασική γραμματοσειρά όλης της περιοχής (2xl:text-lg)
  CONTAINER: "w-[92%] mx-auto px-4 xl:w-[94%] 2xl:w-[95%] 2xl:text-lg transition-all duration-300",
  
  // Για τα εσωτερικά μαθήματα, απλώνει επίσης ελεύθερα αλλά κρατάει μια ελάχιστη ισορροπία
  LESSON_CONTAINER: "w-[92%] mx-auto px-4 xl:w-[90%] 2xl:w-[92%] 2xl:text-lg transition-all duration-300",
  
  // Μεγαλώνει και τα SVG γραφικά για να μην φαίνονται μικροσκοπικά στην 2K οθόνη
  SVG_RESPONSIVE: "w-full max-w-[340px] md:max-w-[420px] 2xl:max-w-[550px] h-auto overflow-visible mx-auto transition-all"
};
