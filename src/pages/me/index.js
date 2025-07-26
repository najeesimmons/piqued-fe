export async function getServerSideProps() {
  return {
    redirect: {
      destination: "/profile",
      permanent: false, // or true if this is a permanent mapping
    },
  };
}

export default function MeRedirect() {
  return null;
}
