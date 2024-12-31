import { NextResponse } from "next/server";

const integrationKey = process.env.INTEGRATION_KEY;
const cchPassword = process.env.CCH_PASSWORD;

async function getAccessToken() {
  const url = "https://api.cchaxcess.com/api/AuthService/v1.0/Authenticate";

  const payload = {
    UserName: "saraswathyk",
    UserSid: "saraswathyk",
    Password: cchPassword,
    Realm: "166756",
    AdfsPilotLoginCode: "String content",
    IsInternal: true,
  };

  const headers = {
    IntegratorKey: integrationKey,
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data.Token;
  } catch (error) {
    console.error("Error in getAccessToken:", error);
    return NextResponse.json(
      { error: "Authentication request failed", details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const token = await getAccessToken();
    if (!token) {
        throw new Error("Failed to retrieve access token");
      }

      const apiUrl = "https://api.cchaxcess.com/api/ClientService/v1.0/Client/968/EmailList";

      const headers = {
        Security: token,
        IntegratorKey: integrationKey,
        "Cache-Control": "no-cache",
      };
  
      const response = await fetch(apiUrl, {
        method: "GET",
        headers,
      });
  
      if (!response.ok) {
        throw new Error(`Error fetching returns: ${response.statusText}`);
      }
  
      const data = await response.json();

      return NextResponse.json(data, {
        status: 200,
      });

  } catch (error) {

    console.error("Error in GET handler:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });

  }
}
