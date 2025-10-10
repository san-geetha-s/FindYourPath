// app/api/softskills/route.js (Next.js 13)
export const GET = async (req) => {
  const url = new URL(req.url);
  const career = url.searchParams.get("career") || "Generic";

  // Generic high-impact tasks for all careers
  const genericTasks = [
    "Record a 1-minute self-introduction video",
    "Write a daily reflection in your journal",
    "Connect with one professional in your field",
    "Plan tomorrow's tasks tonight",
    "Identify one distraction and remove it today",
    "Practice active listening in a conversation",
    "Give meaningful feedback to someone",
    "Practice mindfulness or meditation for 10 minutes"
  ];

  // Career-specific tasks
  const careerTasksMap = {
    "Software Developer": [
      "Solve one coding problem today",
      "Build a small component or feature",
      "Review one PR on GitHub",
      "Read one programming article",
      "Write one function from scratch"
    ],
    Entrepreneur: [
      "Draft a mini business plan",
      "Pitch your idea to a friend or mentor",
      "Research one competitor",
      "Write down one problem to solve",
      "Connect with a potential collaborator"
    ],
    Teacher: [
      "Prepare a 5-min lesson plan",
      "Teach a small concept to someone",
      "Observe a teaching video and note improvements",
      "Give constructive feedback to a peer",
      "Reflect on your teaching style for 10 minutes"
    ],
    SocialWorker: [
      "Reach out to a person in need and assist",
      "Volunteer for one hour today",
      "Reflect on your empathy skills",
      "Connect with a mentor in social work",
      "Plan a small social activity for impact"
    ],
    // Add other careers here...
  };

  const careerTasks = careerTasksMap[career] || [];

  return new Response(JSON.stringify({ genericTasks, careerTasks }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
