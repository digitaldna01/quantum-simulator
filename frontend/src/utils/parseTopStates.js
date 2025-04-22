export function parseTopStates(topStates, numQubits) {
    const totalStates = 2 ** numQubits;
    const allStates = [...Array(totalStates)].map((_, i) =>
      i.toString(2).padStart(numQubits, "0")
    );
  
    const cleanTopStates = (topStates || []).map(s =>
      s.replace(/[|>]/g, "")
    );
  
    const prob = cleanTopStates.length > 0
      ? 1 / cleanTopStates.length
      : 0;
  
    return allStates.map((state) => ({
      state : `|${state}>`,
      probability: cleanTopStates.includes(state) ? prob : 0,
    }));
  }