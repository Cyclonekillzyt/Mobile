import { useState, useEffect, useMemo } from "react";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { getStreamUrl } from "@/lib/api/streamApi";
import { usePlayerStore } from "@/stores/playerStore";

export const usePlayerControls = () => {
  const song = usePlayerStore((s) => s.currentSong);

  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const audioSource = useMemo(
    () => (song ? getStreamUrl(song.videoId) : undefined),
    [song?.videoId],
  );

  const player = useAudioPlayer(audioSource);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    });
  }, []);

  useEffect(() => {
    setIsPlaying(false);
    setProgress(0);
    setDuration(0);
  }, [song?.videoId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const current = (player as any)?.currentTime ?? 0;
      const dur = song?.duration ?? 0;

      setProgress(current * 1000);
      setDuration(dur * 1000);
    }, 500);

    return () => clearInterval(interval);
  }, [player, song]);

  const handlePlay = async () => {
    if (!song || !player) return;

    try {
      setIsLoading(true);

      if (player.setActiveForLockScreen) {
        player.setActiveForLockScreen(true, {
          title: song.title,
          artist: song.channel || "Unknown",
          albumTitle: "Music",
          artworkUrl: song.thumbnails?.high?.url,
        });
      }

      await player.play();
      setIsPlaying(true);
    } catch (e) {
      console.log("play error:", e);
      setIsPlaying(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    await player.pause();
    setIsPlaying(false);
  };

  const handleStop = async () => {
    await player.pause();
    setIsPlaying(false);
    setProgress(0);
  };

  const handleToggle = async () => {
    if (isPlaying) return handlePause();
    return handlePlay();
  };

  return {
    player,
    song,
    isPlaying,
    isLoading,
    handlePlay,
    handlePause,
    handleStop,
    handleToggle,
    progress,
    duration,
  };
};
