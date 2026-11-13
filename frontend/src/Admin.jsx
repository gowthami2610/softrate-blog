
import { useState, useEffect } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function Admin({ onBack }) {
  const initialFormData = {
    title: '',
    slug: '',
    description: '',
    category: 'Technology',
    author: 'Admin',
    image: '',
    content: '',
    status: 'published',
    featured: false,
  }

  const [formData, setFormData] = useState(initialFormData)
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState(null)

  const [token, setToken] = useState(
    sessionStorage.getItem('adminToken') || ''
  )

  const [showPassword, setShowPassword] = useState(false)

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  })

  // Fetch articles after successful login
  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }

    setLoading(true)

    fetch(`${API_URL}/api/articles/manage`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 401) {
            sessionStorage.removeItem('adminToken')
            setToken('')
            throw new Error('Session expired. Please login again.')
          }

          throw new Error('Failed to fetch articles')
        }

        return response.json()
      })
      .then((data) => {
        setArticles(data)
      })
      .catch((error) => {
        setMessage(error.message)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [token])

  // Automatically hide dashboard notifications after 3 seconds
  useEffect(() => {
    if (!message) return

    const timer = window.setTimeout(() => {
      setMessage('')
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [message])

  // Admin login
  const handleLogin = async (event) => {
    event.preventDefault()
    setMessage('Logging in...')

    try {
      const response = await fetch(
        `${API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(loginData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      sessionStorage.setItem('adminToken', data.token)
      setToken(data.token)

      setLoginData({
        username: '',
        password: '',
      })

      setMessage('Login successful!')

    } catch (error) {
      setMessage(error.message)
    }
  }

  // Admin logout
  const handleLogout = () => {
    sessionStorage.removeItem('adminToken')
    setToken('')
    setArticles([])
    setEditingId(null)
    setFormData(initialFormData)
    setMessage('You have logged out successfully.')
  }

  // Handle article form changes
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
  }

  // Load an article into the form for editing
  const handleEdit = (article) => {
    setEditingId(article._id)

    setFormData({
      title: article.title || '',
      slug: article.slug || '',
      description: article.description || '',
      category: article.category || 'Technology',
      author: article.author || 'Admin',
      image: article.image || '',
      content: article.content || '',
      status: article.status || 'published',
      featured: article.featured || false,
    })

    setMessage('Editing article: ' + article.title)

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingId(null)
    setFormData(initialFormData)
    setMessage('')
  }

  // Delete an article
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this article?'
    )

    if (!confirmDelete) {
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/articles/${id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to delete article')
      }

      setArticles((previousArticles) =>
        previousArticles.filter((article) => article._id !== id)
      )

      if (editingId === id) {
        handleCancelEdit()
      }

      setMessage('Article deleted successfully!')

    } catch (error) {
      setMessage(error.message)
    }
  }

  // Create or update an article
  const handleSubmit = async (event) => {
    event.preventDefault()

    setMessage(editingId ? 'Updating article...' : 'Saving article...')

    const slug = formData.slug.trim() ||
      formData.title.toLowerCase().trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')

    const articleData = {
      ...formData,
      slug,
      readingTime: 5,
    }

    try {
      const response = await fetch(
        editingId
          ? `${API_URL}/api/articles/${editingId}`
          : `${API_URL}/api/articles`,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(articleData),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Unable to save article')
      }

      if (editingId) {
        setArticles((previousArticles) =>
          previousArticles.map((article) =>
            article._id === editingId ? data : article
          )
        )

        setMessage('Article updated successfully!')

      } else {
        setArticles((previousArticles) => [data, ...previousArticles])

        setMessage('Article created successfully!')
      }

      setEditingId(null)
      setFormData(initialFormData)

    } catch (error) {
      setMessage(error.message)
    }
  }

  // Redesigned admin login screen
  if (!token) {
    return (
      <div className="admin-login-page">
        <header className="admin-login-header">
          <div className="logo">
            Tech<span>Sphere</span>
          </div>

          <button onClick={onBack} className="admin-link">
            Back to Homepage
          </button>
        </header>

        <main className="admin-login-main">
          <div className="admin-login-card">
            <div className="admin-login-icon">TS</div>

            <span className="tag">ADMIN PANEL</span>

            <h1>Welcome Back</h1>

            <p className="admin-login-subtitle">
              Sign in to manage your TechSphere articles.
            </p>

            <form onSubmit={handleLogin} className="admin-login-form">
              <div className="admin-form-group">
                <label>Username</label>

                <input
                  type="text"
                  placeholder="Enter your username"
                  value={loginData.username}
                  onChange={(event) =>
                    setLoginData({
                      ...loginData,
                      username: event.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="admin-form-group">
                <label>Password</label>

                <div className="admin-password-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(event) =>
                      setLoginData({
                        ...loginData,
                        password: event.target.value,
                      })
                    }
                    required
                  />

                  <button
                    type="button"
                    className="admin-password-toggle"
                    onClick={() =>
                      setShowPassword((previous) => !previous)
                    }
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button type="submit" className="admin-login-button">
                Login to Dashboard
              </button>

              {message && (
                <p className="admin-login-message">{message}</p>
              )}
            </form>

            <p className="admin-login-footer">
              Secure Admin Access · TechSphere
            </p>
          </div>
        </main>
      </div>
    )
  }

  // Admin dashboard after login
  return (
    <div className="website">
      <header className="navbar">
        <div className="logo">
          Tech<span>Sphere</span>
        </div>

        <div>
          <button
            onClick={handleLogout}
            className="admin-link"
          >
            Logout
          </button>

          <button
            onClick={onBack}
            className="admin-link"
            style={{ marginLeft: '10px' }}
          >
            Back to Homepage
          </button>
        </div>
      </header>

      {/* Temporary notification popup */}
      {message && (
        <div className="admin-toast" role="status" aria-live="polite">
          {message}
        </div>
      )}

      <main className="container">

        {/* Create or Edit Article */}
        <section className="latest-section">
          <span className="tag">ADMIN PANEL</span>

          <h1>
            {editingId ? 'Edit Article' : 'Create New Article'}
          </h1>

          <form onSubmit={handleSubmit}>
            <p>
              <label>Article Title</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </p>

            <p>
              <label>URL Slug (optional)</label>
              <input
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="Generated automatically from title"
              />
            </p>

            <p>
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </p>

            <p>
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option>Technology</option>
                <option>AI & ML</option>
                <option>Web Development</option>
                <option>Cloud Computing</option>
                <option>Cybersecurity</option>
                <option>DevOps</option>
              </select>
            </p>

            <p>
              <label>Author</label>
              <input
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
              />
            </p>

            <p>
              <label>Image URL</label>
              <input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Paste an image URL"
              />
            </p>

            <p>
              <label>Article Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="8"
                required
              />
            </p>

            <p>
              <label>Publication Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </p>

            <p>
              <label>
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                />
                Mark as Featured Article
              </label>
            </p>

            <button type="submit" className="read-button">
              {editingId ? 'Update Article' : 'Save Article'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={handleCancelEdit}
                style={{ marginLeft: '10px' }}
              >
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        {/* Manage Existing Articles */}
        <section className="latest-section">
          <span className="tag">CONTENT MANAGEMENT</span>

          <h2>Manage Articles</h2>

          {loading ? (
            <p>Loading articles...</p>
          ) : articles.length > 0 ? (
            articles.map((article) => (
              <div className="popular-item" key={article._id}>
                <div>
                  <h3>{article.title}</h3>
                  <p>{article.category}</p>
                  <span>Status: {article.status}</span>

                  <br />

                  <button
                    type="button"
                    onClick={() => handleEdit(article)}
                    style={{
                      marginTop: '10px',
                      padding: '8px 16px',
                      backgroundColor: '#2563eb',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(article._id)}
                    style={{
                      marginTop: '10px',
                      marginLeft: '10px',
                      padding: '8px 16px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p>No articles available.</p>
          )}
        </section>

      </main>
    </div>
  )
}

export default Admin
