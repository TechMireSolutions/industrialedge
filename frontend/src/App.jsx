import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import CategoryPage from './pages/CategoryPage.jsx'
import CollectionPage from './pages/CollectionPage.jsx'
import Deals from './pages/Deals.jsx'
import Shop from './pages/Shop.jsx'
import ProductDetail from './pages/ProductDetail.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import Bestseller from './pages/Bestseller.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Account from './pages/account/Account.jsx'
import OrderHistory from './pages/account/OrderHistory.jsx'
import OrderDetail from './pages/account/OrderDetail.jsx'
import Wishlist from './pages/Wishlist.jsx'
import AdminLayout from './pages/admin/AdminLayout.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import AdminUsers from './pages/admin/AdminUsers.jsx'
import AdminUserForm from './pages/admin/AdminUserForm.jsx'
import AdminProducts from './pages/admin/AdminProducts.jsx'
import AdminProductForm from './pages/admin/AdminProductForm.jsx'
import AdminCategories from './pages/admin/AdminCategories.jsx'
import AdminCategoryForm from './pages/admin/AdminCategoryForm.jsx'
import AdminCollections from './pages/admin/AdminCollections.jsx'
import AdminCollectionForm from './pages/admin/AdminCollectionForm.jsx'
import AdminTags from './pages/admin/AdminTags.jsx'
import AdminOrders from './pages/admin/AdminOrders.jsx'
import AdminOrderDetails from './pages/admin/AdminOrderDetails.jsx'
import AdminHeroSlides from './pages/admin/AdminHeroSlides.jsx'
import AdminHeroSlideForm from './pages/admin/AdminHeroSlideForm.jsx'
import AdminBanners from './pages/admin/AdminBanners.jsx'
import AdminBannerForm from './pages/admin/AdminBannerForm.jsx'
import AdminOffers from './pages/admin/AdminOffers.jsx'
import AdminOfferForm from './pages/admin/AdminOfferForm.jsx'
import AdminServices from './pages/admin/AdminServices.jsx'
import AdminServiceForm from './pages/admin/AdminServiceForm.jsx'
import AdminFooter from './pages/admin/AdminFooter.jsx'
import AdminSettings from './pages/admin/AdminSettings.jsx'
import AdminCoupons from './pages/admin/AdminCoupons.jsx'
import AdminCouponForm from './pages/admin/AdminCouponForm.jsx'
import AdminReviews from './pages/admin/AdminReviews.jsx'
import AdminReviewForm from './pages/admin/AdminReviewForm.jsx'
import AdminContactSubmissions from './pages/admin/AdminContactSubmissions.jsx'
import AdminContactDetails from './pages/admin/AdminContactDetails.jsx'
import AdminPages from './pages/admin/AdminPages.jsx'
import AdminPageForm from './pages/admin/AdminPageForm.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import AdminProtectedRoute from './components/AdminProtectedRoute.jsx'
import AdminMediaLibrary from './pages/admin/AdminMediaLibrary.jsx'
import AdminPartners from './pages/admin/AdminPartners.jsx'
import AdminMenus from './pages/admin/AdminMenus.jsx'
import AdminHomepageBuilder from './pages/admin/AdminHomepageBuilder.jsx'
import PageContent from './pages/PageContent.jsx'
import { Toaster, ToastBar, toast } from 'react-hot-toast'
import { ConfirmProvider } from './components/admin/ConfirmProvider.jsx'
import SEOManager from './components/SEOManager.jsx'

import AdminLogin from './pages/admin/AdminLogin.jsx'
import MaintenanceMode from './pages/MaintenanceMode.jsx'
import { useSettings } from './context/SettingsContext.jsx'

export default function App() {
  const { settings, loading } = useSettings()
  const isMaintenanceMode = settings?.system?.maintenanceMode === true

  if (loading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light text-center px-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <ConfirmProvider>
      <SEOManager />
      <Toaster
        position="top-right"
        toastOptions={{
          success: {
            icon: (
              <div style={{ backgroundColor: '#ECFDF5', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-check" style={{ color: '#10B981', fontSize: '12px' }}></i>
              </div>
            ),
            style: { borderLeft: '4px solid #10B981' }
          },
          error: {
            icon: (
              <div style={{ backgroundColor: '#FEF2F2', width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <i className="fas fa-times" style={{ color: '#EF4444', fontSize: '12px' }}></i>
              </div>
            ),
            style: { borderLeft: '4px solid #EF4444' }
          },
          style: {
            padding: '12px 16px',
            color: '#111827',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            borderRadius: '12px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: '500',
            maxWidth: '400px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }
        }}
      >
        {(t) => (
          <ToastBar toast={t} style={{ ...t.style, padding: 0, boxShadow: 'none', background: 'transparent' }}>
            {({ icon, message }) => (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', background: 'white', padding: t.style.padding, borderRadius: t.style.borderRadius, boxShadow: t.style.boxShadow, borderLeft: t.style.borderLeft }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {icon}
                  <span style={{ fontSize: '14px' }}>{message}</span>
                </div>
                {t.type !== 'loading' && (
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: '0 0 0 16px', display: 'flex' }}
                  >
                    <i className="fas fa-times" style={{ fontSize: '14px' }}></i>
                  </button>
                )}
              </div>
            )}
          </ToastBar>
        )}
      </Toaster>
      <Routes>
        <Route element={<Layout />}>
          {isMaintenanceMode ? (
            <Route path="*" element={<MaintenanceMode />} />
          ) : (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/deals" element={<Deals />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/collection/:slug" element={<CollectionPage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/bestseller" element={<Bestseller />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/page/:slug" element={<PageContent />} />
              <Route path="/about" element={<PageContent staticSlug="about" />} />
              <Route path="/corporate" element={<PageContent staticSlug="corporate" />} />

              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<Account />} />
                <Route path="/account/orders" element={<OrderHistory />} />
                <Route path="/account/orders/:id" element={<OrderDetail />} />
              </Route>
            </>
          )}
        </Route>

        <Route path="/adminlogin" element={<AdminLogin />} />

        {/* Admin Panel routes MUST be outside the public storefront Layout */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="products/add" element={<AdminProductForm />} />
            <Route path="products/edit/:id" element={<AdminProductForm />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="categories/add" element={<AdminCategoryForm />} />
            <Route path="categories/edit/:id" element={<AdminCategoryForm />} />
            <Route path="collections" element={<AdminCollections />} />
            <Route path="tags" element={<AdminTags />} />
            <Route path="collections/add" element={<AdminCollectionForm />} />
            <Route path="collections/edit/:id" element={<AdminCollectionForm />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="orders/:id" element={<AdminOrderDetails />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="users/add" element={<AdminUserForm />} />
            <Route path="users/edit/:id" element={<AdminUserForm />} />
            <Route path="hero-slides" element={<AdminHeroSlides />} />
            <Route path="hero-slides/add" element={<AdminHeroSlideForm />} />
            <Route path="hero-slides/edit/:id" element={<AdminHeroSlideForm />} />
            <Route path="banners" element={<AdminBanners />} />
            <Route path="banners/add" element={<AdminBannerForm />} />
            <Route path="banners/edit/:id" element={<AdminBannerForm />} />
            <Route path="offers" element={<AdminOffers />} />
            <Route path="offers/add" element={<AdminOfferForm />} />
            <Route path="offers/edit/:id" element={<AdminOfferForm />} />
            <Route path="services" element={<AdminServices />} />
            <Route path="services/add" element={<AdminServiceForm />} />
            <Route path="services/edit/:id" element={<AdminServiceForm />} />
            <Route path="footer" element={<AdminFooter />} />
            <Route path="settings" element={<AdminSettings />} />
            <Route path="media" element={<AdminMediaLibrary />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="menus" element={<AdminMenus />} />
            <Route path="homepage-builder" element={<AdminHomepageBuilder />} />
            <Route path="coupons" element={<AdminCoupons />} />
            <Route path="coupons/add" element={<AdminCouponForm />} />
            <Route path="coupons/edit/:id" element={<AdminCouponForm />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="reviews/:id" element={<AdminReviewForm />} />
            <Route path="contact-submissions" element={<AdminContactSubmissions />} />
            <Route path="contact-submissions/:id" element={<AdminContactDetails />} />
            <Route path="pages" element={<AdminPages />} />
            <Route path="pages/add" element={<AdminPageForm />} />
            <Route path="pages/edit/:id" element={<AdminPageForm />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </ConfirmProvider>
  )
}
