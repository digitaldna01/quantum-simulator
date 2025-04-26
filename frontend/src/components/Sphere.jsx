import "../App.css";
import "./Output.css";
import "./Sphere.css";

import { Fragment } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { parseStatevectorForQSphere } from "../utils/parseStatevectorForQSphere";
import * as THREE from "three";

const Sphere = ({ statevector, numQubits }) => {
  const vectors = parseStatevectorForQSphere(statevector, numQubits);

  return (
    <>
      <div className="col-span-1 p-4 border rounded-lg" id="dashboard-sphere">
        <div className="title">SPHERE</div>
        <div className="h-5/6 cursor-move">
          <Canvas
            key={JSON.stringify(statevector || [])}
            camera={{ position: [1.5, 1.5, 1.5], fov: 50 }}
          >
            <ambientLight intensity={1.2} />
            <pointLight position={[5, 5, 5]} intensity={2} />
            <BlochSphere />
            {vectors.map((vec, idx) => (
              <Fragment key={idx}>
                <QSpherePoint {...vec} />
                <ConnectionLine {...vec} />
              </Fragment>
            ))}
            <OrbitControls />
          </Canvas>
        </div>
      </div>
    </>
  );
};

export default Sphere;

function BlochSphere() {
  return (
    <mesh>
      <sphereGeometry args={[1, 64, 64]} />
      <meshStandardMaterial color="#666" wireframe />
    </mesh>
  );
}

function QSpherePoint({ state, amplitude, probability, phase, x, y, z }) {
  // const radius = 0.05 + probability * 0.2;
  const radius = 0.08;
  const color = new THREE.Color("#FF4B00");

  return (
    <group>
      <mesh position={[x, y, z]}>
        <sphereGeometry args={[radius, 16, 16]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[x * 1.1, y * 1.1, z * 1.1]} // 점에서 살짝 떨어진 위치
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

function ConnectionLine({ state, amplitude, probability, phase, x, y, z }) {
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
