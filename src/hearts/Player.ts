import Card from "./Card";
import { isValidArrayIndex } from "./util";

/**
 * Player represents a player with a hand and a score.
 */
export default class Player {
	#cards: Card[];
	#max: number;
	#played?: Card;
	#points: number;
	#roundScore: number;

	/**
	 * takes a list of cards and returns a Player
	 * @param cards an array of Card objects in a players hand
	 */
	constructor(cards: Card[], points: number = 0, max: number = 100) {
		this.#cards = cards;
		this.#max = max;
		this.#points = points;
		this.#roundScore = 0;
	}

	/**
	 * Takes an index and returns the card at that index. It does not consider cards that
	 * are being played or passed. It throws if the index given is out-of-bounds.
	 * @param c the index of the a player's card
	 * @returns the card at the given index
	 * @throws {InvalidIndexError} if the given index is out of bounds
	 */
	card(c: number): Card {
		isValidArrayIndex(c, this.count() - 1);
		return this.cards()[c];
	}

	/**
	 * cards is a getter for the Player's cards
	 * @returns this Player's cards
	 */
	cards(): Card[] {
		return this.#cards.filter((card) => card !== this.#played);
	}

	/**
	 * count returns the number cards a player is still holding (hasn't played or
	 * passed).
	 * @returns the number of cards in a player's hand
	 */
	count() {
		return this.#cards.reduce(
			(count, card) => (card !== this.#played ? ++count : count),
			0
		);
	}

	/**
	 * pass takes exactly three cards and makes them "passing" within a players hand.
	 * They don't yet leave a players hand, and it's the responsibility of some Action
	 * to actually remove the cards from the player at the appropriate time.
	 * @param cards the cards a player is passing
	 */
	pass(cards: [number, number, number]): Player {
		for (const c of cards) {
			isValidArrayIndex(c, this.#cards.length - 1);

			this.#cards[c].pass();
		}

		return this;
	}

	/**
	 * A getter for the cards that a player has passed.
	 * @returns the Cards that a player has passed
	 */
	passed(): Card[] {
		const cards: Card[] = [];

		for (const card of this.#cards) {
			if (card.passed()) cards.push(card);
		}

		return cards;
	}

	/**
	 * play takes an index and sets as played the card at the given index. It also
	 * removes the card from the player.
	 * @param c the index of the card to play
	 * @throws {InvalidIndexError} if the given index is out of bounds
	 */
	play(c: number): Player {
		isValidArrayIndex(c, this.count() - 1);

		this.#played = this.#cards[c];

		return this;
	}

	/**
	 * played is a getter for the player's active card.
	 * @returns a card if one has been played, otherwise null
	 */
	played(): Card | null {
		return this.#played ?? null;
	}

	/**
	 * trick takes an array of cards which represents a trick taken by the player. It
	 * adds up the points that each card is worth, and adds them to a round score.
	 * @param cards an array of cards to add up
	 */
	takeTrick(cards: Card[]) {
		for (const card of cards) {
			this.#roundScore += this.#cardPoints(card);
		}

		return this;
	}

	/**
	 * add26 adds 26 points to the player's score. This occurs when another player has
	 * shot the moon and elected to add points to other players scores.
	 * @returns true if the player has busted.
	 */
	add26(): Player {
		this.#points += 26;

		return this;
	}

	/**
	 * addRound adds the round score to the players total.
	 */
	addRound() {
		this.#points += this.#roundScore;
		this.#roundScore = 0;

		/** @todo Will need to trigger a moonshot action is that applies here */

		return this;
	}

	/**
	 * subtract26 removes 26 points from the player's score. This occurs when the player has
	 * successfully shot the moon and elected to reduce their own score.
	 */
	subtract26(): Player {
		this.#points -= 26;

		return this;
	}

	/**
	 * busted returns true if the player has busted. Busting, in Hearts, happens when the
	 * players score goes over some threshold, ending the game.
	 * @returns returns true if the player has busted
	 */
	busted() {
		return this.#points >= this.#max;
	}

	/**
	 * points returns the total number of points a player has earned, not including their
	 * round points.
	 * @returns the total score of the player
	 */
	points() {
		return this.#points;
	}

	/**
	 * takes a card and adds it to the players cards
	 * @param card the card to add
	 */
	take(card: Card) {
		this.#cards.push(card);
	}

	#cardPoints(card: Card) {
		if (card.suit() === "Hearts") return 1;
		if (card.suit() === "Spades" && card.value() === "Queen") return 13;
		return 0;
	}
}
