import { copyFileSync, readdirSync } from "fs";
import { resolve } from "path";

export default 1;

// Twemojiで足りないのをGoogle Noto Emojiから持ってくるスクリプト

// ../noto-emoji に https://github.com/googlefonts/noto-emoji のリポジトリをチェックアウトしといて
// 持ってくるのはwantsに指定して
// npx ts-node --transpileOnly src/pick-noto.ts

const notoBase = resolve(__dirname, '../../noto-emoji/svg/');

const twemojiBase = resolve(__dirname, '../dist/svg/');

const wants: string[] = [
	'1FAE8',
	'1FA77',
	'1FA75',
	'1FA76',

	// SkinTone+5が必要なのはとりあえずこんな感じにして
	'1FAF7',
	'1FAF7 1f3fb',
	'1FAF7 1f3fc',
	'1FAF7 1f3fd',
	'1FAF7 1f3fe',
	'1FAF7 1f3ff',

	'1FAF8',
	'1FAF8 1f3fb',
	'1FAF8 1f3fc',
	'1FAF8 1f3fd',
	'1FAF8 1f3fe',
	'1FAF8 1f3ff',

	'1FACE',
	'1FACF',
	'1FABD',
	'1F426 200D 2B1B',
	'1FABF',
	'1FABC',
	'1FABB',
	'1FADA',
	'1FADB',
	'1FAAD',
	'1FAAE',
	'1FA87',
	'1FA88',
	'1FAAF',
	'1F6DC',
];

const wants2 = wants.map(x => normalize(x.split(/[-_ ]/)));
const wants3 = wants2.map(x => x.join('-'));

async function main() {
	// index noto
	//console.log(notoBase);
	const notoFiles = readdirSync(notoBase).filter(x => x.endsWith('.svg'));	// ['emoji_u002a_20e3.svg', ...]
	//console.log(notoFiles);

	for (const w of wants3) {
		console.log('find', w);
		for (const notoFile of notoFiles) {
			const m = notoFile.match(/^emoji_u([0-9a-z_]+)\.svg$/);
			if (!m) throw `unmatch ${notoFile}`;

			let codes = m[1].split(/_/);	// ['002a', '20e3', ... ]
			codes = normalize(codes);
			const twemojiCode = codes.join('-');

			if (w === twemojiCode) {
				const src = resolve(notoBase, notoFile);
				const dst = resolve(twemojiBase, `${twemojiCode}.svg`)
				console.log(`${src} => ${dst}`);
				copyFileSync(src, dst);
			}
		}
	}
}

function normalize(codes: string[]): string[] {
	codes = codes.map(x => x.toLowerCase());
	if (!codes.includes('200d')) {
		codes = codes.filter(x => x != 'fe0f');
	}
	return codes;
}

main().then(() => {
	console.log('=== Done ===');
})
