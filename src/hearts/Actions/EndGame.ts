import InvalidActionError from "../../Errors/InvalidActionError";
import Hearts from "../Hearts";
import { Action } from "./Action";

export default class EndGame implements Action {
	act(hearts: Hearts): Action | null {
		if (hearts.phase() !== "Play") {
			throw new InvalidActionError(
				`the game cannot end during the ${hearts.phase()} phase`
			);
		}

		if (!hearts.busted()) {
			throw new InvalidActionError("the game does not end until a player has busted");
		}

		hearts.setPhase("Over");

		return null;
	}
}
