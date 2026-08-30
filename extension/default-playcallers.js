// Teams whose offensive play-caller CHANGED for 2026 vs 2025 (TEAM<TAB>note).
// Teams not listed kept the same play-caller. Compiled from Aug 2026 reports.
// Bump the version when this changes so installs pick up the update.
const DEFAULT_PLAYCALLER_VERSION = 2;
const DEFAULT_PLAYCALLER_TEXT = `ARI	New staff: HC Mike LaFleur (OC Nathaniel Hackett) — Drew Petzing's offense is out
ATL	New OC Tommy Rees (from CLE) replaces Zac Robinson
BAL	New OC Declan Doyle (was CHI's OC in 2025)
CLE	Todd Monken now runs the offense (Tommy Rees left for ATL)
DET	New play-caller Drew Petzing (called plays for ARI the last three seasons)
LAC	New OC Mike McDaniel (play-calling HC in MIA 2022-2025)
LV	New HC Klint Kubiak (was SEA's play-caller in 2025)
MIA	Bobby Slowik promoted to play-caller (McDaniel left for LAC)
NYG	New OC Matt Nagy (from KC)
NYJ	New OC Frank Reich (Glenn fired Tanner Engstrand)
PHI	New OC Sean Mannion calls plays
PIT	Mike McCarthy now calls plays (replaces Arthur Smith's offense)
SEA	New OC Brian Fleury (Kubiak left to be LV's HC)
TB	New OC Zac Robinson (called plays for ATL 2024-2025)
TEN	Brian Daboll now calls plays
WAS	New OC David Blough (internal promotion)`;

// Player-specific reads on those play-caller changes (Name<TAB>+|-<TAB>why).
// "+" = bullish for this player, "-" = bearish. Players on changed teams
// without an entry get the neutral change marker.
const DEFAULT_PC_PLAYERS_TEXT = `Michael Wilson	+	LaFleur says Wilson fills the same Z role that made Puka Nacua a star in his scheme
Marvin Harrison Jr.	+	New LaFleur staff plus health is the cited path to finally unlocking the top-5-pick upside
Jeremiyah Love	+	The new ARI staff spent the No. 3 overall pick on him
Tyler Allgeier	+	New staff listed Allgeier, not Love, as RB1 on its first depth chart
Quinshon Judkins	+	Enters Monken's new offense with legitimate upside per beat reports
Dylan Sampson	+	Monken's staff downplaying Judkins' recovery still leaves an early-season window
Harold Fannin Jr.	+	Monken funnels his offense through tight ends
Sam LaPorta	+	Petzing called the ARI offense that fed Trey McBride a record 126-catch season
Ashton Jeanty	+	Kubiak says he wants Jeanty in a Christian McCaffrey-type receiving role
Keaton Mitchell	+	McDaniel hand-picked him for the system that made Mostert and Achane stars
Quentin Johnston	+	McDaniel's YAC-first scheme targets Johnston's biggest strength, and the OC is a believer
Tre' Harris	+	McDaniel offense plus the targets Keenan Allen left behind
Omarion Hampton	+	McDaniel's scheme has repeatedly turned fast backs into fantasy stars
Makai Lemon	+	Mannion's motion-and-space offense is called an ideal fit for his game
DK Metcalf	+	McCarthy plans to move him all over the formation; PIT projects to throw more than under Arthur Smith
Jadarian Price	+	New Seattle staff has been expanding his passing-game role all camp
Cam Ward	+	Daboll called plays through Josh Allen's developmental leap in Buffalo
Bucky Irving	+	Zac Robinson's scheme made Bijan Robinson a receiving workhorse; similar profile
De'Von Achane	-	The McDaniel system that maximized his speed-in-space usage left for the Chargers
Kyle Pitts Sr.	-	His 2025 breakout came under Zac Robinson, who left for Tampa Bay`;
