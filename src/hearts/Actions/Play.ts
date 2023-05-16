import { Action } from "./Action";
import { ActionData, PlayData } from "./ActionData";
import Hearts from "../Hearts";
import InvalidActionError from "../../Errors/InvalidActionError";
import TakeTrick from "./TakeTrick";

/**
 * Play represents the act of playing a card.
 */
export default class Play implements Action {
	#card: number;
	#player: number;

	constructor({ player, card }: PlayData) {
		this.#player = player;
		this.#card = card;
	}

	act(hearts: Hearts): Action | null {
		if (!hearts.isActive(this.#player)) {
			throw new InvalidActionError("can only play a card when it is that player's turn");
		}

		if (hearts.player(this.#player).played() !== null) {
			throw new InvalidActionError("player already played a card");
		}

		hearts.player(this.#player).play(this.#card); // play the given card
		hearts.activate(hearts.nextHand(this.#player)); // activate the next player

		for (const player of hearts.players()) {
			if (player.played() === null) {
				// if any player hasn't played a card, return null
				return null;
			}
		}

		// if all players have played a card, then the next even should be TakeTrick
		return new TakeTrick();
	}
}
