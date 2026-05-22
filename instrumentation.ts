export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    try {
      const { default: dbConnect } = await import("@/app/lib/mongodb");
      await dbConnect();
      console.log("✅ MongoDB pre-warmed on startup");
    } catch (err) {
      console.error("⚠️  MongoDB pre-warm failed:", err);
    }
  }
}