import { expect } from "chai";
import InvalidActionError from "../../Errors/InvalidActionError";
import Hearts from "../Hearts";
import Card, { Suit } from "../Card";
import Player from "../Player";
import { errorRegex, getPlayers } from "../testUtil";
import TakeTrick from "./TakeTrick";

describe("TakeTrick", function () {
	describe("act", function () {
		it("should throw an error if no trump has been set", function () {
			const takeTrick = new TakeTrick();
			const players = getPlayers();

			// the error should not be because a player hasn't played
			for (const player of players) {
				player.play(0);
			}

			const hearts = new Hearts(players);

			expect(takeTrick.act.bind(takeTrick, hearts)).to.throw(
				errorRegex(InvalidActionError)
			);
		});

		it("should throw an error if a player has not played a card", function () {
			const takeTrick = new TakeTrick();
			const players = getPlayers();
			const hearts = new Hearts(players);

			// skip the first player
			for (let i = 1; i < players.length; i++) {
				const player = players[i];
				player.play(0);

				// there should not be an error because no trump was set
				hearts.setTrump(player.played()!.suit());
			}

			expect(takeTrick.act.bind(takeTrick, hearts)).to.throw(
				errorRegex(InvalidActionError)
			);
		});

		it("should throw an error if no player has played on suit", function () {
			const takeTrick = new TakeTrick();

			// players all have only hearts and they have all played their card
			const players = [
				new Player([new Card("Two", "Hearts")]).play(0),
				new Player([new Card("Three", "Hearts")]).play(0),
				new Player([new Card("Four", "Hearts")]).play(0),
				new Player([new Card("Five", "Hearts")]).play(0),
			];

			const hearts = new Hearts(players);
			hearts.setTrump("Spades"); // somehow the trump is set to an impossible suit

			expect(takeTrick.act.bind(takeTrick, hearts)).to.throw(
				errorRegex(InvalidActionError)
			);
		});

		it("should give cards to the player who played the highest card", function () {
			const takeTrick = new TakeTrick();
			const suit: Suit = "Hearts";

			// players all have only hearts and they have all played their card
			const players = [
				new Player([new Card("Two", suit)]).play(0),
				new Player([new Card("Four", suit)]).play(0),
				new Player([new Card("Five", suit)]).play(0),
				new Player([new Card("Three", suit)]).play(0),
			];

			const hearts = new Hearts(players);

			hearts.setTrump(suit);
			takeTrick.act(hearts);

			const expectedTaker = hearts.player(2);
			const otherPlayer = hearts.player(1);

			expect(expectedTaker.addRound().points()).to.equal(4); // took four Hearts
			expect(otherPlayer.addRound().points()).to.equal(0);
		});

		it("should ignore players who play cards off suit", function () {
			const takeTrick = new TakeTrick();
			const suit: Suit = "Hearts";

			// the highest played card should be a Spade, but the trump will be Hearts
			const players = [
				new Player([new Card("Three", suit)]).play(0),
				new Player([new Card("Two", suit)]).play(0),
				new Player([new Card("Five", "Spades")]).play(0),
				new Player([new Card("Four", suit)]).play(0),
			];

			const hearts = new Hearts(players);

			hearts.setTrump(suit);
			takeTrick.act(hearts);

			const expectedTaker = hearts.player(3);
			const otherPlayer = hearts.player(2);

			expect(expectedTaker.addRound().points()).to.equal(3); // took three Hearts
			expect(otherPlayer.addRound().points()).to.equal(0);
		});
	});
});
