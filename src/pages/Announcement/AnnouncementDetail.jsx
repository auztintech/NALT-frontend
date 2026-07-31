import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Header/Header";
import { endpoint } from "../../api/endpoints";
import "./AnnouncementDetail.css";
import axios from "axios";
import Footer from "../../components/Footer/Footer";

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

const formatDateShort = (d) =>
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

const AnnouncementDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [others, setOthers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(true);
    setNotFound(false);

    // axios
    //   .get(`${endpoint().announcement.list}${slug}/`)
    //   .then((r) => {
    //     setItem(r.data);
    //     return axios.get(endpoint().announcement.list);
    //   })
    //   .then((r) => {
    //     setOthers((r.data || []).filter((a) => a.slug !== slug).slice(0, 4));
    //   })
    axios
      .get(endpoint().announcement.detail(slug))
      .then((r) => {
        setItem(r.data);
        return axios.get(endpoint().announcement.list);
      })
      .then((r) => {
        setOthers((r.data || []).filter((a) => a.slug !== slug).slice(0, 4));
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
        <div className="and-shell">
          <div className="and-skel-band" />
          <div className="and-skel-body">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="and-skel-line"
                style={{ width: `${60 + Math.random() * 38}%` }}
              />
            ))}
          </div>
        </div>
      </>
    );
  }

  /* ── 404 ── */
  if (notFound || !item) {
    return (
      <>
        <Header />
        <div className="and-shell and-notfound">
          <p className="and-nf-code">404</p>
          <h1 className="and-nf-title">Announcement not found.</h1>
          <p className="and-nf-sub">
            This notice may have been removed or does not exist.
          </p>
          <button
            className="and-btn-outline"
            onClick={() => navigate("/announcements")}
          >
            Back to Announcements
          </button>
        </div>
      </>
    );
  }

  const tags = parseTags(item.tags);
  const pubDate = formatDate(item.published_at || item.created_at);

  return (
    <>
      <Header />

      <main className="and-main">
        {/* ── Top band ── */}
        <div className="and-band">
          <div className="and-band-inner">
            <button
              className="and-back"
              onClick={() => navigate("/announcements")}
            >
              ← Announcements
            </button>
          </div>
        </div>

        {/* ── Page grid ── */}
        <div className="and-page">
          {/* LEFT: document content */}
          <div className="and-doc-col">
            {/* Document header — like an official notice */}
            <div className="and-doc-header">
              <div className="and-doc-header-top">
                <div className="and-notice-stamp">
                  <span className="and-stamp-text">Official Notice</span>
                </div>
                {tags[0] && <span className="and-hero-tag">{tags[0]}</span>}
              </div>

              <h1 className="and-doc-title">{item.title}</h1>

              {item.excerpt && <p className="and-doc-lede">{item.excerpt}</p>}

              <div className="and-doc-meta-strip">
                <div className="and-meta-block">
                  <p className="and-meta-label">Issued</p>
                  <p className="and-meta-value">{pubDate}</p>
                </div>
                <div className="and-meta-divider" />
                <div className="and-meta-block">
                  <p className="and-meta-label">Issued by</p>
                  <p className="and-meta-value">NALT Secretariat</p>
                </div>
                <div className="and-meta-divider" />
                <div className="and-meta-block">
                  <p className="and-meta-label">Conference</p>
                  <p className="and-meta-value">57th National Conference</p>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            {item.thumbnail && (
              <div className="and-thumb-wrap">
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  className="and-thumb"
                />
              </div>
            )}

            {/* Body */}
            <div className="and-body">
              {item.body.split(/\n\n+/).map((para, i) => (
                <p key={i}>{para.trim()}</p>
              ))}
            </div>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="and-tag-row">
                {tags.map((t) => (
                  <span key={t} className="and-tag">
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Footer */}
            <div className="and-doc-footer">
              <div className="and-footer-seal">
                <div className="and-seal-circle">
                  <span>NALT</span>
                  <span className="and-seal-year">2026</span>
                </div>
                <div>
                  <p className="and-footer-org">
                    Nigerian Association of Law Teachers
                  </p>
                  <p className="and-footer-conf">
                    57th National Conference Secretariat
                  </p>
                </div>
              </div>
              <button
                className="and-btn-outline"
                onClick={() => navigate("/announcements")}
              >
                ← All Announcements
              </button>
            </div>
          </div>

          {/* RIGHT: sidebar — other announcements */}
          <aside className="and-sidebar">
            <p className="and-sidebar-label">Recent Notices</p>
            <div className="and-sidebar-list">
              {others.length === 0 ? (
                <p className="and-sidebar-empty">No other announcements.</p>
              ) : (
                others.map((o) => (
                  <a
                    key={o.id}
                    href={`/announcements/${o.slug}`}
                    className="and-sidebar-item"
                  >
                    <p className="and-sidebar-date">
                      {formatDateShort(o.published_at || o.created_at)}
                    </p>
                    <p className="and-sidebar-title">{o.title}</p>
                    {o.excerpt && (
                      <p className="and-sidebar-excerpt">{o.excerpt}</p>
                    )}
                  </a>
                ))
              )}
            </div>

            {/* Conference details card */}
            <div className="and-conf-card">
              <p className="and-conf-label">Conference Details</p>
              <p className="and-conf-date">18 – 22 October, 2026</p>
              <p className="and-conf-venue">
                Faculty of Law, University of Benin
                <br />
                Benin City, Edo State
              </p>
              <a href="/register" className="and-conf-cta">
                Register Now
              </a>
            </div>
          </aside>
        </div>
      </main>
      <Footer />
    
    </>
  );
};

export default AnnouncementDetail;
