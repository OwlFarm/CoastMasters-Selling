import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Yacht ID is required' },
        { status: 400 }
      );
    }

    // Check if yacht exists
    const existingYacht = await prisma.deValkYacht.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingYacht) {
      return NextResponse.json(
        { success: false, error: 'Yacht not found' },
        { status: 404 }
      );
    }

    // Delete the yacht
    await prisma.deValkYacht.delete({
      where: { id: parseInt(id) }
    });

    console.log(`✅ Yacht with ID ${id} deleted successfully`);

    return NextResponse.json({
      success: true,
      message: 'Yacht deleted successfully',
      deletedYacht: existingYacht
    });

  } catch (error) {
    console.error('❌ Error deleting yacht:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete yacht',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
