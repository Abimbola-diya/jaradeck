"""
JaraDeck — Send Onboarding Emails to Cleaned Applicants List
--------------------------------------------------------------
Reads from '/home/abimbola/Desktop/jaradeck/Cleaned_Applicants.csv',
parses first names, renders personalized HTML emails, and dispatches via Brevo.
"""

import asyncio
import csv
import os
import httpx
from dotenv import load_dotenv
from send_test_email import build_email_html

# Load environment variables
load_dotenv(dotenv_path="../.env", override=True)
load_dotenv(dotenv_path=".env", override=True)

BREVO_API_KEY = os.getenv("BREVO_API_KEY", "")
SENDER_EMAIL  = os.getenv("OTP_SENDER_EMAIL", "noreply@jaradeck.com")
SENDER_NAME   = "Abimbola from Jaradeck"
BREVO_URL     = "https://api.brevo.com/v3/smtp/email"
CSV_PATH      = "/home/abimbola/Desktop/jaradeck/Cleaned_Applicants.csv"


def extract_first_name(raw_name: str) -> str:
    """Extract and capitalize first name from raw name string."""
    if not raw_name:
        return ""
    s = str(raw_name).strip()
    parts = s.split()
    if not parts:
        return ""
    # Clean up commas or special chars if any
    first = parts[0].replace(',', '').replace(';', '').strip()
    return first.capitalize()


def load_cleaned_applicants():
    """Load applicants from Cleaned_Applicants.csv."""
    applicants = []
    with open(CSV_PATH, 'r', encoding='utf-8') as f:
        reader = csv.reader(f)
        header = next(reader, None)
        for row in reader:
            if not row or len(row) < 2:
                continue
            raw_name = row[0].strip()
            raw_email = row[1].strip()
            if not raw_email or "@" not in raw_email:
                continue

            first_name = extract_first_name(raw_name)
            applicants.append({
                "full_name": raw_name,
                "first_name": first_name,
                "email": raw_email
            })

    return applicants


async def send_email_to_applicant(client: httpx.AsyncClient, applicant: dict, index: int, total: int):
    """Send personalized email to a single applicant."""
    first_name = applicant["first_name"]
    email = applicant["email"]

    html_content = build_email_html(first_name)

    payload = {
        "sender": {"name": SENDER_NAME, "email": SENDER_EMAIL},
        "to": [{"email": email, "name": applicant["full_name"]}],
        "subject": "You\u2019re in \u2014 here\u2019s what\u2019s next",
        "htmlContent": html_content,
    }

    headers = {
        "api-key": BREVO_API_KEY,
        "Content-Type": "application/json",
        "Accept": "application/json",
    }

    try:
        response = await client.post(BREVO_URL, json=payload, headers=headers)
        if response.status_code == 201:
            print(f"[{index:02d}/{total:02d}] SUCCESS -> {first_name} ({email})")
            return True, email, None
        else:
            print(f"[{index:02d}/{total:02d}] FAILED  -> {first_name} ({email}) | Status: {response.status_code}, Error: {response.text}")
            return False, email, f"HTTP {response.status_code}: {response.text}"
    except Exception as e:
        print(f"[{index:02d}/{total:02d}] EXCEPTION -> {first_name} ({email}) | Error: {str(e)}")
        return False, email, str(e)


async def main():
    if not BREVO_API_KEY:
        print("Error: BREVO_API_KEY missing in environment variables.")
        return

    applicants = load_cleaned_applicants()
    total = len(applicants)

    print(f"Starting bulk send to {total} applicants from Cleaned_Applicants.csv...")
    print(f"From: {SENDER_NAME} <{SENDER_EMAIL}>\n" + "-"*55)

    success_count = 0
    fail_count = 0
    failed_list = []

    async with httpx.AsyncClient(timeout=20.0) as client:
        for idx, applicant in enumerate(applicants, start=1):
            success, email, err = await send_email_to_applicant(client, applicant, idx, total)
            if success:
                success_count += 1
            else:
                fail_count += 1
                failed_list.append((email, err))
            
            await asyncio.sleep(0.1)

    print("\n" + "="*55)
    print("DISPATCH COMPLETE")
    print(f"Total Processed  : {total}")
    print(f"Successfully Sent: {success_count}")
    print(f"Failed Deliveries: {fail_count}")

    if failed_list:
        print("\nFailed Recipients:")
        for email, err in failed_list:
            print(f" - {email}: {err}")


if __name__ == "__main__":
    asyncio.run(main())
