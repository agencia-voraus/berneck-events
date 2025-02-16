"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { InputCustom } from "@/components/InputCustom";
import Image from "next/image";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [actionTermsAccepted, setActionTermsAccepted] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<string | null>(null);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const termsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("leadId");
    const formCompleted = localStorage.getItem("formCompleted");

    if (storedEmail == 'undefined') {
      localStorage.removeItem("leadId");
      localStorage.removeItem("formCompleted");
    }
    
    if (storedEmail) {
      router.push("/client/form");
    }

    if (formCompleted) {
      router.push("/client/gift");
    }
  }, [router]);

  useEffect(() => {
    if (termsRef.current) {
      const { scrollHeight, clientHeight } = termsRef.current;
      setIsScrollable(scrollHeight > clientHeight);
    }
  }, [showModal]);

  const isButtonDisabled = !email || !termsAccepted || !actionTermsAccepted || loading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    if (!validateEmail(email)) {
      setEmailError("Formato de e-mail inválido.");
      return;
    }
  
    if (isButtonDisabled) return;
  
    setLoading(true);
    try {
      const response = await fetch(`/api/lead`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }), 
      });
    
      if (!response.ok) {
        throw new Error("Erro ao salvar o e-mail");
      }
    
      const data = await response.json();
      const leadId = data.id ?? data.lead.id;
      console.log(leadId);
      localStorage.setItem("leadId", leadId);
      
      router.push(`/client/form?leadId=${leadId}`);
    } catch (error) {
      console.error("Erro ao salvar e-mail:", error);
      alert("Erro ao salvar e-mail. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };
  


  const handleCheckboxClick = (type: string) => {
    if (type === "terms") {
      if (termsAccepted) {
        setTermsAccepted(false);
      } else {
        setModalType("terms");
        setShowModal(true);
      }
    }
    if (type === "actionTerms") {
      if (actionTermsAccepted) {
        setActionTermsAccepted(false);
      } else {
        setModalType("actionTerms");
        setShowModal(true);
      }
    }
  };

  const handleScroll = () => {
    if (termsRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = termsRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 10) {
        setIsScrollable(false);
      }
    }
  };

  const handleAcceptTerms = () => {
    if (modalType === "terms") setTermsAccepted(true);
    if (modalType === "actionTerms") setActionTermsAccepted(true);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg">
        <div className="flex justify-center mb-4 mt-7">
          <Image src="/logo.png" alt="Logo da empresa" width={200} height={50} priority />
        </div>     
        <form onSubmit={handleSubmit} className="space-y-4">
          <InputCustom 
            type="email"
            placeholder="Digite seu e-mail"
            label="E-mail"
            className="mt-20"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError(null);
            }}
            required
          />

          {emailError && <p className="text-red-500 text-sm">{emailError}</p>}


          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              checked={termsAccepted}
              onChange={() => handleCheckboxClick("terms")}
              className="w-4 h-4 border-gray-300 rounded accent-green-700 cursor-pointer"
            />
            <label htmlFor="terms" className="text-gray-700 text-sm">
              Li e concordo com os termos e condições
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="actionTerms"
              checked={actionTermsAccepted}
              onChange={() => handleCheckboxClick("actionTerms")}
              className="w-4 h-4 border-gray-300 rounded accent-green-700 cursor-pointer"
            />
            <label htmlFor="actionTerms" className="text-gray-700 text-sm">
              Li e concordo com os termos da ação
            </label>
          </div>
          <Button
            type="submit"
            disabled={isButtonDisabled}
            className={`w-full p-3 rounded-lg h-38 ${
              isButtonDisabled
                ? "!bg-gray-400 cursor-not-allowed"
                : "bg-green-800 text-white hover:bg-green-700"
            }`}
          >
            {loading ? "Carregando..." : "Enviar"}
          </Button>
        </form>
      </div>

      <Footer />
      
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Termos e Condições</h2>
            <div
              ref={termsRef}
              onScroll={handleScroll}
              className="h-48 overflow-y-auto border p-2 text-sm text-gray-700 mb-4"
            >
              <p>
                Bem-vindo. Ao acessar ou utilizar nosso aplicativo, você concorda com
                estes Termos de Uso. Caso não concorde com qualquer um desses termos,
                você não deverá usar o serviço. Recomendamos que leia atentamente
                todo o conteúdo antes de utilizar o aplicativo.
              </p>
              <h2 className="font-bold mt-2">1. Aceitação dos Termos</h2>
              <p>
                Este Termo de Uso constitui um acordo legal entre você e [Nome da
                Empresa ou Aplicativo]. Ao acessar ou usar nosso aplicativo de
                qualquer forma, você concorda com os termos e condições descritos
                neste documento.
              </p>
              <h2 className="font-bold mt-2">2. Serviços Oferecidos</h2>
              <p>
                O aplicativo oferece a participação em um evento no qual os usuários
                podem se cadastrar para receber brindes, tais como produtos físicos ou
                e-books, dentro dos limites estabelecidos pela disponibilidade dos
                itens.
              </p>
              <h2 className="font-bold mt-2">3. Cadastro e Dados Pessoais</h2>
              <p>
                Para participar do evento, é necessário que o Usuário se registre no
                aplicativo fornecendo informações pessoais.
              </p>
              <h2 className="font-bold mt-2">4. Atribuição e Distribuição de Brindes</h2>
              <p>
                Os brindes estão sujeitos à disponibilidade, e a distribuição será
                realizada conforme a ordem de inscrição e a quantidade de itens
                disponíveis.
              </p>
              <h2 className="font-bold mt-2">5. Uso Indevido e Fraude</h2>
              <p>
                É estritamente proibido o uso de informações falsas ou fraudulentas
                para se cadastrar ou reivindicar brindes.
              </p>
              <h2 className="font-bold mt-2">6. Acesso ao Sistema de Administração</h2>
              <p>
                Apenas administradores do evento têm acesso ao sistema de backend do
                aplicativo.
              </p>
              <h2 className="font-bold mt-2">7. Responsabilidades do Usuário</h2>
              <p>
                O Usuário concorda em fornecer informações precisas e atualizadas
                durante o processo de cadastro.
              </p>
              <h2 className="font-bold mt-2">8. Limitação de Responsabilidade</h2>
              <p>
                Nós nos esforçamos para oferecer um serviço seguro e funcional, mas
                não podemos garantir que o aplicativo estará livre de erros ou
                ininterrupto.
              </p>
              <h2 className="font-bold mt-2">9. Propriedade Intelectual</h2>
              <p>
                Todos os direitos de propriedade intelectual relacionados ao
                aplicativo são de nossa propriedade ou licenciados para uso.
              </p>
              <h2 className="font-bold mt-2">10. Alterações nos Termos de Uso</h2>
              <p>
                Nós nos reservamos o direito de atualizar e modificar estes Termos de
                Uso a qualquer momento.
              </p>
              <h2 className="font-bold mt-2">11. Cancelamento e Suspensão</h2>
              <p>
                O seu direito de acessar o aplicativo e participar do evento pode ser
                cancelado ou suspenso a qualquer momento.
              </p>
              <h2 className="font-bold mt-2">12. Disposições Gerais</h2>
              <p>
                Se qualquer parte destes Termos de Uso for considerada inválida ou
                inexequível, as demais disposições permanecerão em vigor.
              </p>
              <h2 className="font-bold mt-2">13. Contato</h2>
              <p>
                Caso tenha dúvidas ou queira mais informações sobre os Termos de Uso,
                entre em contato conosco através do e-mail [email de contato].
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="w-full p-2 rounded-lg text-red-500 border border-red-500"
              >
                Não Aceitar
              </button>
              <button
                onClick={handleAcceptTerms}
                disabled={isScrollable}
                className={`w-full p-2 rounded-lg transition ${
                  isScrollable ? "bg-gray-400 cursor-not-allowed" : "bg-green-800 text-white hover:bg-green-700"
                }`}
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
