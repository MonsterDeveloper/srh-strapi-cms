import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { RiFileTextLine } from '@remixicon/react'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Card Not Found</h1>
        <p className="text-gray-600 mt-1">
          The disability card you're looking for doesn't exist.
        </p>
      </div>
      
      <Card className="p-8 text-center">
        <RiFileTextLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Disability card not found</h3>
        <p className="text-gray-500 mb-4">
          This card may have been deleted or you may not have permission to view it.
        </p>
        <Button href="/disability-cards">Back to Cards</Button>
      </Card>
    </div>
  )
} 