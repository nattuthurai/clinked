import { NextResponse } from 'next/server';

const integrationKey = process.env.INTEGRATION_KEY;
const cchPassword = process.env.CCH_PASSWORD;


async function getAccessToken() {

}


export async function POST() {

  
  const url = 'https://api.cchaxcess.com/api/AuthService/v1.0/Authenticate';

  const payload = {
    UserName: 'saraswathyk',
    UserSid: 'saraswathyk',
    Password: cchPassword,
    Realm: '166756',
    AdfsPilotLoginCode: 'String content',
    IsInternal: true,
  };

  //console.log("integrationKey"+integrationKey);

  const headers = {
    'IntegratorKey': integrationKey,
    'Content-Type': 'application/json'
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Request failed', details: error.message });
  }
}
