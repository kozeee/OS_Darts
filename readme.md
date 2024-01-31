# OS_Darts APP

This is intended to be a fullstack application to assist in tracking points across multiple dart tournaments in our local area.
The code base is currently in migration from Node/Express/Mongodb to include a REACT front-end instead of pure JS/boostrap.

# Features:

The app can be broken into 3 components - tournaments, players, and bars(i.e tournament locations)

### Tournaments:

Each tournament should have a Name, GameMode, Location, and an array of "Winners" (players and points)

#### Complete:

- View all tournaments
- Search/filter tournaments by Name, Location, and GameMode
- Implement Winners

#### TODO:

- Create tournaments

### Players:

The player object its self is pretty simple and should only really need a name and membership status.

#### Complete:

- Implement Membership
- Create new player modal
- Player home page
- Build total points report

#### TODO:

- Build Tournament->Player report

### Bars:

Bars are just "Locations" more broadly and just denote where a tournament was held. Points are tracked per-player per-bar.

#### Complete:

- Internal API to create/delete bars
- Component to fetch bars

#### TODO:

- Add UI to manage bars (create/delete bar)
