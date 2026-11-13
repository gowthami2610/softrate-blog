
import { useState, useEffect } from 'react'
import './App.css'
import Admin from './Admin'

// Backend API URL
const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000'

const categories = [
  'All',
  'AI & ML',
  'Web Development',
  'Cloud Computing',
  'Cybersecurity',
  'Technology',
]

function App() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdmin, setShowAdmin] = useState(false)
  const [selectedArticle, setSelectedArticle] = useState(null)

  // Fetch articles from the backend
  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch articles')
        }

        return response.json()
      })
      .then((data) => {
        const formattedArticles = data.map((article) => ({
          ...article,
          id: article._id,
          date: new Date(article.createdAt).toLocaleDateString(
            'en-US',
            {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }
          ),
        }))

        setArticles(formattedArticles)
      })
      .catch((error) => {
        console.error('Error fetching articles:', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Find the featured article
  const featuredArticle =
    articles.find((article) => article.featured) || articles[0]

  // Filter articles based on category and search
  const filteredArticles = articles.filter((article) => {
    const matchesCategory =
      selectedCategory === 'All' ||
      article.category === selectedCategory

    const matchesSearch =
      (article.title || '')
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (article.description || '')
        .toLowerCase()
        .includes(search.toLowerCase())

    // Include featured articles in Explore Articles
    return matchesCategory && matchesSearch
  })

  // Display Admin page when Admin Login is clicked
  if (showAdmin) {
    return <Admin onBack={() => setShowAdmin(false)} />
  }

  // Display the full article when a visitor selects one
  if (selectedArticle) {
    return (
      <div className="website">
        <header className="navbar">
          <div className="logo">Tech<span>Sphere</span></div>

          <button
            className="admin-link"
            onClick={() => setSelectedArticle(null)}
          >
            Back to Articles
          </button>
        </header>

        <main className="container">
          <article className="latest-section">
            <span className="article-category">
              {selectedArticle.category}
            </span>

            <h1>{selectedArticle.title}</h1>

            <div className="article-meta">
              By {selectedArticle.author} · {selectedArticle.date}
            </div>

            <img
              src={selectedArticle.image}
              alt={selectedArticle.title}
              className="featured-image"
            />

            <p>{selectedArticle.description}</p>

            <div className="article-content">
              {selectedArticle.content}
            </div>
          </article>
        </main>

        <footer className="footer">
          <h2>TechSphere</h2>
          <p>Your source for technology, innovation and digital insights.</p>
        </footer>
      </div>
    )
  }

  return (
    <div className="website">

      {/* Navigation bar */}
      <header className="navbar">
        <div className="logo">Tech<span>Sphere</span></div>

        <nav>
          <a href="#home">Home</a>
          <a href="#latest">Articles</a>
          <a href="#categories">Categories</a>
          <a href="#about">About</a>
        </nav>

        <button
          className="admin-link"
          onClick={() => setShowAdmin(true)}
        >
          Admin Login
        </button>
      </header>

      {/* Featured article */}
      <main id="home" className="container">

        {loading ? (
          <p>Loading articles...</p>
        ) : featuredArticle ? (
          <section className="featured-section">
            <div className="featured-content">
              <span className="tag">FEATURED ARTICLE</span>

              <h1>{featuredArticle.title}</h1>
              <p>{featuredArticle.description}</p>

              <div className="article-meta">
                By {featuredArticle.author} · {featuredArticle.date}
              </div>

              <button
                className="read-button"
                onClick={() => setSelectedArticle(featuredArticle)}
              >
                Read Full Article →
              </button>
            </div>

            <img
              src={featuredArticle.image}
              alt={featuredArticle.title}
              className="featured-image"
            />
          </section>
        ) : (
          <p>No featured articles available yet.</p>
        )}

        {/* Categories */}
        <section id="categories" className="categories-section">
          <h2>Explore Categories</h2>

          <div className="category-list">
            {categories.map((category) => (
              <button
                key={category}
                className={
                  selectedCategory === category
                    ? 'category-button active'
                    : 'category-button'
                }
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </section>

        {/* Latest articles */}
        <section id="latest" className="latest-section">
          <div className="section-heading">
            <div>
              <span className="tag">OUR BLOG</span>
              <h2>Latest Articles</h2>
            </div>

            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="search-input"
            />
          </div>

          <div className="content-layout">
            <div className="article-grid">

              {loading ? (
                <p>Loading articles...</p>
              ) : filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                  <article
                    className="article-card"
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={article.image} alt={article.title} />

                    <div className="article-info">
                      <span className="article-category">
                        {article.category}
                      </span>

                      <h3>{article.title}</h3>
                      <p>{article.description}</p>

                      <div className="article-footer">
                        <span>{article.author}</span>
                        <span>{article.date}</span>
                      </div>

                      <span className="read-button">
                        Read More →
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <p className="no-results">
                  No articles found. Try another search or category.
                </p>
              )}

            </div>

            {/* Popular articles */}
            <aside className="popular-section">
              <h3>Popular Articles</h3>

              {articles
                .filter((article) => !article.featured)
                .slice(0, 3)
                .map((article) => (
                  <div
                    className="popular-item"
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    style={{ cursor: 'pointer' }}
                  >
                    <img src={article.image} alt="" />

                    <div>
                      <h4>{article.title}</h4>
                      <span>{article.date}</span>
                    </div>
                  </div>
                ))}
            </aside>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="about" className="footer">
        <h2>TechSphere</h2>
        <p>
          Your source for technology, innovation and digital insights.
        </p>
        <p>© 2026 TechSphere. All rights reserved.</p>
      </footer>

    </div>
  )
}

export default App
