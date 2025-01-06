
import "./global.css"

export const metadata = {
    title: "Bot Luigi",
    description: "Twój wirtualny asystent - sommelier",
}
const RootLayout = ({ children }) => {
    return (
        <html lang = "pl">
            <body>{children}</body>
        </html>
            )
        }
        
        export default RootLayout;