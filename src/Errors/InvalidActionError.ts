import HeartsError from "./HeartsError";

/**
 * InvalidActionError is thrown when a game action that was attempted is not valid.
 */
export default class InvalidActionError extends HeartsError {
	static readonly preamble: string = "invalid action";

	constructor(message: string) {
		super(InvalidActionError.preamble, message);
	}
}
