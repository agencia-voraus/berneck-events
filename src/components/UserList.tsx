import { useEffect, useState } from "react";
import { User } from "@/types/User";
import { Button } from "./Button";
import { Pencil, Trash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface UserListProps {
  onEdit: (user: User) => void;
  onDelete: (id: number) => void;
}

const UserList: React.FC<UserListProps> = ({ onEdit }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/auth/register?page=${page}&limit=10`);
      const data = await response.json();
      setUsers(data.data);
      setTotalPages(data.meta.totalPages);
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      } else {
        const errorData = await response.json();
        console.error('Erro ao deletar usuário:', errorData.error);
      }
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <div className="mt-5 space-y-4 overflow-x-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="p-4 bg-white shadow-lg rounded-lg space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
                <div className="flex justify-end space-x-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))
          : users.map((user) => (
              <div
                key={user.id}
                className="p-4 bg-white shadow-lg rounded-lg hover:shadow-xl transition-shadow space-y-2"
              >
                <h3 className="text-lg font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                  {user.role}
                </span>
                <div className="flex justify-end space-x-2 mt-2">
                  <Button
                    onClick={() => onEdit(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    onClick={() => {
                      const confirmDelete = window.confirm("Tem certeza que deseja deletar este usuário?");
                      if (confirmDelete) {
                        handleDeleteUser(user.id);
                      }
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
                  >
                    <Trash size={16} />
                  </Button>
                </div>
              </div>
            ))}
      </div>

      {!isLoading && (
        <div className="flex justify-between items-center mt-4">
          {page > 1 && (
            <Button onClick={handlePrevPage} className="bg-gray-500 hover:bg-gray-600 text-white">
              Anterior
            </Button>
          )}
          <span className="text-sm text-gray-700">
            Página {page} de {totalPages}
          </span>
          {page < totalPages && (
            <Button onClick={handleNextPage} className="bg-gray-500 hover:bg-gray-600 text-white">
              Próxima
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default UserList;
