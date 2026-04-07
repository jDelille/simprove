"use client";

import { useState } from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import styles from "./Form.module.scss";
import { createClient } from "@/lib/supabase/client";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [authError, setAuthError] = useState<string | null>(null);

  const supabase = createClient();

  const handleLogin = async () => {
    const { email, password } = formData;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthError(error.message);
    } else {
      redirect("/dashboard");
    }
  };

  const handleGoogleSignup = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setAuthError(error.message);
    }
  };

  return (
    <div className={styles.authForm}>
      <div className={styles.form}>
        <h1>Sign in</h1>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            required
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            value={formData.email}
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            required
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            value={formData.password}
          />
        </div>

        {authError && (
          <div className={styles.error}>
            <p>{authError}</p>
          </div>
        )}

        <button
          onClick={handleLogin}
          className={styles.nextBtn}
          disabled={!formData.email || !formData.password}
        >
          Continue
        </button>
        <div className={styles.redirect}>
          <p>Don't have an account?</p>
          <Link href="/auth/signup">Sign up</Link>
        </div>
        <p className={styles.divider}>
          <span>or</span>
        </p>
        <button className={styles.demoBtn}>Login with Demo Account</button>

        <button className={styles.googleBtn} onClick={handleGoogleSignup}>
          <div className={styles.icon}>
            <FcGoogle size={20} />
          </div>
          <span>Continue with Google</span>
        </button>
        {/* 
        
         */}
        {/* <p>or</p>
        <button className={styles.googleBtn}>
          <div className={styles.icon}>
            <FcGoogle size={20} />
          </div>
          <span>Continue with Google</span>
        </button>
        <button className={styles.appleBtn}>
          <div className={styles.icon}>
            <FaApple size={20} />
          </div>
          <span>Continue with Apple</span>
        </button> */}
      </div>
    </div>
  );
};

export default LoginForm;
