"use client";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import { supabase } from "@/lib/supabase/client";
import styles from "./Form.module.scss";
import { text } from "@/lib/text";

const SignupForm = () => {
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    dob: "",
    lm: "",
    handicap: "",
    location: "",
  });

  const handleSignup = async () => {
    const { email, password, username, dob, lm, handicap, location } = formData;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined, // disables confirmation redirect --> add in future
      },
    });

    if (error) {
      alert(text.auth.registerError + error.message);
    }

    if (data.user) {
      const { error: dbError } = await supabase
        .from("users")
        .update({
          id: data.user.id,
          email: formData.email,
          username: formData.username,
          launch_monitor: formData.lm,
          handicap: formData.handicap,
          location: formData.location,
          rank: "Bogey III",
        })
        .eq("id", data.user.id);

      if (dbError) return alert("Error saving user data: " + dbError.message);
    }
    alert("Signup successful!");
  };

  const introStep = (
    <div className={styles.authForm}>
      <h1>Sign up to elevate your game</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="username@domain.com"
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            value={formData.email}
          />
        </div>
        <button onClick={() => setStep(2)} className={styles.nextBtn}>
          Next
        </button>
        <p>or</p>
        <button className={styles.secondaryBtn}>
          <FcGoogle size={24} />
          <span> Sign up with Google</span>
        </button>
        <button className={styles.secondaryBtn}>
          <FaApple size={24} />
          <span> Sign up with Apple</span>
        </button>

        <div className={styles.redirect}>
          <p>Already have an account?</p>
          <Link href="/auth/login">Log in</Link>
        </div>
      </div>
    </div>
  );

  const passwordStep = (
    <div className={styles.authForm}>
      <h2 className={styles.brand}>{text.brand}</h2>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(step - 1) * 33.33}%` }}
        ></div>
      </div>
      <div className={styles.form}>
        <div className={styles.stepHeader}>
          <FaChevronLeft
            size={20}
            className={styles.arrow}
            onClick={() => setStep(step - 1)}
          />

          <p>Step 1 of 3</p>
          <h3>Create a password</h3>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            value={formData.password}
          />
        </div>

        <div className={styles.requirements}>
          <h3>Your password must contain at least</h3>
          <ul>
            <li>
              {" "}
              <div className={styles.circle}></div>1 letter
            </li>
            <li>
              <div className={styles.circle}></div>1 number or special character
              (example: # ? ! &)
            </li>
            <li>
              <div className={styles.circle}></div>10 characters
            </li>
          </ul>
        </div>

        <button onClick={() => setStep(3)} className={styles.nextBtn}>
          Next
        </button>
      </div>
    </div>
  );

  const userInfoStep = (
    <div className={styles.authForm}>
      <h2 className={styles.brand}>{text.brand}</h2>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(step - 1) * 33.33}%` }}
        ></div>
      </div>
      <div className={styles.form}>
        <div className={styles.stepHeader}>
          <FaChevronLeft
            size={20}
            className={styles.arrow}
            onClick={() => setStep(step - 1)}
          />

          <p>Step 2 of 3</p>
          <h3>Tell us about yourself</h3>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="username">username</label>
          <span>This username will appear on your profile</span>
          <input
            type="text"
            id="username"
            onChange={(e) =>
              setFormData({ ...formData, username: e.target.value })
            }
            value={formData.username}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dob">Date of birth</label>
          <span>
            Why do we need your date of birth?{" "}
            <Link href={"/learn-more"}>Learn more.</Link>
          </span>
          <input
            type="date"
            id="dob"
            placeholder="MM/DD/YYYY"
            onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            value={formData.dob}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="lm">Launch Monitor</label>
          <input
            type="text"
            id="lm"
            placeholder="Square Golf"
            onChange={(e) => setFormData({ ...formData, lm: e.target.value })}
            value={formData.lm}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="handicap">Handicap</label>
          <input
            type="text"
            id="handicap"
            placeholder="+8"
            onChange={(e) =>
              setFormData({ ...formData, handicap: e.target.value })
            }
            value={formData.handicap}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            placeholder="Scottsdale, AZ"
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            value={formData.location}
          />
        </div>

        <button onClick={() => setStep(4)} className={styles.nextBtn}>
          Next
        </button>
      </div>
    </div>
  );

  const reviewStep = (
    <div className={styles.authForm}>
      <h2 className={styles.brand}>{text.brand}</h2>

      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(step - 1) * 33.33}%` }}
        ></div>
      </div>
      <div className={styles.form}>
        <div className={styles.stepHeader}>
          <FaChevronLeft
            size={20}
            className={styles.arrow}
            onClick={() => setStep(step - 1)}
          />

          <p>Step 3 of 3</p>
          <h3>Review your information</h3>
        </div>

        <p>Email: {formData.email}</p>
        <p>username: {formData.username}</p>
        <p>Date of Birth: {formData.dob}</p>
        <p>Launch Monitor: {formData.lm}</p>
        <p>Handicap: {formData.handicap}</p>
        <p>Location: {formData.location}</p>

        <button onClick={handleSignup} className={styles.nextBtn}>
          Sign Up
        </button>
      </div>
    </div>
  );

  return (
    <div className={styles.page}>
      {step === 1 && introStep}

      {step === 2 && passwordStep}

      {step == 3 && userInfoStep}

      {step === 4 && reviewStep}
    </div>
  );
};

export default SignupForm;
