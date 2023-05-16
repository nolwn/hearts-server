import Card, { VALUES, SUITS } from "./Card";
import HeartsError from "../Errors/HeartsError";
import Player from "./Player";

export function errorRegex(errorClass: typeof HeartsError): RegExp {
	return new RegExp(`^${errorClass.preamble}: `);
}

export function getPlayers(): [Player, Player, Player, Player] {
	const first = new Player([new Card("Ace", "Hearts"), new Card("Nine", "Diamonds")], 39);
	const second = new Player([new Card("Nine", "Spades"), new Card("Ten", "Spades")], 29);
	const third = new Player(
		[new Card("Three", "Hearts"), new Card("Seven", "Hearts")],
		12
	);
	const fourth = new Player([new Card("Six", "Spades"), new Card("Eight", "Clubs")], 7);

	return [first, second, third, fourth];
}

export function getCards(): Card[] {
	const cards: Card[] = [];

	for (const suit of SUITS) {
		for (const value of VALUES) {
			cards.push(new Card(value, suit));
		}
	}

	return cards;
}
