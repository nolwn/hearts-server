import { expect } from "chai";
import Card from "./Card";

describe("Card", function () {
	describe("getters", function () {
		it("should create a card with a suite and a value", function () {
			const expectedValue = "Two";
			const expectedSuit = "Hearts";
			const card = new Card(expectedValue, expectedSuit);

			const suit = card.suit();
			expect(suit).to.equal(expectedSuit);

			const value = card.value();
			expect(value).to.equal(expectedValue);
		});
	});

	describe("equals", function () {
		it("should return false when the cards are different", function () {
			const matchingSuit = "Spades";
			const matchingValue = "King";

			const differentOne = new Card("Four", "Diamonds");
			const differentTwo = new Card("Eight", "Clubs");
			expect(differentOne.equals(differentTwo)).to.be.false;

			const sameSuitOne = new Card("Nine", matchingSuit);
			const sameSuitTwo = new Card("Ace", matchingSuit);
			expect(sameSuitOne.equals(sameSuitTwo)).to.be.false;

			const sameValueOne = new Card(matchingValue, "Diamonds");
			const sameValueTwo = new Card(matchingValue, "Hearts");
			expect(sameValueOne.equals(sameValueTwo)).to.be.false;
		});

		it("should return true when the cards are the same", function () {
			const suit = "Hearts";
			const value = "Seven";

			const cardOne = new Card(value, suit);
			const cardTwo = new Card(value, suit);
			expect(cardOne.equals(cardTwo)).to.be.true;
		});
	});

	describe("greaterThan", function () {
		it("should return false when the comparison card is greater than this card", function () {
			const card = new Card("Seven", "Spades");
			const comparison = new Card("Nine", "Diamonds");

			expect(card.greaterThan(comparison)).to.be.false;
		});

		it("should return true when the comparison card is null", function () {
			const card = new Card("Ace", "Clubs");

			expect(card.greaterThan(null)).to.be.true;
		});

		it("should return false when the comparison card is equal to this card", function () {
			const card = new Card("Seven", "Spades");
			const comparison = new Card("Seven", "Hearts");

			expect(card.greaterThan(comparison)).to.be.false;
		});

		it("should return true when the comparison card is less than this card", function () {
			const card = new Card("Seven", "Spades");
			const comparison = new Card("Six", "Clubs");

			expect(card.greaterThan(comparison)).to.been.true;
		});

		it("should consider Ace a high card", function () {
			const card = new Card("Ace", "Spades");
			const comparison = new Card("King", "Diamonds");

			expect(card.greaterThan(comparison)).to.been.true;
		});
	});
});
