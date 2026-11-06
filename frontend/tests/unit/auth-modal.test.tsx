import { describe, it, expect, beforeEach } from "vitest";
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import AuthModal from "@/components/auth/auth-modal";
import { StoreProvider, useStore, _resetStoreForTesting } from "@/lib/store";

function TestAuthWrapper({ initialTab = "login" }: { initialTab?: "login" | "register" }) {
  const { openAuthModal } = useStore();

  React.useEffect(() => {
    openAuthModal(initialTab);
  }, [openAuthModal, initialTab]);

  return <AuthModal />;
}

describe("AuthModal Component Unit Tests", () => {
  beforeEach(() => {
    localStorage.clear();
    _resetStoreForTesting();
  });

  it("should not render anything when closed", () => {
    const { container } = render(
      <StoreProvider>
        <AuthModal />
      </StoreProvider>
    );
    expect(container.firstChild).toBeNull();
  });

  it("should render Login form when opened with login tab", () => {
    render(
      <StoreProvider>
        <TestAuthWrapper initialTab="login" />
      </StoreProvider>
    );

    expect(screen.getByRole("heading", { name: /login:/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email or user name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your password/i)).toBeInTheDocument();
  });

  it("should switch to Register tab when user clicks Register", () => {
    render(
      <StoreProvider>
        <TestAuthWrapper initialTab="login" />
      </StoreProvider>
    );

    const registerTabBtn = screen.getByRole("button", { name: /register\./i });
    fireEvent.click(registerTabBtn);

    expect(screen.getByRole("heading", { name: /register:/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/user name/i)).toBeInTheDocument();
  });

  it("should close when close button (X) is clicked", () => {
    const { container } = render(
      <StoreProvider>
        <TestAuthWrapper initialTab="login" />
      </StoreProvider>
    );

    const closeBtn = screen.getByLabelText(/close modal/i);
    act(() => {
      fireEvent.click(closeBtn);
    });

    expect(container.firstChild).toBeNull();
  });
});
