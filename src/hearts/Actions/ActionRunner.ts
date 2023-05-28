import Hearts from "../Hearts";
import { Action } from "./Action";

export default class ActionRunner {
	#hearts: Hearts;

	constructor(hearts: Hearts) {
		this.#hearts = hearts;
	}

	dispatch(action: Action): Hearts {
		let nextAction: Action | null = action;
		do {
			nextAction = nextAction.act(this.#hearts);
		} while (nextAction);

		return this.#hearts;
	}
}
