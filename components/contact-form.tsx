"use client"

import { useState } from "react"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { motion } from "framer-motion"
import { submitContactForm } from "@/app/actions"
import { CheckCircle, Loader2 } from "lucide-react"

const initialState = {
  success: false,
  message: "",
  fieldErrors: {},
}

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="px-6 py-3 bg-black text-white hover:bg-gray-800 disabled:bg-gray-400 transition-colors"
    >
      {pending ? (
        <span className="flex items-center">
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Sending...
        </span>
      ) : (
        "Send Message"
      )}
    </button>
  )
}

export default function ContactForm() {
  const [state, formAction] = useActionState(submitContactForm, initialState)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (formData: FormData) => {
    formAction(formData)
    setSubmitted(true)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {state.success && submitted ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 p-8 text-center"
        >
          <CheckCircle className="w-12 h-12 text-black mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Message Sent</h3>
          <p className="text-gray-600 mb-6">{state.message}</p>
          <button
            onClick={() => setSubmitted(false)}
            className="px-6 py-2 border border-black hover:bg-black hover:text-white transition-colors"
          >
            Send Another Message
          </button>
        </motion.div>
      ) : (
        <form action={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className={`w-full px-4 py-2 border ${
                  state.fieldErrors?.name ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-black`}
              />
              {state.fieldErrors?.name && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`w-full px-4 py-2 border ${
                  state.fieldErrors?.email ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-1 focus:ring-black`}
              />
              {state.fieldErrors?.email && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.email}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="subject" className="block text-sm font-medium">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              className={`w-full px-4 py-2 border ${
                state.fieldErrors?.subject ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-black`}
            />
            {state.fieldErrors?.subject && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.subject}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="message" className="block text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={6}
              required
              className={`w-full px-4 py-2 border ${
                state.fieldErrors?.message ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-1 focus:ring-black`}
            />
            {state.fieldErrors?.message && <p className="text-red-500 text-xs mt-1">{state.fieldErrors.message}</p>}
          </div>

          {state.message && !state.success && !state.fieldErrors && (
            <div className="bg-red-50 p-4 text-red-800 text-sm">{state.message}</div>
          )}

          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      )}
    </div>
  )
}
