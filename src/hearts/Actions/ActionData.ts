import { Suit, Value } from "../Card";

export const ACTION_DEAL = "Deal";
export const ACTION_PASS = "Pass";
export const ACTION_PLAY = "Play";

export interface ActionData {
	kind: string;
}

export interface DealData {
	kind: typeof ACTION_DEAL;
	cards: { suit: Suit; value: Value }[];
}

export interface PassData extends ActionData {
	kind: typeof ACTION_PASS;
	cards: [number, number, number];
	player: number;
}

export interface PlayData extends ActionData {
	kind: typeof ACTION_PLAY;
	card: number;
	player: number;
}
