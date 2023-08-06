import { expect } from "chai";
import Hearts from "../Hearts";
import { getPlayers } from "../testUtil";
import EndRound from "./EndRound";
import EndGame from "./EndGame";
import Player from "../Player";

describe("EndRound", function () {
	it("should throw if it is not the Play phase", function () {
		const endRound = new EndRound();
		const hearts = new Hearts(getPlayers());

		hearts.setPhase("Deal");

		expect(endRound.act.bind(endRound, hearts)).to.throw();
	});

	it("should throw if any player still has cards", function () {
		const endRound = new EndRound();
		const hearts = new Hearts(getPlayers());

		hearts.setPhase("Play");

		expect(endRound.act.bind(endRound, hearts)).to.throw();
	});

	it("should add up player points, enter the deal phase, and return null when no one has busted", function () {
		const endRound = new EndRound();
		const hearts = new Hearts([
			new Player([]),
			new Player([]),
			new Player([]),
			new Player([]),
		]);

		hearts.setPhase("Play");
		const nextAction = endRound.act(hearts);

		expect(nextAction).to.be.null;
		expect(hearts.phase()).to.equal("Deal");
	});

	it("should return EndGame when a player has busted", function () {
		const endRound = new EndRound();
		const bustedPlayer = new Player([]).add26().add26().add26().add26();
		const hearts = new Hearts([
			bustedPlayer,
			new Player([]),
			new Player([]),
			new Player([]),
		]);

		hearts.setPhase("Play");
		const nextAction = endRound.act(hearts);

		// make sure you've set the test up correctly
		expect(bustedPlayer.busted()).to.be.true;
		expect(nextAction).to.be.instanceOf(EndGame);
	});
});
