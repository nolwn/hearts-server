import Card, { VALUES, Value, SUITS, Suit } from "./Card";
import HeartsError from "../Errors/HeartsError";
import Player from "./Player";

export function errorRegex(errorClass: typeof HeartsError): RegExp {
	return new RegExp(`^${errorClass.preamble}: `);
}

export function getPlayers(): [Player, Player, Player, Player] {
	const cards = getCards().map(({ value, suit }) => new Card(value, suit));
	const first = new Player(cards.slice(0, 13), 39);
	const second = new Player(cards.slice(13, 26), 29);
	const third = new Player(cards.slice(26, 39), 12);
	const fourth = new Player(cards.slice(39, 52), 7);

	return [first, second, third, fourth];
}

export function getCards(): { value: Value; suit: Suit }[] {
	const cards: { value: Value; suit: Suit }[] = [];

	for (const suit of SUITS) {
		for (const value of VALUES) {
			cards.push({ value, suit });
		}
	}

	return cards;
}
