import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContact } from "@/lib/validateContact";
import { isRateLimited } from "@/lib/rateLimit";
import { profile } from "@/data/portfolio";

// Sender: Resend's shared test address works only when sending to the Resend
// account's own email. After verifying saurabhnair.com in Resend, set
// CONTACT_FROM (e.g. "Portfolio <contact@saurabhnair.com>") on Vercel.
const FROM = process.env.CONTACT_FROM ?? "Portfolio Contact <onboarding@resend.dev>";

export async function POST(request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return NextResponse.json({ ok: false, errors: { form: "Too many messages — try again in a bit." } }, { status: 429 });
  }

  const body = await request.json().catch(() => null);

  // Honeypot: the form has a hidden "company" field people never see. Bots fill
  // it in; pretend it worked so they don't retry.
  if (body?.company) return NextResponse.json({ ok: true });

  const result = validateContact(body ?? {});
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const { firstName, lastName, email, message, phone, service } = result.data;
  const fail = () =>
    NextResponse.json({ ok: false, errors: { form: "Couldn't send right now — try again in a bit." } }, { status: 502 });

  if (!process.env.RESEND_API_KEY) {
    console.error("[contact] RESEND_API_KEY is not set");
    return fail();
  }

  try {
    // Resend reports API failures (bad key, unverified sender...) in `error` rather than throwing.
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: FROM,
      to: profile.email,
      replyTo: email,
      subject: `New message from ${firstName} ${lastName}`,
      text: [
        service ? `Service: ${service}` : "",
        message,
        `— ${firstName} ${lastName} <${email}>${phone ? ` · ${phone}` : ""}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    });
    if (error) {
      console.error("[contact] Resend rejected the email:", error);
      return fail();
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed to send email:", err);
    return fail();
  }
}
