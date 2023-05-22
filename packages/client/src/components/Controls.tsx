import { Sprite, Container } from "@pixi/react";
import arrow from "../arrow.jpg";
import { useMUD } from "../MUDContext";
import { Direction } from "../mud/createSystemCalls";

const SCALE = { x: 0.25, y: 0.25 };
const ANCHOR = 0;
export const Controls = () => {
    const {
        systemCalls: { move },
    } = useMUD();
    return (
        <>
            {/* UP */}
            <Sprite
                interactive
                pointerdown={() => move(Direction.Up)}
                image={arrow}
                scale={SCALE}
                anchor={ANCHOR}
                x={75}
                y={0}
            />

            {/* RIGHT */}
            <Sprite
                interactive
                pointerdown={() => move(Direction.Right)}
                image={arrow}
                scale={SCALE}
                anchor={ANCHOR}
                rotation={(Math.PI / 180) * 90}
                x={225}
                y={75}
            />

            {/* LEFT */}
            <Sprite
                interactive
                pointerdown={() => move(Direction.Left)}
                image={arrow}
                scale={SCALE}
                anchor={ANCHOR}
                rotation={(Math.PI / 180) * -90}
                x={0}
                y={150}
            />

            {/* DOWN */}
            <Sprite
                interactive
                pointerdown={() => move(Direction.Down)}
                image={arrow}
                scale={SCALE}
                anchor={ANCHOR}
                rotation={(Math.PI / 180) * 180}
                x={150}
                y={150}
            />
        </>
    );
};
