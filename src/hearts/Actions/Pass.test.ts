import { expect } from "chai";
import Hearts from "../Hearts";
import { errorRegex, getPlayers } from "../testUtil";
import Pass from "./Pass";
import InvalidActionError from "../../Errors/InvalidActionError";
import InvalidIndexError from "../../Errors/InvalidIndexError";
import EndPass from "./EndPass";

describe("Pass", function () {
	describe("act", function () {
		it("should throw if the player has already passed", function () {
			const p = 0;
			const pass = new Pass({ kind: "Pass", player: p, cards: [0, 1, 2] });
			const players = getPlayers();

			players[0].pass([0, 1, 2]);

			const hearts = new Hearts(players);
			hearts.deactivate(p);
			hearts.setPhase("Pass");

			expect(pass.act.bind(pass, hearts)).to.throw(errorRegex(InvalidActionError));
		});

		it("should throw if the player does not exist", function () {
			const pass = new Pass({ kind: "Pass", player: 5, cards: [0, 1, 2] });
			const hearts = new Hearts(getPlayers());
			hearts.setPhase("Pass");

			expect(pass.act.bind(pass, hearts)).to.throw(errorRegex(InvalidIndexError));
		});

		it("should throw if it's not the passing phase", function () {
			const pass = new Pass({ kind: "Pass", player: 0, cards: [0, 1, 2] });
			const hearts = new Hearts(getPlayers());

			// hearts should be in the "Deal" phase to start, but just to be explicit...
			hearts.setPhase("Play");

			expect(pass.act.bind(pass, hearts)).to.throw(InvalidActionError);
		});

		it("should pass cards and return null if not all players have passed", function () {
			const p = 0;
			const cardIndices: [number, number, number] = [0, 1, 2];
			const players = getPlayers();
			const player = players[p];
			const expectedCards = cardIndices.map((c) => player.card(c));
			const pass = new Pass({ kind: "Pass", player: p, cards: cardIndices });
			const hearts = new Hearts(getPlayers());

			hearts.setPhase("Pass");

			const nextAction = pass.act(hearts);

			expect(nextAction).to.be.null;
			expect(hearts.player(p).passed()).to.deep.equal(expectedCards);
		});

		it("should pass cards and return EndPass if all players have now passed", function () {
			const first = new Pass({ kind: "Pass", player: 0, cards: [0, 1, 2] });
			const second = new Pass({ kind: "Pass", player: 1, cards: [0, 1, 2] });
			const third = new Pass({ kind: "Pass", player: 2, cards: [0, 1, 2] });
			const fourth = new Pass({ kind: "Pass", player: 3, cards: [0, 1, 2] });
			const hearts = new Hearts(getPlayers());

			hearts.setPhase("Pass");

			first.act(hearts);
			second.act(hearts);
			third.act(hearts);

			const nextAction = fourth.act(hearts);

			expect(nextAction).to.be.instanceOf(EndPass);
		});
	});
});
