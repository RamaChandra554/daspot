import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import emailjs from "@emailjs/browser";
import { motion, type Variants } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FlipMenu } from "@/components/FlipMenu";
import daSpotLogo from "@/assets/da-spot-logo.jpeg";
import gallery1 from "@/assets/gallery-1.png";
import gallery2 from "@/assets/gallery-2.png";
import gallery3 from "@/assets/gallery-3.png";
import gallery4 from "@/assets/gallery-4.png";
import gallery5 from "@/assets/gallery-5.png";
import gallery6 from "@/assets/gallery-6.png";



const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Menu", href: "#menubook" },
  { name: "Gallery", href: "#gallery" },
  { name: "Reviews", href: "#reviews" },
];

const reviews = [
  {
    quote: "The Dragon Paneer was unlike anything I've tasted — bold, perfectly spiced, and presented with such elegance.",
    name: "Arjun M."
  },
  {
    quote: "DA SPOT isn't just a restaurant. It's an experience. The ambiance, the service, the food — all flawless.",
    name: "Priya S."
  },
  {
    quote: "Every dish arrived like a piece of art. The Kung Pao Chicken had the perfect balance of heat and flavor.",
    name: "Rohit K."
  }
];

const gallery = [
  gallery1,
  gallery2,
  gallery3,
  gallery4,
  gallery5,
  gallery6,
];

const TIME_SLOTS = {
  Lunch: ["12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"],
  Dinner: ["6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM", "10:00 PM"],
};

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().min(10, "Phone must be at least 10 digits."),
  guests: z.coerce.number().min(1, "At least 1 guest.").max(10, "Maximum 10 guests."),
  date: z.string().min(1, "Please select a date."),
  time: z.string().min(1, "Please select a time slot."),
});

type FormValues = z.infer<typeof formSchema>;

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

function App() {
  const { toast } = useToast();
  const [isNavScrolled, setIsNavScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // if (typeof window !== "undefined") {
  //   window.addEventListener("scroll", () => {
  //     setIsNavScrolled(window.scrollY > 50);
  //   });
  // }

  useEffect(() => {
    const handleScroll = () => {
      setIsNavScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight") setLightboxIndex(i => i !== null ? (i + 1) % gallery.length : null);
      if (e.key === "ArrowLeft") setLightboxIndex(i => i !== null ? (i - 1 + gallery.length) % gallery.length : null);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guests: undefined,
      date: "",
      time: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);
    try {
      if (EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY) {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            guest_name: values.name,
            guest_email: values.email,
            guest_phone: values.phone,
            guest_count: values.guests,
            reservation_date: new Date(values.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            reservation_time: values.time,
          },
          EMAILJS_PUBLIC_KEY
        );
      }
      toast({
        title: "Reservation Confirmed",
        description: EMAILJS_PUBLIC_KEY
          ? `A confirmation has been sent to ${values.email}.`
          : "Your table has been reserved. We'll see you soon.",
      });
      form.reset();
    } catch {
      toast({
        title: "Something went wrong",
        description: "We couldn't send your confirmation email. Please call us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary selection:text-white">
      {/* STICKY NAV */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${isNavScrolled
            ? "bg-background/80 backdrop-blur-md border-b border-border py-4"
            : "bg-transparent py-6"
          }`}
      >
        <div className="container mx-auto px-6">

          {/* Top Navbar */}
          <div className="flex items-center justify-between">

            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() =>
                window.scrollTo({ top: 0, behavior: "smooth" })
              }
            >
              <img
                src={daSpotLogo}
                alt="DA SPOT Logo"
                className="w-10 h-10 object-cover rounded-full border border-border"
              />

              <span className="font-serif font-bold text-xl tracking-widest text-primary-foreground">
                DA SPOT
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => scrollTo(link.href.substring(1))}
                  className="text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors relative group"
                >
                  {link.name}

                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all group-hover:w-full"></span>
                </button>
              ))}

              <button
                onClick={() => scrollTo("reserve")}
                className="px-6 py-2 border border-primary text-primary text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-all duration-300"
              >
                Reserve Table
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-foreground"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <div className="space-y-1">
                <span
                  className={`block h-0.5 w-6 bg-current transition-all ${mobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
                    }`}
                ></span>

                <span
                  className={`block h-0.5 w-6 bg-current transition-all ${mobileMenuOpen ? "opacity-0" : ""
                    }`}
                ></span>

                <span
                  className={`block h-0.5 w-6 bg-current transition-all ${mobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
                    }`}
                ></span>
              </div>
            </button>
          </div>

          {/* Mobile Dropdown */}
          <div
            className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen
                ? "max-h-[500px] opacity-100 mt-6"
                : "max-h-0 opacity-0"
              }`}
          >
            <div className="flex flex-col gap-5 bg-background/95 backdrop-blur-md border border-border rounded-2xl p-6 shadow-xl">

              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => {
                    scrollTo(link.href.substring(1));
                    setMobileMenuOpen(false);
                  }}
                  className="text-sm tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors text-left"
                >
                  {link.name}
                </button>
              ))}

              <button
                onClick={() => {
                  scrollTo("reserve");
                  setMobileMenuOpen(false);
                }}
                className="w-full px-6 py-3 border border-primary text-primary text-sm tracking-widest uppercase hover:bg-primary hover:text-white transition-all duration-300 rounded-lg"
              >
                Reserve Table
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,46,46,0.15)_0%,transparent_50%)] pointer-events-none"></div>
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="relative z-10 text-center flex flex-col items-center"
        >
          <motion.div variants={fadeInUp} className="mb-8 relative group">
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-xl group-hover:bg-primary/40 transition-all duration-700"></div>
            <img src={daSpotLogo} alt="DA SPOT" className="w-48 h-48 md:w-56 md:h-56 object-cover rounded-full border border-white/10 shadow-2xl relative z-10" />
          </motion.div>

          <motion.h1 variants={fadeInUp} className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold tracking-[0.15em] mb-4">
            DA SPOT
          </motion.h1>

          <motion.div variants={fadeInUp} className="flex items-center gap-6 mb-6">
            <span className="w-12 h-px bg-border"></span>
            <span className="text-muted-foreground tracking-[0.3em] text-xs uppercase">ESTD 2024</span>
            <span className="w-12 h-px bg-border"></span>
          </motion.div>

          <motion.p variants={fadeInUp} className="font-serif italic text-xl md:text-2xl text-muted-foreground mb-10">
            Luxury Dining Experience
          </motion.p>

          <motion.div variants={fadeInUp} className="w-[60px] h-px bg-primary mb-10"></motion.div>

          <motion.button
            variants={fadeInUp}
            onClick={() => scrollTo('reserve')}
            className="px-10 py-4 bg-primary text-white tracking-widest uppercase text-sm font-medium hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(255,46,46,0.3)]"
          >
            Reserve Table
          </motion.button>
        </motion.div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about" className="py-32 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          className="max-w-3xl mx-auto text-center"
        >
          <p className="text-primary tracking-[0.3em] text-xs font-bold mb-6">— OUR STORY —</p>
          <h2 className="font-serif text-4xl md:text-5xl font-bold mb-10 leading-tight">Where Every Dish Tells A Story</h2>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-16">
            Nestled in the heart of the city, DA SPOT was born from a singular obsession — the pursuit of extraordinary flavor. Since 2024, we have crafted each dish with intention, precision, and passion. A dining experience unlike any other awaits you.
          </p>

          <div className="grid grid-cols-3 gap-8 border-t border-border pt-16">
            <div>
              <div className="text-4xl md:text-5xl font-serif text-primary mb-2">500+</div>
              <div className="text-sm tracking-widest text-muted-foreground uppercase">Dishes Served</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-serif text-primary mb-2">4.9</div>
              <div className="text-sm tracking-widest text-muted-foreground uppercase">Guest Rating</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-serif text-primary mb-2">2024</div>
              <div className="text-sm tracking-widest text-muted-foreground uppercase">Established</div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FLIP MENU BOOK SECTION */}
      <section id="menubook" className="py-32 bg-[#080808]">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className="text-center mb-16 px-6">
            <p className="text-primary tracking-[0.3em] text-xs font-bold mb-4">— BROWSE THE BOOK —</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold mb-4">The Menu Book</h2>
            <p className="font-serif italic text-muted-foreground text-lg">Turn the pages to explore our full collection</p>
            <div className="w-12 h-px bg-primary mx-auto mt-6" />
          </motion.div>

          <motion.div variants={fadeInUp} className="flex justify-center px-2">
            <FlipMenu />
          </motion.div>
        </motion.div>
      </section>

      {/* GALLERY SECTION */}
      <section id="gallery" className="py-12 md:py-32 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-8 md:mb-16">
            <p className="text-primary tracking-[0.3em] text-xs font-bold mb-4">— THE EXPERIENCE —</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">A Feast For The Eyes</h2>
          </motion.div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-3 md:gap-4">
            {gallery.map((img, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                onClick={() => setLightboxIndex(idx)}
                className="aspect-square overflow-hidden border border-transparent hover:border-primary/50 transition-colors duration-300 group cursor-pointer"
                data-testid={`gallery-image-${idx}`}
              >
                <img src={img} alt={`Gallery image ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* REVIEWS SECTION */}
      <section id="reviews" className="py-12 md:py-32 bg-[#111] px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="container mx-auto"
        >
          <motion.div variants={fadeInUp} className="text-center mb-8 md:mb-16">
            <p className="text-primary tracking-[0.3em] text-xs font-bold mb-4">— GUEST VOICES —</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">What Our Guests Say</h2>
          </motion.div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8">
            {reviews.map((review, idx) => (
              <motion.div
                key={idx}
                variants={fadeInUp}
                className="bg-background border border-white/[0.07] p-2.5 sm:p-5 md:p-8 flex flex-col items-center text-center group hover:border-primary/30 transition-colors"
              >
                <div className="flex gap-0.5 sm:gap-1 text-primary mb-2 sm:mb-4 md:mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={8} className="sm:w-3 sm:h-3 md:w-4 md:h-4" fill="currentColor" />
                  ))}
                </div>
                <p className="font-serif italic text-[8px] sm:text-xs md:text-lg text-muted-foreground mb-2 sm:mb-4 md:mb-8 leading-snug">"{review.quote}"</p>
                <div className="mt-auto">
                  <p className="font-bold tracking-wider uppercase text-[7px] sm:text-xs md:text-sm mb-0.5 sm:mb-1">{review.name}</p>
                  <p className="text-[6px] sm:text-[10px] md:text-xs text-primary uppercase tracking-widest">Verified Guest</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* RESERVATION SECTION */}
      <section id="reserve" className="py-32 px-6">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="container mx-auto max-w-[560px]"
        >
          <div className="text-center mb-12">
            <p className="text-primary tracking-[0.3em] text-xs font-bold mb-4">— JOIN US —</p>
            <h2 className="font-serif text-4xl md:text-5xl font-bold">Reserve Your Table</h2>
            <p className="text-muted-foreground text-sm mt-4">
              A confirmation will be sent to your email.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Full Name"
                        {...field}
                        className="bg-[#111] border-0 border-b border-border rounded-none px-2 py-6 text-lg focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Email Address"
                        type="email"
                        {...field}
                        className="bg-[#111]  border-0 border-b border-border rounded-none px-2 py-6 text-lg focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        placeholder="Phone Number"
                        type="tel"
                        {...field}
                        className="bg-[#111] border-0 border-b border-border rounded-none px-2 py-6 text-lg focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50 transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="guests"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Guests"
                          type="number"
                          min="1"
                          max="10"
                          {...field}
                          value={field.value ?? ""}
                          className="bg-[#111] border-0 border-b border-border rounded-none px-2 py-6 text-lg focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50 transition-colors"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={new Date().toISOString().split("T")[0]}
                          className="bg-[#111] border-0 border-b border-border rounded-none px-2 py-6 text-lg focus-visible:ring-0 focus-visible:border-primary text-foreground transition-colors [color-scheme:dark]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* TIME SLOT PICKER */}
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem>
                    <div className="pt-2 space-y-4">
                      {(Object.entries(TIME_SLOTS) as [string, string[]][]).map(([period, slots]) => (
                        <div key={period}>
                          <p className="text-[10px] tracking-[0.3em] uppercase text-muted-foreground/60 mb-3">
                            — {period} —
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {slots.map((slot) => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => field.onChange(slot)}
                                className={`px-4 py-2 text-sm tracking-widest border transition-all duration-200 ${field.value === slot
                                    ? "border-primary bg-primary text-white shadow-[0_0_12px_rgba(255,46,46,0.4)]"
                                    : "border-border text-muted-foreground hover:border-primary/60 hover:text-primary"
                                  }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <FormMessage className="pt-1" />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-8 mt-8 bg-primary text-white tracking-widest uppercase text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
              >
                {isSubmitting ? "Sending…" : "Confirm Reservation"}
              </Button>

              <p className="text-center text-muted-foreground text-sm mt-6">
                Questions? Call us at <span className="text-primary">+91 98765 43210</span>
              </p>
            </form>
          </Form>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="bg-background py-16 border-t border-white/[0.05]">
        <div className="container mx-auto px-6 text-center">
          <img src={daSpotLogo} alt="DA SPOT Logo" className="w-16 h-16 object-cover rounded-full mx-auto mb-6 opacity-80 grayscale" />
          <h2 className="font-serif font-bold text-2xl tracking-[0.2em] mb-2">DA SPOT</h2>
          <p className="text-muted-foreground tracking-[0.3em] text-xs mb-10">ESTD 2024</p>

          <div className="flex flex-wrap justify-center gap-6 mb-10">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => scrollTo(link.href.substring(1))}
                className="text-xs tracking-widest uppercase text-muted-foreground hover:text-primary transition-colors"
              >
                {link.name}
              </button>
            ))}
          </div>

          <div className="w-24 h-px bg-primary/50 mx-auto mb-10"></div>

          <p className="text-[10px] text-muted-foreground/50 tracking-widest uppercase">
            © 2024 DA SPOT. All Rights Reserved.
          </p>
        </div>
      </footer>

      {/* LIGHTBOX MODAL */}
      {lightboxIndex !== null && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm"
          onClick={() => setLightboxIndex(null)}
          data-testid="lightbox-overlay"
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors p-2"
            data-testid="lightbox-close"
          >
            <X size={28} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex - 1 + gallery.length) % gallery.length); }}
            className="absolute left-3 md:left-8 text-white/70 hover:text-white transition-colors p-2"
            data-testid="lightbox-prev"
          >
            <ChevronLeft size={36} />
          </button>

          <motion.img
            key={lightboxIndex}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            src={gallery[lightboxIndex]}
            alt={`Gallery image ${lightboxIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] md:max-w-[80vw] object-contain shadow-2xl"
            data-testid="lightbox-image"
          />

          <button
            onClick={(e) => { e.stopPropagation(); setLightboxIndex((lightboxIndex + 1) % gallery.length); }}
            className="absolute right-3 md:right-8 text-white/70 hover:text-white transition-colors p-2"
            data-testid="lightbox-next"
          >
            <ChevronRight size={36} />
          </button>

          <div className="absolute bottom-5 flex gap-2">
            {gallery.map((_, i) => (
              <button
                key={i}
                onClick={(e) => { e.stopPropagation(); setLightboxIndex(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === lightboxIndex ? "bg-primary" : "bg-white/30"}`}
                data-testid={`lightbox-dot-${i}`}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default App;
