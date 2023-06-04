import InvalidActionError from "../../Errors/InvalidActionError";
import Hearts from "../Hearts";
import { PassData } from "./ActionData";
import type { Action } from "./Action";
import EndPass from "./EndPass";

export default class Pass implements Action {
	#player: number;
	#cards: [number, number, number];

	constructor({ player, cards }: PassData) {
		this.#player = player;
		this.#cards = cards;
	}

	act(hearts: Hearts): null | EndPass {
		if (!hearts.isActive(this.#player)) {
			throw new InvalidActionError("player has already passed cards");
		}

		if (hearts.phase() !== "Pass") {
			throw new InvalidActionError("it is not the passing phase");
		}

		hearts.player(this.#player).pass(this.#cards);
		hearts.deactivate(this.#player);

		// if there are any players that still need to pass, return null...
		if (hearts.hasActive()) return null;

		// ...otherwise, end the passing phase.
		return new EndPass();
	}
}
