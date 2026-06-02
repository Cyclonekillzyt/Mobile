import { useEffect, useState } from "react";
import TrackPlayer, {
  State,
  usePlaybackState,
  useProgress,
} from "react-native-track-player";

import { getStreamUrl } from "@/lib/api/streamApi";
import { usePlayerStore } from "@/stores/playerStore";

export const usePlayerControls = () => {
  const song = usePlayerStore((s) => s.currentSong);

  const playbackState = usePlaybackState();

  const progressData = useProgress();

  const [isLoading, setIsLoading] = useState(false);

  const isPlaying = playbackState.state === State.Playing;

  useEffect(() => {
    usePlayerStore.getState().setProgress(progressData.position * 1000);

    usePlayerStore.getState().setDuration(progressData.duration * 1000);

    usePlayerStore.getState().setIsPlaying(isPlaying);
  }, [progressData.position, progressData.duration, isPlaying]);

  const loadTrack = async () => {
    if (!song) return;

    await TrackPlayer.reset();

    await TrackPlayer.add({
      id: song.videoId,
      url: getStreamUrl(song.videoId),

      title: song.title,
      artist: song.channel || "Unknown",

      artwork: song.thumbnails?.high?.url,
    });
  };

  const handlePlay = async () => {
    try {
      setIsLoading(true);

      const currentTrack = await TrackPlayer.getCurrentTrack();

      if (!currentTrack) {
        await loadTrack();
      }

      await TrackPlayer.play();
    } catch (e) {
      console.log("play error", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    await TrackPlayer.pause();
  };

  const handleToggle = async () => {
    if (isPlaying) {
      await handlePause();
    } else {
      await handlePlay();
    }
  };

  const handleSeek = async (ms: number) => {
    await TrackPlayer.seekTo(ms / 1000);
  };

  const handleStop = async () => {
    await TrackPlayer.stop();
    await TrackPlayer.seekTo(0);
  };

  return {
    song,
    isPlaying,
    isLoading,

    progress: progressData.position * 1000,
    duration: progressData.duration * 1000,

    handlePlay,
    handlePause,
    handleToggle,
    handleSeek,
    handleStop,
  };
};
