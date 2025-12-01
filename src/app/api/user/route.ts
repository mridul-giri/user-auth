import { getCurrentUser } from "@/utils/getCurrentUser";
import prisma from "@/lib/prisma";
import { updateSchema } from "@/schema/updateSchema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";

export async function PATCH(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.format() },
        { status: 400 }
      );
    }
    const { name, email, image, currentPassword, newPassword } = parsed.data;

    const userId = currentUser.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updates: Record<string, any> = {};

    if (email && email !== user.email) {
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 400 }
        );
      }
      updates.email = email;
    }

    if (name) updates.name = name;
    if (image) updates.image = image;

    if (newPassword) {
      if (user.password) {
        if (!currentPassword) {
          return NextResponse.json(
            { error: "currentPassword is required" },
            { status: 400 }
          );
        }
        const isValid = await bcrypt.compare(currentPassword, user.password);
        if (!isValid) {
          return NextResponse.json(
            { error: "Incorrect current password" },
            { status: 400 }
          );
        }
      }
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No changes provided" },
        { status: 400 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: updates,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({ user: updated }, { status: 200 });
  } catch (err) {
    console.error("User update error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userExist = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        password: true,
      },
    });
    if (!userExist) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const passwordExists = userExist.password ? true : false;
    const user: any = {
      id: userExist.id,
      name: userExist.name,
      email: userExist.email,
      passwordExists,
      image: userExist.image,
    };

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("User get error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
