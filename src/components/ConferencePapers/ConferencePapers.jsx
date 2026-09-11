import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { endpoint } from "../../api/endpoints";
import "./PaperSubmission.css";

const TITLE_CHOICES = [
  "Prof.", "Assoc. Prof.", "Asst. Prof.", "Reader",
  "Senior Lecturer", "Lecturer I", "Lecturer II",
  "Assistant Lecturer", "Graduate Assistant",
  "Research Fellow", "Senior Research Fellow",
  "Principal Research Fellow", "Chief Research Fellow",
  "Dr.", "Mr.", "Mrs.", "Miss", "Ms.", "Other",
];

const SUBMISSION_TYPES = [
  { value: "lead_presenter", label: "Lead Paper Presenter" },
  { value: "discussant",     label: "Discussant" },
  { value: "both",           label: "Both" },
];

const PRESENTATION_MODES = [
  { value: "physical", label: "Physical" },
  { value: "virtual",  label: "Virtual" },
];

const STEPS = ["Author", "Paper", "Co-Authors", "Declaration"];

const emptyCoAuthor = () => ({ name: "", institution: "", email: "" });

export default function PaperSubmission() {
  const endpoints = endpoint();
  const [step, setStep]       = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [author, setAuthor] = useState({
    title: "Prof.",
    full_name: "",
    email: "",
    phone: "",
    institution: "",
    faculty: "",
    department: "",
    designation: "",
  });

  const [paper, setPaper] = useState({
    title: "",
    abstract: "",
    keywords: "",
    sub_theme: "",
    submission_type: "lead_presenter",
    presentation_mode: "physical",
    file: null,
  });

  const [coAuthors, setCoAuthors] = useState([]);

  const [declaration, setDeclaration] = useState({
    original: false,
    publication: false,
  });

  const next = (e) => { e.preventDefault(); setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const prev = (e) => { e.preventDefault(); setStep((s) => Math.max(s - 1, 0)); };

  const addCoAuthor = () => {
    if (coAuthors.length < 4) setCoAuthors((p) => [...p, emptyCoAuthor()]);
  };

  const removeCoAuthor = (i) => setCoAuthors((p) => p.filter((_, idx) => idx !== i));

  const updateCoAuthor = (i, field, val) => {
    setCoAuthors((p) => p.map((ca, idx) => idx === i ? { ...ca, [field]: val } : ca));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== STEPS.length - 1) return;
    if (!declaration.original || !declaration.publication) {
      toast.error("Please confirm both declarations before submitting.");
      return;
    }
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(author).forEach(([k, v]) => v && payload.append(`author_${k}`, v));
      Object.entries(paper).forEach(([k, v]) => {
        if (k === "file" && v) payload.append("paper_file", v);
        else if (v) payload.append(k, v);
      });
      payload.append("co_authors", JSON.stringify(coAuthors.filter(ca => ca.name)));
      payload.append("declaration_original",    String(declaration.original));
      payload.append("declaration_publication", String(declaration.publication));
      await axios.post(endpoints.paper.create, payload);
      setSuccess(true);
    } catch (error) {
      console.error(error.response?.data);
      if (error.response?.data?.author_email) {
        toast.error("A paper with this email has already been submitted.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSuccess(false);
    setStep(0);
    setAuthor({ title: "Prof.", full_name: "", email: "", phone: "", institution: "", faculty: "", department: "", designation: "" });
    setPaper({ title: "", abstract: "", keywords: "", sub_theme: "", submission_type: "lead_presenter", presentation_mode: "physical", file: null });
    setCoAuthors([]);
    setDeclaration({ original: false, publication: false });
  };

  const wordCount = paper.abstract.trim() ? paper.abstract.trim().split(/\s+/).length : 0;

  return (
    <div className="ps-page">
      {/* Hero */}
      <div className="ps-hero">
        <div className="ps-hero__inner">
          <p className="ps-hero__conference">57th Annual Conference · NALT 2026</p>
          <h1 className="ps-hero__title">Paper Submission</h1>
          <p className="ps-hero__sub">
            Faculty of Law, University of Benin · 18th – 22nd October 2026
          </p>
          <div className="ps-hero__theme">
            <p>
              "Legal Education, Emerging Technologies and the Challenges of the
              Sustainable Development Goals"
            </p>
          </div>
        </div>
      </div>

      <div className="ps-body">
        {success ? (
          <div className="ps-success">
            <div className="ps-success__mark">✓</div>
            <h2>Submission Received</h2>
            <p>
              Your paper has been submitted successfully. You will receive
              a confirmation email shortly. Thank you for contributing to
              the 57th NALT Annual Conference.
            </p>
            <button className="ps-btn" onClick={resetForm}>Submit Another Paper</button>
          </div>
        ) : (
          <div className="ps-card">

            {/* Step indicator */}
            <div className="ps-steps">
              {STEPS.map((label, i) => (
                <div key={label} className={`ps-step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
                  <div className="ps-step__marker">{i < step ? "✓" : i + 1}</div>
                  <span className="ps-step__label">{label}</span>
                  {i < STEPS.length - 1 && <div className="ps-step__line" />}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="ps-form">

              {/* ── Step 0: Author ── */}
              {step === 0 && (
                <div className="ps-section">
                  <div className="ps-section__header">
                    <h2>Lead Author Information</h2>
                    <p>Provide details of the primary author responsible for this submission.</p>
                  </div>

                  <div className="ps-row">
                    <div className="ps-field ps-field--sm">
                      <label>Title</label>
                      <select value={author.title} onChange={e => setAuthor(p => ({ ...p, title: e.target.value }))} required>
                        {TITLE_CHOICES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="ps-field ps-field--grow">
                      <label>Full Name <span className="ps-req">*</span></label>
                      <input type="text" placeholder="e.g. Amaka Okonkwo"
                        value={author.full_name} onChange={e => setAuthor(p => ({ ...p, full_name: e.target.value }))} required />
                    </div>
                  </div>

                  <div className="ps-row">
                    <div className="ps-field ps-field--grow">
                      <label>Email Address <span className="ps-req">*</span></label>
                      <input type="email" placeholder="e.g. amaka@unilag.edu.ng"
                        value={author.email} onChange={e => setAuthor(p => ({ ...p, email: e.target.value }))} required />
                    </div>
                    <div className="ps-field ps-field--grow">
                      <label>Phone Number</label>
                      <input type="text" placeholder="e.g. 08012345678"
                        value={author.phone} onChange={e => setAuthor(p => ({ ...p, phone: e.target.value }))} />
                    </div>
                  </div>

                  <div className="ps-field">
                    <label>Designation / Rank</label>
                    <input type="text" placeholder="e.g. Senior Lecturer"
                      value={author.designation} onChange={e => setAuthor(p => ({ ...p, designation: e.target.value }))} />
                  </div>

                  <div className="ps-field">
                    <label>Institution <span className="ps-req">*</span></label>
                    <input type="text" placeholder="e.g. University of Lagos"
                      value={author.institution} onChange={e => setAuthor(p => ({ ...p, institution: e.target.value }))} required />
                  </div>

                  <div className="ps-row">
                    <div className="ps-field ps-field--grow">
                      <label>Faculty</label>
                      <input type="text" placeholder="e.g. Faculty of Law"
                        value={author.faculty} onChange={e => setAuthor(p => ({ ...p, faculty: e.target.value }))} />
                    </div>
                    <div className="ps-field ps-field--grow">
                      <label>Department</label>
                      <input type="text" placeholder="e.g. Public Law"
                        value={author.department} onChange={e => setAuthor(p => ({ ...p, department: e.target.value }))} />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 1: Paper ── */}
              {step === 1 && (
                <div className="ps-section">
                  <div className="ps-section__header">
                    <h2>Paper Details</h2>
                    <p>Provide the academic details and content of your submission.</p>
                  </div>

                  <div className="ps-field">
                    <label>Title of Paper <span className="ps-req">*</span></label>
                    <input type="text" placeholder="Full title of your paper"
                      value={paper.title} onChange={e => setPaper(p => ({ ...p, title: e.target.value }))} required />
                  </div>

                  <div className="ps-field">
                    <label>
                      Abstract <span className="ps-req">*</span>
                      <span className={`ps-wordcount ${wordCount > 500 ? "over" : ""}`}>
                        {wordCount} / 500 words
                      </span>
                    </label>
                    <textarea
                      placeholder="Provide a concise summary of your paper (300–500 words)..."
                      rows={8}
                      value={paper.abstract}
                      onChange={e => setPaper(p => ({ ...p, abstract: e.target.value }))}
                      required
                    />
                  </div>

                  <div className="ps-row">
                    <div className="ps-field ps-field--grow">
                      <label>Keywords <span className="ps-req">*</span></label>
                      <input type="text" placeholder="e.g. Legal education, AI, SDGs, Nigeria"
                        value={paper.keywords} onChange={e => setPaper(p => ({ ...p, keywords: e.target.value }))} required />
                      <span className="ps-hint">Separate with commas · 3 to 5 keywords</span>
                    </div>
                  </div>

                  <div className="ps-field">
                    <label>Sub-theme / Research Area</label>
                    <input type="text" placeholder="e.g. Digital transformation in legal education"
                      value={paper.sub_theme} onChange={e => setPaper(p => ({ ...p, sub_theme: e.target.value }))} />
                  </div>

                  <div className="ps-row">
                    <div className="ps-field ps-field--grow">
                      <label>Submission Type <span className="ps-req">*</span></label>
                      <div className="ps-radio-group">
                        {SUBMISSION_TYPES.map(({ value, label }) => (
                          <label key={value} className={`ps-radio-card ${paper.submission_type === value ? "selected" : ""}`}>
                            <input type="radio" name="submission_type" value={value}
                              checked={paper.submission_type === value}
                              onChange={e => setPaper(p => ({ ...p, submission_type: e.target.value }))} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="ps-field ps-field--grow">
                      <label>Presentation Mode <span className="ps-req">*</span></label>
                      <div className="ps-radio-group">
                        {PRESENTATION_MODES.map(({ value, label }) => (
                          <label key={value} className={`ps-radio-card ${paper.presentation_mode === value ? "selected" : ""}`}>
                            <input type="radio" name="presentation_mode" value={value}
                              checked={paper.presentation_mode === value}
                              onChange={e => setPaper(p => ({ ...p, presentation_mode: e.target.value }))} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="ps-field">
                    <label>Upload Full Paper <span className="ps-optional">(Optional — PDF or Word)</span></label>
                    <div className="ps-file-wrap">
                      <label htmlFor="paper_file" className="ps-file-label">
                        {paper.file ? paper.file.name : "Choose file · PDF or .docx"}
                      </label>
                      <input id="paper_file" type="file" accept=".pdf,.doc,.docx"
                        onChange={e => setPaper(p => ({ ...p, file: e.target.files[0] }))}
                        className="ps-file-input" />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Step 2: Co-Authors ── */}
              {step === 2 && (
                <div className="ps-section">
                  <div className="ps-section__header">
                    <h2>Co-Authors</h2>
                    <p>Add up to 4 co-authors. This step is optional — skip it if you have none.</p>
                  </div>

                  {coAuthors.length === 0 && (
                    <div className="ps-empty-state">
                      <p>No co-authors added yet.</p>
                    </div>
                  )}

                  {coAuthors.map((ca, i) => (
                    <div key={i} className="ps-coauthor-block">
                      <div className="ps-coauthor-block__header">
                        <span>Co-Author {i + 1}</span>
                        <button type="button" className="ps-remove-btn" onClick={() => removeCoAuthor(i)}>Remove</button>
                      </div>
                      <div className="ps-field">
                        <label>Full Name</label>
                        <input type="text" placeholder="e.g. Chidi Nwosu"
                          value={ca.name} onChange={e => updateCoAuthor(i, "name", e.target.value)} />
                      </div>
                      <div className="ps-row">
                        <div className="ps-field ps-field--grow">
                          <label>Institution</label>
                          <input type="text" placeholder="e.g. University of Abuja"
                            value={ca.institution} onChange={e => updateCoAuthor(i, "institution", e.target.value)} />
                        </div>
                        <div className="ps-field ps-field--grow">
                          <label>Email</label>
                          <input type="email" placeholder="e.g. chidi@uniabuja.edu.ng"
                            value={ca.email} onChange={e => updateCoAuthor(i, "email", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  ))}

                  {coAuthors.length < 4 && (
                    <button type="button" className="ps-add-btn" onClick={addCoAuthor}>
                      + Add Co-Author
                    </button>
                  )}
                </div>
              )}

              {/* ── Step 3: Declaration ── */}
              {step === 3 && (
                <div className="ps-section">
                  <div className="ps-section__header">
                    <h2>Declaration</h2>
                    <p>Please confirm the following before submitting your paper.</p>
                  </div>

                  {/* Summary */}
                  <div className="ps-summary">
                    <div className="ps-summary__row">
                      <span className="ps-summary__key">Paper Title</span>
                      <span className="ps-summary__val">{paper.title || "—"}</span>
                    </div>
                    <div className="ps-summary__row">
                      <span className="ps-summary__key">Lead Author</span>
                      <span className="ps-summary__val">{author.title} {author.full_name || "—"}</span>
                    </div>
                    <div className="ps-summary__row">
                      <span className="ps-summary__key">Institution</span>
                      <span className="ps-summary__val">{author.institution || "—"}</span>
                    </div>
                    <div className="ps-summary__row">
                      <span className="ps-summary__key">Submission Type</span>
                      <span className="ps-summary__val">
                        {SUBMISSION_TYPES.find(s => s.value === paper.submission_type)?.label}
                      </span>
                    </div>
                    <div className="ps-summary__row">
                      <span className="ps-summary__key">Presentation</span>
                      <span className="ps-summary__val">
                        {PRESENTATION_MODES.find(m => m.value === paper.presentation_mode)?.label}
                      </span>
                    </div>
                    {coAuthors.filter(ca => ca.name).length > 0 && (
                      <div className="ps-summary__row">
                        <span className="ps-summary__key">Co-Authors</span>
                        <span className="ps-summary__val">
                          {coAuthors.filter(ca => ca.name).map(ca => ca.name).join(", ")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="ps-declarations">
                    <label className={`ps-declaration ${declaration.original ? "checked" : ""}`}>
                      <input type="checkbox"
                        checked={declaration.original}
                        onChange={e => setDeclaration(p => ({ ...p, original: e.target.checked }))} />
                      <span className="ps-declaration__check">{declaration.original ? "✓" : ""}</span>
                      <span className="ps-declaration__text">
                        I confirm that this paper is original work and has not been submitted
                        or published elsewhere in its current form.
                      </span>
                    </label>

                    <label className={`ps-declaration ${declaration.publication ? "checked" : ""}`}>
                      <input type="checkbox"
                        checked={declaration.publication}
                        onChange={e => setDeclaration(p => ({ ...p, publication: e.target.checked }))} />
                      <span className="ps-declaration__check">{declaration.publication ? "✓" : ""}</span>
                      <span className="ps-declaration__text">
                        I agree that NALT may publish or archive this paper in its conference
                        proceedings, subject to editorial review.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Navigation */}
              <div className="ps-nav">
                {step > 0 && (
                  <button type="button" className="ps-btn ps-btn--outline" onClick={prev}>← Back</button>
                )}
                {step < STEPS.length - 1 ? (
                  <button type="button" className="ps-btn" onClick={next}>Continue →</button>
                ) : (
                  <button type="submit" className="ps-btn" disabled={loading}>
                    {loading ? <span className="ps-spinner" /> : "Submit Paper"}
                  </button>
                )}
              </div>

              <p className="ps-disclaimer">
                Your submission is confidential and will only be used for conference purposes.
              </p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}