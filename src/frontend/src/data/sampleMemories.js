import sampleImage1 from '../assets/sampleImage1.jpg';
import sampleImage2 from '../assets/sampleImage2.jpg';
import sampleImage3 from '../assets/sampleImage3.jpg';
import sampleImage4 from '../assets/sampleImage4.jpg';
import sampleImage5 from '../assets/sampleImage5.jpg';
import sampleImage6 from '../assets/sampleImage6.jpg';
import sampleVideo1 from '../assets/sampleVideo1.mp4';
import sampleAudio1 from '../assets/sampleAudio1.mp3';



const sampleMemories = [
    {
        id: 1,
        title: "An Unforgettable Trip to Da Lat",
        content: "The winter trip to Da Lat in 2024 with my friends was an unforgettable experience. We wandered through every winding road, enjoyed grilled rice paper by Xuan Huong Lake, and camped overnight in the pine forest. The most special moment was sipping coffee at Me Linh Garden in the early morning, watching the sunrise and talking about our youthful dreams.",
        emotion: { icon: "😊", name: "Happy" },
        media: [
            { type: "IMAGE", url: sampleImage1 }, 
            { type: "VIDEO", url: sampleVideo1, duration: "00:05:53" }
        ],
        location: "Da Lat",
        tags: [{ name: "travel" }, { name: "friends" }],
        createdAt: "2025-07-19T10:00:00"
    },
    {
        id: 2,
        title: "A Rainy Afternoon in Saigon",
        content: "Wandering under a sudden Saigon rain, I listened to the sound of raindrops on the roofs and streets. Even without an umbrella, the cool feeling seemed to wash away all my fatigue. Each slow step was a beat in a rhythm of nostalgia for old afternoons.",
        emotion: { icon: "🕰️", name: "Nostalgic" },
        media: [{ type: "IMAGE", url: sampleImage2 }], 
        location: "Ho Chi Minh City",
        tags: [{ name: "life" }, { name: "city" }],
        createdAt: "2025-07-17T15:30:00"
    },
    {
        id: 3,
        title: "My 21st Birthday",
        content: "A small but cozy party with close family and friends. The room was decorated with balloons and soft yellow lights, and laughter filled the air as I cut the cake. A close friend surprised me by singing my favorite song, which moved me to tears.",
        emotion: { icon: "🤩", name: "Excited" },
        media: [
            { type: "IMAGE", url: sampleImage3 }, 
            { type: "AUDIO", url: sampleAudio1, duration: "00:00:21" }
        ],
        location: "Home",
        tags: [{ name: "birthday" }, { name: "family" }],
        createdAt: "2025-05-12T19:00:00"
    },
    {
        id: 4,
        title: "Landed the Dream Job",
        content: "That morning, I received an email from my dream company. I screamed because I couldn't believe my eyes. After months of effort, waiting, and interviews, that moment felt like a well-deserved reward. I went out to celebrate with my family and saw the pride in my parents' eyes.",
        emotion: { icon: "😎", name: "Confident" },
        media: [],
        location: "Work",
        tags: [{ name: "career" }, { name: "milestone" }],
        createdAt: "2025-06-02T08:45:00"
    },
    {
        id: 5,
        title: "Sunset over Vung Tau Beach",
        content: "The evening sea was calm, and the sky turned from golden orange to deep purple. I sat on the sand, my bare feet touching the small waves, letting the sea breeze blow through my hair. A simple but profoundly peaceful moment I wanted to hold onto forever.",
        emotion: { icon: "😌", name: "Calm" },
        media: [{ type: "IMAGE", url: sampleImage4 }], 
        location: "Vung Tau",
        tags: [{ name: "beach" }, { name: "sunset" }],
        createdAt: "2025-05-10T18:20:00"
    },
    {
        id: 6,
        title: "High School Reunion",
        content: "Meeting my friends after 5 years apart felt like reliving my school days. We reminisced about our mischievous pranks, surprise tests, and even our first crushes. The laughter was endless, as if we had never been apart.",
        emotion: { icon: "❤️", name: "Loved" },
        media: [{ type: "VIDEO", url: sampleVideo1, duration: "00:05:53" }],
        location: "Old School",
        tags: [{ name: "reunion" }, { name: "friends" }],
        createdAt: "2025-06-15T14:00:00"
    },
    {
        id: 7,
        title: "Lantern Night in Hoi An",
        content: "Hoi An was shimmering in the light of thousands of lanterns hanging along the ancient streets. I strolled leisurely, bought a small lantern, and released it onto the Hoai River with a silent wish. A feeling of lightness and peace spread through my soul.",
        emotion: { icon: "😌", name: "Calm" },
        media: [{ type: "IMAGE", url: sampleImage5 }], 
        location: "Hoi An",
        tags: [{ name: "travel" }, { name: "peaceful" }],
        createdAt: "2025-07-01T20:00:00"
    },
    {
        id: 8,
        title: "Morning Run",
        content: "The sound of birds chirping, the fresh air, and the empty path were all I could feel during my morning run. It was a time to be alone with my positive thoughts, take deep breaths, and start the day full of energy.",
        emotion: { icon: "😊", name: "Happy" },
        media: [],
        location: "Local Park",
        tags: [{ name: "health" }, { name: "morning" }],
        createdAt: "2025-06-25T06:15:00"
    },
    {
        id: 9,
        title: "Graduation Day",
        content: "Wearing the graduation gown, I walked through every corner of the campus as memories flooded back. Friends hugged, cried, and laughed with a mix of joy and regret. I took one last photo and quietly left, knowing a new chapter was about to begin.",
        emotion: { icon: "😢", name: "Sad" },
        media: [
            { type: "IMAGE", url: sampleImage6 }, 
            { type: "VIDEO", url: sampleVideo1, duration: "00:05:53" }
        ],
        location: "University",
        tags: [{ name: "graduation" }, { name: "farewell" }],
        createdAt: "2025-05-31T09:00:00"
    },
    {
        id: 10,
        title: "A Romantic Evening",
        content: "Flickering candlelight, a soothing piano melody, and the look in my loved one's eyes said more than words ever could. We talked for hours, losing all track of time, with only a gentle, deep connection between our two souls.",
        emotion: { icon: "❤️", name: "Loved" },
        media: [{ type: "IMAGE", url: sampleImage1 }], 
        location: "Dinner Date",
        tags: [{ name: "love" }, { name: "romantic" }],
        createdAt: "2025-06-20T19:30:00"
    },
    {
        id: 11,
        title: "Sleepless Night",
        content: "I lay in bed, eyes wide open, staring at the ceiling. Thoughts raced through my mind: about the future, about work, about things left unsaid. Outside, it was unusually quiet, with only the ticking of the clock echoing in the silence.",
        emotion: { icon: "😰", name: "Anxious" },
        media: [],
        location: "Bedroom",
        tags: [{ name: "thoughts" }, { name: "night" }],
        createdAt: "2025-07-05T01:00:00"
    },
    {
        id: 12,
        title: "Exam Day",
        content: "Standing in front of the school gate, my hands trembled with nervousness. I closed my eyes, took a deep breath, and walked in. When I left the exam room, although I wasn't sure if I did well, I felt relieved for having tried my best.",
        emotion: { icon: "😰", name: "Anxious" },
        media: [],
        location: "Examination Hall",
        tags: [{ name: "exam" }, { name: "stress" }],
        createdAt: "2025-06-10T07:00:00"
    },
    {
        id: 13,
        title: "A Delicious Meal",
        content: "I cooked a meal for myself with all my favorite dishes. Not only was it delicious, but it also made me proud to be able to take care of myself so well. I put on some soft music and savored every bite slowly.",
        emotion: { icon: "🤩", name: "Excited" },
        media: [{ type: "IMAGE", url: sampleImage2 }], 
        location: "Kitchen",
        tags: [{ name: "food" }, { name: "selfcare" }],
        createdAt: "2025-07-08T12:00:00"
    },
    {
        id: 14,
        title: "Camping in the Pine Forest",
        content: "A few friends and I went to a forest on the outskirts of the city and set up a tent among the towering pine trees. At night, the campfire crackled, and the sound of a guitar mingled with the wind. The sky was full of stars, and we all sat around sharing stories we'd never told before.",
        emotion: { icon: "😊", name: "Happy" },
        media: [{ type: "VIDEO", url: sampleVideo1, duration: "00:05:53" }],
        location: "Pine Forest",
        tags: [{ name: "camping" }, { name: "nature" }],
        createdAt: "2025-06-30T22:00:00"
    },
    {
        id: 15,
        title: "Conquering the Mountain",
        content: "Finally reached the summit after 4 hours of continuous climbing. I was drenched in sweat but had a radiant smile. Looking down from above, all fatigue seemed to vanish. I felt like I could do anything in the world.",
        emotion: { icon: "😎", name: "Confident" },
        media: [{ type: "IMAGE", url: sampleImage3 }], 
        location: "Mountain Peak",
        tags: [{ name: "hiking" }, { name: "achievement" }],
        createdAt: "2025-06-28T11:00:00"
    },
    {
        id: 16,
        title: "A Quiet, Rainy Day",
        content: "I sat by the window, watching the raindrops gather on the glass. I did nothing at all, just sat in silence, listening to the rain and reflecting on everything that had passed. It was a quiet but not lonely feeling, as if I were being cleansed by time.",
        emotion: { icon: "😌", name: "Calm" },
        media: [],
        location: "Home",
        tags: [{ name: "rain" }, { name: "thoughts" }],
        createdAt: "2025-07-06T16:00:00"
    },
    {
        id: 17,
        title: "Movie Night with My Love",
        content: "Next to my partner, we re-watched our favorite movie from our college days. We remembered every detail and laughed at all the silly parts. It was a simple, gentle evening filled with happiness.",
        emotion: { icon: "❤️", name: "Loved" },
        media: [{ type: "IMAGE", url: sampleImage4 }], 
        location: "Living Room",
        tags: [{ name: "movie" }, { name: "cozy" }],
        createdAt: "2025-07-07T21:00:00"
    },
    {
        id: 18,
        title: "A Walk with the Dog",
        content: "My puppy loves to run around freely in the park. Every afternoon, we're like two best friends exploring every little path together. Everyone who passed by smiled at how adorable he is.",
        emotion: { icon: "😊", name: "Happy" },
        media: [{ type: "IMAGE", url: sampleImage5 }], 
        location: "Park",
        tags: [{ name: "pet" }, { name: "joy" }],
        createdAt: "2025-06-18T17:00:00"
    },
    {
        id: 19,
        title: "Meeting an Old Friend",
        content: "After years of no contact, we coincidentally met at a coffee shop. The conversation lasted for hours, from old school stories to future plans. The memories of our youth came back as clearly as if it were yesterday.",
        emotion: { icon: "🕰️", name: "Nostalgic" },
        media: [],
        location: "Coffee Shop",
        tags: [{ name: "friends" }, { name: "memories" }],
        createdAt: "2025-06-12T20:00:00"
    },
    {
        id: 20,
        title: "Biking by the Lake",
        content: "Early in the morning, I biked around the lake, listening to the water lapping against the shore and feeling the cool wind on my face. It's a feeling of freedom, without a worry in the world, just me and nature. It's precious time to listen to myself.",
        emotion: { icon: "😌", name: "Calm" },
        media: [{ type: "VIDEO", url: sampleVideo1, duration: "00:05:53" }],
        location: "West Lake",
        tags: [{ name: "exercise" }, { name: "free" }],
        createdAt: "2025-07-03T06:45:00"
    }
];

export default sampleMemories;