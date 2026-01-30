import type { ThreeElements } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import type { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CUSTOMIZATION } from "../config";

type TeddyProps = ThreeElements["group"];

export function Teddy({ children, ...groupProps }: TeddyProps) {
    // Load the model defined in config
    const gltf = useLoader(GLTFLoader, CUSTOMIZATION.assets.teddyModel);
    const scene = useMemo<Group | null>(() => gltf.scene?.clone(true) ?? null, [gltf.scene]);

    if (!scene) {
        return null;
    }

    return (
        <group {...groupProps}>
            <primitive object={scene} />
            {children}
        </group>
    );
}
