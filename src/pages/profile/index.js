import Link from "next/link";
import Navigation from "@/components/Navigation/Navigation";
import Section from "@/components/Section/Section";
import { getOwnProfile, updateOwnProfile } from "../../../lib/profile/profile";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Me() {
  const { user, isAuthLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState();
  const [isUpdateError, setIsUpdateError] = useState(false);
  const [profileForm, setProfileForm] = useState({});

  useEffect(() => {
    if (!isAuthLoading && user) {
      setIsLoading(true);
      const getMyProfile = async () => {
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
    setIsUpdateError(false);
    setIsUpdateSuccess(false);

    const result = await updateOwnProfile(profileForm, user.id);

    if (!result) {
      setIsUpdateError(true);
    } else {
      setProfileForm(result);
      setIsUpdateSuccess(true);
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
      {user ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 max-w-md mx-auto mt-16"
        >
          <div>
            <label className="block" style={{ textIndent: "8px" }}>
              first name
            </label>
            <input
              className="w-full h-8 border"
              name="first_name"
              value={profileForm?.first_name}
              onChange={handleChange}
              style={{ textIndent: "8px" }}
              disabled={user && user.email === "piquedguest@gmail.com"}
            />
          </div>
          <div>
            <label className="block" style={{ textIndent: "8px" }}>
              last name
            </label>
            <input
              className="w-full h-8 border"
              name="last_name"
              value={profileForm?.last_name}
              onChange={handleChange}
              style={{ textIndent: "8px" }}
              disabled={user && user.email === "piquedguest@gmail.com"}
            />
          </div>
          <div>
            <label className="block" style={{ textIndent: "8px" }}>
              username
            </label>
            <input
              className="w-full h-8 border"
              name="username"
              value={profileForm?.username}
              onChange={handleChange}
              style={{ textIndent: "8px" }}
              disabled={user && user.email === "piquedguest@gmail.com"}
            />
          </div>
          {isUpdateError && (
            <p className="mt-3 text-red-500 font-center">
              There was an error updating your profile. Please try again.
            </p>
          )}
          {isUpdateSuccess && (
            <p className="mt-3 text-green-500 font-center">
              Your profile was successfully updated.
            </p>
          )}
          <button
            type="submit"
            className="bg-black font-semibold !mt-6 mx-auto p-2 text-white w-full"
          >
            Update Profile
          </button>
        </form>
      ) : (
        <Section>
          <p className="text-center mt-32">
            Already a member?{" "}
            <Link className="font-semibold" href="/login">
              Log in
            </Link>{" "}
            to create your profile. New here?{" "}
            <Link className="font-semibold" href="/signup">
              Sign up
            </Link>{" "}
            to get started!
          </p>
        </Section>
      )}
    </>
  );
}
