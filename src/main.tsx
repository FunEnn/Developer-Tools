import React from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { router } from "./router";
import './index.css'

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
    <SpeedInsights />
  </React.StrictMode>
)
