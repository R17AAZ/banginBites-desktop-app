import React from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Rating } from '../../components/ui/Rating';
import { Input } from '../../components/ui/Input';
import { 
  Search, 
  MoreVertical, 
  Mail, 
  Phone, 
  TrendingUp, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';
import { cn } from '../../lib/utils';

const AdminSellers: React.FC = () => {
  const sellers = [
    { id: '1', name: 'The Burger Hub', email: 'burger@test.com', phone: '+1 234 567 890', joinDate: '2024-01-15', totalEarnings: '£12,450', status: 'ACTIVE', rating: 4.8 },
    { id: '2', name: 'Spicy Ramen Bar', email: 'ramen@test.com', phone: '+1 234 567 891', joinDate: '2024-02-10', totalEarnings: '£8,200', status: 'ACTIVE', rating: 4.5 },
    { id: '3', name: 'Green Salad Garden', email: 'salads@test.com', phone: '+1 234 567 892', joinDate: '2024-03-05', totalEarnings: '£3,150', status: 'PENDING', rating: 0.0 },
    { id: '4', name: 'Taco Town', email: 'tacos@test.com', phone: '+1 234 567 893', joinDate: '2024-03-20', totalEarnings: '£15,600', status: 'ACTIVE', rating: 4.9 },
    { id: '5', name: 'Dessert Heaven', email: 'sweets@test.com', phone: '+1 234 567 894', joinDate: '2024-04-01', totalEarnings: '£0', status: 'SUSPENDED', rating: 3.2 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'text-green-600 bg-green-50';
      case 'PENDING': return 'text-brand bg-brand-50';
      case 'SUSPENDED': return 'text-red-500 bg-red-50';
      default: return 'text-neutral-500 bg-neutral-50';
    }
  };

  return (
    <div className="space-y-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-neutral-900">Seller Management</h1>
          <p className="text-neutral-500 font-sans">View, approve, and monitor all platform vendors.</p>
        </div>
        <div className="flex items-center gap-3">
          <Input 
            placeholder="Search sellers..." 
            leftIcon={<Search size={18} />}
            className="w-72 bg-white"
          />
          <Button>
            Export CSV
          </Button>
        </div>
      </div>

      <Card className="flex-1 flex flex-col p-0 overflow-hidden border border-neutral-100">
        <div className="overflow-x-auto h-full">
          <table className="w-full text-left border-collapse h-full">
            <thead className="bg-neutral-50 sticky top-0 z-10">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Seller Info</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Join Date</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Total Earnings</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 bg-white">
              {sellers.map((seller) => (
                <tr key={seller.id} className="hover:bg-neutral-50 transition-colors group">
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-50 flex items-center justify-center text-brand font-bold text-sm">
                        {seller.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">{seller.name}</p>
                        <div className="flex items-center gap-1 mt-0.5">
                          <Rating rating={seller.rating} size="sm" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Mail size={14} className="text-neutral-400" />
                        {seller.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Phone size={14} className="text-neutral-400" />
                        {seller.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-neutral-600">
                    {seller.joinDate}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap font-bold text-neutral-900">
                    {seller.totalEarnings}
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider",
                      getStatusColor(seller.status)
                    )}>
                      {seller.status === 'ACTIVE' && <ShieldCheck size={14} />}
                      {seller.status === 'PENDING' && <AlertCircle size={14} />}
                      {seller.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <button className="p-2 text-neutral-400 hover:text-brand hover:bg-brand-50 rounded-lg transition-all">
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default AdminSellers;
