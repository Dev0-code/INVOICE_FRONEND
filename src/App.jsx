import { useState } from 'react'
import './App.css'
import InvoiceForm from './components/InvoiceForm'
import { Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <Header/>
    <Routes>
      <Route path='/' element={<InvoiceForm/>}/>
    </Routes>
    <Footer/>
    </>
  )
}

export default App
