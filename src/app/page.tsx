import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { MobileBookingBar } from "@/components/shared/mobile-booking-bar";
import { Hero } from "@/components/sections/hero";
import { Fleet } from "@/components/sections/fleet";
import { Story } from "@/components/sections/story";
import { Why } from "@/components/sections/why";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Gallery } from "@/components/sections/gallery";
import { Testimonials } from "@/components/sections/testimonials";
import { Faq } from "@/components/sections/faq";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Fleet />
        <Why />
        <HowItWorks />
        <Gallery />
        <Testimonials />
        <Story />
        <Faq />
        <Contact />
      </main>
      <Footer />
      <FloatingWhatsApp />
      <MobileBookingBar />
    </>
  );
}
