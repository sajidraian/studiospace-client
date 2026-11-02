import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        { success: false, message: "Backend API is not configured." },
        { status: 500 }
      );
    }

    const { path } = await context.params;

    const backendUrl = `${API_URL}/api/${path.join("/")}${request.nextUrl.search}`;

    const headers = new Headers(request.headers);

    headers.delete("host");
    headers.delete("connection");

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
    });

    const responseHeaders = new Headers(response.headers);

    responseHeaders.delete("content-encoding");
    responseHeaders.delete("content-length");
    responseHeaders.delete("transfer-encoding");

    return new NextResponse(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error("Backend Proxy Error:", error);

    return NextResponse.json(
      { success: false, message: "Backend server is unavailable." },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;