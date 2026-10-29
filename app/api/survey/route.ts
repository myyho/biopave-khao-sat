import {
  audienceOptions,
  GOOGLE_FORM_RESPONSE_URL,
  materialConcernOptions,
  OTHER_OPTION,
  priorityOptions,
  problemOptions,
  proofOptions,
  toGoogleFormBody,
  treeConcernOptions,
} from "@/lib/survey-form";
import { z } from "zod";

export const runtime = "edge";

const otherText = z.string().trim().max(2000);
const inputSchema = z.object({
  email: z.string().trim().email().max(254),
  name: z.string().trim().min(1).max(120),
  phone: z.string().trim().min(1).max(30),
  audience: z.enum(audienceOptions),
  problems: z.array(z.enum([...problemOptions, OTHER_OPTION] as const)).min(1).max(5),
  problemsOther: otherText,
  priority: z.enum(priorityOptions),
  treeConcern: z.enum([...treeConcernOptions, OTHER_OPTION] as const),
  treeConcernOther: otherText,
  materialConcerns: z.array(z.enum([...materialConcernOptions, OTHER_OPTION] as const)).min(1).max(4),
  materialConcernsOther: otherText,
  proof: z.enum([...proofOptions, OTHER_OPTION] as const),
  proofOther: otherText,
  consent: z.literal(true),
  website: z.string().max(0),
}).superRefine((data, context) => {
  if (data.problems.includes(OTHER_OPTION) && !data.problemsOther) context.addIssue({ code: "custom", path: ["problemsOther"], message: "Other response required" });
  if (data.treeConcern === OTHER_OPTION && !data.treeConcernOther) context.addIssue({ code: "custom", path: ["treeConcernOther"], message: "Other response required" });
  if (data.materialConcerns.includes(OTHER_OPTION) && !data.materialConcernsOther) context.addIssue({ code: "custom", path: ["materialConcernsOther"], message: "Other response required" });
  if (data.proof === OTHER_OPTION && !data.proofOther) context.addIssue({ code: "custom", path: ["proofOther"], message: "Other response required" });
});

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return Response.json({ error: "Invalid content type" }, { status: 415 });
  const body = await request.text();
  if (body.length > 16000) return Response.json({ error: "Too large" }, { status: 413 });
  let parsed: unknown;
  try { parsed = JSON.parse(body); } catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }
  const result = inputSchema.safeParse(parsed);
  if (!result.success) return Response.json({ error: "Invalid response" }, { status: 400 });

  try {
    const googleResponse = await fetch(GOOGLE_FORM_RESPONSE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8", "Accept-Language": "vi,en;q=0.8" },
      body: toGoogleFormBody(result.data),
      redirect: "follow",
    });
    const confirmation = await googleResponse.text();
    if (!googleResponse.ok || !/Câu trả lời của bạn đã được ghi lại|Đã ghi nhận câu trả lời của bạn|Your response has been recorded|Gửi một câu trả lời khác|Submit another response/i.test(confirmation)) {
      return Response.json({ error: "Google Form did not confirm the response" }, { status: 502 });
    }
    return Response.json({ ok: true }, { status: 201 });
  } catch {
    return Response.json({ error: "Google Form unavailable" }, { status: 502 });
  }
}
