"use client";

import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { useEffect, useState } from "react";
import { FaChevronLeft } from "react-icons/fa6";
import styles from "./Form.module.scss";
import { text } from "@/lib/text";
import { createClient } from "@/lib/supabase/client";
import { useSearchParams } from "next/navigation";

const SignupForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    displayName: "",
    username: "",
    dob: "",
    lm: "",
    handicap: "",
    location: "",
  });

  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const searchParams = useSearchParams();

  const [step, setStep] = useState(() => {
    const urlStep = searchParams.get("step");
    return urlStep ? parseInt(urlStep) : 1;
  });

  const supabase = createClient();

  useEffect(() => {
    const prefillEmail = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user?.email) {
        const isGoogle = user.app_metadata?.provider === "google";
        setFormData((prev) => ({ ...prev, email: user.email! }));
        setIsGoogleUser(isGoogle);
        if (isGoogle) {
          setStep(3);
        }
      }
    };
    prefillEmail();
  }, []);

  const handleSignup = async () => {
    if (isGoogleUser) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return alert("No user found");

      const { error: dbError } = await supabase
        .from("users")
        .update({
          username: formData.username,
          launch_monitor: formData.lm,
          display_name: formData.displayName,

          location: formData.location,
          rank: "Bogey III",
        })
        .eq("id", user.id);

      if (dbError) return alert("Error saving user data: " + dbError.message);
      window.location.href = "/dashboard";
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: { emailRedirectTo: undefined },
    });

    if (error) return alert(text.auth.registerError + error.message);

    if (data.user) {
      const { error: dbError } = await supabase
        .from("users")
        .update({
          username: formData.username,
          display_name: formData.displayName,
          launch_monitor: formData.lm,
          location: formData.location,
          rank: "Bogey III",
        })
        .eq("id", data.user.id);

      if (dbError) return alert("Error saving user data: " + dbError.message);

      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
      if (loginError) return alert("Error signing in: " + loginError.message);
      window.location.href = "/dashboard";
    }
  };

  const passwordValid = {
    hasLetter: /[a-zA-Z]/.test(formData.password),
    hasNumberOrSpecial: /[0-9#?!&]/.test(formData.password),
    hasLength: formData.password.length >= 10,
  };

  const isPasswordValid = Object.values(passwordValid).every(Boolean);

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) alert(error.message);
  };

  const introStep = (
    <div className={styles.authForm}>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          setStep(2);
        }}
      >
        <h1>Sign up</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="username@domain.com"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            value={formData.email}
          />
        </div>
        <button
          type="submit"
          className={styles.nextBtn}
          disabled={!formData.email}
        >
          Next
        </button>

        <div className={styles.redirect}>
          <p>Already have an account?</p>
          <Link href="/auth/login">Log in</Link>
        </div>

        <p className={styles.divider}>
          <span>or</span>
        </p>

        <button className={styles.googleBtn} onClick={handleGoogleSignup}>
          <div className={styles.icon}>
            <FcGoogle size={20} />
          </div>
          <span>Continue with Google</span>
        </button>
      </form>
    </div>
  );

  const passwordStep = (
    <div className={styles.authForm}>
      <h2 className={styles.brand}>{text.brand}</h2>
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${(step - 1) * 50}%` }}
        ></div>
      </div>
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          setStep(3);
        }}
      >
        <div className={styles.stepHeader}>
          <FaChevronLeft
            size={20}
            className={styles.arrow}
            onClick={() => setStep(step - 1)}
            color="var(--lightgray)"
          />

          <div className={styles.text}>
            <p>Step 1 of 2</p>
            <h3>Create a password</h3>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
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
              <div
                className={`${styles.circle} ${passwordValid.hasLetter ? styles.valid : ""}`}
              ></div>
              1 letter
            </li>
            <li>
              <div
                className={`${styles.circle} ${passwordValid.hasNumberOrSpecial ? styles.valid : ""}`}
              ></div>
              1 number or special character (example: # ? ! &)
            </li>
            <li>
              <div
                className={`${styles.circle} ${passwordValid.hasLength ? styles.valid : ""}`}
              ></div>
              10 characters
            </li>
          </ul>
        </div>

        <button
          type="submit"
          className={styles.nextBtn}
          disabled={!isPasswordValid}
        >
          Next
        </button>
      </form>
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
      <form
        className={styles.form}
        onSubmit={(e) => {
          e.preventDefault();
          handleSignup();
        }}
      >
        <div className={styles.stepHeader}>
          {!isGoogleUser && (
            <FaChevronLeft
              size={20}
              className={styles.arrow}
              onClick={() => setStep(step - 1)}
            />
          )}

          <div className={styles.text}>
            <p>Step 2 of 2</p>
            <h3>Tell us about yourself</h3>
          </div>
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="displayName">Display Name</label>
          <span>This will appear on your profile</span>
          <input
            type="text"
            id="displayName"
            required
            onChange={(e) =>
              setFormData({ ...formData, displayName: e.target.value })
            }
            value={formData.displayName}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="username">Username</label>
          <span>This will appear on the leaderboard</span>
          <input
            type="text"
            id="username"
            required
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
            required
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
            required
            id="lm"
            placeholder="Square Golf"
            onChange={(e) => setFormData({ ...formData, lm: e.target.value })}
            value={formData.lm}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="location">Location</label>
          <input
            type="text"
            id="location"
            required
            placeholder="Scottsdale, AZ"
            onChange={(e) =>
              setFormData({ ...formData, location: e.target.value })
            }
            value={formData.location}
          />
        </div>

        <button
          type="submit"
          className={styles.nextBtn}
          disabled={
            !formData.username ||
            !formData.dob ||
            !formData.lm ||
            !formData.location
          }
        >
          Continue
        </button>
      </form>
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
          {!isGoogleUser && (
            <FaChevronLeft
              size={20}
              className={styles.arrow}
              onClick={() => setStep(step - 1)}
            />
          )}

          <p>Step 3 of 3</p>
          <h3>Review your information</h3>
        </div>

        <p>Email: {formData.email}</p>
        <p>Username: {formData.username}</p>
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
