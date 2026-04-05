import { google } from "googleapis";

export async function searchYouTube(query: string) {
  if (!process.env.YT) {
    console.log(process.env.PORT);
    throw new Error("Missing YT API key in environment variables");
  }

  const youtube = google.youtube({
    version: "v3",
    auth: process.env.YT,
  });

  const res = await youtube.search.list({
    part: ["snippet"],
    q: `${query} song`,
    maxResults: 25,
    type: ["video"],
    videoCategoryId: "10",
  });

  return res.data.items
    ?.filter((item) => item.id?.kind === "youtube#video")
    .map((item) => ({
      title: item.snippet?.title,
      channel: item.snippet?.channelTitle,
      videoId: item.id?.videoId,
      thumbnails: item.snippet?.thumbnails,
      url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
    }));
}
