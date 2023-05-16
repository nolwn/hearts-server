import InvalidIndexError from "../Errors/InvalidIndexError";
import Player from "./Player";
import Card, { Suit } from "./Card";
import { isValidArrayIndex } from "./util";
import InvalidActionError from "../Errors/InvalidActionError";

/**
 * Hearts represents the overall state of the game.
 */
export default class Hearts {
	#players: Player[];
	#active: boolean[];
	#trump: Suit | null;

	/**
	 * Takes an array of Players and returns a Hearts game.
	 * @param players an array of Players
	 * @throws {InvalidIndexError} if the given index is out of bounds
	 */
	constructor(players: Player[]) {
		if (players.length !== 4) {
			throw new InvalidIndexError(
				`Hearts received ${players.length} hands but it requires 4`
			);
		}

		this.#players = players;
		this.#active = [false, false, false, false];
		this.#trump = null;
	}

	/**
	 * Takes a player index and sets active the player at that index
	 * @param players index of the player to activate
	 */
	activate(...players: number[]): Hearts {
		// check each given index
		for (const p of players) isValidArrayIndex(p, 3);

		// set as active only the given players
		this.#active = this.#active.map((_, i) => players.includes(i));

		return this;
	}

	/**
	 * Looks over player scores and returns true if any have gone over the threshold.
	 * @returns true if any player has exceeded the score threshold.
	 */
	busted(): boolean {
		for (const player of this.#players) {
			if (player.busted()) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Takes a player index and returns true if that player is active.
	 * @param p the index of a player
	 * @returns true if the player at the given index is active
	 * @throws {InvalidIndexError} if the given index is out of bounds
	 */
	isActive(p: number): boolean {
		isValidArrayIndex(p, 3);
		return this.#active[p];
	}

	/**
	 * Takes a player index and returns that players Hand.
	 * @param p the index of a player
	 * @returns the hand of the player at the given index
	 * @throws {InvalidIndexError} if the given index is out of bounds
	 */
	player(p: number): Player {
		isValidArrayIndex(p, 3);
		return this.#players[p];
	}

	/**
	 * Returns all the players that are part of the Hearts game.
	 * @returns all the players that are part of the Hearts game.
	 */
	players(): Player[] {
		return this.#players;
	}

	/**
	 * setTrump sets the trump suit.
	 *
	 */
	setTrump(suit: Suit | null) {
		this.#trump = suit;
	}

	/**
	 * Takes a hand index and returns the next hand. It deals with wrapping around so
	 * that if the hand index at the end of the array is passed then the hand at the
	 * beginning is returned.
	 * @param h integer of the previous hand
	 */
	nextHand(h: number): number {
		isValidArrayIndex(h, 3);
		if (h === 3) return 0;
		return h + 1;
	}

	/**
	 * Takes a player index and returns the score for the player at the given index.
	 * @param p the index of a player
	 */
	score(p: number): number {
		return this.#players[p].points();
	}

	/**
	 * Returns the trump suit or null if there have been no cards played.
	 * @returns the trump suit or null.
	 */
	trump(): Suit | null {
		return this.#trump;
	}
}
