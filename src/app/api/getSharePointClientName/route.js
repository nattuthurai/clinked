import axios from "axios";
import { NextResponse } from 'next/server';

// const tenantId = "1d4a7043-d2a8-4578-8026-5d2221fbf8ec";
// const clientId = "f0a024fb-c3c8-43c5-b41a-bf5d5c6690cf";
// const clientSecret = "9aK8Q~ZW6i_QIZn6HfhUAGTTlQ0Nw6G1L89sndyc";
// const siteId = "d726e000-2148-4faf-b270-e617010a782c";
// const listId = "13f5df06-1ffa-4c1b-821c-7c41e621f404";

const tenantId = process.env.TENANT_ID;
const clientId = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const siteId = process.env.SITE_ID;
const listId = process.env.LIST_CLIENTMAPPING_ID;


async function getAccessToken() {
  const url = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

  const params = new URLSearchParams({
    client_id: clientId,
    scope: "https://graph.microsoft.com/.default",
    client_secret: clientSecret,
    grant_type: "client_credentials",
  });

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Failed to get access token: ${error.error_description}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function GET(req) {
    try {
      // Parse query parameters from the request
      const { searchParams } = new URL(req.url);
      
      const token = await getAccessToken();
  
      if (!siteId || !listId || !token) {
        return NextResponse.json(
          { error: "Missing required query parameters." },
          { status: 400 }
        );
      }
  
      // Graph API endpoint for SharePoint list items
      const graphEndpoint = `https://graph.microsoft.com/v1.0/sites/root/lists/${listId}/items?$expand=fields($select=TaxAssessorName,ClientName)`;
      
  
      // Fetch data from Graph API
      const response = await axios.get(graphEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Return the response data as JSON
      return NextResponse.json(response.data, { status: 200 });
    } catch (error) {
      console.error(error.response?.data || error.message);
      return NextResponse.json(
        { error: error.response?.data || error.message },
        { status: error.response?.status || 500 }
      );
    }
  }
  