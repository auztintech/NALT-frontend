import { useState } from "react";
import { endpoint } from "../../api/endpoints";
import "./RegisterForm.css";
import axios from "axios";
import { toast } from "react-toastify";

const TITLE_CHOICES = [
  "Prof.", "Assoc. Prof.", "Asst. Prof.", "Reader",
  "Senior Lecturer", "Lecturer I", "Lecturer II",
  "Assistant Lecturer", "Graduate Assistant",
  "Research Fellow", "Senior Research Fellow",
  "Principal Research Fellow", "Chief Research Fellow",
  "Dr.", "Mr.", "Mrs.", "Miss", "Ms.", "Other",
];

const TICKET_CHOICES = [
  { value: "member",        label: "Member" },
  { value: "non_member",   label: "Non-Member" },
  { value: "international", label: "International" },
  { value: "online",       label: "Online" },
];

const MEMBERSHIP_STATUS = [
  { value: "member",     label: "Member" },
  { value: "non_member", label: "Non-Member" },
];

const ATTENDANCE_MODE = [
  { value: "physical", label: "Physical" },
  { value: "virtual",  label: "Virtual" },
];

const NIGERIAN_STATES = [
  "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue",
  "Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT",
  "Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi",
  "Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo",
  "Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
];

const STEPS = ["Personal", "Professional", "Membership", "Payment & Extras"];

export default function RegisterForm() {
  const endpoints = endpoint();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [step, setStep]       = useState(0);

  const [formData, setFormData] = useState({
    title: "Prof.",
    full_name: "",
    email: "",
    phone_number: "",
    designation: "",
    institution: "",
    faculty: "",
    department: "",
    state: "",
    country: "Nigeria",
    membership_status: "member",
    membership_number: "",
    ticket_type: "member",
    attendance_mode: "physical",
    payment_reference: "",
    payment_proof: null,
    special_requirements: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // KEY FIX: next/prev are plain click handlers, NOT form submission
  const next = (e) => {
    e.preventDefault();
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  };
  const prev = (e) => {
    e.preventDefault();
    setStep((s) => Math.max(s - 1, 0));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Guard: only submit when on the last step
    if (step !== STEPS.length - 1) return;
    setLoading(true);
    try {
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== "") payload.append(k, v);
      });
      await axios.post(endpoints.registration.create, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(true);
    } catch (error) {
      console.error(error.response?.data);
      if (error.response?.data?.email) {
        toast.error("This email address is already registered.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
    setLoading(false);
  };

  const resetForm = () => {
    setSuccess(false);
    setStep(0);
    setFormData({
      title: "Prof.", full_name: "", email: "", phone_number: "",
      designation: "", institution: "", faculty: "", department: "",
      state: "", country: "Nigeria",
      membership_status: "member", membership_number: "",
      ticket_type: "member", attendance_mode: "physical",
      payment_reference: "", payment_proof: null, special_requirements: "",
    });
  };

  return (
    <section className="register">
      {/* ── Left panel ── */}
      <div className="register__left">
        <p className="register__eyebrow">57th Annual Conference</p>
        <h1 className="register__heading">
          Secure Your <span>Spot Today</span>
        </h1>
        <p className="register__subtext">
          Join law educators from across Nigeria at the 57th NALT National
          Conference hosted by the Faculty of Law, University of Benin.
        </p>

        <div className="register__details">
          <div className="register__detail-item">
            <div className="register__detail-icon" />
            <div>
              <span className="register__detail-label">Date</span>
              <span className="register__detail-value">18th – 22nd October, 2026</span>
            </div>
          </div>
          <div className="register__detail-item">
            <div className="register__detail-icon" />
            <div>
              <span className="register__detail-label">Venue</span>
              <span className="register__detail-value">
                Faculty of Law, University of Benin, Benin City, Edo State
              </span>
            </div>
          </div>
          <div className="register__detail-item">
            <div className="register__detail-icon" />
            <div>
              <span className="register__detail-label">Early Bird</span>
              <span className="register__detail-value">
                First 100 registrants get a special prize
              </span>
            </div>
          </div>
        </div>

        <div className="register__theme">
          <span className="register__theme-label">Conference Theme</span>
          <p className="register__theme-text">
            "Legal Education, Emerging Technologies and the Challenges of the
            Sustainable Development Goals"
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="register__right">
        <div className="register__form-card">
          {success ? (
            <div className="register__success">
              <div className="register__success-icon">✓</div>
              <h3>Registration Successful!</h3>
              <p>
                Thank you for registering. You will receive a confirmation
                email shortly.
              </p>
              <button className="register__btn" onClick={resetForm}>
                Register Another
              </button>
            </div>
          ) : (
            <>
              <div className="register__form-header">
                <h2 className="register__form-title">Register for the Conference</h2>
                <p className="register__form-subtitle">
                  Fill in your details below to complete your registration.
                </p>
              </div>

              {/* Step indicator */}
              <div className="register__steps">
                {STEPS.map((label, i) => (
                  <div
                    key={label}
                    className={`register__step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}
                  >
                    <div className="register__step-dot">{i < step ? "✓" : i + 1}</div>
                    <span className="register__step-label">{label}</span>
                  </div>
                ))}
              </div>

              {/* KEY FIX: onSubmit only fires on final step */}
              <form onSubmit={handleSubmit} className="register__form">

                {/* Step 0: Personal */}
                {step === 0 && (
                  <>
                    <div className="register__row">
                      <div className="register__field register__field--sm">
                        <label htmlFor="title">Title</label>
                        <select id="title" name="title" value={formData.title} onChange={handleChange} required>
                          {TITLE_CHOICES.map((t) => <option key={t} value={t}>{t}</option>)}
                        </select>
                      </div>
                      <div className="register__field register__field--grow">
                        <label htmlFor="full_name">Full Name</label>
                        <input id="full_name" type="text" name="full_name"
                          placeholder="e.g. Amaka Okonkwo"
                          value={formData.full_name} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="register__field">
                      <label htmlFor="email">Email Address</label>
                      <input id="email" type="email" name="email"
                        placeholder="e.g. amaka@unilag.edu.ng"
                        value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="register__field">
                      <label htmlFor="phone_number">Phone Number</label>
                      <input id="phone_number" type="text" name="phone_number"
                        placeholder="e.g. 08012345678"
                        value={formData.phone_number} onChange={handleChange} required />
                    </div>
                  </>
                )}

                {/* Step 1: Professional */}
                {step === 1 && (
                  <>
                    <div className="register__field">
                      <label htmlFor="designation">Designation / Job Title</label>
                      <input id="designation" type="text" name="designation"
                        placeholder="e.g. Senior Lecturer"
                        value={formData.designation} onChange={handleChange} />
                    </div>
                    <div className="register__field">
                      <label htmlFor="institution">Institution <span className="req">*</span></label>
                      <input id="institution" type="text" name="institution"
                        placeholder="e.g. University of Lagos"
                        value={formData.institution} onChange={handleChange} required />
                    </div>
                    <div className="register__row">
                      <div className="register__field register__field--grow">
                        <label htmlFor="faculty">Faculty</label>
                        <input id="faculty" type="text" name="faculty"
                          placeholder="e.g. Faculty of Law"
                          value={formData.faculty} onChange={handleChange} />
                      </div>
                      <div className="register__field register__field--grow">
                        <label htmlFor="department">Department</label>
                        <input id="department" type="text" name="department"
                          placeholder="e.g. Public Law"
                          value={formData.department} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="register__row">
                      <div className="register__field register__field--grow">
                        <label htmlFor="state">State</label>
                        <select id="state" name="state" value={formData.state} onChange={handleChange}>
                          <option value="">— Select State —</option>
                          {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="register__field register__field--grow">
                        <label htmlFor="country">Country</label>
                        <input id="country" type="text" name="country"
                          placeholder="Nigeria"
                          value={formData.country} onChange={handleChange} />
                      </div>
                    </div>
                  </>
                )}

                {/* Step 2: Membership */}
                {step === 2 && (
                  <>
                    <div className="register__field">
                      <label>Membership Status</label>
                      <div className="register__radio-group">
                        {MEMBERSHIP_STATUS.map(({ value, label }) => (
                          <label
                            key={value}
                            className={`register__radio-card ${formData.membership_status === value ? "selected" : ""}`}
                          >
                            <input type="radio" name="membership_status" value={value}
                              checked={formData.membership_status === value}
                              onChange={handleChange} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>

                    {formData.membership_status === "member" && (
                      <div className="register__field">
                        {/* FIX: marked as optional */}
                        <label htmlFor="membership_number">
                          Membership Number <span className="register__optional">(Optional)</span>
                        </label>
                        <input id="membership_number" type="text" name="membership_number"
                          placeholder="e.g. NALT-2024-001"
                          value={formData.membership_number} onChange={handleChange} />
                      </div>
                    )}

                    <div className="register__field">
                      <label>Ticket Type</label>
                      <div className="register__radio-group">
                        {TICKET_CHOICES.map(({ value, label }) => (
                          <label
                            key={value}
                            className={`register__radio-card ${formData.ticket_type === value ? "selected" : ""}`}
                          >
                            <input type="radio" name="ticket_type" value={value}
                              checked={formData.ticket_type === value}
                              onChange={handleChange} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="register__field">
                      <label>Attendance Mode</label>
                      <div className="register__radio-group">
                        {ATTENDANCE_MODE.map(({ value, label }) => (
                          <label
                            key={value}
                            className={`register__radio-card ${formData.attendance_mode === value ? "selected" : ""}`}
                          >
                            <input type="radio" name="attendance_mode" value={value}
                              checked={formData.attendance_mode === value}
                              onChange={handleChange} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Step 3: Payment & Extras */}
                {step === 3 && (
                  <>
                    <div className="register__field">
                      <label htmlFor="payment_reference">Payment Reference <span className="register__optional">(Optional)</span></label>
                      <input id="payment_reference" type="text" name="payment_reference"
                        placeholder="e.g. TXN-2026-XXXXXX"
                        value={formData.payment_reference} onChange={handleChange} />
                    </div>
                    <div className="register__field">
                      <label htmlFor="payment_proof">
                        Upload Payment Proof <span className="register__optional">(Optional)</span>
                      </label>
                      {/* KEY FIX: file input is standalone, NOT inside a form-submitting element */}
                      <div className="register__file-wrap">
                        <label htmlFor="payment_proof" className="register__file-label">
                          {formData.payment_proof
                            ? formData.payment_proof.name
                            : "Choose file (PDF / Image)"}
                        </label>
                        <input
                          id="payment_proof"
                          type="file"
                          name="payment_proof"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleChange}
                          className="register__file-input"
                        />
                      </div>
                    </div>
                    <div className="register__field">
                      <label htmlFor="special_requirements">
                        Special Requirements <span className="register__optional">(Optional)</span>
                      </label>
                      <textarea id="special_requirements" name="special_requirements"
                        placeholder="Dietary, accessibility, or other requirements…"
                        rows={4} value={formData.special_requirements} onChange={handleChange} />
                    </div>
                  </>
                )}

                {/* Navigation */}
                <div className="register__nav">
                  {step > 0 && (
                    <button
                      type="button"
                      className="register__btn register__btn--outline"
                      onClick={prev}
                    >
                      ← Back
                    </button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button
                      type="button"
                      className="register__btn"
                      onClick={next}
                    >
                      Continue →
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="register__btn"
                      disabled={loading}
                    >
                      {loading ? <span className="register__spinner" /> : "Submit Registration"}
                    </button>
                  )}
                </div>

                <p className="register__disclaimer">
                  Your information is safe and will only be used for conference purposes.
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}