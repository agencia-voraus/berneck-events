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
            <div className="h-48 overflow-y-auto border p-2 text-sm text-gray-700 mb-4 space-y-2">
              <h1 className="font-semibold mb-2">Termos de Uso</h1>

              <p>
                Bem-vindo. Ao acessar ou utilizar nosso aplicativo, você concorda com
                estes Termos de Uso. Caso não concorde com qualquer um desses termos,
                você não deverá usar o serviço. Recomendamos que leia atentamente todo
                o conteúdo antes de utilizar o aplicativo.
              </p>

              <p>
                <strong>1. Aceitação dos Termos.</strong> Este Termo de Uso constitui
                um acordo legal entre você e a Berneck (CNPJ 81.905.176/0001-94). Ao
                acessar ou usar nosso aplicativo de qualquer forma, você concorda com
                os termos e condições descritos neste documento. A empresa atua como
                Controladora dos dados pessoais tratados no âmbito deste aplicativo,
                comprometendo-se a adotar medidas técnicas e administrativas aptas a
                proteger os dados pessoais contra acessos não autorizados e situações
                acidentais ou ilícitas.
              </p>

              <p>
                <strong>2. Serviços Oferecidos.</strong> O aplicativo oferece a
                participação em um evento no qual os usuários podem se cadastrar para
                receber brindes, tais como produtos físicos ou e-books, dentro dos
                limites estabelecidos pela disponibilidade dos itens. O acesso ao
                evento, a inscrição e o processo de distribuição dos brindes seguem
                regras específicas, as quais você concorda em respeitar ao utilizar o
                serviço. A participação é destinada a pessoas maiores de 18 anos.
              </p>

              <div>
                <p>
                  <strong>3. Cadastro e Dados Pessoais.</strong> Para participar do
                  evento, é necessário que o Usuário se registre no aplicativo
                  fornecendo as seguintes informações pessoais:
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>Nome completo</li>
                  <li>Cargo</li>
                  <li>Data de nascimento</li>
                  <li>Endereço de e-mail</li>
                  <li>Número de celular</li>
                  <li>
                    Endereço completo (CEP, rua, número, complemento, cidade, estado)
                  </li>
                </ul>
                <p>
                  A coleta e o tratamento desses dados são necessários para a execução
                  do evento e a entrega dos brindes ao destinatário correto,
                  possibilitando sua identificação individualizada. Você concorda em
                  fornecer informações verdadeiras, precisas, atuais e completas
                  durante o processo de cadastro.
                </p>
                <p>
                  Ao clicar no check-box respectivo, no momento do cadastro, você está
                  autorizando o envio de comunicações institucionais e materiais
                  publicitários por e-mail, podendo revogar essa autorização a qualquer
                  momento por meio dos canais de contato informados neste Termo.
                </p>
                <p>
                  Está ciente de que poderá solicitar a exclusão de seus dados a
                  qualquer momento, bem como exercer todos os direitos previstos no
                  art. 18 da LGPD, incluindo confirmação da existência de tratamento,
                  acesso, correção, anonimização, eliminação, portabilidade e
                  revogação do consentimento, mediante solicitação pelos canais de
                  contato indicados.
                </p>
                <p>
                  <strong>Política de Privacidade.</strong> Seus dados serão tratados
                  conforme nossa Política de Privacidade, que você pode consultar
                  separadamente no aplicativo. Respeitamos sua privacidade e garantimos
                  a proteção de seus dados pessoais de acordo com a legislação
                  aplicável.
                </p>
                <p>
                  O tratamento dos dados pessoais necessários para o cadastro e
                  participação no evento possui como base legal a execução de
                  procedimentos preliminares relacionados à participação do usuário no
                  evento e à disponibilização dos brindes, nos termos do art. 7º,
                  inciso V, da Lei nº 13.709/2018 (LGPD). Os dados pessoais serão
                  armazenados apenas pelo período necessário para cumprimento das
                  finalidades descritas neste Termo e obrigações legais ou
                  regulatórias aplicáveis, sendo posteriormente eliminados ou
                  anonimizados.
                </p>
              </div>

              <div>
                <p>
                  <strong>4. Atribuição e Distribuição de Brindes.</strong> Os
                  brindes estão sujeitos à disponibilidade, e a distribuição será
                  realizada conforme a ordem de inscrição e a quantidade de itens
                  disponíveis. O usuário poderá ser direcionado a receber um brinde
                  físico ou um e-book, dependendo da quantidade de itens restantes no
                  momento do seu cadastro.
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Códigos de Gift: Cada brinde físico é atribuído a um código único
                    de até 6 dígitos. Este código será enviado ao usuário após o
                    cadastro e poderá ser utilizado para validar o brinde.
                  </li>
                  <li>
                    E-books: Caso o brinde físico tenha esgotado, o usuário receberá
                    um link para fazer o download de um e-book.
                  </li>
                </ul>
                <p>
                  Você entende e concorda que, ao se cadastrar, a distribuição dos
                  brindes pode ser interrompida sem aviso prévio se os itens se
                  esgotarem. Nessa hipótese, um e-book será oferecido como alternativa.
                </p>
              </div>

              <p>
                <strong>5. Uso Indevido e Fraude.</strong> É estritamente proibido o
                uso de informações falsas ou fraudulentas para se cadastrar ou
                reivindicar brindes. Se detectarmos qualquer tentativa de fraude, o
                cadastro será desqualificado e o usuário poderá ser banido de
                participar de futuras promoções.
              </p>

              <div>
                <p>
                  <strong>6. Acesso ao Sistema de Administração.</strong> Apenas
                  administradores do evento têm acesso ao sistema de backend do
                  aplicativo. O administrador pode:
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>Validar e verificar os códigos de gift.</li>
                  <li>Controlar a quantidade de brindes disponíveis.</li>
                  <li>
                    Desabilitar a entrega de brindes a qualquer momento, caso o
                    estoque esteja esgotado ou por questões operacionais.
                  </li>
                </ul>
                <p>
                  Para proteger o acesso ao painel de administração, utilizamos um
                  sistema de login com usuário e senha. O administrador concorda em
                  manter sua senha em sigilo.
                </p>
              </div>

              <div>
                <p>
                  <strong>7. Responsabilidades do Usuário.</strong> O Usuário
                  concorda em:
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Fornecer informações precisas e atualizadas durante o processo de
                    cadastro.
                  </li>
                  <li>
                    Manter seus dados de login em segurança e notificar imediatamente
                    em caso de qualquer uso não autorizado.
                  </li>
                  <li>
                    Não utilizar o aplicativo para fins ilegais ou para fraudar o
                    sistema de distribuição de brindes.
                  </li>
                </ul>
              </div>

              <div>
                <p>
                  <strong>8. Limitação de Responsabilidade.</strong> Nós nos
                  esforçamos para oferecer um serviço seguro e funcional, mas não
                  podemos garantir que o aplicativo estará livre de erros ou
                  ininterrupto. O uso do serviço é por sua conta e risco.
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Problemas Técnicos: Não nos responsabilizamos por falhas técnicas,
                    incluindo, mas não se limitando a, falhas de servidor,
                    interrupções no serviço ou problemas de rede que possam afetar a
                    disponibilidade dos brindes.
                  </li>
                  <li>
                    Falhas de Entrega: Não nos responsabilizamos por problemas com a
                    entrega de brindes físicos, incluindo, mas não se limitando a,
                    problemas de transporte ou de endereço fornecido.
                  </li>
                </ul>
              </div>

              <p>
                <strong>9. Propriedade Intelectual.</strong> Todos os direitos de
                propriedade intelectual relacionados ao aplicativo, incluindo o
                código-fonte, design, conteúdo, logotipos, gráficos e outros
                materiais, são de nossa propriedade ou licenciados para uso. Você
                concorda em não copiar, modificar, distribuir ou criar obras derivadas
                a partir de qualquer material do aplicativo sem nossa autorização
                expressa.
              </p>

              <p>
                <strong>10. Alterações nos Termos de Uso.</strong> Nós nos reservamos
                o direito de atualizar e modificar estes Termos de Uso a qualquer
                momento. Quaisquer alterações serão publicadas neste documento e
                estarão disponíveis para você assim que forem feitas. O uso contínuo
                do aplicativo após essas alterações implica na aceitação dos novos
                termos.
              </p>

              <p>
                <strong>11. Cancelamento e Suspensão.</strong> O seu direito de
                acessar o aplicativo e participar do evento pode ser cancelado ou
                suspenso a qualquer momento, por qualquer motivo, incluindo, mas não
                se limitando a, violação dos Termos de Uso ou tentativa de fraude.
              </p>

              <p>
                <strong>12. Disposições Gerais.</strong> Se qualquer parte destes
                Termos de Uso for considerada inválida ou inexequível, as demais
                disposições permanecerão em vigor. Este acordo é regido pelas leis do
                Brasil, e qualquer disputa será resolvida nos tribunais competentes.
              </p>

              <p>
                <strong>13. Contato.</strong> Caso tenha dúvidas ou queira mais
                informações sobre os Termos de Uso, entre em contato conosco através
                do e-mail marketing@berneck.com.br ou com o nosso Data Protection
                Officer (DPO): dpo@berneck.com.br.
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
            <div className="h-48 overflow-y-auto border p-2 text-sm text-gray-700 mb-4 space-y-2">
              <h1 className="font-semibold mb-2">
                Termo de Aceite para Cadastro no Aplicativo – Ação de Marketing em
                Feira
              </h1>

              <p>
                <strong>1. Objetivo.</strong> Este Termo de Aceite tem como
                finalidade estabelecer as condições para a participação na ação
                de marketing promovida pela Berneck (CNPJ 81.905.176/0001-94),
                por meio do cadastro ou validação de dados no aplicativo oficial
                da campanha. O participante, ao aceitar este termo, terá direito
                à retirada de um gift físico e/ou digital (e-book). A participação
                é destinada a pessoas maiores de 18 anos.
              </p>

              <div>
                <p>
                  <strong>2. Dados Coletados.</strong> Para participar da ação
                  para o recebimento dos gifts, o participante deverá fornecer os
                  seguintes dados pessoais:
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>Nome completo;</li>
                  <li>Cargo;</li>
                  <li>Data de nascimento;</li>
                  <li>Endereço de e-mail;</li>
                  <li>Número de celular;</li>
                  <li>
                    Endereço completo (CEP, rua, número, complemento, cidade,
                    estado).
                  </li>
                </ul>
              </div>

              <p>
                <strong>3. Uso das Informações.</strong> Os dados coletados
                serão utilizados para viabilizar a participação do usuário na
                ação de marketing, incluindo cadastro, validação de identidade,
                controle de participação, prevenção a fraudes e disponibilização
                dos brindes, com fundamento no art. 7º, inciso V, da Lei nº
                13.709/2018 (LGPD). Os dados poderão ser compartilhados
                exclusivamente com eventuais prestadores de serviços contratados
                para operacionalização do aplicativo e da campanha, observadas
                obrigações de confidencialidade e segurança da informação, não
                sendo utilizados para finalidades distintas das previstas neste
                Termo. Os dados pessoais serão armazenados apenas pelo período
                necessário para cumprimento das finalidades descritas neste
                Termo e obrigações legais ou regulatórias aplicáveis, sendo
                posteriormente eliminados ou anonimizados.
              </p>

              <p>
                <strong>4. Proteção de Dados.</strong> A Berneck se compromete
                a proteger a privacidade dos participantes, garantindo que os
                dados fornecidos sejam tratados conforme as disposições da Lei
                Geral de Proteção de Dados (LGPD – Lei nº 13.709/2018). O
                participante poderá, a qualquer momento, solicitar a atualização
                ou exclusão de seus dados da base da empresa, ou exercer qualquer
                um dos direitos previstos no art. 18 da LGPD, por meio do e-mail
                marketing@berneck.com.br ou com o nosso Data Protection Officer
                (DPO): dpo@berneck.com.br. A Berneck adota medidas técnicas e
                administrativas aptas a proteger os dados pessoais contra acessos
                não autorizados e situações acidentais ou ilícitas de
                destruição, perda, alteração, comunicação ou difusão.
              </p>

              <div>
                <p>
                  <strong>5. Aceite dos Termos.</strong> Ao clicar em &quot;Aceito
                  os Termos&quot; no aplicativo, o participante entende e confirma
                  que:
                </p>
                <ul className="list-disc list-inside ml-4">
                  <li>
                    Está ciente e concorda com os termos estabelecidos neste
                    documento;
                  </li>
                  <li>
                    Declara estar ciente do tratamento dos dados pessoais para as
                    finalidades descritas neste Termo;
                  </li>
                  <li>
                    Compreende que os dados não serão compartilhados com
                    terceiros para finalidades comerciais ou distintas das
                    previstas neste Termo;
                  </li>
                  <li>
                    Ao clicar no check-box respectivo, no momento do cadastro,
                    você está autorizando o envio de comunicações institucionais
                    e materiais publicitários por e-mail, podendo revogar essa
                    autorização a qualquer momento por meio dos canais de contato
                    informados neste Termo. Está ciente de que poderá solicitar a
                    exclusão de seus dados a qualquer momento, bem como exercer
                    todos os direitos previstos no art. 18 da LGPD, incluindo
                    confirmação da existência de tratamento, acesso, correção,
                    anonimização, eliminação, portabilidade e revogação do
                    consentimento, mediante solicitação pelos canais de contato
                    indicados.
                  </li>
                </ul>
                <p>
                  A Berneck agradece sua participação e deseja uma excelente
                  experiência!
                </p>
              </div>
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
