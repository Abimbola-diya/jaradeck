import httpx
import random
import string
from core.config import settings

BREVO_SEND_URL = "https://api.brevo.com/v3/smtp/email"


def generate_otp(length: int = 6) -> str:
    """Generate a cryptographically random numeric OTP."""
    import secrets
    # Use secrets for cryptographic randomness
    digits = string.digits
    return "".join(secrets.choice(digits) for _ in range(length))


def _mask_email(email: str) -> str:
    """Mask an email for display: j***k@gmail.com"""
    try:
        local, domain = email.split("@", 1)
        if len(local) <= 2:
            masked_local = local[0] + "***"
        else:
            masked_local = local[0] + "***" + local[-1]
        return f"{masked_local}@{domain}"
    except Exception:
        return email


async def send_otp_email(
    to_email: str,
    to_name: str,
    otp_code: str,
    sender_name: str = None,  # Override per email type; falls back to .env setting
) -> bool:
    """
    Send a transactional OTP email via Brevo REST API.
    Returns True on success, False on failure.
    """
    if not settings.BREVO_API_KEY:
        print("[EMAIL] BREVO_API_KEY not configured — skipping send")
        return False

    first_name = to_name.split()[0] if to_name else "there"

    html_content = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f5f5f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td align="center" style="padding:40px 16px">
            <table role="presentation" width="100%" style="max-width:480px;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
              <!-- Header -->
              <tr>
                <td style="background:#0048B3;padding:32px 40px;text-align:center">
                  <div style="font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.5px">Jaradeck</div>
                </td>
              </tr>
              <!-- Body -->
              <tr>
                <td style="padding:40px 40px 32px">
                  <h1 style="margin:0 0 8px;font-size:22px;font-weight:700;color:#0d0d0d;letter-spacing:-0.5px">
                    Verify your email address
                  </h1>
                  <p style="margin:0 0 28px;font-size:15px;color:#666;line-height:1.6">
                    Hi {first_name}, enter the code below in the Jaradeck app to complete your sign-up.
                    This code is unique to you.
                  </p>

                  <!-- OTP Box -->
                  <div style="background:#f0f5ff;border:1.5px solid #d0e0ff;border-radius:12px;padding:28px 20px;text-align:center;margin-bottom:28px">
                    <div style="font-size:44px;font-weight:800;letter-spacing:14px;color:#0048B3;font-variant-numeric:tabular-nums">
                      {otp_code}
                    </div>
                  </div>

                  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px">
                    <tr>
                      <td style="background:#fff8e1;border-left:3px solid #f59e0b;border-radius:4px;padding:12px 16px">
                        <p style="margin:0;font-size:13px;color:#92400e;line-height:1.5">
                          ⏱ This code expires in <strong>10 minutes</strong> and can only be used once.
                          Never share it with anyone.
                        </p>
                      </td>
                    </tr>
                  </table>

                  <p style="margin:0;font-size:14px;color:#888;line-height:1.6">
                    Didn't request this? You can safely ignore this email — no account will be created
                    without this verification step.
                  </p>
                </td>
              </tr>
              <!-- Footer -->
              <tr>
                <td style="padding:20px 40px 32px;border-top:1px solid #f0f0f0">
                  <p style="margin:0;font-size:12px;color:#aaa;text-align:center;line-height:1.6">
                    &copy; 2025 Jaradeck &middot; The Trusted Execution Platform<br>
                    This is an automated message, please do not reply.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    """

    payload = {
        "sender": {
            "name": sender_name or settings.OTP_SENDER_NAME,
            "email": settings.OTP_SENDER_EMAIL,
        },
        "to": [{"email": to_email, "name": to_name}],
        "subject": f"{otp_code} is your Jaradeck verification code",
        "htmlContent": html_content,
    }

    headers = {
        "api-key": settings.BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    try:
        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(BREVO_SEND_URL, json=payload, headers=headers)
            if response.status_code == 201:
                print(f"[EMAIL] OTP sent successfully to {to_email}")
                return True
            else:
                print(f"[EMAIL] Brevo error {response.status_code}: {response.text}")
                return False
    except httpx.TimeoutException:
        print(f"[EMAIL] Timeout sending OTP to {to_email}")
        return False
    except Exception as e:
        print(f"[EMAIL] Unexpected error sending OTP: {e}")
        return False
