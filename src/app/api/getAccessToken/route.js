import { NextResponse } from "next/server";

const integrationKey = process.env.INTEGRATION_KEY;
const cchPassword = process.env.CCH_PASSWORD;

// Function to get an access token
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

// Function to print the batch
async function printBatch(securityKey, returnIds) {
  const url = "https://api.cchaxcess.com/taxservices/oiptax/api/v1/PrintBatch";

  const headers = {
    "Content-Type": "application/json",
    Security: securityKey,
    "Cache-Control": "no-cache",
    IntegratorKey: integrationKey,
  };

  //console.log("headers:"+headers);

  const body = {
    ReturnId: [returnIds],
    ConfigurationXml: `<!--§§§ © 2014, CCH Incorporated. All rights reserved. §§§-->
      <TaxReturnBatchPrintEntireReturn>
        <TaxReturnPrintClientDataOptions>KeepCurrentClientInformationInTaxReturn</TaxReturnPrintClientDataOptions>
        <ReturnAuthorizationOptions>ApplyAuthorizationsIfNeeded</ReturnAuthorizationOptions>
        <PrintsetName>Default</PrintsetName>
        <PrintEntireReturnOptions>
          <PrintOneStatementPerPage>false</PrintOneStatementPerPage>
          <CreateSeparateFiles>false</CreateSeparateFiles>
          <PrintStatementsBehindForms>false</PrintStatementsBehindForms>
          <DiagnosticsPrintFilter>AllDiagnostics</DiagnosticsPrintFilter>
          <CreateSeparateK1PDFFiles>false</CreateSeparateK1PDFFiles>
          <PrintOptions_AccountantCopy>
            <PrintToPdf>true</PrintToPdf>
            <Watermark>No Watermark</Watermark>
            <PrintTickmarks>false</PrintTickmarks>
            <IsMasked>false</IsMasked>
            <IncludeEFileAttachment>false</IncludeEFileAttachment>
          </PrintOptions_AccountantCopy>
        </PrintEntireReturnOptions>
      </TaxReturnBatchPrintEntireReturn>`,
  };

  //console.log("body:"+body);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`PrintBatch failed: ${response.statusText}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in printBatch:", error);
    return NextResponse.json(
      { error: "PrintBatch request failed", details: error.message },
      { status: 500 }
    );
  }
}

async function BatchStatus(securityKey, batchGuid) {
  const apiUrl =
    "https://api.cchaxcess.com/taxservices/oiptax/api/v1/BatchStatus";

  try {
    const response = await fetch(
      `${apiUrl}?$filter=BatchGuid eq '${batchGuid}'`,
      {
        method: "GET",
        headers: {
          Security: securityKey,
          "Cache-Control": "no-cache",
          IntegratorKey: integrationKey,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    //console.log("Before data");
    const data = await response.json();
    //console.log("After data"+data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function BatchOutputFiles(securityKey, batchGuid) {
  const apiUrl =
    "https://api.cchaxcess.com/taxservices/oiptax/api/v1/BatchOutputFiles";

  try {
    const response = await fetch(
      `${apiUrl}?$filter=BatchGuid eq '${batchGuid}'`,
      {
        method: "GET",
        headers: {
          Security: securityKey,
          "Cache-Control": "no-cache",
          IntegratorKey: integrationKey,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `Error: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }
    //console.log("Before data");
    const data = await response.json();
    //console.log("After data"+data);
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function FileDownload(securityKey, batchItemGuid, batchGuid, fileName) {
  const apiUrl = `https://api.cchaxcess.com/taxservices/oiptax/api/v1/BatchOutputDownloadFile`;

  try {
    const response = await fetch(
      `${apiUrl}?$filter=BatchItemGuid eq '${batchItemGuid}' and BatchGuid eq '${batchGuid}' and FileName eq '${fileName}'`,
      {
        method: "GET",
        headers: {
          Security: securityKey,
          "Cache-Control": "no-cache",
          IntegratorKey: integrationKey,
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch document from the external API" },
        { status: response.status }
      );
    }

    // Create a response with the file's content and headers
    const fileHeaders = new Headers({
      "Content-Type": response.headers.get("Content-Type"),
      "Content-Disposition": response.headers.get("Content-Disposition"),
    });

    return new NextResponse(response.body, {
      status: 200,
      headers: fileHeaders,
    });
  } catch (error) {
    console.error("Error fetching the document:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

async function streamToArrayBuffer(stream) {
  const chunks = [];
  const reader = stream.getReader();

  let done = false;
  while (!done) {
    const { value, done: streamDone } = await reader.read();
    if (value) {
      chunks.push(value);
    }
    done = streamDone;
  }

  // Concatenate all chunks into a single ArrayBuffer
  const totalSize = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const concatenated = new Uint8Array(totalSize);
  let offset = 0;

  for (const chunk of chunks) {
    concatenated.set(chunk, offset);
    offset += chunk.length;
  }

  return concatenated.buffer;
}

// Main GET handler function
export async function GET(request) {
  try {
    // Get the access token
    const token = await getAccessToken();
    if (!token) {
      throw new Error("Failed to retrieve access token");
    }

    const { searchParams } = new URL(request.url);
    const filterReq = searchParams.get("filter");

    const apiUrl = `https://api.cchaxcess.com/taxservices/oiptax/api/v1/Returns?$filter=${filterReq}`;

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
    //const ids = data.Returns.map((item) => `"${item.ReturnID}"`).join(",");
    const ids = "2023P:943:V1";
    console.log("Retrieved IDs:", ids);

    //return NextResponse.json(data, { status: 200 });

    // Call the printBatch function
    const batchResult = await printBatch(token, ids);
    //const executionID = batchResult.ExecutionID;

    const executionID = "598a5ff1-a647-40d6-b340-f3e7e38afa20";
    console.log("executionID:" + executionID);

    //return NextResponse.json(batchResult, { status: 200 });

    const batchStatusResult = await BatchStatus(token, executionID);
    const outputStatusResult = await batchStatusResult.json();
    console.log("batchStatusResult" + outputStatusResult);
    //return NextResponse.json(outputStatusResult, { status: 200 });

    const batchOutputFilesResult = await BatchOutputFiles(token, executionID);
    const outputBatchOutputFilesResult = await batchOutputFilesResult.json();
    console.log("batchOutputFilesResult" + outputBatchOutputFilesResult);

    //return NextResponse.json(outputBatchOutputFilesResult, { status: 200 });

    let batchItemGuid = "39f3a213-e3ba-4771-b494-7869136bc6b8";
    let fileName = "2023US P943 Acct V1.pdf";

    // const fileResponse = FileDownload(
    //   token,
    //   batchItemGuid,
    //   executionID,
    //   fileName
    // );

    //--------------------------------------------------------------------------------------------------

    const apiUrl1 = `https://api.cchaxcess.com/taxservices/oiptax/api/v1/BatchOutputDownloadFile`;

    try {
      const response = await fetch(
        `${apiUrl1}?$filter=BatchItemGuid eq '${batchItemGuid}' and BatchGuid eq '${executionID}' and FileName eq '${fileName}'`,
        {
          method: "GET",
          headers: {
            Security: token,
            "Cache-Control": "no-cache",
            IntegratorKey: integrationKey,
          },
        }
      );

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to fetch document from the external API" },
          { status: response.status }
        );
      }

      // Create a response with the file's content and headers
      const fileHeaders = new Headers({
        "Content-Type": response.headers.get("Content-Type"),
        "Content-Disposition": response.headers.get("Content-Disposition"),
      });

      // return new NextResponse(response.body, {
      //   status: 200,
      //   headers: fileHeaders,
      // });

      console.log("1");

      //------------------------------------------------------------------------------------------------

      try {
        // Check if the request contains a readable stream for the file
        const contentType = response.headers.get("Content-Type");

        console.log("contentType" + contentType);

        if (
          !contentType &&
          !contentType.includes("multipart/form-data") &&
          !contentType.includes("application/octet-stream")
        ) {
          return NextResponse.json(
            { error: "Invalid Content-Type. Expected multipart/form-data." },
            { status: 400 }
          );
        }

        console.log("2");

        // Read the application/octet-stream data as an ArrayBuffer
        const arrayBuffer = await response.arrayBuffer();

        // Create a Blob from the ArrayBuffer with a specified MIME type and filename
        const blob = new Blob([arrayBuffer], {
          type: "application/octet-stream",
        });
        //const filename = "2023US P943 Acct V1.pdf"; // Set an appropriate filename for the file

        // Create a new FormData object and append the Blob with a filename
        const formData = new FormData();
        formData.append("file", blob, fileName);

        console.log("3");

        if (!response.body) {
          return NextResponse.json(
            { error: "No file found in the request." },
            { status: 400 }
          );
        }

        console.log("4");

        // Make the request to the Clinked API
        const clinkedResponse = await fetch('https://api.clinked.com/v3/tempFiles', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer fca75494-1254-46df-a88c-ea51ac12a299',
          },
          body: formData, // Send the FormData object
        });

        console.log("5");

        if (!clinkedResponse.ok) {
          const errorData = await clinkedResponse.text();
          return NextResponse.json(
            { error: errorData },
            { status: clinkedResponse.status }
          );
        }

        console.log("6");
        const data = await clinkedResponse.json();

        console.log("7");

        console.log("ID:" + data.id);
        console.log("friendlyName:" + fileName);

        //return NextResponse.json(data, { status: 200 });
        if (data.id != null) {
          //--------------------------------------------------------------------------------------------------
          try {
            // Define the API endpoint
            //const apiUrl ="https://api.clinked.com/v3/groups/114020/files/12144164";
            const apiUrl =
              "https://api.clinked.com/v3/groups/114020/files/12144169";

            // Define the payload directly in the API
            const payload = {
              friendlyName: fileName,
              tempFile: data.id,
              sharing: "MEMBERS",
              memberPermission: 8,
            };

            console.log("8");
            // Make the request to the Clinked API
            const responseUpload = await fetch(apiUrl, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer fca75494-1254-46df-a88c-ea51ac12a299",
              },
              body: JSON.stringify(payload),
            });
            console.log("9");
            // Handle errors from the Clinked API
            if (!responseUpload.ok) {
              const errorData = await responseUpload.text();
              return NextResponse.json(
                { error: errorData },
                { status: response.status }
              );
            }
            console.log("10");
            // Parse the response from the Clinked API
            const dataResponse = await responseUpload.json();
            console.log("11");
            // Return the successful response
            return NextResponse.json(dataResponse, { status: 200 });
          } catch (error) {
            // Handle any errors that occur during the process
            return NextResponse.json({ error: error.message }, { status: 500 });
          }
          //--------------------------------------------------------------------------------------------------
        }
      } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      //------------------------------------------------------------------------------------------------
    } catch (error) {
      console.error("Error fetching the document:", error);
      return NextResponse.json(
        { error: "Internal Server Error" },
        { status: 500 }
      );
    }

    //--------------------------------------------------------------------------------------------------

    //console.log("fileResponse" + fileResponse);

    //return NextResponse.json(fileResponse, { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
