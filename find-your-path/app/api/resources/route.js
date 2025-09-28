import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const career = searchParams.get("career") || "career";

  try {
    // 🎧 YouTube Audiobooks
    const ytAudioRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        career + " audiobook"
      )}&type=video&videoDuration=long&maxResults=5&key=${
        process.env.YOUTUBE_API_KEY
      }`
    );
    const ytAudioData = await ytAudioRes.json();
    const audiobooks =
      ytAudioData.items?.map((v) => ({
        title: v.snippet.title,
        channel: v.snippet.channelTitle,
        url: `https://youtube.com/watch?v=${v.id.videoId}`,
      })) || [];

    // ▶️ YouTube Videos (tutorials/expert talks)
    const ytRes = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        career + " career development tutorial"
      )}&type=video&videoDuration=medium&maxResults=5&key=${
        process.env.YOUTUBE_API_KEY
      }`
    );
    const ytData = await ytRes.json();
    const youtube =
      ytData.items?.map((v) => ({
        title: v.snippet.title,
        channel: v.snippet.channelTitle,
        url: `https://youtube.com/watch?v=${v.id.videoId}`,
      })) || [];

    // 🎓 Free Courses (curated links)
    const courses = [
      {
        title: `Intro to ${career}`,
        provider: "Coursera",
        link: `https://www.coursera.org/search?query=${encodeURIComponent(
          career
        )}`,
      },
      {
        title: `${career} Essentials`,
        provider: "edX",
        link: `https://www.edx.org/search?q=${encodeURIComponent(career)}`,
      },
    ];

    // 📰 Articles (curated)
    const articles = [
      {
        title: `Top skills for ${career}`,
        source: "Medium",
        link: `https://medium.com/search?q=${encodeURIComponent(
          career + " skills"
        )}`,
      },
      {
        title: `How to succeed as a ${career}`,
        source: "Forbes",
        link: `https://www.forbes.com/search/?q=${encodeURIComponent(career)}`,
      },
    ];

    return NextResponse.json({ audiobooks, youtube, courses, articles });
  } catch (err) {
    console.error("Error fetching resources:", err);
    return NextResponse.json(
      { error: "Failed to fetch resources" },
      { status: 500 }
    );
  }
}
