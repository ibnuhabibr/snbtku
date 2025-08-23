import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { authService } from "@/services/authService";
import { signInWithGoogle } from "@/lib/firebase";

// Skema validasi untuk form registrasi
const registerSchema = z.object({
  name: z.string().min(2, {
    message: "Nama minimal 2 karakter",
  }),
  email: z.string().email({
    message: "Email tidak valid",
  }),
  password: z.string().min(6, {
    message: "Password minimal 6 karakter",
  }),
  confirmPassword: z.string().min(6, {
    message: "Konfirmasi password minimal 6 karakter",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password dan konfirmasi password tidak sama",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, error, login } = useAuthStore();

  // Redirect to dashboard if user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      // Add small delay to ensure state is properly hydrated
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    }
  }, [isAuthenticated, navigate]);

  // Inisialisasi form dengan react-hook-form dan zod validator
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handler untuk registrasi dengan email dan password
  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await authService.register({
        name: data.name,
        email: data.email,
        password: data.password
      });
      
      toast({
        title: "Registrasi berhasil",
        description: "Selamat datang! Akun Anda telah berhasil dibuat.",
      });
      
      // useEffect akan otomatis redirect ke dashboard ketika isAuthenticated berubah
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registrasi gagal",
        description: "Terjadi kesalahan saat registrasi. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  // Handler untuk registrasi dengan Google
  const handleGoogleSignIn = async () => {
    try {
      console.log('Starting Google sign-in...');
      const result = await signInWithGoogle();
      const firebaseUser = result.user;
      console.log('Firebase user:', firebaseUser);
      
      const requestData = {
        email: firebaseUser.email || '',
        name: firebaseUser.displayName || 'User',
        firebaseUid: firebaseUser.uid
      };
      console.log('Sending request data:', requestData);
      
      // Kirim data ke backend menggunakan endpoint Google OAuth
      const response = await fetch('http://localhost:5000/api/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Backend error response:', errorData);
        throw new Error(errorData.error || 'Google authentication failed');
      }

      const data = await response.json();
      console.log('Backend success response:', data);
      
      // Update auth store
      login(data.user, data.token);
      
      toast({
        title: data.isNewUser ? "Registrasi berhasil" : "Login berhasil",
        description: `Selamat datang, ${firebaseUser.displayName}!`,
      });
      
      // useEffect akan otomatis redirect ke dashboard ketika isAuthenticated berubah
    } catch (error: any) {
      console.error("Google sign-in error:", error);
      console.error("Error stack:", error.stack);
      toast({
        title: "Registrasi gagal",
        description: `Terjadi kesalahan: ${error.message}`,
        variant: "destructive",
      });
    }
  };





  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
        <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Daftar Akun</CardTitle>
          <CardDescription className="text-center">
            Buat akun baru untuk mengakses semua fitur SNBTKU
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Nama lengkap" 
                        disabled={isLoading} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="******" 
                        type="password" 
                        disabled={isLoading} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Konfirmasi Password</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="******" 
                        type="password" 
                        disabled={isLoading} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Memproses..." : "Daftar"}
              </Button>
            </form>
          </Form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Atau</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Daftar dengan Google
          </Button>

        </CardContent>
        <CardFooter>
          <div className="text-center text-sm w-full">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Login sekarang
            </Link>
          </div>
        </CardFooter>
        </Card>
    </div>
  );
};

export default Register;