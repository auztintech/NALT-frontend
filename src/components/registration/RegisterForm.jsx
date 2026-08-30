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

const PAYMENT_OPTIONS = [
  { key: "sub_institutional",      group: "Subscription", label: "Institutional Subscription",   amount: 50000,  display: "₦50,000",       account: "FCMB" },
  { key: "sub_readers_professors", group: "Subscription", label: "Readers & Professors",          amount: 30000,  display: "₦30,000",       account: "FCMB" },
  { key: "sub_senior_lecturer",    group: "Subscription", label: "Senior Lecturers",              amount: 25000,  display: "₦25,000",       account: "FCMB" },
  { key: "sub_lecturer_below",     group: "Subscription", label: "Lecturer I and Below",          amount: 20000,  display: "₦20,000",       account: "FCMB" },
  { key: "reg_early_bird",         group: "Registration", label: "Early Bird (ends 30 Aug 2026)", amount: 30000,  display: "₦30,000",       account: "Zenith" },
  { key: "reg_regular",            group: "Registration", label: "Regular (ends 30 Sep 2026)",    amount: 40000,  display: "₦40,000",       account: "Zenith" },
  { key: "reg_late",               group: "Registration", label: "Late Registration (October)",   amount: 50000,  display: "₦50,000",       account: "Zenith" },
  { key: "reg_non_member",         group: "Others",       label: "Non-Member",                    amount: 100000, display: "₦100,000",      account: "Zenith" },
  { key: "reg_international",      group: "Others",       label: "International",                 amount: null,   display: "$250",          account: "Zenith" },
  { key: "reg_online",             group: "Others",       label: "Online",                        amount: null,   display: "₦20,000 / $25", account: "Zenith" },
];

const ACCOUNT_DETAILS = {
  FCMB:   { name: "Nigerian Association of Law Teachers", number: "2006806045", bank: "First City Monument Bank (FCMB)" },
  Zenith: { name: "Faculty of Law: NALT Conference",      number: "1312045217", bank: "Zenith Bank" },
};

const STEPS = ["Personal", "Professional", "Membership", "Payment & Extras"];
const GROUPS = ["Subscription", "Registration", "Others"];

export default function RegisterForm() {
  const endpoints = endpoint();

  const [step, setStep]                     = useState(0);
  const [loading, setLoading]               = useState(false);
  const [uploadingProofs, setUploadingProofs] = useState(false);
  const [uploadStatus, setUploadStatus]     = useState({});
  const [success, setSuccess]               = useState(false);
  const [proofsFailed, setProofsFailed]     = useState([]);

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
    special_requirements: "",
  });

  const [selectedPayments, setSelectedPayments] = useState([]);
  const [paymentProofs, setPaymentProofs]       = useState({});
  const [paymentRefs, setPaymentRefs]           = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const togglePayment = (key) => {
    setSelectedPayments((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const next = (e) => { e.preventDefault(); setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const prev = (e) => { e.preventDefault(); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step !== STEPS.length - 1) return;

    setLoading(true);
    let registeredId = null;

    try {
      // ── STEP 1: Submit form data + text refs only (no files) ──
      const payload = new FormData();
      Object.entries(formData).forEach(([k, v]) => {
        if (v !== null && v !== "") payload.append(k, v);
      });
      payload.append("selected_payments", JSON.stringify(selectedPayments));
      selectedPayments.forEach((key) => {
        if (paymentRefs[key]) payload.append(`ref_${key}`, paymentRefs[key]);
      });

      const response = await axios.post(endpoints.registration.create, payload);
      registeredId = response.data?.id;
      setLoading(false);

      // ── STEP 2: Upload each proof file separately via PATCH ──
      const proofsToUpload = selectedPayments.filter((key) => paymentProofs[key]);

      if (proofsToUpload.length > 0 && registeredId) {
        setUploadingProofs(true);
        const initialStatus = {};
        proofsToUpload.forEach((key) => { initialStatus[key] = "pending"; });
        setUploadStatus(initialStatus);

        const failed = [];
        for (const key of proofsToUpload) {
          setUploadStatus((prev) => ({ ...prev, [key]: "uploading" }));
          try {
            const proofPayload = new FormData();
            proofPayload.append(`proof_${key}`, paymentProofs[key]);
            await axios.patch(
              endpoints.registration.update(registeredId),
              proofPayload
            );
            setUploadStatus((prev) => ({ ...prev, [key]: "done" }));
          } catch {
            setUploadStatus((prev) => ({ ...prev, [key]: "error" }));
            const opt = PAYMENT_OPTIONS.find((o) => o.key === key);
            failed.push(opt?.label || key);
          }
        }

        setProofsFailed(failed);
        setUploadingProofs(false);
      }

      setSuccess(true);

    } catch (error) {
      setLoading(false);
      console.error(error.response?.data);
      if (error.response?.data?.email) {
        toast.error("This email address is already registered.");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  const resetForm = () => {
    setSuccess(false);
    setStep(0);
    setUploadStatus({});
    setProofsFailed([]);
    setFormData({
      title: "Prof.", full_name: "", email: "", phone_number: "",
      designation: "", institution: "", faculty: "", department: "",
      state: "", country: "Nigeria",
      membership_status: "member", membership_number: "",
      ticket_type: "member", attendance_mode: "physical",
      special_requirements: "",
    });
    setSelectedPayments([]);
    setPaymentProofs({});
    setPaymentRefs({});
  };

  const total = selectedPayments.reduce((sum, key) => {
    const opt = PAYMENT_OPTIONS.find((o) => o.key === key);
    return opt?.amount ? sum + opt.amount : sum;
  }, 0);

  const formatAmount = (n) => `₦${n.toLocaleString()}`;

  return (
    <section className="register">
      {/* ── Left panel ── */}
      <div className="register__left">
        <p className="register__eyebrow">57th Annual Conference</p>
        <h1 className="register__heading">Secure Your <span>Spot Today</span></h1>
        <p className="register__subtext">
          Join law educators from across Nigeria at the 57th NALT National Conference
          hosted by the Faculty of Law, University of Benin.
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
              <span className="register__detail-value">Faculty of Law, University of Benin, Benin City, Edo State</span>
            </div>
          </div>
          <div className="register__detail-item">
            <div className="register__detail-icon" />
            <div>
              <span className="register__detail-label">Early Bird</span>
              <span className="register__detail-value">First 100 registrants get a special prize</span>
            </div>
          </div>
        </div>
        <div className="register__theme">
          <span className="register__theme-label">Conference Theme</span>
          <p className="register__theme-text">
            "Legal Education, Emerging Technologies and the Challenges of the Sustainable Development Goals"
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="register__right">
        <div className="register__form-card">

          {/* Uploading proofs screen */}
          {uploadingProofs && (
            <div className="register__uploading">
              <div className="register__spinner" style={{ width: 36, height: 36, borderWidth: 3 }} />
              <h3>Uploading Payment Proofs...</h3>
              <p>Please do not close this page.</p>
              <div className="register__upload-progress">
                {selectedPayments.filter((k) => paymentProofs[k]).map((key) => {
                  const opt    = PAYMENT_OPTIONS.find((o) => o.key === key);
                  const status = uploadStatus[key] || "pending";
                  return (
                    <div key={key} className={`register__upload-item register__upload-item--${status}`}>
                      <span className="register__upload-item__dot" />
                      <span>{opt?.label}</span>
                      <span className="register__upload-item__status">
                        {status === "pending"   ? "Waiting..."   :
                         status === "uploading" ? "Uploading..." :
                         status === "done"      ? "✓ Done"       : "✗ Failed"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Success screen */}
          {!uploadingProofs && success && (
            <div className="register__success">
              <div className="register__success-icon">✓</div>
              <h3>Registration Successful!</h3>
              <p>Thank you for registering. You will receive a confirmation email shortly.</p>
              {proofsFailed.length > 0 && (
                <p style={{ color: "#e53e3e", fontSize: 13, marginTop: 8, lineHeight: 1.6 }}>
                  The following proofs failed to upload:<br />
                  <strong>{proofsFailed.join(", ")}</strong><br />
                  Please email them to <strong>support@naltconference.org.ng</strong> with your full name as subject.
                </p>
              )}
              <button className="register__btn" onClick={resetForm}>Register Another</button>
            </div>
          )}

          {/* Form */}
          {!uploadingProofs && !success && (
            <>
              <div className="register__form-header">
                <h2 className="register__form-title">Register for the Conference</h2>
                <p className="register__form-subtitle">Fill in your details below to complete your registration.</p>
              </div>

              <div className="register__steps">
                {STEPS.map((label, i) => (
                  <div key={label} className={`register__step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
                    <div className="register__step-dot">{i < step ? "✓" : i + 1}</div>
                    <span className="register__step-label">{label}</span>
                  </div>
                ))}
              </div>

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
                        <input id="full_name" type="text" name="full_name" placeholder="e.g. Amaka Okonkwo"
                          value={formData.full_name} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="register__field">
                      <label htmlFor="email">Email Address</label>
                      <input id="email" type="email" name="email" placeholder="e.g. amaka@unilag.edu.ng"
                        value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="register__field">
                      <label htmlFor="phone_number">Phone Number</label>
                      <input id="phone_number" type="text" name="phone_number" placeholder="e.g. 08012345678"
                        value={formData.phone_number} onChange={handleChange} required />
                    </div>
                  </>
                )}

                {/* Step 1: Professional */}
                {step === 1 && (
                  <>
                    <div className="register__field">
                      <label htmlFor="designation">Designation / Job Title</label>
                      <input id="designation" type="text" name="designation" placeholder="e.g. Senior Lecturer"
                        value={formData.designation} onChange={handleChange} />
                    </div>
                    <div className="register__field">
                      <label htmlFor="institution">Institution <span className="req">*</span></label>
                      <input id="institution" type="text" name="institution" placeholder="e.g. University of Lagos"
                        value={formData.institution} onChange={handleChange} required />
                    </div>
                    <div className="register__row">
                      <div className="register__field register__field--grow">
                        <label htmlFor="faculty">Faculty</label>
                        <input id="faculty" type="text" name="faculty" placeholder="e.g. Faculty of Law"
                          value={formData.faculty} onChange={handleChange} />
                      </div>
                      <div className="register__field register__field--grow">
                        <label htmlFor="department">Department</label>
                        <input id="department" type="text" name="department" placeholder="e.g. Public Law"
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
                        <input id="country" type="text" name="country" placeholder="Nigeria"
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
                          <label key={value} className={`register__radio-card ${formData.membership_status === value ? "selected" : ""}`}>
                            <input type="radio" name="membership_status" value={value}
                              checked={formData.membership_status === value} onChange={handleChange} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                    {formData.membership_status === "member" && (
                      <div className="register__field">
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
                          <label key={value} className={`register__radio-card ${formData.ticket_type === value ? "selected" : ""}`}>
                            <input type="radio" name="ticket_type" value={value}
                              checked={formData.ticket_type === value} onChange={handleChange} />
                            {label}
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className="register__field">
                      <label>Attendance Mode</label>
                      <div className="register__radio-group">
                        {ATTENDANCE_MODE.map(({ value, label }) => (
                          <label key={value} className={`register__radio-card ${formData.attendance_mode === value ? "selected" : ""}`}>
                            <input type="radio" name="attendance_mode" value={value}
                              checked={formData.attendance_mode === value} onChange={handleChange} />
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
                    <p style={{ fontSize: 13, color: "#5a5475", marginBottom: 16, lineHeight: 1.6 }}>
                      Select all payments you are making. Each proof is uploaded separately after
                      registration so there are no timeouts.
                    </p>

                    {GROUPS.map((group) => (
                      <div key={group} className="register__pay-group">
                        <p className="register__pay-group__label">{group} Fees</p>
                        {PAYMENT_OPTIONS.filter((o) => o.group === group).map((opt) => (
                          <label key={opt.key}
                            className={`register__pay-option ${selectedPayments.includes(opt.key) ? "selected" : ""}`}
                            onClick={() => togglePayment(opt.key)}>
                            <span className={`register__pay-check ${selectedPayments.includes(opt.key) ? "checked" : ""}`}>
                              {selectedPayments.includes(opt.key) ? "✓" : ""}
                            </span>
                            <span className="register__pay-option__label">{opt.label}</span>
                            <span className="register__pay-option__amount">{opt.display}</span>
                          </label>
                        ))}
                      </div>
                    ))}

                    {selectedPayments.length > 0 && (
                      <div className="register__pay-total">
                        <span>Total Selected</span>
                        <span className="register__pay-total__amount">
                          {total > 0 ? formatAmount(total) : "See amounts above"}
                        </span>
                      </div>
                    )}

                    {selectedPayments.length > 0 && (
                      <div className="register__proofs">
                        <p className="register__proofs__heading">Payment Details & Proof Upload</p>
                        <p className="register__proofs__sub">
                          Each file is uploaded one at a time after your registration is saved.
                        </p>
                        {selectedPayments.map((key) => {
                          const opt  = PAYMENT_OPTIONS.find((o) => o.key === key);
                          const acct = ACCOUNT_DETAILS[opt.account];
                          return (
                            <div key={key} className="register__proof-block">
                              <div className="register__proof-block__header">
                                <span className="register__proof-block__title">{opt.label}</span>
                                <span className="register__proof-block__amount">{opt.display}</span>
                              </div>
                              <div className="register__proof-block__bank">
                                Pay to: <strong>{acct.name}</strong> · Acc: <strong>{acct.number}</strong> · <strong>{acct.bank}</strong>
                              </div>
                              <div className="register__field" style={{ marginTop: 10 }}>
                                <label>Payment Reference <span className="register__optional">(Optional)</span></label>
                                <input type="text" placeholder="e.g. TXN-2026-XXXXXX"
                                  value={paymentRefs[key] || ""}
                                  onChange={(e) => setPaymentRefs((p) => ({ ...p, [key]: e.target.value }))} />
                              </div>
                              <div className="register__field" style={{ marginTop: 8 }}>
                                <label>Upload Proof <span className="register__optional">(Optional)</span></label>
                                <div className="register__file-wrap">
                                  <label htmlFor={`proof_${key}`} className="register__file-label">
                                    {paymentProofs[key] ? paymentProofs[key].name : "Choose file (PDF / Image)"}
                                  </label>
                                  <input id={`proof_${key}`} type="file" accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setPaymentProofs((p) => ({ ...p, [key]: e.target.files[0] }))}
                                    className="register__file-input" />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    <div className="register__field" style={{ marginTop: 16 }}>
                      <label htmlFor="special_requirements">
                        Special Requirements <span className="register__optional">(Optional)</span>
                      </label>
                      <textarea id="special_requirements" name="special_requirements"
                        placeholder="Dietary, accessibility, or other requirements…"
                        rows={3} value={formData.special_requirements} onChange={handleChange} />
                    </div>
                  </>
                )}

                <div className="register__nav">
                  {step > 0 && (
                    <button type="button" className="register__btn register__btn--outline" onClick={prev}>← Back</button>
                  )}
                  {step < STEPS.length - 1 ? (
                    <button type="button" className="register__btn" onClick={next}>Continue →</button>
                  ) : (
                    <button type="submit" className="register__btn" disabled={loading}>
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


// import { useState } from "react";
// import { endpoint } from "../../api/endpoints";
// import "./RegisterForm.css";
// import axios from "axios";
// import { toast } from "react-toastify";

// const TITLE_CHOICES = [
//   "Prof.", "Assoc. Prof.", "Asst. Prof.", "Reader",
//   "Senior Lecturer", "Lecturer I", "Lecturer II",
//   "Assistant Lecturer", "Graduate Assistant",
//   "Research Fellow", "Senior Research Fellow",
//   "Principal Research Fellow", "Chief Research Fellow",
//   "Dr.", "Mr.", "Mrs.", "Miss", "Ms.", "Other",
// ];

// const TICKET_CHOICES = [
//   { value: "member",        label: "Member" },
//   { value: "non_member",   label: "Non-Member" },
//   { value: "international", label: "International" },
//   { value: "online",       label: "Online" },
// ];

// const MEMBERSHIP_STATUS = [
//   { value: "member",     label: "Member" },
//   { value: "non_member", label: "Non-Member" },
// ];

// const ATTENDANCE_MODE = [
//   { value: "physical", label: "Physical" },
//   { value: "virtual",  label: "Virtual" },
// ];

// const NIGERIAN_STATES = [
//   "Abia","Adamawa","Akwa Ibom","Anambra","Bauchi","Bayelsa","Benue",
//   "Borno","Cross River","Delta","Ebonyi","Edo","Ekiti","Enugu","FCT",
//   "Gombe","Imo","Jigawa","Kaduna","Kano","Katsina","Kebbi","Kogi",
//   "Kwara","Lagos","Nasarawa","Niger","Ogun","Ondo","Osun","Oyo",
//   "Plateau","Rivers","Sokoto","Taraba","Yobe","Zamfara",
// ];

// // All payment options — subscription + registration
// const PAYMENT_OPTIONS = [
//   // Subscription fees
//   { key: "sub_institutional",      group: "Subscription",   label: "Institutional Subscription",   amount: 50000,  display: "₦50,000",  account: "FCMB" },
//   { key: "sub_readers_professors", group: "Subscription",   label: "Readers & Professors",          amount: 30000,  display: "₦30,000",  account: "FCMB" },
//   { key: "sub_senior_lecturer",    group: "Subscription",   label: "Senior Lecturers",              amount: 25000,  display: "₦25,000",  account: "FCMB" },
//   { key: "sub_lecturer_below",     group: "Subscription",   label: "Lecturer I and Below",          amount: 20000,  display: "₦20,000",  account: "FCMB" },
//   // Registration fees
//   { key: "reg_early_bird",         group: "Registration",   label: "Early Bird (ends 30 Aug 2026)", amount: 30000,  display: "₦30,000",  account: "Zenith" },
//   { key: "reg_regular",            group: "Registration",   label: "Regular (ends 30 Sep 2026)",    amount: 40000,  display: "₦40,000",  account: "Zenith" },
//   { key: "reg_late",               group: "Registration",   label: "Late Registration (October)",   amount: 50000,  display: "₦50,000",  account: "Zenith" },
//   // Others
//   { key: "reg_non_member",         group: "Others",         label: "Non-Member",                    amount: 100000, display: "₦100,000", account: "Zenith" },
//   { key: "reg_international",      group: "Others",         label: "International",                 amount: null,   display: "$250",      account: "Zenith" },
//   { key: "reg_online",             group: "Others",         label: "Online",                        amount: null,   display: "₦20,000 / $25", account: "Zenith" },
// ];

// const ACCOUNT_DETAILS = {
//   FCMB:   { name: "Nigerian Association of Law Teachers", number: "2006806045",  bank: "First City Monument Bank (FCMB)" },
//   Zenith: { name: "Faculty of Law: NALT Conference",       number: "1312045217", bank: "Zenith Bank" },
// };

// const STEPS = ["Personal", "Professional", "Membership", "Payment & Extras"];

// export default function RegisterForm() {
//   const endpoints = endpoint();
//   const [loading, setLoading] = useState(false);
//   const [success, setSuccess] = useState(false);
//   const [step, setStep]       = useState(0);

//   const [formData, setFormData] = useState({
//     title: "Prof.",
//     full_name: "",
//     email: "",
//     phone_number: "",
//     designation: "",
//     institution: "",
//     faculty: "",
//     department: "",
//     state: "",
//     country: "Nigeria",
//     membership_status: "member",
//     membership_number: "",
//     ticket_type: "member",
//     attendance_mode: "physical",
//     special_requirements: "",
//   });

//   // Selected payment options (multiple)
//   const [selectedPayments, setSelectedPayments] = useState([]);
//   // Payment proofs keyed by payment option key
//   const [paymentProofs, setPaymentProofs] = useState({});
//   // Payment references keyed by payment option key
//   const [paymentRefs, setPaymentRefs] = useState({});

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const togglePayment = (key) => {
//     setSelectedPayments((prev) =>
//       prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
//     );
//   };

//   const handleProofChange = (key, file) => {
//     setPaymentProofs((prev) => ({ ...prev, [key]: file }));
//   };

//   const handleRefChange = (key, val) => {
//     setPaymentRefs((prev) => ({ ...prev, [key]: val }));
//   };

//   const next = (e) => {
//     e.preventDefault();
//     setStep((s) => Math.min(s + 1, STEPS.length - 1));
//   };
//   const prev = (e) => {
//     e.preventDefault();
//     setStep((s) => Math.max(s - 1, 0));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (step !== STEPS.length - 1) return;
//     setLoading(true);
//     try {
//       const payload = new FormData();
//       Object.entries(formData).forEach(([k, v]) => {
//         if (v !== null && v !== "") payload.append(k, v);
//       });
//       // Send selected payments as JSON string
//       payload.append("selected_payments", JSON.stringify(selectedPayments));
//       // Send refs and proofs per payment
//       selectedPayments.forEach((key) => {
//         if (paymentRefs[key]) payload.append(`ref_${key}`, paymentRefs[key]);
//         if (paymentProofs[key]) payload.append(`proof_${key}`, paymentProofs[key]);
//       });
//       // await axios.post(endpoints.registration.create, payload, {
//       //   headers: { "Content-Type": "multipart/form-data" },
//       // });
//       await axios.post(endpoints.registration.create, payload);
//       setSuccess(true);
//     } catch (error) {
//       console.error(error.response?.data);
//       if (error.response?.data?.email) {
//         toast.error("This email address is already registered.");
//       } else {
//         toast.error("Something went wrong. Please try again.");
//       }
//     }
//     setLoading(false);
//   };

//   const resetForm = () => {
//     setSuccess(false);
//     setStep(0);
//     setFormData({
//       title: "Prof.", full_name: "", email: "", phone_number: "",
//       designation: "", institution: "", faculty: "", department: "",
//       state: "", country: "Nigeria",
//       membership_status: "member", membership_number: "",
//       ticket_type: "member", attendance_mode: "physical",
//       special_requirements: "",
//     });
//     setSelectedPayments([]);
//     setPaymentProofs({});
//     setPaymentRefs({});
//   };

//   // Compute total for selected payments (numeric only)
//   const total = selectedPayments.reduce((sum, key) => {
//     const opt = PAYMENT_OPTIONS.find((o) => o.key === key);
//     return opt?.amount ? sum + opt.amount : sum;
//   }, 0);

//   const formatAmount = (n) => `₦${n.toLocaleString()}`;

//   // Group payment options for display
//   const groups = ["Subscription", "Registration", "Others"];

//   return (
//     <section className="register">
//       {/* ── Left panel ── */}
//       <div className="register__left">
//         <p className="register__eyebrow">57th Annual Conference</p>
//         <h1 className="register__heading">Secure Your <span>Spot Today</span></h1>
//         <p className="register__subtext">
//           Join law educators from across Nigeria at the 57th NALT National
//           Conference hosted by the Faculty of Law, University of Benin.
//         </p>
//         <div className="register__details">
//           <div className="register__detail-item">
//             <div className="register__detail-icon" />
//             <div>
//               <span className="register__detail-label">Date</span>
//               <span className="register__detail-value">18th – 22nd October, 2026</span>
//             </div>
//           </div>
//           <div className="register__detail-item">
//             <div className="register__detail-icon" />
//             <div>
//               <span className="register__detail-label">Venue</span>
//               <span className="register__detail-value">Faculty of Law, University of Benin, Benin City, Edo State</span>
//             </div>
//           </div>
//           <div className="register__detail-item">
//             <div className="register__detail-icon" />
//             <div>
//               <span className="register__detail-label">Early Bird</span>
//               <span className="register__detail-value">First 100 registrants get a special prize</span>
//             </div>
//           </div>
//         </div>
//         <div className="register__theme">
//           <span className="register__theme-label">Conference Theme</span>
//           <p className="register__theme-text">
//             "Legal Education, Emerging Technologies and the Challenges of the Sustainable Development Goals"
//           </p>
//         </div>
//       </div>

//       {/* ── Right panel ── */}
//       <div className="register__right">
//         <div className="register__form-card">
//           {success ? (
//             <div className="register__success">
//               <div className="register__success-icon">✓</div>
//               <h3>Registration Successful!</h3>
//               <p>Thank you for registering. You will receive a confirmation email shortly.</p>
//               <button className="register__btn" onClick={resetForm}>Register Another</button>
//             </div>
//           ) : (
//             <>
//               <div className="register__form-header">
//                 <h2 className="register__form-title">Register for the Conference</h2>
//                 <p className="register__form-subtitle">Fill in your details below to complete your registration.</p>
//               </div>

//               {/* Steps */}
//               <div className="register__steps">
//                 {STEPS.map((label, i) => (
//                   <div key={label} className={`register__step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
//                     <div className="register__step-dot">{i < step ? "✓" : i + 1}</div>
//                     <span className="register__step-label">{label}</span>
//                   </div>
//                 ))}
//               </div>

//               <form onSubmit={handleSubmit} className="register__form">

//                 {/* Step 0: Personal */}
//                 {step === 0 && (
//                   <>
//                     <div className="register__row">
//                       <div className="register__field register__field--sm">
//                         <label htmlFor="title">Title</label>
//                         <select id="title" name="title" value={formData.title} onChange={handleChange} required>
//                           {TITLE_CHOICES.map((t) => <option key={t} value={t}>{t}</option>)}
//                         </select>
//                       </div>
//                       <div className="register__field register__field--grow">
//                         <label htmlFor="full_name">Full Name</label>
//                         <input id="full_name" type="text" name="full_name" placeholder="e.g. Amaka Okonkwo"
//                           value={formData.full_name} onChange={handleChange} required />
//                       </div>
//                     </div>
//                     <div className="register__field">
//                       <label htmlFor="email">Email Address</label>
//                       <input id="email" type="email" name="email" placeholder="e.g. amaka@unilag.edu.ng"
//                         value={formData.email} onChange={handleChange} required />
//                     </div>
//                     <div className="register__field">
//                       <label htmlFor="phone_number">Phone Number</label>
//                       <input id="phone_number" type="text" name="phone_number" placeholder="e.g. 08012345678"
//                         value={formData.phone_number} onChange={handleChange} required />
//                     </div>
//                   </>
//                 )}

//                 {/* Step 1: Professional */}
//                 {step === 1 && (
//                   <>
//                     <div className="register__field">
//                       <label htmlFor="designation">Designation / Job Title</label>
//                       <input id="designation" type="text" name="designation" placeholder="e.g. Senior Lecturer"
//                         value={formData.designation} onChange={handleChange} />
//                     </div>
//                     <div className="register__field">
//                       <label htmlFor="institution">Institution <span className="req">*</span></label>
//                       <input id="institution" type="text" name="institution" placeholder="e.g. University of Lagos"
//                         value={formData.institution} onChange={handleChange} required />
//                     </div>
//                     <div className="register__row">
//                       <div className="register__field register__field--grow">
//                         <label htmlFor="faculty">Faculty</label>
//                         <input id="faculty" type="text" name="faculty" placeholder="e.g. Faculty of Law"
//                           value={formData.faculty} onChange={handleChange} />
//                       </div>
//                       <div className="register__field register__field--grow">
//                         <label htmlFor="department">Department</label>
//                         <input id="department" type="text" name="department" placeholder="e.g. Public Law"
//                           value={formData.department} onChange={handleChange} />
//                       </div>
//                     </div>
//                     <div className="register__row">
//                       <div className="register__field register__field--grow">
//                         <label htmlFor="state">State</label>
//                         <select id="state" name="state" value={formData.state} onChange={handleChange}>
//                           <option value="">— Select State —</option>
//                           {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
//                         </select>
//                       </div>
//                       <div className="register__field register__field--grow">
//                         <label htmlFor="country">Country</label>
//                         <input id="country" type="text" name="country" placeholder="Nigeria"
//                           value={formData.country} onChange={handleChange} />
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Step 2: Membership */}
//                 {step === 2 && (
//                   <>
//                     <div className="register__field">
//                       <label>Membership Status</label>
//                       <div className="register__radio-group">
//                         {MEMBERSHIP_STATUS.map(({ value, label }) => (
//                           <label key={value} className={`register__radio-card ${formData.membership_status === value ? "selected" : ""}`}>
//                             <input type="radio" name="membership_status" value={value}
//                               checked={formData.membership_status === value} onChange={handleChange} />
//                             {label}
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                     {formData.membership_status === "member" && (
//                       <div className="register__field">
//                         <label htmlFor="membership_number">
//                           Membership Number <span className="register__optional">(Optional)</span>
//                         </label>
//                         <input id="membership_number" type="text" name="membership_number"
//                           placeholder="e.g. NALT-2024-001"
//                           value={formData.membership_number} onChange={handleChange} />
//                       </div>
//                     )}
//                     <div className="register__field">
//                       <label>Ticket Type</label>
//                       <div className="register__radio-group">
//                         {TICKET_CHOICES.map(({ value, label }) => (
//                           <label key={value} className={`register__radio-card ${formData.ticket_type === value ? "selected" : ""}`}>
//                             <input type="radio" name="ticket_type" value={value}
//                               checked={formData.ticket_type === value} onChange={handleChange} />
//                             {label}
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                     <div className="register__field">
//                       <label>Attendance Mode</label>
//                       <div className="register__radio-group">
//                         {ATTENDANCE_MODE.map(({ value, label }) => (
//                           <label key={value} className={`register__radio-card ${formData.attendance_mode === value ? "selected" : ""}`}>
//                             <input type="radio" name="attendance_mode" value={value}
//                               checked={formData.attendance_mode === value} onChange={handleChange} />
//                             {label}
//                           </label>
//                         ))}
//                       </div>
//                     </div>
//                   </>
//                 )}

//                 {/* Step 3: Payment & Extras */}
//                 {step === 3 && (
//                   <>
//                     <p className="register__field-hint" style={{ marginBottom: 16, fontSize: 13, color: "#5a5475" }}>
//                       Select all payments you are making. You can pay subscription and registration at the same time.
//                       A separate upload field will appear for each one you select.
//                     </p>

//                     {/* Payment checkboxes grouped */}
//                     {groups.map((group) => (
//                       <div key={group} className="register__pay-group">
//                         <p className="register__pay-group__label">{group} Fees</p>
//                         {PAYMENT_OPTIONS.filter((o) => o.group === group).map((opt) => (
//                           <label
//                             key={opt.key}
//                             className={`register__pay-option ${selectedPayments.includes(opt.key) ? "selected" : ""}`}
//                             onClick={() => togglePayment(opt.key)}
//                           >
//                             <span className={`register__pay-check ${selectedPayments.includes(opt.key) ? "checked" : ""}`}>
//                               {selectedPayments.includes(opt.key) ? "✓" : ""}
//                             </span>
//                             <span className="register__pay-option__label">{opt.label}</span>
//                             <span className="register__pay-option__amount">{opt.display}</span>
//                           </label>
//                         ))}
//                       </div>
//                     ))}

//                     {/* Total */}
//                     {selectedPayments.length > 0 && (
//                       <div className="register__pay-total">
//                         <span>Total Selected</span>
//                         <span className="register__pay-total__amount">
//                           {total > 0 ? formatAmount(total) : "See amounts above"}
//                         </span>
//                       </div>
//                     )}

//                     {/* Per-payment upload fields */}
//                     {selectedPayments.length > 0 && (
//                       <div className="register__proofs">
//                         <p className="register__proofs__heading">Upload Payment Proofs</p>
//                         <p className="register__proofs__sub">
//                           Upload a separate proof for each payment you selected.
//                         </p>
//                         {selectedPayments.map((key) => {
//                           const opt = PAYMENT_OPTIONS.find((o) => o.key === key);
//                           const acct = ACCOUNT_DETAILS[opt.account];
//                           return (
//                             <div key={key} className="register__proof-block">
//                               <div className="register__proof-block__header">
//                                 <span className="register__proof-block__title">{opt.label}</span>
//                                 <span className="register__proof-block__amount">{opt.display}</span>
//                               </div>
//                               <div className="register__proof-block__bank">
//                                 Pay to: <strong>{acct.name}</strong> · Acc: <strong>{acct.number}</strong> · <strong>{acct.bank}</strong>
//                               </div>
//                               <div className="register__field" style={{ marginTop: 10 }}>
//                                 <label>Payment Reference <span className="register__optional">(Optional)</span></label>
//                                 <input type="text" placeholder="e.g. TXN-2026-XXXXXX"
//                                   value={paymentRefs[key] || ""}
//                                   onChange={(e) => handleRefChange(key, e.target.value)} />
//                               </div>
//                               <div className="register__field" style={{ marginTop: 8 }}>
//                                 <label>Upload Proof <span className="register__optional">(Optional)</span></label>
//                                 <div className="register__file-wrap">
//                                   <label htmlFor={`proof_${key}`} className="register__file-label">
//                                     {paymentProofs[key] ? paymentProofs[key].name : "Choose file (PDF / Image)"}
//                                   </label>
//                                   <input id={`proof_${key}`} type="file"
//                                     accept=".pdf,.jpg,.jpeg,.png"
//                                     onChange={(e) => handleProofChange(key, e.target.files[0])}
//                                     className="register__file-input" />
//                                 </div>
//                               </div>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     )}

//                     <div className="register__field" style={{ marginTop: 16 }}>
//                       <label htmlFor="special_requirements">
//                         Special Requirements <span className="register__optional">(Optional)</span>
//                       </label>
//                       <textarea id="special_requirements" name="special_requirements"
//                         placeholder="Dietary, accessibility, or other requirements…"
//                         rows={3} value={formData.special_requirements} onChange={handleChange} />
//                     </div>
//                   </>
//                 )}

//                 {/* Navigation */}
//                 <div className="register__nav">
//                   {step > 0 && (
//                     <button type="button" className="register__btn register__btn--outline" onClick={prev}>← Back</button>
//                   )}
//                   {step < STEPS.length - 1 ? (
//                     <button type="button" className="register__btn" onClick={next}>Continue →</button>
//                   ) : (
//                     <button type="submit" className="register__btn" disabled={loading}>
//                       {loading ? <span className="register__spinner" /> : "Submit Registration"}
//                     </button>
//                   )}
//                 </div>

//                 <p className="register__disclaimer">
//                   Your information is safe and will only be used for conference purposes.
//                 </p>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// }