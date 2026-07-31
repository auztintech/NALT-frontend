import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { endpoint } from "../../api/endpoints";
import "./ArticleDetail.css";
import axios from "axios";
import Footer from "../../components/Footer/Footer";

/* ─── Helpers ─────────────────────────────────────────────── */
const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

const parseTags = (s = "") =>
  s
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

const readingTime = (text = "") => {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

/* ─── Reading progress bar ────────────────────────────────── */
const ReadingProgress = () => {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const scrolled = el.scrollTop;
      const total = el.scrollHeight - el.clientHeight;
      setPct(total > 0 ? (scrolled / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="ad-progress-track">
      <div className="ad-progress-fill" style={{ width: `${pct}%` }} />
    </div>
  );
};

/* ─── Page ────────────────────────────────────────────────── */
const ArticleDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const bodyRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setNotFound(false);

    // axios
    //   .get(`${endpoint().article.list}${slug}/`)
    //   .then((r) => {
    //     setArticle(r.data);
    //     // fetch related (all articles, pick a few excluding current)
    //     return axios.get(endpoint().article.list);
    //   })
    //   .then((r) => {
    //     setRelated(
    //       (r.data || []).filter((a) => a.slug !== slug).slice(0, 3)
    //     );
    //   })
    axios
      .get(endpoint().article.detail(slug))
      .then((r) => {
        setArticle(r.data);
        return axios.get(endpoint().article.list);
      })
      .then((r) => {
        setRelated((r.data || []).filter((a) => a.slug !== slug).slice(0, 3));
      })
      .catch((err) => {
        if (err.response?.status === 404) setNotFound(true);
        else console.error(err);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  /* ── Loading ── */
  if (loading) {
    return (
      <>
        <Header />
        <ReadingProgress />
        <div className="ad-shell">
          <div className="ad-skel-hero" />
          <div className="ad-skel-body">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="ad-skel-line"
                style={{ width: `${75 + Math.random() * 25}%` }}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ── 404 ── */
  if (notFound || !article) {
    return (
      <>
        <Header />
        <div className="ad-shell ad-notfound">
          <p className="ad-nf-code">404</p>
          <h1 className="ad-nf-title">Article not found.</h1>
          <p className="ad-nf-sub">
            The article you're looking for may have been moved or does not
            exist.
          </p>
          <button className="ad-back-btn" onClick={() => navigate("/articles")}>
            Back to Articles
          </button>
        </div>
      </>
    );
  }

  const tags = parseTags(article.tags);
  const mins = readingTime(article.body);

  return (
    <>
      <Header />
      <ReadingProgress />

      <main className="ad-main">
        {/* ── Hero ── */}
        <div className="ad-hero">
          {article.thumbnail && (
            <div
              className="ad-hero-bg"
              style={{ backgroundImage: `url(${article.thumbnail})` }}
            />
          )}
          <div className="ad-hero-overlay" />
          <div className="ad-hero-inner">
            <button className="ad-back" onClick={() => navigate("/articles")}>
              ← All Articles
            </button>
            <div className="ad-hero-meta">
              {tags[0] && <span className="ad-hero-tag">{tags[0]}</span>}
              <span className="ad-hero-mins">{mins} min read</span>
            </div>
            <h1 className="ad-hero-title">{article.title}</h1>
            {article.excerpt && (
              <p className="ad-hero-excerpt">{article.excerpt}</p>
            )}
            <div className="ad-hero-byline">
              <div className="ad-byline-avatar">
                {(article.author || "A")[0].toUpperCase()}
              </div>
              <div>
                <p className="ad-byline-name">{article.author}</p>
                {article.institution && (
                  <p className="ad-byline-inst">{article.institution}</p>
                )}
              </div>
              <span className="ad-byline-sep" />
              <span className="ad-byline-date">
                {formatDate(article.published_at || article.created_at)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className="ad-layout">
          <aside className="ad-aside-left">
            {/* sticky share strip */}
            <div className="ad-share-strip">
              <p className="ad-share-label">Share</p>
              <button
                className="ad-share-btn"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: article.title,
                      url: window.location.href,
                    });
                  } else {
                    navigator.clipboard.writeText(window.location.href);
                  }
                }}
              >
                Copy link
              </button>
            </div>
          </aside>

          <article className="ad-article" ref={bodyRef}>
            {/* Tags */}
            {tags.length > 0 && (
              <div className="ad-tags">
                {tags.map((t) => (
                  <span key={t} className="ad-tag">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Body text — renders plain text with paragraph breaks */}
            <div className="ad-body">
              {article.body.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>

            {/* Article footer */}
            <div className="ad-article-footer">
              <div className="ad-footer-author">
                <div className="ad-byline-avatar ad-byline-avatar--lg">
                  {(article.author || "A")[0].toUpperCase()}
                </div>
                <div>
                  <p className="ad-footer-name">{article.author}</p>
                  {article.institution && (
                    <p className="ad-footer-inst">{article.institution}</p>
                  )}
                </div>
              </div>
              <button
                className="ad-back-btn"
                onClick={() => navigate("/articles")}
              >
                ← Back to Articles
              </button>
            </div>
          </article>

          <aside className="ad-aside-right" />
        </div>

        {/* ── Related ── */}
        {related.length > 0 && (
          <div className="ad-related">
            <div className="ad-related-inner">
              <p className="ad-related-label">More Articles</p>
              <div className="ad-related-grid">
                {related.map((a) => (
                  <a
                    key={a.id}
                    href={`/articles/${a.slug}`}
                    className="ad-rel-card"
                  >
                    {a.thumbnail && (
                      <div className="ad-rel-thumb-wrap">
                        <img
                          src={a.thumbnail}
                          alt={a.title}
                          className="ad-rel-thumb"
                        />
                      </div>
                    )}
                    <div className="ad-rel-body">
                      {parseTags(a.tags)[0] && (
                        <span className="ad-rel-tag">
                          {parseTags(a.tags)[0]}
                        </span>
                      )}
                      <p className="ad-rel-title">{a.title}</p>
                      <p className="ad-rel-author">{a.author}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default ArticleDetail;
