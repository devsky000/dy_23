import type { ThreeElements } from "@react-three/fiber";
import * as fiber from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import type { Group } from "three";
import { MathUtils } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { CUSTOMIZATION } from "../config";
import { useInteraction } from "../hooks/useInteraction";

type TeddyProps = ThreeElements["group"];

export function Teddy({ children, ...groupProps }: TeddyProps) {
    // Load the model defined in config
    const gltf = useLoader(GLTFLoader, CUSTOMIZATION.assets.teddyModel);
    const scene = useMemo<Group | null>(() => gltf.scene?.clone(true) ?? null, [gltf.scene]);

    const innerRef = useRef<Group>(null);
    const [jumpStartTime, setJumpStartTime] = useState<number | null>(null);

    const { hovered, bind } = useInteraction(() => {
        setJumpStartTime(Date.now());
    });

    fiber.useFrame((state) => {
        if (!innerRef.current) return;

        const time = state.clock.elapsedTime;

        // Hover Animation: Gentle Wiggle
        const targetRotationY = hovered ? Math.sin(time * 4) * 0.15 : 0;
        innerRef.current.rotation.y = MathUtils.lerp(
            innerRef.current.rotation.y,
            targetRotationY,
            0.1
        );

        // Jump Animation
        if (jumpStartTime !== null) {
            const jumpDuration = 500; // ms
            const progress = (Date.now() - jumpStartTime) / jumpDuration;

            if (progress >= 1) {
                setJumpStartTime(null);
                innerRef.current.position.y = 0;
            } else {
                // Parabolic jump: 4 * x * (1 - x) maps 0..1 to 0..1..0
                const jumpHeight = 0.5;
                innerRef.current.position.y = 4 * progress * (1 - progress) * jumpHeight;
            }
        }
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
