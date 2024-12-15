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

    const data = await response.json();
    //console.log("data"+data.Token);
    //return NextResponse.json(data);
    return data.Token;
  } catch (error) {
    return NextResponse.json({
      error: "Request failed",
      details: error.message,
    });
  }
}

async function PrintBatch(securityKey,returnIds) {
  try {

    //console.log("securityKey:"+securityKey);
    //console.log("returnIds:"+returnIds);

    console.log("1");

    const response = await fetch(
      "https://api.cchaxcess.com/taxservices/oiptax/api/v1/PrintBatch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Security: securityKey,
          "Cache-Control": "no-cache",
          IntegratorKey: integrationKey,
        },
        body: JSON.stringify({
          ReturnId: [returnIds],
          ConfigurationXml: `<!--§§§ © 2014, CCH Incorporated. All rights reserved. §§§--><TaxReturnBatchPrintEntireReturn><TaxReturnPrintClientDataOptions>KeepCurrentClientInformationInTaxReturn</TaxReturnPrintClientDataOptions><ReturnAuthorizationOptions>ApplyAuthorizationsIfNeeded</ReturnAuthorizationOptions><PrintsetName>Default</PrintsetName><PrintEntireReturnOptions><PrintOneStatementPerPage>false</PrintOneStatementPerPage><CreateSeparateFiles>false</CreateSeparateFiles><PrintStatementsBehindForms>false</PrintStatementsBehindForms><DiagnosticsPrintFilter>AllDiagnostics</DiagnosticsPrintFilter><CreateSeparateK1PDFFiles>false</CreateSeparateK1PDFFiles><PrintOptions_AccountantCopy><PrintToPdf>true</PrintToPdf><Watermark>No Watermark</Watermark><PrintTickmarks>false</PrintTickmarks><IsMasked>false</IsMasked><IncludeEFileAttachment>false</IncludeEFileAttachment></PrintOptions_AccountantCopy></PrintEntireReturnOptions></TaxReturnBatchPrintEntireReturn>`,
        }),
      }
    );

    console.log("response"+response.json());
    console.log("2");
    const result = await response.json();
    console.log("3");
    console.log("result"+result);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({
      error: "Request failed",
      details: error.message,
    });
  }
}

export async function GET(request) {
  const token = await getAccessToken();

  const { searchParams } = new URL(request.url);
  const filterReq = searchParams.get("filter");

  const apiUrl =
    "https://api.cchaxcess.com/taxservices/oiptax/api/v1/Returns?$filter=" +
    filterReq;

  const headers = {
    Security: token,
    IntegratorKey: integrationKey,
    "Cache-Control": "no-cache",
  };

  try {
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: headers,
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    const ids = data.Returns.map((item) => `"${item.ReturnID}"`).join(",");
    console.log("ids" + ids);
    console.log("calling");

    const dataBatch = await PrintBatch(token,ids);
    
    console.log("called and dataBatch:"+dataBatch);
    return NextResponse.json(dataBatch, { status: 200 });
    //return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

