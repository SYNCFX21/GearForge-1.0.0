import { Review } from '../types';

// Predefined detailed reviews tailored specifically to the Philippine gaming scene
export const STATIC_REVIEWS: Record<string, { communitySentiment: string; reviews: Omit<Review, 'id'>[] }> = {
  // --- MICE ---
  m1: {
    communitySentiment: "Durable budget mouse with high price-to-performance ratio. Symmetrical shape fits medium and small Pinoy hands perfectly, though the plastic feels slightly basic.",
    reviews: [
      { user: "Daryll C.", rating: 4.5, comment: "Grabe panalo 'to sa budget setup. Smooth glide tsaka lightweight. Gamit ko pang-Grind sa Valorant, hindi sumasakit kamay ko. Mejo plastikin lang feel pero subok na matibay.", date: "2026-06-15", tagline: "Sulit na sulit para sa mga lodi!" },
      { user: "GamerDad_99", rating: 4.0, comment: "Okay na okay pang-back up mouse. Cable is a bit stiff pero solve na for the price. Highly recommended kung kapos sa budget.", date: "2026-07-02", tagline: "Durable entry level" },
      { user: "Pau_T", rating: 4.5, comment: "Solid switches, responsive clicks. Perfect for Net Cafe or starter home setup.", date: "2026-07-10", tagline: "Affordable and reliable" }
    ]
  },
  m2: {
    communitySentiment: "The undisputed gateway mouse for generations of Filipino gamers. Beloved for its classic shape, reliability, and beautiful lighting, though susceptible to double-clicking over long years of heavy spamming.",
    reviews: [
      { user: "Jerome_Gilmore", rating: 5.0, comment: "No-brainer choice! Standard sa halos lahat ng comshop sa Maynila. Subok na matibay, and reliable software support. Yung RGB looks cleaner than other cheap mice.", date: "2026-05-19", tagline: "Ang Hari ng Comshop" },
      { user: "Keira_Mae", rating: 4.5, comment: "Very cute shape! Gamit ko for general school work and Genshin Impact. Mejo maliit siya sa malalaking kamay, pero saken sakto lang. Very clicky, mejo maingay lang sa gabi.", date: "2026-06-28", tagline: "Perfect for casual gaming" },
      { user: "Kuya_Will_Gaming", rating: 4.0, comment: "Sulit sana kung di mabilis magka-double click left button pag lumang batch. Pero replacement parts are easily found in Shopee. Solid choice pa din.", date: "2026-07-14", tagline: "Standard solid performance" }
    ]
  },
  m3: {
    communitySentiment: "The current community wireless darling. Offers top-tier performance on par with premium brands for a fraction of the cost, making it the highest rated budget wireless mouse on local forums.",
    reviews: [
      { user: "Ken_Velo", rating: 5.0, comment: "VXE Dragonfly is literally cheating the pricing system! Flagship sensor (3395) at 51 grams wireless, sub-2000 PHP! Ganda ng slide, no latency at all.", date: "2026-06-11", tagline: "Salamat sa budol, solid 'to!" },
      { user: "Marky_Tech", rating: 4.5, comment: "Sobrang gaan! Parang walang hawak. Recommended bilhan ng grip tape kasi medyo madulas yung plastic finish kung pawisin ang kamay tulad ko.", date: "2026-07-01", tagline: "Incredible value specs" },
      { user: "SalamatShopeeMall", rating: 5.0, comment: "Iwas cable drag, wireless setup is very clean. Battery lasts almost a week with intensive 8-hour daily matches. Direct buy na guys.", date: "2026-07-18", tagline: "Zero lag wireless dream" }
    ]
  },
  m4: {
    communitySentiment: "Legendary battery-operated wireless mouse. Extremely popular because you don't have to recharge it—just swap a AA battery. A reliable workhorse, but can feel slightly tail-heavy.",
    reviews: [
      { user: "Bong_P", rating: 5.0, comment: "Pinaka-reliable na wireless mouse sa PH market for years. 1 AA battery holds for 3-4 months. Perfect for college students na nagla-laptop at computer.", date: "2026-05-30", tagline: "Legendary battery life" },
      { user: "Chito_Splits", rating: 4.5, comment: "Medyo mabigat sa likod pag standard AA alkaline. Tip ko use Lithium AAA battery + tin foil adapter para maging 80g plus lang siya! Custom modding community is very active for this mouse.", date: "2026-06-25", tagline: "Modder's playground" },
      { user: "Renz_The_Builder", rating: 4.5, comment: "Lag-free performance, sensor is top-tier. Highly recommended as starting wireless rig.", date: "2026-07-12", tagline: "No delay, classic shape" }
    ]
  },
  m5: {
    communitySentiment: "Premium performance with top-tier optical sensor, but requires AA battery instead of being rechargeable. Great for large hand players who want pro-level response and click crispness.",
    reviews: [
      { user: "Jojo_R", rating: 4.5, comment: "Shape is amazing, very similar to GPW but with Razer design cues. Fast connection, zero dropouts. Sana lang rechargeable na siya via USB-C for this price, though the AA battery approach lasts forever.", date: "2026-06-20", tagline: "Ergonomic masterpiece" },
      { user: "Val_Pro_PH", rating: 5.0, comment: "Perfect tracking, 30K Focus Pro sensor does wonders for 360-degree flicks. Crisp mechanical clicks, medyo maingay pero very satisfying.", date: "2026-07-05", tagline: "Pro level tracking" }
    ]
  },
  m6: {
    communitySentiment: "The absolute gold standard for local esports athletes. Extremely lightweight, incredible battery, and perfect shape. Carries a hefty price tag, but delivers premium performance without compromise.",
    reviews: [
      { user: "TenZ_Fanboi", rating: 5.0, comment: "Isang malaking investment pero grabe yung level up sa mouse control! Sub-60g, stable connection. Ito yung gamit ng halos lahat ng paboritong streamers ko.", date: "2026-06-02", tagline: "End-game mouse" },
      { user: "Doc_Inigo", rating: 4.5, comment: "Solid specs and perfect balance. Main complaint is the price in PH is quite high, but if you have the savings, this is literally the best mouse money can buy.", date: "2026-06-29", tagline: "Premium and flawless" },
      { user: "Kuya_Ian_Vlog", rating: 5.0, comment: "Lightforce switches feel incredibly satisfying and durable. Highly responsive, feels like an extension of your arm.", date: "2026-07-15", tagline: "Simply peerless" }
    ]
  },

  // --- KEYBOARDS ---
  k1: {
    communitySentiment: "Great entry level 68-key keyboard. Highly compact and wallet-friendly, though Outemu switches have a louder sound profile and keycaps are standard ABS.",
    reviews: [
      { user: "Pluma_User", rating: 4.5, comment: "Maganda at matibay. Napaka-compact, tipid sa space ng desk ko. Perfect match sa mini desk setup.", date: "2026-05-22", tagline: "Cheap but highly functional" },
      { user: "Tech_Pinoy", rating: 4.0, comment: "Removable Type-C is very useful. Clicks are slightly hollow, but you can do foam mods to make it sound premium. Outemu sockets are restricted to Outemu-profile switches only though.", date: "2026-06-18", tagline: "Great first mechanical board" }
    ]
  },
  k2: {
    communitySentiment: "One of the absolute classic entry-level gaming keyboards. Incredible metal plate rigidity and reliable hot-swap capabilities make it highly respected in local communities.",
    reviews: [
      { user: "Phantom_Boy", rating: 5.0, comment: "Heavy metal backplate means it doesn't move around on my desk during intense clashes. Super bright RGB. Solid keys for the price.", date: "2026-06-03", tagline: "Rock solid metal build" },
      { user: "Vince_A", rating: 4.5, comment: "Subok na matibay ng mahabang panahon. Madaling linisin kasi floating keys design. RGB modes are very extensive and looks gorgeous at night.", date: "2026-07-07", tagline: "Highly durable classic" }
    ]
  },
  k3: {
    communitySentiment: "The gateway mechanical keyboard for modders. Bluetooth, 2.4Ghz wireless, and wired modes make it ultra-flexible. Great starting point for learning lubing, foam, and tape mods.",
    reviews: [
      { user: "Modder_Gil", rating: 4.5, comment: "Triple mode connectivity works like magic. Seamless switching between my PC and iPad. Sound signature is a bit clicky but highly moddable. Tape mod did wonders!", date: "2026-06-14", tagline: "Absolute modding starter kit" },
      { user: "Lian_Specs", rating: 4.5, comment: "Very cute and highly portable! Can fit easily inside my backpack. Software allows deep key mapping.", date: "2026-07-03", tagline: "Portable wireless workhorse" }
    ]
  },
  k4: {
    communitySentiment: "Superb custom mechanical keyboard. Full QMK/VIA keymap remapping and screw-in PCB stabilizers provide a refined typing experience right out of the box.",
    reviews: [
      { user: "Acoustic_Typist", rating: 5.0, comment: "The sound profile is amazingly deep out of the box. No scratchy sounds, stabilizers are well-lubed from factory. Perfect layout with dedicated function row.", date: "2026-05-11", tagline: "Audiophile-grade keyboard" },
      { user: "CodeNinja", rating: 4.5, comment: "QMK/VIA support is great for programmers. I mapped custom macros easily. PBT Keycaps feel premium and do not accumulate fingerprint oil easily.", date: "2026-06-30", tagline: "Exceptional build quality" }
    ]
  },
  k5: {
    communitySentiment: "The undisputed king of 'creamy' sounding aluminum keyboards. Flex-cut PCB, gasket mounting, and CNC aluminum case offer absolute luxury typing feel for mid-range budget.",
    reviews: [
      { user: "Keeb_Enthusiast", rating: 5.0, comment: "Incredible, solid aluminum block! Type feel is soft because of gasket mounts. The sound is extremely creamy (thocky) without even doing any custom mods. Worth every single peso.", date: "2026-06-19", tagline: "Creamy/Thocky masterclass" },
      { user: "PinoyKeebs", rating: 4.5, comment: "Heavy beast (around 1.8kg). Excellent anodization finish. Knob control is a lifesaver. Ensure you have custom switches to match this gorgeous board.", date: "2026-07-09", tagline: "Elite aluminum layout" }
    ]
  },
  k6: {
    communitySentiment: "The holy grail of competitive shooters. Magnetic Lekker switches and Rapid Trigger technology provide unmatched instant responsive movement and counter-strafe timing.",
    reviews: [
      { user: "Val_Immortal", rating: 5.0, comment: "Literal cheat code for Valorant! Rapid Trigger responds immediately the microsecond you lift your finger. Stutter stepping and strafe-shooting feels like playing on LAN. S-tier.", date: "2026-06-01", tagline: "The Competitive Endgame" },
      { user: "GamerBlogger", rating: 5.0, comment: "Web-based Wootility configuration is incredibly advanced and clean. Build quality is simple, but the magnetic hardware tech inside is unparalleled. Worth every peso.", date: "2026-06-27", tagline: "Unbeatable magnetic switches" }
    ]
  },

  // --- HEADSETS ---
  h1: {
    communitySentiment: "Ultra-affordable RGB headset. Fits well with casual gamers, offering deep bass profiles but carrying a slightly bulkier design and standard mic response.",
    reviews: [
      { user: "BassHead_PH", rating: 4.0, comment: "Malakas yung bass, masarap gamitin sa shooter games at panonood ng action movies. Cozy ear cups though medyo umiinit ang tenga pag matagal na suot sa walang aircon.", date: "2026-06-08", tagline: "Great bass for budget ears" },
      { user: "Tin_V", rating: 4.5, comment: "RGB looks really fun. Microphone is clear enough for Discord calls and in-game comms with my friends.", date: "2026-07-11", tagline: "Budget RGB dream" }
    ]
  },
  h2: {
    communitySentiment: "Excellent budget gaming headset with physical 50mm drivers. Highly praised in Pinoy groups for comfortable memory foam ear cushions and soundstage spacing.",
    reviews: [
      { user: "Comfy_Ear", rating: 4.5, comment: "Super comfy! Ear cushions are soft, does not squeeze my head even with glasses on. Sound separation is clean.", date: "2026-06-21", tagline: "Most comfortable budget cans" },
      { user: "Jed_V", rating: 4.5, comment: "Surround sound virtualization is great for directional footstep listening. Cable is thick and durable. Mic has noise-isolation feature.", date: "2026-07-04", tagline: "Footstep tracker" }
    ]
  },
  h3: {
    communitySentiment: "Top-value wireless headset under 3,000 PHP. Tri-mode connectivity and low-latency dongle deliver wire-free audio without heavy lag or signal dropouts.",
    reviews: [
      { user: "UnwiredGamer", rating: 4.5, comment: "Wireless freedom is superb! Latency is non-existent when using the 2.4Ghz dongle. Mic is detachable, which is great when you just want to listen to music.", date: "2026-05-15", tagline: "Superb wireless freedom" },
      { user: "Marc_Tech_Vlog", rating: 5.0, comment: "Unbelievable battery life. I charged it once and played for 3 days straight. Build is lightweight, no neck fatigue during long raids.", date: "2026-06-12", tagline: "Outstanding battery life" }
    ]
  },
  h4: {
    communitySentiment: "Incredible value audiophile open-back headset. Famous for producing the widest and most natural soundstage, allowing pin-point accuracy on opponent location tracking.",
    reviews: [
      { user: "Audiophile_Gaming", rating: 5.0, comment: "Open-back design is a game changer. Soundstage is so wide, it feels like the sounds are in the room, not inside your ears. Footsteps location is so exact, almost like ESP.", date: "2026-06-17", tagline: "Unmatched wide soundstage" },
      { user: "Senn_Fan", rating: 4.5, comment: "Keep in mind this is an open-back headset, meaning you will hear outside noise and others can hear your sound. Perfect for air-conditioned quiet rooms.", date: "2026-07-06", tagline: "Natural acoustics" }
    ]
  },
  h5: {
    communitySentiment: "The favorite of local streamers and competitive players alike. Renowned for its premium aluminum build, great passive noise cancellation, and Blue VO!CE microphone filters.",
    reviews: [
      { user: "StreamerPH", rating: 5.0, comment: "Blue VO!CE software turns your basic mic sound into professional podcast-like voice. Build is indestructible with steel/aluminum frame.", date: "2026-06-24", tagline: "Streamer-perfect microphone" },
      { user: "Dota_Grinder_99", rating: 4.5, comment: "Sound isolation is amazing, you cannot hear annoying electric fan wind noise. USB soundcard makes equalizers highly custom.", date: "2026-07-01", tagline: "Pro-gamer staple" }
    ]
  },
  h6: {
    communitySentiment: "High-end planar magnetic headset offering unmatched high-resolution audio. Expensive investment, but provides studio-grade clarity for both music production and high-stakes gaming.",
    reviews: [
      { user: "EliteAudio_PH", rating: 5.0, comment: "Planar magnetic drivers are on another planet. The details in sound are spectacular. You can hear subtle reload sounds, weapon switching, and micro footstep ticks.", date: "2026-05-18", tagline: "Ultimate gaming acoustics" },
      { user: "Cody_Y", rating: 4.5, comment: "Quite heavy due to massive magnets, but the suspension strap makes it wearable. Price is luxury level, but build and sound matches the tier.", date: "2026-07-03", tagline: "Audiophile luxury" }
    ]
  },

  // --- MOUSEPADS ---
  p1: {
    communitySentiment: "Inexpensive local deskmat with nice stitch borders. Great for keeping desk neat and accommodating budget setups.",
    reviews: [
      { user: "SetupPinoy_01", rating: 4.5, comment: "Incredibly cheap deskmat that covers full desk space. Cute minimal designs. Stitching is clean and doesnt irritate wrist.", date: "2026-06-05", tagline: "Budget desk styling" }
    ]
  },
  p3: {
    communitySentiment: "Superb hybrid control pad. Beloved by local Valorant/CS2 tacticians for its structured 'rough' texture which offers high stopping power.",
    reviews: [
      { user: "Valorant_Tac", rating: 5.0, comment: "Best control pad under 1000 PHP. Amundsen weave texture gives spectacular micro-adjustments stopping power. Highly recommended for tactical shooters.", date: "2026-06-15", tagline: "Valorant community favorite" }
    ]
  },
  p6: {
    communitySentiment: "The ultimate luxury glass pad. Smooth as ice with zero static friction, offering unmatched tracking speed, but requires regular dusting.",
    reviews: [
      { user: "Apex_Predator", rating: 5.0, comment: "Speed is literally insane. No fabric pad can match the zero-effort glide. Tracking in Apex Legends and Overwatch feels natural. Incredible glass build.", date: "2026-07-02", tagline: "Ultimate speed glass" }
    ]
  },

  // --- MICROPHONES ---
  mc1: {
    communitySentiment: "Perfect starter USB microphone. Plug-and-play with convenient physical tap-to-mute button and nice LED indicator.",
    reviews: [
      { user: "Discord_Spammer", rating: 4.5, comment: "Sobrang daling gamitin, plug n play lang. Ganda ng tap to mute feature pag humatsing or kumakain ka habang naka call.", date: "2026-06-10", tagline: "Easiest starter mic" }
    ]
  },
  mc3: {
    communitySentiment: "High quality condenser microphone with an internal shock mount. Delivers crisp podcasts or stream audio out of the box with zero setup.",
    reviews: [
      { user: "PodcasterPH", rating: 4.5, comment: "Clear, crisp, and high-fidelity sound. Built-in pop filter is surprisingly effective. Looks clean on boom arm.", date: "2026-06-25", tagline: "Broadcast-ready output" }
    ]
  },
  mc6: {
    communitySentiment: "The undisputed industry standard broadcast microphone. Delivers the rich, deep 'radio voice' tone but requires an XLR audio interface and high-gain setup.",
    reviews: [
      { user: "Joe_R_Fan", rating: 5.0, comment: "The legendary broadcast tone. Completely isolates surrounding noise, captures only your warm deep voice. Needs decent audio interface (Focusrite or Rodecaster).", date: "2026-07-01", tagline: "Broadcaster standard" }
    ]
  },

  // --- MONITORS ---
  mn1: {
    communitySentiment: "Extremely popular budget high-refresh monitor. Delivers smooth gameplay experience for esports on a tight budget.",
    reviews: [
      { user: "EsportsStarter", rating: 4.5, comment: "Unbelievable value for 100hz. Smooth gameplay compared to old 60hz screen. Saturated colors with decent viewing angles.", date: "2026-06-12", tagline: "Cheapest gaming monitor" }
    ]
  },
  mn3: {
    communitySentiment: "The sweet-spot of gaming monitors: 27-inch, 1440p resolution, and ultra-fast IPS panel. Superb balance of competitive frame rate and visual clarity.",
    reviews: [
      { user: "QHD_Enthusiast", rating: 5.0, comment: "1440p on 27 inch is the absolute sweet spot. Visuals are crystal clear, 170Hz makes competitive shooting buttery smooth. Zero dead pixels on my unit.", date: "2026-06-22", tagline: "Perfect sweet-spot monitor" }
    ]
  },
  mn6: {
    communitySentiment: "The absolute premium visual endgame. Infinite contrast of OLED combined with 240Hz refresh rate delivers instant response times and jaw-dropping cinematic visual depth.",
    reviews: [
      { user: "OLED_King", rating: 5.0, comment: "OLED colors are unreal! Pure deep blacks, infinite contrast, and instant 0.03ms response speed. Gaming feels incredibly fluid, feels like a dream.", date: "2026-07-15", tagline: "Unmatched OLED visual master" }
    ]
  },

  // --- CONTROLLERS ---
  c1: {
    communitySentiment: "Highly robust budget controller. Fits casual console/PC port gaming nicely with durable responsive tactile action.",
    reviews: [
      { user: "FIFA_Grinder", rating: 4.5, comment: "Super reliable controller for sports and fighting games. Heavy-duty cable, triggers feel smooth and springy.", date: "2026-06-04", tagline: "Perfect budget controller" }
    ]
  },
  c3: {
    communitySentiment: "The gold standard PC controller. Flawless ergonomic comfort, extensive native Windows layout compatibility, and superb analog triggers.",
    reviews: [
      { user: "PC_Console_Gamer", rating: 5.0, comment: "The standard for a reason. Windows recognizes it immediately. Excellent rumble motors, highly durable plastic and textured grip.", date: "2026-06-23", tagline: "The PC gaming standard" }
    ]
  },
  c6: {
    communitySentiment: "Elite controller featuring zero-drift Hall Effect thumbsticks, clicky mechanical mouse buttons, and fully remappable back paddles.",
    reviews: [
      { user: "Apex_Paddle_User", rating: 5.0, comment: "Hall effect joysticks mean zero stick drift forever! Back paddles are easily mapped. Clicky face buttons feel as fast as a mouse. Unbelievable controller.", date: "2026-07-08", tagline: "Esports-grade elite pad" }
    ]
  },

  // --- SPEAKERS ---
  s1: {
    communitySentiment: "Extremely affordable starter speakers. Nice compact footprint with simple USB powering and clear basic audio.",
    reviews: [
      { user: "BudgetDormSetup", rating: 4.0, comment: "Very cute and tiny speakers. Gets loud enough for dorm rooms and casual YouTube streams. Sound is balanced, albeit lacking sub-bass.", date: "2026-06-12", tagline: "Cute space saver" }
    ]
  },
  s3: {
    communitySentiment: "Excellent active studio monitor speakers. Offers highly accurate, flat, and transparent frequency response, great for both sound design and casual listening.",
    reviews: [
      { user: "AudioArchitect", rating: 4.8, comment: "Surprisingly wide soundstage and excellent sound separation for the price. Treble is clear, vocal clarity is absolute. Makes music sound very rich.", date: "2026-06-18", tagline: "Studio-level audio definition" }
    ]
  },
  s6: {
    communitySentiment: "Premium multi-driver gaming soundbar with wireless subwoofer and cinematic Dolby Atmos support. Delivers massive, deep rumbling bass that fills up entire rooms.",
    reviews: [
      { user: "Cinema_Gamer", rating: 5.0, comment: "The sub-woofer literally shakes my desk during explosions! Ganda ng virtual surround sound when playing RPG games or watching movies.", date: "2026-07-11", tagline: "True room-shaking theater bass" }
    ]
  }
};

// Generates fallback reviews for IDs that might not have custom written reviews in STATIC_REVIEWS
export function getReviewsForAccessory(item: { id: string; name: string; brand: string; category: string; pricePhp: number; rating: number }): { reviews: Review[]; communitySentiment: string } {
  const custom = STATIC_REVIEWS[item.id];
  
  // Base community sentiment if none specified
  let communitySentiment = custom?.communitySentiment || `Highly popular local option. Users appreciate its solid performance-to-price ratio in the local market.`;
  
  // Custom or generated reviews list
  let reviewsList: Review[] = [];
  
  if (custom && custom.reviews && custom.reviews.length > 0) {
    // Map with a deterministic/stored review ID
    reviewsList = custom.reviews.map((r, idx) => ({
      ...r,
      id: `review-${item.id}-${idx}`,
    }));
  } else {
    // Generate 2 generic but fun Taglish reviews based on category and brand
    const isLocalBrand = ['Rakk', 'Tecware', 'Fantech'].includes(item.brand);
    
    reviewsList = [
      {
        id: `review-${item.id}-gen1`,
        user: "Juan_Dela_Cruz",
        rating: Math.floor(item.rating),
        comment: `Ganda nitong ${item.brand} ${item.name}! Sulit na sulit yung presyo. ${isLocalBrand ? 'Madali pa kausap warranty support locally sa Pinas.' : 'Premium talaga feels tsaka solid yung materials.'} Gagamitin ko pang grind buong weekend!`,
        date: "2026-07-01",
        tagline: "Solid panggaming!"
      },
      {
        id: `review-${item.id}-gen2`,
        user: "Keeb_Lover99",
        rating: Math.min(5, Math.ceil(item.rating)),
        comment: `Excellent product! Delivery was extremely fast via Shopee/Lazada Mall. Highly responsive keys and solid design. ${item.pricePhp < 2000 ? 'No regrets for this price point, very friendly sa bulsa.' : 'Carries a premium price tag but the performance absolutely speaks for itself.'}`,
        date: "2026-07-15",
        tagline: "Highly recommended lodi"
      }
    ];
  }

  // Load user submitted reviews from local storage
  try {
    const savedReviewsRaw = localStorage.getItem(`user_reviews_${item.id}`);
    if (savedReviewsRaw) {
      const savedReviews = JSON.parse(savedReviewsRaw) as Review[];
      // Prepend user submitted reviews
      reviewsList = [...savedReviews, ...reviewsList];
    }
  } catch (e) {
    console.error("Failed to parse user submitted reviews:", e);
  }

  // Filter deleted reviews
  try {
    const deletedReviewsRaw = localStorage.getItem('deleted_reviews');
    if (deletedReviewsRaw) {
      const deletedIds = JSON.parse(deletedReviewsRaw) as string[];
      reviewsList = reviewsList.filter(r => !deletedIds.includes(r.id));
    }
  } catch(e) {
    console.error("Failed to parse deleted reviews:", e);
  }

  return {
    reviews: reviewsList,
    communitySentiment
  };
}

// Submits a new user review and persists in localStorage
export function submitUserReview(itemId: string, user: string, rating: number, comment: string, tagline?: string): Review {
  const newReview: Review = {
    id: `user-review-${itemId}-${Date.now()}`,
    user: user.trim() || "Gamer",
    rating,
    comment: comment.trim(),
    date: new Date().toISOString().split('T')[0],
    tagline: tagline?.trim() || "User Verified Review"
  };

  try {
    const savedReviewsRaw = localStorage.getItem(`user_reviews_${itemId}`);
    let existing: Review[] = [];
    if (savedReviewsRaw) {
      existing = JSON.parse(savedReviewsRaw);
    }
    const updated = [newReview, ...existing];
    localStorage.setItem(`user_reviews_${itemId}`, JSON.stringify(updated));
  } catch (e) {
    console.error("Failed to save user review:", e);
  }

  return newReview;
}

// Deletes a review by adding it to a deleted_reviews list in localStorage
export function deleteReview(reviewId: string): void {
  try {
    const deletedReviewsRaw = localStorage.getItem('deleted_reviews');
    let deletedIds: string[] = [];
    if (deletedReviewsRaw) {
      deletedIds = JSON.parse(deletedReviewsRaw);
    }
    deletedIds.push(reviewId);
    localStorage.setItem('deleted_reviews', JSON.stringify(deletedIds));
  } catch (e) {
    console.error("Failed to delete review:", e);
  }
}

