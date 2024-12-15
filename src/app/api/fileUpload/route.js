import { NextResponse } from "next/server";

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing for multipart/form-data
  },
};

export async function POST(req) {
  try {
    // Check if the request contains a readable stream for the file
    const contentType = req.headers.get("content-type");
    if (!contentType || !contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid Content-Type. Expected multipart/form-data." },
        { status: 400 }
      );
    }

    // Convert the request body to a FormData object
    const formData = await req.formData();
    const file = formData.get("file");
    
    if (!file) {
      return NextResponse.json(
        { error: "No file found in the request." },
        { status: 400 }
      );
    }

    // Make the request to the Clinked API
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
      return NextResponse.json(
        { error: errorData },
        { status: clinkedResponse.status }
      );
    }

    const data = await clinkedResponse.json();

    console.log("ID:" + data.id);
    console.log("friendlyName:" + file.name);

    //return NextResponse.json(data, { status: 200 });
    if (data.id != null) {
      //--------------------------------------------------------------------------------------------------
      try {
        // Define the API endpoint
        //const apiUrl ="https://api.clinked.com/v3/groups/114020/files/12144164";
        const apiUrl ="https://api.clinked.com/v3/groups/114020/files/12144169";

        // Define the payload directly in the API
        const payload = {
          friendlyName: file.name,
          tempFile: data.id,
          sharing: "MEMBERS",
          memberPermission: 8,
        };

        // Make the request to the Clinked API
        const response = await fetch(apiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer fca75494-1254-46df-a88c-ea51ac12a299",
          },
          body: JSON.stringify(payload),
        });

        // Handle errors from the Clinked API
        if (!response.ok) {
          const errorData = await response.text();
          return NextResponse.json(
            { error: errorData },
            { status: response.status }
          );
        }

        // Parse the response from the Clinked API
        const dataResponse = await response.json();

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
}
