import {
  Canvas,
  Fill,
  FractalNoise,
  useClock,
} from "@shopify/react-native-skia";

export default function Grain() {
  const clock = useClock();

  return (
    <Canvas
      style={{ position: "absolute", width: "100%", height: "100%" }}
      pointerEvents="none"
    >
      <Fill>
        <FractalNoise freqX={0.8} freqY={0.8} octaves={3} seed={clock} />
      </Fill>
    </Canvas>
  );
}
