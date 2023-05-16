import InvalidIndexError from "../Errors/InvalidIndexError";

/**
 * Takes a number and makes sure it can be used as an index. A max value can also be
 * provided which is an upper bound for the index.
 * @param index a number which could be an index
 * @param max a maximum index value
 * @throws {InvalidIndexError} if the given index is out of bounds
 */
export function isValidArrayIndex(index: number, max: number = Infinity): void {
	if (!Number.isInteger(index)) throw new InvalidIndexError("index must be an integer");
	if (index < 0) throw new InvalidIndexError("index must be greater than 0");
	if (max != undefined && index > max)
		throw new InvalidIndexError(`index must be less than ${max}`);
}
