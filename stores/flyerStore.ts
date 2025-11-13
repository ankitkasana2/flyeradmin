import { makeAutoObservable, runInAction } from "mobx";
import type { Flyer } from "@/lib/flyer-data";

class FlyerStore {
  flyers: Flyer[] = [];
  loading = false;
  error: string | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  async fetchFlyers() {
    this.loading = true;
    this.error = null;

    try {
      const res = await fetch("http://193.203.161.174:3007/api/flyers");
      if (!res.ok) throw new Error("Failed to fetch flyers");
      const data = await res.json();

      const mappedFlyers: Flyer[] = data.map((f: any) => ({
        id: f.id.toString(),
        title: f.title,
        category: f.categories?.[0] || "Uncategorized",
        price: f.price,
        formType: f.form_type,
        image: f.image_url,
        recentlyAdded: !!f.recently_added,
      }));

      runInAction(() => {
        this.flyers = mappedFlyers;
      });
    } catch (err: any) {
      runInAction(() => {
        this.error = err.message;
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateFlyer(updatedFlyer: Flyer) {
    this.flyers = this.flyers.map(f =>
      f.id === updatedFlyer.id ? updatedFlyer : f
    );
  }

  deleteFlyer(flyerId: string) {
    this.flyers = this.flyers.filter(f => f.id !== flyerId);
  }

  getFlyersByCategory(category: string): Flyer[] {
    if (category === "Recently Added") return this.flyers.filter(f => f.recentlyAdded);
    if (category === "All") return this.flyers;
    return this.flyers.filter(f => f.category === category);
  }
}

export const flyerStore = new FlyerStore();
