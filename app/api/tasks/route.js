import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Task from "@/models/Task";
import { verifyToken } from "@/utils/jwt";

export async function GET(req) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const data = verifyToken(token);
    if (!data) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const tasks = await Task.find({ userId: data.userId });
    return NextResponse.json(tasks);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const data = verifyToken(token);
    if (!data) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { title } = await req.json();
    const newTask = await Task.create({ userId: data.userId, title, completed: false });
    return NextResponse.json(newTask);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const data = verifyToken(token);
    if (!data) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id, completed } = await req.json();
    const updated = await Task.findByIdAndUpdate(id, { completed }, { new: true });
    return NextResponse.json(updated);
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await connectDB();
    const token = req.headers.get("authorization")?.split(" ")[1];
    const data = verifyToken(token);
    if (!data) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const { id } = await req.json();
    await Task.findByIdAndDelete(id);
    return NextResponse.json({ message: "Task deleted" });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
