import { useState } from "react";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaClock, FaSpinner, FaUpload, FaTimes } from "react-icons/fa";
import emailjs from "@emailjs/browser";
import styles from "./Contact.module.css";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({ type: "", message: "" });
  const [uploadedImages, setUploadedImages] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear status when user starts typing
    if (submitStatus.type) {
      setSubmitStatus({ type: "", message: "" });
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      setSubmitStatus({
        type: "error",
        message: "Please select valid image files"
      });
      return;
    }

    // Check file sizes (max 5MB per image)
    const oversizedFiles = imageFiles.filter(file => file.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      setSubmitStatus({
        type: "error",
        message: "Some images exceed 5MB limit. Please select smaller images."
      });
      return;
    }

    // Create preview URLs for all selected images
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImages(prev => [...prev, {
          file: file,
          preview: reader.result,
          id: Date.now() + Math.random()
        }]);
      };
      reader.readAsDataURL(file);
    });

    // Clear the input
    e.target.value = '';
  };

  const handleRemoveImage = (id) => {
    setUploadedImages(prev => prev.filter(img => img.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitStatus({ type: "", message: "" });

    try {
      // Get EmailJS configuration from environment variables
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

      if (!serviceId || !templateId || !publicKey) {
        throw new Error("EmailJS is not configured. Please check your environment variables.");
      }

      // Initialize EmailJS with public key
      emailjs.init(publicKey);

      // Send email using EmailJS
      const response = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: formData.name,
          from_email: formData.email,
          phone: formData.phone || "Not provided",
          message: formData.message,
          to_email: "puscartdeliveryservice@gmail.com", // Your business email
        }
      );

      if (response.status === 200) {
        setSubmitStatus({
          type: "success",
          message: "Thank you for your message! We'll get back to you soon."
        });
        setFormData({ name: "", email: "", phone: "", message: "" });
        setUploadedImages([]);
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setSubmitStatus({
        type: "error",
        message: error.message || "Failed to send message. Please try again later."
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.contactPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Contact Us</h1>
          <p className={styles.subtitle}>We'd love to hear from you. Get in touch with us!</p>
        </div>

        <div className={styles.contentGrid}>
          <div className={styles.contactInfo}>
            <h2 className={styles.sectionTitle}>Get in Touch</h2>
            <p className={styles.sectionText}>
              Have a question or need assistance? We're here to help! Reach out to us 
              through any of the following channels.
            </p>

            <div className={styles.infoCards}>
              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <FaPhone />
                </div>
                <div className={styles.infoContent}>
                  <h3 className={styles.infoTitle}>Phone</h3>
                  <p className={styles.infoText}>+91 98941 22804</p>
                  
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <FaEnvelope />
                </div>
                <div className={styles.infoContent}>
                  <h3 className={styles.infoTitle}>Email</h3>
                  <p className={styles.infoText}>puscartdeliveryservice@gmail.com</p>
                  
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <FaMapMarkerAlt />
                </div>
                <div className={styles.infoContent}>
                  <h3 className={styles.infoTitle}>Address</h3>
                  <p className={styles.infoText}>PUSCART NO.391</p>
                  <p className={styles.infoText}>Thindivanam Main road,Opp to India One ATM,Somasipadi(PO),Kilpennathur (TK)</p>
                  <p className={styles.infoText}>Tiruvannamalai,Tamilnadu-606611</p>
                </div>
              </div>

              <div className={styles.infoCard}>
                <div className={styles.infoIcon}>
                  <FaClock />
                </div>
                <div className={styles.infoContent}>
                  <h3 className={styles.infoTitle}>Business Hours</h3>
                  <p className={styles.infoText}>Monday - Friday: 9:00 AM-8:00 PM</p>
                  <p className={styles.infoText}>Saturday: 10:00 AM - 6:00 PM</p>
                  <p className={styles.infoText}>Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.contactForm}>
            <h2 className={styles.sectionTitle}>Send us a Message</h2>
            
            {submitStatus.type && (
              <div className={`${styles.statusMessage} ${
                submitStatus.type === "success" ? styles.successMessage : styles.errorMessage
              }`}>
                {submitStatus.message}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="name" className={styles.label}>Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter your full name"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email" className={styles.label}>Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone" className={styles.label}>Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={styles.input}
                  placeholder="Enter your phone number"
                  disabled={isLoading}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="message" className={styles.label}>Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  className={styles.textarea}
                  placeholder="Enter your message"
                  rows="6"
                  required
                  disabled={isLoading}
                ></textarea>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="imageUpload" className={styles.uploadLabel}>
                  <FaUpload className={styles.uploadIcon} />
                  Upload Images
                </label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className={styles.fileInput}
                  disabled={isLoading}
                />
                {uploadedImages.length > 0 && (
                  <div className={styles.imagePreviewContainer}>
                    {uploadedImages.map((img) => (
                      <div key={img.id} className={styles.imagePreviewItem}>
                        <img src={img.preview} alt="Preview" className={styles.previewImage} />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(img.id)}
                          className={styles.removeImageButton}
                          disabled={isLoading}
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                className={styles.submitButton}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <FaSpinner className={styles.spinner} /> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
