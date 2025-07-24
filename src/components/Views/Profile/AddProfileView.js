import { useState } from "react";
import { insertProfile } from "../../../../lib/profile/profile";

export default function AddProfileView({ user }) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    const { data, error } = await insertProfile(
      firstName,
      lastName,
      username,
      user.id
    );

    if (error) {
      console.log("insert profile didn't work");
    } else {
      console.log("profile worked");
    }
  };

  return (
    <form className="mt-2 mx-auto space-y-2 w-3/4" onSubmit={handleSubmit}>
      <label className="block">first name</label>
      <input className="w-full h-8 border" placeholder="first name" />

      <label className="block">last name</label>
      <input className="w-full h-8 border" placeholder="last name" />

      <label className="block">username</label>
      <input className="w-full h-8 border" placeholder="username" required />

      <button
        className="bg-black font-semibold !mt-6 mx-auto p-2 text-white w-full"
        type="submit"
      >
        submit
      </button>
    </form>
  );
}
