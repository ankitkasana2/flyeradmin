import { makeAutoObservable } from "mobx";

class AuthStore {
  user = null;
  loading = false;
  error = "";

  constructor() {
    makeAutoObservable(this);

    // Load persisted user if exists
    if (typeof window !== "undefined") {
      const savedUser = localStorage.getItem("user");
      const savedToken = localStorage.getItem("token");
      if (savedUser && savedToken) {
        this.user = JSON.parse(savedUser);
      }
    }
  }

  async login(email, password, role, onLogin) {
    this.loading = true;
    this.error = "";

    try {
      const res = await fetch("http://193.203.161.174:3007/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      // Save token & user info
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Update observable state
      this.user = data.user;

      // Optional: trigger callback
      if (onLogin) onLogin(data.user.role);
    } catch (err) {
      this.error = err.message;
      this.user = null;
    } finally {
      this.loading = false;
    }
  }

  logout() {
    this.user = null;
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
}

const authStore = new AuthStore();
export default authStore;
