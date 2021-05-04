export interface NoteBlockStudioHeader {
    zeroes: number;
    version: number;
    instrumentCount: number;
    songLength: number;
    layerCount: number;
    songName: string;
    songAuthor: string;
    originalSongAuthor: string;
    songDescription: string;
    songTempo: number;
    autoSave: number;
    autoSaveDuration: number;
    timeSignature: number;
    minutesSpent: number;
    leftClicks: number;
    rightClicks: number;
    noteBlocksAdded: number;
    noteBlocksRemoved: number;
    importFileName: string;
    loop: number;
    maxLoopCount: number;
    loopStartTick: number;
}

export interface NoteBlockStudioLayer {
    instrument: number;
    key: number;
    velocity: number;
    panning: number;
    pitch: number;
    layer: number;
    noteblockId: number;
}

export interface NoteBlockStudioTick {
    tick: number;
    layers: NoteBlockStudioLayer[];
}
