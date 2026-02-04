import { useCursor } from '@react-three/drei';
import type { ThreeEvent } from '@react-three/fiber';
import { useState } from 'react';

export function useInteraction(onClick?: () => void) {
    const [hovered, setHover] = useState(false);

    useCursor(hovered);

    const bind = {
        onPointerOver: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHover(true);
        },
        onPointerOut: (e: ThreeEvent<PointerEvent>) => {
            e.stopPropagation();
            setHover(false);
        },
        onClick: (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onClick?.();
        }
    };

    return { hovered, bind };
}
