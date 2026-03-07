import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM =
  process.env.RESEND_FROM ?? "Alan Carwash <onboarding@resend.dev>";

function formatAppointmentDate(isoDate: string): string {
  const d = new Date(isoDate);
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return d.toLocaleDateString("es-ES", options);
}

export function getConfirmacionCitaHtml(params: {
  nombreCliente: string;
  fechaHora: string;
  marca: string;
  modelo: string;
  placa: string;
}): string {
  const { nombreCliente, fechaHora, marca, modelo, placa } = params;
  const blue = "#2563eb";

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de cita - Alan Carwash</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #ffffff; color: #1f2937;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 560px; margin: 0 auto; background-color: #ffffff;">
    <tr>
      <td style="padding: 32px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: ${blue}; border-radius: 8px; margin-bottom: 24px;">
          <tr>
            <td style="padding: 20px 24px;">
              <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
                Alan Carwash
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 14px; color: rgba(255,255,255,0.9);">
                Confirmación de tu cita
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 0 0 20px 0; font-size: 16px; line-height: 1.6; color: #374151;">
          Hola <strong>${nombreCliente}</strong>,
        </p>
        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #374151;">
          Tu cita ha quedado confirmada. Aquí tienes los detalles:
        </p>

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 24px;">
          <tr>
            <td style="padding: 20px 24px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${blue};">
                Fecha y hora
              </p>
              <p style="margin: 0; font-size: 16px; font-weight: 500; color: #1f2937;">
                ${fechaHora}
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 0 24px 20px 24px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${blue};">
                Vehículo
              </p>
              <p style="margin: 0; font-size: 16px; color: #1f2937;">
                <strong>Marca:</strong> ${marca}<br>
                <strong>Modelo:</strong> ${modelo}<br>
                <strong>Placa:</strong> ${placa}
              </p>
            </td>
          </tr>
        </table>

        <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #eff6ff; border-radius: 8px; border-left: 4px solid ${blue}; margin-bottom: 24px;">
          <tr>
            <td style="padding: 16px 20px;">
              <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #1e40af;">
                <strong>Importante:</strong> El pago se realiza <strong>en efectivo o con tarjeta</strong> al recoger tu vehículo en Alan Carwash. No es necesario pagar por adelantado.
              </p>
            </td>
          </tr>
        </table>

        <p style="margin: 0 0 8px 0; font-size: 16px; line-height: 1.6; color: #374151;">
          Te esperamos. Si necesitas cambiar o cancelar la cita, contáctanos.
        </p>
        <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #374151;">
          Un saludo,
        </p>
        <p style="margin: 8px 0 0 0; font-size: 16px; font-weight: 600; color: ${blue};">
          El equipo de Alan Carwash
        </p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

export type EnvioConfirmacionParams = {
  to: string;
  nombreCliente: string;
  fechaHoraIso: string;
  marca: string;
  modelo: string;
  placa: string;
};

export async function enviarConfirmacionCita(
  params: EnvioConfirmacionParams
): Promise<{ ok: boolean; error?: string }> {
  if (!process.env.RESEND_API_KEY) {
    return { ok: false, error: "RESEND_API_KEY no configurada" };
  }

  const fechaHoraFormateada = formatAppointmentDate(params.fechaHoraIso);

  const html = getConfirmacionCitaHtml({
    nombreCliente: params.nombreCliente,
    fechaHora: fechaHoraFormateada,
    marca: params.marca,
    modelo: params.modelo,
    placa: params.placa,
  });

  const subject = `Confirmación de tu cita en Alan Carwash - ${fechaHoraFormateada}`;

  const { error } = await resend.emails.send({
    from: FROM,
    to: params.to,
    subject,
    html,
  });

  if (error) {
    return { ok: false, error: error.message };
  }
  return { ok: true };
}
