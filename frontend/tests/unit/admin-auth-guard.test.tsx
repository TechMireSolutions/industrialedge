import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import React from "react";
import { render, screen, cleanup, act } from "@testing-library/react";
import AdminLayout from "@/app/(admin)/admin/layout";
import { api } from "@/lib/api";
import CartDrawer from "@/components/cart/cart-drawer";
import AuthModal from "@/components/auth/auth-modal";
import { StoreProvider } from "@/lib/store";

const mockReplace = vi.fn();
const mockPush = vi.fn();
let mockPathname = "/admin";

const mockRouter = {
  replace: mockReplace,
  push: mockPush,
};

vi.mock("next/navigation", () => ({
  useRouter: () => mockRouter,
  usePathname: () => mockPathname,
}));

vi.mock("next/link", () => ({
  default: ({ children, href, ...rest }: any) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("Admin Route Protection & Isolation Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockPathname = "/admin";

    vi.spyOn(api, "getStats").mockResolvedValue({
      metrics: {
        totalSales: 10000,
        totalOrders: 25,
        pendingOrders: 2,
        totalProducts: 40,
        lowStockCount: 1,
        outOfStockCount: 0,
        unreadInquiries: 3,
        totalCategories: 6,
      },
      statusBreakdown: [],
      salesTrend: [],
      lowStockItems: [],
      recentOrders: [],
    });
  });

  afterEach(() => {
    cleanup();
  });

  it("should block unauthenticated access to /admin and cleanly redirect to /admin/login", () => {
    mockPathname = "/admin";
    localStorage.removeItem("industrialedge_admin_token");

    render(
      <AdminLayout>
        <div data-testid="protected-content">Secret Admin Dashboard</div>
      </AdminLayout>
    );

    expect(screen.queryByTestId("protected-content")).not.toBeInTheDocument();
    expect(mockReplace).toHaveBeenCalledWith("/admin/login");
    expect(screen.getByText(/Verifying IndustrialEdge Admin Session/i)).toBeInTheDocument();
  });

  it("should render admin panel when valid industrialedge_admin_token exists in storage", () => {
    mockPathname = "/admin";
    localStorage.setItem("industrialedge_admin_token", "test_valid_token_123");
    localStorage.setItem(
      "industrialedge_admin_user",
      JSON.stringify({ name: "Lead Admin", email: "lead@industrialedge.pk", role: "admin" })
    );

    let container: HTMLElement;
    act(() => {
      const rendered = render(
        <AdminLayout>
          <div data-testid="protected-content">Secret Admin Dashboard</div>
        </AdminLayout>
      );
      container = rendered.container;
    });

    expect(screen.getByTestId("protected-content")).toBeInTheDocument();
    expect(screen.getByText("Store Management")).toBeInTheDocument();
    expect(screen.getByText("Lead Admin")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("should redirect authenticated user from /admin/login to /admin to avoid loops", () => {
    mockPathname = "/admin/login";
    localStorage.setItem("industrialedge_admin_token", "active_session_token");

    render(
      <AdminLayout>
        <div data-testid="login-content">Login Form</div>
      </AdminLayout>
    );

    expect(mockReplace).toHaveBeenCalledWith("/admin");
  });

  it("should allow unauthenticated user to access /admin/login without redirection loop", () => {
    mockPathname = "/admin/login";
    localStorage.removeItem("industrialedge_admin_token");

    render(
      <AdminLayout>
        <div data-testid="login-content">Login Form</div>
      </AdminLayout>
    );

    expect(screen.getByTestId("login-content")).toBeInTheDocument();
    expect(mockReplace).not.toHaveBeenCalled();
  });

  it("should correctly clear tokens upon adminLogout", () => {
    localStorage.setItem("industrialedge_admin_token", "tok_xyz");
    localStorage.setItem("industrialedge_admin_user", JSON.stringify({ name: "Admin" }));

    expect(api.isAdminAuthenticated()).toBe(true);

    api.adminLogout();

    expect(api.isAdminAuthenticated()).toBe(false);
    expect(api.getAdminToken()).toBeNull();
    expect(localStorage.getItem("industrialedge_admin_token")).toBeNull();
    expect(localStorage.getItem("industrialedge_admin_user")).toBeNull();
  });

  it("CartDrawer and AuthModal should unmount cleanly on /admin routes", () => {
    mockPathname = "/admin";

    const { container: cartContainer } = render(
      <StoreProvider>
        <CartDrawer />
      </StoreProvider>
    );
    expect(cartContainer.firstChild).toBeNull();

    const { container: authContainer } = render(
      <StoreProvider>
        <AuthModal />
      </StoreProvider>
    );
    expect(authContainer.firstChild).toBeNull();
  });

  it("Header should NOT render the /admin link for unauthenticated public visitors", async () => {
    mockPathname = "/";
    localStorage.clear();

    const Header = (await import("@/components/layout/header")).default;
    const { container } = render(
      <StoreProvider>
        <Header />
      </StoreProvider>
    );

    const adminLink = container.querySelector('a[href="/admin"]');
    expect(adminLink).toBeNull();
  });

  it("Header should render the /admin link with typo-fixed tooltip when admin is logged in", async () => {
    mockPathname = "/";
    localStorage.setItem("industrialedge_admin_token", "valid_token_123");

    const Header = (await import("@/components/layout/header")).default;
    const { container } = render(
      <StoreProvider>
        <Header />
      </StoreProvider>
    );

    const adminLink = container.querySelector('a[href="/admin"]');
    expect(adminLink).toBeInTheDocument();
    expect(adminLink?.getAttribute("title")).toBe("Open Full Custom Admin Panel");
  });
});
