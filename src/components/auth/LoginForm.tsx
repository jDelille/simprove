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

  const supabase = createClient();

  const handleLogin = async () => {
    const { email, password } = formData;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Error logging in: " + error.message);
    } else {
      redirect("/dashboard");
    }
  };

  return (
    <div className={styles.authForm}>
      <h1>Welcome back</h1>
      <div className={styles.form}>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email or username</label>
          <input
            type="email"
            id="email"
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
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            value={formData.password}
          />
        </div>

        <button onClick={handleLogin} className={styles.nextBtn}>
          Log in
        </button>
        <p>or</p>
        <button>Login with Demo Account</button>
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
        <div className={styles.redirect}>
          <p>Don't have an account?</p>
          <Link href="/auth/signup">Sign up</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
