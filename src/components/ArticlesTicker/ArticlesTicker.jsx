import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { endpoint } from "../../api/endpoints";
import axios from "axios";
import "./ArticlesTicker.css";

const parseTags = (s = "") =>
  s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";

/* ── Single card ── */
const TickerCard = ({ article, navigate }) => {
  const tags = parseTags(article.tags);
  const date = formatDate(article.published_at || article.created_at);

  return (
    <article
      className="at-card"
      onClick={() => navigate(`/articles/${article.slug}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) =>
        e.key === "Enter" && navigate(`/articles/${article.slug}`)
      }
    >
      {article.thumbnail ? (
        <div className="at-card-thumb">
          <img src={article.thumbnail} alt={article.title} />
          <div className="at-card-thumb-overlay" />
        </div>
      ) : (
        <div className="at-card-thumb at-card-thumb--blank">
          <span className="at-card-thumb-initials">
            {article.title?.charAt(0) || "N"}
          </span>
        </div>
      )}

      <div className="at-card-body">
        <div className="at-card-meta">
          {tags[0] && <span className="at-card-tag">{tags[0]}</span>}
          {date && <span className="at-card-date">{date}</span>}
        </div>
        <h3 className="at-card-title">{article.title}</h3>
        {article.excerpt && (
          <p className="at-card-excerpt">{article.excerpt}</p>
        )}
        <div className="at-card-footer">
          <span className="at-card-author">{article.author}</span>
          {article.institution && (
            <span className="at-card-inst">{article.institution}</span>
          )}
        </div>
      </div>
    </article>
  );
};

/* ── Main component ── */
const ArticlesTicker = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const trackRef = useRef(null);

  useEffect(() => {
    axios
      .get(endpoint().article.list)
      .then((r) => setArticles(r.data || []))
      .catch((e) => console.error("Failed to load articles", e))
      .finally(() => setLoading(false));
  }, []);

  // Pause animation on hover
  const pauseScroll = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "paused";
  };
  const resumeScroll = () => {
    if (trackRef.current) trackRef.current.style.animationPlayState = "running";
  };

  // Need at least 1; duplicate to fill ticker if few articles
  const displayArticles = articles.length > 0 ? articles : [];

  // Duplicate enough times so scroll feels infinite regardless of count
  const tiles =
    displayArticles.length > 0
      ? [...displayArticles, ...displayArticles, ...displayArticles]
      : [];

  return (
    <section className="at-section">
      {/* ── Section header ── */}
      <div className="at-header">
        <div className="at-header-left">
          <span className="at-eyebrow">From the Journal</span>
          <h2 className="at-heading">
            Articles &amp; <em>Scholarship</em>
          </h2>
        </div>
        <a href="/articles" className="at-view-all">
          View all articles
          <span className="at-view-all-arrow">→</span>
        </a>
      </div>

      {/* ── Ticker ── */}
      {loading ? (
        <div className="at-skeleton-row">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="at-skel-card">
              <div className="at-skel-thumb" />
              <div className="at-skel-body">
                <div className="at-skel-line at-skel-line--sm" />
                <div className="at-skel-line at-skel-line--lg" />
                <div className="at-skel-line at-skel-line--md" />
              </div>
            </div>
          ))}
        </div>
      ) : displayArticles.length === 0 ? (
        <div className="at-empty">
          <p className="at-empty-text">No Articles Published yet.</p>
          <a href="/articles" className="at-empty-link">
            Go to Articles →
          </a>
        </div>
      ) : (
        <div
          className="at-ticker-viewport"
          onMouseEnter={pauseScroll}
          onMouseLeave={resumeScroll}
        >
          {/* Left fade */}
          <div className="at-fade at-fade--left" />

          <div
            className="at-ticker-track"
            ref={trackRef}
            style={{
              // Dynamic animation duration: more articles = slower feel
              animationDuration: `${Math.max(30, displayArticles.length * 10)}s`,
            }}
          >
            {tiles.map((article, i) => (
              <TickerCard
                key={`${article.id}-${i}`}
                article={article}
                navigate={navigate}
              />
            ))}
          </div>

          {/* Right fade */}
          <div className="at-fade at-fade--right" />
        </div>
      )}
    </section>
  );
};

export default ArticlesTicker;
