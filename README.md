# todo

- Another screen accessible from main menu -- how to play (just a brief explainer of the rules)

Backend:
- leaderboard
- report missing word
- Where to host backend? Just on a new droplet?
    - Make it in Elixir?
- What about a DB? - just run postgres on same droplet

Items:
- Clearing 5 letter word gives you a pickaxe - clear any square on the board (or drop it and it clears something)
- Clearing 6 letter word gives you a bomb - clear a cross of squares
- Clearing 7 letter word ... clears the entire board? Maybe entire column/row
Time attack:
- After each minute, timer gets faster. Shave off .5 seconds from it, until like 2 seconds, and then multiply it by .8 ?
    - Minimum: .5 seconds?
- Say which level you're on (each minute makes you go up a level) and how long current timer is
- You get more points for a higher level
Points:
- Bonus points for long words
- Bonus points for multiple words at once
- Bonus points for clearing the board ... maybe based on how full it was before?
Marketing:
- Record replay of highlights (multi-words, etc.) as GIF
    - gifcap https://github.com/joaomoreno/gifcap
    - Or: gif.js https://github.com/jnordberg/gif.js/

Missing words:
- axe
Questionable words:
- ism
- pic
- mun
- ell
- poi