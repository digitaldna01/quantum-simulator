// src/utils/parseStatevector.js

export function parseStatevector(statevectorStr, numQubits) {
  if (!statevectorStr) return [];

  const totalStates = 2 ** numQubits; // 2^n
  const allStates = [...Array(totalStates)].map((_, i) =>
    i.toString(2).padStart(numQubits, "0")
  );

  const terms = statevectorStr.split("* |");

  const parsed = terms
    .map((term, idx) => {
      if (!term.trim()) return null;

      // 복소수 진폭 파싱
      const [ampRaw, stateSuffix] =
        idx === 0
          ? term.split("*").map((s) => s.trim()) // 첫 번째 항은 * 로 나뉘어져 있음
          : [term.trim(), allStates[idx]]; // 이후 항은 state 붙여서 구성

      const ampClean = ampRaw.replace(/[^\d.-]/g, ""); // 숫자 부분만 추출
      const amp = parseFloat(ampClean);

      const state =
        idx === 0 ? stateSuffix?.replace(/[|>]/g, "") : allStates[idx];

      return {
        state,
        amplitude: isNaN(amp) ? 0 : amp,
      };
    })
    .filter(Boolean);

  const probabilityMap = Object.fromEntries(
    parsed.map(({ state, amplitude }) => [state, Math.pow(amplitude, 2)])
  );

  return allStates.map((state) => ({
    state,
    probability: probabilityMap[state] || 0,
  }));
}
