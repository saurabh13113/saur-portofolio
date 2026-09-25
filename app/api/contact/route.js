import { NextResponse } from "next/server";
import { Resend } from "resend";
import { validateContact } from "@/lib/validateContact";
import { profile } from "@/data/portfolio";

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const result = validateContact(body ?? {});

  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 400 });
  }

  const { firstName, lastName, email, message } = result.data;

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: profile.email,
      replyTo: email,
      subject: `New message from ${firstName} ${lastName}`,
      text: `${message}\n\n— ${firstName} ${lastName} <${email}>`,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[contact] failed to send email:", err);
    return NextResponse.json(
      { ok: false, errors: { form: "Couldn't send right now — try again in a bit." } },
      { status: 502 }
    );
  }
}
