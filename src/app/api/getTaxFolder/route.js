const BEARER_TOKEN = process.env.TOKEN;

// Create an empty array to hold the objects
let arrayObject = [];

// Function to add a new object to the array
function addToArray(fileName, size) {
  // Create a new object

  if (fileName != "View Download or Share Documents in this folder.png") {
    const newObject = {
      fileName: fileName,
      size: size,
    };

    // Add the object to the array
    arrayObject.push(newObject);

    // Log the updated array
    //console.log(arrayObject);
  }
}

export async function GET(request) {
  const baseHeaders = {
    Authorization: `Bearer ${BEARER_TOKEN}`, // Use environment variables in production
  };

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const cleanedData = query.replace(/'/g, "");

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

  console.log("groupId:" + groupId);

  if (!groupId) {
    return new Response(
      JSON.stringify({ error: "Missing required parameter: groupId" }),
      {
        status: 400,
        headers: {
          Authorization: `Bearer ${BEARER_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );
  }

  const firstApiUrl = `https://api.clinked.app/v3/groups/${groupId}/files?path=10_tax_returns`;

  try {
    // Fetch data from the first API
    const firstResponse = await fetch(firstApiUrl, { headers: baseHeaders });
    console.log("firstApiUrl:" + firstApiUrl);
    if (!firstResponse.ok) {
      throw new Error(
        `First API call failed with status: ${firstResponse.status}`
      );
    }
    const firstData = await firstResponse.json();

    // Extract the `id` for the second API call
    const folderId = firstData.id;
    if (!folderId) {
      throw new Error("Folder ID not found in the first API response.");
    }

    // Fetch data from the second API
    const secondApiUrl = `https://api.clinked.app/v3/groups/${groupId}/filesList?parent=${folderId}`;
    console.log("secondApiUrl:" + secondApiUrl);
    const secondResponse = await fetch(secondApiUrl, { headers: baseHeaders });
    if (!secondResponse.ok) {
      throw new Error(
        `Second API call failed with status: ${secondResponse.status}`
      );
    }
    const secondData = await secondResponse.json();

    const filteredItem = secondData.items.find(
      (item) => item.friendlyName === year
    );
    const yearId = filteredItem ? filteredItem.id : null;
    console.log("yearId:", yearId);

    // Fetch data from the third API
    const thirdApiUrl = `https://api.clinked.app/v3/groups/${groupId}/filesList?parent=${yearId}`;
    console.log("thirdApiUrl:" + thirdApiUrl);
    const thirdResponse = await fetch(thirdApiUrl, { headers: baseHeaders });
    if (!thirdResponse.ok) {
      throw new Error(
        `Second API call failed with status: ${thirdResponse.status}`
      );
    }
    const thirdData = await thirdResponse.json();

    const filtered3ItemClientsCopy = thirdData.items.find(
      (item) => item.friendlyName === "Tax Returns - Clients Copy"
    );
    const taxReturnsClientsCopyId = filtered3ItemClientsCopy
      ? filtered3ItemClientsCopy.id
      : null;

    console.log("taxReturnsClientsCopyId:", taxReturnsClientsCopyId);

    const filtered3ItemAccountantsCopy = thirdData.items.find(
      (item) => item.friendlyName === "Tax Returns - Accountants Copy"
    );

    const taxReturnsAccountantsCopyId = filtered3ItemAccountantsCopy
      ? filtered3ItemAccountantsCopy.id
      : null;

    console.log("taxReturnsAccountantsCopyId:", taxReturnsAccountantsCopyId);
    //const myObject = { TaxReturnsClientsCopy: taxReturnsClientsCopyId, TaxReturnsAccountantsCopy: taxReturnsAccountantsCopyId };

    // Fetch data from the API1 API
    const ApiUrl1 = `https://api.clinked.app/v3/groups/${groupId}/filesList?parent=${taxReturnsClientsCopyId}`;
    console.log("ApiUrl1:" + ApiUrl1);
    const apiResponse1 = await fetch(ApiUrl1, { headers: baseHeaders });
    if (!apiResponse1.ok) {
      throw new Error(
        `ApiUrl1 call failed with status: ${apiResponse1.status}`
      );
    }
    const apiData1 = await apiResponse1.json();

    apiData1.items.forEach((item) => {
      // console.log("ID:", item.id);
      // console.log("Friendly Name:", item.friendlyName);
      // console.log("Content Type:", item.contentType);
      // console.log("Size:", item.size, "bytes");
      // console.log("Uploaded By:", item.uploaded.user.name);
      // console.log("Group:", item.group.friendlyName);
      // console.log("Last Modified:", new Date(item.lastModified).toLocaleString());
      // console.log("-----------------------------");

      addToArray(item.friendlyName, item.size);
    });

    // Fetch data from the API2 API
    const ApiUrl2 = `https://api.clinked.app/v3/groups/${groupId}/filesList?parent=${taxReturnsAccountantsCopyId}`;
    console.log("ApiUrl2:" + ApiUrl2);
    const apiResponse2 = await fetch(ApiUrl2, { headers: baseHeaders });
    if (!apiResponse2.ok) {
      throw new Error(
        `ApiUrl2 call failed with status: ${apiResponse2.status}`
      );
    }
    const apiData2 = await apiResponse2.json();

    apiData2.items.forEach((item) => {
      // console.log("ID:", item.id);
      // console.log("Friendly Name:", item.friendlyName);
      // console.log("Content Type:", item.contentType);
      // console.log("Size:", item.size, "bytes");
      // console.log("Uploaded By:", item.uploaded.user.name);
      // console.log("Group:", item.group.friendlyName);
      // console.log("Last Modified:", new Date(item.lastModified).toLocaleString());
      // console.log("-----------------------------");

      addToArray(item.friendlyName, item.size);
    });

    //const mergedItems = [...apiData1.items, ...apiData2.items];

    // Return the combined result
    return new Response(JSON.stringify(arrayObject), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
