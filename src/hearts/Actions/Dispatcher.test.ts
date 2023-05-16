import { getPlayers } from "../testUtil";
import { Action } from "./Action";
import Hearts from "../Hearts";
import { expect } from "chai";
import Dispatcher from "./Dispatcher";

class MockAction implements Action {
	#actions: Action[];
	called: number;

	constructor(...actions: Action[]) {
		this.#actions = actions;
		this.called = 0;
	}

	act(): Action | null {
		this.called++;

		if (this.#actions.length) {
			this.#actions.pop();
			return this;
		}

		return null;
	}
}

describe("Dispatcher", function () {
	describe("dispatch", function () {
		it("returns Hearts", function () {
			const hearts = new Hearts(getPlayers());
			const action = new MockAction();
			const dispatcher = new Dispatcher(hearts);
			const adjustedHearts = dispatcher.dispatch(action);

			expect(adjustedHearts).to.equal(hearts);
		});

		it("should run an action and all actions returned by that action is it's child actions", function () {
			const third = new MockAction();
			const second = new MockAction();
			const first = new MockAction(second, third);
			const hearts = new Hearts(getPlayers());
			const dispatcher = new Dispatcher(hearts);

			dispatcher.dispatch(first);

			expect(first.called).to.equal(3);
		});
	});
});
