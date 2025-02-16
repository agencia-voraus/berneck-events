"use client"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from "next/navigation"; // Importe o useRouter

import { faGift, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import Image from 'next/image';
import { Footer } from "@/components/Footer";
import '@fortawesome/fontawesome-svg-core/styles.css';


export default function Confirmation() {
  const router = useRouter();
  
  return (
   <>
    <div className="w-full">
      <Image
        src="/banner.jpg"
        alt="Banner Expo Revestir 2025"
        width={1200} 
        height={400} 
        className="w-full object-cover"
      />
    </div>
    <div className="flex flex-col items-center justify-center min-h-screen p-4 mt-[-2.3rem]">
      <div className="bg-white rounded-2xl text-center w-full md:w-96">
        <FontAwesomeIcon icon={faGift} className="text-accent-green text-6xl mb-4" />
        <h2 className="text-2xl font-semibold text-border-primary">Retire seu gift no local indicado</h2>
      </div>

      <div className="flex justify-center w-full">
        <Image 
          src="/local.png" 
          alt="Localização do gift" 
          width={500} 
          height={300} 
          className="max-w-full h-auto mx-auto mt-10"
          priority 
        />
      </div>

      <div className="mt-16 flex flex-col items-center">
          <button
            className="px-12 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition flex items-center justify-center"
            onClick={() => router.push("/client/thank-you")}
          >
            <FontAwesomeIcon icon={faArrowRight} size="lg" />
          </button>
          <p className="mt-2 text-gray-800 font-semibold">Próximo</p>
        </div>
    </div>
    <Footer isFixed={true} />
   </>
  );
}