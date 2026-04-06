import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ShieldCheck, UserCog, Edit, Check, X } from "lucide-react";
import { navItems } from "@/components/layout/AppSidebar";

type Profile = {
  id: string;
  email: string;
  is_admin: boolean;
  allowed_views: string[];
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Agregar states para Crear Usuario
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserViews, setNewUserViews] = useState<string[]>([]);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("profiles").select("*").order("email");
    if (error) {
      console.error("Error cargando usuarios:", error);
    } else {
      setUsers(data || []);
    }
    setLoading(false);
  };

  const openEdit = (user: Profile) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeEdit = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const toggleView = (viewPath: string) => {
    if (!selectedUser) return;
    const views = selectedUser.allowed_views || [];
    const isAllowed = views.includes(viewPath);
    
    let newViews = [];
    if (isAllowed) {
      newViews = views.filter(v => v !== viewPath);
    } else {
      newViews = [...views, viewPath];
    }
    setSelectedUser({ ...selectedUser, allowed_views: newViews });
  };

  const toggleAdmin = () => {
    if (!selectedUser) return;
    setSelectedUser({ ...selectedUser, is_admin: !selectedUser.is_admin });
  };

  const handleCreateUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      alert("Por favor ingresa correo y contraseña.");
      return;
    }
    setIsCreating(true);
    
    // Aquí llamamos a la Edge Function de Supabase que construimos
    const { data, error } = await supabase.functions.invoke('clever-function', {
      body: {
        email: newUserEmail,
        password: newUserPassword,
        allowed_views: newUserViews
      }
    });

    setIsCreating(false);

    if (error) {
      console.error(error);
      alert("Error al crear usuario. Verifica los comandos de la Edge Function.");
    } else {
      alert(`Usuario ${newUserEmail} creado con éxito.`);
      setIsCreateModalOpen(false);
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserViews([]);
      fetchUsers();
    }
  };

  const toggleNewUserView = (viewPath: string) => {
    if (newUserViews.includes(viewPath)) {
      setNewUserViews(newUserViews.filter(v => v !== viewPath));
    } else {
      setNewUserViews([...newUserViews, viewPath]);
    }
  };

  const saveChanges = async () => {
    if (!selectedUser) return;
    
    const { error } = await supabase
      .from("profiles")
      .update({ 
        allowed_views: selectedUser.allowed_views, 
        is_admin: selectedUser.is_admin 
      })
      .eq("id", selectedUser.id);
      
    if (error) {
      alert("Error guardando cambios. ¿Eres administrador realmente?");
      console.error(error);
    } else {
      fetchUsers();
      closeEdit();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 relative">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
              <ShieldCheck className="text-primary w-8 h-8" />
              Control de Acceso
            </h1>
            <p className="text-muted-foreground text-sm max-w-xl pr-4 mt-2">
              Gestiona los usuarios de la plataforma y asígnales a qué módulos (vistas) pueden acceder.
            </p>
          </div>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="shrink-0 flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-black uppercase text-xs tracking-wider rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all"
          >
            + Crear Usuario
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl shadow-sm border border-border/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs uppercase bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 font-bold text-center">Rol</th>
                <th className="px-6 py-4 font-bold text-center">Vistas Permitidas</th>
                <th className="px-6 py-4 font-bold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="text-center py-8">Cargando usuarios...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="text-center py-8">No se encontraron perfiles. ¿Ya creaste un usuario en auth?</td></tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 font-medium">{user.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${user.is_admin ? 'bg-primary/10 text-primary' : 'bg-secondary/20 text-secondary-foreground'}`}>
                        {user.is_admin ? 'Admin' : 'Usuario'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded-md">
                        {user.allowed_views?.length || 0} módulos
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button onClick={() => openEdit(user)} className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal / Drawer for Editing */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-border/50 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">{selectedUser.email}</h3>
                  <p className="text-xs text-muted-foreground mt-1 text-mono truncate max-w-[200px]">ID: {selectedUser.id}</p>
                </div>
              </div>
              <button onClick={closeEdit} className="p-2 rounded-full hover:bg-muted text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Role Toggle */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-muted/10">
                <div>
                  <h4 className="font-bold text-sm">Privilegios de Administrador</h4>
                  <p className="text-xs text-muted-foreground">Otorga o quita la capacidad de entrar a esta pantalla.</p>
                </div>
                <button 
                  onClick={toggleAdmin}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${selectedUser.is_admin ? 'bg-primary' : 'bg-muted'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${selectedUser.is_admin ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              {/* Views Checklist */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <CheckSquareIcon className="w-4 h-4 text-primary" />
                  Módulos Permitidos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {navItems.map((item) => {
                    const isChecked = selectedUser.allowed_views?.includes(item.path);
                    return (
                      <label 
                        key={item.path} 
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-primary/5 border-primary/30' : 'bg-transparent border-border/50 hover:bg-muted/50'}`}
                        onClick={(e) => { e.preventDefault(); toggleView(item.path); }}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 transition-colors ${isChecked ? 'bg-primary border-primary text-primary-foreground' : 'bg-transparent border-input'}`}>
                          {isChecked && <Check className="w-3.5 h-3.5 shadow-sm" strokeWidth={3} />}
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <item.icon className={`w-4 h-4 shrink-0 ${isChecked ? 'text-primary' : 'text-muted-foreground'}`} />
                          <span className={`text-sm font-medium truncate ${isChecked ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
              
            </div>

            <div className="p-6 border-t border-border/50 bg-muted/20 flex justify-end gap-3">
              <button onClick={closeEdit} className="px-5 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors">
                Cancelar
              </button>
              <button onClick={saveChanges} className="px-6 py-2 bg-primary text-primary-foreground text-sm font-bold rounded-xl shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Creating New User */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden border border-border/50 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-border/50 flex justify-between items-center bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <UserCog className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-none">Crear Nuevo Usuario</h3>
                  <p className="text-xs text-muted-foreground mt-1">Registra a alguien y dale accesos</p>
                </div>
              </div>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-2 rounded-full hover:bg-muted text-muted-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-primary tracking-wider">Correo Electrónico</label>
                  <input 
                    type="email" 
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="correo@ejemplo.com"
                    className="w-full bg-muted/30 border-0 h-12 px-4 rounded-xl font-medium focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase text-primary tracking-wider">Contraseña Temporal</label>
                  <input 
                    type="text" 
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    placeholder="Mín. 6 caracteres..."
                    className="w-full bg-muted/30 border-0 h-12 px-4 rounded-xl font-medium focus:ring-2 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* Views Checklist para el Nuevo Usuario */}
              <div>
                <h4 className="font-bold mb-3 flex items-center gap-2">
                  <CheckSquareIcon className="w-4 h-4 text-emerald-500" />
                  Módulos Permitidos Iniciales
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {navItems.map((item) => {
                    const isChecked = newUserViews.includes(item.path);
                    return (
                      <label 
                        key={"new-" + item.path} 
                        className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isChecked ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-transparent border-border/50 hover:bg-muted/50'}`}
                        onClick={(e) => { e.preventDefault(); toggleNewUserView(item.path); }}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border shrink-0 transition-colors ${isChecked ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-transparent border-input'}`}>
                          {isChecked && <Check className="w-3.5 h-3.5 shadow-sm" strokeWidth={3} />}
                        </div>
                        <div className="flex items-center gap-2 truncate">
                          <item.icon className={`w-4 h-4 shrink-0 ${isChecked ? 'text-emerald-600' : 'text-muted-foreground'}`} />
                          <span className={`text-sm font-medium truncate ${isChecked ? 'text-foreground' : 'text-muted-foreground'}`}>{item.label}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
              
            </div>

            <div className="p-6 border-t border-border/50 bg-muted/20 flex justify-end gap-3">
              <button 
                onClick={() => setIsCreateModalOpen(false)} 
                className="px-5 py-2 text-sm font-bold text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleCreateUser} 
                disabled={isCreating}
                className="px-6 py-2 bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
              >
                {isCreating ? "Creando..." : "Registrar Usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper icon
const CheckSquareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
)
