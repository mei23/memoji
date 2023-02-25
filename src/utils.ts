


export type CodeInfo = {
	twemojiSeqs: string;
	minimumSeqs: string;
	char: string;
};

export function parseCodes(s: string): CodeInfo {
	const codes = splitCodes(s);
	return {
		twemojiSeqs: joinCodes(normalizeCodes(codes)),
		minimumSeqs: joinCodes(normalizeCodesX(codes)),
		char: toChar(codes),
	}
}

export function splitCodes(s: string): string[] {
	return s.split(/[-_ ]/);
}

export function normalizeCodes(codes: string[]): string[] {
	codes = codes.map(x => x.toLowerCase());
	codes = codes.map(x => x.replace(/^00/, ''));
	if (!codes.includes('200d')) {
		codes = codes.filter(x => x != 'fe0f');
	}
	return codes;
}

export function normalizeCodesX(codes: string[]): string[] {
	codes = codes.map(x => x.toLowerCase());
	codes = codes.map(x => x.replace(/^00/, ''));
	codes = codes.filter(x => x !== 'fe0f' && x !== '200d');
	return codes;
}

export function joinCodes(codes: string[]): string {
	return codes.join('-')
}

export function toChar(codes: string[]) {
	const codes16 = codes.map(x => parseInt(x, 16));
	const char = String.fromCodePoint(...codes16);
	return char;
}
