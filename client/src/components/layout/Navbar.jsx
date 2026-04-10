import { useEffect, useState } from "react"
import LogoHijau from "../../assets/logoHijau.png"
import { Link } from "react-router-dom";

const Navbar = () => {

    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const handlescroll = () => {
            //munculkan navbar saat melewati tinggi yang ditentukan
            if (window.scrollY > window.innerHeight - 100) {
                setIsVisible(true)
            } else {
                setIsVisible(false)
            }
        }

        window.addEventListener("scroll", handlescroll)
        return () => window.removeEventListener("scroll", handlescroll)
    }, [])

    return (
        <nav
        className={`fixed top-0 left-0 w-full z-50 transition-transform duration-300 shadow-md py-4 px-8 flex justify-between items-center bg-white ${
            isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
        >

            {/* logo */}
            <div className="flex items-center gap-2">
                <img src={LogoHijau} alt="Logo" className="h-10"/>
                <span className=" font-bold text-xl text-green-700">DigiLab SMEKDA</span>
            </div>

            {/* buttons */}
            <div className="flex gap-4">
                <Link to="/login-admin" className="px-6 py-3 bg-green-700 text-white font-bold rounded-full hover:bg-green-700 transition">
                    Masuk Admin
                </Link>
                <Link to="/login-user" className="px-6 py-3 bg-green-700 text-white font-bold rounded-full hover:bg-green-700 transition">
                    Masuk User
                </Link>
            </div>

        </nav>
    )
}

export default Navbar