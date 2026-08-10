import psycopg2
import sys

regions = [
    "us-east-1", "us-east-2", "us-west-1", "us-west-2",
    "ap-east-1", "ap-south-1", "ap-northeast-1", "ap-northeast-2",
    "ap-southeast-1", "ap-southeast-2", "ca-central-1",
    "eu-central-1", "eu-west-1", "eu-west-2", "eu-west-3",
    "eu-south-1", "sa-east-1"
]

project_ref = "yjzfotmjkziehsqvxito"
password = "abimbola@2007db"

for region in regions:
    host = f"aws-0-{region}.pooler.supabase.com"
    conn_string = f"postgresql://postgres.{project_ref}:{password}@{host}:6543/postgres"
    print(f"Trying {host}...")
    try:
        conn = psycopg2.connect(conn_string, connect_timeout=3)
        print(f"SUCCESS! Connected via {host}")
        conn.close()
        sys.exit(0)
    except Exception as e:
        pass
print("Could not connect to any region.")
