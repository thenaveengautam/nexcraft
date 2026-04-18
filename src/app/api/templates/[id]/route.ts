import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Template from "@/models/Template";

// DELETE: Remove custom template
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
    const template = await Template.findOneAndDelete({
      _id: params.id,
      userId,
      isDefault: false,
    });

    if (!template) {
      return NextResponse.json({ success: false, error: "Template not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Template deleted" });
  } catch (error) {
    console.error("Template delete error:", error);
    return NextResponse.json({ success: false, error: "Something went wrong" }, { status: 500 });
  }
}
