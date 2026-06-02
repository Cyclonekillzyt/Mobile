import TrackPlayer, {
  Capability,
  AppKilledPlaybackBehavior,
} from "react-native-track-player";

export async function setupTrackPlayer() {
  await TrackPlayer.setupPlayer();

  await TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },

    capabilities: [
      Capability.Play,
      Capability.Pause,
      Capability.SeekTo,
      Capability.Stop,
    ],

    compactCapabilities: [Capability.Play, Capability.Pause],
  });
}
