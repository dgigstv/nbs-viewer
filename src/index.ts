import {
	NoteBlockStudioHeader,
	NoteBlockStudioLayer,
	NoteBlockStudioTick,
} from './interfaces';
import * as fs from 'fs/promises';

/**
 * Reads a Note Block Studio file.
 * @param {string} fileName The NBS file to open.
 * @returns Header and iterator for noteblock details.
 */
export async function read (fileName: string) {
	const fd = await fs.open(fileName, 'r');

	try {
		return {
			header: await readHeader(fd),
			ticks: readBlocksGen(fd),
		};
	} catch (err) {
		await fd.close();
		throw err;
	}
}

/**
 * Reads a Note Block Studio file, greedily loading the contents of the noteblock
 * section into memory.
 * @param fileName The NBS file to open.
 * @returns Header and noteblock details.
 */
export async function readAll (fileName: string) {
	const fd = await fs.open(fileName, 'r');

	try {
		return {
			header: await readHeader(fd),
			ticks: await readBlocks(fd),
		};
	} finally {
		await fd.close();
	}
}

/**
 * Reads the header section of the NBS file.
 * @param fd File descriptor
 * @returns Header details from NBS file.
 */
async function readHeader (fd: fs.FileHandle): Promise<NoteBlockStudioHeader> {
	const { buffer: firstReadBlock } = await bufferedRead(fd, 8);
	const [zeroes] = new Int16Array(firstReadBlock, 0, 1);
	const [version, instrumentCount] = new Int8Array(firstReadBlock, 2, 2);
	const [songLength, layerCount] = new Int16Array(firstReadBlock, 4, 2);
	const songName = await readPascalString(fd) ?? 'Untitled';
	const songAuthor = await readPascalString(fd) ?? 'Unknown';
	const originalSongAuthor = await readPascalString(fd) ?? 'Unknown';
	const songDescription = await readPascalString(fd) ?? '';

	const { buffer: secondReadBlock } = await bufferedRead(fd, 5);
	const [songTempo] = new Int16Array(secondReadBlock, 0, 1);
	const [autoSave, autoSaveDuration, timeSignature] = new Int8Array(secondReadBlock, 2, 3);

	const { buffer: thirdReadBlock } = await bufferedRead(fd, 20);
	const [minutesSpent, leftClicks, rightClicks, noteBlocksAdded, noteBlocksRemoved] = new Int32Array(thirdReadBlock, 0, 5);
	const importFileName = await readPascalString(fd) ?? '';

	const { buffer: fourthReadBlock } = await bufferedRead(fd, 4);
	const [loop, maxLoopCount] = new Int8Array(fourthReadBlock, 0, 2);
	const [loopStartTick] = new Int16Array(fourthReadBlock, 2, 1);

	return {
		zeroes,
		version,
		instrumentCount,
		songLength,
		layerCount,
		songName,
		songAuthor,
		originalSongAuthor,
		songDescription,
		songTempo,
		autoSave,
		autoSaveDuration,
		timeSignature,
		minutesSpent,
		leftClicks,
		rightClicks,
		noteBlocksAdded,
		noteBlocksRemoved,
		importFileName,
		loop,
		maxLoopCount,
		loopStartTick,
	};
}

/**
 * Reads the block section of the NBS file.
 * @param fd File descriptor
 * @returns Tick, layer, and block information from NBS file.
 */
async function readBlocks (fd: fs.FileHandle): Promise<NoteBlockStudioTick[]> {
	const rows = [];
	let noteblocks = 0;
	let currentTick = -1;
	let jumpsUntilNextTick = 0;

	do {
		[jumpsUntilNextTick] = new Int16Array((await bufferedRead(fd, 2)).buffer);
		currentTick += jumpsUntilNextTick;

		if (jumpsUntilNextTick > 0) {
			const row: NoteBlockStudioTick = {
				layers: [] as NoteBlockStudioLayer[],
				tick: currentTick,
			};

			let currentLayer = -1;
			let jumpsUntilNextLayer = 0;

			do {
				[jumpsUntilNextLayer] = new Int16Array((await bufferedRead(fd, 2)).buffer);
				currentLayer += jumpsUntilNextLayer;

				if (jumpsUntilNextLayer > 0) {
					const block = await bufferedRead(fd, 6);
					const [instrument, key, velocity, panning] = new Int8Array(block, 0, 4);
					const [pitch] = new Int16Array(block, 4, 1);

					row.layers.push({
						instrument,
						key,
						velocity,
						panning,
						pitch,
						layer: currentLayer,
						noteblockId: noteblocks,
					});

					noteblocks += 1;
				}
			} while (jumpsUntilNextLayer > 0);

			if (row.layers.length > 0) {
				rows.push(row);
			}
		}
	} while (jumpsUntilNextTick > 0);

	return rows;
}

/**
 * Creates an async generator that reads NBS track information tick by tick.
 * @param fd File descriptor
 * @yields A single song tick
 */
async function *readBlocksGen (fd: fs.FileHandle): AsyncGenerator<NoteBlockStudioTick> {
	try {
		let noteblocks = 0;
		let currentTick = -1;
		let jumpsUntilNextTick = 0;

		do {
			[jumpsUntilNextTick] = new Int16Array((await bufferedRead(fd, 2)).buffer);
			currentTick += jumpsUntilNextTick;

			if (jumpsUntilNextTick > 0) {
				const row: NoteBlockStudioTick = {
					layers: [],
					tick: currentTick,
				};

				let currentLayer = -1;
				let jumpsUntilNextLayer = 0;

				do {
					[jumpsUntilNextLayer] = new Int16Array((await bufferedRead(fd, 2)).buffer);
					currentLayer += jumpsUntilNextLayer;

					if (jumpsUntilNextLayer > 0) {
						const { buffer: block } = await bufferedRead(fd, 6);
						const [instrument, key, velocity, panning] = new Int8Array(block, 0, 4);
						const [pitch] = new Int16Array(block, 4, 1);

						row.layers.push({
							instrument,
							key,
							velocity,
							panning,
							pitch,
							layer: currentLayer,
							noteblockId: noteblocks,
						});

						noteblocks += 1;
					}
				} while (jumpsUntilNextLayer > 0);

				if (row.layers.length > 0) {
					yield row;
				}
			}
		} while (jumpsUntilNextTick > 0);
	} finally {
		await fd.close();
	}
}

/**
 * Utility function to read a small amount from a file descriptor and
 * place it into a buffer
 * @param fd File descriptor
 * @param length Number of bytes to read
 * @returns Buffer of data read in Array form
 */
async function bufferedRead (fd: fs.FileHandle, length: number) {
	const buffer = Buffer.alloc(length);
	await fd.read(buffer, 0, length);

	return buffer;
}

/**
 * Reads a pascal string from the NBS file.
 * @param fd File descriptor
 * @returns Resulting string read from NBS file
 */
async function readPascalString (fd: fs.FileHandle) {
	const [pascalLength] = new Int32Array((await bufferedRead(fd, 4)).buffer);
	if (pascalLength > 0) {
		const pascalString = await bufferedRead(fd, pascalLength);

		return pascalString.toString('utf-8');
	}

	return undefined;
}
