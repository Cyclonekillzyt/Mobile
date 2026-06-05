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

  const videoIds = res.data.items
    ?.map((item) => item.id?.videoId)
    .filter((id): id is string => Boolean(id));

  if (!videoIds) return [];

  const details = await youtube.videos.list({
    part: "contentDetails",
    id: videoIds,
  } as any);
  function parseDuration(iso: string) {
    const match = iso.match(/PT(?:(\d+)M)?(?:(\d+)S)?/);

    const minutes = parseInt(match?.[1] || "0");
    const seconds = parseInt(match?.[2] || "0");

    return minutes * 60 + seconds;
  }

  const durationMap = new Map();

  details.data.items?.forEach((v) => {
    const id = v.id;
    const duration = v.contentDetails?.duration;

    if (id && duration) {
      durationMap.set(id, parseDuration(duration));
    }
  });

  return res.data.items
    ?.filter((item) => item.id?.kind === "youtube#video")
    .map((item) => ({
      title: item.snippet?.title,
      channel: item.snippet?.channelTitle,
      videoId: item.id?.videoId,
      thumbnails: item.snippet?.thumbnails,
      url: `https://www.youtube.com/watch?v=${item.id?.videoId}`,
      duration: item.id?.videoId ? durationMap.get(item.id.videoId) || 0 : 0,
    }));
}
