"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { Footer } from "@/components/Footer";
import { InputCustom } from "@/components/InputCustom";
import Image from "next/image";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
  const [actionTermsAccepted, setActionTermsAccepted] =
    useState<boolean>(false);
  const [showTermsModal, setShowTermsModal] = useState<boolean>(false);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedEmail = localStorage.getItem("leadId");
    const formCompleted = localStorage.getItem("formCompleted");

    if (storedEmail == "undefined") {
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

  const isButtonDisabled =
    !email || !termsAccepted || !actionTermsAccepted || loading;

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

  // Função para abrir o modal respectivo
  const handleCheckboxClick = (type: string) => {
    if (type === "terms") {
      setShowTermsModal(true);
    } else if (type === "actionTerms") {
      setShowActionModal(true);
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-screen bg-white p-4">
      <div className="w-full max-w-sm bg-white p-6 rounded-lg">
        <div className="flex justify-center mb-4 mt-7">
          <Image
            src="/logo.png"
            alt="Logo da empresa"
            width={200}
            height={50}
            priority
          />
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
              Li e concordo com os termos de uso
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

      {showTermsModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Termos de Uso</h2>
            <div className="h-48 overflow-y-auto border p-2 text-sm text-gray-700 mb-4">
            <h1>Termos de Uso</h1>
            Bem-vindo. Ao acessar ou utilizar nosso aplicativo, você concorda com estes Termos de Uso. Caso não
            concorde com qualquer um desses termos, você não deverá usar o serviço. Recomendamos que leia
            atentamente todo o conteúdo antes de utilizar o aplicativo.
            1. Aceitação dos Termos
            Este Termo de Uso constitui um acordo legal entre você e a Berneck. Ao acessar ou usar nosso aplicativo
            de qualquer forma, você concorda com os termos e condições descritos neste documento.
            2. Serviços Oferecidos
            O aplicativo oferece a participação em um evento no qual os usuários podem se cadastrar para receber
            brindes, tais como produtos físicos ou e-books, dentro dos limites estabelecidos pela disponibilidade dos
            itens. O acesso ao evento, a inscrição e o processo de distribuição dos brindes seguem regras específicas,
            as quais você concorda em respeitar ao utilizar o serviço.
            3. Cadastro e Dados Pessoais
            Para participar do evento, é necessário que o Usuário se registre no aplicativo fornecendo as seguintes
            informações pessoais:
            ● Nome completo
            ● Profissão
            ● Data de nascimento
            ● Endereço de e-mail
            ● Número de celular
            ● Endereço completo (CEP, rua, número, complemento, cidade, estado)
            A coleta e o tratamento desses dados são necessários para a execução do evento e a entrega dos brindes
            ao destinatário correto, possibilitando sua identificação individualizada. Você concorda em fornecer
            informações verdadeiras, precisas, atuais e completas durante o processo de cadastro.
            Ao clicar no check-box respectivo, no momento do cadastro, você está autorizando o recebimento de
            material publicitário por e-mail, após a realização do evento.
            Está ciente de que poderá solicitar a exclusão de seus dados a qualquer momento.
            Política de Privacidade: Seus dados serão tratados conforme nossa Política de Privacidade, que você pode
            consultar separadamente no aplicativo. Respeitamos sua privacidade e garantimos a proteção de seus
            dados pessoais de acordo com a legislação aplicável.
            4. Atribuição e Distribuição de Brindes
            Os brindes estão sujeitos à disponibilidade, e a distribuição será realizada conforme a ordem de inscrição e
            a quantidade de itens disponíveis. O usuário poderá ser direcionado a receber um brinde físico ou um ebook, dependendo da quantidade de itens disponíveis em estoque no momento do seu cadastro.
            ● Códigos de Gift: Cada brinde físico é atribuído a um código único de até 6 dígitos. Este código será enviado
            ao usuário após o cadastro e poderá ser utilizado para validar o brinde.
            ● E-books: Caso o brinde físico tenha esgotado, o usuário receberá um link para fazer o download de um ebook.
            Você entende e concorda que, ao se cadastrar, a distribuição dos brindes pode ser interrompida sem aviso
            prévio se os itens se esgotarem. Nessa hipótese, um e-book será oferecido como alternativa.
            5. Uso Indevido e Fraude
            É estritamente proibido o uso de informações falsas ou fraudulentas para se cadastrar ou reivindicar brindes.
            Se detectarmos qualquer tentativa de fraude, o cadastro será desqualificado e o usuário poderá ser banido
            de participar de futuras promoções.
            6. Acesso ao Sistema de Administração
            Apenas administradores do evento têm acesso ao sistema de backend do aplicativo. O administrador pode:
            ● Validar e verificar os códigos de gift.
            ● Controlar a quantidade de brindes disponíveis.
            ● Desabilitar a entrega de brindes a qualquer momento, caso o estoque esteja esgotado ou por questões
            operacionais.
            Para proteger o acesso ao painel de administração, utilizamos um sistema de login com usuário e senha. O
            administrador concorda em manter sua senha em sigilo.
            7. Responsabilidades do Usuário
            O Usuário concorda em:
            ● Fornecer informações precisas e atualizadas durante o processo de cadastro.
            ● Manter seus dados de login em segurança e notificar imediatamente em caso de qualquer uso não
            autorizado.
            ● Não utilizar o aplicativo para fins ilegais ou para fraudar o sistema de distribuição de brindes.
            8. Limitação de Responsabilidade
            Nós nos esforçamos para oferecer um serviço seguro e funcional, mas não podemos garantir que o aplicativo
            estará livre de erros ou ininterrupto. O uso do serviço é por sua conta e risco.
            ● Problemas Técnicos: Não nos responsabilizamos por falhas técnicas, incluindo, mas não se limitando a,
            falhas de servidor, interrupções no serviço ou problemas de rede que possam afetar a disponibilidade dos
            brindes.
            ● Falhas de Entrega: Não nos responsabilizamos por problemas com a entrega de brindes físicos, incluindo,
            mas não se limitando a, problemas de transporte ou de endereço fornecido.
            9. Propriedade Intelectual
            Todos os direitos de propriedade intelectual relacionados ao aplicativo, incluindo o código-fonte, design,
            conteúdo, logotipos, gráficos e outros materiais, são de nossa propriedade ou licenciados para uso. Você
            concorda em não copiar, modificar, distribuir ou criar obras derivadas a partir de qualquer material do
            aplicativo sem nossa autorização expressa.
            10. Alterações nos Termos de Uso
            Nós nos reservamos o direito de atualizar e modificar estes Termos de Uso a qualquer momento. Quaisquer
            alterações serão publicadas neste documento e estarão disponíveis para você assim que forem feitas. O
            uso contínuo do aplicativo após essas alterações implica na aceitação dos novos termos.
            11. Cancelamento e Suspensão
            O seu direito de acessar o aplicativo e participar do evento pode ser cancelado ou suspenso a qualquer
            momento, por qualquer motivo, incluindo, mas não se limitando a violação dos Termos de Uso ou tentativa
            de fraude.
            12. Disposições Gerais
            Se qualquer parte destes Termos de Uso for considerada inválida ou inexequível, as demais disposições
            permanecerão em vigor. Este acordo é regido pelas leis do Brasil, e qualquer disputa será resolvida nos
            tribunais competentes.
            13. Contato
            Caso tenha dúvidas ou queira mais informações sobre os Termos de Uso, entre em contato conosco através
            do e-mail marketing@berneck.com.br
              </p>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowTermsModal(false)}
                className="w-full p-2 rounded-lg text-red-500 border border-red-500"
              >
                Não Aceitar
              </button>
              <button
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTermsModal(false);
                }}
                className="w-full p-2 rounded-lg bg-green-800 text-white hover:bg-green-700"
              >
                Aceitar
              </button>
            </div>
          </div>
        </div>
      )}

      {showActionModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Termos da Ação</h2>
            <div className="h-48 overflow-y-auto border p-2 text-sm text-gray-700 mb-4">
            <h1>TERMO DE ACEITE PARA CADASTRO NO APLICATIVO – AÇÃO DE MARKETING EM FEIRA</h1>
            1. OBJETIVO:
            Este Termo de Aceite tem como finalidade estabelecer as condições para a participação na ação de
            marketing promovida pela Berneck, por meio do cadastro ou validação de dados no aplicativo oficial da
            campanha. O participante, ao aceitar este termo, terá direito à retirada de um gift físico e/ou digital (ebook).
            2. DADOS COLETADOS
            Para participar da ação para o recebimento dos gifts, o participante deverá fornecer os seguintes dados
            pessoais:
            • Nome completo;
            • Profissão;
            • Data de nascimento;
            • Endereço de e-mail;
            • Número de celular;
            • Endereço completo (CEP, rua, número, complemento, cidade, estado).
            3. USO DAS INFORMAÇÕES
            Os dados coletados serão utilizados exclusivamente para fins de cadastro e validação na base de dados
            da Berneck, garantindo o controle de participação na ação de marketing. Nenhuma informação será
            compartilhada com terceiros.
            4. PROTEÇÃO DE DADOS
            A Berneck se compromete a proteger a privacidade dos participantes, garantindo que os dados fornecidos
            sejam tratados conforme as disposições da Lei Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018).
            O participante poderá, a qualquer momento, solicitar a atualização ou exclusão de seus dados da base da
            empresa, por meio do e-mail marketing@berneck.com.br.
            5. ACEITE DOS TERMOS
            Ao clicar em "Aceito os Termos" no aplicativo, o participante entende e confirma que:
            • Está ciente e concorda com os termos estabelecidos neste documento;
            • Autoriza a coleta e o tratamento dos dados fornecidos para os fins descritos;
            • Compreende que os dados não serão compartilhados com terceiros;
            • Ao clicar no check-box respectivo, no momento do cadastro, está autorizando o recebimento de
            material publicitário por email, após a realização do evento;
            • Está ciente de que poderá solicitar a exclusão de seus dados a qualquer momento.
            A Berneck agradece sua participação e deseja uma excelente experiência!
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowActionModal(false)}
                className="w-full p-2 rounded-lg text-red-500 border border-red-500"
              >
                Não Aceitar
              </button>
              <button
                onClick={() => {
                  setActionTermsAccepted(true);
                  setShowActionModal(false);
                }}
                className="w-full p-2 rounded-lg bg-green-800 text-white hover:bg-green-700"
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
