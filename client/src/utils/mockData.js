export const currentUser = {
  _id: "1",
  name: "Alexa Dreamer",
  email: "alexa@example.com",
  phone: "1234567890",
  password: "hashedPassword123",
  Avatar: "https://picsum.photos/seed/alexa/150/150",
  bio: "Exploring the boundary between human imagination and AI.",
  followers: [],
  following: [],
  isAdmin: false,
  isActive: true,
  credits: 5
};

export const mockUsers = [
  ...Array(10).fill(null).map((_, i) => ({
    _id: `${i + 2}`,
    name: `Creative Mind ${i + 2}`,
    email: `creator${i+2}@example.com`,
    phone: `123456789${i}`,
    password: "hashedpassword",
    Avatar: `https://picsum.photos/seed/user${i + 2}/150/150`,
    bio: "Digital artist.",
    followers: Array(Math.floor(Math.random() * 50)).fill("id"),
    following: Array(Math.floor(Math.random() * 20)).fill("id"),
    isAdmin: false,
    isActive: true,
    credits: 5
  }))
];

export const mockPosts = [
  ...Array(30).fill(null).map((_, i) => ({
    _id: `${i + 1}`,
    imageLink: `https://picsum.photos/seed/${i + 1}/400/${400 + Math.floor(Math.random() * 300)}`,
    prompt: `A beautiful surreal painting of a futuristic city with flying cars and glowing neon lights in the style of cyberpunk ${i + 1}`,
    user: i % 5 === 0 ? currentUser : mockUsers[i % 10],
    caption: `My amazing artwork ${i+1}`,
    likes: Array(Math.floor(Math.random() * 100)).fill("id"),
    isPublished: true,
    comments: [
      { _id: "1", text: "Wow, the colors are amazing!", user: mockUsers[0], timestamp: "2h ago" },
      { _id: "2", text: "What prompt did you use for the lighting?", user: mockUsers[1], timestamp: "1h ago" }
    ]
  }))
];

export const trendingTags = [
  "#surrealism", "#cyberpunk", "#fantasy", "#landscape", "#portrait", "#conceptart", "#scifi", "#watercolor", "#minimalist"
];
