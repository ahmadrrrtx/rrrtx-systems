type LeadNotification = {
  subject: string;
  lines: Array<[string, string]>;
};

export async function sendLeadNotification(notification: LeadNotification) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !to || !from) return { sent: false, reason: "not_configured" as const };

  const text = notification.lines.map(([label, value]) => `${label}: ${value}`).join("\n");
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], subject: notification.subject, text }),
      cache: "no-store",
    });
    if (!response.ok) {
      console.error("Lead notification failed", response.status, await response.text());
      return { sent: false, reason: "provider_error" as const };
    }
    return { sent: true as const };
  } catch (error) {
    console.error("Lead notification failed", error);
    return { sent: false, reason: "network_error" as const };
  }
}
