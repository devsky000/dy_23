import type { ThreeElements } from "@react-three/fiber";
import { useFrame, useLoader } from "@react-three/fiber";
import { useMemo, useRef, useState } from "react";
import { Group, MathUtils } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { useInteraction } from "../hooks/useInteraction";

type CakeProps = ThreeElements["group"];

import { resolvePath } from "../utils/file";

export function Cake({ children, ...groupProps }: CakeProps) {
  const gltf = useLoader(GLTFLoader, resolvePath("/cake.glb"));
  const cakeScene = useMemo<Group | null>(() => gltf.scene?.clone(true) ?? null, [gltf.scene]);

  const innerRef = useRef<Group>(null);
  const [squashStartTime, setSquashStartTime] = useState<number | null>(null);

  const { hovered, bind } = useInteraction(() => {
    setSquashStartTime(Date.now());
  });

  useFrame(() => {
    if (!innerRef.current) return;

    // Hover Scale
    const targetScale = hovered ? 1.05 : 1;
    const currentScale = innerRef.current.scale;
    currentScale.x = MathUtils.lerp(currentScale.x, targetScale, 0.1);
    currentScale.y = MathUtils.lerp(currentScale.y, targetScale, 0.1);
    currentScale.z = MathUtils.lerp(currentScale.z, targetScale, 0.1);

    // Squash Animation
    if (squashStartTime !== null) {
      const duration = 300;
      const progress = (Date.now() - squashStartTime) / duration;
      if (progress >= 1) {
        setSquashStartTime(null);
        innerRef.current.scale.set(1, 1, 1);
      } else {
        // Squash: Y goes down, X/Z go up
        // sin(PI * progress) goes 0 -> 1 -> 0
        const amount = Math.sin(progress * Math.PI) * 0.2;
        innerRef.current.scale.y = targetScale - amount;
        innerRef.current.scale.x = targetScale + amount;
        innerRef.current.scale.z = targetScale + amount;
      }
    }
  });

  if (!cakeScene) {
    return null;
  }

  return (
    <group {...groupProps} {...bind}>
      <group ref={innerRef}>
        <primitive object={cakeScene} />
      </group>
      {children}
    </group>
  );
}

export function Cupcake({ children, ...groupProps }: CakeProps) {
  const gltf = useLoader(GLTFLoader, resolvePath("/cupcake.glb"));
  const cupcakeScene = useMemo<Group | null>(() => gltf.scene?.clone(true) ?? null, [gltf.scene]);

  const innerRef = useRef<Group>(null);
  const [jumpStartTime, setJumpStartTime] = useState<number | null>(null);

  const { hovered, bind } = useInteraction(() => {
    setJumpStartTime(Date.now());
  });

  useFrame((state) => {
    if (!innerRef.current) return;

    const time = state.clock.elapsedTime;

    // Hover Float: Bob up and down gently
    const hoverOffset = hovered ? Math.sin(time * 3) * 0.1 + 0.1 : 0; // floats up a bit and bobs

    // Jump Animation
    let jumpOffset = 0;
    if (jumpStartTime !== null) {
      const jumpDuration = 600;
      const progress = (Date.now() - jumpStartTime) / jumpDuration;

      if (progress >= 1) {
        setJumpStartTime(null);
      } else {
        // Parabolic jump
        jumpOffset = 4 * progress * (1 - progress) * 0.8; // Reduced height to 0.8
      }
    }

    // Combine offsets
    // Start Y is 0 relative to parent group, so we just set position.y
    // const targetY = hoverOffset + jumpOffset;

    // Smoothly interpolate position for the hover part (jump is direct)
    // Actually, let's just set it directly to avoid fighting animations, 
    // but maybe lerp the hover entry/exit for smoothness?
    // Let's do a simple direct set for responsiveness.
    // However, if we want smooth transition from non-hover to hover, we need lerp.

    // Current Y without jump
    const currentBaseY = innerRef.current.position.y - (jumpStartTime ? jumpOffset : 0);
    const smoothBaseY = MathUtils.lerp(currentBaseY, hoverOffset, 0.1);

    innerRef.current.position.y = smoothBaseY + jumpOffset;
  });

  if (!cupcakeScene) {
    return null;
  }

  return (
    <group {...groupProps} {...bind}>
      <group ref={innerRef}>
        <primitive object={cupcakeScene} />
      </group>
      {children}
    </group>
  );
}