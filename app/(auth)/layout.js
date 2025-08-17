const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 py-24">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
};

export default AuthLayout;
