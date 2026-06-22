import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/useSEO";

const Privacy = () => {
  useSEO({
    title: "Privacy Policy | Aspiria",
    description: "How Aspiria collects, uses, and protects your personal information.",
    canonical: "https://aspiria.com/privacy",
  });

  return (
    <Layout>
      <section className="container mx-auto px-4 py-20 max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-3">Privacy Policy</h1>
        <p className="text-muted-foreground mb-10">Last updated: {new Date().toLocaleDateString()}</p>

        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">1. Information we collect</h2>
            <p>When you contact Aspiria or subscribe to our newsletter, we collect the information you submit (name, email, phone, message).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">2. How we use it</h2>
            <p>We use your information solely to respond to your inquiry, deliver requested services, and send updates if you've opted in.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">3. Data sharing</h2>
            <p>We do not sell or rent your personal data. We may share information with trusted service providers strictly to deliver our services.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">4. Security</h2>
            <p>Your data is stored on secure infrastructure with industry-standard protections. Access is restricted to authorized team members.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">5. Your rights</h2>
            <p>You may request access, correction, or deletion of your data at any time by emailing hello@aspiria.com.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground mb-2">6. Contact</h2>
            <p>Questions? Reach us at hello@aspiria.com or +91 79845 73238.</p>
          </section>
        </div>
      </section>
    </Layout>
  );
};

export default Privacy;
