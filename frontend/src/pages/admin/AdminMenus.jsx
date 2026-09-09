import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { adminApi, categoryApi, collectionApi, cmsApi, productApi } from '../../services';

export default function AdminMenus() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMenu, setSelectedMenu] = useState(null);

  // Form states
  const [showItemForm, setShowItemForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const initialItemState = {
    label: '',
    type: 'link',
    destinationType: '',
    systemAction: '',
    source: '',
    url: '',
    target: '_self',
    categoryId: '',
    collectionId: '',
    productId: '',
    pageId: '',
    icon: '',
    iconPosition: 'left',
    badgeText: '',
    badgeVariant: '',
    variant: 'primary',
    order: 0,
    visible: true,
    desktopVisible: true,
    mobileVisible: true,
    parentId: null
  };
  const [itemForm, setItemForm] = useState(initialItemState);

  // Reference data
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [pages, setPages] = useState([]);
  // For products, fetching all might be large, but we'll try for now
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchMenus();
    fetchReferences();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMenus();
      setMenus(res.data || []);
      if (selectedMenu) {
        const updated = res.data.find(m => m.id === selectedMenu.id);
        if (updated) setSelectedMenu(updated);
      }
    } catch (err) {
      toast.error('Failed to fetch menus');
    } finally {
      setLoading(false);
    }
  };

  const fetchReferences = async () => {
    try {
      const [cats, cols, pgs, prods] = await Promise.all([
        categoryApi.getAll(true),
        collectionApi.getAll(),
        cmsApi.getPages(true),
        productApi.getAll({ limit: 100 })
      ]);
      setCategories(cats.data || []);
      setCollections(cols.data || []);
      setPages(pgs.data || []);
      setProducts(prods.data?.data || prods.data || []);
    } catch (error) {
      console.error('Failed to load reference data', error);
    }
  };

  const createMenu = async () => {
    const name = window.prompt("Enter menu name (e.g. Main Navigation)");
    if (!name) return;
    const slug = window.prompt("Enter menu slug (e.g. main-nav)");
    if (!slug) return;

    try {
      await adminApi.createMenu({ name, slug });
      toast.success("Menu created");
      fetchMenus();
    } catch (err) {
      toast.error(err.data?.message || "Failed to create menu");
    }
  };

  const saveItem = async () => {
    try {
      // Cleanup payload: strictly convert empty strings to null for optional enums
      const payload = { ...itemForm };
      
      const nullifyIfEmpty = (field) => { if (payload[field] === '') payload[field] = null; };
      
      nullifyIfEmpty('destinationType');
      nullifyIfEmpty('systemAction');
      nullifyIfEmpty('source');
      nullifyIfEmpty('url');
      nullifyIfEmpty('categoryId');
      nullifyIfEmpty('collectionId');
      nullifyIfEmpty('productId');
      nullifyIfEmpty('pageId');
      nullifyIfEmpty('icon');
      nullifyIfEmpty('iconPosition');
      nullifyIfEmpty('badgeText');
      nullifyIfEmpty('badgeVariant');
      nullifyIfEmpty('variant');
      nullifyIfEmpty('parentId');

      if (payload.type !== 'system_action') payload.systemAction = null;
      if (payload.type !== 'button') payload.variant = null;
      if (payload.type !== 'dropdown' && payload.type !== 'mega_menu') payload.source = null;
      
      if (payload.type === 'link' || payload.type === 'button') {
        if (!payload.destinationType) {
          toast.error("Destination Type is required for Links and Buttons");
          return;
        }
        if (payload.destinationType !== 'category') payload.categoryId = null;
        if (payload.destinationType !== 'collection') payload.collectionId = null;
        if (payload.destinationType !== 'product') payload.productId = null;
        if (payload.destinationType !== 'page') payload.pageId = null;
        
        if (payload.destinationType === 'internal') {
          if (!payload.url || !payload.url.startsWith('/')) {
            toast.error("Internal links must start with /, for example /shop");
            return;
          }
          payload.target = '_self';
        } else if (payload.destinationType === 'external') {
          if (!payload.url || (!payload.url.startsWith('http://') && !payload.url.startsWith('https://'))) {
            toast.error("External URLs must start with http:// or https://");
            return;
          }
        } else {
          payload.url = null;
          payload.target = '_self';
        }
      } else {
        payload.destinationType = null;
        payload.categoryId = null;
        payload.collectionId = null;
        payload.productId = null;
        payload.pageId = null;
        payload.url = null;
        payload.target = '_self';
      }

      if (editingItem) {
        await adminApi.updateMenuItem(editingItem.id, payload);
        toast.success("Menu item updated");
      } else {
        await adminApi.addMenuItem(selectedMenu.id, payload);
        toast.success("Menu item added");
      }
      setShowItemForm(false);
      setEditingItem(null);
      fetchMenus();
    } catch (err) {
      console.error(err);
      const validationError = err.data?.errors?.[0]?.message;
      toast.error(validationError || err.data?.message || err.message || "Failed to save item");
    }
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Delete this item? Children will also be deleted.")) return;
    try {
      await adminApi.deleteMenuItem(id);
      toast.success("Item deleted");
      fetchMenus();
    } catch (err) {
      toast.error("Failed to delete item");
    }
  };

  const reorder = async (direction, item, siblings) => {
    const idx = siblings.findIndex(s => s.id === item.id);
    if (direction === 'up' && idx > 0) {
      siblings[idx].order--;
      siblings[idx - 1].order++;
    } else if (direction === 'down' && idx < siblings.length - 1) {
      siblings[idx].order++;
      siblings[idx + 1].order--;
    } else {
      return;
    }
    
    try {
      await adminApi.reorderMenuItems(selectedMenu.id, siblings.map(s => ({ id: s.id, order: s.order })));
      fetchMenus();
    } catch (err) {
      toast.error("Reorder failed");
    }
  };

  const renderTree = (items, depth = 0) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="list-group list-group-flush ms-3 border-start">
        {items.map((item, idx) => (
          <div key={item.id} className="list-group-item bg-transparent">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <strong>
                  {item.icon && <i className={`${item.icon} me-2 text-muted`}></i>}
                  {item.label}
                </strong>
                <span className="badge bg-secondary ms-2">{item.type}</span>
                {!item.visible && <span className="badge bg-danger ms-2">Hidden</span>}
                {item.systemAction && <span className="badge bg-info ms-2 text-dark">{item.systemAction}</span>}
                {item.destinationType && <small className="text-muted ms-2 d-block">Dest: {item.destinationType}</small>}
              </div>
              
              <div className="btn-group btn-group-sm">
                <button className="btn btn-light" onClick={() => reorder('up', item, items)} disabled={idx === 0}><i className="fas fa-arrow-up"></i></button>
                <button className="btn btn-light" onClick={() => reorder('down', item, items)} disabled={idx === items.length - 1}><i className="fas fa-arrow-down"></i></button>
                {depth < 2 && (
                  <button className="btn btn-outline-primary" onClick={() => {
                    setItemForm({ ...initialItemState, parentId: item.id, order: item.children?.length || 0 });
                    setEditingItem(null);
                    setShowItemForm(true);
                  }} title="Add Child"><i className="fas fa-plus"></i></button>
                )}
                <button className="btn btn-outline-secondary" onClick={() => {
                  setItemForm({
                    ...initialItemState,
                    ...item,
                    categoryId: item.category?.id || '',
                    collectionId: item.collection?.id || '',
                    pageId: item.page?.id || '',
                    productId: item.product?.id || '',
                    destinationType: item.destinationType || '',
                    systemAction: item.systemAction || '',
                    source: item.source || '',
                    url: item.url || '',
                    icon: item.icon || '',
                    badgeText: item.badgeText || '',
                    badgeVariant: item.badgeVariant || '',
                    variant: item.variant || ''
                  });
                  setEditingItem(item);
                  setShowItemForm(true);
                }}><i className="fas fa-edit"></i></button>
                <button className="btn btn-outline-danger" onClick={() => deleteItem(item.id)}><i className="fas fa-trash"></i></button>
              </div>
            </div>
            {item.children && renderTree(item.children, depth + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1" style={{ fontFamily: "Outfit", fontWeight: "800" }}>Navigation Builder</h4>
          <p className="text-muted mb-0">Manage hierarchical menus</p>
        </div>
        <button className="btn btn-primary" onClick={createMenu}>
          <i className="fas fa-plus me-2"></i> Create Menu
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="bg-white rounded shadow-sm p-3">
            <h6 className="mb-3">Menus (Containers)</h6>
            <div className="list-group list-group-flush">
              {menus.map(menu => (
                <button
                  key={menu.id}
                  className={`list-group-item list-group-item-action ${selectedMenu?.id === menu.id ? 'active' : ''}`}
                  onClick={() => { setSelectedMenu(menu); setShowItemForm(false); }}
                >
                  <div className="fw-bold d-flex align-items-center justify-content-between">
                    {menu.name}
                    {menu.slug === 'main-nav' && (
                      <span className="badge bg-success ms-2" style={{ fontSize: '0.65rem' }}>STOREFRONT HEADER</span>
                    )}
                  </div>
                  <small style={{ color: selectedMenu?.id === menu.id ? '#ddd' : '#6c757d' }}>Slug: {menu.slug}</small>
                </button>
              ))}
            </div>
            <div className="mt-3 text-muted small border-top pt-3">
              <i className="fas fa-info-circle me-1"></i>
              <strong>Note:</strong> Menus are containers. Add Menu Items <em>inside</em> the <strong>Main Navigation</strong> to change the storefront header.
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="bg-white rounded shadow-sm p-4">
            {selectedMenu ? (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
                  <div>
                    <h5 className="mb-0 d-inline-block">{selectedMenu.name}</h5>
                    {selectedMenu.slug === 'main-nav' && (
                      <span className="badge bg-success ms-2">STOREFRONT HEADER</span>
                    )}
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={() => {
                    setItemForm({ ...initialItemState, order: selectedMenu.items?.length || 0 });
                    setEditingItem(null);
                    setShowItemForm(true);
                  }}>
                    <i className="fas fa-plus me-1"></i> Add Root Item
                  </button>
                </div>

                {showItemForm && (
                  <div className="card mb-4 border-primary">
                    <div className="card-body">
                      <h6>{editingItem ? 'Edit Item' : 'Add Item'}</h6>
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small">Label</label>
                          <input type="text" className="form-control form-control-sm" value={itemForm.label} onChange={e => setItemForm({ ...itemForm, label: e.target.value })} />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label small">Type</label>
                          <select className="form-select form-select-sm" value={itemForm.type} onChange={e => setItemForm({ ...itemForm, type: e.target.value })}>
                            <option value="link">Standard Link</option>
                            <option value="dropdown">Dropdown</option>
                            <option value="mega_menu">Mega Menu</option>
                            <option value="button">Button</option>
                            <option value="system_action">System Action</option>
                          </select>
                        </div>

                        {itemForm.type === 'system_action' && (
                          <div className="col-md-6">
                            <label className="form-label small">System Action</label>
                            <select className="form-select form-select-sm" value={itemForm.systemAction || ''} onChange={e => setItemForm({ ...itemForm, systemAction: e.target.value })}>
                              <option value="">Select action...</option>
                              <option value="search">Search Overlay</option>
                              <option value="wishlist">Wishlist</option>
                              <option value="account">Account Dropdown</option>
                              <option value="cart">Cart Sidebar</option>
                            </select>
                          </div>
                        )}

                        {(itemForm.type === 'link' || itemForm.type === 'button') && (
                          <>
                            <div className="col-md-6">
                              <label className="form-label small">Destination Type</label>
                              <select className="form-select form-select-sm" value={itemForm.destinationType || ''} onChange={e => setItemForm({ ...itemForm, destinationType: e.target.value })}>
                                <option value="">Select destination...</option>
                                <option value="internal">Internal Link</option>
                                <option value="category">Category</option>
                                <option value="collection">Collection</option>
                                <option value="product">Product</option>
                                <option value="page">CMS Page</option>
                                <option value="external">External URL</option>
                              </select>
                            </div>
                            
                            {itemForm.destinationType === 'category' && (
                              <div className="col-md-6">
                                <label className="form-label small">Select Category</label>
                                <select className="form-select form-select-sm" value={itemForm.categoryId || ''} onChange={e => setItemForm({ ...itemForm, categoryId: e.target.value })}>
                                  <option value="">-- Choose Category --</option>
                                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                              </div>
                            )}

                            {itemForm.destinationType === 'collection' && (
                              <div className="col-md-6">
                                <label className="form-label small">Select Collection</label>
                                <select className="form-select form-select-sm" value={itemForm.collectionId || ''} onChange={e => setItemForm({ ...itemForm, collectionId: e.target.value })}>
                                  <option value="">-- Choose Collection --</option>
                                  {collections.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                              </div>
                            )}

                            {itemForm.destinationType === 'product' && (
                              <div className="col-md-6">
                                <label className="form-label small">Select Product</label>
                                <select className="form-select form-select-sm" value={itemForm.productId || ''} onChange={e => setItemForm({ ...itemForm, productId: e.target.value })}>
                                  <option value="">-- Choose Product --</option>
                                  {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                </select>
                              </div>
                            )}

                            {itemForm.destinationType === 'page' && (
                              <div className="col-md-6">
                                <label className="form-label small">Select Page</label>
                                <select className="form-select form-select-sm" value={itemForm.pageId || ''} onChange={e => setItemForm({ ...itemForm, pageId: e.target.value })}>
                                  <option value="">-- Choose Page --</option>
                                  {pages.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
                                </select>
                              </div>
                            )}

                            {itemForm.destinationType === 'internal' && (
                              <div className="col-md-6">
                                <label className="form-label small">Internal Link</label>
                                <input type="text" className="form-control form-control-sm" value={itemForm.url || ''} onChange={e => setItemForm({ ...itemForm, url: e.target.value })} placeholder="e.g. /shop" />
                                <small className="text-muted" style={{fontSize: '0.65rem'}}>Must start with /</small>
                              </div>
                            )}

                            {itemForm.destinationType === 'external' && (
                              <>
                                <div className="col-md-6">
                                  <label className="form-label small">External URL</label>
                                  <input type="text" className="form-control form-control-sm" value={itemForm.url || ''} onChange={e => setItemForm({ ...itemForm, url: e.target.value })} placeholder="https://example.com" />
                                  <small className="text-muted" style={{fontSize: '0.65rem'}}>Must start with http:// or https://</small>
                                </div>
                                <div className="col-md-6 d-flex align-items-center">
                                  <div className="form-check mt-3">
                                    <input className="form-check-input" type="checkbox" id="openInNewTab" checked={itemForm.target === '_blank'} onChange={e => setItemForm({ ...itemForm, target: e.target.checked ? '_blank' : '_self' })} />
                                    <label className="form-check-label small" htmlFor="openInNewTab">Open in new tab</label>
                                  </div>
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {(itemForm.type === 'dropdown' || itemForm.type === 'mega_menu') && (
                          <div className="col-md-6">
                            <label className="form-label small">Dynamic Source (Optional)</label>
                            <select className="form-select form-select-sm" value={itemForm.source || ''} onChange={e => setItemForm({ ...itemForm, source: e.target.value })}>
                              <option value="manual">Manual (Use Children)</option>
                              <option value="dynamic_categories">Dynamic Categories List</option>
                              <option value="dynamic_collections">Dynamic Collections List</option>
                            </select>
                          </div>
                        )}

                        {itemForm.type === 'button' && (
                          <div className="col-md-6">
                            <label className="form-label small">Button Variant</label>
                            <select className="form-select form-select-sm" value={itemForm.variant || 'primary'} onChange={e => setItemForm({ ...itemForm, variant: e.target.value })}>
                              <option value="primary">Primary</option>
                              <option value="secondary">Secondary</option>
                              <option value="outline-primary">Outline Primary</option>
                              <option value="danger">Danger</option>
                            </select>
                          </div>
                        )}

                        <div className="col-md-4">
                          <label className="form-label small">Icon (FA Class)</label>
                          <input type="text" className="form-control form-control-sm" value={itemForm.icon || ''} onChange={e => setItemForm({ ...itemForm, icon: e.target.value })} placeholder="fas fa-home" />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small">Badge Text</label>
                          <input type="text" className="form-control form-control-sm" value={itemForm.badgeText || ''} onChange={e => setItemForm({ ...itemForm, badgeText: e.target.value })} placeholder="NEW" />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label small">Badge Variant</label>
                          <select className="form-select form-select-sm" value={itemForm.badgeVariant || 'primary'} onChange={e => setItemForm({ ...itemForm, badgeVariant: e.target.value })}>
                            <option value="primary">Primary</option>
                            <option value="danger">Danger</option>
                            <option value="success">Success</option>
                            <option value="warning">Warning</option>
                          </select>
                        </div>

                        <div className="col-12 mt-3 d-flex gap-3">
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" checked={itemForm.visible} onChange={e => setItemForm({ ...itemForm, visible: e.target.checked })} />
                            <label className="form-check-label small">Published</label>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" checked={itemForm.desktopVisible} onChange={e => setItemForm({ ...itemForm, desktopVisible: e.target.checked })} />
                            <label className="form-check-label small">Show on Desktop</label>
                          </div>
                          <div className="form-check form-switch">
                            <input className="form-check-input" type="checkbox" checked={itemForm.mobileVisible} onChange={e => setItemForm({ ...itemForm, mobileVisible: e.target.checked })} />
                            <label className="form-check-label small">Show on Mobile</label>
                          </div>
                        </div>

                        <div className="col-md-12 text-end mt-3">
                          <button className="btn btn-sm btn-light me-2" onClick={() => setShowItemForm(false)}>Cancel</button>
                          <button className="btn btn-sm btn-primary" onClick={saveItem}>Save Item</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="border rounded p-2 bg-light">
                  {renderTree(selectedMenu.items)}
                  {(!selectedMenu.items || selectedMenu.items.length === 0) && (
                    <div className="text-muted text-center py-4">No items yet.</div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-5 text-muted">
                <i className="fas fa-sitemap fs-1 mb-3"></i>
                <p>Select a menu from the left to edit its structure.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
