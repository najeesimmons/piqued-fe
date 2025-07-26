import Navigation from "@/components/Navigation/Navigation";
import { getOwnProfile } from "../../../lib/profile/profile";
import { supabase } from "../../../lib/supabase/supabase";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Me() {
  const { user, isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [profileForm, setProfileForm] = useState({});
  const [submitStatus, setSubmitStatus] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !user) {
      router.push("/");
    }
  }, [isAuthLoading, user, router]);

  useEffect(() => {
    if (!isAuthLoading && user) {
      const getMyProfile = async () => {
        setIsLoading(true);
        const result = await getOwnProfile(user.id);
        if (!result) {
          setIsError(true);
        } else {
          setProfileForm(result);
        }
        setIsLoading(false);
      };

      getMyProfile();
    }
  }, [isAuthLoading, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus("loading");

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase
      .from("profiles")
      .update(profileForm)
      .eq("id", user.id);

    if (error) {
      setSubmitStatus("error");
    } else {
      setSubmitStatus("success");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isError) return <div>Error</div>;
  if (isLoading || isAuthLoading) return <div>Loading</div>;
  return (
    <>
      <Navigation />
      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-md mx-auto mt-16"
      >
        <div>
          <label className="block">first name</label>
          <input
            className="w-full h-8 border"
            name="first_name"
            value={profileForm?.first_name}
            onChange={handleChange}
            style={{ textIndent: "8px" }}
          />
        </div>
        <div>
          <label className="block">last name</label>
          <input
            className="w-full h-8 border"
            name="last_name"
            value={profileForm?.last_name}
            onChange={handleChange}
            style={{ textIndent: "8px" }}
          />
        </div>
        <div>
          <label className="block">username</label>
          <input
            className="w-full h-8 border"
            name="username"
            value={profileForm?.username}
            onChange={handleChange}
            style={{ textIndent: "8px" }}
          />
        </div>
        <button
          type="submit"
          className="bg-black font-semibold !mt-6 mx-auto p-2 text-white w-full"
        >
          Update Profile
        </button>

        {submitStatus === "success" && (
          <p className="text-green-500">Profile updated!</p>
        )}
        {submitStatus === "error" && (
          <p className="text-red-500">Something went wrong.</p>
        )}
      </form>
    </>
  );
}
