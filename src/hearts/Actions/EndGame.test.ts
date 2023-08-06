import Player from "../Player";
import EndGame from "./EndGame";
import Hearts from "../Hearts";
import { expect } from "chai";
import { errorRegex } from "../testUtil";
import InvalidActionError from "../../Errors/InvalidActionError";

describe("EndGame", function () {
	it("should set the phase to Over", function () {
		const endGame = new EndGame();
		const bustedPlayer = new Player([]).add26().add26().add26().add26();
		const hearts = new Hearts([
			new Player([]),
			new Player([]),
			bustedPlayer,
			new Player([]),
		]);

		hearts.setPhase("Play");
		endGame.act(hearts);

		// make sure the test is set correctly
		expect(bustedPlayer.busted()).to.be.true;

		expect(hearts.phase()).to.equal("Over");
	});

	it("should throw if it is not the Play phase", function () {
		const endGame = new EndGame();
		const hearts = new Hearts([
			new Player([]),
			new Player([]),
			new Player([]).add26().add26().add26().add26(),
			new Player([]),
		]);

		hearts.setPhase("Deal");

		expect(endGame.act.bind(endGame, hearts)).to.throw(errorRegex(InvalidActionError));
	});

	it("should throw if a player has not busted", function () {
		const endGame = new EndGame();
		const hearts = new Hearts([
			new Player([]),
			new Player([]),
			new Player([]),
			new Player([]),
		]);

		hearts.setPhase("Play");

		expect(endGame.act.bind(endGame, hearts)).to.throw(errorRegex(InvalidActionError));
	});
});
