import { useState, useEffect, useMemo, useRef } from "react";
import { useAudioPlayer, setAudioModeAsync } from "expo-audio";
import { getStreamUrl } from "@/lib/api/streamApi";
import { usePlayerStore } from "@/stores/playerStore";

export const usePlayerControls = () => {
  const song = usePlayerStore((s) => s.currentSong);

  const setProgress = usePlayerStore((s) => s.setProgress);
  const setDuration = usePlayerStore((s) => s.setDuration);
  const setIsPlaying = usePlayerStore((s) => s.setIsPlaying);

  const isPlaying = usePlayerStore((s) => s.isPlaying);
  const [isLoading, setIsLoading] = useState(false);
  const repeatMode = usePlayerStore((s) => s.repeatMode);
  const isShuffled = usePlayerStore((s) => s.isShuffled);

  const setRepeatMode = usePlayerStore((s) => s.setRepeatMode);
  const setShuffle = usePlayerStore((s) => s.setShuffle);

  const player = useAudioPlayer(
    useMemo(
      () => (song ? getStreamUrl(song.videoId) : undefined),
      [song?.videoId],
    ),
  );


  

  const handleSeek = async (ms: number) => {
    if (!player) return;

    const shouldResume = isPlaying;

    try {
      player.pause();
      console.log(player)
      await player.seekTo(ms / 1000);
      console.log(player);

      if (shouldResume) {
         player.play();
      }
    } catch (e) {
      console.log("seek error:", e);
    }
    console.log("seek requested:", ms / 1000);
    console.log(player);
    setTimeout(() => {
      console.log("after seek currentTime:", player.currentTime);
    }, 500);
  };

  const endedRef = useRef(false);

  useEffect(() => {
    setAudioModeAsync({
      playsInSilentMode: true,
      shouldPlayInBackground: true,
      interruptionMode: "doNotMix",
    });
  }, []);

  useEffect(() => {
    setProgress(0);
    setDuration(0);
    setIsPlaying(false);
    endedRef.current = false;
  }, [song?.videoId]);

  useEffect(() => {
    if (!player) return;

    const sub = player.addListener?.("playbackStatusUpdate", (status: any) => {
      if (!status?.isLoaded) return;

      setProgress((status.currentTime ?? 0) * 1000);
      setDuration((status.duration ?? 0) * 1000);
      setIsPlaying(status.playing ?? false);

    
      if (status.didJustFinish) {
        endedRef.current = true;
      }
    });

    return () => sub?.remove?.();
  }, [player]);

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

      if (endedRef.current) {
        await player.seekTo(0);
        endedRef.current = false;
      }

      await player.play();
    } catch (e) {
      console.log("play error:", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = async () => {
    console.log("pause");
    await player.pause();
    console.log(player)
  };

  const handleStop = async () => {
    await player.pause();
    await player.seekTo(0);
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
    handleSeek,
  };
};
