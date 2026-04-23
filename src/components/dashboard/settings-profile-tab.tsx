"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Camera } from "lucide-react";
import { UpdateProfileSchema, type UpdateProfileInput } from "@/lib/validations/auth.schema";

type Props = {
  user: {
    name: string | null;
    email: string;
    bio: string | null;
    avatarUrl: string | null;
  };
};

export function ProfileTab({ user }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      name: user.name ?? "",
      email: user.email,
      bio: user.bio ?? "",
    },
  });

  async function onSubmit(_data: UpdateProfileInput) {
    setIsLoading(true);
    // TODO: connect to server action
    setTimeout(() => {
      toast.success("Perfil actualizado correctamente.");
      setIsLoading(false);
    }, 800);
  }

  const initials = user.name?.[0]?.toUpperCase() ?? "U";

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "12px",
        padding: "32px",
        display: "flex",
        gap: "40px",
        alignItems: "flex-start",
        boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
      }}
    >
      {/* Avatar */}
      <div style={{ position: "relative", flexShrink: 0 }}>
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: user.avatarUrl
              ? `url(${user.avatarUrl}) center/cover`
              : "linear-gradient(135deg, #4B7CF3, #6366F1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "32px",
            fontWeight: 700,
            color: "white",
          }}
        >
          {!user.avatarUrl && initials}
        </div>
        <button
          id="settings-avatar-upload"
          style={{
            position: "absolute", bottom: 0, right: 0,
            width: "28px", height: "28px", borderRadius: "50%",
            background: "#1a1a2e", border: "2px solid #fff",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <Camera size={13} color="white" />
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}
      >
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            Name
          </label>
          <input
            id="settings-name"
            {...register("name")}
            className="input-base"
            placeholder="Tu nombre"
            style={{ borderColor: errors.name ? "#ef4444" : undefined }}
          />
          {errors.name && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.name.message}</p>}
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            Email
          </label>
          <input
            id="settings-email"
            {...register("email")}
            type="email"
            className="input-base"
            style={{ borderColor: errors.email ? "#ef4444" : undefined }}
          />
          {errors.email && <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#ef4444" }}>{errors.email.message}</p>}
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: 500, color: "#374151", marginBottom: "6px" }}>
            Bio
          </label>
          <textarea
            id="settings-bio"
            {...register("bio")}
            rows={4}
            placeholder="Passionate about sharing links."
            style={{
              width: "100%", padding: "10px 14px",
              border: "1px solid #e2e8f0", borderRadius: "8px",
              fontSize: "14px", color: "#1a1a2e", background: "#fff",
              resize: "vertical", fontFamily: "inherit",
              outline: "none", transition: "border-color 0.15s",
            }}
          />
        </div>

        <div>
          <button
            id="settings-save-btn"
            type="submit"
            className="btn-primary"
            disabled={isLoading}
            style={{ padding: "11px 28px" }}
          >
            {isLoading ? "Guardando..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
