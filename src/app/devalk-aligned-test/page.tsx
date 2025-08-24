import SimpleDeValkForm from '@/components/simple-devalk-form';

export default function DeValkAlignedTestPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            🚤 De Valk Aligned Test Page
          </h1>
          <p className="text-lg text-gray-600">
            Testing the De Valk aligned form with working field mapping
          </p>
        </div>
        
        <SimpleDeValkForm />
      </div>
    </div>
  );
}
