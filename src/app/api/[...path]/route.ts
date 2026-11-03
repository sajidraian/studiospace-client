import { NextRequest, NextResponse } from "next/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        {
          success: false,
          message: "Backend API is not configured.",
        },
        { status: 500 }
      );
    }

    const { path } = await context.params;

    const backendUrl = `${API_URL}/api/${path.join("/")}${request.nextUrl.search}`;

    const headers = new Headers();

    // Forward required headers
    const contentType = request.headers.get("content-type");
    const cookie = request.headers.get("cookie");
    const authorization = request.headers.get("authorization");

    if (contentType) {
      headers.set("content-type", contentType);
    }

    // Explicitly forward authentication cookie
    if (cookie) {
      headers.set("cookie", cookie);
    }

    if (authorization) {
      headers.set("authorization", authorization);
    }

    const response = await fetch(backendUrl, {
      method: request.method,
      headers,
      body:
        request.method === "GET" || request.method === "HEAD"
          ? undefined
          : await request.arrayBuffer(),
      cache: "no-store",
    });

    return new NextResponse(response.body, {
      status: response.status,
      headers: {
        "content-type":
          response.headers.get("content-type") || "application/json",
        "cache-control": "no-store",
      },
    });
  } catch (error) {
    console.error("Backend Proxy Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Backend server is unavailable.",
      },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
