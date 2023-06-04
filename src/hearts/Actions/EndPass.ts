import { Action } from "./Action";
import Card from "../Card";
import InvalidActionError from "../../Errors/InvalidActionError";
import Hearts from "../Hearts";

export default class EndPass implements Action {
	constructor() {}

	act(hearts: Hearts): Action | null {
		if (hearts.hasActive()) throw new InvalidActionError("a player still has not passed");
		if (hearts.phase() !== "Pass") {
			throw new InvalidActionError(
				`cannot end pass phase, the current phase is ${hearts.phase()}`
			);
		}

		const startIndex = hearts
			.players()
			.findIndex((player) =>
				player.cards().find((card) => card.equals(new Card("Two", "Clubs")))
			);

		hearts.setPhase("Play");
		hearts.activate(startIndex);

		return null;
	}
}
