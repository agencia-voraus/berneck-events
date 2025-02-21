import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faYoutube, faLinkedinIn, faInstagram, faFacebookF, faPinterestP } from '@fortawesome/free-brands-svg-icons';
import { Footer } from '@/components/Footer';
import Image from 'next/image';
import Link from 'next/link';

export default function ThankYou() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center px-4 py-8 sm:py-12 md:py-16 lg:py-20">
      <div className="flex justify-center mb-4">
        <Image src="/logo.png" alt="Logo da empresa" width={200} height={50} priority />
      </div>  
      <p className="mt-4 text-2xl sm:text-3xl md:text-4xl text-border-primary">
        Obrigado por nos <br /> visitar na Expo <br /> Revestir 2025
      </p>
      
      <p className="mt-5 font-bold text-lg sm:text-xl border-t border-gray-300 pt-2">
        Acompanhe nossas Redes Sociais
      </p>
      
      <div className="flex flex-wrap justify-center gap-4 mt-4">
        <a
          href="https://www.facebook.com/BerneckSA"
          target="_blank"
          className="text-white text-lg sm:text-xl flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-green shadow-md hover:bg-green-800 transition-all duration-300 p-2"
          aria-label="Facebook"
        >
          <FontAwesomeIcon icon={faFacebookF} width={20} />
        </a>
        <a
          href="https://www.instagram.com/berneckoficial/"
          target="_blank"
          className="text-white text-lg sm:text-xl flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-green shadow-md hover:bg-green-800 transition-all duration-300 p-2"
          aria-label="Instagram"
        >
          <FontAwesomeIcon icon={faInstagram} width={25} />
        </a>
        <a
          href="https://www.youtube.com/Berneckoficial"
          target="_blank"
          className="text-white text-lg sm:text-xl flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-green shadow-md hover:bg-green-800 transition-all duration-300 p-2"
          aria-label="YouTube"
        >
          <FontAwesomeIcon icon={faYoutube} width={25} />
        </a>
        <a
          href="https://www.linkedin.com/company/berneck-paineis-e-serrados"
          target="_blank"
          className="text-white text-lg sm:text-xl flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-green shadow-md hover:bg-green-800 transition-all duration-300 p-2"
          aria-label="LinkedIn"
        >
          <FontAwesomeIcon icon={faLinkedinIn} width={25} />
        </a>
        <a
          href="https://br.pinterest.com/berneckoficial/"
          target="_blank"
          className="text-white text-lg sm:text-xl flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-accent-green shadow-md hover:bg-green-800 transition-all duration-300 p-2"
          aria-label="Pinterest"
        >
          <FontAwesomeIcon icon={faPinterestP} width={25} />
        </a>
      </div>

      <Link
        href="/"
        className="mt-6 bg-accent-green text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-800 transition-all duration-300"
      >
        Ir para Home
      </Link>

      <Footer />
    </div>
  );
}
