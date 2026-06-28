import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

async function verifyTaskOwnership(taskId: string, userId: string) {
  const task = await db.task.findUnique({
    where: { id: taskId },
  });

  if (!task) return { status: 404, error: "Task not found." };
  if (task.userId !== userId) return { status: 403, error: "Access denied." };

  return { task };
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, error, task } = await verifyTaskOwnership(id, session.userId);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    return NextResponse.json(task, { status: 200 });
  } catch (error) {
    console.error("GET single task error:", error);
    return NextResponse.json(
      { error: "Failed to fetch task." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, error } = await verifyTaskOwnership(id, session.userId);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    const body = await req.json();
    const { title, description, priority, dueDate, status: taskStatus, fileUrl, externalLink } = body;

    const updatedData: any = {};
    if (title !== undefined) updatedData.title = title;
    if (description !== undefined) updatedData.description = description || "";
    if (priority !== undefined) updatedData.priority = priority.toLowerCase();
    if (dueDate !== undefined) updatedData.dueDate = new Date(dueDate);
    if (taskStatus !== undefined) updatedData.status = taskStatus;
    if (fileUrl !== undefined) updatedData.fileUrl = fileUrl || null;
    if (externalLink !== undefined) updatedData.externalLink = externalLink || null;

    const updatedTask = await db.task.update({
      where: { id },
      data: updatedData,
    });

    return NextResponse.json(updatedTask, { status: 200 });
  } catch (error) {
    console.error("PUT task error:", error);
    return NextResponse.json(
      { error: "Failed to update task." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status, error } = await verifyTaskOwnership(id, session.userId);
    if (error) {
      return NextResponse.json({ error }, { status });
    }

    await db.task.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Task deleted successfully." }, { status: 200 });
  } catch (error) {
    console.error("DELETE task error:", error);
    return NextResponse.json(
      { error: "Failed to delete task." },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
