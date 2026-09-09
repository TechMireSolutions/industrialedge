import { getImageUrl } from '../utils/getImageUrl';
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader.jsx'
import ProductCard from '../components/ProductCard.jsx'

import { collectionApi, productApi } from '../services'

export default function CollectionPage() {
  const { slug } = useParams()
  const [collection, setCollection] = useState(null)
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('grid')

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const collRes = await collectionApi.getBySlug(slug)
        setCollection(collRes.data?.data || collRes.data)

        const prodRes = await productApi.getAll({ collection: slug, limit: 100 })
        setProducts(prodRes.data?.data || [])
      } catch (err) {
        console.error('Failed to load collection', err)
        setError('Collection not found')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [slug])

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    )
  }

  if (error || !collection) {
    return (
      <div className="container-fluid py-5 text-center">
        <h2>{error || 'Collection not found'}</h2>
        <Link to="/shop" className="btn btn-primary mt-3">Back to Shop</Link>
      </div>
    )
  }

  return (
    <>
      <PageHeader title={collection.name} crumb="Collection" />

      <div className="container-fluid shop py-5">
        <div className="container py-5">
          {collection.image && (
            <div className="mb-5 text-center">
              <img src={getImageUrl(collection.image)} alt={collection.name} className="img-fluid rounded" style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }} />
            </div>
          )}
          {collection.description && (
            <div className="text-center mb-5 max-w-2xl mx-auto">
              <p className="lead">{collection.description}</p>
            </div>
          )}

          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4 className="mb-0">{products.length} Products</h4>
            <div className="d-flex align-items-center gap-2">
              <button className={`btn btn-sm ${view === 'grid' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('grid')}><i className="fas fa-th"></i></button>
              <button className={`btn btn-sm ${view === 'list' ? 'btn-primary' : 'btn-outline-primary'}`} onClick={() => setView('list')}><i className="fas fa-bars"></i></button>
            </div>
          </div>

          {products.length === 0 ? (
            <div className="text-center py-5">
              <h5 className="text-muted">No products in this collection yet.</h5>
            </div>
          ) : view === 'grid' ? (
            <div className="row g-4 product">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} delay={`${0.1 + (i % 3) * 0.2}s`} />
              ))}
            </div>
          ) : (
            <div className="row g-4 product">
              {products.map((p, i) => (
                <ProductCard key={p.id} product={p} layout="list" colClass="col-lg-6" delay={`${0.1 + (i % 3) * 0.2}s`} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

