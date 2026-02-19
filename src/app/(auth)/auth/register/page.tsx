"use client";
import { Wallet, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormData, registerSchema } from "@/schemas/auth";
import { useState, useTransition } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { signUpAction } from "@/actions/auth/sign-up.action";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormData>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit: SubmitHandler<RegisterFormData> = async (data) => {
    startTransition(async () => {
      try {
        const response = await signUpAction(data);

        if (!response.ok) {
          // Mostrar error en email si es duplicado, sino en root
          if (response.error.includes("correo")) {
            setError("email", { message: response.error });
          } else {
            setError("root", { message: response.error });
          }
          return;
        }

        // Redireccionar solo si el registro fue exitoso
        router.push("/");
      } catch (error) {
        console.error("Register error:", error);
        setError("root", { message: "Error inesperado al registrarse" });
      }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 rounded-2xl  flex items-center gap-3">
            <Wallet className="w-8 h-8 text-accent-foreground" />
            <h1 className="text-2xl font-bold">Flowly</h1>
          </div>
          <p className="text-muted-foreground mt-1">Crea tu cuenta</p>
        </div>

        {/* Card */}
        <div className="bg-card text-card-foreground rounded-xl shadow-lg border border-border/50 p-6">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nombre completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input {...register("name")} placeholder="Tu nombre" className="pl-10" />
              </div>
              {errors.name && <div className="text-destructive text-sm">{errors.name.message}</div>}
            </div>

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

            <div className="space-y-2">
              <Label htmlFor="passwordConfirm">Confirmar contraseña</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input {...register("passwordConfirm")} type={showPasswordConfirm ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10" />
                <button type="button" onClick={() => setShowPasswordConfirm(!showPasswordConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                  {showPasswordConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.passwordConfirm && <div className="text-destructive text-sm">{errors.passwordConfirm.message}</div>}
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creando cuenta..." : "Crear cuenta"}
            </Button>
            {errors.root && <div className="text-destructive text-sm">{errors.root.message}</div>}
          </form>

          <div className="mt-6 text-center">
            <Link href="/auth/login" type="button" className="text-sm text-muted-foreground hover:text-primary transition-colors cursor-pointer">
              ¿Ya tienes cuenta?
              <span className="font-semibold text-primary"> Inicia sesión</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
