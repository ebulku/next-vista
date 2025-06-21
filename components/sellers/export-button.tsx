'use client'

import { exportSellersAction } from '@/lib/actions'
import { useState, useTransition } from 'react'
import { Button } from '../ui/button'
import { DownloadIcon } from 'lucide-react'

interface ExportSellersButtonProps {
  query?: string
  className?: string
}

export default function ExportSellersButton({
  query = '',
  className = '',
}: ExportSellersButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [isExporting, setIsExporting] = useState(false)

  const downloadCSV = (csvData: string) => {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')

    link.href = url
    link.download = `sellers_export_${
      new Date().toISOString().split('T')[0]
    }.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleExport = () => {
    setIsExporting(true)

    startTransition(async () => {
      try {
        const csvData = await exportSellersAction(query)
        downloadCSV(csvData)
      } catch (error) {
        console.error('Export error:', error)
        alert('Export failed. Please try again.')
      } finally {
        setIsExporting(false)
      }
    })
  }

  const isLoading = isPending || isExporting

  return (
    <Button onClick={handleExport} disabled={isLoading}>
      {isLoading ? (
        'Exporting...'
      ) : (
        <>
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export CSV
        </>
      )}
    </Button>
  )
}
