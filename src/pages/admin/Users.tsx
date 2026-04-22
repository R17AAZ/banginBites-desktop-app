import React, { useState, useEffect } from 'react';
import { Card, } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import {
  Users,
  Search,
  Mail,
  Calendar,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Eye,
  MapPin,
  Phone,
  Shield,
  Clock
} from 'lucide-react';
import { AdminUserService } from '../../services/admin-user.service';
import { User as IUser } from '../../types/api';
import { useDialog } from '../../context/DialogContext';
import toast from 'react-hot-toast';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [meta, setMeta] = useState<any>(null);
  const dialog = useDialog();

  // Details Modal State
  const [detailsModal, setDetailsModal] = useState({
    isOpen: false,
    user: null as IUser | null
  });

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await AdminUserService.getUsers({
        searchTerm,
        role: roleFilter,
        status: statusFilter,
        page,
        limit
      });
      setUsers(res.data);
      setMeta(res.meta);
    } catch (error) {
      console.error('Failed to fetch users', error);
      toast.error('Could not load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, roleFilter, statusFilter, page]);

  const handleOpenConfirm = (user: IUser) => {
    handleToggleStatus(user);
  };

  const handleOpenDetails = (user: IUser) => {
    setDetailsModal({ isOpen: true, user });
  };

  const handleToggleStatus = async (user: IUser) => {
    const newStatus = user.status === 'ACTIVE' ? 'RESTRICTED' : 'ACTIVE';
    const action = newStatus === 'ACTIVE' ? 'unblock' : 'block';
    
    const confirmed = await dialog.confirm({
      title: newStatus === 'ACTIVE' ? 'Unblock Account?' : 'Restrict Account?',
      message: newStatus === 'ACTIVE' 
        ? `Do you want to re-activate ${user.name}'s access to the platform?`
        : `Are you sure you want to restrict ${user.name}? They will no longer be able to login or use the platform until activated.`,
      confirmText: newStatus === 'ACTIVE' ? 'Activate User' : 'Restrict User',
      variant: newStatus === 'ACTIVE' ? 'info' : 'danger'
    });

    if (!confirmed) return;

    try {
      setLoading(true); // Show loading overlay on table
      await AdminUserService.updateStatus(user.id, newStatus);
      toast.success(`User ${action}ed successfully`);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || `Failed to ${action} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900 tracking-tighter">User Management</h1>
          <p className="text-neutral-500 font-sans mt-1">Monitor, moderate, and manage all platform participants.</p>
        </div>
        <div className="flex gap-2">
          <Card className="flex items-center gap-4 py-2 px-4 shadow-sm border-neutral-100">
            <div className="text-right">
              <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest">Platform Users</p>
              <p className="text-xl font-bold text-brand">{meta?.total || 0}</p>
            </div>
            <Users className="text-brand/20" size={32} />
          </Card>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Input
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name, email..."
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => {
            setRoleFilter(e.target.value);
            setPage(1);
          }}
          className="bg-white border-neutral-200 rounded-xl px-4 py-2 font-bold text-sm text-neutral-700 outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="">All Roles</option>
          <option value="BUYER">Buyers</option>
          <option value="SELLER">Sellers</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="bg-white border-neutral-200 rounded-xl px-4 py-2 font-bold text-sm text-neutral-700 outline-none focus:ring-2 focus:ring-brand/20"
        >
          <option value="">All Statuses</option>
          <option value="ACTIVE">Active</option>
          <option value="RESTRICTED">Restricted</option>
        </select>
      </div>

      {/* Users Table */}
      <Card className="border-neutral-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-50/50 border-b border-neutral-100">
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">User</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Activity</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <Loader2 className="animate-spin text-brand mx-auto" size={32} />
                    <p className="text-sm text-neutral-400 mt-4 font-semibold">Fetching system users...</p>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-24 text-center">
                    <AlertCircle className="text-neutral-200 mx-auto" size={48} />
                    <p className="text-sm text-neutral-400 mt-4 font-semibold">No participants found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors group text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold relative overflow-hidden group-hover:scale-105 transition-transform border border-neutral-100">
                          {user.profile ? (
                            <img src={user.profile} alt={user.name} className="w-full h-full object-cover" />
                          ) : (
                            user.name?.[0] || 'U'
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900 leading-none mb-1">{user.name}</p>
                          <p className="text-[11px] text-neutral-500 font-sans flex items-center gap-1">
                            <Mail size={12} className="text-neutral-300" /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter",
                        user.role === 'SELLER' ? "bg-brand/10 text-brand" : "bg-blue-50 text-blue-600"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-xs text-neutral-600 font-semibold flex items-center gap-1">
                          <Calendar size={12} className="text-neutral-400" />
                          Joined {format(new Date(user.createdAt || Date.now()), 'MMM yyyy')}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {user.status === 'ACTIVE' ? (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                            <CheckCircle2 size={12} /> Live
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full uppercase">
                            <XCircle size={12} /> Blocked
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenDetails(user)}
                          className="h-8 w-8 p-0 text-neutral-400 hover:text-brand hover:bg-brand/5"
                        >
                          <Eye size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenConfirm(user)}
                          className={cn(
                            "h-8 text-[10px] font-bold uppercase tracking-widest",
                            user.status === 'ACTIVE' ? "text-red-500 hover:bg-red-50" : "text-green-600 hover:bg-green-50"
                          )}
                        >
                          {user.status === 'ACTIVE' ? 'Restrict' : 'Activate'}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {meta && meta.totalPages > 1 && (
          <div className="px-6 py-4 bg-neutral-50/50 border-t border-neutral-100 flex items-center justify-between">
            <p className="text-xs text-neutral-500 font-medium">
              Showing <span className="text-neutral-900 font-bold">{((page - 1) * limit) + 1}</span> to <span className="text-neutral-900 font-bold">{Math.min(page * limit, meta.total)}</span> of <span className="text-neutral-900 font-bold">{meta.total}</span> participants
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3"
                disabled={page === 1}
                onClick={() => setPage(prev => prev - 1)}
              >
                <ChevronLeft size={16} className="mr-1" /> Prev
              </Button>
              <div className="flex items-center px-4 font-bold text-sm text-neutral-900">
                {page} / {meta.totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-9 px-3"
                disabled={page === meta.totalPages}
                onClick={() => setPage(prev => prev + 1)}
              >
                Next <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* User Details Modal */}
      <Modal
        isOpen={detailsModal.isOpen}
        onClose={() => setDetailsModal({ isOpen: false, user: null })}
        title="User Particulars"
        maxW="max-w-xl"
      >
        {detailsModal.user && (
          <div className="space-y-8">
            <div className="flex items-center gap-6 pb-6 border-b border-neutral-100">
              <div className="w-24 h-24 rounded-2xl bg-neutral-100 overflow-hidden border border-neutral-100 shadow-sm">
                {detailsModal.user.profile ? (
                  <img src={detailsModal.user.profile} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-neutral-300 text-3xl font-bold">
                    {detailsModal.user.name?.[0]}
                  </div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-neutral-900 font-heading tracking-tight">{detailsModal.user.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    detailsModal.user.role === 'SELLER' ? "bg-brand/10 text-brand" : "bg-blue-50 text-blue-600"
                  )}>
                    {detailsModal.user.role}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest",
                    detailsModal.user.status === 'ACTIVE' ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                  )}>
                    {detailsModal.user.status}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-y-6 gap-x-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Mail size={12} /> Email Address
                </p>
                <p className="text-sm font-semibold text-neutral-700">{detailsModal.user.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Phone size={12} /> Contact Number
                </p>
                <p className="text-sm font-semibold text-neutral-700">{detailsModal.user.phone || 'Not provided'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Clock size={12} /> Member Since
                </p>
                <p className="text-sm font-semibold text-neutral-700">{format(new Date(detailsModal.user.createdAt || Date.now()), 'PPP')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield size={12} /> Verification Status
                </p>
                <p className="text-sm font-semibold text-neutral-700">{detailsModal.user.isVerified ? 'Verified' : 'Unverified'}</p>
              </div>
              <div className="col-span-2 space-y-1 pt-2">
                <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <MapPin size={12} /> Primary Address
                </p>
                <p className="text-sm font-semibold text-neutral-700 leading-relaxed">
                  {detailsModal.user.address ? (
                    typeof detailsModal.user.address === 'string'
                      ? detailsModal.user.address
                      : `${detailsModal.user.address.street}, ${detailsModal.user.address.city}, ${detailsModal.user.address.state} ${detailsModal.user.address.zipCode}`
                  ) : 'No address on file'}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-neutral-100">
              <Button
                variant="outline"
                className="w-full h-11 rounded-xl font-bold"
                onClick={() => setDetailsModal({ isOpen: false, user: null })}
              >
                Close Overview
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AdminUsers;
