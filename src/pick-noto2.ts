import { copyFileSync, readdirSync, readFileSync } from "fs";
import { resolve } from "path";
import { CodeInfo, joinCodes, normalizeCodes, normalizeCodesX, parseCodes, splitCodes, toChar } from "./utils";

export default 1;

// Twemojiで足りないのをGoogle Noto Emojiから持ってくるスクリプト

// ../noto-emoji に https://github.com/googlefonts/noto-emoji のリポジトリをチェックアウトしといて
// 持ってくるのはwantsに指定して
// npx ts-node --transpileOnly src/pick-noto.ts

const notoBase = resolve(__dirname, '../../noto-emoji/svg/');
const notoBaseF = resolve(__dirname, '../..//noto-emoji/third_party/region-flags/svg/');

const twemojiBase = resolve(__dirname, '../dist/svg/');

const wants = readFileSync(resolve(__dirname, '../required_15.0.txt'), 'utf-8').split(/\n/).filter(x => x.length);
const wants2 = wants.map(x => parseCodes(x));

type SrcInfo = {
	path: string;
	codeInfo: CodeInfo;
};

async function main() {
	// index noto
	const notoFiles = readdirSync(notoBase).filter(x => x.endsWith('.svg'));	// ['emoji_u002a_20e3.svg', ...]
	const notos: SrcInfo[] = [];

	for (const notoFile of notoFiles) {
		const m = notoFile.match(/^emoji_u([0-9a-z_]+)\.svg$/);
		if (!m) throw `unmatch ${notoFile}`;

		const codeInfo = parseCodes(m[1]);
		const srcInfo = {
			path: notoFile,
			codeInfo,
		};
		notos.push(srcInfo);
		console.log(srcInfo);
	}

	const notoFilesF = readdirSync(notoBaseF).filter(x => x.endsWith('.svg'));	// ['emoji_u002a_20e3.svg', ...]
	const notosF: SrcInfo[] = [];

	/* need convert plain to ...
	for (const notoFileF of notoFilesF) {
		const m = notoFileF.match(/^emoji_u([0-9a-z_]+)\.svg$/);
		if (!m) throw `unmatch ${notoFileF}`;

		const codeInfo = parseCodes(m[1]);
		const srcInfo = {
			path: notoFileF,
			codeInfo,
		};
		notosF.push(srcInfo);
		console.log(srcInfo);
	}
	*/

	for (const w of wants2) {
		let hit = false;

		for (const noto of notos) {
			if (w.minimumSeqs === noto.codeInfo.minimumSeqs) {
				//const src = resolve(notoBase, notoFile);
				//const dst = resolve(twemojiBase, `${twemojiCode}.svg`)
				//console.log(`${src} => ${dst}`);
				hit = true;
				break;
				//copyFileSync(src, dst);
			}
		}

		for (const noto of notosF) {
			if (w.minimumSeqs === noto.codeInfo.minimumSeqs) {
				//const src = resolve(notoBase, notoFile);
				//const dst = resolve(twemojiBase, `${twemojiCode}.svg`)
				//console.log(`${src} => ${dst}`);
				hit = true;
				break;
				//copyFileSync(src, dst);
			}
		}

		console.log(`${w.char} ${w.twemojiSeqs} ${w.minimumSeqs}`, hit);
	}
}

main().then(() => {
	console.log('=== Done ===');
})

