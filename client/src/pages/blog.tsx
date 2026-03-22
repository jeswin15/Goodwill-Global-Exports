import { useState, useEffect } from "react";
import { store } from "@/lib/store";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, BookOpen, Search, Clock, Share2, Mail, TrendingUp, ChevronRight, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Blog() {
  const [blogs, setBlogs] = useState<any[]>(store.getBlogs());
  const [isLoading, setIsLoading] = useState<boolean>(store.getBlogs().length === 0);
  const [selectedBlog, setSelectedBlog] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [likes, setLikes] = useState<Record<number, number>>({});
  const { toast } = useToast();

  // Handle scroll progress for modal
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const progress = (scrollTop / (scrollHeight - clientHeight)) * 100;
    setScrollProgress(progress);
  };

  // Handle Like/Reaction
  const handleLike = (id: number) => {
    setLikes(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    toast({ title: "Appreciated!", description: "Thanks for your feedback." });
  };

  useEffect(() => {
    const fetchBlogsData = async () => {
      if (store.getBlogs().length === 0) {
        setIsLoading(true);
      }
      await store.fetchBlogs();
      // Wait a tick for store to update state via subscription if it was empty initially
      setIsLoading(false);
    };

    fetchBlogsData();

    const unsubscribe = store.subscribe(() => {
      setBlogs(store.getBlogs());
      setIsLoading(false); 
    });
    return () => { unsubscribe(); };
  }, []);

  const categories = ["All", "Industry Trends", "Logistics", "Company News", "Market Analysis"];

  // Helper to estimate reading time
  const getReadingTime = (content: string) => {
    const words = content.trim().split(/\s+/).length;
    const time = Math.ceil(words / 200);
    return `${time} min read`;
  };

  // Filter logic
  const filteredBlogs = blogs.filter(blog => {
    const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (blog.content || "").toLowerCase().includes(searchQuery.toLowerCase());
    // Since currently blogs don't have explicit categories in DB, 
    // we'll simulate category filtering or just allow "All" to show everything for now.
    // In a real app, blog.category would be checked.
    const matchesCategory = activeCategory === "All" ? true : true; // Placeholder: all blogs are "General" for now

    return matchesSearch && matchesCategory;
  });

  const featuredBlog = blogs.length > 0 ? blogs[0] : null; // Assume newest is first
  const displayBlogs = searchQuery ? filteredBlogs : filteredBlogs.slice(1); // Hide featured from grid if not searching

  // Get related blogs (mock logic for now, excluding current)
  const relatedBlogs = selectedBlog
    ? blogs.filter(b => b.id !== selectedBlog.id).slice(0, 2)
    : [];

  const handleShare = (blog: any) => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.excerpt || "Check out this article!",
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({ title: "Link Copied", description: "Article link copied to clipboard." });
    }
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Subscribed!", description: "You'll receive our latest updates soon." });
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Loading Skeleton View */}
      {isLoading && (
        <div className="w-full flex-1 flex flex-col items-center justify-center py-24 min-h-[60vh]">
           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
           <p className="text-muted-foreground animate-pulse">Loading market insights...</p>
        </div>
      )}

      {/* Hero Section - Featured Post */}
      {!isLoading && featuredBlog && !searchQuery && (
        <section className="relative h-[60vh] md:h-[70vh] w-full overflow-hidden bg-black">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          >
            <img src={featuredBlog.image} alt={featuredBlog.title} className="w-full h-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </motion.div>

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 z-10">
            <div className="container mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="max-w-3xl space-y-4"
              >
                <Badge className="bg-accent text-white border-none px-3 py-1 text-sm font-bold uppercase tracking-widest mb-4">
                  Featured Insight
                </Badge>
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-white leading-tight">
                  {featuredBlog.title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 line-clamp-2 max-w-2xl">
                  {featuredBlog.excerpt || featuredBlog.content}
                </p>
                <div className="flex items-center gap-6 pt-4 text-white/80">
                  <span className="flex items-center gap-2"><User className="h-4 w-4" /> {featuredBlog.author || "GOODWILL GLOBAL EXPORTS"}</span>
                  <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {getReadingTime(featuredBlog.content || "")}</span>
                  <Button
                    onClick={() => setSelectedBlog(featuredBlog)}
                    className="ml-auto bg-white text-primary hover:bg-gray-100 font-bold"
                  >
                    Read Article
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content Area */}
      {!isLoading && (
      <div className="container px-4 md:px-6 py-16 mx-auto">

        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8">
          <span className="hover:text-primary cursor-pointer">Home</span>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span className="font-bold text-primary">Insights</span>
        </nav>

        {/* Discovery Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 sticky top-20 z-30 bg-slate-50/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto scrollbar-hide">
            {categories.map((cat) => (
              <Button
                key={cat}
                variant={activeCategory === cat ? "default" : "ghost"}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "rounded-full whitespace-nowrap",
                  activeCategory === cat ? "bg-primary text-white" : "text-muted-foreground hover:text-primary hover:bg-white"
                )}
              >
                {cat}
              </Button>
            ))}
          </div>
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search insights..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-white rounded-full border-slate-200 focus:ring-primary"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {blogs.length > 0 ? (
              displayBlogs.map((blog, idx) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  layout
                  onClick={() => setSelectedBlog(blog)}
                  className="group cursor-pointer"
                >
                  <Card className="h-full overflow-hidden border-none shadow-sm hover:shadow-2xl transition-all duration-300 bg-white">
                    <div className="aspect-[3/2] relative overflow-hidden">
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary flex items-center gap-1 shadow-sm">
                        <TrendingUp className="h-3 w-3 text-accent" /> Trending
                      </div>
                    </div>
                    <CardHeader className="p-6">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <span className="font-bold text-accent uppercase tracking-wider">Market Analysis</span>
                        <span>{getReadingTime(blog.content || "")}</span>
                      </div>
                      <h3 className="font-serif text-xl font-bold text-primary mb-3 leading-snug group-hover:text-accent transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-4">
                        {blog.excerpt || blog.content}
                      </p>
                      <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {(blog.author || "GG")[0]}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold text-primary">{blog.author || "Global Team"}</span>
                          <span className="text-[10px] text-muted-foreground">{blog.date}</span>
                        </div>
                        <Button variant="ghost" size="icon" className="ml-auto hover:text-accent" onClick={(e) => { e.stopPropagation(); handleShare(blog); }}>
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center">
                <BookOpen className="h-16 w-16 mx-auto text-muted/30 mb-4" />
                <p className="text-muted-foreground italic text-lg">No insights found based on your search.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Newsletter Section */}
        <section className="mt-24 bg-primary rounded-3xl p-8 md:p-16 relative overflow-hidden text-center md:text-left">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 -skew-x-12 transform origin-top-right" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="max-w-xl space-y-4">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white">Subscribe to Market Intelligence</h2>
              <p className="text-white/80 text-lg">Get weekly updates on global commodity prices, shipping trends, and regulatory changes directly to your inbox.</p>
            </div>
            <div className="w-full max-w-md bg-white/10 backdrop-blur-md p-2 rounded-full border border-white/20 flex">
              <Input
                placeholder="Enter your email address"
                className="bg-transparent border-none text-white placeholder:text-white/50 focus-visible:ring-0 h-12"
              />
              <Button onClick={handleSubscribe} className="rounded-full bg-accent text-primary hover:bg-accent/90 h-12 px-8 font-bold">
                Subscribe <Mail className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

      </div>
      )}

      {/* Blog Detail Modal */}
      <Dialog open={!!selectedBlog} onOpenChange={() => setSelectedBlog(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden border-none bg-white h-[90vh] flex flex-col">
          {/* Reading Progress Bar */}
          <div className="h-1 w-full bg-slate-100 z-50">
            <motion.div
              className="h-full bg-accent"
              style={{ width: `${scrollProgress}%` }}
              initial={{ width: 0 }}
            />
          </div>

          <div className="overflow-y-auto h-full scrollbar-thin" onScroll={handleScroll}>
            <div className="aspect-[21/9] w-full relative">
              {selectedBlog && (
                <img
                  src={selectedBlog.image}
                  alt={selectedBlog.title}
                  className="h-full w-full object-cover"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-8">
                <div className="text-white text-left w-full">
                  <div className="flex justify-between items-end">
                    <div>
                      <Badge className="bg-accent/90 text-white border-none mb-4">Market Analysis</Badge>
                      <DialogTitle className="text-3xl md:text-5xl font-serif font-bold text-white leading-tight mb-4">
                        {selectedBlog?.title}
                      </DialogTitle>
                      <div className="flex items-center gap-6 text-sm text-white/80">
                        <span className="flex items-center gap-2"><User className="h-4 w-4" /> {selectedBlog?.author || "GOODWILL GLOBAL EXPORTS"}</span>
                        <span className="flex items-center gap-2"><Calendar className="h-4 w-4" /> {selectedBlog?.date}</span>
                        <span className="flex items-center gap-2"><Clock className="h-4 w-4" /> {getReadingTime(selectedBlog?.content || "")}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8 md:p-16 max-w-3xl mx-auto">
              {/* Breadcrumbs in Modal */}
              <nav className="flex items-center text-xs text-muted-foreground mb-8">
                <span>Insights</span>
                <ChevronRight className="h-3 w-3 mx-2" />
                <span>Market Analysis</span>
                <ChevronRight className="h-3 w-3 mx-2" />
                <span className="font-bold text-primary text-ellipsis truncate max-w-[200px]">{selectedBlog?.title}</span>
              </nav>

              <div className="prose prose-lg prose-emerald max-w-none">
                <div className="text-lg leading-relaxed whitespace-pre-wrap text-foreground/80 font-serif">
                  {selectedBlog?.content || selectedBlog?.excerpt}
                </div>
              </div>

              {/* Reaction Section */}
              <div className="flex justify-center my-12">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-full gap-2 hover:border-accent hover:text-accent group relative"
                  onClick={() => selectedBlog && handleLike(selectedBlog.id)}
                >
                  <ThumbsUp className="h-5 w-5 group-hover:scale-125 transition-transform" />
                  <span className="font-bold">{likes[selectedBlog?.id] || 0}</span> Keys to Success
                  {likes[selectedBlog?.id] && (
                    <motion.span
                      initial={{ opacity: 0, y: 0 }}
                      animate={{ opacity: 0, y: -20 }}
                      className="absolute -top-8 left-1/2 -translate-x-1/2 text-accent font-bold"
                    >
                      +1
                    </motion.span>
                  )}
                </Button>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100">
                <h4 className="font-bold text-sm uppercase text-muted-foreground mb-6">Share this article</h4>
                <div className="flex gap-4">
                  <Button variant="outline" className="rounded-full gap-2" onClick={() => handleShare(selectedBlog)}>
                    <Share2 className="h-4 w-4" /> Copy Link
                  </Button>
                  <Button variant="outline" className="rounded-full gap-2">
                    <Mail className="h-4 w-4" /> Email
                  </Button>
                </div>
              </div>

              {/* Related Insights */}
              {relatedBlogs.length > 0 && (
                <div className="mt-16 pt-16 border-t border-slate-100">
                  <h3 className="font-serif text-2xl font-bold text-primary mb-8">Related Insights</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    {relatedBlogs.map(blog => (
                      <div
                        key={blog.id}
                        className="group cursor-pointer"
                        onClick={() => {
                          setSelectedBlog(blog);
                          document.querySelector('.overflow-y-auto')?.scrollTo(0, 0);
                        }}
                      >
                        <div className="aspect-video rounded-lg overflow-hidden mb-4">
                          <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <h4 className="font-bold text-lg leading-tight group-hover:text-accent transition-colors">{blog.title}</h4>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{blog.excerpt}</p>
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
