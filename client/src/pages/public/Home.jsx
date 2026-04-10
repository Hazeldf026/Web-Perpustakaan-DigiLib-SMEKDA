import Navbar from "../../components/layout/Navbar"
import HeroSection from "../../components/fragments/HeroSection"
import StatsSection from "../../components/fragments/StatsSection"
import FeatureSection from "../../components/fragments/FeatureSection"
import Footer from "../../components/layout/Footer";

const Home = () => {
    return (
        <div className="bg-gray-50 min-h-screen font-sans">
            {/* navbar */}
            <Navbar />

            {/* herosection */}
            <HeroSection />

            {/* statssection */}
            <StatsSection />

            {/* featuresection */}
            <FeatureSection />

            {/* footer */}
            <Footer />
        </div>
    );
};

export default Home;