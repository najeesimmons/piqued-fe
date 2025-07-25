import Navigation from "@/components/Navigation/Navigation";
import { getOwnProfile } from "../../../lib/profile/profile";
import { supabase } from "../../../lib/supabase/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Me() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [profileFormData, setProfileFormData] = useState(null);
  const [submitStatus, setSubmitStatus] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/");
  }, [user, router]);

  useEffect(() => {
    const getMyProfile = async () => {
      setIsLoading(true);
      const profile = await getOwnProfile(user?.id);
      if (!profile) {
        setIsError(true);
      } else {
        setProfileFormData(profile);
      }
      setIsLoading(false);
    };

    getMyProfile();
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update(profileFormData)
      .eq("id", user.id);

    if (error) {
      setSubmitStatus("error");
    } else {
      setSubmitStatus("success");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <Navigation />
      {isError && <div>Error Loading Profile</div>}
      {isLoading && <div>Loading Profile</div>}
      {!isLoading && !isError && (
        <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
          <div>
            <label>First Name</label>
            <input
              name="first_name"
              value={profileFormData?.first_name}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label>Last Name</label>
            <input
              name="last_name"
              value={profileFormData?.last_name}
              onChange={handleChange}
              className="input"
            />
          </div>
          <div>
            <label>Username</label>
            <input
              name="username"
              value={profileFormData?.username}
              onChange={handleChange}
              className="input"
            />
          </div>
          <button type="submit" className="btn">
            Update Profile
          </button>

          {submitStatus === "success" && (
            <p className="text-green-500">Profile updated!</p>
          )}
          {submitStatus === "error" && (
            <p className="text-red-500">Something went wrong.</p>
          )}
        </form>
      )}
    </>
  );
}
