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
      <div className="flex flex-col md:flex-row justify-center items-center w-full h-full">
        <div className="mb-8 w-full h-3/5 md:h-full md:w-1/2">
          <Canvas camera={{ position: [0, 0, 7], near: 0.1, far: 1000 }}>
            <ambientLight intensity={3} />
            <pointLight position={[7, 2, 3]} decay={0} intensity={10} />
            <primitive object={gltf.scene} />
          </Canvas>
        </div>
        <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-[20%] md:px-20">
          <p className="secondary-text text-4xl font-bold m-2 md:m-4">
            Anki Lingo
          </p>
          <p className="secondary-text italic m-2 md:m-4 text-center">
            Automate generating anki flashcards for learning foreign languages
          </p>
          <Link className="button mt-4" to="/main">
            <div className="text-center">Get Started</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
