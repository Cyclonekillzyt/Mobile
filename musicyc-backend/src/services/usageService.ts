import { supabase } from "../lib/supabase.js";

export async function incrementDownloadUsage(userId: string) {
  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("user_usage")
    .select("downloads")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  if (error) {
    console.error("Usage read error:", error);
    return;
  }

  if (!data) {
    // first download today
    await supabase.from("user_usage").insert({
      user_id: userId,
      downloads: 1,
      date: today,
    });

    return;
  }

  // increment existing row
  await supabase
    .from("user_usage")
    .update({
      downloads: data.downloads + 1,
    })
    .eq("user_id", userId)
    .eq("date", today);
}
