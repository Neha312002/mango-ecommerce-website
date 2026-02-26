'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export default function AdminProducts() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: '',
    stock: '',
    weight: '',
    origin: '',
    season: '',
  });
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const handleOpenModal = (product: any = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        image: product.image,
        stock: product.stock?.toString() || '100',
        weight: product.weight || '1 kg',
        origin: product.origin || '',
        season: product.season || '',
      });
      setImagePreview(product.image);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        image: '',
        stock: '100',
        weight: '1 kg',
        origin: 'Local Farm',
        season: 'All Year',
      });
      setImagePreview('');
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingProduct(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Update image preview if image URL is changed
    if (name === 'image') {
      setImagePreview(value);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    setUploadingImage(true);

    try {
      // Convert to base64 for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        setFormData({
          ...formData,
          image: base64String,
        });
        setUploadingImage(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate image
    if (!formData.image) {
      alert('Please upload an image or provide an image URL');
      return;
    }
    
    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('You are not logged in. Please login again.');
        return;
      }

      const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
      const method = editingProduct ? 'PUT' : 'POST';

      console.log(`${method} request to:`, url);
      console.log('Token exists:', !!token);

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
        }),
      });

      console.log('Response status:', res.status);

      if (res.ok) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product added successfully!');
        handleCloseModal();
        fetchProducts();
      } else {
        const error = await res.json();
        console.error('Error response:', error);
        alert(`Error: ${error.error || 'Failed to save product'}`);
      }
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Failed to save product. Check console for details.');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        alert('You are not logged in. Please login again.');
        return;
      }

      console.log('DELETE request to:', `/api/products/${id}`);
      console.log('Token exists:', !!token);

      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Delete response status:', res.status);

      if (res.ok) {
        alert('Product deleted successfully!');
        fetchProducts();
      } else {
        const error = await res.json();
        console.error('Delete error response:', error);
        alert(`Failed to delete product: ${error.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Check console for details.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin text-6xl mb-4">🥭</div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[#3D4F42] mb-2">Products Management</h1>
          <p className="text-gray-600">Manage your mango products, stock, and pricing</p>
        </div>
        <motion.button
          onClick={() => handleOpenModal()}
          className="bg-[#ffa62b] hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold transition flex items-center gap-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>➕</span>
          <span>Add Product</span>
        </motion.button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="relative h-48">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#3D4F42] mb-2">{product.name}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-[#ffa62b]">
                  ₹{product.price.toFixed(2)}/kg
                </span>
                <span className="text-sm text-gray-500">
                  Stock: {product.stock || 'N/A'}
                </span>
              </div>
              <div className="flex gap-2">
                <motion.button
                  onClick={() => handleOpenModal(product)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  ✏️ Edit
                </motion.button>
                <motion.button
                  onClick={() => handleDelete(product.id)}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  🗑️ Delete
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add/Edit Product Modal */}
      <AnimatePresence>
        {modalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-[#3D4F42]">
                    {editingProduct ? 'Edit Product' : 'Add New Product'}
                  </h2>
                  <button
                    onClick={handleCloseModal}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                      placeholder="e.g., Alphonso Mango"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                      placeholder="Describe your product..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Price (₹/kg) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                        step="0.01"
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                        placeholder="0.00"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Stock
                      </label>
                      <input
                        type="number"
                        name="stock"
                        value={formData.stock}
                        onChange={handleInputChange}
                        min="0"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Image *
                    </label>
                    
                    {/* Image Preview */}
                    {imagePreview && (
                      <div className="mb-3 relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-48 object-cover rounded-lg border-2 border-gray-200"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview('');
                            setFormData({ ...formData, image: '' });
                          }}
                          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="flex gap-2">
                      <label className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition font-semibold">
                          {uploadingImage ? (
                            <>
                              <span className="animate-spin">⏳</span>
                              <span>Uploading...</span>
                            </>
                          ) : (
                            <>
                              <span>📤</span>
                              <span>Upload Image</span>
                            </>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>

                    {/* Or URL Input */}
                    <div className="mt-3">
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">or paste image URL</span>
                        </div>
                      </div>
                      <input
                        type="text"
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Weight
                      </label>
                      <input
                        type="text"
                        name="weight"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                        placeholder="1 kg"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Origin
                      </label>
                      <input
                        type="text"
                        name="origin"
                        value={formData.origin}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                        placeholder="e.g., Ratnagiri, India"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Season
                    </label>
                    <input
                      type="text"
                      name="season"
                      value={formData.season}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ffa62b] focus:border-transparent"
                      placeholder="e.g., Summer (April-June)"
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      type="submit"
                      className="flex-1 bg-[#ffa62b] hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-semibold transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {editingProduct ? 'Update Product' : 'Add Product'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={handleCloseModal}
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
