# Hearts

## Game Rules

Part of this program is just the rules of the Hearts game, which is contained in `src/hearts`. The game rules are managed by a Hearts class that contains game state. The Hearts class doesn't allow itself to drift into a totally nonsensical state, but it doesn't validate game rules. As long as it's not being asked to do something impossible, like a play a card a player doesn't have, then it's satisfied.

The Hearts class is updated according to the rules of the game by Actions which are contained in `src/hearts/Actions`. The Actions cannot produce side effects and must predictably update the game. Actions are classes that are built around data that can be sent by a user, created by other Actions, generated by the server, or read from a database. The Actions are responsible for making sure that the things that are happening are consistent with the rules of the game.

Actions should represent small actions in the game. If an Action, like playing a card, results in a trick being taken by a player, the Play Action doesn't also handle trick taking. Instead, it returns a TakeTrick Action that handles that next step of the game. The ActionRunner will keep running Actions over the hearts game until those Actions stop returning new actions.

Below are the Actions with Actions they might return, or null.

```
Deal -> null

Pass -> null
Pass -> EndPass

EndPass -> null

Play -> null
Play -> TakeTrick

TakeTrick -> null
TakeTrick -> EndRound

EndRound -> null
EndRound -> EndGame
```

While these Actions are created either by a player, or by another Action, dealing cards is little bit special. A players client can't really shuffle the cards because that player would then have access to the shuffled cards. The Deal action shouldn't shuffle cards itself because it would then not behave predictably. It's better that the server should keep track of when cards need to be shuffled and then provide a list of shuffled cards if needed. In this case, then, the server itself becomes a kind of actor; it generates new information (the randomized cards) and passes it to the game.
