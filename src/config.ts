import { resolvePath } from "./utils/file";

export const CUSTOMIZATION = {
    // The name that appears in the intro
    name: "Dyah",

    // The text shown in the typing intro
    introMessages: [
        "> dyah",
        "...",
        "> today is your birthday",
        "...",
        "> so i made you this computer program",
        "...",
        "٩(◕‿◕)۶ ٩(◕‿◕)۶ ٩(◕‿◕)۶",
    ],

    // Audio settings
    audio: {
        loop: true,
        file: resolvePath("/music.mp3"), // Ensure this exists in public/ folder
    },

    // 3D Scene Assets
    assets: {
        cakeModel: resolvePath("/cake.glb"),
        candleModel: resolvePath("/candle.glb"),
        flowerModel: resolvePath("/flowers.glb"), // Added flower model
        flowerModel2: resolvePath("/flowers2.glb"), // Added flower model
        teddyModel: resolvePath("/teddy.glb"), // Added teddy model
        hdrBackground: resolvePath("/shanghai_bund_4k.hdr"),
    },

    // Picture Frames (Add your photos to public/ folder)
    pictureFrames: [
        { image: resolvePath("/frame2.jpg"), position: [0, 0.735, 3], rotation: [0, 5.6, 0] },
        { image: resolvePath("/frame3.jpg"), position: [0, 0.735, -3], rotation: [0, 4.0, 0] },
        { image: resolvePath("/frame4.jpg"), position: [-1.5, 0.735, 2.5], rotation: [0, 5.4, 0] },
        { image: resolvePath("/frame1.jpg"), position: [-1.5, 0.735, -2.5], rotation: [0, 4.2, 0] },
    ],

    // Birthday Cards (Clickable cards on table)
    cards: [
        {
            id: "confetti",
            image: resolvePath("/card.png"),
            position: [1, 0.081, -2],
            rotation: [-Math.PI / 2, 0, Math.PI / 3],
        },
    ],
};
