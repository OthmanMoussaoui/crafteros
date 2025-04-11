"use client"

import { useEffect, useState } from "react"
import { fetchFromApi, getImages } from "@/lib/api-client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

export default function ApiStatus() {
  const [status, setStatus] = useState<"loading" | "connected" | "error">("loading")
  const [apiInfo, setApiInfo] = useState<any>(null)
  const [images, setImages] = useState<Array<{filename: string, url: string, source: string}>>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function checkApiStatus() {
      try {
        // Fetch the API status
        const info = await fetchFromApi('/')
        setApiInfo(info)
        setStatus("connected")
        
        // Fetch available images
        const imageData = await getImages()
        setImages(imageData.images)
      } catch (err) {
        setStatus("error")
        setError(err instanceof Error ? err.message : "Unknown error")
      }
    }

    checkApiStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          API Connection
          {status === "loading" && <Badge className="bg-yellow-500">Loading...</Badge>}
          {status === "connected" && <Badge className="bg-green-500">Connected</Badge>}
          {status === "error" && <Badge className="bg-red-500">Error</Badge>}
        </CardTitle>
        <CardDescription>
          Connection to Flask backend
        </CardDescription>
      </CardHeader>
      <CardContent>
        {status === "connected" && (
          <div>
            <h3 className="font-medium mb-2">API Info:</h3>
            <pre className="bg-muted p-2 rounded text-xs mb-4">
              {JSON.stringify(apiInfo, null, 2)}
            </pre>
            
            <h3 className="font-medium mb-2">Available Images ({images.length}):</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {images.slice(0, 8).map((image) => (
                <div key={image.url} className="border rounded overflow-hidden">
                  <div className="relative h-20">
                    <Image 
                      src={`${process.env.NEXT_PUBLIC_API_URL}${image.url}`} 
                      alt={image.filename}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-2">
                    <p className="text-xs truncate">{image.filename}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {image.source}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-500">
            <p>Failed to connect to API:</p>
            <p className="font-mono text-sm">{error}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 