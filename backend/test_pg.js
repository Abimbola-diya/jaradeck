const { Client } = require('pg');
const client = new Client({
  connectionString: 'postgresql://postgres:abimbola@2007db@db.yjzfotmjkziehsqvxito.supabase.co:5432/postgres'
});
client.connect()
  .then(() => console.log('Connected!'))
  .catch(e => console.error(e.message))
  .finally(() => client.end());
