import InvalidActionError from "../../Errors/InvalidActionError";
import { Action } from "./Action";
import Hearts from "../Hearts";
import EndGame from "./EndGame";

export default class EndRound implements Action {
	act(hearts: Hearts) {
		if (hearts.phase() !== "Play") {
			throw new InvalidActionError(
				"cannot end the round because it is not the play phase"
			);
		}

		for (const player of hearts.players()) {
			if (player.count()) {
				throw new InvalidActionError("cannot end the round, a player still has cards");
			}
		}

		hearts.setPhase("Deal");

		if (hearts.busted()) {
			return new EndGame();
		}

		return null;
	}
}
