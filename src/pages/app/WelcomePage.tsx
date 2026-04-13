import { useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import { WelcomeHero } from "@/components/dashboard/WelcomeHero";
import { useEffect } from "react";

const WelcomePage = () => {
  const { user, profile, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const handleEnterDashboard = () => {
    if (!profile) {
      navigate("/app/dashboard");
      return;
    }

    const allowedViews = profile.allowed_views || [];
    
    // Attempt to go to dashboard if allowed, otherwise first view
    if (allowedViews.includes("/app/dashboard")) {
      navigate("/app/dashboard");
    } else if (allowedViews.length > 0) {
      navigate(allowedViews[0]);
    } else {
      navigate("/app/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <WelcomeHero 
        email={user?.email || ""} 
        onDismiss={handleEnterDashboard}
      />
    </div>
  );
};

export default WelcomePage;
