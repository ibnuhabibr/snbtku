import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { useAuthStore } from "@/stores/authStore";
import { resetPassword } from "@/lib/firebase";

// Skema validasi untuk form reset password
const forgotPasswordSchema = z.object({
  email: z.string().email({
    message: "Email tidak valid",
  }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Inisialisasi form dengan react-hook-form dan zod validator
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Handler untuk reset password
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await resetPassword(data.email);
      setSuccess(true);
      toast({
        title: "Email terkirim",
        description: "Silakan periksa email Anda untuk instruksi reset password",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      // Menangani berbagai jenis error dari Firebase
      if (error.code === "auth/user-not-found") {
        setError("Email tidak terdaftar");
      } else if (error.code === "auth/invalid-email") {
        setError("Format email tidak valid");
      } else if (error.code === "auth/too-many-requests") {
        setError("Terlalu banyak permintaan. Silakan coba lagi nanti");
      } else {
        setError("Terjadi kesalahan saat mengirim email reset. Silakan coba lagi");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Lupa Password</CardTitle>
          <CardDescription className="text-center">
            Masukkan email Anda untuk menerima instruksi reset password
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-4 bg-green-50 text-green-800 border-green-200">
              <AlertDescription>
                Email reset password telah dikirim. Silakan periksa kotak masuk atau folder spam Anda.
              </AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="nama@email.com" 
                        type="email" 
                        disabled={isLoading} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Kirim Instruksi Reset"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full space-y-2">
            <div>
              <Link to="/login" className="text-primary hover:underline">
                Kembali ke halaman login
              </Link>
            </div>
            <div>
              Belum punya akun?{" "}
              <Link to="/register" className="text-primary hover:underline">
                Daftar sekarang
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ForgotPassword;