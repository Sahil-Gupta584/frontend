"use client";

export default function Home() {
  async function checkout(e) {
    const url = "https://api.polar.sh/v1/checkouts/";
    const options = {
      method: "POST",
      headers: {
        Authorization:
          "Bearer polar_oat_53v96NmQEaUnaobRhdgf5ukZi8DVYThJgeU620tlfKN",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        products: ["427b30e5-db2d-43b7-a477-a71c98fb0370"],

        success_url: "http://localhost:3000/",
        metadata: {
          datafast_visitor_id: "0da293e0-3887-4151-8601-2a390e585fd2",
          datafast_session_id: "se465ae9a-29b1-410a-bc40-68647ec8a7e0",
        },
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log(data);
      if (data.url) {
        window.location = data.url;
      }
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <button onClick={checkout}>checkout</button>
    </section>
  );
}
