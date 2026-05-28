import { useState } from "react";
import { endpoint } from "../../api/endpoints";
import "./RegisterForm.css";
import axios from "axios";
import { toast } from "react-toastify";

export default function RegisterForm() {
  const endpoints = endpoint();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    institution: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        endpoints.registration.create,
        formData,
      );
      console.log(response.data);
      setSuccess(true);
      setFormData({
        full_name: "",
        email: "",
        phone_number: "",
        institution: "",
      });
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

  return (
    <section className="register">
      {/* Left — info */}
      <div className="register__left">
        <p className="register__eyebrow">57th Annual Conference</p>
        <h1 className="register__heading">
          Secure Your <span>Spot Today</span>
        </h1>
        <p className="register__subtext">
          Join law educators from across Nigeria at the 57th NALT National
          Conference hosted by the Faculty of Law, University of Benin.
        </p>

        {/* Event details */}
        <div className="register__details">
          <div className="register__detail-item">
            <div className="register__detail-icon"></div>
            <div>
              <span className="register__detail-label">Date</span>
              <span className="register__detail-value">
                18th – 22nd October, 2026
              </span>
            </div>
          </div>
          <div className="register__detail-item">
            <div className="register__detail-icon"></div>
            <div>
              <span className="register__detail-label">Venue</span>
              <span className="register__detail-value">
                Faculty of Law, University of Benin, Benin City, Edo State
              </span>
            </div>
          </div>
          <div className="register__detail-item">
            <div className="register__detail-icon"></div>
            <div>
              <span className="register__detail-label">Early Bird</span>
              <span className="register__detail-value">
                First 100 registrants get a special price
              </span>
            </div>
          </div>
        </div>

        {/* Theme callout */}
        <div className="register__theme">
          <span className="register__theme-label">Conference Theme</span>
          <p className="register__theme-text">
            "Legal Education, Emerging Technologies and the Challenges of the
            Sustainable Development Goals"
          </p>
        </div>
      </div>

      {/* Right — form */}
      <div className="register__right">
        <div className="register__form-card">
          <div className="register__form-header">
            <h2 className="register__form-title">
              Register for the Conference
            </h2>
            <p className="register__form-subtitle">
              Fill in your details below to complete your registration.
            </p>
          </div>

          {success ? (
            <div className="register__success">
              <div className="register__success-icon">✓</div>
              <h3>Registration Successful!</h3>
              <p>
                Thank you for registering. You will receive a confirmation email
                shortly.
              </p>
              <button
                className="register__btn"
                onClick={() => setSuccess(false)}
              >
                Register Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="register__form">
              <div className="register__field">
                <label htmlFor="full_name">Full Name</label>
                <input
                  id="full_name"
                  type="text"
                  name="full_name"
                  placeholder="e.g. Dr. Amaka Okonkwo"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register__field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="e.g. amaka@unilag.edu.ng"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register__field">
                <label htmlFor="phone_number">Phone Number</label>
                <input
                  id="phone_number"
                  type="text"
                  name="phone_number"
                  placeholder="e.g. 08012345678"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="register__field">
                <label htmlFor="institution">Institution</label>
                <input
                  id="institution"
                  type="text"
                  name="institution"
                  placeholder="e.g. University of Lagos"
                  value={formData.institution}
                  onChange={handleChange}
                  required
                />
              </div>

              <button
                type="submit"
                className="register__btn"
                disabled={loading}
              >
                {loading ? (
                  <span className="register__spinner" />
                ) : (
                  "Register Now"
                )}
              </button>

              <p className="register__disclaimer">
                Your information is safe and will only be used for conference
                purposes.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
