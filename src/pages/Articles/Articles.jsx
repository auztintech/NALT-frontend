import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { endpoint } from "../../api/endpoints";
import ArticleDetail from "./ArticleDetail";
import "./ArticleDetail.css";
import axios from "axios";
import "./Articles.css";
import EmptyState from "../../components/EmptyState/EmptyState";
import Footer from "../../components/Footer/Footer";

/* ─── Helpers ─────────────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const parseTags = (tagStr = "") =>
  tagStr
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

/* ─── Skeleton card ───────────────────────────────────────── */
const SkeletonCard = ({ featured }) => (
  <div
    className={`art-card art-skeleton ${featured ? "art-card--featured" : ""}`}
  >
    <div className="art-skel-thumb" />
    <div className="art-card-body">
      <div className="art-skel-line art-skel-line--sm" />
      <div className="art-skel-line art-skel-line--lg" />
      <div className="art-skel-line art-skel-line--md" />
      <div
        className="art-skel-line art-skel-line--sm"
        style={{ marginTop: 16 }}
      />
    </div>
  </div>
);

/* ─── Single article card ─────────────────────────────────── */
const ArticleCard = ({ article, featured }) => {
  const tags = parseTags(article.tags);
  const date = formatDate(article.published_at || article.created_at);

  return (
    <article
      className={`art-card ${featured ? "art-card--featured" : ""}`}
      style={{ "--delay": `${Math.random() * 0.15}s` }}
    >
      {article.thumbnail && (
        <div className="art-thumb-wrap">
          <img
            src={article.thumbnail}
            alt={article.title}
            className="art-thumb"
          />
        </div>
      )}
      <div className="art-card-body">
        <div className="art-meta-row">
          {tags[0] && <span className="art-tag">{tags[0]}</span>}
          {date && <span className="art-date">{date}</span>}
        </div>
        <h2 className="art-card-title">
          <a href={`/articles/${article.slug}`} className="art-title-link">
            {article.title}
          </a>
        </h2>
        {article.excerpt && <p className="art-excerpt">{article.excerpt}</p>}
        <div className="art-byline-row">
          <span className="art-author">{article.author}</span>
          {article.institution && (
            <>
              <span className="art-dot" />
              <span className="art-institution">{article.institution}</span>
            </>
          )}
        </div>
        {tags.length > 1 && (
          <div className="art-tags">
            {tags.slice(1).map((t) => (
              <span key={t} className="art-tag art-tag--secondary">
                {t}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};

/* ─── Page ────────────────────────────────────────────────── */
const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(endpoint().article.list)
      .then((r) => setArticles(r.data))
      .catch((e) => console.error("Error fetching articles:", e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = articles.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.author?.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q) ||
      a.tags?.toLowerCase().includes(q)
    );
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);
  console.log(articles[0]);
  console.log(articles[0]?.thumbnail);

  return (
    <>
      <Header />

      <main className="art-main">
        {/* ── Hero band ── */}
        <div className="art-hero">
          <div className="art-hero-inner">
            <p className="art-hero-eyebrow">
              57th NALT National Conference · 2026
            </p>
            <h1 className="art-hero-title">
              Articles &amp; <em>Scholarship</em>
            </h1>
            <p className="art-hero-sub">
              Peer-reviewed contributions from law educators across Nigeria on
              legal education, emerging technologies and the sustainable
              development goals.
            </p>
          </div>
          <div className="art-hero-rule" />
        </div>

        <div className="art-page">
          {/* ── Search + count ── */}
          <div className="art-toolbar">
            <div className="art-search-wrap">
              <input
                className="art-search"
                type="search"
                placeholder="Search by title, author or keyword…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {!loading && (
              <p className="art-count">
                {filtered.length}{" "}
                {filtered.length === 1 ? "article" : "articles"}
              </p>
            )}
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="art-grid">
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} featured={i === 0} />
              ))}
            </div>
          ) : // ) : filtered.length === 0 ? (
          //   <div className="art-empty">
          //     <p className="art-empty-title">No articles found.</p>
          //     <p className="art-empty-sub">Try a different search term.</p>
          //   </div>

          articles.length === 0 ? (
            // backend has nothing yet — show the full conference holding page
            <EmptyState type="articles" />
          ) : filtered.length === 0 ? (
            // user searched but nothing matched — keep it simple
            <div className="art-empty">
              <p className="art-empty-title">No results for "{search}"</p>
              <p className="art-empty-sub">Try a different keyword.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div className="art-featured-wrap">
                  <span className="art-section-label">Featured</span>
                  <ArticleCard article={featured} featured />
                </div>
              )}

              {/* Grid */}
              {rest.length > 0 && (
                <div className="art-rest-section">
                  <span className="art-section-label">All Articles</span>
                  <div className="art-grid">
                    {rest.map((a) => (
                      <ArticleCard key={a.id} article={a} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Articles;
