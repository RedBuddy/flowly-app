"use client";
import { Wallet, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/schemas/auth";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import Link from "next/link";
import { signInAction } from "@/actions/auth/sign-in.action";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginFormData> = (data) => {
    startTransition(async () => {
      try {
        const response = await signInAction(data);

        if (!response.ok) {
          setError("root", { message: response.error });
          return;
        }

        router.push("/");
      } catch (error) {
        console.error("Login error:", error);
        setError("root", { message: "Error inesperado al iniciar sesión" });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-md  flex items-center gap-3">
            <Wallet className="w-8 h-8 text-accent-foreground" />
            <h1 className="text-2xl font-bold">Flowly</h1>
          </div>
          <p className="text-muted-foreground mt-1">Inicia sesión en tu cuenta</p>
        </div>

        {/* Card */}
        <div className="bg-card text-card-foreground rounded-xl shadow-lg border border-border/50 p-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input {...register("email")} type="text" placeholder="tu@correo.com" className="pl-10" />
              </div>
              {errors.email && <div className="text-destructive text-sm">{errors.email.message}</div>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <div className="text-destructive text-sm">{errors.password.message}</div>}
            </div>

            <Button type="submit" className="w-full rounded-md" disabled={isPending}>
              {isPending ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
            {errors.root && <div className="text-destructive text-sm">{errors.root.message}</div>}
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/register" type="button" className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              ¿No tienes cuenta?
              <span className="font-semibold text-primary"> Regístrate</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
