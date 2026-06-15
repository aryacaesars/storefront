"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export function ContactFormClient() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [subject, setSubject] = useState("Technical Support")
  const [message, setMessage] = useState("")

  return (
    <div className="rounded-sm border border-gray-200 bg-white p-7">
      <h3 className="mb-6 text-base font-bold text-zinc-900">Send a Message</h3>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        {/* Row 1 — name + email */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="h-10 w-full border border-gray-200 px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@momentum.com"
              className="h-10 w-full border border-gray-200 px-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400"
            />
          </div>
        </div>

        {/* Subject */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Subject
          </label>
          <div className="relative">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="h-10 w-full cursor-pointer appearance-none border border-gray-200 bg-white px-3 text-sm text-zinc-500 outline-none"
            >
              <option>Technical Support</option>
              <option>Order Inquiry</option>
              <option>Partnership</option>
              <option>Press &amp; Media</option>
              <option>General Questions</option>
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-3 top-3 h-4 w-4 text-zinc-400"
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500">
            Your Message
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="How can we help your performance journey?"
            rows={5}
            className="w-full resize-none border border-gray-200 px-3 py-2.5 text-sm text-zinc-700 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-400"
          />
        </div>

        <button
          type="submit"
          className="mt-2 h-12 w-full text-xs font-black uppercase tracking-[0.15em] text-white transition-opacity hover:opacity-90"
          style={{ backgroundColor: "var(--theme-primary)" }}
        >
          SEND ENQUIRY
        </button>
      </form>
    </div>
  )
}
