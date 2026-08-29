// Default position tiers preloaded on first install (replaceable in the
// panel's Tier import box). Bump DEFAULT_TIERS_VERSION when this changes so
// installs that never loaded custom tiers pick up the new defaults.
const DEFAULT_TIERS_VERSION = 3;
const DEFAULT_TIERS_TEXT = `Tier 1: The Superstars
Brock Bowers, LV
Trey McBride, ARI
Tier 2: Rising Stars
Colston Loveland, CHI
Tyler Warren, IND
Tucker Kraft, GB
Tier 3: Established Weekly Starters
Sam LaPorta, DET
Harold Fannin Jr., CLE
Kyle Pitts Sr., ATL
George Kittle, SF
Travis Kelce, KC
Tier 4: Late-Round Options
Isaiah Likely, NYG
Dalton Kincaid, BUF
Dallas Goedert, PHI
Jake Ferguson, DAL
Mark Andrews, BAL
Chig Okonkwo, WAS
Juwan Johnson, NO
Tier 5: Streamers
Brenton Strange, JAC
Hunter Henry, NE
Oronde Gadsden, LAC
Kenyon Sadiq, NYJ
T.J. Hockenson, MIN
Dalton Schultz, HOU
Greg Dulcich, MIA
AJ Barner, SEA
Tier 6: Deep-League Streamers
Terrance Ferguson, LAR
Gunnar Helm, TEN
Cade Otton, TB
Pat Freiermuth, PIT
Eli Stowers, PHI
Mike Gesicki, CIN
Colby Parkinson, LAR
Evan Engram, DEN
Tier 7: Deep Bench Depth
David Njoku, LAC
Jake Tonges, SF
Michael Mayer, LV

Tier 1: The Alpha WR1s
Ja'Marr Chase, CIN
Puka Nacua, LAR
Jaxon Smith-Njigba, SEA
Amon-Ra St. Brown, DET
Tier 2: High-Volume WR1s
Justin Jefferson, MIN
CeeDee Lamb, DAL
Nico Collins, HOU
A.J. Brown, NE
Tier 3: Borderline WR1s
Malik Nabers, NYG
Drake London, ATL
George Pickens, DAL
DeVonta Smith, PHI
Rashee Rice, KC
Tier 4: High-Ceiling WR2s
Chris Olave, NO
Zay Flowers, BAL
Tee Higgins, CIN
Emeka Egbuka, TB
Jaylen Waddle, DEN
Ladd McConkey, LAC
Garrett Wilson, NYJ
Tetairoa McMillan, CAR
Luther Burden III, CHI
Tier 5: Solid WR2/3s With Some Risk
Jameson Williams, DET
Terry McLaurin, WAS
Mike Evans, SF
Davante Adams, LAR
Rome Odunze, CHI
DJ Moore, BUF
Tier 6: Boom-or-Bust WR3s
Christian Watson, GB
Parker Washington, JAC
Carnell Tate, TEN
Marvin Harrison Jr., ARI
Brian Thomas Jr., JAC
DK Metcalf, PIT
Quentin Johnston, LAC
Josh Downs, IND
Makai Lemon, PHI
Tier 7: Fringe WR3s
Courtland Sutton, DEN
Stefon Diggs, WAS
Alec Pierce, IND
Chris Godwin Jr., TB
Jordan Addison, MIN
Michael Pittman Jr., PIT
Michael Wilson, ARI
Wan'Dale Robinson, TEN
Tier 8: Deep-League WR4s
Matthew Golden, GB
Jakobi Meyers, JAC
Jayden Reed, GB
De'Zhaun Stribling, SF
Jordyn Tyson, NO
KC Concepcion, CLE
Xavier Worthy, KC
Tier 9: Bench Options
Jalen Coker, CAR
Romeo Doubs, NE
Khalil Shakir, BUF
Deebo Samuel Sr., SF
Denzel Boston, CLE
Rashid Shaheed, SEA
Jalen Nailor, LV
Tier 10: Deep Fliers
Jalen McMillan, TB
Jaylin Noel, HOU
Tre' Harris, LAC
Adonai Mitchell, NYJ
Travis Hunter, JAC
Tre Tucker, LV
Tank Dell, HOU
Dontayvion Wicks, PHI
Ryan Flournoy, DAL
Pat Bryant, DEN
Tier 11: Waiver Wire Depth and Names to Monitor
Keenan Allen, IND
Jerry Jeudy, CLE
Ja'Kobi Lane, BAL
Caleb Douglas, MIA
Jauan Jennings, MIN
Cyrus Allen, KC
Darnell Mooney, NYG
Zachariah Branch, ATL
Malik Washington, MIA
Isaac TeSlaa, DET
Antonio Williams, WAS
Kayshon Boutte, NE
Malachi Fields, NYG
Omar Cooper Jr., NYJ
Rashod Bateman, BAL
Ted Hurst III, TB
Calvin Ridley, TEN

Tier 1: The Unicorns
Jahmyr Gibbs, DET
Bijan Robinson, ATL
Tier 2: Top-Shelf RB1s
Christian McCaffrey, SF
Jonathan Taylor, IND
Tier 3: Bell Cows
Ashton Jeanty, LV
James Cook III, BUF
Omarion Hampton, LAC
Saquon Barkley, PHI
Kenneth Walker III, KC
Tier 4: High Ceiling, Slight Risk
Chase Brown, CIN
De'Von Achane, MIA
Derrick Henry, BAL
Jeremiyah Love, ARI
Kyren Williams, LAR
Tier 5: Solid RB2 Volume Plays
Breece Hall, NYJ
Josh Jacobs, GB
Javonte Williams, DAL
Cam Skattebo, NYG
Travis Etienne Jr., NO
Tier 6: Committee Backs With Upside
Quinshon Judkins, CLE
Bucky Irving, TB
Bhayshul Tuten, JAC
TreVeyon Henderson, NE
Jadarian Price, SEA
D'Andre Swift, CHI
David Montgomery, HOU
Tier 7: Early-Down Runners and Passing-Down Specialists
Jaylen Warren, PIT
Tony Pollard, TEN
Rhamondre Stevenson, NE
Chuba Hubbard, CAR
Rico Dowdle, PIT
Blake Corum, LAR
Jonathon Brooks, CAR
RJ Harvey, DEN
Kyle Monangai, CHI
Kenny Gainwell, TB
Tier 8: Bench Depth and Handcuffs
Jacory Croskey-Merritt, WAS
Rachaad White, WAS
J.K. Dobbins, DEN
Jordan Mason, MIN
Aaron Jones Sr., MIN
Keaton Mitchell, LAC
Chris Rodriguez Jr., JAC
Tyrone Tracy Jr., NYG
Zach Charbonnet, SEA
Woody Marks, HOU
Jonah Coleman, DEN
Tier 9: Deep-League Fliers
Tyler Allgeier, ARI
Tank Bigsby, PHI
Isiah Pacheco, DET
Alvin Kamara, NO
Tyjae Spears, TEN
Dylan Sampson, CLE
Brian Robinson, ATL
MarShawn Lloyd, GB
Ray Davis, BUF
Nicholas Singleton, TEN
Emmett Johnson, KC
Mike Washington Jr., LV
Jaydon Blue, DAL
Tier 10: Backs to Monitor
Braelon Allen, NYJ
Kaytron Allen, WAS
Kimani Vidal, LAC
Kaelon Black, SF
Demond Claiborne, MIN
Sean Tucker, TB
George Holani, SEA
James Conner, ARI
Ollie Gordon II, MIA
Emanuel Wilson, SEA
Justice Hill, BAL

Tier 1: Superman
Josh Allen, BUF
Tier 2: Upside at the Top
Lamar Jackson, BAL
Drake Maye, NE
Tier 3: High-Floor Weekly Starters
Jayden Daniels, WAS
Joe Burrow, CIN
Jalen Hurts, PHI
Caleb Williams, CHI
Justin Herbert, LAC
Trevor Lawrence, JAC
Dak Prescott, DAL
Tier 4: QB1 Upside Without QB1 Price Tags
Brock Purdy, SF
Patrick Mahomes, KC
Bo Nix, DEN
Tier 5: QB2s With Late-Round Value
Matthew Stafford, LAR
Jared Goff, DET
Kyler Murray, MIN
Jaxson Dart, NYG
Tyler Shough, NO
Tier 6: Streamers and Breakout Candidates
Baker Mayfield, TB
Jordan Love, GB
Daniel Jones, IND
Malik Willis, MIA
Tier 7: Matchup-Based Streamers
C.J. Stroud, HOU
Sam Darnold, SEA
Cam Ward, TEN
Bryce Young, CAR
Tier 8: Bridge Options and Mendoza
Fernando Mendoza, LV
Jacoby Brissett, ARI
Aaron Rodgers, PIT
Geno Smith, NYJ
Tier 9: Superflex Stashes
Tua Tagovailoa, ATL
Deshaun Watson, CLE
Shedeur Sanders, CLE
Michael Penix Jr., ATL
Kirk Cousins, LV
Carson Beck, ARI
J.J. McCarthy, MIN
Justin Fields, KC
Mac Jones, SF`;
