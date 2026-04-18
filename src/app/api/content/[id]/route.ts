import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Content from "@/models/Content";

// PATCH: Toggle favorite
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = (session.user as Record<string, unknown>).id;
    const content = await Content.findOne({ _id: params.id, userId });

    if (!content) {
      return NextResponse.json({ success: false, error: "Content not found" }, { status: 404 });
    }

    content.isFavorite = !content.isFavorite;
    await content.save();

    return NextResponse.json({ success: true, data: content });
  } catch (error) {
    console.error("Content update error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}

// DELETE: Remove content
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const userId = (session.user as Record<string, unknown>).id;
    const content = await Content.findOneAndDelete({ _id: params.id, userId });

    if (!content) {
      return NextResponse.json({ success: false, error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Content deleted" });
  } catch (error) {
    console.error("Content delete error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
