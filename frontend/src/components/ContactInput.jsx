import { useState } from "react";
import { adminService } from "../services/api";

function ContactInput() {
  const [formData, setFormData] = useState({
    name: "",
    phoneNumber: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phoneNumber") {
      // Allow only digits for phone number
      if (value === "" || /^\d+$/.test(value)) {
        setFormData({
          ...formData,
          [name]: value
        });
        setError("");
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!formData.name.trim()) {
      setError("Name is required");
      return;
    }
    
    if (formData.phoneNumber.length !== 11) {
      setError("Phone number must be exactly 11 digits");
      return;
    }
    
    try {
      setLoading(true);
      
      // Use the API service to send data
      await adminService.addContact(formData);
      
      setSuccess("Thank you! We'll contact you soon.");
      setFormData({ name: "", phoneNumber: "" });
      setError("");
    } catch (error) {
      setError(error.response?.data?.message || "Something went wrong. Please try again.");
      setSuccess("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-input-container">
      <h3>Subscribe for Updates</h3>
      <p>Enter your details to receive updates and special offers</p>
      
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="input-group">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            className={error && !formData.name ? "error-input" : ""}
            disabled={loading}
          />
        </div>
        
        <div className="input-group">
          <input
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            placeholder="11-digit Phone Number"
            maxLength={11}
            className={error && formData.phoneNumber.length !== 11 ? "error-input" : ""}
            disabled={loading}
          />
        </div>
        
        <button 
          type="submit" 
          disabled={!formData.name || formData.phoneNumber.length !== 11 || loading}
          className="submit-btn"
        >
          {loading ? "Submitting..." : "Subscribe"}
        </button>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
      </form>
    </div>
  );
}

export default ContactInput;
