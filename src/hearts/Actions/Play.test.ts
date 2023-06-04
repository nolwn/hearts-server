import { expect } from "chai";
import Hearts from "../Hearts";
import Play from "./Play";
import { ACTION_PLAY } from "./ActionData";
import { getPlayers, errorRegex } from "../testUtil";
import InvalidActionError from "../../Errors/InvalidActionError";
import InvalidIndexError from "../../Errors/InvalidIndexError";
import TakeTrick from "./TakeTrick";

describe("Play", function () {
	describe("act", function () {
		it("should reject playing a card for an inactive player", function () {
			// hearts starts off with all inactive players
			const p = 0;
			const hearts = new Hearts(getPlayers());
			const play = new Play({ kind: ACTION_PLAY, player: p, card: 0 });

			hearts.deactivate(p);

			expect(play.act.bind(play, hearts)).to.throw(errorRegex(InvalidActionError));
		});

		it("should reject playing a card that doesn't exist", function () {
			const hearts = new Hearts(getPlayers());
			const h = 0;
			const c = hearts.player(h).cards().length;
			const play = new Play({ kind: ACTION_PLAY, player: h, card: c });
			hearts.activate(h);

			expect(play.act.bind(play, hearts)).to.throw(errorRegex(InvalidIndexError));
		});

		it("should reject playing a card for a player that doesn't exist", function () {
			const hearts = new Hearts(getPlayers());
			const play = new Play({ kind: ACTION_PLAY, player: 5, card: 0 });

			expect(play.act.bind(play, hearts)).to.throw(errorRegex(InvalidIndexError));
		});

		it("should play a card and for a given player when that player is active", function () {
			const hearts = new Hearts(getPlayers());
			const h = 0;
			const c = 0;
			const expectedPlayed = hearts.activate(h).player(h).card(c);
			const play = new Play({ kind: ACTION_PLAY, player: h, card: c });

			play.act(hearts);

			const played = hearts.player(h).played();

			expect(played).to.deep.equal(expectedPlayed);
		});

		it("should make the next player active once a player has played", function () {
			const hearts = new Hearts(getPlayers());
			const h = 0;
			const c = 0;
			const play = new Play({ kind: ACTION_PLAY, player: h, card: c });

			hearts.activate(h).player(h);
			play.act(hearts);

			const isPreviousActive = hearts.isActive(h);
			const isNextActive = hearts.isActive(h + 1);

			expect(isPreviousActive, "previous player should be inactive").to.be.false;
			expect(isNextActive, "next player should be active").to.be.true;
		});

		it("should throw an error if player has already played", function () {
			const hearts = new Hearts(getPlayers());
			const h = 0;
			const c = 0;
			const play = new Play({ kind: ACTION_PLAY, player: h, card: c });

			hearts.activate(h).player(h).play(c);

			expect(play.act.bind(play, hearts)).to.throw(InvalidActionError);
		});

		it("should return a TakeTrick action if all players have played", function () {
			const hearts = new Hearts(getPlayers());

			// all players except one play a card
			for (let i = 1; i < hearts.players().length; i++) {
				const play = new Play({ kind: ACTION_PLAY, player: i, card: 0 });
				hearts.activate(i).player(i);

				const nextAction = play.act(hearts);
				expect(nextAction).to.be.null;
			}

			const play = new Play({ kind: ACTION_PLAY, player: 0, card: 0 });
			hearts.activate(0).player(0);

			const nextAction = play.act(hearts);
			expect(nextAction).to.be.instanceOf(TakeTrick);
		});
	});
});
