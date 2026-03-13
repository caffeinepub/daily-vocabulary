import Array "mo:core/Array";
import Map "mo:core/Map";
import Time "mo:core/Time";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Int "mo:core/Int";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  // Vocabulary Entry Type
  public type VocabularyEntry = {
    word : Text;
    definition : Text;
    partOfSpeech : Text;
    exampleSentence : Text;
    etymology : Text;
    level : Text;
  };

  // Persistent storage for user profiles
  let userProfiles = Map.empty<Principal, UserProfile>();

  // Persistent storage for bookmarks
  let bookmarks = Map.empty<Principal, [Nat]>();

  // User Profile Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Seeded Vocabulary List
  let vocabularyEntries : [VocabularyEntry] = [
    {
      word = "Aberration";
      definition = "A departure from what is normal, usual, or expected, typically an unwelcome one.";
      partOfSpeech = "Noun";
      exampleSentence = "The low test score was an aberration for the otherwise top-performing student.";
      etymology = "From Latin 'aberratio', meaning a wandering away";
      level = "hard";
    },
    {
      word = "Benevolent";
      definition = "Well meaning and kindly.";
      partOfSpeech = "Adjective";
      exampleSentence = "She had a benevolent smile that put everyone at ease.";
      etymology = "From Latin 'benevolens', meaning well wishing";
      level = "easy";
    },
    {
      word = "Capitulate";
      definition = "Cease to resist an opponent or an unwelcome demand; surrender.";
      partOfSpeech = "Verb";
      exampleSentence = "The army was forced to capitulate after months of resistance.";
      etymology = "From Medieval Latin 'capitulare', meaning to draw up in chapters";
      level = "medium";
    },
    {
      word = "Dichotomy";
      definition = "A division or contrast between two things that are or are represented as being opposed or entirely different.";
      partOfSpeech = "Noun";
      exampleSentence = "There's a clear dichotomy between the two political parties' ideologies.";
      etymology = "From Greek 'dichotomia', meaning cutting in two";
      level = "hard";
    },
    {
      word = "Eloquent";
      definition = "Fluent or persuasive in speaking or writing.";
      partOfSpeech = "Adjective";
      exampleSentence = "The author's eloquent prose captivated readers worldwide.";
      etymology = "From Latin 'eloquentia', meaning fluency, eloquence";
      level = "medium";
    },
    {
      word = "Facetious";
      definition = "Treating serious issues with deliberately inappropriate humor; flippant.";
      partOfSpeech = "Adjective";
      exampleSentence = "His facetious remarks during the meeting were not well received.";
      etymology = "From Latin 'facetia', meaning jest, wit";
      level = "hard";
    },
    {
      word = "Gregarious";
      definition = "Fond of company; sociable.";
      partOfSpeech = "Adjective";
      exampleSentence = "She is a gregarious person who enjoys hosting parties.";
      etymology = "From Latin 'gregarius', meaning belonging to a flock";
      level = "medium";
    },
    {
      word = "Harbinger";
      definition = "A person or thing that announces or signals the approach of another.";
      partOfSpeech = "Noun";
      exampleSentence = "The flowers are a harbinger of spring.";
      etymology = "From Middle English 'herbenger', meaning one who provides lodging";
      level = "hard";
    },
    {
      word = "Impetuous";
      definition = "Acting or done quickly and without thought or care.";
      partOfSpeech = "Adjective";
      exampleSentence = "Her impetuous decision to travel surprised everyone.";
      etymology = "From Latin 'impetuosus', meaning violent, hasty";
      level = "medium";
    },
    {
      word = "Juxtapose";
      definition = "Place or deal with close together for contrasting effect.";
      partOfSpeech = "Verb";
      exampleSentence = "The artist juxtaposed light and dark colors in the painting.";
      etymology = "From Latin 'juxta', meaning beside + 'pose', to place";
      level = "hard";
    },
    {
      word = "Kindle";
      definition = "To start a fire or ignite something emotionally.";
      partOfSpeech = "Verb";
      exampleSentence = "Reading that book kindled her love for literature.";
      etymology = "From Old Norse 'kynda', meaning to light a fire";
      level = "easy";
    },
    {
      word = "Lucid";
      definition = "Expressed clearly; easy to understand.";
      partOfSpeech = "Adjective";
      exampleSentence = "The instructions were so lucid that everyone could follow them.";
      etymology = "From Latin 'lucidus', meaning bright, clear";
      level = "easy";
    },
    {
      word = "Magnanimous";
      definition = "Generous or forgiving, especially toward a rival or less powerful person.";
      partOfSpeech = "Adjective";
      exampleSentence = "She was magnanimous in victory, congratulating her opponent.";
      etymology = "From Latin 'magnanimus', meaning great-souled";
      level = "medium";
    },
    {
      word = "Nostalgia";
      definition = "A sentimental longing or wistful affection for the past.";
      partOfSpeech = "Noun";
      exampleSentence = "The old photographs filled her with nostalgia.";
      etymology = "From Greek 'nostos', meaning return home, and 'algos', meaning pain";
      level = "easy";
    },
    {
      word = "Obsolete";
      definition = "No longer produced or used; out of date.";
      partOfSpeech = "Adjective";
      exampleSentence = "Typewriters have become largely obsolete.";
      etymology = "From Latin 'obsoletus', meaning worn out";
      level = "easy";
    },
    {
      word = "Paradox";
      definition = "A statement that seems contradictory but may actually be true.";
      partOfSpeech = "Noun";
      exampleSentence = "It's a paradox that standing is more tiring than walking.";
      etymology = "From Greek 'paradoxon', meaning contrary to expectation";
      level = "medium";
    },
    {
      word = "Quell";
      definition = "To put an end to; suppress.";
      partOfSpeech = "Verb";
      exampleSentence = "The police tried to quell the disturbance.";
      etymology = "From Old English 'cwellan', meaning to kill";
      level = "easy";
    },
    {
      word = "Resilient";
      definition = "Able to withstand or recover quickly from difficult conditions.";
      partOfSpeech = "Adjective";
      exampleSentence = "Children are often more resilient than adults think.";
      etymology = "From Latin 'resilire', meaning to leap back";
      level = "medium";
    },
    {
      word = "Superfluous";
      definition = "Unnecessary, especially through being more than enough.";
      partOfSpeech = "Adjective";
      exampleSentence = "He deleted superfluous words from his essay.";
      etymology = "From Latin 'superfluus', meaning overflowing";
      level = "medium";
    },
    {
      word = "Tangible";
      definition = "Perceptible by touch; clear and definite.";
      partOfSpeech = "Adjective";
      exampleSentence = "There was a tangible sense of excitement in the air.";
      etymology = "From Latin 'tangibilis', meaning that may be touched";
      level = "easy";
    },
    {
      word = "Ubiquitous";
      definition = "Present, appearing, or found everywhere.";
      partOfSpeech = "Adjective";
      exampleSentence = "Smartphones have become ubiquitous in today's society.";
      etymology = "From Latin 'ubiquitas', meaning everywhere";
      level = "medium";
    },
    {
      word = "Vex";
      definition = "To make someone feel annoyed, frustrated, or worried.";
      partOfSpeech = "Verb";
      exampleSentence = "The constant noise began to vex the residents.";
      etymology = "From Latin 'vexare', meaning to shake, trouble";
      level = "easy";
    },
    {
      word = "Wane";
      definition = "To decrease in size, extent, or degree; become weaker.";
      partOfSpeech = "Verb";
      exampleSentence = "Interest in the product began to wane over time.";
      etymology = "From Old English 'wanian', meaning to lessen";
      level = "easy";
    },
    {
      word = "Xenophobia";
      definition = "Dislike of or prejudice against people from other countries.";
      partOfSpeech = "Noun";
      exampleSentence = "Efforts are being made to combat xenophobia in society.";
      etymology = "From Greek 'xenos', meaning stranger, and 'phobos', meaning fear";
      level = "hard";
    },
    {
      word = "Yearn";
      definition = "To have an intense feeling of longing for something.";
      partOfSpeech = "Verb";
      exampleSentence = "He yearned for the days of his youth.";
      etymology = "From Old English 'giernan', meaning to desire";
      level = "easy";
    },
    {
      word = "Zealous";
      definition = "Having or showing great energy or enthusiasm.";
      partOfSpeech = "Adjective";
      exampleSentence = "The team was zealous in their efforts to win the championship.";
      etymology = "From Greek 'zelos', meaning ardor, jealousy";
      level = "medium";
    },
    {
      word = "Ambiguous";
      definition = "Open to more than one interpretation; having a double meaning.";
      partOfSpeech = "Adjective";
      exampleSentence = "His answers were purposely ambiguous.";
      etymology = "From Latin 'ambiguus', meaning uncertain";
      level = "medium";
    },
    {
      word = "Belligerent";
      definition = "Hostile and aggressive.";
      partOfSpeech = "Adjective";
      exampleSentence = "The belligerent tone of his voice startled everyone.";
      etymology = "From Latin 'belliger', meaning warlike";
      level = "hard";
    },
    {
      word = "Cacophony";
      definition = "A harsh, discordant mixture of sounds.";
      partOfSpeech = "Noun";
      exampleSentence = "The cacophony of alarm bells woke everyone up.";
      etymology = "From Greek 'kakophonia', meaning bad sound";
      level = "hard";
    },
    {
      word = "Debilitate";
      definition = "To make someone weak and infirm.";
      partOfSpeech = "Verb";
      exampleSentence = "The disease can debilitate even the healthiest individuals.";
      etymology = "From Latin 'debilitare', meaning to weaken";
      level = "hard";
    },
    {
      word = "Ephemeral";
      definition = "Lasting for a very short time.";
      partOfSpeech = "Adjective";
      exampleSentence = "The beauty of a sunset is ephemeral.";
      etymology = "From Greek 'ephemeros', meaning lasting a day";
      level = "hard";
    },
    {
      word = "Feasible";
      definition = "Possible to do easily or conveniently.";
      partOfSpeech = "Adjective";
      exampleSentence = "With enough resources, the plan is feasible.";
      etymology = "From Latin 'facere', meaning to do";
      level = "medium";
    },
    {
      word = "Hinder";
      definition = "To create difficulties resulting in delay or obstruction.";
      partOfSpeech = "Verb";
      exampleSentence = "Bad weather can hinder the construction process.";
      etymology = "From Old English 'hindrian', meaning to keep back";
      level = "easy";
    },
    {
      word = "Ignominious";
      definition = "Deserving or causing public disgrace or shame.";
      partOfSpeech = "Adjective";
      exampleSentence = "The team suffered an ignominious defeat.";
      etymology = "From Latin 'ignominia', meaning disgrace";
      level = "hard";
    },
    {
      word = "Jeopardize";
      definition = "To put someone or something in a situation where there is a danger of loss, harm, or failure.";
      partOfSpeech = "Verb";
      exampleSentence = "Careless driving can jeopardize lives.";
      etymology = "From Old French 'jeopardee', meaning a game of chance";
      level = "medium";
    },
    {
      word = "Kudos";
      definition = "Praise and honor received for an achievement.";
      partOfSpeech = "Noun";
      exampleSentence = "She received kudos for her outstanding work.";
      etymology = "From Greek 'kydos', meaning glory";
      level = "easy";
    },
    {
      word = "Lethargic";
      definition = "Affected by lethargy; sluggish and apathetic.";
      partOfSpeech = "Adjective";
      exampleSentence = "He felt lethargic after staying up all night.";
      etymology = "From Greek 'lethe', meaning forgetfulness";
      level = "medium";
    },
    {
      word = "Meticulous";
      definition = "Showing great attention to detail; very careful and precise.";
      partOfSpeech = "Adjective";
      exampleSentence = "The artist was meticulous in her brush strokes.";
      etymology = "From Latin 'meticulosus', meaning fearful";
      level = "medium";
    },
    {
      word = "Nefarious";
      definition = "Wicked, villainous, or criminal.";
      partOfSpeech = "Adjective";
      exampleSentence = "The criminal masterminded a nefarious plot.";
      etymology = "From Latin 'nefarius', meaning wicked";
      level = "hard";
    },
    {
      word = "Obliterate";
      definition = "Destroy utterly; wipe out.";
      partOfSpeech = "Verb";
      exampleSentence = "The flood obliterated the small village.";
      etymology = "From Latin 'obliterare', meaning to erase";
      level = "hard";
    },
    {
      word = "Plausible";
      definition = "Seeming reasonable or probable.";
      partOfSpeech = "Adjective";
      exampleSentence = "Her explanation seemed plausible at first.";
      etymology = "From Latin 'plausibilis', meaning worthy of applause";
      level = "medium";
    },
    {
      word = "Quintessential";
      definition = "Representing the most perfect or typical example of a quality or class.";
      partOfSpeech = "Adjective";
      exampleSentence = "She is the quintessential soccer mom.";
      etymology = "From Latin 'quintus', meaning fifth and 'essentia', meaning essence";
      level = "hard";
    },
    {
      word = "Ratify";
      definition = "Sign or give formal consent to (a treaty, contract, or agreement), making it officially valid.";
      partOfSpeech = "Verb";
      exampleSentence = "The countries agreed to ratify the trade agreement.";
      etymology = "From Latin 'ratificare', meaning to confirm";
      level = "medium";
    },
    {
      word = "Scrupulous";
      definition = "Diligent, thorough, and extremely attentive to details.";
      partOfSpeech = "Adjective";
      exampleSentence = "The accountant was scrupulous in her record-keeping.";
      etymology = "From Latin 'scrupulus', meaning small sharp stone";
      level = "hard";
    },
    {
      word = "Trepidation";
      definition = "A feeling of fear or agitation about something that may happen.";
      partOfSpeech = "Noun";
      exampleSentence = "He entered the room with trepidation.";
      etymology = "From Latin 'trepidatio', meaning trembling";
      level = "hard";
    },
    {
      word = "Unanimous";
      definition = "Fully in agreement; of one mind.";
      partOfSpeech = "Adjective";
      exampleSentence = "The jury was unanimous in their decision.";
      etymology = "From Latin 'unanimus', meaning of one mind";
      level = "medium";
    },
    {
      word = "Versatile";
      definition = "Able to adapt or be adapted to many different functions or activities.";
      partOfSpeech = "Adjective";
      exampleSentence = "She is a versatile musician, playing several instruments.";
      etymology = "From Latin 'versatilis', meaning turning easily";
      level = "easy";
    },
    {
      word = "Whimsical";
      definition = "Playfully quaint or fanciful, especially in an appealing and amusing way.";
      partOfSpeech = "Adjective";
      exampleSentence = "The artist's whimsical style delighted viewers.";
      etymology = "From whimsy, meaning capricious nature";
      level = "medium";
    },
    {
      word = "Assertive";
      definition = "Having or showing a confident and forceful personality.";
      partOfSpeech = "Adjective";
      exampleSentence = "She is assertive in business meetings.";
      etymology = "From Latin 'assertus', meaning claimed, affirmed";
      level = "easy";
    },
    {
      word = "Brevity";
      definition = "Concise and exact use of words in writing or speech.";
      partOfSpeech = "Noun";
      exampleSentence = "The article was praised for its brevity.";
      etymology = "From Latin 'brevitas', meaning shortness";
      level = "medium";
    },
    {
      word = "Complacent";
      definition = "Showing smug or uncritical satisfaction with oneself or one's achievements.";
      partOfSpeech = "Adjective";
      exampleSentence = "After the victory, the team became complacent.";
      etymology = "From Latin 'complacere', meaning to please greatly";
      level = "medium";
    },
    {
      word = "Docile";
      definition = "Ready to accept control or instruction; submissive.";
      partOfSpeech = "Adjective";
      exampleSentence = "The animals became docile after training.";
      etymology = "From Latin 'docilis', meaning easily taught";
      level = "easy";
    },
    {
      word = "Eccentric";
      definition = "Unconventional and slightly strange.";
      partOfSpeech = "Adjective";
      exampleSentence = "His eccentric behavior amused his friends.";
      etymology = "From Medieval Latin 'eccentricus', meaning out of center";
      level = "hard";
    },
    {
      word = "Fervor";
      definition = "Intense and passionate feeling.";
      partOfSpeech = "Noun";
      exampleSentence = "The crowd cheered with fervor.";
      etymology = "From Latin 'fervere', meaning to boil";
      level = "hard";
    },
    {
      word = "Gratify";
      definition = "To give satisfaction or pleasure to.";
      partOfSpeech = "Verb";
      exampleSentence = "It gratified him to see his work appreciated.";
      etymology = "From Latin 'gratificari', meaning to do favors for";
      level = "medium";
    },
    {
      word = "Humility";
      definition = "A modest or low view of one's own importance; humbleness.";
      partOfSpeech = "Noun";
      exampleSentence = "She accepted the award with humility.";
      etymology = "From Latin 'humilitas', meaning lowness, small stature";
      level = "easy";
    },
    {
      word = "Inevitable";
      definition = "Certain to happen; unavoidable.";
      partOfSpeech = "Adjective";
      exampleSentence = "The downfall was inevitable given the circumstances.";
      etymology = "From Latin 'inevitabilis', meaning unavoidable";
      level = "medium";
    },
    {
      word = "Jubilant";
      definition = "Feeling or expressing great happiness and joy.";
      partOfSpeech = "Adjective";
      exampleSentence = "The team was jubilant after their victory.";
      etymology = "From Latin 'jubilare', meaning to shout for joy";
      level = "easy";
    }
  ];

  // Total number of words - Public access
  public query ({ caller }) func getTotalWordCount() : async Nat {
    vocabularyEntries.size();
  };

  // Get word by index - Public access
  public query ({ caller }) func getWordByIndex(index : Nat) : async ?VocabularyEntry {
    if (index >= vocabularyEntries.size()) { return null };
    ?vocabularyEntries[index];
  };

  // Get words filtered by level - Public access
  public query ({ caller }) func getWordsByLevel(level : Text) : async [VocabularyEntry] {
    vocabularyEntries.filter(func(e) { e.level == level });
  };

  // Get word count by level - Public access
  public query ({ caller }) func getWordCountByLevel(level : Text) : async Nat {
    vocabularyEntries.filter(func(e) { e.level == level }).size();
  };

  // Get word of the day - Public access
  public query ({ caller }) func getWordOfTheDay() : async VocabularyEntry {
    let now = Time.now();
    let daysSinceEpoch = now / (24 * 60 * 60 * 1_000_000_000);
    vocabularyEntries[daysSinceEpoch.toNat() % vocabularyEntries.size()];
  };

  // Bookmark word by index - User authentication required
  public shared ({ caller }) func bookmarkWord(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can bookmark words");
    };

    if (index >= vocabularyEntries.size()) { Runtime.trap("Word index does not exist!") };

    let currentBookmarks = switch (bookmarks.get(caller)) {
      case (null) { [] };
      case (?b) { b };
    };

    if (currentBookmarks.findIndex(func(i) { i == index }) != null) {
      return;
    };

    let newBookmarks = currentBookmarks.concat([index]);
    bookmarks.add(caller, newBookmarks);
  };

  // Get all bookmarked words for current user - User authentication required
  public query ({ caller }) func getBookmarkedWords() : async [VocabularyEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view bookmarks");
    };

    switch (bookmarks.get(caller)) {
      case (null) { [] };
      case (?indices) {
        indices.values().map(func(i) { vocabularyEntries[i] }).toArray();
      };
    };
  };

  // Remove bookmark - User authentication required
  public shared ({ caller }) func removeBookmark(index : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can remove bookmarks");
    };

    switch (bookmarks.get(caller)) {
      case (null) { return };
      case (?currentBookmarks) {
        let newBookmarks = currentBookmarks.filter(func(i) { i != index });
        bookmarks.add(caller, newBookmarks);
      };
    };
  };
};
