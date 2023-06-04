import { expect } from "chai";
import Hearts from "../Hearts";
import { getPlayers } from "../testUtil";
import Player from "../Player";
import EndPass from "./EndPass";
import InvalidActionError from "../../Errors/InvalidActionError";
import Card from "../Card";

describe("EndPass", function () {
	describe("act", function () {
		it("should throw if a player has not passed", function () {
			const hearts = new Hearts(getPlayers());
			const endPass = new EndPass();

			hearts.activate(0);
			hearts.setPhase("Pass");

			expect(endPass.act.bind(endPass, hearts)).to.throw(InvalidActionError);
		});

		it("should throw if it is not the Pass phase", function () {
			const hearts = new Hearts(getPlayers());
			const endPass = new EndPass();

			hearts.setPhase("Play");
			hearts.deactivate(0);
			hearts.deactivate(1);
			hearts.deactivate(2);
			hearts.deactivate(3);

			expect(endPass.act.bind(endPass, hearts)).to.throw(InvalidActionError);
		});

		it("should set up the play phase and return null", function () {
			const players = [
				new Player([new Card("King", "Diamonds")]),
				new Player([new Card("Ace", "Spades")]),
				new Player([new Card("Two", "Clubs")]),
				new Player([new Card("Ten", "Hearts")]),
			];
			const hearts = new Hearts(players);
			const endPass = new EndPass();

			hearts.setPhase("Pass");
			hearts.deactivate(0);
			hearts.deactivate(1);
			hearts.deactivate(2);
			hearts.deactivate(3);

			const nextAction = endPass.act(hearts);

			expect(nextAction).to.be.null;
			expect(hearts.phase()).to.equal("Play");
			expect(hearts.isActive(2), "the third player should be active").to.be.true;
			expect(hearts.deactivate(2).hasActive(), "should only be one active player").to.be
				.false;
		});
	});
});
