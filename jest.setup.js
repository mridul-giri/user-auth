import "@testing-library/jest-dom";
import React from "react";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
      back: jest.fn(),
      pathname: "/",
      query: {},
      asPath: "/",
    };
  },
  usePathname() {
    return "/";
  },
  useSearchParams() {
    return new URLSearchParams();
  },
}));

// Mock Next.js Link component
jest.mock("next/link", () => {
  return ({ children, href }) => {
    return React.createElement("a", { href }, children);
  };
});

// Mock environment variables
process.env.NEXTAUTH_SECRET = "test-secret";
process.env.NODE_ENV = "development";
process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
process.env.GOOGLE_CLIENT_ID = "test-google-client-id";
process.env.GOOGLE_CLIENT_SECRET = "test-google-client-secret";

// Mock Web APIs for Next.js API routes
global.Request = class Request {
  constructor(url, init = {}) {
    this.url = url;
    this.method = init.method || "GET";
    this.headers = new Headers(init.headers || {});
    this.body = init.body || null;
  }
  async json() {
    return JSON.parse(this.body || "{}");
  }
  async text() {
    return this.body || "";
  }
};

global.Response = class Response {
  constructor(body, init = {}) {
    this.body = body;
    this.status = init.status || 200;
    this.statusText = init.statusText || "OK";
    this.headers = new Headers(init.headers || {});
    this.ok = this.status >= 200 && this.status < 300;
  }
  async json() {
    return typeof this.body === "string" ? JSON.parse(this.body) : this.body;
  }
  async text() {
    return typeof this.body === "string" ? this.body : JSON.stringify(this.body);
  }
  static json(body, init = {}) {
    return new Response(JSON.stringify(body), {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...init.headers,
      },
    });
  }
};

global.Headers = class Headers {
  constructor(init = {}) {
    this.map = new Map();
    if (init instanceof Headers) {
      init.forEach((value, key) => this.map.set(key, value));
    } else if (init) {
      Object.entries(init).forEach(([key, value]) => {
        this.map.set(key, value);
      });
    }
  }
  get(name) {
    return this.map.get(name.toLowerCase()) || null;
  }
  set(name, value) {
    this.map.set(name.toLowerCase(), value);
  }
  has(name) {
    return this.map.has(name.toLowerCase());
  }
  forEach(callback) {
    this.map.forEach((value, key) => callback(value, key, this));
  }
};

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};

