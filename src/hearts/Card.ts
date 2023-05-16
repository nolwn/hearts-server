export const SUITS = ["Diamonds", "Clubs", "Hearts", "Spades"] as const;
export const VALUES = [
	"Two",
	"Three",
	"Four",
	"Five",
	"Six",
	"Seven",
	"Eight",
	"Nine",
	"Ten",
	"Jack",
	"Queen",
	"King",
	"Ace",
] as const;

/**
 * Suit is one of the suits in a standard deck of playing cards
 */
export type Suit = (typeof SUITS)[number];

/**
 * Value is one of the values in a standard deck of playing cards
 */
export type Value = (typeof VALUES)[number];

/**
 * Card represents a standard playing card in a deck where Two is the lowest value and
 * Ace is the highest.
 */
export default class Card {
	#suit: Suit;
	#value: number;

	/**
	 * Takes a card position and returns a card.
	 * @param cardPosition the position of the card if it was in a standard deck,
	 * organized from low to (Ace) high, where each group of card values is
	 * ordered Diamonds, Clubs, Hearts, then Spades. The value starts at 1 (Two of
	 * Diamonds) to 56 (Ace of Spades).
	 */
	constructor(value: Value, suit: Suit) {
		this.#suit = suit;
		this.#value = VALUES.indexOf(value);
	}

	/**
	 * equals takes another card and returns true of the suit and value of the card that
	 * was passed in matches the suit an value of this card.
	 * @param card is a Card object to compare this card against
	 * @returns true if the suit and value of the comparison card matches this card
	 */
	equals(card: Card) {
		const isSuitMatch = card.#suit === this.#suit;
		const isValueMatch = card.#value === this.#value;

		return isSuitMatch && isValueMatch;
	}

	/**
	 * Takes a card, or null, and returns true if this is greater than the card passed in.
	 * If null is passed, then this is considered larger.
	 * @param card the card to compare against
	 * @returns true if this card is larger than the comparison card
	 */
	greaterThan(card: Card | null): boolean {
		if (card === null) {
			return true;
		}

		return this.#value > card.#value;
	}

	/**
	 * suit is a getter for the suit of this card
	 * @returns the suit of this card
	 */
	suit(): Suit {
		return this.#suit;
	}

	/**
	 * value is a getter for the value of this card
	 * @returns the value of this card
	 */
	value(): Value {
		return VALUES[this.#value];
	}
}
