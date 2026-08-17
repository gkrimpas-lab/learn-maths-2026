<!-- ... existing code ... -->
// Δημιουργία 8 μοναδικών ερωτήσεων
function generateQuestions() {
  const shuffledItems = shuffle(REAL_WORLD_ITEMS);

  // Q1: Interactive Yes/No Buttons - Διαιρετότητα με το 2, 5 ή 10
  const q1Div = [2, 5, 10][getRandomInt(0, 2)];
  const q1IsDivisible = Math.random() > 0.5;
  let q1Num = getRandomInt(120, 980);

  if (q1IsDivisible) {
    if (q1Div === 2) {
      if (q1Num % 2 !== 0) q1Num += 1;
    } else if (q1Div === 5) {
      q1Num = Math.floor(q1Num / 5) * 5;
    } else {
      q1Num = Math.floor(q1Num / 10) * 10;
    }
  } else {
    if (q1Div === 2) {
      if (q1Num % 2 === 0) q1Num += 1;
    } else if (q1Div === 5) {
      if (q1Num % 5 === 0) q1Num += 3;
    } else {
      if (q1Num % 10 === 0) q1Num += 3;
    }
  }

  const q1Correct = q1Num % q1Div === 0 ? 'Ναι' : 'Όχι';
  const q1Prompt = `Διαιρείται ο αριθμός ${q1Num} ακριβώς με το ${q1Div};`;

  // Q2: Input - Άθροισμα ψηφίων & Διαιρετότητα με το 3 ή 9
<!-- ... existing code ... -->
  return {
    q1: {
      type: 'yesno',
      title: 'Διαιρετότητα με 2, 5, 10',
      prompt: q1Prompt,
      number: String(q1Num),
      divisor: q1Div,
      correct: q1Correct,
      explain: q1Num % q1Div === 0
        ? `Σωστά! Το τελευταίο ψηφίο είναι ${q1Num % 10}, επομένως ο αριθμός ${q1Num} διαιρείται ακριβώς με το ${q1Div}.`
        : `Ο αριθμός ${q1Num} τελειώνει σε ${q1Num % 10}, άρα ΔΕΝ διαιρείται ακριβώς με το ${q1Div}.`
    },
    q2: {
<!-- ... existing code ... -->
              {/* ΕΡΩΤΗΣΗ 1 */}
              <div className={`p-6 rounded-3xl border transition-all ${getCardStyle('q1')}`}>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-xs font-black px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                    Άσκηση 1 • Διαιρετότητα με 2, 5, 10
                  </span>
                  {submitted && (
                    <span className="text-lg">{isCorrect('q1') ? '✅' : '❌'}</span>
                  )}
                </div>
                <p className="text-sm text-slate-700 mb-6 leading-relaxed font-medium">
                  {questions.q1.prompt}
                </p>
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q1', 'Ναι')}
                    className={`py-3 rounded-xl font-black text-sm border transition ${
                      answers.q1 === 'Ναι'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-emerald-50'
                    }`}
                  >
                    👍 Ναι
                  </button>
                  <button
                    type="button"
                    disabled={submitted}
                    onClick={() => handleInputChange('q1', 'Όχι')}
                    className={`py-3 rounded-xl font-black text-sm border transition ${
                      answers.q1 === 'Όχι'
                        ? 'bg-rose-600 text-white border-rose-600 shadow'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-rose-50'
                    }`}
                  >
                    👎 Όχι
                  </button>
                </div>
                {submitted && (
                  <div className={`p-3 rounded-xl text-xs font-medium ${isCorrect('q1') ? 'bg-emerald-100/70 text-emerald-900' : 'bg-rose-100/70 text-rose-900'}`}>
                    💡 {questions.q1.explain}
                  </div>
                )}
              </div>

              {/* ΕΡΩΤΗΣΗ 2 */}
<!-- ... existing code ... -->
