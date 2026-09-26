"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FaEnvelope, FaMapMarkerAlt, FaLinkedin } from "react-icons/fa";
import { profile, services } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Panel from "@/components/mc/Panel";
import BlockButton from "@/components/mc/BlockButton";

const info = [
  { icon: <FaEnvelope />, title: "Email", value: profile.email, href: `mailto:${profile.email}` },
  { icon: <FaLinkedin />, title: "LinkedIn", value: "in/saurabh-nair", href: profile.socials.find((s) => s.key === "linkedin").href },
  { icon: <FaMapMarkerAlt />, title: "Location", value: profile.location },
];

// Recruiters first, then the services, then everyone else.
const TOPICS = ["Job / internship opportunity", "Collaboration", ...services.map((s) => s.title), "Just saying hi"];

const FIELD = "mc-bevel bg-obsidian rounded-none";

function Field({ id, label, required = false, children }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="font-mc text-xs text-white/70">
        {label}
        {required ? <span className="text-[#f4d27a]"> *</span> : <span className="text-white/40"> (optional)</span>}
      </label>
      {children}
    </div>
  );
}

export default function Contact() {
  const [topic, setTopic] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();
    const formEl = e.currentTarget; // capture before any await — React nulls e.currentTarget after this handler returns
    setStatus("sending");
    setErrors({});

    const form = new FormData(formEl);
    const payload = {
      firstName: form.get("contact-first"),
      lastName: form.get("contact-last"),
      email: form.get("contact-email"),
      message: form.get("contact-message"),
      phone: form.get("contact-phone"),
      service: topic,
      company: form.get("company"), // honeypot, see below
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.ok) {
        setErrors(data.errors ?? {});
        setStatus("error");
        return;
      }
      setStatus("sent");
      window.dispatchEvent(new Event("avatar:cheer")); // the sidebar me celebrates
      formEl.reset();
      setTopic("");
    } catch {
      setErrors({ form: "Couldn't reach the server — check your connection and try again." });
      setStatus("error");
    }
  }

  return (
    <section className="container mx-auto py-8">
      <Sign className="mb-8">Contact</Sign>

      <div className="flex flex-col xl:flex-row gap-8">
        <Panel as="form" tex="stone" className="p-8 flex flex-col gap-5 text-[#f4e4c1] xl:w-[60%]" onSubmit={handleSubmit}>
          <h3 className="font-mc text-2xl text-emerald">Let&apos;s build something</h3>
          <p className="text-white/70 font-primary text-sm">Send a note and I&apos;ll get back to you.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Field id="contact-first" label="First name" required>
              <Input id="contact-first" name="contact-first" autoComplete="given-name" required className={FIELD} />
            </Field>
            <Field id="contact-last" label="Last name" required>
              <Input id="contact-last" name="contact-last" autoComplete="family-name" required className={FIELD} />
            </Field>
            <Field id="contact-email" label="Email" required>
              <Input id="contact-email" name="contact-email" type="email" autoComplete="email" required className={FIELD} />
            </Field>
            <Field id="contact-phone" label="Phone">
              <Input id="contact-phone" name="contact-phone" type="tel" autoComplete="tel" className={FIELD} />
            </Field>
          </div>
          {errors.firstName || errors.lastName || errors.email || errors.phone ? (
            <p role="alert" className="text-redstone text-xs">
              {errors.firstName ?? errors.lastName ?? errors.email ?? errors.phone}
            </p>
          ) : null}
          <Field id="contact-topic" label="What's this about?">
            <Select value={topic} onValueChange={setTopic}>
              <SelectTrigger id="contact-topic" className={FIELD}>
                <SelectValue placeholder="Pick one" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {TOPICS.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          {/* spam trap: hidden from people (and screen readers); bots fill every field */}
          <div aria-hidden="true" className="absolute -left-[9999px] w-px h-px overflow-hidden">
            <label htmlFor="contact-company">Company</label>
            <input id="contact-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>
          <Field id="contact-message" label="Message" required>
            <Textarea id="contact-message" name="contact-message" required className={`h-[160px] ${FIELD}`} />
          </Field>
          {errors.message ? <p role="alert" className="text-redstone text-xs">{errors.message}</p> : null}
          <BlockButton className="max-w-52 normal-case" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send message"}
          </BlockButton>
          {status === "sent" ? (
            <p role="status" className="text-emerald text-sm">Message sent — I&apos;ll get back to you soon.</p>
          ) : null}
          {status === "error" && errors.form ? (
            <p role="alert" className="text-redstone text-sm">
              {errors.form} Or email me directly at{" "}
              <a href={`mailto:${profile.email}`} className="underline text-[#f4d27a]">{profile.email}</a>.
            </p>
          ) : null}
        </Panel>

        <ul className="flex flex-col gap-4 xl:w-[40%]">
          {info.map((it) => (
            <li key={it.title}>
              <Panel tex="dirt" className="p-4 flex items-center gap-4 text-[#f4e4c1]">
                <span className="mc-bevel tex-obsidian w-12 h-12 flex items-center justify-center text-emerald text-xl">
                  {it.icon}
                </span>
                <span>
                  <span className="block text-white/60 font-primary text-xs">{it.title}</span>
                  {it.href ? (
                    <a href={it.href} {...(it.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})} className="font-mc hover:text-[#f4d27a] underline-offset-4 hover:underline">{it.value}</a>
                  ) : (
                    <span className="font-mc">{it.value}</span>
                  )}
                </span>
              </Panel>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
