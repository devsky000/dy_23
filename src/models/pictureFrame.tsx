import { useTexture } from "@react-three/drei";
import { useLoader, useThree, type ThreeElements } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import {
  Box3,
  DoubleSide,
  MeshStandardMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type PictureFrameProps = ThreeElements["group"] & {
  image: string;
  imageScale?: number | [number, number];
  imageOffset?: [number, number, number];
  onImageClick?: (imageSrc: string) => void;
};

const DEFAULT_IMAGE_SCALE: [number, number] = [0.82, 0.82];

import { resolvePath } from "../utils/file";

// ... imports
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { Group, MathUtils } from "three";
import { useInteraction } from "../hooks/useInteraction";

export function PictureFrame({
  image,
  imageScale = DEFAULT_IMAGE_SCALE,
  imageOffset,
  onImageClick,
  children,
  ...groupProps
}: PictureFrameProps) {
  const { gl } = useThree();
  const gltf = useLoader(GLTFLoader, resolvePath("/picture_frame.glb"));
  const pictureTexture = useTexture(image);

  pictureTexture.colorSpace = SRGBColorSpace;
  const maxAnisotropy =
    typeof gl.capabilities.getMaxAnisotropy === "function"
      ? gl.capabilities.getMaxAnisotropy()
      : 1;
  pictureTexture.anisotropy = maxAnisotropy;

  const frameScene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  const { frameSize, frameCenter } = useMemo(() => {
    const box = new Box3().setFromObject(frameScene);
    const size = new Vector3();
    const center = new Vector3();
    box.getSize(size);
    box.getCenter(center);
    return { frameSize: size, frameCenter: center };
  }, [frameScene]);

  const scaledImage = useMemo<[number, number]>(() => {
    if (Array.isArray(imageScale)) {
      return imageScale;
    }
    return [imageScale, imageScale];
  }, [imageScale]);

  const [imageScaleX, imageScaleY] = scaledImage;

  const imageWidth = frameSize.x * imageScaleX;
  const imageHeight = frameSize.y * imageScaleY;

  const [offsetX, offsetY, offsetZ] = imageOffset ?? [
    0,
    0.05,
    -0.27,
  ];

  const imagePosition: [number, number, number] = [
    frameCenter.x + offsetX,
    frameCenter.y + offsetY,
    frameCenter.z + offsetZ,
  ];

  const pictureMaterial = useMemo(
    () =>
      new MeshStandardMaterial({
        map: pictureTexture,
        roughness: 0.08,
        metalness: 0,
        side: DoubleSide,
      }),
    [pictureTexture]
  );

  useEffect(() => {
    return () => {
      pictureMaterial.dispose();
    };
  }, [pictureMaterial]);

  const innerRef = useRef<Group>(null);
  const [wiggleStartTime, setWiggleStartTime] = useState<number | null>(null);

  const { hovered, bind } = useInteraction(() => {
    setWiggleStartTime(Date.now());
    onImageClick?.(image);
  });

  useFrame(() => {
    if (!innerRef.current) return;

    // Hover Tilt (X axis) - looks up at user slightly
    const targetRotX = hovered ? -0.2 : 0;
    innerRef.current.rotation.x = MathUtils.lerp(innerRef.current.rotation.x, targetRotX, 0.1);

    // Click Wiggle (Z axis twist)
    if (wiggleStartTime !== null) {
      const duration = 400;
      const progress = (Date.now() - wiggleStartTime) / duration;

      if (progress >= 1) {
        setWiggleStartTime(null);
        innerRef.current.rotation.z = 0;
      } else {
        // Wiggle back and forth
        innerRef.current.rotation.z = Math.sin(progress * Math.PI * 4) * 0.1;
      }
    }
  });

  return (
    <group {...groupProps} {...bind}>
      <group ref={innerRef}>
        <group rotation={[0.04, 0, 0]}>
          <primitive object={frameScene} />
          <mesh
            position={imagePosition}
            rotation={[0.435, Math.PI, 0]}
            material={pictureMaterial}
          >
            <planeGeometry args={[imageWidth, imageHeight]} />
          </mesh>
          {children}
        </group>
      </group>
    </group>
  );
}
