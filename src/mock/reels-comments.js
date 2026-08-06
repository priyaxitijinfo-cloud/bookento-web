export const REEL_COMMENTS = [
  {
    id: "comment_1",
    userName: "Aarohi Mehta",
    userHandle: "aarohi_mehta",
    userAvatar: "/images/listing/doctors/doctor-1.png",
    text: "This looks amazing! 😍 How deep is the pool?",
    likes: 24,
    createdAt: "2h",
    replies: [
      {
        id: "reply_1",
        userName: "Blue Haven Pool",
        userHandle: "bluehavenpool",
        userAvatar: "/images/listing/doctors/doctor-4.png",
        isCreator: true,
        text: "Hey! The pool is 6.5 ft deep. Perfect for both kids and adults 💙",
        likes: 16,
        createdAt: "1h",
      },
    ],
    moreReplies: 2,
  },
  {
    id: "comment_2",
    userName: "Rohan Patel",
    userHandle: "rohan.patel_23",
    userAvatar: "/images/listing/doctors/doctor-2.png",
    text: "Do you offer monthly memberships?",
    likes: 24,
    createdAt: "2h",
    replies: [
      {
        id: "reply_2",
        userName: "Blue Haven Pool",
        userHandle: "bluehavenpool",
        userAvatar: "/images/listing/doctors/doctor-4.png",
        isCreator: true,
        text: "Yes! We have flexible monthly plans. DM us for details.",
        likes: 16,
        createdAt: "1h",
      },
    ],
    moreReplies: 0,
  },
];

export const REEL_REPORT_REASONS = [
  {
    id: "inappropriate",
    label: "Inappropriate behavior",
    description: "Rude, abusive or unprofessional",
  },
  {
    id: "spam",
    label: "Spam or misleading information",
    description: "False info or promotional content",
  },
  {
    id: "irrelevant",
    label: "Irrelevant content",
    description: "Not related to healthcare",
  },
  {
    id: "other",
    label: "Other",
    description: "Please specify the issue",
  },
];
