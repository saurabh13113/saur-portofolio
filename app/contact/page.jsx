"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import { profile, services } from "@/data/portfolio";
import Sign from "@/components/mc/Sign";
import Panel from "@/components/mc/Panel";
import BlockButton from "@/components/mc/BlockButton";

const info = [
  { icon: <FaPhoneAlt />, title: "Phone", value: profile.phone },
  { icon: <FaEnvelope />, title: "Email", value: profile.email },
  { icon: <FaMapMarkerAlt />, title: "Location", value: profile.location },
];

export default function Contact() {
  const [trade, setTrade] = useState("");
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
      formEl.reset();
      setTrade("");
    } catch {
      setErrors({ form: "Couldn't reach the server — check your connection and try again." });
      setStatus("error");
    }
  }

  return (
    <section className="container mx-auto py-12">
      <Sign className="mb-8">Book &amp; Quill</Sign>

      <div className="flex flex-col xl:flex-row gap-8">
        <Panel as="form" tex="stone" className="p-8 flex flex-col gap-5 text-[#f4e4c1] xl:w-[60%]" onSubmit={handleSubmit}>
          <h3 className="font-mc text-2xl text-emerald">Let&apos;s build something</h3>
          <p className="text-white/70 font-primary text-sm">Send a note and I&apos;ll get back to you.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="sr-only" htmlFor="contact-first">First name</label>
            <Input id="contact-first" name="contact-first" placeholder="First name" required className="mc-bevel bg-obsidian rounded-none" />
            <label className="sr-only" htmlFor="contact-last">Last name</label>
            <Input id="contact-last" name="contact-last" placeholder="Last name" required className="mc-bevel bg-obsidian rounded-none" />
            <label className="sr-only" htmlFor="contact-email">Email</label>
            <Input id="contact-email" name="contact-email" type="email" placeholder="Email" required className="mc-bevel bg-obsidian rounded-none" />
            <label className="sr-only" htmlFor="contact-phone">Phone</label>
            <Input id="contact-phone" name="contact-phone" placeholder="Phone" className="mc-bevel bg-obsidian rounded-none" />
          </div>
          {errors.firstName || errors.lastName || errors.email ? (
            <p role="alert" className="text-redstone text-xs">
              {errors.firstName ?? errors.lastName ?? errors.email}
            </p>
          ) : null}
          <Select value={trade} onValueChange={setTrade}>
            <SelectTrigger aria-label="Pick a trade" className="mc-bevel bg-obsidian rounded-none">
              <SelectValue placeholder="Pick a trade" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Trades</SelectLabel>
                {services.map((s) => (
                  <SelectItem key={s.num} value={s.num}>{s.title}</SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <label className="sr-only" htmlFor="contact-message">Message</label>
          <Textarea id="contact-message" name="contact-message" placeholder="Your message" required className="h-[160px] mc-bevel bg-obsidian rounded-none" />
          {errors.message ? <p role="alert" className="text-redstone text-xs">{errors.message}</p> : null}
          <BlockButton className="max-w-44" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending..." : "Send"}
          </BlockButton>
          {status === "sent" ? (
            <p role="status" className="text-emerald text-sm">Message sent — I&apos;ll get back to you soon.</p>
          ) : null}
          {status === "error" && errors.form ? (
            <p role="alert" className="text-redstone text-sm">{errors.form}</p>
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
                  <span className="font-mc">{it.value}</span>
                </span>
              </Panel>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
