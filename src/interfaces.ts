/**
 * Header for Note Block Studio file. Based on https://opennbs.org/nbs.
 */
export interface NoteBlockStudioHeader {

	/**
	 * The first two bytes of the file. This should be 0. If it's
	 * not 0, then likely an older NBS format has been loaded.
	 */
	zeroes: number;

	/**
	 * The version of the NBS file loaded.
	 */
	version: number;

	/**
	 * Number of default instruments when the song was saved.
	 */
	instrumentCount: number;

	/**
	 * The length of the song measured in ticks.
	 */
	songLength: number;

	/**
	 * The last layer with at least one note block in it or the last layer that
	 * has its name, volume, or stereo changed.
	 */
	layerCount: number;

	/**
	 * The name of the song.
	 */
	songName: string;

	/**
	 * The author of the song.
	 */
	songAuthor: string;

	/**
	 * The original author of the song.
	 */
	originalSongAuthor: string;

	/**
	 * The description of the song.
	 */
	songDescription: string;

	/**
	 * The tempo of the song multiplied by 100. Measured in ticks/second.
	 */
	songTempo: number;

	/**
	 * Whether auto-saving has been enabled. 0 for disabled. 1 for enabled.
	 * Generally unused by recent versions of Open Note Block Studio.
	 */
	autoSave: number;

	/**
	 * The amount of minutes between each auto-save.
	 * Generally unused by recent versions of Open Note Block Studio.
	 */
	autoSaveDuration: number;

	/**
	 * The time signature of the song. Valid values are 2 to 8 (inclusive).
	 */
	timeSignature: number;

	/**
	 * The amount of minutes spent on the project.
	 */
	minutesSpent: number;

	/**
	 * The amount of times the user has left-clicked.
	 */
	leftClicks: number;

	/**
	 * The amount of times the user has right-clicked.
	 */
	rightClicks: number;

	/**
	 * The amount of times the user has added a note block to the song.
	 */
	noteBlocksAdded: number;

	/**
	 * The amount of times the user has removed a note block from the song.
	 */
	noteBlocksRemoved: number;

	/**
	 * The name of the original .mid or .schematic file that this song was
	 * imported from (if applicable).
	 */
	importFileName: string;

	/**
	 * Whether looping is on or off. 0 is off, 1 is on.
	 */
	loop: number;

	/**
	 * The number of times to loop the song. 0 means infinite.
	 */
	maxLoopCount: number;

	/**
	 * The position in the song (in ticks) to go back to when looping.
	 */
	loopStartTick: number;
}

/**
 * Note Block Studio instrument layer
 */
export interface NoteBlockStudioLayer {

	/**
	 * The instrument of the note block.
	 */
	instrument: number;

	/**
	 * The key of the note block.
	 */
	key: number;

	/**
	 * The volume of the note block.
	 */
	velocity: number;

	/**
	 * The stereo position of the note block.
	 */
	panning: number;

	/**
	 * The fine pitch of the note block.
	 */
	pitch: number;

	/**
	 * The layer/track that the note block is played from.
	 */
	layer: number;

	/**
	 * Position of the note block in the song, counting from left to right,
	 * top to bottom.
	 */
	noteblockId: number;
}

/**
 * Note Block Studio track tick
 */
export interface NoteBlockStudioTick {

	/**
	 * The position of the song tick.
	 */
	tick: number;

	/**
	 * The layers within the song tick.
	 */
	layers: NoteBlockStudioLayer[];
}
