import psycopg2
h = 'aws-0-eu-west-2.pooler.supabase.com'
port = 6543
ref = 'yjzfotmjkziehsqvxito'
user = f"postgres.{ref}"
pw = 'abimbola@2007db'

try:
    print(f"Testing {h}:{port} user={user}...")
    conn = psycopg2.connect(host=h, port=port, user=user, password=pw, dbname='postgres', connect_timeout=5, sslmode='require')
    print("SUCCESS")
except Exception as e:
    print(f"Error: {e}")
