import ErrorView from "@/components/Views/ErrorView";
import LoginOrSignupModal from "@/components/Modals/LoginOrSignupModal";
import Navigation from "@/components/Navigation/Navigation";
import Section from "@/components/Section/Section";
import { getOwnProfile, updateOwnProfile } from "../../../lib/profile/profile";
import { HiOutlineUser } from "react-icons/hi2";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

export default function Me() {
  const [profileForm, setProfileForm] = useState({});
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdateError, setIsUpdateError] = useState(false);
  const [isUpdateSuccess, setIsUpdateSuccess] = useState();
  const [isShowAuthCta, setIsShowAuthCta] = useState(false);

  const { user, isAuthLoading } = useAuth();

  const guestEmail = "piquedguest@gmail.com";

  useEffect(() => {
    if (!isAuthLoading && user) {
      setIsError(false);
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

  if (isError) return <ErrorView entity={"profile"} retry={getMyProfile} />;
  if (isLoading || isAuthLoading) return <div>Loading...</div>;
  return (
    <>
      <Navigation setIsShowAuthCta={setIsShowAuthCta} />
      {user ? (
        <Section>
          <div
            className="flex h-screen items-center justify-center overflow-y-auto"
            style={{ height: "calc(100vh - 50px)" }}
          >
            <div className="flex flex-col bg-gray-200 p-6 w-3/4 text-black">
              <h1 className="font-bold text-center text-2xl flex items-center justify-center gap-2">
                <HiOutlineUser size={25} />
                profile
              </h1>
              {user.email === guestEmail ? (
                <p className="mt-3 text-red-500 text-center">
                  Guest profiles may not be edited.
                </p>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="mt-0 mx-auto space-y-2 w-3/4 md:w-1/2"
                >
                  <div className="text-base md:text-sm mt-4">
                    <label className="block text-sm">first name</label>
                    <input
                      className="w-full h-10 border"
                      name="first_name"
                      value={profileForm?.first_name}
                      onChange={handleChange}
                      style={{ textIndent: "8px" }}
                    />
                  </div>
                  <div className="text-base md:text-sm">
                    <label className="block text-sm">last name</label>
                    <input
                      className="w-full h-10 border"
                      name="last_name"
                      value={profileForm?.last_name}
                      onChange={handleChange}
                      style={{ textIndent: "8px" }}
                    />
                  </div>
                  <div className="text-base md:text-sm">
                    <label className="block text-sm">username</label>
                    <input
                      className="w-full h-10 border mb-4"
                      name="username"
                      value={profileForm?.username}
                      onChange={handleChange}
                      style={{ textIndent: "8px" }}
                    />
                  </div>
                  {isUpdateError && (
                    <p className="mt-3 text-red-500 font-center">
                      There was an error updating your profile. Please try
                      again.
                    </p>
                  )}
                  {isUpdateSuccess && (
                    <p className="mt-3 text-green-500 font-center">
                      Your profile was successfully updated.
                    </p>
                  )}
                  <button
                    type="submit"
                    className="bg-black font-semibold mx-auto p-2 text-white w-full"
                  >
                    Update Profile
                  </button>
                </form>
              )}
            </div>
          </div>
        </Section>
      ) : (
        <Section>
          <p className="text-center mt-32">
            Please{" "}
            <button
              className="font-semibold"
              onClick={() => setIsShowAuthCta(true)}
            >
              login or signup
            </button>{" "}
            to create or update your profile.
          </p>
        </Section>
      )}
      {isShowAuthCta && (
        <LoginOrSignupModal setIsShowAuthCta={setIsShowAuthCta} />
      )}
    </>
  );
}
