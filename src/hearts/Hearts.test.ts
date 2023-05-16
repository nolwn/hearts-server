import { expect } from "chai";
import Card, { Suit } from "./Card";
import Player from "./Player";
import Hearts from "./Hearts";
import { errorRegex, getPlayers } from "./testUtil";
import InvalidIndexError from "../Errors/InvalidIndexError";
import InvalidActionError from "../Errors/InvalidActionError";

describe("Hearts", function () {
	describe("constructor, getters, setters", function () {
		it("should create a new Hearts", function () {
			const [expectedFirst, expectedSecond, expectedThird, expectedFourth] = getPlayers();
			const hearts = new Hearts([
				expectedFirst,
				expectedSecond,
				expectedThird,
				expectedFourth,
			]);

			const first = hearts.player(0);
			const second = hearts.player(1);
			const third = hearts.player(2);
			const fourth = hearts.player(3);

			expect(first).to.deep.equal(expectedFirst);
			expect(second).to.deep.equal(expectedSecond);
			expect(third).to.deep.equal(expectedThird);
			expect(fourth).to.deep.equal(expectedFourth);
		});

		it("should only accept four players", function () {
			const tooFew = getPlayers().slice(1);
			const tooMany = [...getPlayers(), new Player([new Card("Seven", "Diamonds")])];

			expect(
				() => new Hearts(tooFew),
				"should throw if there are only 3 cards"
			).to.throw();
			expect(() => new Hearts(tooMany), "should throw if there are 5 cards").to.throw();
			expect(
				() => new Hearts(getPlayers()),
				"should not throw if there are 4 cards"
			).to.not.throw();
		});

		it("players should return the hearts players", function () {
			const hearts = new Hearts(getPlayers());
			expect(hearts.players()).to.have.lengthOf(4);
			expect(hearts.players()[2]).to.equal(hearts.player(2));
		});

		it("score should return the score of the given player", function () {
			const players = getPlayers();
			const hearts = new Hearts(players);

			expect(hearts.score(1)).to.equal(players[1].points());
		});

		it("trump and setTrump should set and get the trump suit", function () {
			const hearts = new Hearts(getPlayers());
			expect(hearts.trump()).to.be.null;

			hearts.setTrump("Clubs");
			expect(hearts.trump()).to.equal("Clubs");

			hearts.setTrump("Hearts");
			expect(hearts.trump()).to.equal("Hearts");

			hearts.setTrump(null);
			expect(hearts.trump()).to.be.null;
		});
	});

	describe("activate", function () {
		it("should throw an error if given an out-of-bounds index", function () {
			const hearts = new Hearts(getPlayers());
			expect(hearts.activate.bind(this, 4)).to.throw(errorRegex(InvalidIndexError));
		});

		it("should return this", function () {
			const hearts = new Hearts(getPlayers());
			expect(hearts.activate(2)).to.equal(hearts);
		});

		it("should deactivate any players other active players", function () {
			const hearts = new Hearts(getPlayers());
			const first = 1;
			const second = 0;

			expect(hearts.activate(first).isActive(first)).to.true;
			expect(hearts.activate(second).isActive(second)).to.be.true;
			expect(hearts.isActive(first)).to.be.false;
		});

		it("should activate multiple players", function () {
			const hearts = new Hearts(getPlayers());
			const first = 1;
			const second = 2;

			hearts.activate(first, second);

			expect(hearts.isActive(first), "first player should be active").to.be.true;
			expect(hearts.isActive(second), "second player should be active").to.be.true;
		});
	});

	describe("player", function () {
		it("should throw an error if the index provided is out-of-bound", function () {
			const hearts = new Hearts(getPlayers());
			expect(hearts.player.bind(hearts, 4)).to.throw(InvalidIndexError);
			expect(hearts.player.bind(hearts, -1)).to.throw(InvalidIndexError);
		});

		it("should return the given player", function () {
			const players = getPlayers();
			const hearts = new Hearts(players);
			const h = 1;
			expect(hearts.player(h)).to.deep.equal(players[h]);
		});
	});

	describe("isActive", function () {
		it("should throw an error if given an out-of-bounds index", function () {
			const hearts = new Hearts(getPlayers());

			expect(hearts.isActive.bind(this, 4)).to.throw(errorRegex(InvalidIndexError));
		});

		it("players should start as inactive", function () {
			const hearts = new Hearts(getPlayers());

			expect(hearts.isActive(0)).to.be.false;
			expect(hearts.isActive(1)).to.be.false;
			expect(hearts.isActive(2)).to.be.false;
			expect(hearts.isActive(3)).to.be.false;
		});

		it("should get an active player", function () {
			const hearts = new Hearts(getPlayers());
			const active = hearts.activate(1).isActive(1);

			expect(active).to.be.true;
		});
	});

	describe("nextHand", function () {
		it("should throw an error if given an out-of-bounds index", function () {
			const hearts = new Hearts(getPlayers());

			expect(hearts.nextHand.bind(hearts, 4)).to.throw(errorRegex(InvalidIndexError));
		});

		it("should return the index of the next hand in the hand array", function () {
			const initialHands = getPlayers();
			const hearts = new Hearts(initialHands);
			const previousHandIndex = 1;
			const nextHandIndex = 2;
			const hand = hearts.nextHand(previousHandIndex);

			expect(hand).to.equal(nextHandIndex);
		});

		it("should wrap around to the beginning of the array if given the last index", function () {
			const initialHands = getPlayers();
			const hearts = new Hearts(initialHands);
			const previousHandIndex = 3;
			const nextHandIndex = 0;
			const hand = hearts.nextHand(previousHandIndex);

			expect(hand).to.equal(nextHandIndex);
		});
	});

	describe("busted", function () {
		it("should return false when no player has busted", function () {
			const hearts = new Hearts(getPlayers());
			expect(hearts.busted()).to.be.false;
		});

		it("should return true when a player has busted", function () {
			const [, ...players] = getPlayers();

			players.unshift(new Player([], 101));

			const hearts = new Hearts(players);

			expect(hearts.busted()).to.be.true;
		});
	});
});
