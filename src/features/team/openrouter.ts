// src\features\team\openrouter.ts
export const fetchSubtaskSuggestions = async (taskTitle: string): Promise<string[]> => {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer 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", // API key của bạn
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "TimeSphere"
      },
      body: JSON.stringify({
        model: "qwen/qwen3-30b-a3b:free",
        messages: [
          {
            role: "user",
            content: `Liệt kê tối đa 8 subtask cụ thể để thực hiện nhiệm vụ: "${taskTitle}". Trả về định dạng danh sách: "- [nội dung]". Không thêm tiêu đề, mở bài hay giải thích.`
          }
        ]
      })
    });

    const data = await response.json();

    const raw = data?.choices?.[0]?.message?.content || "";

    return raw
      .split("\n")
      .filter((line: string) => line.trim())
      .map((line: string) =>
        line.replace(/^[-•\d]+[.)]?\s*/, "").trim()
        );
  } catch (err) {
    console.error("Lỗi gọi OpenRouter:", err);
    return [];
  }
};