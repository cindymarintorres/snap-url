type ResetPasswordEmailProps = {
  userName: string;
  resetUrl: string;
};

export function resetPasswordTemplate({
  userName,
  resetUrl,
}: ResetPasswordEmailProps): string {
  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Restablecer contraseña - SnapURL</title>
</head>
<body style="margin:0;padding:0;background:#f4f5f7;font-family:Inter,system-ui,sans-serif;">
  <div style="max-width:560px;margin:40px auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#4B7CF3,#6366F1);padding:32px 40px;text-align:center;">
      <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">SnapURL</h1>
    </div>
    <!-- Body -->
    <div style="padding:40px;">
      <h2 style="margin:0 0 8px;color:#1a1a2e;font-size:20px;font-weight:600;">Restablecer contraseña</h2>
      <p style="margin:0 0 24px;color:#6b7280;font-size:15px;line-height:1.6;">
        Hola <strong>${userName}</strong>, recibimos una solicitud para restablecer tu contraseña. Haz clic en el botón para continuar:
      </p>
      <div style="text-align:center;margin:32px 0;">
        <a href="${resetUrl}" style="background:linear-gradient(135deg,#4B7CF3,#6366F1);color:#ffffff;padding:14px 32px;border-radius:8px;text-decoration:none;font-size:15px;font-weight:600;display:inline-block;">
          Restablecer contraseña
        </a>
      </div>
      <p style="margin:0 0 8px;color:#6b7280;font-size:13px;line-height:1.6;">
        Este enlace expirará en <strong>1 hora</strong>. Si no solicitaste este cambio, ignora este email.
      </p>
      <p style="margin:0;color:#9ca3af;font-size:12px;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:<br>
        <a href="${resetUrl}" style="color:#4B7CF3;word-break:break-all;">${resetUrl}</a>
      </p>
    </div>
    <!-- Footer -->
    <div style="padding:24px 40px;border-top:1px solid #f0f0f0;text-align:center;">
      <p style="margin:0;color:#9ca3af;font-size:12px;">© 2024 SnapURL. Todos los derechos reservados.</p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
