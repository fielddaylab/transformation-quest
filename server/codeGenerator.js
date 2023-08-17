/*
const _NOUN_ = [
];
*/

/**
 * The list of plural nouns.
 * @const
 */
const _PLURALNOUN_ = [
    'Acts', 'Actors', 'Airs',
    'Alarms', 'Angers', 'Angles', 'Ants',
    'Apples', 'Archs', 'Arms', 'Armies',
    'Arts', 'Aunts', 'Babies', 'Backs',
    'Badges', 'Bags', 'Baits', 'Balls',
    'Balls', 'Bands', 'Bases', 'Basins',
    'Bats', 'Baths', 'Beads', 'Beams',
    'Beans', 'Bears', 'Beasts', 'Beds',
    'Bees', 'Beef', 'Bells', 'Berries',
    'Bikes', 'Birds', 'Bits', 'Bites',
    'Blades', 'Blows', 'Boards', 'Boats',
    'Bodies', 'Bombs', 'Bones', 'Books',
    'Boots', 'Boxs', 'Boys', 'Brains',
    'Brakes', 'Brass', 'Breads', 'Bricks',
    'Brushes', 'Bulbs', 'Buns', 'Burns',
    'Bursts', 'Cables', 'Cakes', 'Camps',
    'Cans', 'Caps', 'Cars', 'Cards',
    'Cares', 'Cars', 'Carts', 'Casts',
    'Cats', 'Causes', 'Caves', 'Cents',
    'Chains', 'Chairs', 'Chalks', 'Chins',
    'Clams', 'Clocks', 'Cloths', 'Clouds',
    'Clubs', 'Coaches', 'Coals', 'Coasts',
    'Coats', 'Coils', 'Colors', 'Combs',
    'Cooks', 'Cords', 'Corks', 'Corns',
    'Coughs', 'Covers', 'Cows', 'Cracks',
    'Crates', 'Creams', 'Cribs', 'Crimes',
    'Crooks', 'Crows', 'Crowds', 'Crowns',
    'Crushs', 'Cries', 'Cubs', 'Cups',
    'Curves', 'Days', 'Debts', 'Deer',
    'Desks', 'Dimes', 'Dirts', 'Docks',
    'Dogs', 'Dolls', 'Doors', 'Drains',
    'Drinks', 'Drums', 'Ducks', 'Dust',
    'Ears', 'Edges', 'Eggs', 'Elbows',
    'Ends', 'Errors', 'Events', 'Eyes',
    'Faces', 'Facts', 'Falls', 'Fans',
    'Fangs', 'Farms', 'Fears', 'Feasts',
    'Feets', 'Fields', 'Fires', 'Fishs',
    'Flags', 'Flames', 'Fleshs', 'Flocks',
    'Floors', 'Flies', 'Fogs', 'Foods',
    'Foots', 'Forks', 'Forms', 'Fowls',
    'Frames', 'Frogs', 'Fronts', 'Fruits',
    'Fuels', 'Games', 'Gates', 'Geese',
    'Ghosts', 'Girls', 'Gloves', 'Glues',
    'Goats', 'Gold', 'Grades', 'Grains',
    'Grapes', 'Grips', 'Groups', 'Guides',
    'Guns', 'Hairs', 'Halls', 'Hands',
    'Hats', 'Heads', 'Hearts', 'Helps',
    'Hens', 'Hills', 'Holes', 'Homes',
    'Hooks', 'Hopes', 'Horns', 'Horses',
    'Hoses', 'Hours', 'Houses', 'Humor',
    'Ice', 'Ideas', 'Inks', 'Irons',
    'Jails', 'Jams', 'Jars', 'Jewels',
    'Jokes', 'Judges', 'Juice', 'Jumps',
    'Kicks', 'Kites', 'Kittens', 'Knees',
    'Knives', 'Knots', 'Laces', 'Lakes',
    'Lamps', 'Lands', 'Leads', 'Leafs',
    'Legs', 'Levels', 'Lifts',
    'Lights', 'Limits', 'Lines', 'Linens',
    'Lips', 'Lists', 'Loafs', 'Locks',
    'Looks', 'Lunches', 'Magic', 'Maids',
    'Maps', 'Marks', 'Masks', 'Masses',
    'Matchs', 'Meals', 'Meats', 'Metals',
    'Mice', 'Milks', 'Minds', 'Mines',
    'Mints', 'Mists', 'Money', 'Months',
    'Moons', 'Mouths', 'Moves', 'Musics',
    'Nails', 'Names', 'Necks', 'Needs',
    'Nerves', 'Nests', 'Nets', 'News',
    'Nights', 'Noises', 'Norths', 'Noses',
    'Notes', 'Nuts', 'Oceans', 'Offers',
    'Oils', 'Orders', 'Ovens', 'Owls',
    'Owners', 'Pages', 'Pails', 'Pains',
    'Pans', 'Paper', 'Parks', 'Parts',
    'Patches', 'Pears', 'Pens', 'Pests',
    'Pets', 'Pies', 'Pigs', 'Pins',
    'Pipes', 'Places', 'Planes', 'Plants',
    'Plates', 'Pots', 'Powers', 'Prints',
    'Pumps', 'Queens', 'Quiets', 'Quills',
    'Quilts', 'Rails', 'Rains', 'Rakes',
    'Rats', 'Rates', 'Rays', 'Rests',
    'Rices', 'Rings', 'Rivers', 'Roads',
    'Robins', 'Rocks', 'Rods', 'Rolls',
    'Roofs', 'Rooms', 'Roots', 'Roses',
    'Routes', 'Rules', 'Sacks', 'Sails',
    'Sands', 'Scales', 'Scarfs', 'Scents',
    'Seas', 'Seats', 'Seeds', 'Selfs',
    'Senses', 'Shades', 'Shapes', 'Sheep',
    'Sheets', 'Ships', 'Shirts', 'Shoes',
    'Shops', 'Shows', 'Signs', 'Sinks',
    'Skates', 'Skirts', 'Skies', 'Sleeps',
    'Slopes', 'Smashs', 'Smells', 'Smiles',
    'Snails', 'Snakes', 'Snows', 'Soaps',
    'Socks', 'Sodas', 'Sofas', 'Sons',
    'Songs', 'Sounds', 'Soups', 'Spaces',
    'Spades', 'Sparks', 'Spoons', 'Spots',
    'Spies', 'Stages', 'Stamps', 'Stars',
    'Starts', 'Steam', 'Steel', 'Stems',
    'Steps', 'Stews', 'Sticks', 'Stones',
    'Stops', 'Stores', 'Stoves', 'Straws',
    'Sugar', 'Suits', 'Swings', 'Tables',
    'Tails', 'Talks', 'Tanks', 'Teams',
    'Teeth', 'Tents', 'Tests', 'Things',
    'Thumbs', 'Tigers', 'Times', 'Tins',
    'Titles', 'Toads', 'Toes', 'Tops',
    'Touches', 'Towns', 'Toys', 'Trails',
    'Trains', 'Tramps', 'Trays', 'Trees',
    'Trips', 'Trucks', 'Tubs', 'Turns',
    'Twigs', 'Twists', 'Uncles', 'Units',
    'Values', 'Vans', 'Vases', 'Veils',
    'Vests', 'Views', 'Voices', 'Walls',
    'Waste', 'Water', 'Waves', 'Ways',
    'Weeks', 'Wheels', 'Whips', 'Winds',
    'Wings', 'Wires', 'Wishs', 'Wool',
    'Words', 'Works', 'Worms', 'Wrens',
    'Wrists', 'Yaks', 'Yams', 'Yarns'
    ];

/*
const _PLACE_ = [
    'Pub', 'University', 'Airport', 'Library', 'Mall', 'Theater', 'Stadium',
    'Office', 'Show', 'Gallows', 'Beach', 'Cemetery', 'Hospital', 'Reception',
    'Restaurant', 'Bar', 'Church', 'House', 'School', 'Square', 'Village',
    'Cinema', 'Movies', 'Party', 'Restroom', 'End', 'Jail', 'PostOffice',
    'Station', 'Circus', 'Gates', 'Entrance', 'Bridge'
];
*/

/**
 * The list of verbs.
 * @const
 */
const _VERB_ = [
    'Ache', 'Act', 'Add',
    'Aid', 'Aim', 'Air',
    'Arc', 'Arch', 'Ask', 'Aver',
    'Avow', 'Bait', 'Bake', 'Ball',
    'Bang', 'Bare', 'Bark', 'Bash',
    'Bask', 'Bat', 'Bawl', 'Bay',
    'Beam', 'Bear', 'Beat', 'Beg',
    'Bend', 'Bet', 'Bid', 'Bind',
    'Bite', 'Blat', 'Blot', 'Blow',
    'Bob', 'Bolt', 'Bond', 'Bonk',
    'Boo', 'Boom', 'Bop', 'Bore',
    'Boss', 'Bow', 'Box', 'Brag',
    'Bray', 'Buck', 'Buff', 'Bug',
    'Bump', 'Burn', 'Burp', 'Bury',
    'Bus', 'Bust', 'Buy', 'Buzz',
    'Call', 'Calm', 'Care', 'Cash',
    'Cast', 'Caw', 'Chat', 'Chew',
    'Chip', 'Chop', 'Cite', 'Clap',
    'Claw', 'Clip', 'Clop', 'Club',
    'Coax', 'Cock', 'Coil', 'Comb',
    'Cont', 'Coo', 'Cook', 'Cool',
    'Cope', 'Copy', 'Cram', 'Crop',
    'Crow', 'Cry', 'Cue', 'Cuff',
    'Cup', 'Curb', 'Cure', 'Curl',
    'Cuss', 'Cut', 'Dab', 'Dare',
    'Dart', 'Dash', 'Deal', 'Deem',
    'Defy', 'Deny', 'Die', 'Dig',
    'Dim', 'Dine', 'Dip', 'Dive',
    'Doff', 'Dote', 'Doze', 'Drag',
    'Draw', 'Drip', 'Drop', 'Drum',
    'Dry', 'Dub', 'Duck', 'Duel',
    'Dump', 'Dunk', 'Dust', 'Dye',
    'Ease', 'East', 'Eat', 'Echo',
    'Edge', 'End', 'Envy', 'Espy',
    'Etch', 'Eye', 'Face', 'Fail',
    'Fake', 'Fall', 'Fan', 'Fawn',
    'Fear', 'Feed', 'Feel', 'Fend',
    'Fib', 'File', 'Fill', 'Find',
    'Fish', 'Fit', 'Fix', 'Flap',
    'Flee', 'Flex', 'Flip', 'Flit',
    'Flop', 'Flow', 'Flub', 'Fly',
    'Foam', 'Fold', 'Form', 'Free',
    'Fret', 'Fry', 'Fume', 'Furl',
    'Fuss', 'Gag', 'Gape', 'Gash',
    'Gasp', 'Gawk', 'Gaze', 'Get',
    'Give', 'Glow', 'Gnaw', 'Go',
    'Goad', 'Grab', 'Grin', 'Grip',
    'Grit', 'Grow', 'Gulp', 'Gush',
    'Hack', 'Hail', 'Halt', 'Hand',
    'Hang', 'Hark', 'Harm', 'Hate',
    'Haul', 'Head', 'Heal', 'Hear',
    'Heat', 'Heed', 'Heft', 'Help',
    'Hem', 'Hew', 'Hide', 'Hike',
    'Hint', 'Hiss', 'Hit', 'Hog',
    'Hold', 'Hone', 'Honk', 'Hook',
    'Hoot', 'Hop', 'Hope', 'Howl',
    'Huff', 'Hug', 'Hum', 'Hunt',
    'Hurl', 'Hurt', 'Hush', 'Idea',
    'Inch', 'Ink', 'Jab', 'Jam',
    'Jeer', 'Jerk', 'Jest', 'Jibe',
    'Jog', 'Join', 'Joke', 'Jolt',
    'Jump', 'Jut', 'Keen', 'Keep',
    'Kick', 'Kid', 'Kiss',
    'Knee', 'Knit', 'Knot', 'Know',
    'Lace', 'Land', 'Lap', 'Lash',
    'Laud', 'Lay', 'Lead', 'Leaf',
    'Lean', 'Leap', 'Leer', 'Lend',
    'Let', 'Lick', 'Lie', 'Lift',
    'Like', 'Lilt', 'Limp', 'Lisp',
    'List', 'Live', 'Load', 'Loaf',
    'Lob', 'Lock', 'Log', 'Loll',
    'Long', 'Look', 'Loom', 'Loop',
    'Lope', 'Lose', 'Love', 'Lug',
    'Lull', 'Lure', 'Lurk', 'Make',
    'Man', 'Map', 'Mark', 'Mash',
    'Mask', 'Mate', 'Maul', 'Mean',
    'Meep', 'Meet', 'Melt', 'Mend',
    'Meow', 'Mesh', 'Mew', 'Mewl',
    'Milk', 'Mime', 'Mind', 'Mine',
    'Miss', 'Mix', 'Moan', 'Mock',
    'Mold', 'Moo', 'Moor', 'Mope',
    'More', 'Move', 'Mow', 'Mug',
    'Mull', 'Muse', 'Muss', 'Nag',
    'Nail', 'Name', 'Nap', 'Need',
    'Nest', 'Nick', 'Nip', 'Nod',
    'Note', 'Obey', 'Ogle', 'Ooc',
    'Ooze', 'Open', 'Opt', 'Owe',
    'Own', 'Pace', 'Pack', 'Pad',
    'Pale', 'Palm', 'Pant', 'Park',
    'Part', 'Pass', 'Pat', 'Paw',
    'Pay', 'Peck', 'Peek', 'Peel',
    'Peep', 'Peer', 'Pelt', 'Perk',
    'Pet', 'Pick', 'Pile', 'Pin',
    'Pine', 'Pipe', 'Pity', 'Plan',
    'Play', 'Plod', 'Plop', 'Plot',
    'Plow', 'Plug', 'Poke', 'Pop',
    'Pore', 'Pose', 'Post', 'Pour',
    'Pout', 'Pray', 'Prod', 'Prop',
    'Pry', 'Puff', 'Pull', 'Pump',
    'Purr', 'Push', 'Put', 'Quip',
    'Quit', 'Quiz', 'Race', 'Rage',
    'Rain', 'Rake', 'Ram', 'Rank',
    'Rant', 'Rap', 'Rasp', 'Rate',
    'Rave', 'Read', 'Reel', 'Rely',
    'Rend', 'Rest', 'Rid', 'Ride',
    'Ring', 'Rip', 'Rise', 'Risk',
    'Roam', 'Roar', 'Rob', 'Rock',
    'Roll', 'Romp', 'Rot', 'Rub',
    'Ruin', 'Rule', 'Run', 'Rush',
    'Sack', 'Sail', 'Save', 'Saw',
    'Say', 'Scan', 'Seal', 'Seam',
    'See', 'Seek', 'Seem', 'Seep',
    'Sell', 'Set', 'Sew', 'Shed',
    'Shoo', 'Shop', 'Show', 'Shut',
    'Sift', 'Sigh', 'Sign', 'Sin',
    'Sing', 'Sink', 'Sip', 'Sit',
    'Size', 'Ski', 'Skid', 'Skim',
    'Skip', 'Slam', 'Slap', 'Slay',
    'Slip', 'Slit', 'Slow', 'Slur',
    'Snap', 'Snip', 'Snow', 'Snub',
    'Soak', 'Sob', 'Sort', 'Sow',
    'Span', 'Spin', 'Spit', 'Spot',
    'Spur', 'Spy', 'Stab', 'Stay',
    'Step', 'Stir', 'Stop', 'Stow',
    'Suck', 'Suit', 'Sulk', 'Swab',
    'Swat', 'Sway', 'Swim', 'Take',
    'Talk', 'Tame', 'Tap', 'Task',
    'Tear', 'Tell', 'Tend', 'Test',
    'Thaw', 'Tick', 'Tidy', 'Tie',
    'Tilt', 'Time', 'Tip', 'Tire',
    'Tisk', 'Toe', 'Toil', 'Toot',
    'Toss', 'Tote', 'Tour', 'Tow',
    'Toy', 'Trap', 'Tred', 'Trim',
    'Trip', 'Trot', 'Try', 'Tuck',
    'Tug', 'Tune', 'Turn', 'Type',
    'Undo', 'Urge', 'Use', 'Veer',
    'Vent', 'Vex', 'View', 'Vote',
    'Vow', 'Wade', 'Waft', 'Wag',
    'Wail', 'Wait', 'Wake', 'Walk',
    'Want', 'Warm', 'Warn', 'Warp',
    'Wash', 'Wave', 'Wear', 'Wed',
    'Weep', 'Wend', 'Wet', 'Whet',
    'Whip', 'Who', 'Wilt', 'Win',
    'Wind', 'Wink', 'Wipe', 'Wish',
    'Woo', 'Work', 'Wrap', 'Yank',
    'Yap', 'Yawn', 'Yawp', 'Yell',
    'Yelp', 'Yowl', 'Zip', 'Zoom'
    ];

/**
 * The list of adverbs.
 * @const
 */
const _ADVERB_ = [
    'Acidly', 'Actually', 'Almost',
    'Always', 'Angrily', 'Annually', 'Badly',
    'Bitterly', 'Bleakly', 'Blindly', 'Boldly',
    'Bravely', 'Briefly', 'Brightly', 'Briskly',
    'Broadly', 'Busily', 'Calmly', 'Clearly',
    'Cleverly', 'Closely', 'Commonly', 'Coolly',
    'Crossly', 'Cruelly', 'Daily', 'Daintily',
    'Dearly', 'Deeply', 'Dimly', 'Dreamily',
    'Easily', 'Equally', 'Even', 'Evenly',
    'Exactly', 'Fairly', 'Famously', 'Far',
    'Fast', 'Fatally', 'Fiercely', 'Fondly',
    'Frankly', 'Freely', 'Fully', 'Gently',
    'Gladly', 'Greatly', 'Greedily', 'Happily',
    'Hastily', 'Heavily', 'Highly', 'Honestly',
    'Hourly', 'Hungrily', 'Intently', 'Inwardly',
    'Jaggedly', 'Jovially', 'Joyfully', 'Joyously',
    'Justly', 'Keenly', 'Kindly', 'Knottily',
    'Kookily', 'Lazily', 'Less', 'Lightly',
    'Likely', 'Limply', 'Lively', 'Loftily',
    'Loosely', 'Loudly', 'Lovingly', 'Loyally',
    'Madly', 'Merrily', 'Monthly', 'More',
    'Mortally', 'Mostly', 'Nearly', 'Neatly',
    'Needily', 'Never', 'Nicely', 'Noisily',
    'Not', 'Oddly', 'Often', 'Only',
    'Openly', 'Owlishly', 'Politely', 'Poorly',
    'Promptly', 'Properly', 'Quaintly', 'Queasily',
    'Queerly', 'Quicker', 'Quickly', 'Quietly',
    'Quirkily', 'Rapidly', 'Rarely', 'Readily',
    'Really', 'Rigidly', 'Roughly', 'Rudely',
    'Sadly', 'Safely', 'Scarcely', 'Scarily',
    'Sedately', 'Seldom', 'Shakily', 'Sharply',
    'Shrilly', 'Shyly', 'Silently', 'Sleepily',
    'Slowly', 'Smoothly', 'Softly', 'Solemnly',
    'Solidly', 'Soon', 'Speedily', 'Sternly',
    'Strictly', 'Suddenly', 'Sweetly', 'Swiftly',
    'Tenderly', 'Tensely', 'Terribly', 'Tightly',
    'Tomorrow', 'Too', 'Truly', 'Upbeat',
    'Upright', 'Upward', 'Upwardly', 'Urgently',
    'Usefully', 'Usually', 'Utterly', 'Vacantly',
    'Vaguely', 'Vainly', 'Vastly', 'Verbally',
    'Very', 'Warmly', 'Weakly', 'Wearily',
    'Well', 'Wetly', 'Wholly', 'Wildly',
    'Wisely', 'Woefully', 'Wrongly', 'Yearly'
    ];

/**
 * The list of adjectives.
 * @const
 */
const _ADJECTIVE_ = [
    'Alive', 'Angry', 'Better',
    'Big', 'Bitter', 'Black', 'Blue',
    'Brave', 'Brief', 'Broad', 'Calm',
    'Chubby', 'Clean', 'Clever', 'Clumsy',
    'Cooing', 'Curved', 'Dead', 'Deep',
    'Drab', 'Eager', 'Early', 'Easy',
    'Faint', 'Famous', 'Fancy', 'Fast',
    'Fat', 'Fierce', 'Flat', 'Fresh',
    'Gentle', 'Gifted', 'Gray', 'Greasy',
    'Great', 'Green', 'Grumpy', 'Happy',
    'Hollow', 'Hot', 'Huge', 'Icy',
    'Itchy', 'Jolly', 'Juicy', 'Kind',
    'Large', 'Late', 'Lazy', 'Little',
    'Lively', 'Long', 'Loose', 'Loud',
    'Low', 'Melted', 'Modern', 'Mushy',
    'Narrow', 'Nice', 'Noisy', 'Odd',
    'Old', 'Orange', 'Petite', 'Plain',
    'Proud', 'Puny', 'Purple', 'Quaint',
    'Quick', 'Quiet', 'Rainy', 'Rapid',
    'Raspy', 'Red', 'Rich', 'Rotten',
    'Round', 'Salty', 'Scary', 'Short',
    'Shy', 'Silly', 'Skinny', 'Slow',
    'Small', 'Square', 'Steep', 'Sticky',
    'Strong', 'Sweet', 'Swift', 'Tall',
    'Tart', 'Teeny', 'Tender', 'Tiny',
    'Uneven', 'Vast', 'Weak', 'Wet',
    'White', 'Wide', 'Witty', 'Wooden',
    'Wrong', 'Yellow', 'Young', 'Yummy',
];

/*
const _PRONOUN_ = [
];
*/

/*
const _CONJUNCTION_ = [
    'And', 'Or', 'For', 'Above', 'Before', 'Against', 'Between'
];
*/

/**
 * Maps a string (category name) to the array of words from that category.
 * @const
 */
const CATEGORIES = {
    _ADJECTIVE_,
    _ADVERB_,
    _PLURALNOUN_,
    _VERB_

//    _CONJUNCTION_,
//    _NOUN_,
//    _PLACE_,
//    _PRONOUN_,
};

/**
 * The list of room name patterns.
 * @const
 */
const PATTERNS = [
    '_ADJECTIVE__PLURALNOUN__VERB__ADVERB_'

    // BeautifulFungiOrSpaghetti
    //    '_ADJECTIVE__PLURALNOUN__CONJUNCTION__PLURALNOUN_',

    // AmazinglyScaryToy
    //    '_ADVERB__ADJECTIVE__NOUN_',

    // NeitherTrashNorRifle
    //    'Neither_NOUN_Nor_NOUN_',
    //    'Either_NOUN_Or_NOUN_',

    // EitherCopulateOrInvestigate
    //    'Either_VERB_Or_VERB_',
    //    'Neither_VERB_Nor_VERB_',

    //    'The_ADJECTIVE__ADJECTIVE__NOUN_',
    //    'The_ADVERB__ADJECTIVE__NOUN_',
    //    'The_ADVERB__ADJECTIVE__NOUN_s',
    //    'The_ADVERB__ADJECTIVE__PLURALNOUN__VERB_',

    // WolvesComputeBadly
    //    '_PLURALNOUN__VERB__ADVERB_',

    // UniteFacilitateAndMerge
    //    '_VERB__VERB_And_VERB_',

    // NastyWitchesAtThePub
    //    '_ADJECTIVE__PLURALNOUN_AtThe_PLACE_',
];

/**
 * Generates random int within the range [min, max].
 *
 * @param {number} min - The minimum value for the generated number.
 * @param {number} max - The maximum value for the generated number.
 * @returns {number} Random int number.
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(arr) {
    return arr[randomInt(0, arr.length - 1)];
}

/**
 * Generates a new room name.
 *
 * @returns {string} A newly-generated room name.
 */
function generateRoomWithoutSeparator() {
    // XXX Note that if more than one pattern is available, the choice of 'name'
    // won't have a uniform distribution amongst all patterns (names from
    // patterns with fewer options will have higher probability of being chosen
    // that names from patterns with more options).
    let name = randomElement(PATTERNS);

    while (_hasTemplate(name)) {
        for (const template in CATEGORIES) { // eslint-disable-line guard-for-in
            const word = randomElement(CATEGORIES[template]);

            name = name.replace(template, word);
        }
    }

    return name;
}

/**
 * Determines whether a specific string contains at least one of the
 * templates/categories.
 *
 * @param {string} s - String containing categories.
 * @private
 * @returns {boolean} True if the specified string contains at least one of the
 * templates/categories; otherwise, false.
 */
function _hasTemplate(s) {
    for (const template in CATEGORIES) {
        if (s.indexOf(template) >= 0) {
            return true;
        }
    }

    return false;
}

/*
function findDuplicates(array) {
    var dups = array.reduce(function (acc, cur) {
        if (!acc[cur]) {
            acc[cur] = 1;
        } else {
            acc[cur] += 1;
        }
        return acc;
    }, {});
    for (const word in dups) {
        if (dups[word] > 1) {
            console.log(`Duplicate: ${word} ${dups[word]}`);
        }
    }
}
findDuplicates(_ADJECTIVE_);
findDuplicates(_PLURALNOUN_);
findDuplicates(_VERB_);
findDuplicates(_ADVERB_);
var combinations = _ADJECTIVE_.length * _PLURALNOUN_.length * _VERB_.length * _ADVERB_.length;
console.log(`${combinations} combinations (${Math.log2(combinations)} bits of entropy)`)
*/

module.exports = generateRoomWithoutSeparator