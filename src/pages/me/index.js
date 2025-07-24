import { useAuth } from "@/context/AuthContext";
import { getOwnProfile } from "../../../lib/profile/profile";
import { useEffect, useState } from "react";
import AddProfileView from "@/components/Views/Profile/AddProfileView";

export default function Me() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (!user) return;
    const getMyProfile = async () => {
      const { myProfile } = await getOwnProfile(user.id);
      setProfile(myProfile);
    };

    getMyProfile();
  }, [user]);

  return !profile ? <AddProfileView user={user} /> : <div></div>;
}
