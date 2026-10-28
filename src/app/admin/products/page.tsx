"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit,
  Trash2,
  Check,
  X,
  Upload,
  AlertCircle,
  Eye,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { api, type ProductItem, type CategoryItem } from "@/lib/api";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<ProductItem>>({
    name: "",
    category: "Laptop & Tablet",
    price: 99,
    originalPrice: 129,
    status: "none",
    stock: 15,
    image: "/images/cat-laptop.jpg",
    description: "",
    isTrending: false,
    isBestSeller: false,
    isFeaturedTab: false,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [prods, cats] = await Promise.all([api.getProducts(), api.getCategories()]);
      setProducts(prods);
      setCategories(cats);
    } catch (err) {
      console.error(err);
      showToast("Error loading catalog data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category: categories[0]?.name || "Laptop & Tablet",
      price: 199,
      originalPrice: 249,
      status: "none",
      stock: 20,
      image: "/images/cat-laptop.jpg",
      description: "",
      isTrending: true,
      isBestSeller: false,
      isFeaturedTab: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: ProductItem) => {
    setEditingProduct(p);
    setFormData({ ...p });
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || formData.price === undefined) {
      alert("Name and Price are required.");
      return;
    }

    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
        showToast("Product updated successfully!");
      } else {
        await api.createProduct(formData);
        showToast("Product created successfully!");
      }
      setModalOpen(false);
      loadData();
    } catch (err) {
      console.error(err);
      showToast("Failed to save product.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      await api.deleteProduct(id);
      showToast("Product deleted successfully.");
      setDeleteConfirmId(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete product.");
    }
  };

  const handleStockToggle = async (id: string) => {
    try {
      await api.toggleProductStock(id);
      showToast("Stock status updated");
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || p.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0f172a] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Products Catalog</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your store's inventory, pricing, images, discount badges, and featured showcases.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadData}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>

          <button
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#f97316] hover:bg-[#ea580c] rounded-lg shadow-sm shadow-orange-500/20 transition-all hover:translate-y-[-1px]"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search products by title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-orange-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-medium text-slate-500">Category:</span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-700 focus:outline-none focus:border-orange-500 font-medium"
          >
            <option value="all">All Categories ({products.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading catalog...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">No products found matching criteria.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 border-b border-slate-200/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-14">Image</th>
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Showcases</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredProducts.map((p) => {
                  const inStock = (p.stock || 0) > 0;

                  return (
                    <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Image Thumbnail */}
                      <td className="py-3 px-4">
                        <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center p-1">
                          <Image
                            src={p.image || "/images/cat-laptop.jpg"}
                            alt={p.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </td>

                      {/* Product Name & SKU */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="font-semibold text-slate-900 line-clamp-1">{p.name}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">ID: {p.id}</div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4">
                        <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium">
                          {p.category}
                        </span>
                      </td>

                      {/* Pricing */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">${p.price.toFixed(2)}</div>
                        {p.originalPrice && (
                          <div className="text-[10px] text-slate-400 line-through">
                            ${p.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </td>

                      {/* Stock Toggle */}
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleStockToggle(p.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase transition-all ${
                            inStock
                              ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                              : "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                          }`}
                          title="Click to toggle stock status"
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-emerald-500" : "bg-rose-500"}`}
                          />
                          <span>{inStock ? `${p.stock} in stock` : "Out of stock"}</span>
                        </button>
                      </td>

                      {/* Homepage Display Badges */}
                      <td className="py-3 px-4">
                        <div className="flex flex-wrap gap-1">
                          {p.isTrending && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-orange-50 text-orange-700 font-semibold border border-orange-200">
                              Trending
                            </span>
                          )}
                          {p.isBestSeller && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-50 text-blue-700 font-semibold border border-blue-200">
                              Best Seller
                            </span>
                          )}
                          {p.isFeaturedTab && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 font-semibold border border-purple-200">
                              Featured
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                            title="Edit Product"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(p.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertCircle className="w-6 h-6" />
              <h3 className="font-bold text-base text-slate-900">Delete Product</h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to delete this product? This action will remove it from the store catalog permanently.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteProduct(deleteConfirmId)}
                className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Product Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-slate-200 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h2>
                <p className="text-xs text-slate-500">
                  Full custom fields: title, category, pricing, stock, badges & display settings.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name || ""}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Dell G5 15 Gaming Laptop"
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Category & Status Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Badge</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as ProductItem["status"] })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  >
                    <option value="none">None</option>
                    <option value="discount">Discount / Sale</option>
                    <option value="new">New Arrival</option>
                    <option value="hot">Hot</option>
                  </select>
                </div>
              </div>

              {/* Price, Original Price, Stock Qty */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Selling Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price ?? ""}
                    onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Original Price ($ Strike)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.originalPrice ?? ""}
                    onChange={(e) =>
                      setFormData({ ...formData, originalPrice: parseFloat(e.target.value) || undefined })
                    }
                    placeholder="Optional"
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Inventory Stock</label>
                  <input
                    type="number"
                    value={formData.stock ?? 10}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Product Image URL or Path
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.image || ""}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/... or https://..."
                    className="flex-1 px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                  />
                  {formData.image && (
                    <div className="w-9 h-9 rounded-md bg-slate-100 border border-slate-200 p-0.5 flex-shrink-0 flex items-center justify-center">
                      <Image
                        src={formData.image}
                        alt="Preview"
                        width={32}
                        height={32}
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Comprehensive technical specifications and highlights..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500 resize-none"
                />
              </div>

              {/* Homepage Feature Toggles */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="block text-xs font-bold text-slate-700">Display on Storefront Sections:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isTrending)}
                      onChange={(e) => setFormData({ ...formData, isTrending: e.target.checked })}
                      className="rounded text-orange-500 focus:ring-orange-400"
                    />
                    <span>Trending Grid</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isBestSeller)}
                      onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                      className="rounded text-orange-500 focus:ring-orange-400"
                    />
                    <span>Best Sellers</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isFeaturedTab)}
                      onChange={(e) => setFormData({ ...formData, isFeaturedTab: e.target.checked })}
                      className="rounded text-orange-500 focus:ring-orange-400"
                    />
                    <span>Featured Tabs</span>
                  </label>
                </div>
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#f97316] hover:bg-[#ea580c] rounded-lg shadow-sm shadow-orange-500/20 transition-all"
                >
                  {editingProduct ? "Save Changes" : "Create Product"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
