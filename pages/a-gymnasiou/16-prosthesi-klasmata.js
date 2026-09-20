{/* Χειριστήρια Steppers: Ακέραιο (+/- 1) και Δεκαδικό (+/- 0.1) */}
              <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-5 rounded-2xl border border-slate-200">
                {/* 1ος Δεκαδικός */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">1ΟΣ ΔΕΚΑΔΙΚΟΣ</label>
                    <span className="text-base font-black font-mono text-indigo-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec1 > 0 ? `＋${dec1.toFixed(1).replace('.', ',')}` : dec1.toFixed(1).replace('.', ',')}
                    </span>
                  </div>

                  {/* Αλλαγή Ακέραιου Μέρους */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΑΚΕΡΑΙΟ (±1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-20, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(20, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* Αλλαγή Δεκαδικού Μέρους */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΔΕΚΑΔΙΚΟ (±0,1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.max(-20, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec1((prev) => Math.min(20, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋0,1
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2ος Δεκαδικός */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-600 uppercase">2ΟΣ ΔΕΚΑΔΙΚΟΣ</label>
                    <span className="text-base font-black font-mono text-sky-950 bg-white px-2.5 py-0.5 rounded-lg border border-slate-200">
                      {dec2 > 0 ? `＋${dec2.toFixed(1).replace('.', ',')}` : dec2.toFixed(1).replace('.', ',')}
                    </span>
                  </div>

                  {/* Αλλαγή Ακέραιου Μέρους */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΑΚΕΡΑΙΟ (±1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-20, Number((prev - 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(20, Number((prev + 1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋1
                      </button>
                    </div>
                  </div>

                  {/* Αλλαγή Δεκαδικού Μέρους */}
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">ΔΕΚΑΔΙΚΟ (±0,1)</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.max(-20, Number((prev - 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        －0,1
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          if (e) { e.preventDefault(); e.stopPropagation(); }
                          setDec2((prev) => Math.min(20, Number((prev + 0.1).toFixed(1))));
                        }}
                        className="h-9 flex items-center justify-center rounded-xl bg-white border border-slate-300 font-bold text-sm hover:bg-slate-100 active:scale-95 shadow-sm text-slate-800"
                      >
                        ＋0,1
                      </button>
                    </div>
                  </div>
                </div>
              </div>
