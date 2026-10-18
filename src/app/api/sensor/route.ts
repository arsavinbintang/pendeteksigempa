import { NextRequest, NextResponse } from "next/server";
import { getSensorState, recordSensorReading, determineStatus } from "@/lib/sensor-store";
import { SensorPayload, SensorStatus } from "@/lib/types";

// Allow CORS for ESP32 and external devices
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET() {
  try {
    const state = getSensorState();
    return NextResponse.json(
      {
        success: true,
        data: state,
        timestamp: new Date().toISOString(),
      },
      {
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("GET /api/sensor error:", error);
    return NextResponse.json(
      { success: false, error: "Gagal mengambil data sensor" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload" },
        { status: 400, headers: corsHeaders }
      );
    }

    if (body.nilai_getaran === undefined || body.nilai_getaran === null) {
      return NextResponse.json(
        { success: false, error: "Field 'nilai_getaran' wajib disertakan" },
        { status: 400, headers: corsHeaders }
      );
    }

    const rawVal = Number(body.nilai_getaran);
    if (isNaN(rawVal)) {
      return NextResponse.json(
        { success: false, error: "Field 'nilai_getaran' harus berupa angka" },
        { status: 400, headers: corsHeaders }
      );
    }

    const calculatedStatus: SensorStatus = determineStatus(rawVal);
    let validStatus: SensorStatus = calculatedStatus;

    if (body.status && ["AMAN", "WASPADA", "BAHAYA"].includes(body.status.toUpperCase())) {
      validStatus = body.status.toUpperCase() as SensorStatus;
    }

    const payload: SensorPayload = {
      status: validStatus,
      nilai_getaran: rawVal,
      deviceId: body.deviceId || "ESP32-NODE-01",
    };

    const recorded = recordSensorReading(payload);
    const updatedState = getSensorState();

    return NextResponse.json(
      {
        success: true,
        message: "Data getaran seismik berhasil dicatat",
        data: recorded,
        currentStatus: updatedState.current.status,
        shindo: updatedState.current.shindoScale,
        riskPercentage: updatedState.riskPercentage,
      },
      {
        status: 201,
        headers: {
          ...corsHeaders,
          "Cache-Control": "no-store",
        },
      }
    );
  } catch (error) {
    console.error("POST /api/sensor error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
