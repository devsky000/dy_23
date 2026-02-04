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
        onPointerOut: () => {
            // e.stopPropagation(); // Usually safe to not propagate out, but let's see. 
            // If we stop propagation on out, it might prevent parent handlers? 
            // Actually standard behavior is usually just handle self.
            setHover(false);
        },
        onClick: (e: ThreeEvent<MouseEvent>) => {
            e.stopPropagation();
            onClick?.();
        }
    };

    return { hovered, bind };
}
