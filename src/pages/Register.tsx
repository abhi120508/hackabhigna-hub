import { RegistrationForm } from "@/components/RegistrationForm";

const Register = () => {
  return (
    <div className="min-h-screen pt-16">
      <div className="py-20 px-4 bg-muted/20">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            <span className="text-gradient">Register Your Team</span>
          </h1>
          <p className="text-xl text-muted-foreground">
            Join HackAbhigna and showcase your innovation
          </p>
        </div>
        <RegistrationForm />
      </div>
    </div>
  );
};

export default Register;
