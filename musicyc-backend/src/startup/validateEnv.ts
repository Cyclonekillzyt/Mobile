const required = ["SUPABASE_URL", "SUPABASE_ANON_KEY"];

required.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing env var: ${key}`);
  }
});
