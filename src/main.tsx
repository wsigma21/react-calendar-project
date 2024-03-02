import React from 'react'
import ReactDOM from 'react-dom/client'
import { RecoilRoot } from "recoil";
import { RouterProvider } from "react-router-dom";
import './styles/index.css'
import './styles/output.css'
import './styles/destyle.css'
import { router } from "./routes";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  </React.StrictMode>,
)
