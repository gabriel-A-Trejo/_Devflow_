import { NextResponse } from "next/server";

export const success = <T>(data?: T, status = 200) =>
  NextResponse.json(
    {
      success: true,
      data,
    },
    { status },
  );
