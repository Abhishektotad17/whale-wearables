import React, { useState } from "react";
import { Mail, Phone, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import api from "../services/GlobalApi";

interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const Contact: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
        const response = await api.post("/contact",formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
  
        if (response.status === 200) {
          toast.success(
            "Message sent successfully! We'll get back to you within 24 hours."
          );
          setFormData({ name: "", email: "", subject: "", message: "" });
        }
      } catch (error: any) {
        console.error("Error submitting contact form:", error);
        if (error.response) {
          toast.error(error.response.data.message || "Something went wrong!");
        } else {
          toast.error("Unable to send message. Please try again later.");
        }
      } finally {
        setIsSubmitting(false);
      }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-6 lg:px-20 py-16">
      <h1 className="text-4xl font-bold text-center mb-6">Contact Us</h1>
      <p className="text-center text-neutral-400 mb-12">
        We'd love to hear from you. Fill out the form below or reach out directly.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="bg-neutral-900 rounded-2xl p-8 shadow-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-neutral-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-neutral-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Subject */}
            <div>
              <label className="block text-sm font-medium mb-2">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                className="w-full rounded-lg bg-neutral-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Subject"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-medium mb-2">Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                className="w-full rounded-lg bg-neutral-800 text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your message..."
                required
              />
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg px-4 py-3 font-semibold disabled:opacity-50"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>

        {/* Contact Info */}
        <div className="space-y-8">
          <div className="flex items-start space-x-4">
            <div className="bg-neutral-800 p-3 rounded-full">
              <Mail className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Email</h3>
              <p className="text-neutral-400">support@NextGearwearables.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-neutral-800 p-3 rounded-full">
              <Phone className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Phone</h3>
              <p className="text-neutral-400">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <div className="bg-neutral-800 p-3 rounded-full">
              <MapPin className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Address</h3>
              <p className="text-neutral-400">
                NextGear Wearables HQ <br />
                Bengaluru, Karnataka, India
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
