import { useState, useEffect } from "react";
import axios from "axios";
import { endpoint } from "../../api/endpoints";
import "./ConferencePaperList.css";

const formatDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });
};

const SkeletonCard = () => (
  <div className="cp-card cp-skeleton">
    <div className="cp-skel-line cp-skel-line--sm" />
    <div className="cp-skel-line cp-skel-line--lg" />
    <div className="cp-skel-line cp-skel-line--md" />
    <div className="cp-skel-line cp-skel-line--md" />
    <div className="cp-skel-line cp-skel-line--sm" style={{ marginTop: 16 }} />
  </div>
);

const AbstractModal = ({ paper, onClose }) => {
  if (!paper) return null;
  return (
    <div className="cp-modal-overlay" onClick={onClose}>
      <div className="cp-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cp-modal-close" onClick={onClose}>✕</button>
        <p className="cp-modal-eyebrow">
          {paper.submission_type === "lead_presenter" ? "Lead Paper" :
           paper.submission_type === "discussant" ? "Discussant" : "Lead Paper & Discussant"}
          {" · "}{paper.presentation_mode === "virtual" ? "Virtual" : "Physical"}
        </p>
        <h2 className="cp-modal-title">{paper.title}</h2>
        <div className="cp-modal-authors">
          <span className="cp-modal-author">
            {paper.author_title} {paper.author_full_name}
          </span>
          {paper.author_institution && (
            <span className="cp-modal-inst"> — {paper.author_institution}</span>
          )}
          {paper.co_author_entries?.length > 0 && (
            <span className="cp-modal-coauthors">
              {" "}· with {paper.co_author_entries.map(c => c.name).join(", ")}
            </span>
          )}
        </div>
        {paper.keywords && (
          <div className="cp-modal-keywords">
            {paper.keywords.split(",").map((k) => (
              <span key={k} className="cp-tag">{k.trim()}</span>
            ))}
          </div>
        )}
        <h3 className="cp-modal-abstract-label">Abstract</h3>
        <p className="cp-modal-abstract">{paper.abstract}</p>
        {paper.paper_file && (
          <a
            className="cp-modal-download"
            href={paper.paper_file}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            ↓ Download Paper
          </a>
        )}
      </div>
    </div>
  );
};

const PaperCard = ({ paper, onReadMore }) => {
  const date = formatDate(paper.created_at);
  const typeLabel =
    paper.submission_type === "lead_presenter" ? "Lead Paper" :
    paper.submission_type === "discussant" ? "Discussant" : "Lead Paper & Discussant";

  return (
    <div className="cp-card">
      <div className="cp-card-top">
        <span className="cp-tag cp-tag--type">{typeLabel}</span>
        {paper.presentation_mode === "virtual" && (
          <span className="cp-tag cp-tag--virtual">Virtual</span>
        )}
        {date && <span className="cp-date">{date}</span>}
      </div>
      <h2 className="cp-card-title">{paper.title}</h2>
      <p className="cp-card-author">
        {paper.author_title} {paper.author_full_name}
        {paper.author_institution && (
          <span className="cp-card-inst"> · {paper.author_institution}</span>
        )}
      </p>
      {paper.sub_theme && (
        <p className="cp-card-subtheme">{paper.sub_theme}</p>
      )}
      <p className="cp-card-abstract">
        {paper.abstract?.length > 200
          ? paper.abstract.slice(0, 200) + "…"
          : paper.abstract}
      </p>
      <div className="cp-card-actions">
        <button className="cp-btn cp-btn--ghost" onClick={() => onReadMore(paper)}>
          Read Abstract
        </button>
        {paper.paper_file && (
          <a
            className="cp-btn cp-btn--primary"
            href={paper.paper_file}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            ↓ Download
          </a>
        )}
      </div>
    </div>
  );
};

const ConferencePaperList = () => {
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    axios
      .get(endpoint().paper.list)
      .then((r) => setPapers(r.data))
      .catch((e) => console.error("Error fetching papers:", e))
      .finally(() => setLoading(false));
  }, []);

  const filtered = papers.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.author_full_name?.toLowerCase().includes(q) ||
      p.author_institution?.toLowerCase().includes(q) ||
      p.keywords?.toLowerCase().includes(q) ||
      p.sub_theme?.toLowerCase().includes(q)
    );
  });

  return (
    <>
      {/* Hero */}
      <div className="cp-hero">
        <div className="cp-hero-inner">
          <p className="cp-hero-eyebrow">57th NALT Annual Conference · 2026</p>
          <h1 className="cp-hero-title">Conference <em>Papers</em></h1>
          <p className="cp-hero-sub">
            Scholarly papers submitted by delegates on legal education,
            emerging technologies and the sustainable development goals.
          </p>
        </div>
        <div className="cp-hero-rule" />
      </div>

      <div className="cp-page">
        {/* Toolbar */}
        <div className="cp-toolbar">
          <div className="cp-search-wrap">
            <input
              className="cp-search"
              type="search"
              placeholder="Search by title, author, keyword or institution…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          {!loading && (
            <p className="cp-count">
              {filtered.length} {filtered.length === 1 ? "paper" : "papers"}
            </p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="cp-grid">
            {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : papers.length === 0 ? (
          <div className="cp-empty">
            <p className="cp-empty-title">No papers available yet.</p>
            <p className="cp-empty-sub">Check back after the conference opens.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="cp-empty">
            <p className="cp-empty-title">No results for "{search}"</p>
            <p className="cp-empty-sub">Try a different keyword.</p>
          </div>
        ) : (
          <div className="cp-grid">
            {filtered.map((p) => (
              <PaperCard key={p.id} paper={p} onReadMore={setSelected} />
            ))}
          </div>
        )}
      </div>

      <AbstractModal paper={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default ConferencePaperList;