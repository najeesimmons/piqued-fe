import { useAuth } from "@/context/AuthContext";
import { getOwnProfile } from "../../../lib/profile/profile";
import { useEffect, useState } from "react";
import AddProfileView from "@/components/Views/Profile/AddProfileView";
import Navigation from "@/components/Navigation/Navigation";

export default function Me() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;
    const getMyProfile = async () => {
      const profile = await getOwnProfile(user.id);
      setProfile(profile);
    };

    getMyProfile();
  }, [user]);

  return (
    <>
      <Navigation />
      {!profile ? (
        <AddProfileView user={user} setProfile={setProfile} />
      ) : (
        <div>You have profile.</div>
      )}
    </>
  );
}
