"""
JaraDeck — Onboarding Announcement Email (TEST SEND v5)
---------------------------------------------------------
White background, blue text, clean Jaradeck blue logo via Cloudinary.
Tight spacing, no card grouping, simple numbered items.

Run: source venv/bin/activate && python3 send_test_email.py
"""

import asyncio
import os
import httpx
from dotenv import load_dotenv

load_dotenv(dotenv_path="../.env", override=True)
load_dotenv(dotenv_path=".env", override=True)

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
SENDER_EMAIL  = os.getenv("OTP_SENDER_EMAIL", "noreply@jaradeck.com")
SENDER_NAME   = "Abimbola from Jaradeck"
BREVO_URL     = "https://api.brevo.com/v3/smtp/email"


def build_email_html(first_name: str) -> str:
    # Cloudinary logo PNG asset
    logo_url = "https://res.cloudinary.com/f7jln1n3/image/upload/f_png,w_102,h_75/jaradeck/branding/jaradeck_onboarding_svg"

    font_family = "'PP Neue Montreal', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"

    return f"""<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're in — Jaradeck</title>
  <!--[if mso]>
  <style>body,table,td{{font-family:Arial,Helvetica,sans-serif !important;}}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#ffffff;" bgcolor="#ffffff">

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff;width:100%;" bgcolor="#ffffff">
    <tr>
      <td align="center" style="padding:32px 20px;">

        <!-- Single main content wrapper -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:620px;width:100%;background-color:#ffffff;" bgcolor="#ffffff">

          <!-- Logo + Wordmark -->
          <tr>
            <td style="padding:0 0 20px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td valign="middle" style="padding-right:10px;">
                    <img src="{logo_url}" width="32" height="23" alt="Jaradeck" style="display:block;width:32px;height:23px;border:0;outline:none;">
                  </td>
                  <td valign="middle" style="font-size:19px;font-weight:700;color:#0048B3;font-family:{font_family};letter-spacing:-0.3px;">
                    Jaradeck
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Thin separator -->
          <tr>
            <td style="padding:0 0 24px 0;">
              <div style="height:1px;background-color:#eef0f3;font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Body content -->
          <tr>
            <td style="padding:0 0 24px 0;font-family:{font_family};font-size:15px;line-height:24px;color:#222222;">

              <p style="margin:0 0 12px 0;">Hey <strong style="color:#111111;">{first_name}</strong>,</p>

              <p style="margin:0 0 12px 0;color:#444444;">Remember that application you sent to Jaradeck a while back?</p>

              <p style="margin:0 0 16px 0;">Well, we went through it, and yeah… <strong style="color:#0048B3;">we'd like to bring you on board.</strong></p>

              <p style="margin:0 0 16px 0;"><strong style="color:#0048B3;">October 1st</strong> is the big day. Before then, here's a heads-up on a few things you'll need for onboarding:</p>

              <p style="margin:0 0 4px 0;font-weight:600;color:#111111;">1. At least 3 of your best works</p>
              <p style="margin:0 0 14px 0;color:#555555;font-size:14.5px;line-height:22px;">Anything you've done or worked on that you think is really dope. Figma links, websites, images, documents, videos… anything that shows what you can do.</p>

              <p style="margin:0 0 4px 0;font-weight:600;color:#111111;">2. A cool portrait of yourself + your bank account details</p>
              <p style="margin:0 0 16px 0;color:#555555;font-size:14.5px;line-height:22px;">And please, not that passport photo from 2019. &#x1F605;</p>

              <p style="margin:0 0 12px 0;color:#444444;">You don't need to send any of these now. Just have them ready for onboarding on <strong style="color:#111111;">October 1st</strong>.</p>

              <p style="margin:0 0 12px 0;color:#444444;">That's pretty much it for now.</p>

              <p style="margin:0;color:#0048B3;font-weight:600;">Remember: October 1st.</p>

            </td>
          </tr>

          <!-- Thin separator -->
          <tr>
            <td style="padding:0 0 20px 0;">
              <div style="height:1px;background-color:#eef0f3;font-size:0;line-height:0;">&nbsp;</div>
            </td>
          </tr>

          <!-- Sign off -->
          <tr>
            <td style="padding:0 0 32px 0;font-family:{font_family};">
              <p style="margin:0 0 2px 0;font-size:14px;color:#888888;">Stay jigi! &#x1F499;</p>
              <p style="margin:0;font-size:16px;font-weight:700;color:#111111;">Abimbola</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:16px 0 0 0;font-size:12px;line-height:18px;color:#aaaaaa;font-family:{font_family};">
              &copy; 2025 Jaradeck &middot; The Trusted Execution Platform<br>
              This is an automated message, please do not reply.
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>"""


async def send_test_email():
    """Send test email to Abimbola's personal address."""
    if not BREVO_API_KEY:
        print("BREVO_API_KEY not found in .env")
        return

    TEST_EMAIL = "abimbolaogundiya2@gmail.com"
    TEST_NAME  = "Abimbola"

    html = build_email_html(TEST_NAME)

    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [{"email": TEST_EMAIL, "name": TEST_NAME}],
        "subject": "You\u2019re in \u2014 here\u2019s what\u2019s next",
        "htmlContent": html,
    }

    headers = {
        "api-key":      BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept":       "application/json",
    }

    print(f"Sending TEST email to {TEST_EMAIL}...")
    print(f"From: {SENDER_NAME} <{SENDER_EMAIL}>")

    async with httpx.AsyncClient(timeout=20.0) as client:
        response = await client.post(BREVO_URL, json=payload, headers=headers)
        if response.status_code == 201:
            print("Test email sent! Check your inbox.")
        else:
            print(f"Brevo error {response.status_code}: {response.text}")


if __name__ == "__main__":
    asyncio.run(send_test_email())
