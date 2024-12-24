import { NextResponse } from "next/server";

const salesForceClientID = process.env.SALESFORCE_CLIENT_ID;
const salesForceClientSecret = process.env.SALESFORCE_CLIENT_SECRET;
const salesForceUserName = process.env.SALESFORCE_USERNAME;
const salesForcePassword = process.env.SALESFORCE_PASSWORD;

export async function GET() {

  const urlAuth = `https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=${salesForceClientID}&client_secret=${salesForceClientSecret}&username=${salesForceUserName}&password=${salesForcePassword}`;
  //const urlAuth = `https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9A2kN3Bn17hvJC7aEkHZXaB28xNDXh7Pmqex6PUaBQRJXRmlpr7kvc9V6mYJwDopD8dYujJ8lgmtO2LCQ&client_secret=B146A7AFB38EAE2F1A151B2D7ADC97D62073827E8254D01F1A5DF671DD9816C7&username=svc_user%40efmgmt.com&password=EFMServiceacc1%40`;

  const responseAuth = await fetch(urlAuth, {
    method: "POST",
  });

  if (!responseAuth.ok) {
    const errorDetails = await responseAuth.json();
    return NextResponse.json(
      { error: "Failed to fetch Salesforce token", details: errorDetails },
      { status: responseAuth.status }
    );
  }

  const dataAuth = await responseAuth.json();

  // Handle errors from Salesforce API
  if (!responseAuth.ok) {
    return NextResponse.json(
      { error: dataAuth },
      { status: responseAuth.status }
    );
  }

  const url = "https://efmgmt.my.salesforce.com/services/data/v62.0/query";
  const query =
    "q=Select+id%2Cname%2CEFM_Client_Number__c%2CRecordType.name%2CAccount_Manager__r.name%2CAccount_Representative__r.name%2CTax_Preparer__r.name%2CTax_Reviewer__r.name+from+account";

  const headers = {
    Authorization: "Bearer " + dataAuth.access_token,
    Cookie:
      "BrowserId=sKYN0cEzEe-4LW-ZhohVaA; CookieConsentPolicy=0:1; LSKey-c$CookieConsentPolicy=0:1",
  };

  try {
    const response = await fetch(`${url}?${query}`, { headers });
    if (!response.ok) {
      console.log("response not ok:" + response.status);

      return NextResponse.json(
        { error: `Failed to fetch data: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Iterating over the records array
    // data.records.forEach((record) => {
    //   console.log(`ID: ${record.Id}`);
    //   console.log(`Name: ${record.Name}`);
    //   console.log(`EFM Client Number: ${record.EFM_Client_Number__c}`);
    //   console.log(`Record Type Name: ${record.RecordType.Name}`);
    //   console.log(
    //     `Account_Manager: ${
    //       record.Account_Manager__r ? record.Account_Manager__r.Name : "N/A"
    //     }`
    //   );
    //   console.log(
    //     `Account_Representative: ${
    //       record.Account_Representative__r ? record.Account_Representative__r.Name : "N/A"
    //     }`
    //   );
    //   console.log(
    //     `Tax Preparer: ${
    //       record.Tax_Preparer__r ? record.Tax_Preparer__r.Name : "N/A"
    //     }`
    //   );
    //   console.log(
    //     `Tax Reviewer: ${
    //       record.Tax_Reviewer__r ? record.Tax_Reviewer__r.Name : "N/A"
    //     }`
    //   );
    //   console.log("----------");
    // });

    //console.log("data:" + data);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: `An unexpected error occurred: ${error.message}` },
      { status: 500 }
    );
  }
}
