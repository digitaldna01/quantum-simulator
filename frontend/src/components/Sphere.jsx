import "../App.css";
import "./Output.css";
import "./Sphere.css";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { getBlochCoordinates } from "../utils/getBlochCoordinate"; 

const Sphere = ({ statevector }) => {
  const { x, y, z } = getBlochCoordinates(statevector || "");

  return (
    <>
      <div className="col-span-1 p-4 border rounded-lg">
        <div className="title">SPHERE</div>
        <div className="h-5/6 ">
          <Canvas camera={{ position: [2, 2, 2] }}>
            <ambientLight />
            <pointLight position={[10, 10, 10]} />
            <BlochSphere />
            <BlochVector x={x} y={y} z={z} />
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
      <meshStandardMaterial color="#222" wireframe />
    </mesh>
  );
}

function BlochVector({ x, y, z }) {
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
      <lineBasicMaterial color="orange" />
    </line>
  );
}
