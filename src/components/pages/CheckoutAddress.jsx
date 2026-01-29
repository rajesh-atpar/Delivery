import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CheckoutAddress.module.css";

const CHECKOUT_DETAILS_KEY = "checkoutDetails";

// Indian mobile: 10 digits, optional +91
const isValidMobile = (value) => {
  const digits = value.replace(/\D/g, "");
  return digits.length === 10 && /^[6-9]/.test(digits);
};

const CheckoutAddress = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    deliveryAddress: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty
  useEffect(() => {
    const cartItems = JSON.parse(localStorage.getItem("cartItems") || "[]");
    if (cartItems.length === 0) {
      navigate("/cart", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  const validate = () => {
    const newErrors = {};
    const trimmedName = formData.fullName.trim();
    const trimmedMobile = formData.mobileNumber.trim();
    const trimmedAddress = formData.deliveryAddress.trim();

    if (!trimmedName) {
      newErrors.fullName = "Full name is required";
    }
    if (!trimmedMobile) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (!isValidMobile(trimmedMobile)) {
      newErrors.mobileNumber = "Enter a valid 10-digit mobile number";
    }
    if (!trimmedAddress) {
      newErrors.deliveryAddress = "Delivery address is required";
    }

    setErrors(newErrors);
    setTouched({
      fullName: true,
      mobileNumber: true,
      deliveryAddress: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const details = {
      fullName: formData.fullName.trim(),
      mobileNumber: formData.mobileNumber.trim().replace(/\D/g, "").slice(-10),
      deliveryAddress: formData.deliveryAddress.trim(),
    };
    sessionStorage.setItem(CHECKOUT_DETAILS_KEY, JSON.stringify(details));

    // Subtle loading delay then redirect
    setTimeout(() => {
      navigate("/checkout/payment", { replace: true });
    }, 800);
  };

  const hasError = (name) => touched[name] && errors[name];

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Progress: Cart → Address → Payment */}
        <div className={styles.progress}>
          <div className={styles.step}>
            <span className={styles.stepDot}>1</span>
            <span className={styles.stepLabel}>Cart</span>
          </div>
          <div className={styles.stepLine} aria-hidden="true" />
          <div className={`${styles.step} ${styles.stepActive}`}>
            <span className={styles.stepDot}>2</span>
            <span className={styles.stepLabel}>Address</span>
          </div>
          <div className={styles.stepLine} aria-hidden="true" />
          <div className={styles.step}>
            <span className={styles.stepDot}>3</span>
            <span className={styles.stepLabel}>Payment</span>
          </div>
        </div>

        <h1 className={styles.title}>Delivery details</h1>
        <p className={styles.subtitle}>We’ll use this to deliver your order</p>

        <form id="checkout-address-form" onSubmit={handleSubmit} className={styles.form} noValidate>
          <div className={styles.formGroup}>
            <label htmlFor="fullName" className={styles.label}>
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${hasError("fullName") ? styles.inputError : ""}`}
              placeholder="Enter your full name"
              autoComplete="name"
              disabled={isSubmitting}
            />
            {hasError("fullName") && (
              <span className={styles.errorText} role="alert">
                {errors.fullName}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mobileNumber" className={styles.label}>
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              name="mobileNumber"
              type="tel"
              inputMode="numeric"
              value={formData.mobileNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.input} ${hasError("mobileNumber") ? styles.inputError : ""}`}
              placeholder="10-digit mobile number"
              autoComplete="tel"
              maxLength="14"
              disabled={isSubmitting}
            />
            {hasError("mobileNumber") && (
              <span className={styles.errorText} role="alert">
                {errors.mobileNumber}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="deliveryAddress" className={styles.label}>
              Delivery Address
            </label>
            <textarea
              id="deliveryAddress"
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`${styles.textarea} ${hasError("deliveryAddress") ? styles.inputError : ""}`}
              placeholder="House no., building, street, area, city, state, PIN"
              rows={4}
              disabled={isSubmitting}
            />
            {hasError("deliveryAddress") && (
              <span className={styles.errorText} role="alert">
                {errors.deliveryAddress}
              </span>
            )}
          </div>

          <div className={styles.spacer} />
        </form>
      </div>

      {/* Fixed bottom Continue button */}
      <div className={styles.footer}>
        <button
          type="submit"
          form="checkout-address-form"
          className={styles.continueButton}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className={styles.spinner} aria-hidden="true" />
              <span>Redirecting...</span>
            </>
          ) : (
            "Continue"
          )}
        </button>
      </div>
    </div>
  );
};

export default CheckoutAddress;
