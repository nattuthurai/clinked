import { NextResponse } from 'next/server';

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const clientName = searchParams.get('clientName');
    const fileId = searchParams.get('fileID');

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

    if (!groupId || !fileId) {
        return NextResponse.json(
            { error: 'Missing required parameters: groupId and fileId' },
            { status: 400 }
        );
    }

    const API_URL = `https://api.clinked.com/v3/groups/${groupId}/files/${fileId}/download`;
    const BEARER_TOKEN = process.env.TOKEN;

    try {
        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${BEARER_TOKEN}`, // Replace <YOUR-TOKEN> with your actual token
            },
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to fetch document from the external API' },
                { status: response.status }
            );
        }

        // Create a response with the file's content and headers
        const fileHeaders = new Headers({
            'Content-Type': response.headers.get('Content-Type'),
            'Content-Disposition': response.headers.get('Content-Disposition'),
        });

        return new NextResponse(response.body, {
            status: 200,
            headers: fileHeaders,
        });
    } catch (error) {
        console.error('Error fetching the document:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
