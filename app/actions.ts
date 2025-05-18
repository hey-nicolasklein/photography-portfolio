"use server"

import { z } from "zod"

// Define validation schema
const contactFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(2, "Subject must be at least 2 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message cannot exceed 1000 characters"),
})

export type ContactFormData = z.infer<typeof contactFormSchema>

export async function submitContactForm(formData: FormData) {
  // Simulate a delay for the API call
  await new Promise((resolve) => setTimeout(resolve, 1000))

  try {
    // Extract form data
    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    }

    // Validate form data
    const validatedData = contactFormSchema.parse(data)

    // In a real application, you would send this data to your email service
    // For example: await sendEmail(validatedData)
    console.log("Form submitted:", validatedData)

    // Return success response
    return {
      success: true,
      message: "Thank you for your message. I'll get back to you soon!",
    }
  } catch (error) {
    // Handle validation errors
    if (error instanceof z.ZodError) {
      const fieldErrors = error.errors.reduce(
        (acc, curr) => {
          const fieldName = curr.path[0] as string
          acc[fieldName] = curr.message
          return acc
        },
        {} as Record<string, string>,
      )

      return {
        success: false,
        fieldErrors,
        message: "Please correct the errors in the form.",
      }
    }

    // Handle other errors
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    }
  }
}
