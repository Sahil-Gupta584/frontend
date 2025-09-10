import AuthCard from "./components/authCard";
export default function Auth() {
  return (
    <section className="min-h-screen flex items-center justify-center ">
      <AuthCard />
    </section>
  );
}

export const metadata = {
  title: "Login to Insightly",
};
