import HeartsError from "./HeartsError";

/**
 * InvalidIndexError is thrown when a number that was intended is an array index is
 * invalid
 */
export default class InvalidIndexError extends HeartsError {
	static readonly preamble: string = "invalid index";

	constructor(message: string) {
		super(InvalidIndexError.preamble, message);
	}
}
