import { expect } from "chai";
import { isValidArrayIndex } from "./util";

describe("util.ts", function () {
	describe("validArrayIndex", function () {
		it("it should throw if index is not an integer", function () {
			expect(isValidArrayIndex.bind(null, 0.5)).to.throw();
		});

		it("it should throw if the index is less than 0", function () {
			expect(isValidArrayIndex.bind(null, -10)).to.throw();
		});

		it("it should throw if the index is greater than a provided max", function () {
			expect(isValidArrayIndex.bind(null, 11, 2)).to.throw();
		});

		it("should throw if the index is NaN", function () {
			expect(isValidArrayIndex.bind(null, NaN)).to.throw();
		});

		it("should throw if the index is Infinity", function () {
			expect(isValidArrayIndex.bind(null, Infinity)).to.throw();
		});

		it("it should not throw if the index is a positive integer, and no max is provided", function () {
			expect(isValidArrayIndex.bind(null, 1)).to.not.throw();
			expect(isValidArrayIndex.bind(null, 100)).to.not.throw();
			expect(isValidArrayIndex.bind(null, 1_000_000)).to.not.throw();
		});
	});
});
