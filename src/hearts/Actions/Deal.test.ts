import { expect } from "chai";
import Hearts from "../Hearts";
import Deal from "./Deal";
import Player from "../Player";
import { errorRegex, getPlayers, getCards } from "../testUtil";
import InvalidActionError from "../../Errors/InvalidActionError";

describe("Deal", function () {
	describe("act", function () {
		it("should throw if a player has busted", function () {
			const deal = new Deal(getCards());
			const players = [new Player([]), new Player([]), new Player([]), new Player([])];
			players[0].add26().add26().add26().add26();

			const hearts = new Hearts(players);

			expect(deal.act.bind(deal, hearts)).to.throw(errorRegex(InvalidActionError));
		});

		it("should throw if a player has cards", function () {
			const deal = new Deal(getCards());
			const hearts = new Hearts(getPlayers()); // getPlayers players have cards

			expect(deal.act.bind(deal, hearts)).to.throw(errorRegex(InvalidActionError));
		});

		it("should deal cards to each player", function () {
			const deal = new Deal(getCards());
			const players = [new Player([]), new Player([]), new Player([]), new Player([])];

			const hearts = new Hearts(players);

			deal.act(hearts);

			let i = 0;
			for (const player of hearts.players()) {
				expect(player.cards().length, `player ${++i}`).to.equal(52 / 4);
			}
		});
	});
});
