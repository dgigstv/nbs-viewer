import * as nbs from './index';

describe('nbs-viewer', () => {
	test('should create', async () => {
		expect.assertions(1);

		const nbsData = await nbs.read('./res/BasicTestSong.nbs');

		expect(nbsData).toBeTruthy();
	});

	test('should read header correctly', async () => {
		expect.assertions(1);

		const nbsData = await nbs.read('./res/BasicTestSong.nbs');

		// Test for significant header members.
		expect(nbsData.header).toMatchObject({
			originalSongAuthor: 'DGigsTV',
			songDescription: 'This is a test song! https://github.com/dgigstv',
			songLength: 11,
			songAuthor: 'DGigsTV',
			songName: 'Test Song',
			songTempo: 500,
			version: 5,
			zeroes: 0,
		});
	});
});
