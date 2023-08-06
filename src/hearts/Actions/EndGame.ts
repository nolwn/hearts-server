import Hearts from "../Hearts";
import { Action } from "./Action";

export default class EndGame implements Action {
	act(hearts: Hearts): Action | null {
		return null;
	}
}
