import { motion, useInView } from "framer-motion";
import { BadgeCheck, Target, TrendingUp, Award, Users, Globe2, Sparkles } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

// Counter Animation Component
function CountUp({ end, duration = 2 }: { end: number, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / (duration * 1000), 1);

      setCount(Math.floor(progress * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, end, duration]);

  return <span ref={ref}>{count}</span>;
}

export default function About() {
  return (
    <div className="w-full">
      {/* Header with Gradient */}
      <div className="relative bg-gradient-to-br from-primary via-primary/90 to-accent py-20 md:py-32 overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container px-4 text-center relative z-10 md:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-serif text-4xl font-bold tracking-tight text-white md:text-6xl mb-4">
              Our Story
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90 leading-relaxed">
              A legacy of trust, quality, and global partnerships in the food export industry.
            </p>
          </motion.div>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white" />
          </svg>
        </div>
      </div>

      <div className="container px-4 py-16 md:px-6">
        {/* Story Section with Glassmorphism */}
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center mb-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-block">
              <span className="text-accent font-bold tracking-wider uppercase text-sm bg-accent/10 px-4 py-2 rounded-full">
                Since 2009
              </span>
            </div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary leading-tight">
              Global Reach, Local Roots
            </h2>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Founded with a vision to bridge the gap between premium local producers and international markets, GOODWILL GLOBAL EXPORTS has grown into a leading name in the B2B food export sector.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              We specialize in sourcing high-quality spices, grains, and seasonal produce directly from certified farms. Our rigorous quality control ensures that our clients receive products that meet international standards of excellence.
            </p>

            {/* Mission & Vision Cards */}
            <div className="grid gap-6 pt-6 sm:grid-cols-2">
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 p-6 border border-emerald-200/50 shadow-lg"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-emerald-500/10 rounded-full blur-2xl" />
                <Target className="h-8 w-8 text-emerald-600 mb-3" />
                <h3 className="font-bold text-primary mb-2">Our Mission</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To deliver the finest raw food products globally while empowering sustainable farming practices.
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden rounded-xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 p-6 border border-amber-200/50 shadow-lg"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500/10 rounded-full blur-2xl" />
                <TrendingUp className="h-8 w-8 text-amber-600 mb-3" />
                <h3 className="font-bold text-primary mb-2">Our Vision</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  To become the most trusted global partner in the agricultural supply chain.
                </p>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square overflow-hidden rounded-2xl bg-muted md:aspect-[4/3] shadow-2xl"
          >
            <img
              src="/images/about-bg.png"
              alt="Warehouse Interior"
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
        </div>

        {/* Stats Section with Animated Counters */}
        <div className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
              Our Impact in Numbers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Trusted by businesses worldwide for quality and reliability
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: "Countries Served", value: 20, suffix: "+", icon: Globe2, gradient: "from-primary to-primary/90" },
              { label: "Partner Farms", value: 100, suffix: "+", icon: Users, gradient: "from-primary to-primary/90" },
              { label: "Tons Exported", value: 50, suffix: "k+", icon: Sparkles, gradient: "from-primary to-primary/90" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="w-full sm:w-[calc(50%-1.5rem)] md:w-[calc(33.33%-1.5rem)] max-w-sm"
              >
                <Card className={`relative overflow-hidden border-none shadow-xl bg-gradient-to-br ${stat.gradient} p-6 text-white h-full`}>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                  <div className="relative z-10">
                    <stat.icon className="h-8 w-8 mb-4 opacity-90" />
                    <div className="font-serif text-4xl md:text-5xl font-bold mb-2">
                      <CountUp end={stat.value} />
                      {stat.suffix}
                    </div>
                    <div className="text-sm md:text-base opacity-90 uppercase tracking-wider font-medium">
                      {stat.label}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">
            Our Core Values
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            The principles that guide everything we do
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3 mb-16">
          {[
            {
              title: "Quality First",
              description: "Every product undergoes rigorous quality checks to ensure international standards",
              icon: BadgeCheck,
              gradient: "from-emerald-500/20 to-teal-500/20",
              borderColor: "border-emerald-200"
            },
            {
              title: "Sustainability",
              description: "Committed to eco-friendly practices and supporting sustainable farming",
              icon: Globe2,
              gradient: "from-blue-500/20 to-cyan-500/20",
              borderColor: "border-blue-200"
            },
            {
              title: "Partnership",
              description: "Building long-term relationships based on trust and mutual growth",
              icon: Users,
              gradient: "from-purple-500/20 to-pink-500/20",
              borderColor: "border-purple-200"
            },
          ].map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
            >
              <Card className={`h-full bg-gradient-to-br ${value.gradient} border ${value.borderColor} shadow-lg hover:shadow-xl transition-all duration-300`}>
                <CardContent className="p-8">
                  <value.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-bold text-primary mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
