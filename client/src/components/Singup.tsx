import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:3000";

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [Loading, setLoading] = useState<boolean>(false);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const nameRegex = /^[A-Za-z]+$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = { name: "", email: "", password: "", confirmPassword: "" };

    if (!isLogin && !nameRegex.test(formData.name)) {
      newErrors.name = "Name must contain only characters";
      valid = false;
    }

    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      valid = false;
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);

      if (!isLogin) {
        try {
          console.log(formData, "dorm data");
          const response = await axios.post(`${API_URL}/signup`, formData,{withCredentials: true});
          console.log(response.data, "User Data:", formData);

          if (response.data == 200) {
            toast.success("Signup success");
            setIsLogin(true);
          }
        } catch (error) {
          setLoading(false);
          toast.error("Signup failed");

          console.log("error while submitting form", error);
        }
      } else {
        const data: { email: string; password: string } = {
          email: formData.email,
          password: formData.password,
        };
        try {
          const response = await axios.post("/login", data);
          if (response.data.success) {
            toast.success("Login succesfull");
            navigate("/");
          }
        } catch (error) {
          setLoading(false);
          toast.error("Invalid email or password");
          console.log("error while login ", error);
        }
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
    setErrors({ name: "", email: "", password: "", confirmPassword: "" });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isLogin ? "Login" : "Sign Up"}
        </h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && (
            <div>
              <input
                type="text"
                placeholder="Name"
                name="name"
                className="w-full h-10 p-2"
                onChange={handleChange}
                value={formData.name}
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
          )}
          <div>
            <input
              name="email"
              type="text"
              placeholder="Email"
              className="w-full h-10 p-2"
              onChange={handleChange}
              value={formData.email}
            />
            {errors.email && <p className="text-red-500">{errors.email}</p>}
          </div>
          <div>
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="w-full h-10 p-2"
              onChange={handleChange}
              value={formData.password}
            />
            {errors.password && (
              <p className="text-red-500">{errors.password}</p>
            )}
          </div>
          {!isLogin && (
            <div>
              <input
                type="password"
                placeholder="Confirm password"
                name="confirmPassword"
                className="w-full h-10 p-2"
                onChange={handleChange}
                value={formData.confirmPassword}
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          )}

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-700 text-white font-bold py-2 px-4 border rounded"
              disabled={
                isLogin ? false : formData.password !== formData.confirmPassword
              }
            >
              {isLogin ? "Login" : "Signup"}
            </button>
          </div>
          <br />
        </form>
        <a
          onClick={toggleMode}
          className="block text-center hover:underline cursor-pointer"
        >
          {!isLogin
            ? "Already have an account? Login"
            : "Don't have an account? Signup"}
        </a>
      </div>
    </div>
  );
};

export default SignUp;
