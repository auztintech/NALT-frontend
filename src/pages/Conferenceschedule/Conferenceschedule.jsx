import { useRef } from "react";
import "./Conferenceschedule.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const schedule = [
  {
    day: "Day One",
    date: "Sunday, 18th October 2026",
    theme: "Developing Tech-driven Legal Curricula in Nigeria",
    sessions: [
      {
        type: "plenary",
        time: "8:00am – 11:50am",
        title: "Opening Formalities",
        items: [],
      },
      {
        type: "breakout-header",
        time: "Breakout Sessions",
      },
      {
        type: "breakout",
        time: "3:00pm – 4:20pm",
        tracks: [
          {
            title: "Legal Issues in AI and Legal Automation",
            sub: "Research, document review, contract analysis, case review and forecasting case outcomes",
            presenter: "Bayero University, Kano",
            discussants: ["Benson Idahosa University", "Veritas University", "Lagos State University"],
          },
          {
            title: "Integrating Science into Legal Education and Legal Development",
            presenter: "University of Port Harcourt",
            discussants: ["University of Benin", "Confluence University of Science and Technology", "Edo State University, Iyamho"],
          },
          {
            title: "The Legal Implications of Blockchain and Smart Contracts",
            presenter: "Igbinedion University",
            discussants: ["Federal University Lokoja", "Crescent University", "Renaissance University"],
          },
        ],
      },
      {
        type: "breakout",
        time: "4:30pm – 6:00pm",
        tracks: [
          {
            title: "Introduction to Legal Tech Tools and Platforms",
            presenter: "Prince Abubakar Audu University",
            discussants: ["Adekunle Ajasin University", "Taraba State University", "KolaDaisi University"],
          },
          {
            title: "Mainstreaming the Principles of Legislation into Legal Curriculum",
            presenter: "National Institute for Legislative and Democratic Studies (NILDS)",
            discussants: ["Ambrose Ali University", "Nnamdi Azikiwe University", "Thomas Adewunmi University"],
          },
          {
            title: "Developing and Implementing an Access to Justice Technology in Nigeria: A Comparative Study",
            presenter: "Elizade University",
            discussants: ["Baze University", "Gregory University", "Achievers University"],
          },
        ],
      },
    ],
  },
  {
    day: "Day Two",
    date: "Monday, 19th October 2026",
    theme: "Emerging Technologies, the Law and Sustainable Development Goals",
    sessions: [
      {
        type: "plenary",
        time: "9:00am – 11:30am",
        title: "Second Plenary Session",
        items: [
          { label: "Chairman", value: "Professor T. C. Eze, Vice Chancellor, Renaissance University, Enugu" },
          { label: "1st Paper", value: "The Effectiveness of the Legal Frameworks and Regulatory Compliance in Nigeria's Digital Eco-system" },
          { label: "2nd Paper", value: "Intellectual Property Protection in Nigeria in the Age of Generative AI – Regulatory Compliance and Enforcement Challenges / Environmental Law and Green Tech Regulation in Nigeria" },
          { label: "3rd Paper", value: "Reimagining Legal Education for the SDGs: Practical Tools for Embedding Climate Justice in Teaching and Research — Dr. Pedi Obani SFHEA, University of Bradford, UK" },
          { label: "Moderator", value: "Chairman of Session" },
        ],
      },
      { type: "breakout-header", time: "Breakout Sessions" },
      {
        type: "breakout",
        time: "1:00pm – 2:30pm",
        tracks: [
          {
            title: "Bridging the Justice Gap: Digital Transformation in Legal Education for implementing the SDGs",
            presenter: "Federal University Dutsin-Ma",
            discussants: ["Ekiti State University", "Delta State University, Abraka"],
          },
          {
            title: "The Effectiveness of Nigeria's Legal/Regulatory Frameworks on Data Protection, Consent, Transparency, Usage and Retention",
            presenter: "University of Lagos",
            discussants: ["Western Delta University, Oghara", "Edwin Clark University"],
          },
          {
            title: "A Comparative Analysis of the Role of Law in Implementing Privacy-Enhancing Technologies (PETs) in Nigeria",
            presenter: "American University of Nigeria",
            discussants: ["Ebonyi State University", "Bingham University"],
          },
        ],
      },
      {
        type: "breakout",
        time: "2:30pm – 4:00pm",
        tracks: [
          {
            title: "Regulating Smart Grid for Energy Efficiency Implementation in Nigeria",
            presenter: "University of Maiduguri",
            discussants: ["Olabisi Onabanjo University", "Kingsley Ozumba Mbadiwe University"],
          },
          {
            title: "Adopting Circular Economy and Recycling Tech in Nigeria",
            presenter: "Obafemi Awolowo University",
            discussants: ["Al Hikmah University", "Madonna University"],
          },
          {
            title: "Incentivizing Green Innovation, Green Credit, and Green Finance through Law in Nigeria",
            presenter: "University of Calabar",
            discussants: ["Ahmadu Bello University", "Mcpherson University, Ogun State"],
          },
        ],
      },
      {
        type: "breakout",
        time: "4:00pm – 5:30pm",
        tracks: [
          {
            title: "How may the Law Intervene in Digital Ethics and Algorithmic Bias?",
            presenter: "Imo State University",
            discussants: ["Nasarawa State University", "Bowen University"],
          },
          {
            title: "Proposing Legal Solutions to the Questions of the Patentability of AI Inventions and the Ownership of AI-Generated Contents",
            presenter: "University of Abuja",
            discussants: ["Yobe State University", "University on the Niger, Umumya"],
          },
          {
            title: "Liability for Infringements and Violation of Moral Rights/Attribution in Generative AI",
            presenter: "Niger Delta University",
            discussants: ["Babcock University", "Fountain University, Osogbo"],
          },
        ],
      },
    ],
  },
  {
    day: "Day Three",
    date: "Tuesday, 20th October 2026",
    theme: "Policy, Practice and Future-Proofing",
    sessions: [
      {
        type: "plenary",
        time: "9:00am – 10:20am",
        title: "Special Plenary: Advancing Women's Participation",
        subtitle: "Advancing Women's Rights and Breaking Barriers for an Inclusive Future for Women in Law Faculties in Nigeria",
        items: [
          { label: "Chairman", value: "Professor (Mrs.) Violet Aigbokhaevbo" },
          { label: "1st Speaker", value: "National Association of Law Teachers (NALT)" },
          { label: "2nd Speaker", value: "Nigerian Institute of Advanced Legal Studies (NIALS)" },
          { label: "3rd Speaker", value: "Nigerian Law School" },
          { label: "4th Speaker", value: "Faculty of Law, University of Lagos" },
        ],
      },
      {
        type: "plenary",
        time: "10:30am – 12:00pm",
        title: "Third Plenary Session",
        items: [
          { label: "Chairman", value: "Prof. Abdulqadir Ibrahim Abikan, Director General of NIALS" },
          { label: "1st Paper", value: "Clinical Legal Education, Experiential Learning, Continuous Assessment in Legal Education, and Quality Assurance — Professor Ernest Ojukwu SAN" },
          { label: "2nd Paper", value: "Academia-Private Sector Collaboration: Bridging the Gap in Nigeria — Professor Bagoni Alhaji Bukar, University of Maiduguri" },
          { label: "Moderator", value: "Chairman of Session" },
        ],
      },
      {
        type: "break",
        time: "12:00pm – 12:50pm",
        title: "Lunch Break",
      },
      { type: "breakout-header", time: "Breakout Sessions" },
      {
        type: "breakout",
        time: "1:00pm – 2:20pm",
        tracks: [
          {
            title: "Enhancing Inclusive Digital Banking and Payments Through Regulatory Sandboxes and Proportionate Regulation in Nigeria",
            presenter: "University of Ilorin",
            discussants: ["University of Nigeria, Nsukka", "Lead City University"],
          },
          {
            title: "The Role of Law in Implementing Digital Identification, e-KYC and Alternative Credit Scoring in Nigeria",
            presenter: "Nigerian Institute of Advanced Legal Studies",
            discussants: ["Usman Dan Fodio University", "Kwara State University", "Alex Ekwueme Federal University"],
          },
          {
            title: "Implementing Agent Banking, Insurtech and Financial Literacy through Legal Reforms",
            presenter: "Joseph Ayo Babalola University",
            discussants: ["Christopher University", "Admiralty University"],
          },
        ],
      },
      {
        type: "breakout",
        time: "2:30pm – 4:00pm",
        tracks: [
          {
            title: "Rule-Based Mitigation of the Ethical Implications of the use of Technology in Litigation and Advocacy in Nigeria",
            presenter: "Nigerian Law School",
            discussants: ["Abia State University", "Margaret Lawrence University"],
          },
          {
            title: "Harmonising Pedagogy and Digital Learning: Practical Steps towards overcoming Implementation Hurdles in Nigeria",
            presenter: "University of Ibadan",
            discussants: ["Federal University, Otuoke", "Nigeria Police Academy, Wudil"],
          },
          {
            title: "Adopting Virtual Clinics for Remote Services: How to Overcome its Ethical Implications",
            presenter: "University of Jos",
            discussants: ["University of Uyo", "Salem University"],
          },
        ],
      },
    ],
  },
  {
    day: "Day Four",
    date: "Wednesday, 21st October 2026",
    theme: "NALT Assembly and Resolutions",
    sessions: [
      {
        type: "assembly",
        items: [
          "Making NALT more active and relevant on national issues and debates",
          "NALT resolution on the reduction of number of academics awarded the SAN rank",
          "Mentoring and Academic Leadership – Mentoring Young Law Teachers, Developing Future Academic Leaders, Staff Capacity Building, Faculty Development, Leadership in Law Faculties, Academic Wellbeing, and Succession Planning",
          "Professional Ethics – Ethics in Legal Education, Teaching Professional Responsibility, Academic Integrity, Ethics of AI, and Character Formation in Legal Education",
        ],
      },
    ],
  },
];

const deadlines = [
  { date: "10 August 2026", info: "Deadline for communication of acceptance of assigned role as paper presenter or discussant. Where acceptance is not communicated, a role may be assigned to another institution." },
  { date: "10 September 2026", info: "Deadline for submission of papers and discussants' preliminary notes. Discussants are kindly requested to prepare their papers to avoid undue delay that may be associated with late receipt of the lead paper." },
];

export default function ConferenceSchedule() {
  const fileUrl = "/NALT_PROGRAMME_2026.docx";
  const dayRefs = useRef([]);

  const scrollToDay = (i) => {
    dayRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
    <Header />
    <div className="cs-page">
      {/* Hero */}
      <div className="cs-hero">
        <div className="cs-hero__inner">
          <p className="cs-hero__eyebrow">57th Annual Conference · 2026</p>
          <h1 className="cs-hero__title">Programme & Schedule</h1>
          <p className="cs-hero__sub">
            Faculty of Law, University of Benin, Benin City · 18th – 22nd October 2026
          </p>
          <p className="cs-hero__theme">
            "Legal Education, Emerging Technologies and the Challenges of the Sustainable Development Goals"
          </p>
          <a href={fileUrl} download className="cs-download-btn">
            Download Full Programme
          </a>
        </div>
      </div>

      {/* Day tabs */}
      <div className="cs-tabs">
        {schedule.map((d, i) => (
          <button key={i} className="cs-tab" onClick={() => scrollToDay(i)}>
            <span className="cs-tab__day">{d.day}</span>
            <span className="cs-tab__theme">{d.theme}</span>
          </button>
        ))}
      </div>

      {/* Schedule body */}
      <div className="cs-body">
        {schedule.map((day, di) => (
          <section
            key={di}
            className="cs-day"
            ref={(el) => (dayRefs.current[di] = el)}
          >
            {/* Day header */}
            <div className="cs-day__header">
              <span className="cs-day__badge">{day.day}</span>
              <h2 className="cs-day__title">{day.theme}</h2>
              <p className="cs-day__date">{day.date}</p>
            </div>

            {/* Sessions */}
            <div className="cs-sessions">
              {day.sessions.map((session, si) => {
                if (session.type === "breakout-header") {
                  return (
                    <div key={si} className="cs-breakout-header">
                      <span>Breakout Sessions</span>
                    </div>
                  );
                }

                if (session.type === "break") {
                  return (
                    <div key={si} className="cs-break">
                      <span className="cs-break__time">{session.time}</span>
                      <span className="cs-break__label">{session.title}</span>
                    </div>
                  );
                }

                if (session.type === "assembly") {
                  return (
                    <div key={si} className="cs-assembly">
                      <ul>
                        {session.items.map((item, ii) => (
                          <li key={ii}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  );
                }

                if (session.type === "plenary") {
                  return (
                    <div key={si} className="cs-plenary">
                      <div className="cs-plenary__time">{session.time}</div>
                      <div className="cs-plenary__content">
                        <h3 className="cs-plenary__title">{session.title}</h3>
                        {session.subtitle && (
                          <p className="cs-plenary__subtitle">{session.subtitle}</p>
                        )}
                        {session.items && session.items.length > 0 && (
                          <ul className="cs-plenary__items">
                            {session.items.map((item, ii) => (
                              <li key={ii}>
                                <span className="cs-plenary__label">{item.label}:</span>
                                <span className="cs-plenary__value">{item.value}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  );
                }

                if (session.type === "breakout") {
                  return (
                    <div key={si} className="cs-breakout">
                      <div className="cs-breakout__time">{session.time}</div>
                      <div className="cs-breakout__tracks">
                        {session.tracks.map((track, ti) => (
                          <div key={ti} className="cs-track">
                            <p className="cs-track__title">{track.title}</p>
                            {track.sub && <p className="cs-track__sub">{track.sub}</p>}
                            <div className="cs-track__presenter">
                              <span className="cs-track__role">Presenter:</span> {track.presenter}
                            </div>
                            {track.discussants && track.discussants.length > 0 && (
                              <div className="cs-track__discussants">
                                {track.discussants.map((d, dii) => (
                                  <span key={dii} className="cs-track__discussant">
                                    Discussant {dii + 1}: {d}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }

                return null;
              })}
            </div>
          </section>
        ))}

        {/* Deadlines */}
        <section className="cs-deadlines">
          <h2 className="cs-deadlines__title">Important Deadlines</h2>
          <p className="cs-deadlines__intro">
            Esteemed colleagues are kindly requested to note the following timelines:
          </p>
          <div className="cs-deadlines__list">
            {deadlines.map((d, i) => (
              <div key={i} className="cs-deadline">
                <div className="cs-deadline__date">{d.date}</div>
                <div className="cs-deadline__info">{d.info}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Download CTA */}
        <div className="cs-download-strip">
          <div className="cs-download-strip__inner">
            <div>
              <p className="cs-download-strip__title">Download the Full Programme</p>
              <p className="cs-download-strip__sub">Get the complete NALT 2026 conference programme as a Word document.</p>
            </div>
            <a href={fileUrl} download className="cs-download-btn cs-download-btn--light">
              Download Programme
            </a>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}