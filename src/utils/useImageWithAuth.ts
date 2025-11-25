import { useEffect, useState } from "react";

/**
 * Hook to load an image with JWT authentication
 * Returns a blob URL that can be used in img src or backgroundImage
 */
export function useImageWithAuth(imageUrl: string | undefined): {
  blobUrl: string | null;
  loading: boolean;
  error: Error | null;
} {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!imageUrl) {
      setBlobUrl(null);
      setLoading(false);
      setError(null);
      return;
    }

    // If URL doesn't point to filebrowser service, use it directly
    // (assuming it's a public URL or doesn't need auth)
    const isFilebrowserUrl = imageUrl.includes("/api/download") || imageUrl.includes("/api/browse");
    
    if (!isFilebrowserUrl) {
      setBlobUrl(imageUrl);
      setLoading(false);
      return;
    }

    // For filebrowser URLs, fetch with JWT token
    setLoading(true);
    setError(null);
    const token = localStorage.getItem("authToken");

    fetch(imageUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load image: ${response.statusText}`);
        }
        return response.blob();
      })
      .then((blob) => {
        const url = URL.createObjectURL(blob);
        setBlobUrl(url);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load image with auth:", err);
        setError(err as Error);
        setBlobUrl(null);
        setLoading(false);
      });

    // Cleanup blob URL on unmount or when imageUrl changes
    return () => {
      if (blobUrl && blobUrl.startsWith("blob:")) {
        URL.revokeObjectURL(blobUrl);
      }
    };
  }, [imageUrl]);

  return { blobUrl, loading, error };
}

