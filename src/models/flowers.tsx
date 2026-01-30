import type { ThreeElements } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import type { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CUSTOMIZATION } from "../config";

type FlowersProps = ThreeElements["group"];

export function Flowers({ children, ...groupProps }: FlowersProps) {
    // Load the model defined in config
    const gltf = useLoader(GLTFLoader, CUSTOMIZATION.assets.flowerModel);
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

export function Flowers2({ children, ...groupProps }: FlowersProps) {
    // Load the model defined in config
    const gltf = useLoader(GLTFLoader, CUSTOMIZATION.assets.flowerModel2);
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