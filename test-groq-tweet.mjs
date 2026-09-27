import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const prompt = `You are an expert social media content creator and copywriter.

TASK: Create a Tweet (strictly under 280 characters) for Twitter/X.

TOPIC/CONTEXT: chut

TONE: Use a polished, authoritative, and business-appropriate tone. Be clear and credible.

LANGUAGE: Write entirely in English.

IMPORTANT GUIDELINES:
- STRICT LENGTH CONSTRAINT: Do NOT over-generate. Output length MUST perfectly match the real-world standard limit for this content type on Twitter/X (e.g., Bios MUST be extremely short).
- Write ONLY the content itself, no explanations, no meta-commentary, no intro/outro
- Make it engaging, scroll-stopping, and optimized for Twitter/X's algorithm
- Use appropriate emojis naturally (don't overdo it)
- Include a strong call-to-action where appropriate
- Optimize for engagement (saves, shares, comments)
- If it's a thread, number each tweet and separate them clearly
- If it's hashtags, provide 20-30 relevant hashtags mixing popular and niche ones
- For carousel scripts, format each slide clearly with "Slide X: [Heading] — [Body]"
- Make sure the content feels authentic and human-written, not AI-generated

Now create the content:`;

async function test() {
  try {
    const stream = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages: [{ role: "user", content: prompt }],
      stream: true,
      // Removed max_tokens
    });
    
    let result = "";
    for await (const chunk of stream) {
      const delta = chunk.choices?.[0]?.delta?.content || "";
      if (delta === "" && chunk.choices?.[0]?.finish_reason) {
          console.log("FINISH REASON:", chunk.choices[0].finish_reason);
      }
      result += delta;
      process.stdout.write(delta);
    }
    console.log("\n\nFINAL LENGTH:", result.length);
  } catch(e) {
    console.error("ERROR", e.error ? e.error : e);
  }
}

test();
