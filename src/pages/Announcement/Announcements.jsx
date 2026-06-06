import { useState, useEffect } from "react";
import Header from "../../components/Header/Header";
import { endpoint } from "../../api/endpoints";
import EmptyState from "../../components/EmptyState/EmptyState";
import axios from "axios";
import "./Announcements.css";

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

/* ─── Skeleton ────────────────────────────────────────────── */
const SkeletonRow = () => (
  <div className="ann-skel-row">
    <div className="ann-skel-date" />
    <div className="ann-skel-body">
      <div className="ann-skel-line ann-skel-line--lg" />
      <div className="ann-skel-line ann-skel-line--md" />
    </div>
  </div>
);

/* ─── Single announcement card ────────────────────────────── */
const AnnouncementCard = ({ item, index }) => {
  const tags = parseTags(item.tags);
  const date = formatDate(item.published_at || item.created_at);
  const [day, month, year] = date ? date.split(" ") : ["", "", ""];

  return (
    <article className="ann-card" style={{ "--delay": `${index * 0.06}s` }}>
      {/* Date column */}
      <div className="ann-date-col">
        <span className="ann-day">{day}</span>
        <span className="ann-month">{month}</span>
        <span className="ann-year">{year}</span>
      </div>

      {/* Spine */}
      <div className="ann-spine">
        <div className="ann-spine-dot" />
        <div className="ann-spine-line" />
      </div>

      {/* Content */}
      <div className="ann-content">
        {tags[0] && <span className="ann-tag">{tags[0]}</span>}
        <h2 className="ann-title">
          <a href={`/announcements/${item.slug}`} className="ann-title-link">
            {item.title}
          </a>
        </h2>
        {item.excerpt && <p className="ann-excerpt">{item.excerpt}</p>}
        {tags.length > 1 && (
          <div className="ann-tags">
            {tags.slice(1).map((t) => (
              <span key={t} className="ann-tag ann-tag--sm">
                {t}
              </span>
            ))}
          </div>
        )}
        <a href={`/announcements/${item.slug}`} className="ann-read-more">
          Read full announcement
        </a>
      </div>

      {/* Thumbnail (optional) */}
      {item.thumbnail && (
        <div className="ann-thumb-wrap">
          <img src={item.thumbnail} alt={item.title} className="ann-thumb" />
        </div>
      )}
    </article>
  );
};

/* ─── Page ────────────────────────────────────────────────── */
const Announcements = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios
      .get(endpoint().announcement.list)
      .then((r) => setItems(r.data))
      .catch(() => console.error("Failed to fetch Announcements"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = items.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.title?.toLowerCase().includes(q) ||
      a.excerpt?.toLowerCase().includes(q) ||
      a.tags?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      <Header />

      <main className="ann-main">
        {/* ── Hero band ── */}
        <div className="ann-hero">
          <div className="ann-hero-inner">
            <p className="ann-hero-eyebrow">
              57th NALT National Conference · 2026
            </p>
            <h1 className="ann-hero-title">Announcements</h1>
            <p className="ann-hero-sub">
              Official communications, updates and notices from the NALT
              Secretariat and the Organising Committee of the 57th National
              Conference.
            </p>
          </div>
          <div className="ann-hero-rule" />
        </div>

        <div className="ann-page">
          {/* ── Toolbar ── */}
          <div className="ann-toolbar">
            <input
              className="ann-search"
              type="search"
              placeholder="Search announcements…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {!loading && (
              <p className="ann-count">
                {filtered.length} {filtered.length === 1 ? "notice" : "notices"}
              </p>
            )}
          </div>

          {/* ── Content ── */}
          {loading ? (
            <div className="ann-list">
              {[...Array(5)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : // ) : filtered.length === 0 ? (
          //   <div className="ann-empty">
          //     <p className="ann-empty-title">No announcements yet.</p>
          //     <p className="ann-empty-sub">
          //       Check back soon for conference updates.
          //     </p>
          //   </div>
          items.length === 0 ? (
            // nothing from backend yet
            <EmptyState type="announcements" />
          ) : filtered.length === 0 ? (
            // search returned nothing
            <div className="ann-empty">
              <p className="ann-empty-title">No results for "{search}"</p>
              <p className="ann-empty-sub">Try a different keyword.</p>
            </div>
          ) : (
            <div className="ann-list">
              {filtered.map((item, i) => (
                <AnnouncementCard key={item.id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export default Announcements;
