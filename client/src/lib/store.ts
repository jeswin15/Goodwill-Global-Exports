import { Product, License } from "./data";
import { toast } from "@/hooks/use-toast";

// Shared state
let products: Product[] = [];
let blogs: any[] = [];
let testimonials: any[] = [];
let licenses: License[] = [];

type Listener = () => void;
const listeners: Set<Listener> = new Set();

export const store = {
  getProducts: () => [...products],
  getBlogs: () => [...blogs],
  getTestimonials: () => [...testimonials],
  getLicenses: () => [...licenses],

  fetchProducts: async () => {
    try {
      const res = await fetch(`/api/products?t=${Date.now()}`);
      if (res.ok) {
        products = await res.json();
        store.notify();
      }
    } catch (e) {
      console.error("Failed to fetch products", e);
    }
  },

  fetchBlogs: async () => {
    try {
      const res = await fetch(`/api/blogs?t=${Date.now()}`);
      if (res.ok) {
        blogs = await res.json();
        store.notify();
      }
    } catch (e) {
      console.error("Failed to fetch blogs", e);
    }
  },

  fetchTestimonials: async () => {
    try {
      const res = await fetch(`/api/testimonials?t=${Date.now()}`);
      if (res.ok) {
        testimonials = await res.json();
        store.notify();
      }
    } catch (e) {
      console.error("Failed to fetch testimonials", e);
    }
  },
  
  fetchLicenses: async () => {
    try {
      const res = await fetch(`/api/licenses?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        licenses = data.map((l: any) => ({
          ...l,
          image: l.imageUrl // Map imageUrl to image for frontend consistency
        }));
        store.notify();
      }
    } catch (e) {
      console.error("Failed to fetch licenses", e);
    }
  },

  addProduct: async (product: Product): Promise<boolean> => {
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
      });
      if (res.ok) {
        const newProduct = await res.json();
        products = [newProduct, ...products];
        store.notify();
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to add product:", errorData);
        throw new Error(errorData.message || "Failed to add product");
      }
    } catch (e: any) {
      console.error("Error adding product:", e);
      toast({ title: "Error", description: e.message || "Failed to add product", variant: "destructive" });
      return false;
    }
  },

  removeProduct: async (id: number) => {
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      products = products.filter(p => p.id !== id);
      store.notify();
    } catch (e) {
      console.error("Error removing product:", e);
      toast({ title: "Error", description: "Failed to remove product", variant: "destructive" });
    }
  },

  addBlog: async (blog: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blog)
      });
      if (res.ok) {
        const newBlog = await res.json();
        blogs = [newBlog, ...blogs];
        store.notify();
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to add blog:", errorData);
        throw new Error(errorData.message || "Failed to add blog");
      }
    } catch (e: any) {
      console.error("Error adding blog:", e);
      toast({ title: "Error", description: e.message || "Failed to add blog", variant: "destructive" });
      return false;
    }
  },

  removeBlog: async (id: number) => {
    try {
      await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      blogs = blogs.filter(b => b.id !== id);
      store.notify();
    } catch (e) {
      console.error("Error removing blog:", e);
      toast({ title: "Error", description: "Failed to remove blog", variant: "destructive" });
    }
  },

  addTestimonial: async (testimonial: any): Promise<boolean> => {
    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testimonial)
      });
      if (res.ok) {
        const newTestimonial = await res.json();
        testimonials = [newTestimonial, ...testimonials];
        store.notify();
        return true;
      } else {
        const errorData = await res.json().catch(() => ({}));
        console.error("Failed to add testimonial:", errorData);
        throw new Error(errorData.message || "Failed to add testimonial");
      }
    } catch (e: any) {
      console.error("Error adding testimonial:", e);
      toast({ title: "Error", description: e.message || "Failed to add testimonial", variant: "destructive" });
      return false;
    }
  },

  removeTestimonial: async (id: number) => {
    try {
      await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
      testimonials = testimonials.filter(t => t.id !== id);
      store.notify();
    } catch (e) {
      console.error("Error removing testimonial:", e);
      toast({ title: "Error", description: "Failed to remove testimonial", variant: "destructive" });
    }
  },

  addLicense: async (license: any): Promise<boolean> => {
    try {
      const { image, ...rest } = license;
      const res = await fetch("/api/licenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...rest, imageUrl: image })
      });
      if (res.ok) {
        const newLicense = await res.json();
        licenses = [{ ...newLicense, image: newLicense.imageUrl }, ...licenses];
        store.notify();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error adding license:", e);
      return false;
    }
  },

  updateLicense: async (id: number, update: any): Promise<boolean> => {
    try {
      const { image, ...rest } = update;
      const res = await fetch(`/api/licenses/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...rest, 
          ...(image ? { imageUrl: image } : {})
        })
      });
      if (res.ok) {
        const updatedLicense = await res.json();
        licenses = licenses.map(l => l.id === id ? { ...updatedLicense, image: updatedLicense.imageUrl } : l);
        store.notify();
        return true;
      }
      return false;
    } catch (e) {
      console.error("Error updating license:", e);
      return false;
    }
  },

  removeLicense: async (id: number) => {
    try {
      await fetch(`/api/licenses/${id}`, { method: "DELETE" });
      licenses = licenses.filter(l => l.id !== id);
      store.notify();
    } catch (e) {
      console.error("Error removing license:", e);
    }
  },

  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  notify: () => {
    listeners.forEach(l => l());
  }
};
