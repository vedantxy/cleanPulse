export async function analyzeWaste(item) {
  const res = await fetch("/api/ai/analyze", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ item })
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Guardian response silent");
  }

  return data;
}
