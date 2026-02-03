import "../styles/globals.css"
import Navbar from "../components/NavBar"

export const metadata = {
  title: "Riddle Romance",
  description: "Acertijos y minijuegos para parejas"
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  )
}
