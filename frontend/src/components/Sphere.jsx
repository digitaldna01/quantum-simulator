import { Fragment, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

// Convert parsed amplitudes [{state, re, im, prob}] into 3D Q-sphere markers.
// Latitude evenly spaced by basis index (|0…0⟩ at the top, |1…1⟩ at the bottom),
// azimuth from the complex phase.
function toMarkers(amplitudes, numQubits) {
  const total = 1 << numQubits;
  return amplitudes
    .map((a, idx) => {
      if (a.prob < 0.001) return null;
      const phase = Math.atan2(a.im, a.re);
      const denom = total - 1 || 1;
      const theta = Math.acos((2 * idx) / denom - 1);
      const x = Math.sin(theta) * Math.cos(phase);
      const y = Math.cos(theta);
      const z = Math.sin(theta) * Math.sin(phase);
      return {
        idx,
        label: `|${a.state}⟩`,
        amplitude: Math.sqrt(a.prob),
        probability: a.prob,
        x, y, z,
      };
    })
    .filter(Boolean);
}

function BlochSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#666" wireframe />
    </mesh>
  );
}

function QSpherePoint({ state, x, y, z }) {
  const color = useMemo(() => new THREE.Color("#FF4B00"), []);
  return (
    <group>
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[x * 1.1, y * 1.1, z * 1.1]}
        fontSize={0.08}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {state}
      </Text>
    </group>
  );
}

function ConnectionLine({ x, y, z }) {
  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2}
          array={new Float32Array([0, 0, 0, x, y, z])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#FF4B00" linewidth={1} />
    </line>
  );
}

export default function Sphere({ amplitudes, numQubits }) {
  const markers = useMemo(
    () => toMarkers(amplitudes, numQubits),
    [amplitudes, numQubits]
  );
  // Force the canvas to remount when the active set changes; React-three
  // caches scene objects otherwise and stale markers can stick around.
  const canvasKey = markers.map((m) => m.idx).join(",");

  return (
    <div className="card" id="dashboard-sphere">
      <div className="card-head">
        <div className="title">Q-Sphere</div>
        <div className="meta">
          <span className="pill">{markers.length} active</span>
        </div>
      </div>
      <div className="sphere-wrap">
        <span className="sphere-axis">|0…0⟩ ↑ &nbsp; |1…1⟩ ↓</span>
        <div style={{ width: "100%", height: "100%", cursor: "move" }}>
          <Canvas key={canvasKey} camera={{ position: [1.5, 1.5, 1.5], fov: 50 }}>
            <ambientLight intensity={1.2} />
            <pointLight position={[5, 5, 5]} intensity={2} />
            <BlochSphere />
            {markers.map((m) => (
              <Fragment key={m.idx}>
                <QSpherePoint {...m} />
                <ConnectionLine {...m} />
              </Fragment>
            ))}
            <OrbitControls />
          </Canvas>
        </div>
      </div>
    </div>
  );
}
