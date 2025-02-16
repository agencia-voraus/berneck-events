export function Footer({ isFixed = false }: { isFixed?: boolean }) {
  return (
    <footer className={`${isFixed ? '' : 'absolute'} bottom-0 w-full text-center py-4 text-gray-600 text-sm`}>
      Berneck 2025 - Todos os direitos reservados
    </footer>
  );
}