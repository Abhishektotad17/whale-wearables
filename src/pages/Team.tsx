import React from "react";
import { Linkedin, Twitter, Github } from "lucide-react";
import Profile1 from '../assets/profile-pictures/user1.jpg';
import Profile2 from '../assets/profile-pictures/user2.jpg';

// Sample data
const teamMembers = [
  {
    name: "Abhishek Totad",
    role: "Full stack Engineer",
    bio: "Full-stack developer passionate about ecommerce and GenAI tools.",
    photo: Profile1,
    linkedin: "https://www.linkedin.com/in/abhishek-totad/",
    twitter: "https://twitter.com/abhishek",
    github: "https://github.com/abhishektotad17",
  },
  {
    name: "Jane Doe",
    role: "UI/UX Designer",
    bio: "Designing delightful user experiences and sleek interfaces.",
    photo: Profile2,
    linkedin: "https://linkedin.com/in/janedoe",
    twitter: "https://twitter.com/janedoe",
    github: "https://github.com/janedoe",
  },
];

const videos = [
  { title: "Our Journey", url: "https://www.youtube.com/embed/_Vk0yjqa5ik" },
  { title: "Podcast", url: "https://www.youtube.com/embed/lqLwY2J24ws" },
];

const values = [
  { title: "Innovation", desc: "We push boundaries to create cutting-edge products." },
  { title: "Customer First", desc: "Our users are at the heart of everything we do." },
  { title: "Sustainability", desc: "We care about people and the planet." },
];

const funFacts = [
  "Our team drinks 100+ cups of coffee weekly ☕",
  "We have 3 avid gamers and 2 yoga enthusiasts 🧘",
  "Our mascot is a blue whale 🐋",
];

const timeline = [
  { year: "2021", event: "Whale Wearables was founded" },
  { year: "2022", event: "Launched our first smart product" },
  { year: "2023", event: "Reached 10,000+ happy customers" },
];

const awards = [
  "Best Startup Award 2022",
  "Featured in TechCrunch",
  "Top 10 Wearable Startups in India",
];

const testimonials = [
  { name: "John Smith", text: "Working here has been the most rewarding experience!" },
  { name: "Emily Davis", text: "I love the culture and the creativity every day." },
];

const TeamPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-neutral-950 text-white px-6 lg:px-20 py-16 space-y-20">
      {/* Team Members */}
      <section>
        <h2 className="text-4xl font-bold mb-10 text-center">Meet Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member, i) => (
            <div key={i} className="bg-neutral-900 rounded-2xl p-6 shadow-lg text-center">
              <img
                src={member.photo}
                alt={member.name}
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-blue-400">{member.role}</p>
              <p className="text-neutral-400 mt-2">{member.bio}</p>
              <div className="flex justify-center space-x-4 mt-4">
                <a href={member.linkedin} target="_blank" rel="noreferrer"><Linkedin /></a>
                <a href={member.twitter} target="_blank" rel="noreferrer"><Twitter /></a>
                <a href={member.github} target="_blank" rel="noreferrer"><Github /></a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Videos */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Behind the Scenes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {videos.map((vid, i) => (
            <div key={i} className="aspect-w-16 aspect-h-9">
              <iframe
                src={vid.url}
                title={vid.title}
                className="w-full h-64 rounded-lg shadow-lg"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
              <p className="text-center mt-2 text-neutral-300">{vid.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values & Mission */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-8">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, i) => (
            <div key={i} className="bg-neutral-900 rounded-xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-2">{val.title}</h3>
              <p className="text-neutral-400">{val.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fun Facts */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Fun Facts</h2>
        <ul className="space-y-4 text-center text-neutral-300">
          {funFacts.map((fact, i) => (
            <li key={i}>✨ {fact}</li>
          ))}
        </ul>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-3xl font-bold mb-8 text-center">Our Journey</h2>
        <div className="space-y-6">
          {timeline.map((t, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="bg-blue-600 w-16 h-16 flex items-center justify-center rounded-full font-bold">
                {t.year}
              </div>
              <p className="text-neutral-300">{t.event}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Awards */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">Awards & Recognition</h2>
        <ul className="list-disc list-inside text-neutral-300 max-w-xl mx-auto">
          {awards.map((award, i) => (
            <li key={i}>{award}</li>
          ))}
        </ul>
      </section>

      {/* Testimonials */}
      <section>
        <h2 className="text-3xl font-bold mb-6 text-center">What Our Team Says</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((test, i) => (
            <div key={i} className="bg-neutral-900 rounded-xl p-6 shadow-md">
              <p className="text-neutral-300 italic mb-4">“{test.text}”</p>
              <h4 className="font-semibold">- {test.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <h2 className="text-3xl font-bold mb-4">Join Our Team</h2>
        <p className="text-neutral-400 mb-6">Want to be part of Whale Wearables? We're hiring!</p>
        <a
          href="/careers"
          className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold"
        >
          View Careers
        </a>
      </section>
    </div>
  );
};

export default TeamPage;
