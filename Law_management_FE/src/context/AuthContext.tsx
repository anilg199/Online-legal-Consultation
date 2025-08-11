import React, { createContext, useContext, useState, useEffect } from "react";

// The User interface seems to be missing some fields from your Profile page
// Consider updating it to be more comprehensive
interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean; // 👈 1. Add loading state to the type
  setUser: (user: User | null) => void; // 👈 2. Expose setUser for profile updates
  register: (data: any) => Promise<User>;
  login: (email: string, password: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 👈 3. Initialize loading as true

  // Load user from sessionStorage on initial render
  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from sessionStorage", error);
      setUser(null); // Clear corrupted data
    } finally {
      setLoading(false); // 👈 4. Set loading to false after checking
    }
  }, []);

  const register = async (formData: any): Promise<User> => {
    const response = await fetch("http://localhost:8080/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Registration failed");
    }

    const data = await response.json();
    return data.user;
  };

  const login = async (
    email: string,
    password: string,
    role: string
  ): Promise<void> => {
    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, role }), // Include role if your backend uses it
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Login failed");
    }

    const data = await response.json();
    setUser(data.user);
    sessionStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  const value = {
    user,
    loading, // 👈 5. Provide loading state
    setUser, // 👈 6. Provide setUser function
    register,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
