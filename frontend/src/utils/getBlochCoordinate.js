import { complex, abs, arg } from "mathjs";

function getBlochCoordinates(statevector) {
  if (!statevector.includes("|1>")) return { x: 0, y: 0, z: 1 };

  const terms = statevector
    .split("+")
    .map((t) => t.trim())
    .filter(Boolean);

  let alpha = "1", beta = "0"; // 기본값
  for (const term of terms) {
    const [amp, state] = term.split("*").map(s => s.trim());
    if (state.includes("|0>")) alpha = amp;
    if (state.includes("|1>")) beta = amp;
  }

  const α = complex(alpha);
  const β = complex(beta);

  const θ = 2 * Math.acos(abs(α));
  const φ = arg(β) - arg(α);

  return {
    x: Math.sin(θ) * Math.cos(φ),
    y: Math.sin(θ) * Math.sin(φ),
    z: Math.cos(θ),
  };
}
export { getBlochCoordinates };