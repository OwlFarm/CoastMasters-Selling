import { NextRequest, NextResponse } from 'next/server';
import { MigrationService } from '@/services/migration-service';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const url = formData.get('url') as string;

    if (!url || !url.trim()) {
      return NextResponse.json(
        { error: 'Please provide a valid URL to migrate from.' },
        { status: 400 }
      );
    }

    console.log('🚀 Starting migration for URL:', url);
    const result = await MigrationService.migrateFromUrl(url);

    if (result.success && result.data) {
      console.log('✅ Migration successful, mapping data to form fields');
      const mappedData = MigrationService.mapToFormFields(result.data);

      return NextResponse.json({
        data: mappedData,
        metadata: result.metadata,
      });
    } else {
      console.error('❌ Migration failed:', result.error);
      return NextResponse.json(
        { error: result.error || 'Migration failed. Please try again.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('❌ Migration API failed:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred during migration.';
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
