import type { ThreeElements } from "@react-three/fiber";
import { useFrame, useLoader } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import type { Group } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { resolvePath } from "../utils/file";

type ConfettiProps = ThreeElements["group"] & {
    isActive?: boolean;
    origin?: [number, number, number];
    intensity?: number;
};

type Particle = {
    position: [number, number, number];
    velocity: [number, number, number];
    rotation: [number, number, number];
    rotationSpeed: [number, number, number];
    lifespan: number;
    maxLifespan: number;
};

const PARTICLE_COUNT = 100;
const GRAVITY = -5.5;
const INITIAL_VELOCITY_RANGE = 4;
const SPREAD_RANGE = 50;

export function Confetti({
    isActive = false,
    origin = [0, 3, 0],
    intensity = 0.8,
    ...groupProps
}: ConfettiProps) {
    const gltf = useLoader(GLTFLoader, resolvePath("/confetti.glb"));
    const groupRef = useRef<Group>(null);
    const particlesRef = useRef<Particle[]>([]);
    const isActiveRef = useRef(false);

    // Initialize particles
    const particleCount = Math.floor(PARTICLE_COUNT * intensity);

    useEffect(() => {
        // Initialize particle data
        particlesRef.current = Array.from({ length: particleCount }, () => ({
            position: [origin[0], origin[1], origin[2]],
            velocity: [
                (Math.random() - 0.5) * INITIAL_VELOCITY_RANGE,
                Math.random() * INITIAL_VELOCITY_RANGE + 2,
                (Math.random() - 0.5) * INITIAL_VELOCITY_RANGE,
            ],
            rotation: [
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
                Math.random() * Math.PI * 2,
            ],
            rotationSpeed: [
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
                (Math.random() - 0.5) * 10,
            ],
            lifespan: 0,
            maxLifespan: 3 + Math.random() * 1.5,
        })) as Particle[];
    }, [particleCount, origin]);

    // Reset particles when activated
    useEffect(() => {
        if (isActive && !isActiveRef.current) {
            isActiveRef.current = true;
            particlesRef.current = particlesRef.current.map(() => ({
                position: [
                    origin[0] + (Math.random() - 0.5) * SPREAD_RANGE,
                    origin[1] + (Math.random() - 0.5) * SPREAD_RANGE,
                    origin[2] + (Math.random() - 0.5) * SPREAD_RANGE,
                ],
                velocity: [
                    (Math.random() - 0.5) * INITIAL_VELOCITY_RANGE,
                    Math.random() * INITIAL_VELOCITY_RANGE + 2,
                    (Math.random() - 0.5) * INITIAL_VELOCITY_RANGE,
                ],
                rotation: [
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                    Math.random() * Math.PI * 2,
                ],
                rotationSpeed: [
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10,
                ],
                lifespan: 0,
                maxLifespan: 3 + Math.random() * 1.5,
            })) as Particle[];
        } else if (!isActive) {
            isActiveRef.current = false;
        }
    }, [isActive, origin]);

    // Render particle instances
    const particleInstances = useMemo(() => {
        if (!gltf.scene) return [];

        return Array.from({ length: particleCount }, (_, i) => {
            const scene = gltf.scene.clone(true);
            scene.scale.set(0.35, 0.35, 0.35);
            return { key: i, scene };
        });
    }, [gltf.scene, particleCount]);

    useFrame((_, delta) => {
        if (!groupRef.current || !isActiveRef.current) return;

        const children = groupRef.current.children;

        particlesRef.current.forEach((particle, index) => {
            if (index >= children.length) return;

            const mesh = children[index];

            // Update lifespan
            particle.lifespan += delta;

            if (particle.lifespan < particle.maxLifespan) {
                // Update velocity with gravity
                particle.velocity[1] += GRAVITY * delta;

                // Update position
                particle.position[0] += particle.velocity[0] * delta;
                particle.position[1] += particle.velocity[1] * delta;
                particle.position[2] += particle.velocity[2] * delta;

                // Update rotation
                particle.rotation[0] += particle.rotationSpeed[0] * delta;
                particle.rotation[1] += particle.rotationSpeed[1] * delta;
                particle.rotation[2] += particle.rotationSpeed[2] * delta;

                // Apply to mesh
                mesh.position.set(...particle.position);
                mesh.rotation.set(...particle.rotation);

                // Fade out effect
                const fadeProgress = particle.lifespan / particle.maxLifespan;
                const opacity = Math.max(0, 1 - fadeProgress);
                mesh.visible = opacity > 0.01;

                // Apply opacity to all materials
                mesh.traverse((child: any) => {
                    if (child.isMesh && child.material) {
                        if (Array.isArray(child.material)) {
                            child.material.forEach((mat: any) => {
                                mat.transparent = true;
                                mat.opacity = opacity;
                            });
                        } else {
                            child.material.transparent = true;
                            child.material.opacity = opacity;
                        }
                    }
                });
            } else {
                mesh.visible = false;
            }
        });
    });

    return (
        <group ref={groupRef} {...groupProps}>
            {particleInstances.map(({ key, scene }) => (
                <primitive key={key} object={scene} />
            ))}
        </group>
    );
}
