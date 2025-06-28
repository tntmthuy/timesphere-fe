import { PageSectionWrapper } from "./PageSectionWrapper";

export const ContactSection = () => {
  return (
    <PageSectionWrapper>
      <section id="contact" className="bg-white px-4 py-16 text-black">
        <div className="w-full max-w-[1000px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="space-y-4 max-w-sm mx-auto">
              <div className="mx-auto rounded overflow-hidden shadow-md">
                <img
                  src="https://i.pinimg.com/736x/d7/32/a7/d732a751d3747c3bfe1e5cb1e16f6edc.jpg"
                  alt="Contact illustration"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>

            {/* Right: Form */}
            <form className="space-y-4 max-w-md w-full mx-auto">
              <h2 className="text-2xl font-bold">Let’s Optimize Your Time Together</h2>
              <p className="text-sm text-[#B3B1B0] leading-relaxed">
                Need help getting started or have questions about our time management tools?
                We’re here to help you work smarter, not harder.
              </p>
              <input
                type="email"
                placeholder="Your email"
                className="w-full border border-black rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <input
                type="text"
                placeholder="Your name"
                className="w-full border border-black rounded px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-black"
              />
              <textarea
                rows={4}
                placeholder="Your message"
                className="w-full border border-black rounded px-4 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-black"
              />
              <button
                type="submit"
                className="rounded border border-black bg-[#FFDE70] px-6 py-2 font-medium text-black transition hover:bg-black hover:text-[#FFF6EE]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </PageSectionWrapper>
  );
};