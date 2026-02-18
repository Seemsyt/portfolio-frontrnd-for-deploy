"use client"

import { useEffect, useState } from "react"

export default function Profile(){

  const [data, setData] = useState(null)

  useEffect(()=>{

    const token = localStorage.getItem("access")

    fetch("https://portfolio-backend-for-deploy-zwf7.onrender.com/api/auth/profile/", {

      headers:{
        Authorization: `Bearer ${token}`
      }

    })
    .then(res => res.json())
    .then(data => setData(data))

  }, [])

  return (

    <div>

      <h1>Protected Data</h1>

      {data && (

        <>
          <p>ID: {data.id}</p>
          <p>Username: {data.username}</p>
          <p>Email: {data.email}</p>
          <p>{data.message}</p>
        </>

      )}

    </div>
  )
}
