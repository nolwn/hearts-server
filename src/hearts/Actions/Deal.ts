import InvalidActionError from "../../Errors/InvalidActionError";
import Card from "../Card";
import Hearts from "../Hearts";
import { Action } from "./Action";

export default class Deal implements Action {
	#cards: Card[];

	constructor(cards: Card[]) {
		this.#cards = cards;
	}

	act(hearts: Hearts): Action | null {
		if (hearts.busted()) {
			throw new InvalidActionError("cannot deal because a player has busted");
		}

		for (const player of hearts.players()) {
			if (player.cards().length) {
				throw new InvalidActionError(
					"cannot deal because one or more players already have cards"
				);
			}
		}

		for (let i = 0; i < this.#cards.length; i++) {
			// Would it be easier and very slightly more efficient to just hand out a
			// quarter of the deck to each player? Yes. But that's not how you deal,
			// my Mom taught me better than that!
			const card = this.#cards[i];
			const p = this.#cards.length % 4;

			hearts.player(p).take(card);
		}

		return null;
	}
}
