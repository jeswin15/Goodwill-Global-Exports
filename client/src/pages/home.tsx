import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { ArrowRight, CheckCircle, Package, Truck, Globe, Star, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEffect, useRef, useState } from "react";
import { store } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { Product } from "@/lib/data";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 100 } as const
  }
};

function CountUp({ end, duration = 2 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (inView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

        setCount(Math.floor(progress * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [inView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function Home() {
  const { scrollY } = useScroll();
  const yBg = useTransform(scrollY, [0, 500], [0, 150]); // Parallax effect for background
  const [testimonials, setTestimonials] = useState<any[]>(store.getTestimonials());
  const [products, setProducts] = useState<any[]>(store.getProducts());
  const [, setLocation] = useLocation();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    store.fetchTestimonials();
    store.fetchProducts();
    const unsubscribe = store.subscribe(() => {
      setTestimonials(store.getTestimonials());
      setProducts(store.getProducts());
    });
    return () => { unsubscribe(); };
  }, []);

  const featuredProducts = products.slice(0, 4);
  const relatedProducts = selectedProduct
    ? products.filter(p => p.category === selectedProduct.category && p.id !== selectedProduct.id).slice(0, 3)
    : [];

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative h-[90vh] w-full overflow-hidden">
        {/* Background Image with Overlay - Parallax */}
        <motion.div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url("/images/hero-bg.png")',
            y: yBg
          }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </motion.div>

        {/* Hero Content */}
        <div className="relative z-10 flex h-full items-center justify-center text-center">
          <div className="container px-4 md:px-6">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="mx-auto max-w-4xl space-y-6"
            >
              <motion.div variants={itemVariants} className="overflow-hidden">
                <h1 className="font-serif text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-4xl lg:text-6xl">
                  Connecting World Markets with <span className="text-secondary italic">Premium Quality</span>
                </h1>
              </motion.div>

              <motion.div variants={itemVariants}>
                <p className="mx-auto max-w-2xl text-lg text-gray-200 md:text-xl">
                  Your trusted partner in international B2B food trade. We source and export the finest raw ingredients directly to your business.
                </p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
                <Link href="/products">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" className="h-14 bg-secondary px-8 text-lg font-bold text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20">
                      Explore Products
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/contact">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button size="lg" variant="outline" className="h-14 border-white px-8 text-lg font-bold text-white hover:bg-white hover:text-primary backdrop-blur-sm bg-white/10">
                      Contact Us
                    </Button>
                  </motion.div>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-white to-transparent mx-auto" />
          <span className="text-xs uppercase tracking-widest mt-2 block">Scroll</span>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container px-4 relative z-10">
          <div className="text-center mb-8">
            <p className="text-secondary font-bold tracking-widest uppercase text-xs mb-1">
              "Better thinking is the best concept"
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            {[
              { label: "Countries Served", value: 50, suffix: "+" },
              { label: "Products Shipped", value: 100, suffix: "+ tons" },
              { label: "Client Satisfaction", value: 100, suffix: "%" },
            ].map((stat, idx) => (
              <div key={idx} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-secondary font-serif">
                  <CountUp end={stat.value} />{stat.suffix}
                </div>
                <div className="text-xs md:text-sm opacity-80 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-background">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="space-y-4 max-w-2xl">
              <span className="text-secondary font-bold tracking-wider uppercase text-sm">Our Collections</span>
              <h2 className="text-3xl md:text-5xl font-serif font-bold text-primary">Featured Global Products</h2>
              <p className="text-muted-foreground text-lg">Hand-picked selection of our finest exports, ready for international shipping.</p>
            </div>
            <Link href="/products">
              <Button variant="outline" className="group">
                View All Products <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          <Carousel className="w-full" opts={{ align: "start", loop: true }}>
            <CarouselContent className="-ml-4">
              {featuredProducts.map((product) => (
                <CarouselItem key={product.id} className="pl-4 md:basis-1/2 lg:basis-1/3">
                  <motion.div
                    whileHover={{ y: -10 }}
                    className="h-full cursor-pointer group"
                    onClick={() => {
                      setSelectedProduct(product);
                      setActiveImage(null);
                    }}
                  >
                    <Card className="h-full overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-500 bg-gradient-to-br from-white to-slate-50">
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                        <Badge
                          variant="secondary"
                          className={cn(
                            "absolute top-4 right-4 uppercase font-bold text-xs px-3 py-1.5 backdrop-blur-md border border-white/20 shadow-lg",
                            product.category === "Seasonal"
                              ? "bg-gradient-to-r from-amber-500/90 to-orange-500/90 text-white"
                              : "bg-gradient-to-r from-emerald-500/90 to-teal-500/90 text-white"
                          )}
                        >
                          {product.category}
                        </Badge>

                        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-end justify-center pb-8">
                          <Button
                            variant="outline"
                            className="text-white border-2 border-white hover:bg-white hover:text-primary font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl"
                          >
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </div>
                      <CardContent className="p-6 space-y-3">
                        <h3 className="text-xl font-bold font-serif text-primary group-hover:text-accent transition-colors duration-300 leading-tight">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-4 pt-2 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1.5">
                            <Globe className="h-3.5 w-3.5 text-accent" />
                            <span>Export Ready</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <ShieldCheck className="h-3.5 w-3.5 text-accent" />
                            <span>Certified</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-end gap-2 mt-8">
              <CarouselPrevious className="static translate-y-0" />
              <CarouselNext className="static translate-y-0" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Global Reach / Why Choose Us */}
      <section className="bg-slate-50 py-24 relative overflow-hidden">
        {/* World Map Background with Pulsing Dots */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <img src="https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg" alt="World Map" className="w-full h-full object-cover grayscale" />
        </div>

        {/* Animated Dots for Regions */}
        {[
          { top: '30%', left: '20%', label: 'North America' },
          { top: '40%', left: '48%', label: 'Europe/GCC' },
          { top: '50%', left: '70%', label: 'Asia' },
          { top: '70%', left: '30%', label: 'South America' },
        ].map((dot, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-secondary rounded-full z-0"
            style={{ top: dot.top, left: dot.left }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.5, duration: 0.5 }}
          >
            <motion.div
              className="absolute inset-0 bg-secondary rounded-full"
              animate={{ scale: [1, 2], opacity: [0.5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          </motion.div>
        ))}

        <div className="container px-4 md:px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-secondary font-bold tracking-wider uppercase text-sm">Why Choose Us</span>
            <h2 className="font-serif text-3xl font-bold tracking-tight text-primary md:text-5xl mt-2">Excellence Across Borders</h2>
            <p className="mt-4 text-muted-foreground text-lg">We handle the complexities of international trade so you can focus on your business.</p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                icon: Package,
                title: "Premium Quality Audit",
                description: "Every shipment undergoes a rigorous 5-step quality check process before dispatch."
              },
              {
                icon: MapPin,
                title: "Global Logistics Network",
                description: "Strategic partnerships with major shipping lines ensure priority handling."
              },
              {
                icon: CheckCircle,
                title: "Certified Compliance",
                description: "Full documentation support including Phyto, Origin, and Quality certificates."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                whileHover={{ y: -5 }}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl hover:border-secondary/20 transition-all duration-300 group"
              >
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <feature.icon className="h-8 w-8" />
                </div>
                <h3 className="mb-3 text-2xl font-bold text-primary font-serif">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-white overflow-hidden">
        <div className="container px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold">Trusted by Global Partners</h2>
          </div>

          <Carousel className="w-full max-w-5xl mx-auto" opts={{ loop: true, align: "center" }}>
            <CarouselContent>
              {testimonials.length > 0 ? (
                testimonials.map((t, i) => (
                  <CarouselItem key={i} className="md:basis-1/2 lg:basis-1/3">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      whileHover={{
                        scale: 1.05,
                        rotateY: 5,
                        rotateX: -5,
                        boxShadow: "0 20px 30px -10px rgba(0,0,0,0.3)"
                      }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
                      className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 h-full flex flex-col justify-between"
                    >
                      <div style={{ transform: "translateZ(20px)" }}>
                        <div className="flex gap-1 mb-4 text-secondary">
                          {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-secondary" />)}
                        </div>
                        <p className="text-base italic mb-6 text-white/90">"{t.content}"</p>
                      </div>
                      <div className="flex items-center gap-4" style={{ transform: "translateZ(20px)" }}>
                        <Avatar>
                          <AvatarImage src={t.image} />
                          <AvatarFallback>{t.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-bold">{t.name}</div>
                          <div className="text-sm text-white/70">{t.role}</div>
                        </div>
                      </div>
                    </motion.div>
                  </CarouselItem>
                ))
              ) : (
                <div className="text-center w-full p-8 text-white/50">
                  No testimonials yet. Check back soon!
                </div>
              )}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 bg-secondary/10" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="bg-white rounded-3xl p-8 md:p-16 shadow-2xl border border-secondary/20 flex flex-col md:flex-row items-center justify-between gap-12 text-center md:text-left">
            <div className="space-y-6 max-w-2xl">
              <h2 className="font-serif text-3xl font-bold md:text-5xl text-primary">Ready to expand your supply chain?</h2>
              <p className="text-xl text-muted-foreground">Get in touch with our export specialists for a custom quote tailored to your market needs.</p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link href="/contact">
                  <Button size="lg" className="bg-primary text-white hover:bg-primary/90 text-lg px-8 h-14">
                    Request Quote <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/products">
                  <Button size="lg" variant="outline" className="text-lg px-8 h-14">
                    View Catalog
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-secondary/20 blur-3xl rounded-full" />
              <div className="relative bg-white p-4 rounded-2xl shadow-xl rotate-3">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=2670&auto=format&fit=crop"
                  alt="Shipping"
                  className="w-64 h-64 object-cover rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Floating Contact Button */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Link href="/contact">
          <Button className="h-14 w-14 rounded-full bg-green-500 hover:bg-green-600 shadow-lg shadow-green-500/30 p-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </Button>
        </Link>
      </motion.div>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={(open) => {
        if (!open) {
          setSelectedProduct(null);
          setActiveImage(null);
        }
      }}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-white h-[90vh] md:h-auto md:max-h-[90vh] flex flex-col md:flex-row">
          <div className="md:w-1/2 bg-muted p-6 flex flex-col gap-4">
            <div className="aspect-square w-full rounded-lg overflow-hidden bg-white relative">
              <img
                src={activeImage || selectedProduct?.image}
                alt={selectedProduct?.name}
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>

            {/* Gallery Thumbnails */}
            {selectedProduct?.gallery && selectedProduct.gallery.length > 0 && (
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
                <button
                  onClick={() => setActiveImage(null)}
                  className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${!activeImage ? 'border-primary' : 'border-slate-200 hover:border-primary/50'}`}
                >
                  <img src={selectedProduct.image} alt="Main" className="w-full h-full object-cover" />
                </button>
                {selectedProduct.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 transition-all ${activeImage === img ? 'border-primary' : 'border-slate-200 hover:border-primary/50'}`}
                  >
                    <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-1/2 p-8 overflow-y-auto bg-white">
            <DialogHeader className="mb-6 text-left">
              <div className="flex items-center gap-2 mb-2 text-accent">
                <ShieldCheck className="h-5 w-5" />
                <span className="text-xs font-bold uppercase tracking-widest">Certified Origin</span>
              </div>
              <DialogTitle className="text-3xl font-serif text-primary leading-tight">
                {selectedProduct?.name}
              </DialogTitle>
              <Badge className="w-fit mt-2 bg-secondary text-primary border-none">
                {selectedProduct?.category} Category
              </Badge>
            </DialogHeader>

            <div className="space-y-6">
              <div>
                <h4 className="font-bold text-sm uppercase text-muted-foreground mb-2 flex items-center gap-2">
                  <Globe className="h-4 w-4" /> Product Description
                </h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedProduct?.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-6 border-t">
                <div>
                  <span className="block text-[10px] font-bold uppercase text-muted-foreground">Standard</span>
                  <span className="text-sm font-semibold text-primary">ISO 22000 Certified</span>
                </div>
                <div>
                  <span className="block text-[10px] font-bold uppercase text-muted-foreground">Logistics</span>
                  <span className="text-sm font-semibold text-primary">Global Air/Sea Freight</span>
                </div>
              </div>

              <Button
                onClick={() => setLocation("/quote")}
                className="w-full h-12 bg-primary text-white hover:bg-primary/90 mt-8 btn-hover-effect uppercase tracking-widest font-bold"
              >
                Request Quote for this Product
              </Button>

              {/* Related Products */}
              {relatedProducts.length > 0 && (
                <div className="pt-8 border-t mt-8">
                  <h4 className="font-bold text-sm uppercase text-muted-foreground mb-4">Related Products</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {relatedProducts.map(rp => (
                      <div
                        key={rp.id}
                        className="group cursor-pointer"
                        onClick={() => {
                          setSelectedProduct(rp);
                          setActiveImage(null);
                        }}
                      >
                        <div className="aspect-square bg-muted rounded-md overflow-hidden mb-2">
                          <img src={rp.image} alt={rp.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                        </div>
                        <p className="text-xs font-bold text-center group-hover:text-accent truncate">{rp.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
