import Hearts from "../Hearts";

export interface Action {
	/**
	 * Takes a game of Hearts and performs some action on it. If the game is not in a
	 * state where the action is valid, then it will throw an error.
	 * @param hearts is a game of Hearts to perform an action on
	 * @throws if the action is not valid for the given game state
	 */
	act(hearts: Hearts): Action | null;
}
