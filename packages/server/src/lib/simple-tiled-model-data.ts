interface WFCTile {
    name: string;
    symmetry: string;
    weight?: number;
    bitmap?: any[];
}

interface TileNeighbor {
    left: string;
    right: string;
}

interface TileData {
    tilesize: number;
    tiles: WFCTile[];
    neighbors: TileNeighbor[];
}

export const tileData: TileData = {
    tilesize: 3,
    tiles: [
        { name:"bend", symmetry:"L", weight:0.5 },
        { name:"corner", symmetry:"L", weight:0.5 },
        { name:"corridor", symmetry:"I", weight:1.0 },
        { name:"door", symmetry:"T", weight:0.5 },
        { name:"empty", symmetry:"X" },
        { name:"side", symmetry:"T", weight:2.0 },
        { name:"t", symmetry:"T", weight:0.5 },
        { name:"turn", symmetry:"L", weight:0.25 },
        { name:"wall", symmetry:"X" }
    ],
    neighbors: [
        { left:"corner 1", right:"corner" },
        { left:"corner 2", right:"corner" },
        { left:"corner", right:"door" },
        { left:"corner", right:"side 2" },
        { left:"corner 1", right:"side 1" },
        { left:"corner 1", right:"t 1" },
        { left:"corner 1", right:"turn" },
        { left:"corner 2", right:"turn" },
        { left:"wall", right:"corner" },
        { left:"corridor 1", right:"corridor 1" },
        { left:"corridor 1", right:"door 3" },
        { left:"corridor", right:"side 1" },
        { left:"corridor 1", right:"t" },
        { left:"corridor 1", right:"t 3" },
        { left:"corridor 1", right:"turn 1" },
        { left:"corridor", right:"wall" },
        { left:"door 1", right:"door 3" },
        { left:"door 3", right:"empty" },
        { left:"door", right:"side 2" },
        { left:"door 1", right:"t" },
        { left:"door 1", right:"t 3" },
        { left:"door 1", right:"turn 1" },
        { left:"empty", right:"empty" },
        { left:"empty", right:"side 3" },
        { left:"side", right:"side" },
        { left:"side 3", right:"side 1" },
        { left:"side 3", right:"t 1" },
        { left:"side 3", right:"turn" },
        { left:"side 3", right:"wall" },
        { left:"t", right:"t 2" },
        { left:"t", right:"turn 1" },
        { left:"t 3", right:"wall" },
        { left:"turn", right:"turn 2" },
        { left:"turn 1", right:"wall" },
        { left:"wall", right:"wall" },
        { left:"bend", right:"bend 1" },
        { left:"corner", right:"bend 2" },
        { left:"door", right:"bend 2" },
        { left:"empty", right:"bend" },
        { left:"side", right:"bend 1" }
    ]
};
