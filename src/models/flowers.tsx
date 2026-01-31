import type { ThreeElements } from "@react-three/fiber";
import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import type { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CUSTOMIZATION } from "../config";
import { useInteraction } from "../hooks/useInteraction";

type FlowersProps = ThreeElements["group"];

export function Flowers({ children, ...groupProps }: FlowersProps) {
    // Load the model defined in config
    const gltf = useLoader(GLTFLoader, CUSTOMIZATION.assets.flowerModel);
    const scene = useMemo<Group | null>(() => gltf.scene?.clone(true) ?? null, [gltf.scene]);

    const innerRef = useRef<Group>(null);
    const { hovered, bind } = useInteraction();

    useFrame((state) => {
        if (!innerRef.current) return;
        const time = state.clock.elapsedTime;

        // Sway Animation
        const swaySpeed = hovered ? 5 : 2;
        const swayAmp = hovered ? 0.1 : 0.02;

        innerRef.current.rotation.z = Math.sin(time * swaySpeed) * swayAmp;
        innerRef.current.rotation.x = Math.cos(time * swaySpeed * 0.7) * swayAmp * 0.5;
    });

    if (!scene) {
        return null;
    }

    return (
        <group {...groupProps} {...bind}>
            <group ref={innerRef}>
                <primitive object={scene} />
            </group>
            {children}
        </group>
    );
}

export function Flowers2({ children, ...groupProps }: FlowersProps) {
    // Load the model defined in config
    const gltf = useLoader(GLTFLoader, CUSTOMIZATION.assets.flowerModel2);
    const scene = useMemo<Group | null>(() => gltf.scene?.clone(true) ?? null, [gltf.scene]);

    const innerRef = useRef<Group>(null);
    const { hovered, bind } = useInteraction();

    useFrame((state) => {
        if (!innerRef.current) return;
        const time = state.clock.elapsedTime;

        // Sway Animation
        const swaySpeed = hovered ? 5 : 2;
        const swayAmp = hovered ? 0.1 : 0.02;

        innerRef.current.rotation.z = Math.sin(time * swaySpeed) * swayAmp;
        innerRef.current.rotation.x = Math.cos(time * swaySpeed * 0.7) * swayAmp * 0.5;
    });

    if (!scene) {
        return null;
    }

    return (
        <group {...groupProps} {...bind}>
            <group ref={innerRef}>
                <primitive object={scene} />
            </group>
            {children}
        </group>
    );
}