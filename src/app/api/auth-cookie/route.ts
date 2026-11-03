
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

// ==========================================
// Create JWT Cookie After Login
// ==========================================

export async function POST(request: NextRequest) {
  try {
    // Better Auth session থেকে JWT তৈরি
    const result = await auth.api.getToken({
      headers: request.headers,
    });

    if (!result?.token) {
      return NextResponse.json(
        { success: false, message: "Authentication required." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: "JWT cookie created successfully.",
    });

    // JWT-কে HTTPOnly Cookie হিসেবে সংরক্ষণ
    response.cookies.set("studio_auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 15 * 60,
    });

    return response;
  } catch (error) {
    console.error("JWT cookie creation failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not create authentication cookie.",
      },
      { status: 500 }
    );
  }
}

// ==========================================
// Clear JWT Cookie During Logout
// ==========================================

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: "Authentication cookie cleared successfully.",
  });

  response.cookies.set("studio_auth_token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });

  return response;
}
