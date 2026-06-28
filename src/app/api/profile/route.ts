import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, profilePic } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Name is a required field." },
        { status: 400 }
      );
    }

    const updatedUser = await db.user.update({
      where: { id: session.userId },
      data: {
        name,
        profilePic: profilePic !== undefined ? profilePic : undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profilePic: true,
      },
    });

    return NextResponse.json(
      { message: "Profile updated successfully.", user: updatedUser },
      { status: 200 }
    );
  } catch (error) {
    console.error("PUT profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile." },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
