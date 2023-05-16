import { expect } from "chai";
import Card from "./Card";
import Player from "./Player";

describe("Player", function () {
	const initialCards = [
		new Card("Ace", "Spades"),
		new Card("King", "Diamonds"),
		new Card("Nine", "Hearts"),
	];

	describe("constructor, getters, setters", function () {
		it("should create a hand of cards", function () {
			const hand = new Player([...initialCards]);
			const cards = hand.cards();

			expect(cards).to.have.deep.members(initialCards);
		});

		it("played should return the played card", function () {
			const hand = new Player([...initialCards]);
			const cards = hand.cards();
			let played = hand.played();

			expect(played, "if no card has been played, it should return null").to.be.null;

			played = hand.play(1).played();

			expect(played, "if one has been played, it should be returned").to.deep.equal(
				cards[1]
			);
		});

		it("count should return the number of cards not played", function () {
			const hand = new Player([...initialCards]);

			// no cards are played yet
			expect(hand.count()).to.equal(initialCards.length);

			// now one is played
			expect(hand.play(1).count()).to.equal(initialCards.length - 1);
		});

		it("should return a player with no points if none are provided", function () {
			const player = new Player([...initialCards]);

			expect(player.points()).to.equal(0);
		});

		it("should take an optional number of points and max value", function () {
			const expectedTotal = 23;
			const player = new Player([...initialCards], expectedTotal, 75);
			const total = player.points();

			// max value should be tested with the busted function
			expect(total).to.equal(expectedTotal);
		});
	});

	describe("play", function () {
		const passedCards = [
			new Card("Four", "Hearts"),
			new Card("Ace", "Hearts"),
			new Card("King", "Spades"),
			new Card("King", "Diamonds"),
		];

		it("should throw an error if the index is out-of-bounds", function () {
			const cards = new Player([...passedCards]);
			const toHigh = passedCards.length;
			const toLow = -1;

			expect(cards.play.bind(cards, toHigh), "a too-high index should throw").to.throw();
			expect(cards.play.bind(cards, toLow), "a negative index should throw").to.throw();
		});

		it("should remove the given index from the hand and return the corresponding card", function () {
			const idx = 1;
			const hand = new Player([...passedCards]);

			// hand will sort the cards, test shouldn't have to worry about how.
			const initialCards = hand.cards();
			const cardToRemove = initialCards[idx];
			const expectedCards = [
				...initialCards.slice(0, idx),
				...initialCards.slice(idx + 1),
			];

			const card = hand.play(idx);
			const finalCards = hand.cards();

			expect(card).to.deep.equal(cardToRemove);
			expect(finalCards).to.deep.equal(expectedCards);
		});

		it("should play the cards at either end of the hand", function () {
			const beginning = 0;
			const end = passedCards.length - 1;
			const hand = new Player([...passedCards]);

			// hand will sort the cards, test shouldn't have to worry about how.
			const initialCards = hand.cards();
			const expectedFirst = initialCards[beginning];
			const expectedLast = initialCards[end];
			const lastCard = hand.play(end);
			const firstCard = hand.play(beginning);

			expect(lastCard).to.deep.equal(expectedLast);
			expect(firstCard).to.deep.equal(expectedFirst);
			expect(hand.cards()).to.deep.equal(initialCards.slice(1));
		});

		it("should replaces one played card with another", function () {
			const hand = new Player([...passedCards]);
			const cards = hand.cards();
			const first = 1;
			const second = 2;

			let played = hand.play(first).played();
			expect(played, "should set first card as played").to.deep.equal(cards[first]);

			played = hand.play(second).played();
			expect(played, "should set the second card as played").to.deep.equal(cards[second]);
			expect(
				played?.equals(cards[first]),
				"the second card should not be the same as the first"
			).to.be.false;
		});
	});

	describe("takeTrick", function () {
		const passedCards = [
			new Card("Four", "Hearts"),
			new Card("Ace", "Hearts"),
			new Card("King", "Spades"),
			new Card("King", "Diamonds"),
		];

		it("should take an array of cards and return this", function () {
			const player = new Player([...passedCards]);
			const returnedScore = player.takeTrick.call(player, [new Card("Ace", "Spades")]);

			expect(returnedScore).to.equal(player);
		});
	});

	describe("addRound", function () {
		it("should add cards taken from a trick to to the score", function () {
			const player = new Player([]);
			expect(player.points()).to.equal(0);

			player
				.takeTrick([
					new Card("Ace", "Hearts"),
					new Card("Nine", "Hearts"),
					new Card("Queen", "Hearts"),
				])
				.addRound();

			expect(player.points()).to.equal(3);
		});

		it("should not add clubs, diamond, or spades", function () {
			const player = new Player([]);
			player
				.takeTrick([
					new Card("Ace", "Clubs"),
					new Card("Queen", "Diamonds"),
					new Card("Queen", "Clubs"),
					new Card("Nine", "Spades"),
				])
				.addRound();

			expect(player.points()).to.equal(0);
		});

		it("should count the Queen of Spades as 13", function () {
			const player = new Player([]);
			const total = player
				.takeTrick([new Card("Queen", "Spades")])
				.addRound()
				.points();

			expect(total).to.equal(13);
		});
	});

	describe("busted", function () {
		it("should return true only if the players score is at or above the set threshold", function () {
			const player = new Player([], 0, 20); // 20 is the game's threshold
			expect(player.busted()).to.be.false;

			// add 16 points to score (making it 16)
			let busted = player
				.takeTrick([
					new Card("Ace", "Hearts"),
					new Card("Four", "Hearts"),
					new Card("Seven", "Hearts"),
					new Card("Queen", "Spades"),
				])
				.addRound()
				.busted();

			expect(busted, "should have added 16 points and not busted").to.be.false;

			// add 4 points to score (making it 20)
			busted = player
				.takeTrick([
					new Card("Queen", "Hearts"),
					new Card("Two", "Hearts"),
					new Card("Three", "Hearts"),
					new Card("Ten", "Hearts"),
				])
				.addRound()
				.busted();

			expect(busted, "should have added 20 points and busted").to.be.true;

			// add another point, bringing it over the threshold
			busted = player
				.takeTrick([new Card("King", "Hearts")])
				.addRound()
				.busted();

			expect(busted, "should have added 21 points and still busted").to.be.true;
		});

		it("should have a default threshold of 100", function () {
			const player = new Player([]);
			let busted = player
				.add26()
				.add26()
				.add26()
				.takeTrick([
					new Card("Queen", "Spades"),
					new Card("Two", "Hearts"),
					new Card("Three", "Hearts"),
					new Card("Four", "Hearts"),
					new Card("Five", "Hearts"),
					new Card("Six", "Hearts"),
					new Card("Seven", "Hearts"),
					new Card("Eight", "Hearts"),
					new Card("Nine", "Hearts"),
				])
				.addRound()
				.busted();
			expect(busted).to.be.false;

			busted = player
				.takeTrick([new Card("Jack", "Hearts")])
				.addRound()
				.busted();
			expect(busted).to.be.true;
		});

		it("should not count round score", function () {
			const player = new Player([], 0, 10);

			player.takeTrick([new Card("Queen", "Spades")]);
			expect(player.busted(), "should have taken the queen of spades, but not yet busted")
				.to.be.false;

			player.addRound();
			expect(player.busted(), "should have now added the queen to the total and busted")
				.to.be.true;
		});
	});

	describe("add26", function () {
		it("should add 26 points to a players score", function () {
			const player = new Player([]);
			const total = player.add26().points();

			expect(total).to.equal(26);
		});
	});

	describe("subtract26", function () {
		it("should subtract 26 points to a players score", function () {
			const player = new Player([]);
			const total = player.subtract26().points();

			expect(total).to.equal(-26);
		});
	});

	describe("take", function () {
		it("should add a card to the player's hand", function () {
			const player = new Player([]);
			const expectedCard = new Card("King", "Hearts");

			player.take(expectedCard);

			expect(player.cards()[0]).to.deep.equal(expectedCard);
		});
	});
});
