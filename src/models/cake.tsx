import type { ThreeElements } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import type { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type CakeProps = ThreeElements["group"];

import { resolvePath } from "../utils/file";

export function Cake({ children, ...groupProps }: CakeProps) {
  const gltf = useLoader(GLTFLoader, resolvePath("/cake.glb"));
  const cakeScene = useMemo<Group | null>(() => gltf.scene?.clone(true) ?? null, [gltf.scene]);

  if (!cakeScene) {
    return null;
  }

  return (
    <group {...groupProps}>
      <primitive object={cakeScene} />
      {children}
    </group>
  );
}

export function Cupcake({ children, ...groupProps }: CakeProps) {
  const gltf = useLoader(GLTFLoader, resolvePath("/cupcake.glb"));
  const cupcakeScene = useMemo<Group | null>(() => gltf.scene?.clone(true) ?? null, [gltf.scene]);

  if (!cupcakeScene) {
    return null;
  }

  return (
    <group {...groupProps}>
      <primitive object={cupcakeScene} />
      {children}
    </group>
  );
}