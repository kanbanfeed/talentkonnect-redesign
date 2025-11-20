module.exports = {
    user: {
        name: "Alex Doe",
        role: "Talent",
        wallet: 450,
        level: 5,
        credits: 1200,
        notifications: 3
    },
    jobs: [
        { id: 1, title: "UI/UX Designer for Fintech", company: "FinCorp", reward: "500 Credits", type: "Remote", tags: ["Design", "Figma"] },
        { id: 2, title: "React Developer", company: "TechFlow", reward: "1000 Credits", type: "Contract", tags: ["Dev", "React"] },
        { id: 3, title: "Content Writer", company: "MediaBuzz", reward: "200 Credits", type: "One-time", tags: ["Writing"] }
    ],
    messages: [
        { id: 1, from: "FinCorp HR", text: "Hey, we loved your portfolio!", time: "2m ago", active: true },
        { id: 2, from: "TechFlow Team", text: "When can you start the gig?", time: "1h ago", active: false }
    ]
};