// Default rankings preloaded on first install (editable in the panel).
// Bump DEFAULT_RANKINGS_VERSION when this list changes so existing installs
// that never customized their list pick up the new defaults.
const DEFAULT_RANKINGS_VERSION = 3;
const DEFAULT_RANKINGS_TEXT = `Jahmyr Gibbs	DET	RB
Bijan Robinson	ATL	RB
Ja'Marr Chase	CIN	WR
Christian McCaffrey	SF	RB
Puka Nacua	LAR	WR
Jonathan Taylor	IND	RB
Jaxon Smith-Njigba	SEA	WR
Amon-Ra St. Brown	DET	WR
James Cook III	BUF	RB
Justin Jefferson	MIN	WR
Saquon Barkley	PHI	RB
Ashton Jeanty	LV	RB
Kenneth Walker III	KC	RB
CeeDee Lamb	DAL	WR
Omarion Hampton	LAC	RB
Nico Collins	HOU	WR
Chase Brown	CIN	RB
De'Von Achane	MIA	RB
A.J. Brown	NE	WR
Derrick Henry	BAL	RB
Malik Nabers	NYG	WR
Brock Bowers	LV	TE
Jeremiyah Love	ARZ	RB
Drake London	ATL	WR
Trey McBride	ARZ	TE
Kyren Williams	LAR	RB
DeVonta Smith	PHI	WR
Breece Hall	NYJ	RB
Chris Olave	NO	WR
George Pickens	DAL	WR
Javonte Williams	DAL	RB
Rashee Rice	KC	WR
Josh Allen	BUF	QB
Zay Flowers	BAL	WR
Jaylen Waddle	DEN	WR
Travis Etienne Jr.	NO	RB
Emeka Egbuka	TB	WR
Cam Skattebo	NYG	RB
Tee Higgins	CIN	WR
Ladd McConkey	LAC	WR
Bucky Irving	TB	RB
Garrett Wilson	NYJ	WR
Jadarian Price	SEA	RB
Tetairoa McMillan	CAR	WR
Quinshon Judkins	CLE	RB
Davante Adams	LAR	WR
TreVeyon Henderson	NE	RB
Jameson Williams	DET	WR
Josh Jacobs	GB	RB
Luther Burden III	CHI	WR
Colston Loveland	CHI	TE
Bhayshul Tuten	JAX	RB
Terry McLaurin	WAS	WR
D'Andre Swift	CHI	RB
David Montgomery	HOU	RB
Tyler Warren	IND	TE
Parker Washington	JAX	WR
Lamar Jackson	BAL	QB
DJ Moore	BUF	WR
Jaylen Warren	PIT	RB
Christian Watson	GB	WR
Rhamondre Stevenson	NE	RB
Rome Odunze	CHI	WR
Jonathon Brooks	CAR	RB
Mike Evans	SF	WR
Rico Dowdle	PIT	RB
DK Metcalf	PIT	WR
Harold Fannin Jr.	CLE	TE
Tony Pollard	TEN	RB
Drake Maye	NE	QB
Jordan Mason	MIN	RB
Marvin Harrison Jr.	ARZ	WR
Joe Burrow	CIN	QB
Blake Corum	LAR	RB
Carnell Tate	TEN	WR
RJ Harvey	DEN	RB
Brian Thomas Jr.	JAX	WR
Kyle Monangai	CHI	RB
Tucker Kraft	GB	TE
Stefon Diggs	WAS	WR
Jayden Daniels	WAS	QB
Jacory Croskey-Merritt	WAS	RB
Quentin Johnston	LAC	WR
Kyle Pitts Sr.	ATL	TE
Courtland Sutton	DEN	WR
Jalen Hurts	PHI	QB
Josh Downs	IND	WR
Chuba Hubbard	CAR	RB
Sam LaPorta	DET	TE
J.K. Dobbins	DEN	RB
Makai Lemon	PHI	WR
Kenny Gainwell	TB	RB
Caleb Williams	CHI	QB
De'Zhaun Stribling	SF	WR
Rachaad White	WAS	RB
Alec Pierce	IND	WR
George Kittle	SF	TE
Aaron Jones Sr.	MIN	RB
Trevor Lawrence	JAX	QB
Jordan Addison	MIN	WR
Michael Pittman Jr.	PIT	WR
Wan'Dale Robinson	TEN	WR
Justin Herbert	LAC	QB
Woody Marks	HOU	RB
Chris Godwin Jr.	TB	WR
Michael Wilson	ARZ	WR
Jonah Coleman	DEN	RB
Travis Kelce	KC	TE
Mike Washington Jr.	LV	RB
Matthew Golden	GB	WR
Chris Rodriguez Jr.	JAX	RB
Dak Prescott	DAL	QB
KC Concepcion	CLE	WR
Keaton Mitchell	LAC	RB
MarShawn Lloyd	GB	RB
Jayden Reed	GB	WR
Romeo Doubs	NE	WR
Jakobi Meyers	JAX	WR
Patrick Mahomes	KC	QB
Isaiah Likely	NYG	TE
Xavier Worthy	KC	WR
Tyler Allgeier	ARZ	RB
Jordyn Tyson	NO	WR
Brock Purdy	SF	QB
Tyjae Spears	TEN	RB
Seahawks	SEA	DST
Jalen Coker	CAR	WR
Dallas Goedert	PHI	TE
Brandon Aubrey	DAL	K
Dalton Kincaid	BUF	TE
Bo Nix	DEN	QB
Zach Charbonnet	SEA	RB
Khalil Shakir	BUF	WR
Texans	HST	DST
Rams	LA	DST
Emmett Johnson	KC	RB
Jake Ferguson	DAL	TE
Jared Goff	DET	QB
Tank Bigsby	PHI	RB
Deebo Samuel Sr.	SF	WR
Broncos	DEN	DST
Brian Robinson	ATL	RB
Mark Andrews	BAL	TE
Matthew Stafford	LAR	QB
Rashid Shaheed	SEA	WR
Dylan Sampson	CLE	RB
Denzel Boston	CLE	WR
Tre Tucker	LV	WR
Jaxson Dart	NYG	QB
Keenan Allen	IND	WR
Hunter Henry	NE	TE
Jalen McMillan	TB	WR
Adonai Mitchell	NYJ	WR
Eagles	PHI	DST
Nicholas Singleton	TEN	RB
Cameron Dicker	LAC	K
Dontayvion Wicks	PHI	WR
Kyler Murray	MIN	QB
Braelon Allen	NYJ	RB
Tyler Shough	NO	QB
Juwan Johnson	NO	TE
Tre' Harris	LAC	WR
Steelers	PIT	DST
Isiah Pacheco	DET	RB
Ka'imi Fairbairn	HOU	K
Ja'Kobi Lane	BAL	WR
Cam Little	JAX	K
Jordan Love	GB	QB
Jalen Nailor	LV	WR
Chargers	LAC	DST
Alvin Kamara	NO	RB
Jason Myers	SEA	K
Kayshon Boutte	HOU	WR
Dalton Schultz	HOU	TE
Malachi Fields	NYG	WR
Pat Bryant	DEN	WR
Chase McLaughlin	TB	K
Ray Davis	BUF	RB
Chig Okonkwo	WAS	TE
Eddy Pineiro	SF	K
Malik Willis	MIA	QB
Ryan Flournoy	DAL	WR
Cyrus Allen	KC	WR
Harrison Mevis	LAR	K
Tyrone Tracy Jr.	NYG	RB
Jaguars	JAX	DST
Brenton Strange	JAX	TE
Omar Cooper Jr.	NYJ	WR
Caleb Douglas	MIA	WR
Jerry Jeudy	CLE	WR
Chris Boswell	PIT	K
Vikings	MIN	DST
Jauan Jennings	MIN	WR
Ravens	BLT	DST
Baker Mayfield	TB	QB
Kaytron Allen	WAS	RB
Will Reichard	MIN	K
Terrance Ferguson	LAR	TE
Jaylin Noel	HOU	WR
Kenyon Sadiq	NYJ	TE
Kaelon Black	SF	RB
Patriots	NE	DST
Lions	DET	DST
Malik Washington	MIA	WR
Jaydon Blue	DAL	RB
Daniel Jones	IND	QB
Zachariah Branch	ATL	WR
T.J. Hockenson	MIN	TE
Sam Darnold	SEA	QB
Tyler Loop	BAL	K
AJ Barner	SEA	TE
Bills	BUF	DST
Kimani Vidal	LAC	RB
Travis Hunter	JAX	WR
Greg Dulcich	MIA	TE
Calvin Ridley	TEN	WR
Packers	GB	DST
Chiefs	KC	DST
Jake Bates	DET	K
Najee Harris	NYG	RB
David Njoku	LAC	TE
Antonio Williams	WAS	WR
Cairo Santos	CHI	K
Demond Claiborne	MIN	RB
Cade Otton	TB	TE
Evan McPherson	CIN	K
Sean Tucker	TB	RB
C.J. Stroud	HOU	QB
Colts	IND	DST
Andy Borregales	NE	K
Cam Ward	TEN	QB
Pat Freiermuth	PIT	TE
Devaughn Vele	NO	WR
Harrison Butker	KC	K
Jaylen Wright	MIA	RB
James Conner	ARZ	RB
Isaac TeSlaa	DET	WR
Wil Lutz	DEN	K
Samaje Perine	CIN	RB
Darren Waller	CAR	TE
Justice Hill	BAL	RB
Rashod Bateman	BAL	WR
George Holani	SEA	RB
Cooper Kupp	SEA	WR
Bryce Young	CAR	QB
Malik Davis	DAL	RB
Falcons	ATL	DST
Gunnar Helm	TEN	TE
Bears	CHI	DST
Darnell Mooney	NYG	WR
Seth McGowan	IND	RB
Colby Parkinson	LAR	TE
Browns	CLE	DST
Emanuel Wilson	SEA	RB
Germie Bernard	PIT	WR
Adam Randall	BAL	RB
Saints	NO	DST
Tank Dell	HOU	WR
Jordan James	SF	RB
Chris Brooks	GB	RB
Chris Bell	MIA	WR
Cowboys	DAL	DST
Jarquez Hunter	MIA	RB
Fernando Mendoza	LV	QB
Jack Bech	LV	WR
Ollie Gordon II	MIA	RB
Keon Coleman	BUF	WR
Xavier Legette	CAR	WR
Jahan Dotson	ATL	WR
Charlie Kolar	LAC	TE
Kendre Miller	NO	RB
Buccaneers	TB	DST
Bryce Lance	NO	WR
Isaiah Davis	NYJ	RB
Elijah Sarratt	BAL	WR
Kyle Williams	NE	WR
LeQuint Allen Jr.	JAX	RB
Malik Benson	LV	WR
Evan Engram	DEN	TE
Tyler Bass	BUF	K
DJ Giddens	IND	RB
Troy Franklin	DEN	WR
Ty Johnson	BUF	RB
Tahj Brooks	CIN	RB
Mike Gesicki	CIN	TE
Tyquan Thornton	KC	WR
Darius Slayton	NYG	WR
Trevor Etienne	CAR	RB
Aaron Rodgers	PIT	QB
Brashard Smith	KC	RB
Bengals	CIN	DST
Michael Mayer	LV	TE
Emari Demercado	KC	RB
Tory Horton	SEA	WR
Will Shipley	PHI	RB
Devin Singletary	NYG	RB
Andrei Iosivas	CIN	WR
49ers	SF	DST
Elijah Arroyo	SEA	TE
Elic Ayomanor	TEN	WR
Jake Elliott	PHI	K
Brenen Thompson	LAC	WR
Blake Grupe	IND	K
DeMario Douglas	NE	WR
Giants	NYG	DST
J'Mari Taylor	JAX	RB
Oronde Gadsden	LAC	TE
Christian Kirk	SF	WR
Jaleel McLaughlin	DEN	RB
Eli Stowers	PHI	TE
Skyler Bell	BUF	WR
Jam Miller	NE	RB
Panthers	CAR	DST
Kaleb Johnson	PIT	RB
Chimere Dike	TEN	WR
Mason Taylor	NYJ	TE
Joey Slye	TEN	K
Raheim Sanders	CLE	RB
Isaac Guerendo	SF	RB
Commanders	WAS	DST
Xavier Hutchinson	HOU	WR
Jake Tonges	SF	TE
Colbie Young	CIN	WR
Nick Folk	ATL	K
Sione Vaki	DET	RB
Hollywood Brown	PHI	WR
Theo Johnson	NYG	TE
Titans	TEN	DST
Jacoby Brissett	ARZ	QB
Marvin Mims Jr.	DEN	WR
Jawhar Jordan	HOU	RB
Eli Raridon	NE	TE
Jalen Tolbert	MIA	WR
Chad Ryland	ARZ	K
Eli Heidenreich	PIT	RB
Joshua Palmer	BUF	WR
Darnell Washington	PIT	TE
Kendrick Bourne	ARZ	WR
Matt Gay	LV	K
Roman Wilson	PIT	WR
Cole Kmet	CHI	TE
Dawson Knox	BUF	TE
KaVontae Turpin	DAL	WR
Ryan Fitzgerald	CAR	K
Oscar Delp	NO	TE
Zavion Thomas	CHI	WR
Dolphins	MIA	DST
Devin Neal	NO	RB
Geno Smith	NYJ	QB
Isaiah Bond	CLE	WR
Savion Williams	GB	WR
Jason Sanders	NYJ	K
Jahdae Walker	CHI	WR
Noah Gray	KC	TE
Trey Benson	ARZ	RB
CJ Daniels	LA	WR
Tutu Atwell	LAR	WR
Dylan Laube	LV	RB`;
