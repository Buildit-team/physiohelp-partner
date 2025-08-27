import { Toaster } from 'react-hot-toast'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import './App.css'

function App() {

  return (
    <>
    <RouterProvider router={router} />
     <Toaster/>
    </>
  )
}

export default App
