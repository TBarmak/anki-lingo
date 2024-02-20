import { motion } from "framer-motion-3d";
import { Link } from "react-router-dom";
import { Canvas } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default function Landing() {
  const gltf = useLoader(GLTFLoader, "/ankilingoearth.glb");

  return (
    <div className="route-component h-screen">
      <div className="flex flex-row justify-center items-center w-full h-full">
        <div className="m-8 flex-1 h-full">
          <Canvas camera={{ position: [0, 0, 7], near: 0.1, far: 1000 }}>
            <ambientLight intensity={3} />
            <OrbitControls />
            <primitive object={gltf.scene} />
          </Canvas>
        </div>
        <div className="flex flex-col justify-center items-center flex-1">
          <p className="secondary-text text-4xl font-bold m-4">Anki Lingo</p>
          <p className="secondary-text italic m-4">
            Automate generating anki flashcards for learning foreign languages
          </p>
          <Link className="button" to="/main">
            <div className="text-center">Get Started</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
