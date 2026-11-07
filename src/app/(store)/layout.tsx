import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import CartDrawer from "@/components/cart/cart-drawer";
import AuthModal from "@/components/auth/auth-modal";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header/>
      <main className="flex-1">{children}</main>
      <Footer/>
      <CartDrawer/>
      <AuthModal/>
    </>
  );
}

