/**
 * HeartsError is thrown whenever something in hearts has gone wrong. It is not intended
 * to be thrown directly, it should be extended. Classes that extend it should set their
 * own preamble property to make it easier to figure out what kind of Error was thrown.
 */
export default class HeartsError extends Error {
	static readonly preamble: string;

	constructor(preamble: string, message: string) {
		super(`${preamble}: ${message}`);
	}
}
