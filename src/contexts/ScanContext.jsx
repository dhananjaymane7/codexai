import { createContext, useContext, useState, useCallback } from "react"

const ScanContext = createContext()

export function ScanProvider({ children }) {
  const [scans, setScans] = useState([])
  const [currentScan, setCurrentScan] = useState(null)
  const [issues, setIssues] = useState([])
  const [cache, setCache] = useState({})

  const addScan = useCallback((scanData) => {
    const newScan = {
      id: Date.now(),
      timestamp: new Date(),
      ...scanData,
    }
    setScans((prev) => [newScan, ...prev])
    return newScan
  }, [])

  const updateScan = useCallback((id, updates) => {
    setScans((prev) => prev.map((scan) => (scan.id === id ? { ...scan, ...updates } : scan)))
  }, [])

  const getCachedResult = useCallback(
    (fileHash) => {
      return cache[fileHash]
    },
    [cache],
  )

  const setCachedResult = useCallback((fileHash, result) => {
    setCache((prev) => ({ ...prev, [fileHash]: result }))
  }, [])

  return (
    <ScanContext.Provider
      value={{
        scans,
        currentScan,
        setCurrentScan,
        issues,
        setIssues,
        addScan,
        updateScan,
        getCachedResult,
        setCachedResult,
      }}
    >
      {children}
    </ScanContext.Provider>
  )
}

export function useScan() {
  const context = useContext(ScanContext)
  if (!context) {
    throw new Error("useScan must be used within ScanProvider")
  }
  return context
}
