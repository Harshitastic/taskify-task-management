import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasks = await db.task.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error) {
    console.error("GET tasks error:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, description, priority, dueDate, status, fileUrl, externalLink } = body;

    if (!title || !priority || !dueDate) {
      return NextResponse.json(
        { error: "Missing required fields (title, priority, dueDate)." },
        { status: 400 }
      );
    }

    const task = await db.task.create({
      data: {
        title,
        description: description || "",
        priority: priority.toLowerCase(),
        dueDate: new Date(dueDate),
        status: status || "pending",
        fileUrl: fileUrl || null,
        externalLink: externalLink || null,
        user: {
          connect: { id: session.userId },
        },
      },
    });

    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    console.error("POST task error:", error);
    return NextResponse.json(
      { error: "Failed to create task." },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
