import { createContext, useContext, useState, useCallback } from "react"
import { projectService } from "../services/projectService"

const ProjectContext = createContext()

export function ProjectProvider({ children }) {
  const [projects, setProjects] = useState(projectService.getAllProjects())
  const [currentProject, setCurrentProject] = useState(null)
  const [history, setHistory] = useState(projectService.getAllHistory())

  const addProject = useCallback((projectData) => {
    const newProject = projectService.createProject(projectData)
    setProjects((prev) => [...prev, newProject])
    return newProject
  }, [])

  const updateProject = useCallback((projectId, updates) => {
    const updated = projectService.updateProject(projectId, updates)
    setProjects((prev) => prev.map((p) => (p.id === projectId ? updated : p)))
    return updated
  }, [])

  const deleteProject = useCallback(
    (projectId) => {
      projectService.deleteProject(projectId)
      setProjects((prev) => prev.filter((p) => p.id !== projectId))
      if (currentProject?.id === projectId) {
        setCurrentProject(null)
      }
    },
    [currentProject],
  )

  const addScan = useCallback(
    (scan) => {
      if (currentProject) {
        const updated = projectService.addScanToProject(currentProject.id, scan)
        setCurrentProject(updated)
        setProjects((prev) => prev.map((p) => (p.id === currentProject.id ? updated : p)))
      }
      projectService.addToHistory(scan)
      setHistory((prev) => [...prev, scan])
    },
    [currentProject],
  )

  return (
    <ProjectContext.Provider
      value={{
        projects,
        currentProject,
        setCurrentProject,
        addProject,
        updateProject,
        deleteProject,
        addScan,
        history,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export function useProject() {
  const context = useContext(ProjectContext)
  if (!context) {
    throw new Error("useProject must be used within ProjectProvider")
  }
  return context
}
