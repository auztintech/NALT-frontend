import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { endpoint } from "../../api/endpoints";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Feedback.css";

const STEPS = ['About You', 'Overall Experience', 'Programme', 'Logistics', 'Professional Value', 'Comments'];

const RatingRow = ({ label, field, value, onChange }) => (
  <div className="fb-rating-row">
    <span className="fb-rating-label">{label}</span>
    <div className="fb-stars">
      {[1,2,3,4,5].map(n => (
        <button
          key={n}
          type="button"
          className={`fb-star ${value >= n ? 'fb-star--active' : ''}`}
          onClick={() => onChange(field, value === n ? null : n)}
        >★</button>
      ))}
    </div>
  </div>
);

const RadioGroup = ({ options, field, value, onChange }) => (
  <div className="fb-radio-group">
    {options.map(([val, label]) => (
      <label key={val} className={`fb-radio ${value === val ? 'fb-radio--active' : ''}`}>
        <input type="radio" name={field} value={val} checked={value === val}
          onChange={() => onChange(field, val)} />
        {label}
      </label>
    ))}
  </div>
);

const CheckGroup = ({ options, field, value, onChange }) => (
  <div className="fb-check-group">
    {options.map(([val, label]) => (
      <label key={val} className={`fb-check ${value.includes(val) ? 'fb-check--active' : ''}`}>
        <input type="checkbox" checked={value.includes(val)}
          onChange={() => {
            const next = value.includes(val) ? value.filter(v => v !== val) : [...value, val];
            onChange(field, next);
          }} />
        {label}
      </label>
    ))}
  </div>
);

const AGREE_OPTIONS = [
  ['strongly_agree','Strongly Agree'],['agree','Agree'],['neutral','Neutral'],
  ['disagree','Disagree'],['strongly_disagree','Strongly Disagree'],
];

const initialState = {
  name:'', institution:'', roles:[], academic_rank:'', rank_other:'',
  first_conference: null, previous_conferences:'', attendance_mode:'',
  rating_overall:null, rating_theme_relevance:null, rating_value_for_money:null,
  rating_balance:null, rating_timekeeping:null, likely_to_attend_next:'', would_recommend:'',
  rating_opening:null, rating_plenary:null, rating_parallel:null, rating_paper_quality:null,
  rating_chairing:null, rating_time_allocation:null, rating_peer_review:null,
  rating_agm:null, rating_workshops:null, most_valuable_session:'', future_topics:'',
  presented_paper:null, rating_presenting_experience:null,
  rating_pre_conference_info:null, rating_registration_process:null, rating_venue:null,
  rating_internet_av:null, rating_materials:null, rating_catering:null,
  rating_accommodation:null, rating_transport:null, rating_loc_staff:null,
  rating_security:null, rating_virtual_platform:null, logistics_problems:'', conference_duration:'',
  networking_opportunities:'', knowledge_gained:'', nalt_connection:'',
  value_add_suggestions:[], value_add_other:'',
  liked_most:'', do_differently:'', venue_suggestions:'', other_comments:'',
};

const Feedback = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  // Scroll back to the top of the form whenever the step changes, so Next/Back
  // don't leave the user stranded at the bottom of the previous step.
  const topRef = useRef(null);
  const firstRender = useRef(true);
  useEffect(() => {
    if (firstRender.current) { firstRender.current = false; return; }
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [step]);

  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const txt = (field) => (e) => set(field, e.target.value);

  const canNext = () => {
    if (step === 0) return form.institution.trim() !== '';
    return true;
  };

  // Fields the backend treats as integers — send null, never "", when blank.
  const INT_FIELDS = ['previous_conferences'];

  const cleanPayload = (data) => {
    const out = { ...data };
    INT_FIELDS.forEach((f) => {
      if (out[f] === '' || out[f] === undefined) {
        out[f] = null;
      } else if (out[f] !== null) {
        const n = parseInt(out[f], 10);
        out[f] = Number.isNaN(n) ? null : n;
      }
    });
    return out;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');
    try {
      await axios.post(endpoint().feedback.create, cleanPayload(form));
      setDone(true);
    } catch (err) {
      const data = err.response?.data;
      if (data && typeof data === 'object') {
        const firstField = Object.keys(data)[0];
        const firstMsg = Array.isArray(data[firstField]) ? data[firstField][0] : data[firstField];
        setError(`${firstField}: ${firstMsg}`);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (done) return (
    <>
      <Header />
      <div className="fb-done">
        <div className="fb-done-card">
          <div className="fb-done-icon">✓</div>
          <h2>Thank you for your feedback!</h2>
          <p>Your responses have been recorded and will help shape future NALT conferences.</p>
        </div>
      </div>
      <Footer />
    </>
  );

  return (
    <>
      <Header />
      <div className="fb-hero">
        <div className="fb-hero-inner">
          <p className="fb-hero-eyebrow">57th NALT Annual Conference · 2026</p>
          <h1 className="fb-hero-title">Post-Conference <em>Feedback</em></h1>
          <p className="fb-hero-sub">Your responses are anonymous unless you choose to provide your name. Takes about 7 minutes.</p>
        </div>
        <div className="fb-hero-rule" />
      </div>

      <div className="fb-page" ref={topRef}>
        {/* Progress */}
        <div className="fb-progress">
          {STEPS.map((s, i) => (
            <div key={s} className={`fb-step ${i === step ? 'fb-step--active' : ''} ${i < step ? 'fb-step--done' : ''}`}>
              <div className="fb-step-dot">{i < step ? '✓' : i + 1}</div>
              <span className="fb-step-label">{s}</span>
            </div>
          ))}
        </div>

        <div className="fb-card">
          {/* STEP 0 — About You */}
          {step === 0 && (
            <div className="fb-section">
              <h2 className="fb-section-title">About You</h2>
              <p className="fb-section-sub">Responses are anonymous. Only Institution is required.</p>

              <div className="fb-field">
                <label className="fb-label">Name <span className="fb-optional">(optional)</span></label>
                <input className="fb-input" value={form.name} onChange={txt('name')} placeholder="Your name" />
              </div>

              <div className="fb-field">
                <label className="fb-label">Institution <span className="fb-required">*</span></label>
                <input className="fb-input" value={form.institution} onChange={txt('institution')} placeholder="Your institution" />
              </div>

              <div className="fb-field">
                <label className="fb-label">Your role at the conference <span className="fb-optional">(tick all that apply)</span></label>
                <CheckGroup field="roles" value={form.roles} onChange={set} options={[
                  ['presenter','Paper Presenter'],['panellist','Panellist / Discussant'],
                  ['chair','Session Chair'],['keynote','Keynote / Lead Speaker'],
                  ['participant','Participant (no presentation)'],['loc','Member of LOC'],
                ]} />
              </div>

              <div className="fb-field">
                <label className="fb-label">Academic rank</label>
                <RadioGroup field="academic_rank" value={form.academic_rank} onChange={set} options={[
                  ['graduate_asst','Graduate Assistant / Assistant Lecturer'],
                  ['lecturer_2_1','Lecturer II / Lecturer I'],['senior_lecturer','Senior Lecturer'],
                  ['reader','Reader / Associate Professor'],['professor','Professor'],
                  ['postgrad','Postgraduate Student'],['other','Other'],
                ]} />
                {form.academic_rank === 'other' && (
                  <input className="fb-input fb-input--indent" value={form.rank_other}
                    onChange={txt('rank_other')} placeholder="Please specify" />
                )}
              </div>

              <div className="fb-field">
                <label className="fb-label">Is this your first NALT conference?</label>
                <RadioGroup field="first_conference" value={form.first_conference === true ? 'yes' : form.first_conference === false ? 'no' : ''} onChange={(f, v) => set('first_conference', v === 'yes')} options={[['yes','Yes'],['no','No']]} />
                {form.first_conference === false && (
                  <input className="fb-input fb-input--indent" type="number" min="1"
                    value={form.previous_conferences} onChange={txt('previous_conferences')}
                    placeholder="How many previous conferences?" />
                )}
              </div>

              <div className="fb-field">
                <label className="fb-label">Mode of attendance</label>
                <RadioGroup field="attendance_mode" value={form.attendance_mode} onChange={set} options={[
                  ['in_person','In Person'],['virtual','Virtual'],['hybrid','Both (Hybrid)'],
                ]} />
              </div>
            </div>
          )}

          {/* STEP 1 — Overall Experience */}
          {step === 1 && (
            <div className="fb-section">
              <h2 className="fb-section-title">Overall Conference Experience</h2>
              <p className="fb-section-sub">Rate each item: 1 = Poor · 5 = Excellent</p>
              <div className="fb-ratings">
                <RatingRow label="Overall quality of the conference" field="rating_overall" value={form.rating_overall} onChange={set} />
                <RatingRow label="Relevance of the theme to Nigerian legal education" field="rating_theme_relevance" value={form.rating_theme_relevance} onChange={set} />
                <RatingRow label="Value for registration fee and cost of attending" field="rating_value_for_money" value={form.rating_value_for_money} onChange={set} />
                <RatingRow label="Balance between academic sessions, business meetings and social events" field="rating_balance" value={form.rating_balance} onChange={set} />
                <RatingRow label="Time-keeping and adherence to the programme" field="rating_timekeeping" value={form.rating_timekeeping} onChange={set} />
              </div>
              <div className="fb-field">
                <label className="fb-label">How likely are you to attend the next NALT conference?</label>
                <RadioGroup field="likely_to_attend_next" value={form.likely_to_attend_next} onChange={set} options={[
                  ['very_likely','Very Likely'],['likely','Likely'],['unsure','Unsure'],['unlikely','Unlikely'],
                ]} />
              </div>
              <div className="fb-field">
                <label className="fb-label">Would you recommend the NALT conference to a colleague?</label>
                <RadioGroup field="would_recommend" value={form.would_recommend} onChange={set} options={[['yes','Yes'],['no','No'],['maybe','Maybe']]} />
              </div>
            </div>
          )}

          {/* STEP 2 — Programme */}
          {step === 2 && (
            <div className="fb-section">
              <h2 className="fb-section-title">Programme Content & Sessions</h2>
              <p className="fb-section-sub">Rate each item: 1 = Poor · 5 = Excellent. Leave blank any session you did not attend.</p>
              <div className="fb-ratings">
                <RatingRow label="Opening ceremony and keynote address" field="rating_opening" value={form.rating_opening} onChange={set} />
                <RatingRow label="Plenary sessions" field="rating_plenary" value={form.rating_plenary} onChange={set} />
                <RatingRow label="Parallel / paper presentation sessions" field="rating_parallel" value={form.rating_parallel} onChange={set} />
                <RatingRow label="Quality of papers presented" field="rating_paper_quality" value={form.rating_paper_quality} onChange={set} />
                <RatingRow label="Quality of chairing and discussant comments" field="rating_chairing" value={form.rating_chairing} onChange={set} />
                <RatingRow label="Time allowed for presentations and questions" field="rating_time_allocation" value={form.rating_time_allocation} onChange={set} />
                <RatingRow label="Peer review and abstract selection process" field="rating_peer_review" value={form.rating_peer_review} onChange={set} />
                <RatingRow label="Annual General Meeting (AGM)" field="rating_agm" value={form.rating_agm} onChange={set} />
                <RatingRow label="Workshops or training sessions (if any)" field="rating_workshops" value={form.rating_workshops} onChange={set} />
              </div>
              <div className="fb-field">
                <label className="fb-label">Which session or presentation did you find most valuable, and why?</label>
                <textarea className="fb-textarea" value={form.most_valuable_session} onChange={txt('most_valuable_session')} rows={3} placeholder="Tell us what stood out…" />
              </div>
              <div className="fb-field">
                <label className="fb-label">Which topics or themes would you like future conferences to cover?</label>
                <textarea className="fb-textarea" value={form.future_topics} onChange={txt('future_topics')} rows={3} placeholder="Your suggestions…" />
              </div>
              <div className="fb-field">
                <label className="fb-label">Did you present a paper?</label>
                <RadioGroup field="presented_paper" value={form.presented_paper === true ? 'yes' : form.presented_paper === false ? 'no' : ''} onChange={(f, v) => set('presented_paper', v === 'yes')} options={[['yes','Yes'],['no','No']]} />
                {form.presented_paper === true && (
                  <div style={{marginTop:12}}>
                    <label className="fb-label">Rate your presenting experience</label>
                    <RatingRow label="Feedback received, time allocation, audience engagement" field="rating_presenting_experience" value={form.rating_presenting_experience} onChange={set} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* STEP 3 — Logistics */}
          {step === 3 && (
            <div className="fb-section">
              <h2 className="fb-section-title">Organisation & Logistics</h2>
              <p className="fb-section-sub">Rate each item: 1 = Poor · 5 = Excellent. Leave blank any that don't apply.</p>
              <div className="fb-ratings">
                <RatingRow label="Pre-conference information (call for papers, programme, deadlines)" field="rating_pre_conference_info" value={form.rating_pre_conference_info} onChange={set} />
                <RatingRow label="Registration process and payment" field="rating_registration_process" value={form.rating_registration_process} onChange={set} />
                <RatingRow label="Conference venue (halls, seating, sound, power)" field="rating_venue" value={form.rating_venue} onChange={set} />
                <RatingRow label="Internet access and audio-visual support" field="rating_internet_av" value={form.rating_internet_av} onChange={set} />
                <RatingRow label="Conference materials (programme booklet, abstracts, bag)" field="rating_materials" value={form.rating_materials} onChange={set} />
                <RatingRow label="Catering (tea breaks and lunch)" field="rating_catering" value={form.rating_catering} onChange={set} />
                <RatingRow label="Accommodation arrangements and recommended hotels" field="rating_accommodation" value={form.rating_accommodation} onChange={set} />
                <RatingRow label="Transport and directions to the venue" field="rating_transport" value={form.rating_transport} onChange={set} />
                <RatingRow label="Helpfulness of the LOC and ushers" field="rating_loc_staff" value={form.rating_loc_staff} onChange={set} />
                <RatingRow label="Security and safety at the venue" field="rating_security" value={form.rating_security} onChange={set} />
                <RatingRow label="Virtual participation platform (if you joined online)" field="rating_virtual_platform" value={form.rating_virtual_platform} onChange={set} />
              </div>
              <div className="fb-field">
                <label className="fb-label">Did you experience any logistics problem? If yes, please describe.</label>
                <textarea className="fb-textarea" value={form.logistics_problems} onChange={txt('logistics_problems')} rows={3} placeholder="Describe any issues…" />
              </div>
              <div className="fb-field">
                <label className="fb-label">Was the conference duration right?</label>
                <RadioGroup field="conference_duration" value={form.conference_duration} onChange={set} options={[['too_short','Too Short'],['about_right','About Right'],['too_long','Too Long']]} />
              </div>
            </div>
          )}

          {/* STEP 4 — Professional Value */}
          {step === 4 && (
            <div className="fb-section">
              <h2 className="fb-section-title">Networking & Professional Value</h2>
              <div className="fb-field">
                <label className="fb-label">The conference gave me useful opportunities to network with colleagues.</label>
                <RadioGroup field="networking_opportunities" value={form.networking_opportunities} onChange={set} options={AGREE_OPTIONS} />
              </div>
              <div className="fb-field">
                <label className="fb-label">I gained ideas or knowledge I can apply to my teaching, research or practice.</label>
                <RadioGroup field="knowledge_gained" value={form.knowledge_gained} onChange={set} options={AGREE_OPTIONS} />
              </div>
              <div className="fb-field">
                <label className="fb-label">The conference strengthened my connection to NALT as an association.</label>
                <RadioGroup field="nalt_connection" value={form.nalt_connection} onChange={set} options={AGREE_OPTIONS} />
              </div>
              <div className="fb-field">
                <label className="fb-label">Which of these would add value to future conferences? <span className="fb-optional">(tick all that apply)</span></label>
                <CheckGroup field="value_add_suggestions" value={form.value_add_suggestions} onChange={set} options={[
                  ['early_career','Early-career researcher workshops'],
                  ['grant_writing','Grant-writing and research funding clinics'],
                  ['publishing','Publishing and journal editor sessions'],
                  ['mentoring','Mentoring pairings for junior lecturers'],
                  ['bar_bench','Sessions with the Bar, Bench and Council of Legal Education'],
                  ['networking','Structured networking or faculty exchange sessions'],
                  ['other','Other'],
                ]} />
                {form.value_add_suggestions.includes('other') && (
                  <input className="fb-input fb-input--indent" value={form.value_add_other} onChange={txt('value_add_other')} placeholder="Please specify" />
                )}
              </div>
            </div>
          )}

          {/* STEP 5 — Comments */}
          {step === 5 && (
            <div className="fb-section">
              <h2 className="fb-section-title">Your Comments & Suggestions</h2>
              <div className="fb-field">
                <label className="fb-label">What did you like most about this conference?</label>
                <textarea className="fb-textarea" value={form.liked_most} onChange={txt('liked_most')} rows={3} placeholder="Share what stood out positively…" />
              </div>
              <div className="fb-field">
                <label className="fb-label">What should the organisers do differently next time?</label>
                <textarea className="fb-textarea" value={form.do_differently} onChange={txt('do_differently')} rows={3} placeholder="Constructive suggestions…" />
              </div>
              <div className="fb-field">
                <label className="fb-label">Suggestions on venue, host institution or timing of the next conference?</label>
                <textarea className="fb-textarea" value={form.venue_suggestions} onChange={txt('venue_suggestions')} rows={3} placeholder="Your thoughts…" />
              </div>
              <div className="fb-field">
                <label className="fb-label">Any other comments for the NALT Executive or the LOC?</label>
                <textarea className="fb-textarea" value={form.other_comments} onChange={txt('other_comments')} rows={3} placeholder="Anything else…" />
              </div>
              {error && <p className="fb-error">{error}</p>}
            </div>
          )}

          {/* Navigation */}
          <div className="fb-nav">
            {step > 0 && (
              <button className="fb-btn fb-btn--back" onClick={() => setStep(s => s - 1)}>Back</button>
            )}
            {step < STEPS.length - 1 ? (
              <button className="fb-btn fb-btn--next" onClick={() => setStep(s => s + 1)} disabled={!canNext()}>
                Next
              </button>
            ) : (
              <button className="fb-btn fb-btn--submit" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting…' : 'Submit Feedback'}
              </button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Feedback;