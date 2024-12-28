const BEARER_TOKEN = process.env.TOKEN;

export async function GET(request) {
  const baseHeaders = {
    Authorization: `Bearer ${BEARER_TOKEN}`, // Use environment variables in production
  };

  // Extract `groupId` from query parameters
  const { searchParams } = new URL(request.url);
  const groupId = searchParams.get("groupId");
  const year = String(searchParams.get("year"));
  const clientType = String(searchParams.get("client"));

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

  let pathName ='';
  if(clientType.toUpperCase().includes("INDIVIDUAL"))
  {
    pathName="04_tax_returns";
  }
  else
  {
    pathName="10_tax_returns";
  }

  //const firstApiUrl = `https://api.clinked.app/v3/groups/${groupId}/files?path=10_tax_returns`;
  const firstApiUrl = `https://api.clinked.app/v3/groups/${groupId}/files?path=`+pathName;

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

    // Fetch data from the second API
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

    const myObject = { TaxReturnsClientsCopy: taxReturnsClientsCopyId, TaxReturnsAccountantsCopy: taxReturnsAccountantsCopyId };

    // Return the combined result
    return new Response(JSON.stringify(myObject), {
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
