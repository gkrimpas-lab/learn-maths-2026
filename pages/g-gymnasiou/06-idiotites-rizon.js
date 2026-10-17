// Ενιαίο SVG Component για Ρίζα Κλάσματος √(num / den) χωρίς κανένα σπάσιμο ή αστοχία ευθυγράμμισης
function RadicalFrac({ num, den, className = "" }) {
  return (
    <span className={`inline-flex items-center align-middle ${className}`}>
      <svg
        viewBox="0 0 42 46"
        className="h-[2.3em] w-auto overflow-visible select-none font-mono"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        {/* Σχεδίαση της ρίζας και της επάνω γραμμής (vinculum) ως ενιαίο μονοπάτι */}
        <path d="M2 24 L5 24 L9 42 L16 3 L40 3" />
        {/* Οριζόντια γραμμή του κλάσματος */}
        <line x1="18" y1="23" x2="38" y2="23" strokeWidth="1.6" />
        {/* Αριθμητής */}
        <text
          x="28"
          y="18"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="15"
          fontWeight="bold"
          fontFamily="inherit"
        >
          {num}
        </text>
        {/* Παρονομαστής */}
        <text
          x="28"
          y="37"
          textAnchor="middle"
          fill="currentColor"
          stroke="none"
          fontSize="15"
          fontWeight="bold"
          fontFamily="inherit"
        >
          {den}
        </text>
      </svg>
    </span>
  );
}
