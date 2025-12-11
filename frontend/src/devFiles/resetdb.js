export async function resetDatabase() {
  try {
    const response = await fetch("https://localhost:3001/user/reset", { method: "POST" });
    const data = await response.json();
    console.log("Database reset:", data.message);
  } catch (err) {
    console.error("Failed to reset database:", err);
  }
}

resetDatabase();
