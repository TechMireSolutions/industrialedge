"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Plus,
  Tags,
  Edit,
  Trash2,
  CheckCircle2,
  X,
  RefreshCw,
  FolderTree,
} from "lucide-react";
import { api, type CategoryItem } from "@/lib/api";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "Cpu",
    image: "/images/cat-laptop.jpg",
    description: "",
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data);
    } catch (err) {
      console.error(err);
      showToast("Error loading categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      icon: "Cpu",
      image: "/images/cat-laptop.jpg",
      description: "",
    });
    setModalOpen(true);
  };

  const openEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      icon: cat.icon || "Cpu",
      image: cat.image || "/images/cat-laptop.jpg",
      description: cat.description || "",
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, formData);
        showToast("Category updated successfully!");
      } else {
        await api.createCategory(formData);
        showToast("Category created successfully!");
      }
      setModalOpen(false);
      loadCategories();
    } catch (err) {
      console.error(err);
      showToast("Failed to save category");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.deleteCategory(id);
      showToast("Category deleted successfully");
      loadCategories();
    } catch (err) {
      console.error(err);
      showToast("Failed to delete category");
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 bg-[#0f172a] text-white px-4 py-2.5 rounded-lg shadow-xl text-sm flex items-center gap-2 border border-slate-700 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Category Hierarchy</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize departments, navbar categories, circular badges, and product taxonomies.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={loadCategories}
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
            <span>Add Category</span>
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-orange-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-full h-32 rounded-xl bg-slate-50 border border-slate-100 p-2 mb-4 flex items-center justify-center overflow-hidden">
                <Image
                  src={cat.image || "/images/cat-laptop.jpg"}
                  alt={cat.name}
                  width={120}
                  height={120}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-sm text-slate-900">{cat.name}</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">
                  {cat.count || 0} items
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Slug: {cat.slug}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Icon: {cat.icon || "Cpu"}</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => openEditModal(cat)}
                  className="p-1.5 text-slate-600 hover:text-orange-600 hover:bg-orange-50 rounded-md transition-colors"
                  title="Edit Category"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                  title="Delete Category"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-slate-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">
                {editingCategory ? "Edit Category" : "Add New Category"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Industrial Automation"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Image URL / Path</label>
                <input
                  type="text"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="/images/cat-laptop.jpg"
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lucide Icon Name</label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-orange-500"
                >
                  <option value="Laptop">Laptop</option>
                  <option value="Cpu">Cpu / Computer</option>
                  <option value="Smartphone">Smartphone</option>
                  <option value="Speaker">Speaker</option>
                  <option value="Headphones">Headphones</option>
                  <option value="Camera">Camera</option>
                  <option value="Tv">Tv / Screen</option>
                  <option value="Gamepad2">Gamepad</option>
                  <option value="Armchair">Furniture</option>
                  <option value="Watch">Watch</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-semibold text-white bg-[#f97316] hover:bg-[#ea580c] rounded-lg shadow-sm"
                >
                  {editingCategory ? "Save Changes" : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
