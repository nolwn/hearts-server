import InvalidActionError from "../../Errors/InvalidActionError";
import Hearts from "../Hearts";
import type { Action } from "./Action";
import type Card from "../Card";

/**
 * TakeTrick represents the action of a player taking a trick
 */
export default class TakeTrick implements Action {
	/**
	 * Determines which player has played the highest card and awards them the trick.
	 * @returns the updated hearts game
	 */
	act(hearts: Hearts): Action | null {
		const trump = hearts.trump();
		const cards: Card[] = []; // list of all the cards that have been played
		let highestIndex: number = 0;
		let highestCard: Card | null = null;

		if (!trump) throw new InvalidActionError("cannot take trick because no trump is set");

		for (let i = 0; i < hearts.players().length; i++) {
			const card = hearts.player(i).played();

			if (!card) {
				throw new InvalidActionError(
					"cannot take trick because not all players have played a card"
				);
			}

			cards.push(card);

			// If a card is not on suit, then it can't be the highest card.
			if (card.suit() !== trump) continue;
			if (card.greaterThan(highestCard)) {
				highestIndex = i;
				highestCard = card;
			}
		}

		if (!highestCard) {
			throw new InvalidActionError("cannot take trick because no player played on suit");
		}

		const player = hearts.player(highestIndex);
		player.takeTrick(cards);

		return null;
	}
}
