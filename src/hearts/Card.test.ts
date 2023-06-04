import { expect } from "chai";
import { restore, replace, fake } from "sinon";
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

		it("should set and get passed", function () {
			const card = new Card("Ten", "Hearts");
			let passed = card.passed();

			expect(passed).to.be.false;

			card.pass();

			passed = card.passed();

			expect(passed).to.be.true;
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

	describe("shuffleCards", function () {
		// The only way I could think to test this was by working out how I expect the
		// shuffling algorithm to work, and then making sure it works that way. It's
		// not ideal perhaps because the tests are a little funny to read and because
		// it shouldn't matter precisely how the card are shuffled so long as they
		// are shuffled. I will fix this if I can think of a more sensible way of testing
		// this.

		// I am currently shuffling everything in place. I iterate through the list of
		// cards, swapping each card with a card later in the list which I select with
		// a random number from i to the length of the list. By replacing Math.random()
		// with a fake, I can work out how I expect the cards to have been scrambled.

		const unshuffled = [
			new Card("Four", "Clubs"),
			new Card("Ace", "Diamonds"),
			new Card("Eight", "Spades"),
			new Card("Two", "Hearts"),
		];

		afterEach(function () {
			restore(); // sinon
		});

		it("should shuffle, always taking the first card", function () {
			// should take the card from the front each time
			replace(Math, "random", fake.returns(0));
			let shuffled = Card.shuffleCards([...unshuffled]);
			checkCards([...unshuffled], shuffled);
		});

		it("should shuffle, always taking the last card", function () {
			// should take the card from the middle each time
			const expectedCards = [
				new Card("Two", "Hearts"),
				new Card("Four", "Clubs"),
				new Card("Ace", "Diamonds"),
				new Card("Eight", "Spades"),
			];

			// should take the card from the end each time
			replace(Math, "random", fake.returns(0.99));
			const shuffled = Card.shuffleCards([...unshuffled]);
			checkCards(expectedCards, shuffled);
		});

		it("should shuffle, always taking the middle card", function () {
			// should take the card from the middle each time
			const expectedCards = [
				new Card("Ace", "Diamonds"),
				new Card("Eight", "Spades"),
				new Card("Four", "Clubs"),
				new Card("Two", "Hearts"),
			];

			replace(Math, "random", fake.returns(0.49));
			const shuffled = Card.shuffleCards([...unshuffled]);
			checkCards(expectedCards, shuffled);
		});
	});
});

function checkCards(expectedCards: Card[], actualCards: Card[]) {
	for (let i = 0; i < expectedCards.length; i++) {
		const expected = expectedCards[i];
		const actual = actualCards[i];

		expect(expected.equals(actual)).to.be.true;
	}
}
