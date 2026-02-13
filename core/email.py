"""Email sending module for Sivee.pro."""

import logging
import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

logger = logging.getLogger(__name__)

SMTP_HOST = os.environ.get("SMTP_HOST", "")
SMTP_PORT = int(os.environ.get("SMTP_PORT", "465"))
SMTP_USER = os.environ.get("SMTP_USER", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM = os.environ.get("SMTP_FROM", "")


def send_email(to: str, subject: str, html_body: str, text_body: str) -> None:
    """Send an email via SMTP_SSL.

    If SMTP is not configured, logs a warning and returns silently.
    """
    if not all([SMTP_HOST, SMTP_USER, SMTP_PASSWORD, SMTP_FROM]):
        logger.warning("SMTP not configured — skipping email to %s", to)
        return

    msg = MIMEMultipart("alternative")
    msg["From"] = f"Sivee.pro <{SMTP_FROM}>"
    msg["To"] = to
    msg["Subject"] = subject
    msg["Reply-To"] = SMTP_FROM
    msg.attach(MIMEText(text_body, "plain"))
    msg.attach(MIMEText(html_body, "html"))

    try:
        with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as server:
            server.login(SMTP_USER, SMTP_PASSWORD)
            server.sendmail(SMTP_FROM, to, msg.as_string())
        logger.info("Email sent to %s", to)
    except Exception:
        logger.exception("Failed to send email to %s", to)


def send_welcome_email(email: str) -> None:
    """Send a welcome email to a newly registered user."""
    subject = "Bienvenue sur Sivee.pro !"

    text_body = """\
Bienvenue sur Sivee.pro !

Votre compte a bien ete cree. Vous pouvez maintenant creer et personnaliser
vos CV professionnels en quelques minutes.

Accedez a votre tableau de bord : https://sivee.pro/dashboard

-- Sivee.pro"""

    html_body = """\
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;max-width:100%;">
        <!-- Header -->
        <tr>
          <td style="background-color:#1e293b;padding:32px 40px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;">Sivee.pro</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:40px;">
            <h2 style="margin:0 0 16px;color:#1e293b;font-size:22px;">Bienvenue !</h2>
            <p style="margin:0 0 16px;color:#475569;font-size:16px;line-height:1.6;">
              Votre compte a bien &eacute;t&eacute; cr&eacute;&eacute;. Vous pouvez maintenant cr&eacute;er et personnaliser
              vos CV professionnels en quelques minutes.
            </p>
            <p style="margin:0 0 32px;color:#475569;font-size:16px;line-height:1.6;">
              Commencez d&egrave;s maintenant en acc&eacute;dant &agrave; votre tableau de bord :
            </p>
            <!-- CTA -->
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto;">
              <tr><td align="center" style="background-color:#2563eb;border-radius:6px;">
                <a href="https://sivee.pro/dashboard"
                   style="display:inline-block;padding:14px 32px;color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
                  Acc&eacute;der &agrave; mon tableau de bord
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding:24px 40px;background-color:#f8fafc;text-align:center;">
            <p style="margin:0;color:#94a3b8;font-size:13px;">
              Sivee.pro &mdash; Cr&eacute;ez des CV professionnels facilement.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>"""
    send_email(email, subject, html_body, text_body)
