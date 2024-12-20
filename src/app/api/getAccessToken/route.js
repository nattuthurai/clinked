import { NextResponse } from "next/server";

const integrationKey = process.env.INTEGRATION_KEY;
const cchPassword = process.env.CCH_PASSWORD;

const myDataArray = [];

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

  // const body = {
  //   ReturnId: [returnIds],
  //   ConfigurationXml: `<!--§§§ © 2014, CCH Incorporated. All rights reserved. §§§-->
  //     <TaxReturnBatchPrintEntireReturn>
  //       <TaxReturnPrintClientDataOptions>KeepCurrentClientInformationInTaxReturn</TaxReturnPrintClientDataOptions>
  //       <ReturnAuthorizationOptions>ApplyAuthorizationsIfNeeded</ReturnAuthorizationOptions>
  //       <PrintsetName>Default</PrintsetName>
  //       <PrintEntireReturnOptions>
  //         <PrintOneStatementPerPage>false</PrintOneStatementPerPage>
  //         <CreateSeparateFiles>false</CreateSeparateFiles>
  //         <PrintStatementsBehindForms>false</PrintStatementsBehindForms>
  //         <DiagnosticsPrintFilter>AllDiagnostics</DiagnosticsPrintFilter>
  //         <CreateSeparateK1PDFFiles>false</CreateSeparateK1PDFFiles>
  //         <PrintOptions_AccountantCopy>
  //           <PrintToPdf>true</PrintToPdf>
  //           <Watermark>No Watermark</Watermark>
  //           <PrintTickmarks>false</PrintTickmarks>
  //           <IsMasked>false</IsMasked>
  //           <IncludeEFileAttachment>false</IncludeEFileAttachment>
  //         </PrintOptions_AccountantCopy>
  //       </PrintEntireReturnOptions>
  //     </TaxReturnBatchPrintEntireReturn>`,
  // };

  const body = {
    ReturnId: [returnIds],
    ConfigurationXml: `<!--§§§ © 2014, CCH Incorporated. All rights reserved. §§§--><TaxReturnBatchPrintEntireReturn><TaxReturnPrintClientDataOptions>KeepCurrentClientInformationInTaxReturn</TaxReturnPrintClientDataOptions><ReturnAuthorizationOptions>ApplyAuthorizationsIfNeeded</ReturnAuthorizationOptions><PrintsetName>Default</PrintsetName><PrintEntireReturnOptions><PrintOneStatementPerPage>false</PrintOneStatementPerPage><CreateSeparateFiles>true</CreateSeparateFiles><PrintStatementsBehindForms>false</PrintStatementsBehindForms><DiagnosticsPrintFilter>AllDiagnostics</DiagnosticsPrintFilter><CreateSeparateK1PDFFiles>false</CreateSeparateK1PDFFiles><PrintOptions_AccountantCopy><PrintToPdf>true</PrintToPdf><Watermark>No Watermark</Watermark><PrintTickmarks>false</PrintTickmarks><IsMasked>false</IsMasked><IncludeEFileAttachment>false</IncludeEFileAttachment></PrintOptions_AccountantCopy><PrintOptions_GovernmentCopy><PrintToPdf>true</PrintToPdf><Watermark>No Watermark</Watermark><PrintEntireCopyForEFileQualifiedReturns>false</PrintEntireCopyForEFileQualifiedReturns><IncludeEFileAttachment>false</IncludeEFileAttachment></PrintOptions_GovernmentCopy><PrintOptions_ClientCopy><PrintToPdf>true</PrintToPdf><Watermark>No Watermark</Watermark><IsMasked>false</IsMasked><IncludeEFileAttachment>false</IncludeEFileAttachment></PrintOptions_ClientCopy></PrintEntireReturnOptions></TaxReturnBatchPrintEntireReturn>`,
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

async function processPrintBatch(dataArray, token) {
  //console.log("dataArray:" + dataArray);

  let results = [];

  for (const item of dataArray) {
    //console.log("item:" + item);
    const batchResult = await printBatch(token, item);
    //console.log("ExecutionID:" + batchResult.ExecutionID);
    results.push(batchResult.ExecutionID);
  }

  return results.join(",");
}

// Delay function to wait for a specified number of milliseconds
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function BatchStatusResult(token, batchResult) {
  const batchResultArray = batchResult.split(",");
  let isComplete = false;

  while (!isComplete) {
    if (batchResultArray.length > 0) {
      for (const executionID of batchResultArray) {
        const batchStatusResult = await BatchStatus(token, executionID);
        const outputStatusResult = await batchStatusResult.json();

        console.log(
          "BatchStatusDescription: " + outputStatusResult.BatchStatusDescription
        );

        if (outputStatusResult.BatchStatusDescription === "Complete") {
          isComplete = true;
        } else if (outputStatusResult.BatchStatusDescription === "Exception") {
          isComplete = true;
        } else {
          isComplete = false;
          break;
        }
      }
    }

    if (!isComplete) {
      console.log("Waiting for 30 seconds before checking again...");
      await delay(30000); // 30-second delay
    }
  }

  console.log("All batches are complete!");
  return isComplete;
}

function addData(executionID, batchItemGuid, fileName,groupId,fileId) {
  const newItem = {
    executionID: executionID,
    batchItemGuid: batchItemGuid,
    fileName: fileName,
    groupId: groupId,
    fileId: fileId,
  };

  // Push the new object into the array
  myDataArray.push(newItem);
}

async function processData(myDataArray, token) {
  for (const item of myDataArray) {
    const batchItemGuid = item.batchItemGuid;
    const fileName = item.fileName;
    const BatchGuid = item.executionID;
    const groupId = item.groupId;
    const fileId = item.fileId;

    const apiUrl = `https://api.cchaxcess.com/taxservices/oiptax/api/v1/BatchOutputDownloadFile`;

    try {
      const response = await fetch(
        `${apiUrl}?$filter=BatchItemGuid eq '${batchItemGuid}' and BatchGuid eq '${BatchGuid}' and FileName eq '${fileName}'`,
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
        console.error("Failed to fetch document from the external API");
        continue;
      }

      const contentType = response.headers.get("Content-Type");
      //console.log("Content-Type:", contentType);

      if (
        !contentType ||
        (!contentType.includes("multipart/form-data") &&
          !contentType.includes("application/octet-stream"))
      ) {
        console.error(
          "Invalid Content-Type. Expected multipart/form-data or application/octet-stream."
        );
        continue;
      }
      // Read the application/octet-stream data as an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();

      // Create a Blob from the ArrayBuffer
      const blob = new Blob([arrayBuffer], {
        type: "application/octet-stream",
      });

      const formData = new FormData();
      formData.append("file", blob, fileName);

      const clinkedResponse = await fetch(
        "https://api.clinked.com/v3/tempFiles",
        {
          method: "POST",
          headers: {
            Authorization: "Bearer fca75494-1254-46df-a88c-ea51ac12a299",
          },
          body: formData,
        }
      );

      if (!clinkedResponse.ok) {
        const errorData = await clinkedResponse.text();
        console.error("Error uploading to Clinked:", errorData);
        continue;
      }

      const data = await clinkedResponse.json();
      //console.log("Clinked Response ID:", data.id);
      //console.log("Friendly Name:", fileName);

      if (data.id != null) {
        try {
          //const apiUrl ="https://api.clinked.com/v3/groups/116267/files/12674786";
          const apiUrl =`https://api.clinked.com/v3/groups/${groupId}/files/${fileId}`;

          const payload = {
            friendlyName: fileName,
            tempFile: data.id,
            sharing: "MEMBERS",
            memberPermission: 8,
          };

          const responseUpload = await fetch(apiUrl, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer fca75494-1254-46df-a88c-ea51ac12a299",
            },
            body: JSON.stringify(payload),
          });

          if (!responseUpload.ok) {
            const errorData = await responseUpload.text();
            console.error("Error in final upload:", errorData);
            continue;
          }

          const dataResponse = await responseUpload.json();
          //console.log("Upload Successful:", dataResponse);
        } catch (error) {
          console.error("Error in final upload process:", error);
        }
      }
    } catch (error) {
      console.error("Error fetching the document:", error);
    }
  }
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
    const query = searchParams.get("query");
    const cleanedData = query.replace(/'/g, "");
    let taxReturnsClientsCopy="";
    let taxReturnsAccountantsCopy="";
    //console.log(cleanedData)

    const [year, clientCode, clientName] = cleanedData.split("|");

    const responseClient = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/client`
    );
    if (!responseClient.ok) {
      throw new Error(`Failed to fetch: ${responseClient.statusText}`);
    }
    const result = await responseClient.json();
    //console.log("result:"+result);

    console.log("clientName" + clientName);

    let groupId = "";

    result.map((item) => {
      if (item.friendlyName.toUpperCase().includes(clientName.toUpperCase())) {
        groupId = item.id;
      }
    });

    //console.log("groupId:" + groupId);

    const sharedDataResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/getFileIDByList?groupId=${groupId}&year=${year}`
    );
    if (sharedDataResponse.ok) {
      const sharedDataResult = await sharedDataResponse.json();

      taxReturnsClientsCopy = sharedDataResult.TaxReturnsClientsCopy;
      taxReturnsAccountantsCopy = sharedDataResult.TaxReturnsAccountantsCopy;
    }

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
    let dataString = data.Returns.map((item) => `${item.ReturnID}`).join(",");
    //console.log("Retrieved IDss:", dataString);

    const dataArray = dataString.split(",");
    const batchResult = await processPrintBatch(dataArray, token);
    //console.log("batchResult Output" + batchResult);

    const batchOutput = await BatchStatusResult(token, batchResult);
    //console.log("batchOutput:" + batchOutput);

    if (batchOutput === true) {
      if (batchResult.length > 0) {
        const dtArray = batchResult.split(",");

        for (const executionID of dtArray) {
          const batchOutputFilesResult = await BatchOutputFiles(
            token,
            executionID
          );
          const outputBatchOutputFilesResult =
            await batchOutputFilesResult.json();

          outputBatchOutputFilesResult.forEach((item) => {
            if(item.FileName.toUpperCase().includes("GOVT")||item.FileName.toUpperCase().includes("ACCT"))
            {
              addData(executionID, item.BatchItemGuid, item.FileName,groupId,taxReturnsAccountantsCopy);
            }
            else
            {
              addData(executionID, item.BatchItemGuid, item.FileName,groupId,taxReturnsClientsCopy);
            }
            
          });
        }
      }
    }

    await processData(myDataArray, token);

    return NextResponse.json("Successfully uploaded!!", { status: 200 });
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
