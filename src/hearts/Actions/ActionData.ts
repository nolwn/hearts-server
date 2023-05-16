import { Suit, Value } from "../Card";

export const ACTION_PLAY = "play";
export const ACTION_TAKE_TRICK = "TakeTrick";
export const ACTION_DEAL = "Deal";

export interface ActionData {
	kind: string;
}

export interface DealData {
	kind: typeof ACTION_DEAL;
	cards: { suit: Suit; value: Value }[];
}

export interface PlayData extends ActionData {
	kind: typeof ACTION_PLAY;
	card: number;
	player: number;
}

export interface TakeTrickData extends ActionData {
	kind: typeof ACTION_TAKE_TRICK;
}
