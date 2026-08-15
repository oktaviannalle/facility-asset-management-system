import { useEffect, useState } from "react";
import axiosClient from "./api/axiosClient";

function App() {
  const [status, setStatus] = useState("Menghubungkan...");

  useEffect(() => {
    axiosClient
      .post("/login", {
        email: "admin@sarpras.test",
        password: "password",
      })
      .then((response) => {
        setStatus(`Berhasil! Login sebagai: ${response.data.user.name}`);
      })
      .catch((error) => {
        setStatus(`Gagal: ${error.message}`);
      });
  }, []);

  return <h1>{status}</h1>;
}

export default App;
