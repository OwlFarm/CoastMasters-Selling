import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const yachts = await prisma.deValkYacht.findMany({
      orderBy: { createdAt: 'desc' }
    });

    console.log(`✅ Retrieved ${yachts.length} yachts from database`);

    return NextResponse.json({
      success: true,
      count: yachts.length,
      yachts
    });

  } catch (error) {
    console.error('❌ Error retrieving yachts:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve yachts',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
